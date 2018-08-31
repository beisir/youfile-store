// pages/user/user.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getStorage({
      key: 'skins',
      success: function (res) {
        that.setData({
          SkinStyle: res.data
        })
      },
    })
  },
  //用户选择收货地址
  chooseAddress: function () {
    var that = this;
    if (wx.chooseAddress) {
      wx.chooseAddress({
        success: function (res) {
          console.log(JSON.stringify(res));
          console.log(res);
          that.setData({
            "add_userName": res.userName,
            "add_telNumber": res.telNumber,
            "add_provinceName": res.provinceName,
            "add_cityName": res.cityName,
            "add_countyName": res.countyName,
            "add_detailInfo": res.detailInfo,
            "add_postalCode": res.postalCode,
            //具体收货地址显示
            flag: false,

          })
        },
        fail: function (err) {
          console.log(JSON.stringify(err));
          console.info("收货地址授权失败");
          wx.showToast({
            title: '授权失败，您将无法进行下单支付;重新授权请删除小程序后再次进入',
            icon: 'success',
            duration: 20000
          })
        }
      })
    } else {
      console.log('当前微信版本不支持chooseAddress');
    }
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