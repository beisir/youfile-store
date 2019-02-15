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
    tradeAmount:false,//今日收款
    tradeCounts: false,//收款总金额
    threeMountSettles: false,//已结算金额
    yesterdayMerchantTrades: false,//昨日收款
    waitingSettleAmounts: false,//待结算金额
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
  // 今日收款提示
  tradeAmount(){
    this.setData({
      tradeAmount:true
    })
  },
  tradeCounts(){
    this.setData({
      tradeCounts:true
    })
  },
  yesterdayMerchantTrades() {
    this.setData({
      yesterdayMerchantTrades: true
    })
  },
  threeMountSettles() {
    this.setData({
      threeMountSettles: true
    })
  },
  waitingSettleAmounts() {
    this.setData({
      waitingSettleAmounts: true
    })
  },
  // 关闭弹框
  closeBtn(){
    this.setData({
      tradeAmount: false,
      tradeCounts: false,
      yesterdayMerchantTrades: false,
      threeMountSettles: false,
      waitingSettleAmounts:false,
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