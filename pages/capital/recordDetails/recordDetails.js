import Api from '../../../utils/api.js'
const util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataDetails:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  getDetails: function (paymentNumber){
    var _this=this
    Api.getAccountDetail({ paymentNumber: paymentNumber}).then(res=>{
      let obj=res.obj
      if(obj){
        if (obj.paidDate){
          obj.paidDate = util.formatTime(new Date(obj.paidDate))
        }
        if (obj.payWay == "wx_mini_app_pay"){
          obj.payWay ="微信小程序支付"
        }
        if (obj.customerPhone){
          var tel = obj.customerPhone;
          tel = "" + tel;
          var ary = tel.split("");
          ary.splice(3, 4, "****");
          var tel1 = ary.join("");
          obj.customerPhone = tel1
        }else{
          obj.customerPhone = ''
        }
        _this.setData({
          dataDetails:obj
        })
      }
    })
  },
  onLoad: function (options) {
    if (options.paymentNumber){
      this.getDetails(options.paymentNumber)
    }
  },
  // 查看订单详情
  goOrderDetails(){
    var dataDetails=this.data.dataDetails
    wx.navigateTo({
      url: '/pages/role/allOrder/allOrder?num=' + dataDetails.orderNumber
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