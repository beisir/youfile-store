import Api from '../../../../utils/api.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userId:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  getMession: function (data) {
    var _this = this
    Api.remakInfo(data)
      .then(res => {
        var obj = res.obj
        if (obj != null) {
          _this.setData({
            buyAmount: obj.buyCount.buyAmount,
            buyTimes: obj.buyCount.buyTimes,
            recentBuy: obj.buyCount.recentBuy,
            name: obj.storeCustomer.name,
            note: obj.storeCustomer.note,
            birthday: obj.storeCustomer.birthday,
            phone: obj.storeCustomer.phone,
            headPic: obj.storeCustomer.headPic,
            nickName: obj.storeCustomer.nickName,
            wechart: obj.storeCustomer.wechart,
          })
        }
      })
  },
  onLoad: function (options) {
    var accept = options.accept
    this.setData({
      userId: accept
    })
    this.getMession({ userId: accept})
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  urlHome: function () {
    wx.switchTab({
      url: '../../../page/home/home'
    })
  },
  passFunc: function () {

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