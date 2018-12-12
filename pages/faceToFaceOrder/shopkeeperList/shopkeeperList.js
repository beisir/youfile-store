// pages/faceToFaceOrder/customerOrderList/customerOrderList.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nav: [{ name: "全部", type: "all", checked: true }, { name: "待付款", type: "unpaid", checked: false }, { name: "已完成", type: "finish", checked: false }],
    list: [{
      name: "我的你",
      type: "cancelled",
      tip: ["123", "chaju", "chaju", "chaju", "chaju", "chaju", "chaju", "chaju", "chaju", "chaju", "chaju", "chaju", "chaju", "chaju", "chaju", "chaju", "chaju", "chaju", "chaju", "chaju"],
      price: 102220,
      icon: "/image/cloudStoreIcon.png",
    }]
  },

  switchNav(e) {
    let type = e.currentTarget.dataset.type;
    let arr = this.data.nav;
    arr.forEach(el => {
      if (el.type == type) {
        el.checked = true
      } else {
        el.checked = false
      }
    })
    this.setData({
      nav: arr
    })
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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