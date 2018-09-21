import Api from '../../../utils/api.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showHide: true,
    countData: '',
    floor: '',
    storeMes: [],
    storeGoods: [],
    logo:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this
    Api.storeIdInfo()
      .then(res => {
        var obj = res.obj
        console.log(obj)
        _this.setData({
          countData: obj.countData,
          floor: obj.floor.floorInfo,
          storeMes: obj.store[0].store,
          storeGoods: obj.store[0].goodsList,
          logo: obj.store[0].store.logo
        })
      })
  },
  editFun: function () {
    this.setData({
      showHide: false,
    })
  },
  closeShow: function () {
    this.setData({
      showHide: true,
    })
  },
  chooseImage: function () {
    var _this = this
    Api.uploadImage("STORE")
      .then(res => {
        var url = JSON.parse(res).obj
        _this.setData({
          coverUrl: url
        })
        Api.uploadLogoImg({logo:url})
          .then(res => {
            wx.showToast({
              title: res.message,
              icon: 'none',
              duration: 1000,
              mask: true,
              success: function () {
                _this.closeShow()
              }
            })
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