// distribution/pages/purchase/outHouseLogistics/outHouseLogistics.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseUrl: app.globalData.imageUrl
  },
  showHide(e){
    this.setData({
      ['list[' + e.currentTarget.dataset.index + '].hide']: !this.data.list[e.currentTarget.dataset.index ].hide
    })
  },
  watchinput(e){
    let type = e.currentTarget.dataset.type,
        thisIndex = e.currentTarget.dataset.index
    this.setData({
      
    })    
  },  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('sendSkuData', (data)=> {
      this.setData({
        list: data.list.outDetailsList
      })
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