// pages/page/navigateMiddleware/navigateMiddleware.js
import API from "../../../utils/api.js";
import { handleQRCode } from "../../../utils/scanCode.js";
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
      case 'user':
        this.businessFriend()
      break;
      default: 
        this.toHome()
      break;  
    }
  },

  // 门店订单
  ftfOrder(){
    switchQRCodeType(this.data.options, 'middle')
  },
  // 商友
  businessFriend(){
    let str = this.handleData()
    wx.reLaunch({
      url: '../home/home?' + str,
    })
  },
  toHome(){
    let str = handleData()
    wx.switchTab({
      url: '../home/home',
    })
  },
  handleData(){
    let data = this.data.options
    let arr = []
    try{
      for (let key in data) {
        arr.push(key + "=" + data[key])
      }
      let str = arr.join("&")
      return str
    }catch(e){
      return ""
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options){
      this.setData({ options })
    }
    // handleQRCode('http://youlife.cn?type=ftforder&storeId=S1000349&code=cb72f7974bcf233393208e31b370e91b', 'middle', { q: 'http://youlife.cn?type=ftforder&storeId=S1000349&code=cb72f7974bcf233393208e31b370e91b'})
    handleQRCode('http://youlife.cn?type=user&userId=cbced730cc43cead0592fbdd5ef10f99', 'middle', { q: 'http://youlife.cn?type=user&userId=cbced730cc43cead0592fbdd5ef10f99'})
    //handleQRCode(decodeURIComponent(options.q), 'middle')
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