const app = getApp();
import Api from '../../../utils/api.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bankData:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  //打电话
  tel: function () {
    wx.makePhoneCall({
      phoneNumber: app.globalData.servesPhone
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
  getBankData:function(){
    var _this=this
    Api.getBankcard().then(res => {
      if (res.obj){
        let bankData = res.obj
        let str = bankData.bankCard
        bankData.bankCard = str.substr(str.length - 4)
        _this.setData({
          bankData: bankData
        })
      }
    })
  },
  onShow: function () {
    this.getBankData()
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