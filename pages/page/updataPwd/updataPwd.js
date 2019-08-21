// pages/updataPwd/updataPwd.js
const app = getApp();
import API from '../../../utils/api.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //获取验证码按钮
    buttonTimer: "获取验证码",
    btnSec: '60',
    disabled: false,
    pass:'',
    code:''
  },
  watchInput(e) {
    let val = e.detail.value,
      type = e.currentTarget.dataset.type,
      obj = {};

    switch (type) {
      case "code":
        obj = {
          code: val
        }
        break;
      case "pass":
        obj = {
          pass: val
        }
        break;
    }
    this.setData(obj);
  },
  sure() {
    let code = this.data.code,
      pass = this.data.pass;
    if (!code){
      API.showToast('请输入验证码')
      return
    }
    if (pass.length < 6 || pass.length > 16) {
      API.showToast('密码长度应为6 - 16位')
      return
    }

    let obj = {
      mobile: this.data.telephone,
      password: this.data.pass,
      smsCode: this.data.code
    }
    API.resetPassword(obj).then(res => {
      API.showToast(res.message)
      this.setData({
        forget: false,
        pass: "",
        code: ""
      })
      setTimeout(()=>{
        wx.navigateBack()
      },800)
    }).catch(e => {
      API.showToast(e.data.message)
    })
    
  },
  getUserInfo(){
    API.getUserInfo().then(res => {
      let telephone = res.obj.mobile;
      if (telephone){
        this.setData({telephone})
      }
    })
  },
  //获取验证码
  getCode() {
    if (!this.testTel()) {
      API.showToast('未获取到您的手机号')
    } else {
      API.phoneMessage({
        mobile: this.data.telephone
      }).then(res => {

      })

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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getUserInfo()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

})