// pages/page/navigateMiddleware/navigateMiddleware.js
import API from "../../../utils/api.js";
import { switchQRCodeType } from "../../../utils/scanCode.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    options:{}
  },
  
  switchType(){
    switch (this.data.options.type) {
      case 'ftforder':
       this.ftfOrder()
      break;
    }
  },

  // 门店订单
  ftfOrder(){
    // let urldata = this.data.options;
    // if (!urldata.code) { this.toHome();return}
    // API.ftfuserSureOrder({ qrCode: urldata.code, payType: 'online' }).then(res => {
    //   if(res.code == '0'){
    //     wx.redirectTo({
    //       url: '../../faceToFaceOrder/customerSureOrder/customerSureOrder?code=' + res.obj.orderNumber,
    //     })
    //   }
    // })
  },
  toHome(){
    wx.switchTab({
      url: '../home/home',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options){
      this.setData({ options })
    }
    switchQRCodeType(options ? options : this.data.options, 'middle' )
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
    this.switchType()
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