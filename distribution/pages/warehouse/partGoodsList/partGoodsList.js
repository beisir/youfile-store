// distribution/pages/warehouse/partGoodsList/partGoodsList.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodslList: [{name:'还是撒打算打算'}]
  },
  delGoods(){
    this.setData({
      delModal: true
    })
  }, 
  closeModal(){
    this.setData({
      delModal: false
    })
  },
  //手指触摸动作开始 记录起点X坐标
  touchstart: function (e) {
    //开始触摸时 重置所有删除
    let data = app.touch._touchstart(e, this.data.goodslList)
    this.setData({
      goodslList: data
    })
  },

  //滑动事件处理
  touchmove: function (e) {
    let data = app.touch._touchmove(e, this.data.goodslList)
    this.setData({
      goodslList: data
    })
  },
  getGoodsList(){
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      code: options.code
    },()=>{
      this.getGoodsList()
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