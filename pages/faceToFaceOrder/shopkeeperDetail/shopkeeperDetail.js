// pages/faceToFaceOrder/customerOrderDetail/customerOrderDetail.js
import API from "../../../utils/api.js";
import util from '../../../utils/util.js';
const app = getApp(); 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    timeOnce: true,  //倒计时
    //取消
    reason: [{ title: "无法联系上买家", selected: true }, { title: "买家误拍或重拍", selected: false }, { title: "买家无诚意完成交易", selected: false }, { title: "缺货无法交易", selected: false }, { title: "其他原因", selected: false }],
    cancelIndex: 0
  },
  //复制订单号
  copyCode() {
    wx.setClipboardData({
      data: this.data.order.orderNumber,
      success: () => {
        wx.showToast({
          title: '复制订单号成功',
          icon: "none"
        })
      }
    })
  },
  getData(){
    API.ftfAdminOrderDetail({ orderNumber : this.data.code}).then(res=>{
      

      try {
        res.obj.payDate = util.formatTime(new Date(res.obj.payDate));
        res.obj.createDate = util.formatTime(new Date(res.obj.createDate));
        res.obj.finishDate = util.formatTime(new Date(res.obj.finishDate));
        res.obj.cancelDate = util.formatTime(new Date(res.obj.cancelDate));
      } catch (e) { }
      
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

  //打电话
  call(){
    let tel = this.data.order.userInfo.mobile;
    if(tel){
      wx.makePhoneCall({
        phoneNumber: tel,
      })
    }
  },
  //操作后刷新
  afterSet() {
    setTimeout(() => {
      this.closeModal();
      this.getData()
    }, 800)
  },
  //取消订单
  sureCancel(e) {
    let code = this.data.code;
    let reason = this.data.reason[this.data.cancelIndex].title;
    API.ftfCloseOrder({ orderNumber: code, reason: reason }).then(res => {
      wx.showToast({
        title: res.message,
        icon: 'none'
      })
      this.afterSet();
    })
  },
  //取消理由
  swichReason(e) {
    var current = e.currentTarget.dataset.current;
    var array = this.data.reason
    array.forEach((item, index, arr) => {
      if (current == index) {
        item.selected = true;
      } else {
        item.selected = false;
      }
    })
    this.setData({
      reason: array,
      cancelIndex: current
    })
  },
  //蒙层
  showModal(e) {
    let type = e.currentTarget.dataset.type,
      obj = {};
    switch (type) {
      case 'close':
        obj.cancelModal = true;
        break;
    }
    this.setData(obj)
  },
  closeModal() {
    this.setData({
      cancelModal: false //取消订单
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      code : options.code
    })
    this.getData();
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