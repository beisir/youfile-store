// pages/userdetails/userdetails.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sexData: [{ sex: "男" }, { sex: "女" }, { sex: "保密" }],
    sex:'男',
    show:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },
  updataSex(e){
    this.setData({
      show:false
    })
  },
  closeShow(e) {
    this.setData({
      show: true
    })
  },
  choseSex(e){
    var text=e.target.dataset.text.sex
    this.setData({
      sex:text,
      show:true
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