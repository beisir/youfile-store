import Api from '../../../utils/api.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    threeMonthMerchantTrade: '',
    threeMountSettle: '',
    todayMerchantTrade: '',
    waitingSettleAmount: '',
    yesterdayMerchantTrade:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  goRecord:function(){
    wx.navigateTo({
      url: '../record/record',
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  getTradeData:function(){
    var _this=this
    Api.getTrade().then(res=>{
      let obj=res.obj
      _this.setData({
        waitingSettleAmount: obj.waitingSettleAmount,
        todayMerchantTrade: obj.todayMerchantTrade,
        threeMonthMerchantTrade: obj.threeMonthMerchantTrade,
        yesterdayMerchantTrade: obj.yesterdayMerchantTrade,
        threeMountSettle: obj.threeMountSettle
      })
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getTradeData()
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