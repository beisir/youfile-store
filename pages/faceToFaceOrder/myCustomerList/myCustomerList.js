// pages/faceToFaceOrder/myCustomerList/myCustomerList.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nav: [{ name: "关注用户", type: "all", checked: true }, { name: "进货商", type: "unpaid", checked: false }, { name: "成交客户", type: "finish", checked: false }],
    list: [{ name: "123" }, { name: "方小鱼Funny" }],
    checkedNav: { name: "关注用户", type: "all", checked: true }
  },
  switchNav(e) {
    let type = e.currentTarget.dataset.type;
    let arr = this.data.nav;
    arr.forEach(el => {
      if (el.type == type) {
        el.checked = true
        this.setData({
          checkedNav:el
        })
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