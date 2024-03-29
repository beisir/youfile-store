import Api from '../../../utils/api.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    region: [],
    show: false,
    value:'',
    baseUrl: wx.getStorageSync('baseUrl'),
    platformIos:true
  },
  bindRegionChange: function (e) {
    this.setData({
      region: e.detail.value
    })
  },
  watchInput:function(e){
    var value=e.detail.value,
      num = value.length
    if (num > 51) {
      Api.showToast("超过最长数字限制")
    }
    this.setData({
      value: value.substring(0, 50),
    })
  },
 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      region: [options.province, options.city, options.county],
      value: options.address == '请填写地址' ? '' : options.address
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
  // 判断手机是ios还是安卓
  getIsIos() {
    var phone = wx.getSystemInfoSync()
    var _this = this
    if (phone.platform == 'ios') {
      _this.setData({
        platformIos: true
      })
    } else {
      _this.setData({
        platformIos: false
      })
    }
  },
  onShow: function () {
    this.getIsIos()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  updateMes:function(){
    var value = this.data.value,
      region = this.data.region,
      province = region[0],
      city = region[1],
      area = region[2],
      id = Api.getThisStoreId()
    Api.updateMes({ address: value, id: id, province: province, city: city, county: area })
      .then(res => {
        wx.showToast({
          title: '修改成功',
          icon: 'none',
          duration: 2000,
          success: function () {
            wx.navigateBack()
          }
        })
      })
  },
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

})