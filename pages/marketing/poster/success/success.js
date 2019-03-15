// pages/marketing/poster/success/success.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    img:[{
      src: "http://tmp/wx4f385374765e4cbb.o6zAJs-kGTgoiFXZrqhWi48KGzfM.SRJK1jf4ytiq223dc46bde31de385a1860a89d511fa0.png"
    }, {
        src: "http://tmp/wx4f385374765e4cbb.o6zAJs-kGTgoiFXZrqhWi48KGzfM.SRJK1jf4ytiq223dc46bde31de385a1860a89d511fa0.png"
      },{
        src: "http://tmp/wx4f385374765e4cbb.o6zAJs-kGTgoiFXZrqhWi48KGzfM.SRJK1jf4ytiq223dc46bde31de385a1860a89d511fa0.png"
      }, {
        src: "http://tmp/wx4f385374765e4cbb.o6zAJs-kGTgoiFXZrqhWi48KGzfM.SRJK1jf4ytiq223dc46bde31de385a1860a89d511fa0.png"
      }],
    current:0
  },
  showImg(){

  },
  changeImg(e){
    this.setData({current:e.detail.current})
  },
  pre(){
    let current = this.data.current;
    if (current>0){
      this.setData({ current: current-1})
    }
  },
  next(){
    let current = this.data.current;
    if (current < this.data.img.length-1) {
      this.setData({ current: current + 1 })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      // img: options.url
    })
    this.showImg()
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