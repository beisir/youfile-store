import Api from '../../../utils/api.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    waitPass:0,
    waitVerify:0,
    merchantNumber:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  getInfo:function(){
    var _this=this
    Api.index()
    .then(res=>{
      var obj=res.obj
      _this.setData({
        waitPass: obj.waitPass,
        waitVerify: obj.waitVerify,
        merchantNumber: obj.merchantNumber
      })
    })
  },
  onLoad: function (options) {
    this.getInfo()
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
  addWholesaler:function(){
    wx.navigateTo({
      url: '../addWholesaler/addWholesaler',
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