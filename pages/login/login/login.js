const loginApp = getApp();
import API from '../../../utils/api.js';
Component({
  properties: {
    // 这里定义了innerText属性，属性值可以在组件使用时指定
    closeBtnType: {
      type: String,
      value: '',
    }
  },
  data: {
    // 登录显示界面
    loginChoseTypeModal: true,
    // 验证码界面
    getCodeModal: false,
    inputFocus: false,  //输入框
    codearr: ["", "", "", ""],
    reSendCode: false,
    //登录头信息
    loginTitle: '快捷登录',
    //界面显示隐藏
    pageShow: false,
    //获取验证码按钮
    buttonTimer: "获取验证码",
    btnSec: '60',
    disabled: false,
    //电话
    telephone: "",
    //验证码
    verificationCode: "",
    //密码
    password: '',
    //切换登录方式 code pass
    loginType: 'code',
    //密码是否可见
    ifhide: true,
    //密码图片src
    see: '/image/pass-hide.png',
    //忘记密码
    forget: false,
    //登录按钮样式class
    btnID: "loginBtnDis",
    //关注
    attention: true
  },
  methods: {
    // 获取用户信息
    getWXUserInfo(data) {
      this.login()
    },
    // 输入验证码
    getFocus() {
      this.setData({ inputFocus: true })
    },
    coolCode(e) {
      var value = e.detail.value;
      if (value.length >= 4) {
        this.setData({ verificationCode: value.substr(0, 4) })
      } else {
        this.setData({ verificationCode: value })
      }
      let arr = [
        value[0] ? value[0] : "",
        value[1] ? value[1] : "",
        value[2] ? value[2] : "",
        value[3] ? value[3] : "",
      ]
      this.setData({ codearr: arr })
      this.checkComplete();
    },
    // 微信授权登录
    getPhoneNumber(e) {
      // 区分授权按钮种类
      let btnType = e.target.dataset.type
      if (e.detail.iv && e.detail.encryptedData) {
        wx.checkSession({
          success: (res) => {
            this.getMyPhone(e.detail.iv, e.detail.encryptedData, this.data.code, btnType)
          },
          fail: function (res) {
            // 微信code过期
            wx.login({
              success: function (res) {
                this.getMyPhone(e.detail.iv, e.detail.encryptedData, res.code, btnType)
              },
              fail: function (res) { },
              complete: function (res) { },
            })
          },
          complete: function (res) { },
        })
      }
    },
    // 不同获取手机号场景
    switchGetPhoneWay(data, btnType) {
      if (data.phoneNumber) {
        this.setData({ telephone: data.phoneNumber })
        if (btnType == 'wxLogin') {
          // 微信一键登录
          this.setData({ getCodeModal: true, loginType: 'code' })
          this.getCode()
        } else {
          // 正常登录
        }
      } else {
        API.showToast('获取手机号码失败，请手动填写')
      }
    },
    // 解密手机号
    getMyPhone(iv, encryptedData, code, btnType) {
      let obj = {
        iv,
        encryptData: encryptedData,
        jsCode: code
      }
      API.getMyWXPhone(obj).then(res => {
        let data = JSON.parse(res.obj)
        this.switchGetPhoneWay(data, btnType)

        wx.login({
          success: (res) => {
            if (res.code) {
              this.setData({
                code: res.code
              })
            }
          }
        })
      })
    },
    touserLogin() {
      this.setData({ loginChoseTypeModal: false })
    },
    // 自动关注
    attentionStore() {
      this.setData({
        attention: !this.data.attention
      })
    },
    //判断是否输入完整
    checkComplete() {
      if (this.data.loginType === 'code') {
        if (this.data.telephone.length > 0 && this.data.verificationCode.length >= 4) {
          this.setData({
            btnID: 'loginBtnAc'
          })
          return
        }
      } else {
        if (this.data.telephone.length > 0 && this.data.password.length >= 6) {
          this.setData({
            btnID: 'loginBtnAc'
          })
          return
        }
      }
      this.setData({
        btnID: 'loginBtnDis'
      })
    },
    //忘记密码
    forgetPass() {
      this.setData({
        forget: true,
        password: "",
        verificationCode: ""
      })
    },
    //忘记密码修改新密码
    creatNewPassword() {
      if (!this.testTel()) {
        API.showToast('请输入正确手机号码')
        return;
      }
      if (this.data.verificationCode.length == 0) {
        API.showToast('请输入验证码')
        return;
      }
      if (this.data.password.length < 6 || this.data.password.length > 16) {
        API.showToast('密码必须是6 - 16位的数字或字母')
        return
      }
      let obj = {
        mobile: this.data.telephone,
        password: this.data.password,
        smsCode: this.data.verificationCode
      }
      API.resetPassword(obj).then(res => {
        API.showToast(res.message)
        this.setData({
          forget: false,
          password: "",
          verificationCode: ""
        })
      }).catch(e => {
        API.showToast(e.data.message)
      })
    },
    //登录
    login() {
      if (this.data.stopLoginBtn) {
        return
      }
      // if (this.data.btnID === 'loginBtnDis') {
      //   API.showToast('请填写完整')
      //   return;
      // }
      //校验
      if (!this.testTel()) {
        API.showToast('请输入正确手机号码')
        return;
      }
      if (this.data.loginType == 'code') {
        if (this.data.verificationCode.length == 0) {
          API.showToast('请输入验证码')
          return;
        }
        let obj = {
          mobile: this.data.telephone.trim(),
          smsCode: this.data.verificationCode
        };

        this.setData({
          stopLoginBtn: true
        })

        loginApp.authHandler.loginByMobile(this.data.telephone, this.data.verificationCode).then(res => {
          //关注
          if (this.data.attention) {
            API.likeStore().then(res => {
              loginApp.globalData.switchStore = true
            });
          }
          this.loginAfter(res);
        }).catch(e => {
          this.setData({
            stopLoginBtn: false
          })
        })


      } else {

        if (this.data.password.length < 6 || this.data.password.length > 16) {
          API.showToast('密码必须是6 - 16位的数字或字母')
          return
        }

        let obj = {
          grant_type: 'password',
          username: this.data.telephone.trim(),
          password: this.data.password
        };

        this.setData({
          stopLoginBtn: true
        })

        loginApp.authHandler.loginByUser(this.data.telephone, this.data.password).then(res => {
          this.loginAfter(res);
        }).catch(e => {
          this.setData({
            stopLoginBtn: false
          })
        })
      }

    },
    loginAfter(res) {
      this.setData({
        stopLoginBtn: false
      })
      if (res.message) {
        API.showToast(res.message)
        return
      }
      if (res.access_token) {
        this.closePage()
        setTimeout(()=>{
          API.showToast("登录成功")
        },500)
        // 存储微信信息
        this.saveWXmsg()
      }
    },
    saveWXmsg() {
      API.hasSavedWXmsg().then(res => {
        if (res.obj === false) {
          wx.getUserInfo({
            success: (res) => {
              API.saveWXmsg({
                avatarUrl: res.userInfo.avatarUrl,
                gender: res.userInfo.gender,
                nickName: res.userInfo.nickName
              }).then(res => {
                this.refreshPage()
              })
            },
            fail: (e) => {
              this.refreshPage()
            }
          })
        } else {
          this.refreshPage()
        }
      })
    },
    refreshPage() {
      let pages = getCurrentPages();
      let curPage = pages[pages.length - 1];
      curPage.onLoad();
      curPage.onShow();
    },
    //显示隐藏密码
    showHide() {
      let b = !this.data.ifhide;
      this.setData({
        ifhide: b
      })
      if (b) {
        this.setData({
          see: '/image/pass-hide.png'
        })
      } else {
        this.setData({
          see: '/image/pass-show.png'
        })
      }
    },
    //改变登录方式
    changeLoginType() {
      this.setData({
        verificationCode: "",
        password: '',
        btnID: 'loginBtnDis'
      })
      if (this.data.loginType === 'code') {
        this.setData({
          loginType: 'pass',
          loginTitle: "账号登录"
        })
      } else if (this.data.loginType === 'pass') {
        this.setData({
          loginType: 'code',
          loginTitle: "快捷登录"
        })
      }
    },
    //存入手机号
    savePhone(e) {
      this.setData({
        telephone: e.detail.value
      })
      this.checkComplete();
    },
    //存入验证码
    saveCode(e) {
      this.setData({
        verificationCode: e.detail.value
      })
      this.checkComplete();
    },
    //存入密码
    savePass(e) {
      this.setData({
        password: e.detail.value
      })
      this.checkComplete();
    },
    //获取验证码
    getCode() {
      if (!this.testTel()) {
        API.showToast('请输入正确手机号码')
      } else {
        if (!this.data.disabled){
          API.phoneMessage({
            mobile: this.data.telephone
          }).then(res => {

          })
        }
        // loginApp.http.getRequest("/oauth/code/sms", {
        //   mobile: this.data.telephone
        // }).then(res => {

        // })

        //获取验证码倒计时
        let sec = this.data.btnSec;
        this.setData({
          buttonTimer: sec + "s",
          disabled: true,
          reSendCode: false
        })
        let timer = setInterval(() => {
          sec--;
          this.setData({
            buttonTimer: sec + "s",
            btnSec: sec
          })

          if (sec <= 1) {
            clearInterval(timer)
            this.setData({
              reSendCode: true,
              buttonTimer: "获取验证码",
              btnSec: 60,
              disabled: false
            })
          }
        }, 1000)
      }
    },
    testTel() {
      let phone = this.data.telephone.trim();
      if (!phone || phone.trim().length != 11 || !/^1[3|4|5|6|7|8|9]\d{9}$/.test(phone)) {
        return false;
      }
      return true;
    },
    closePageBtn() {
      this.closePage()
      if (this.data.closeBtnType) {
        switch (this.data.closeBtnType) {
          case 'quit':
            wx.navigateBack()
            break;
          case 'tohome':
            wx.switchTab({
              url: '../../page/home/home'
            })
            break;
        }
      }
    },
    closePage() {
      loginApp.globalData.notOnshow = false
      this.setData({
        loginChoseTypeModal: true,
        getCodeModal: false,
        codearr: ["", "", "", ""],
        reSendCode: false,
        pageShow: false,
        forget: false,
        telephone: "",
        password: "",
        verificationCode: "",
        loginType: 'code',
        btnID: 'loginBtnDis'
      })
      clearInterval(this.data.closetimer)
    },
    showPage() {
      loginApp.globalData.notOnshow = true
      this.setData({
        pageShow: true
      })
      wx.login({
        success: (res) => {
          if (res.code) {
            this.setData({
              code: res.code
            })
          }
        },
        fail: function (res) { },
        complete: function (res) { },
      })
      let closetimer = setInterval(() => {
        let token = wx.getStorageSync('access_token')
        if (token) {
          this.closePage()
          clearInterval(this.data.closetimer)
        }
      }, 1000)
      this.setData({ closetimer })
    }
  }
})