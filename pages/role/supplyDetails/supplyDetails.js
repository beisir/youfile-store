// pages/nopay/nopay.js
let orderCom = require('../order/orderCommon.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    status0: true,
    status1: true,
    status2: true,
    status3: true,
    status4: true,
    status5: true,
    reson: [{ title: "无法联系上买家", selected: true }, { title: "买家误拍或重拍", selected: false }, { title: "买家无诚意完成交易", selected: false }, { title: "缺货无法交易", selected: false }, { title: "其他", selected: false }],
    cancelIndex:0
  },


  // 监听输入
  watchInput(e) {
    let type = e.currentTarget.dataset.type;
    let key = "";
    switch (type) {
      case "change": key = 'changeMoney'; break;
      case "goodCode": key = "getGoodCode"; break;
      case "exCom": key = "expressageCom"; break;
      case "exCode": key = "expressageCode"; break;
    }

    this.setData({
      [key]: e.detail.value
    })
  },
  showModal(e) {
    let type = e.currentTarget.dataset.type;
    let num = e.currentTarget.dataset.num;
    let obj = {};
    switch (type) {
      case "change":
        obj = {
          changeModal: true,
          changeNum: num,
          changeMoney: ""
        }; break;
      case "goodCode":
        obj = {
          codeModal: true,
          testNum: num,
          getGoodCode: ""
        }; break;
      case "ex2":
        obj = {
          expressage: true,
          exNum: num,
          expressageCom: "",
          expressageCode: "",
          noBtn: true
        }; break;
      case "ex":
        obj = {
          expressage: true,
          exNum: num,
          expressageCom: "",
          expressageCode: "",
          noBtn: false
        }; break;
      case 'sureGet':
        obj = {
          sureModal: true,
          sureNum: num,
        }; break;
      case 'del':
        obj = {
          delModal: true,
          delNum: num
        }; break;
      case 'cancel':
        obj = {
          cancelModal: true,
          closeNum: num
        }; break;
    }
    this.setData(obj)
  },
  //查看凭证
  seeVoucher(e) {
    let num = e.currentTarget.dataset.num;
    app.http.getRequest("/admin/order/orderpayment/" + num).then((res) => {
      if (res.obj) {
        // wx.previewImage({
        //   current: current, // 当前显示图片的http链接
        //   urls: this.data.imgalist // 需要预览的图片http链接列表
        // })
      }
    })
  },

  // 验证取货码
  testCode() {
    let num = this.data.testNum;
    let money = this.data.getGoodCode;
    if (!money || money < 0) {
      wx.showToast({
        title: '请输入验证码',
        icon: 'none'
      })
      return
    }
    app.http.requestAll("/admin/order/" + num + "/claim", {
      orderNumber: num,
      claimGoodsNum: money
    }, "PUT").then((res) => {
      wx.showToast({
        title: res.message,
        icon: 'none'
      })
    })
  },

  // 取消订单
  sureCancel() {
    let num = this.data.closeNum,
      index = this.data.cancelIndex;
    app.http.requestAll("/admin/order/" + num + "/closed", {
      reason: this.data.reson[index].title
    }, "PUT").then((res) => {
      this.afterOperation();
      wx.showToast({
        title: res.message,
        icon: 'none'
      })
    })
  },
  //取消理由
  swichReason(e) {
    var current = e.currentTarget.dataset.current;
    var array = this.data.reson
    array.forEach((item, index, arr) => {
      if (current == index) {
        item.selected = true;
      } else {
        item.selected = false;
      }
    })
    this.setData({
      reson: array,
      cancelIndex: current
    })
  },

  // 我要发货
  // 待填表
  sendGoods(e) {
    let type = e.currentTarget.dataset.type,
      num = this.data.exNum,
      obj = {
        orderNumber: num
      };
    if (type == 'no') {
      //不填单发货
    } else {
      //填单发货
      obj.expressCompany = this.data.expressageCom;
      obj.expressNumber = this.data.expressageCode;
      if (!obj.expressNumber) {
        wx.showToast({
          title: "请填写运单号",
          icon: 'none'
        })
        return
      }
    }
    app.http.putRequest("/admin/order/" + num + "/addexpress", obj).then((res) => {
      this.afterOperation();
      wx.showToast({
        title: res.message,
        icon: 'none'
      })
    })

  },
  // 整体改价
  sureChange() {
    let num = this.data.changeNum;
    let money = this.data.changeMoney;
    if (!money || money < 0) {
      wx.showToast({
        title: '请输入金额',
        icon: 'none'
      })
      return
    }
    app.http.requestAll("/admin/order/" + num + "/updatetotal", {
      orderNumber: num,
      orderAmount: money
    }, "PUT").then((res) => {
      this.afterOperation();
      wx.showToast({
        title: res.message,
        icon: 'none'
      })
    })
  },
  //确认收款
  receiveMoney(e) {
    let num = this.data.sureNum;
    app.http.requestAll("/admin/order/orderpayment/" + num + "/confirm", {
      orderNumber: num
    }, "POST").then((res) => {
      wx.showToast({
        title: res.message,
        icon: 'none'
      })
      this.afterOperation();
    })
  },


  //刷新数据
  afterOperation() {
    this.closeModal();
    setTimeout(() => {
      this.getData();
    }, 800)
  },
  closeModal() {
    this.setData({
      changeModal: false,  //改价
      codeModal: false,  //取货码
      sureModal: false,  //收款
      delModal: false,  //删除
      cancelModal: false, //取消订单
      expressage: false, //发货
    })
  },

  //获取状态调整显示内容
  orderStatus(status, isForm) {
    switch (status) {
      case "unpaid":
        wx.setNavigationBarTitle({
          title: "待付款"
        })
        this.setData({
          status0: false
        })
        break;
      case "paid":
        wx.setNavigationBarTitle({
          title: "已付款"
        })
        this.setData({
          status1: false
        })
        break;
      case "shipped":
        if (isForm == 'unForm'){
            //未填单
          wx.setNavigationBarTitle({
            title: "已发货"
          })
          this.setData({
            status3: false,
          })
        }else{
          wx.setNavigationBarTitle({
            title: "已发货"
          })
          this.setData({
            status2: false,
          })
        }
        break;
      case "cancelled":

        break;
      case "closed":
        wx.setNavigationBarTitle({
          title: "已关闭"
        })
        this.setData({
          status5: false
        })
        break;
      case "finish":
        wx.setNavigationBarTitle({
          title: "已完成"
        })
        this.setData({
          status4: false
        })
        break;
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      status: options.status,
      num: options.num
    })

    // if (options.status == 0) {
    //   wx.setNavigationBarTitle({
    //     title: "待付款"
    //   })
    //   this.setData({
    //     status0: false
    //   })
    // } else if (options.status == 1) {
    //   wx.setNavigationBarTitle({
    //     title: "已付款"
    //   })
    //   this.setData({
    //     status1: false
    //   })
    // } else if (options.status == 2) {
    //   wx.setNavigationBarTitle({
    //     title: "已发货"
    //   })
    //   this.setData({
    //     status2: false,
    //   })
    // } else if (options.status == 3) {
    //   wx.setNavigationBarTitle({
    //     title: "已发货"
    //   })
    //   this.setData({
    //     status3: false,
    //   })
    // } else if (options.status == 4) {
    //   wx.setNavigationBarTitle({
    //     title: "已完成"
    //   })
    //   this.setData({
    //     status4: false
    //   })
    // } else if (options.status == 5) {
    //   wx.setNavigationBarTitle({
    //     title: "已关闭"
    //   })
    //   this.setData({
    //     status5: false
    //   })
    // }
  },
  //打电话
  tel: function () {
    wx.makePhoneCall({
      phoneNumber: '15010443530',
    })
  },


  getData() {
    app.http.getRequest("/api/order/byordernumber/" + this.data.num).then((res) => {
      // this.setData({
      //   order: res.obj
      // })
      console.log(orderCom)
      this.setData({
        'order.createDate': orderCom.timeFormat(this.data.order.createDate),
        'order.payDate': orderCom.timeFormat(this.data.order.payDate),
        'order.finishTime': orderCom.timeFormat(this.data.order.finishTime),
      })
    })
    this.setData({
      order: {
        "goodsInfos": [
          {
            "orderDetails": [
              {
                "id": 53,
                "orderDetailNumber": "201809071509355464096",
                "orderNumber": "1037961561102090240",
                "skuCode": "180831183155243d4de6_793",
                "goodsId": "180831183155243d4de6",
                "goodsName": " BR4066 L码",
                "num": 2,
                "unitPrice": 500,
                "amount": 1000,
                "marketPrice": 500,
                "sellPrice": 500,
                "wholesalePrice": 300,
                "cover": null,
                "goodsDesc": null
              },
              {
                "id": 54,
                "orderDetailNumber": "201809071509355474096",
                "orderNumber": "1037961561102090240",
                "skuCode": "180831183155243d4de6_8a1",
                "goodsId": "180831183155243d4de6",
                "goodsName": "短袖T恤",
                "num": 2,
                "unitPrice": 600,
                "amount": 1200,
                "marketPrice": 600,
                "sellPrice": 600,
                "wholesalePrice": 400,
                "cover": null,
                "goodsDesc": null
              }
            ],
            "goodsId": "180831183155243d4de6",
            "goodsName": "阿迪达斯ADIDAS 2018夏季",
            "goodEnName": "adidas",
            "mainImgUrl": "http://img2.imgtn.bdimg.com/it/u=1758226492,603315287&fm=214&gp=0.jpg"
          }
        ],
        "storeInfo": {
          "storeId": "123",
          "storeName": "三只松鼠",
          "storeEnName": "three",
          "logo": "松鼠logo",
          "merchantNumber": "04958613",
          "openingTime": "7:00-15:00",
          "servicePhone": "18231565894",
          "wechatNumber": "wechart1",
          "address": "北京海淀"
        },
        "userInfo": {
          "userId": "2a9153bffb2bdcf5cedc92019fbba79b",
          "userName": "16888888888",
          "nickName": "youkedmin"
        },
        "receiveMerchant": {
          "merchantNumber": "04958613"
        },
        "receiptInfo": null,
        "postageinfo": {
          "postageType": "0",
          "postagePrice": 10
        },
        "consigneeInfo": {
          "provinceCode": null,
          "province": null,
          "cityCode": null,
          "city": null,
          "countyCode": null,
          "county": null,
          "detailAddress": "北京市朝阳区望京sohu t1 502",
          "userName": "老王",
          "userPhone": "8888888888",
          "postCode": "00000"
        },
        "id": 33,
        "orderNumber": "1037961561102090240",
        "orderAmount": 2210,
        "timeoutExpress": 72,
        "timeoutExpressType": "hour",
        "timeoutExpressSecond": 2592000,
        "timeoutDate": 1538896295000,
        "orderStatus": "cancelled",
        "orderStatusChildSta": "cancelled",
        "userMemo": "请尽快出货",
        "num": 4,
        "totalRefundAmount": null,
        "totalRefundTimes": null,
        "bizSystemNo": "00",
        "payAmount": null,
        "payDate": null,
        "payWay": null,
        "sort": 0,
        "orderType": "2",
        "orderCategory": "3",
        "claimGoodsNum": null,
        "cancelReason": "不想要了",
        "closedReason": null,
        "expressStatus": null,
        "expressNumber": null,
        "expressCompany": null,
        "createDate": 1536304295000,
        "finishTime": null
      }
    })
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
    this.getData();
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})