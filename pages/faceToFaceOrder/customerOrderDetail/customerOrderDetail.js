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
    reason: [{ title: "我不想买了", selected: true }, { title: "信息填写错误，重新拍", selected: false }, { title: "卖家缺货", selected: false }, { title: "重复下单/误下单", selected: false }, { title: "其他原因", selected: false }],
    cancelIndex: 0
  },
  // 返回首页
  toHome(){
    API.toHome()
  },
  //复制订单号
  copyCode() {
    wx.setClipboardData({
      data: this.data.order.orderNumber,
      success: () => {
        API.showToast('复制订单号成功')
      }
    })
  },

  getData() {
    API.ftfCustomerOrderDetail({ orderNumber: this.data.code }).then(res => {


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
  call() {
    let tel = this.data.order.storeInfo.servicePhone;
    if (tel) {
      wx.makePhoneCall({
        phoneNumber: tel,
      })
    }
  },
  //删除订单
  sureDel() {
    let code = this.data.code;
    API.ftfDelOrder({ orderNumber: code }).then(res => {
      API.showToast(res.message)
      this.closeModal();
      setTimeout(()=>{
        wx.navigateBack()
      },800)
    })
  },
  //付款
  pay(e) {
    let code = this.data.code;
    wx.navigateTo({
      url: '../../casher/casher/casher?num=' + code + '&type=ftf'
    })
  },
  //取消订单
  sureCancel(e) {
    let code = this.data.code;
    let reason = this.data.reason[this.data.cancelIndex].title;
    API.ftfCaneledOrder({ orderNumber: code, reason: reason }).then(res => {
      API.showToast(res.message)
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
      code = this.data.code,
      obj = {};
    switch (type) {
      case 'close':
        obj.cancelModal = true;
        obj.closeCode = code;
        break;
      case 'del':
        obj.delModal = true;
        obj.delCode = code;
        break;
    }
    this.setData(obj)
  },
  closeModal() {
    this.setData({
      cancelModal: false, //取消订单
      delModal: false //删除订单
    })
  },
  //操作后刷新
  afterSet() {
    setTimeout(() => {
      this.closeModal();
      this.getData()
    }, 800)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      code: options.code
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