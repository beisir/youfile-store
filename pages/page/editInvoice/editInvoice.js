// pages/page/editInvoice/editInvoice.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    switch1Change: true,
    data: [{ name: "个人发票", selected: false }, { name: "提供增值税普通发票", selected: false }, { name: "提供增值税专用发票", selected: false }]
  },
  switch1Change: function (e) {
    console.log(e.detail.value)
    // var code = this.data.switch1Change
    // this.setData({
    //   switch1Change:!code
    // })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var code = options.code,
      name=options.name
    this.setData({
      switch1Change:code
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