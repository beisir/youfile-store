// pages/derm/derm.js
const app = getApp();
import Api from '../../../utils/api.js';
const util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user: {}
  },

  getUser() {
    app.http.getRequest("/api/user/byuserid").then((res) => {
      if (res.success) {
        this.setData({
          user: res.obj,
          hasUser: true
        })
      }
    }).catch(e => {
      this.setData({
        user: {},
        hasUser: false
      })
    })
  },
  saveImg() {
    if (this.data.user.qrcode) {
      let imgUrl = this.data.baseUrl + this.data.user.qrcode;
      util.saveImgToPhone(imgUrl)     
    } else {
      Api.showToast('暂无二维码')
    }
  },
  share() {
    wx.showShareMenu({
      withShareTicket: true
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      baseUrl: app.globalData.imageUrl
    })
    this.getUser();
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
  onShareAppMessage: function (res) {
    let id = wx.getStorageSync("storeId");
    if (id) {
      return {
        path: "pages/page/home/home?storeId=" + id
      }
    } else {
      Api.showToast('请进入店铺，再分享给好友')
    }
  }
})