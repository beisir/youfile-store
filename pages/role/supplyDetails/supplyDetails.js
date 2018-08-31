// pages/nopay/nopay.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    carts: [
      { id: 1, title: '周大福 绝色系列 热情似火 18K金镶红宝石钻...', price: '1200', small: '约1.66mm*0.23cm', image: '/image/s5.png', num: 4, selected: true, attribute: [{ name: "金镶h红宝石", weight: "600g", num: 5, mon: 787.00 }, { name: "金镶h红宝石", weight: "600g", num: 5, mon: 787.00 }, { name: "金镶h红宝石", weight: "600g", num: 5, mon: 787.00 }] }
    ],
    status0: true,
    status1: true,
    status2: true,
    status3: true,
    status4: true,
    status5: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.status == 0) {
      wx.setNavigationBarTitle({
        title: "待付款"
      })
      this.setData({
        status0: false
      })
    } else if (options.status == 1) {
      wx.setNavigationBarTitle({
        title: "已付款"
      })
      this.setData({
        status1: false
      })
    } else if (options.status == 2) {
      wx.setNavigationBarTitle({
        title: "已发货"
      })
      this.setData({
        status2: false,
      })
    } else if (options.status == 3) {
      wx.setNavigationBarTitle({
        title: "已发货"
      })
      this.setData({
        status3: false,
      })
    } else if (options.status == 4) {
      wx.setNavigationBarTitle({
        title: "已完成"
      })
      this.setData({
        status4: false
      })
    } else if (options.status == 5) {
      wx.setNavigationBarTitle({
        title: "已关闭"
      })
      this.setData({
        status5: false
      })
    }
  },
  //打电话
  tel: function () {
    wx.makePhoneCall({
      phoneNumber: '15010443530',
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