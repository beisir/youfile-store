// pages/faceToFaceOrder/customerOrderList/customerOrderList.js
const app = getApp();
import API from "../../../utils/api.js";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    nav: [{ name: "全部", type: "all", checked: true }, { name: "待付款", type: "unpaid", checked: false }, { name: "已完成", type: "finish", checked: false }],
    searchText:"",
    listType:"all",
    list: [],
    reason: [{ title: "无法联系上买家", selected: true }, { title: "买家误拍或重拍", selected: false }, { title: "买家无诚意完成交易", selected: false }, { title: "缺货无法交易", selected: false }, { title: "其他原因", selected: false }],
    cancelIndex:0


  },
  watchInput(e){
    let val = e.detail.value,
        type= e.currentTarget.dataset.type,
        obj = {};
    switch(type){
      case "search" : 
      obj.searchText = val;
      break;
    }    
    this.setData(obj)
  },
  switchNav(e) {
    let type = e.currentTarget.dataset.type;
    let arr = this.data.nav;
    arr.forEach(el => {
      if (el.type == type) {
        el.checked = true
        this.setData({
          listType: el.type
        })
      } else {
        el.checked = false
      }
    })
    this.setData({
      nav: arr
    })
    this.getList(true)
  },
  //搜索
  search(){
    this.getList(true)
  },
  getList(re){
    if (re) {
      app.pageRequest.pageData.pageNum = 0;
      this.setData({
        list: []
      })
    }
    API.getStoreOrderAdmin({ orderStatus: this.data.listType, keyWords: this.data.searchText}).then(res=>{
      if (res.obj && res.obj.result) {
        this.setData({
          list: this.data.list.concat(res.obj.result)
        })
      }
    })
  },
  //操作后刷新
  afterSet(){
    setTimeout(()=>{
      this.closeModal();
      this.getList(true)
    },800)
  },
  //取消订单
  sureCancel(e){
    let code = this.data.closeCode;
    let reason = this.data.reason[this.data.cancelIndex].title;
    API.ftfCloseOrder({ orderNumber: code, reason: reason }).then(res=>{
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
  showModal(e){
    let type = e.currentTarget.dataset.type,
        code = e.currentTarget.dataset.code,
        obj = {};    
    switch(type){
      case 'close':
        obj.cancelModal = true;
        obj.closeCode = code;
      break;
    }
    this.setData(obj)
  },
  closeModal(){
    this.setData({
      cancelModal:false //取消订单
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    this.getList(true)
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
    this.getList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})