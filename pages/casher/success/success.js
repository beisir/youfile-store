// pages/casher/success/success.js
const app = getApp();
import Api from "../../../utils/api.js"
import { indexUrl } from "../../../utils/const.js";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    globalData: app.globalData,
    returnModal: false,
    secTime: 3,
    waitStatus: true
  },
  afterPay() {
    if (this.data.waitStatus) {
      return
    }
    switch (this.data.type) {
      case "cloudXPL":
      case "cloudXLS":
        this.cloudPay();
        break;
      case 'ftfOrder':
        this.ftfPay();
        break;  
      case "listOrder":
      case "normalOrder":
        this.orderPay();
      break;
      default:
        this.toUser();
      break;

    }
  },
  // 小云店订单
  cloudPay() {
    let type = this.data.type;
    // let type = this.data.user.storeNature;
    let env = app.globalData.projectType;
    if (type == "cloudXPL") {
      //新批零
      if (env == 'xpl') {
        let toID = this.data.user.storeId;
        if (toID) {
          wx.setStorageSync("storeId", toID)
          app.globalData.switchStore = true;
          wx.switchTab({
            url: "../../page/user/user",
          })
        }
      } else {
        this.setData({
          toStatus: "xpl",
          returnModal: true,
          storeId: this.data.user.storeId
        })
      }
    } else if (type == "cloudXLS") {
      //新零售
      if (env == 'xls') {
        let toID = this.data.user.storeId;
        if (toID) {
          wx.setStorageSync("storeId", toID)
          app.globalData.switchStore = true;
          wx.switchTab({
            url: "../../page/user/user",
          })
        }
      } else {
        this.setData({
          toStatus: "xls",
          returnModal: true,
          storeId: this.data.user.storeId
        })
      }
    }
  },
  
  toMyStoreXPl() {
    app.navigate.toInit(app.globalData.navigateToAppID.xpl, this.data.storeId).then(res=>{
      this.toUser();
    })
  },
  toMyStoreXLS() {
    app.navigate.toInit(app.globalData.navigateToAppID.xls, this.data.storeId).then(res => {
      this.toUser();
    })
  },

  // 门店订单按钮处理
  ftfPay() {
    wx.redirectTo({
      url: '../../faceToFaceOrder/customerOrderDetail/customerOrderDetail?code=' + this.data.num
    })
  },
  // 普通订单跟进货单
  orderPay(){
    wx.redirectTo({
      url: '../../page/allOrder/allOrder?num='+this.data.num
    })
  },

  getUser() {
    Api.userInfor().then(res => {
      if (res.obj) {
        this.setData({
          user: res.obj
        })
      }
    })
  },
  toUser() {
    wx.switchTab({
      url: "/pages/page/home/home",
    })
  },
  //倒计时
  startTimeout() {
    wx.showLoading({
      title: this.data.loadText ? this.data.loadText : '加载中',
    })
    let sec = this.data.secTime;
    let timmer = setInterval(() => {
      sec--
      if (sec == 0) {
        wx.hideLoading();
        clearInterval(timmer);
        this.afterTimer();
        Api.userInfor().then(res => {
          if (res.obj) {
            this.setData({
              user: res.obj
            })
            this.setData({
              waitStatus: false
            })
          }
        })
      }
    }, 1000)
  },
  afterTimer() {
    switch (this.data.type) {
      case "cloudXPL":
      case "cloudXLS":
        wx.navigateTo({
          url: '../../cloudOrder/webInitStore/webInitStore',
        })
        break;
    }
  },
  switchType() {
    let obj = {};
    switch (this.data.type) {
      case "cloudXPL":
      case "cloudXLS":
        obj.btnText = '开启' + app.globalData.projectName + '之旅';
        obj.loadText = "正在开启哦~";
        break;
      case "listOrder":
        obj.loadText = "进货单处理中";
        break;
      case "normalOrder":
        obj.loadText = "订单处理中";
        break;  
      case "ftfOrder":
        obj.loadText = "门店订单处理中";
        break;    
    }
    this.setData(obj)
  },

  //获取订单详情
  getDetail() {
    app.authHandler.getTokenOrRefresh().then(token => {
      if (token) {
        wx.request({
          url: indexUrl + '/api/cashier/index/' + this.data.num,
          method: 'GET',
          header: {
            "Authorization": token
          },
          success: res => {
            let type = false
            try{
              //订单分类[1 进货单|2 店订单|3 普通订单|4 门店订单]
              switch (res.data.obj.orderCategory) {
                case "1":
                  type = 'listOrder'
                  break;
                case "2":

                  break;
                case "3":
                  type = 'normalOrder'
                  break;
                case "4":
                  type = 'ftfOrder'
                  break;
                default:
                  type = "none"
                  break;
              }
            }catch(e){}
            
            if (type) {
              this.setData({ type })
            }

            this.switchType();
            this.startTimeout();
          },
          fail: e => {

          }
        })

      }
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      type: options.type ? options.type : "",
      price: options.price ? options.price : false,
      num: options.num
    })
    this.getDetail();
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})