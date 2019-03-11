// pages/faceToFaceOrder/orderQRcode/orderQRcode.js
import API from "../../../utils/api.js";
import util from '../../../utils/util.js';
import QRCode from '../../../utils/weapp-qrcode.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },
  rpx2px(rpx){
    const rate = wx.getSystemInfoSync().windowWidth / 750
    return rate * rpx
  },
  getData() {
    API.ftfpreOrderDetail({ qrCode: this.data.code }).then(res => {
      this.setData({
        order: res.obj
      },()=>{
        this.loadQRcode()
      })
    })
  },
  loadQRcode(){
    wx.showLoading({
      title: '正在生成哦~',
    })
    let codeData = {
      type: 'ftforder',
      code: this.data.code,
      storeId: this.data.order.storeId
    }
    let url = 'https://www.youlife.net.cn/wholesale/qr/?'
    let arr = []
    for (let key in codeData){
      let thisdata = ""
      if (typeof codeData[key] === 'object'){
        thisdata = JSON.stringify(codeData[key])
      }else{
        thisdata = codeData[key]
      }
      arr.push(key + "=" + thisdata)
    }
    url += arr.join('&')
    console.log(url)
    // 绘制二维码
    let qrcodeWidth = this.rpx2px(300)
    this.setData({
      qrcodeWidth: qrcodeWidth,
    })
    let qrcode = new QRCode('canvas', {
      text: url,
      width: qrcodeWidth,
      height: qrcodeWidth,
      colorDark: "#000",
      colorLight: "white",
      correctLevel: QRCode.CorrectLevel.H
    }, url => {
      this.setData({ url: url })
      wx.hideLoading()
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      code: options.code
    })
    this.getData()
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