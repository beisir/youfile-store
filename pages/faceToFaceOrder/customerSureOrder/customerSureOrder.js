// pages/faceToFaceOrder/customerSureOrder/customerSureOrder.js
import util from '../../../utils/util.js';
import API from "../../../utils/api.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    timeOnce: true
  },
  getData() {
    API.ftfCustomerOrderDetail({ orderNumber: this.data.code }).then(res => {
      this.setData({
        order: res.obj
      })
      //倒计时
      let timm = this.data.timeOnce;
      if (timm) {
        util.count_down(this, res.obj.timeoutExpressSecond ? res.obj.timeoutExpressSecond * 1000 : "")
        this.setData({ timeOnce: false })
      }
    })
  },
  pay() {
    wx.navigateTo({
      url: '../../casher/casher/casher?num=' + this.data.code + '&type=ftf'
    })
  },
  toHome() {
    API.toHome()
  },
  addOrder(){
    API.ftfuserSureOrder({ qrCode: this.data.qrCode, payType: 'online' }).then(res => {
      this.setData({
        code: res.obj.orderNumber
      },()=>{
        this.getData();
      })
    }).catch(e => {
      if (e.data.code === '1') {
        setTimeout(() => {
          API.toHome()
        }, 1000)
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options){
      this.setData({
        qrCode: options.qrCode,
      })
    }
   
    this.addOrder()
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