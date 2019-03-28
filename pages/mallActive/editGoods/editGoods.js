// pages/mallActive/editGoods/editGoods.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsId:"181105902000",
    showFrame: true

  },
  // 关闭弹框
  closeFrame:function(){
    this.setData({
      showFrame: true
    })
  },
  // 折扣
  discountGoods:function(){
    this.setData({
      showFrame: false
    })
  },
  // 选择规格
  choiceSpec:function(){
    wx.navigateTo({
      url: '../choseSpec/choseSpec',
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
    wx.setNavigationBarTitle({
      title: '活动商品设置',
    })
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