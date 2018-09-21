import Api from '../../../utils/api.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    province: '',
    city: '',
    area: '',
    show: false,
    value:'',
    id: wx.getStorageSync("storeId"),
    baseUrl: wx.getStorageSync('baseUrl'),
  },
  //城市选择
  sureSelectAreaListener: function (e) {
    var that = this;
    that.setData({
      show: false,
      province: e.detail.currentTarget.dataset.province,
      city: e.detail.currentTarget.dataset.city,
      area: e.detail.currentTarget.dataset.area
    })
  },
  chooseAddress: function () {
    var that = this;
    that.setData({
      show: true
    })
  },
  watchInput:function(e){
    var value=e.detail.value
    this.setData({
      value:value
    })
  },
 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      area: options.county,
      province: options.province,
      city: options.city,
      value:options.address
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
    var value = this.data.value,
      province = this.data.province,
      city = this.data.city,
      area = this.data.area,
      id = this.data.id
    Api.updateMes({ address: value, id: id, province: province, city: city, county: area })
      .then(res => {
        wx.showToast({
          title: '修改成功',
          icon: 'none',
          duration: 2000,
          success: function () {
            wx.navigateTo({
              url: '../mesEdit/mesEdit',
            })
          }
        })
      })
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