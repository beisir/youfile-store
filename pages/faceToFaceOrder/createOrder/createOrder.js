// pages/faceToFaceOrder/createOrder/createOrder.js
const app = getApp();
import API from "../../../utils/api.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    warnText:"",
    tip: "",   //备注
    sureTip:"",
    tag: [],  //标签
    baseUrl: app.globalData.imageUrl
  },
  watchInput(e){
    let type = e.currentTarget.dataset.type,
        val = e.detail.value,
        obj = {};
    switch(type){
      case "money":
        let m = /^(([1-9][0-9]*)|([0]\.\d{1,2})|([1-9][0-9]*\.\d{1,2}))$/.test(val);
        if(m){
          if (val <= 10000) {
            obj.warnText = false;
            obj.redColor = false;
            obj.money = val;  
          } else {
            obj.warnText = '单笔支付金额不可超过10000';
            obj.redColor = true
          }
        }else{
          obj.warnText = '请输入正确金额格式,最多两位小数';
          obj.redColor = true;          
        }
      break;
      case "tip":
        obj.tip = val;
      break;
    }
    this.setData(obj)
  },
  showModal(e){
    let type = e.currentTarget.dataset.type;
    let obj = {};
    switch(type){
      case "tip":
        obj.tipsModal = true
      break;
    }
    this.setData(obj)
  },
  closeModal(){
    this.setData({
      tipsModal: false    //备注
    })
  },
  //保存备注
  saveTip(){
    this.setData({
      sureTip:this.data.tip
    })
    this.closeModal();
  },
  //修改商品标签
  editTag(){
    let tag = this.data.tag;
    let str = "";
    if(tag.length > 0){
      let strarr = [];
      tag.forEach(el=>{
        strarr.push(el.id);
      })
      str = "?tag=" + strarr.join(',')
    }
    wx.navigateTo({
      url: '../goodsTag/goodsTag'+str,
    })
  },
  getTag(tagArr){
    this.setData({
      tag: tagArr
    })
  },

  // 创建订单
  creatOrder(){ 
    if (this.data.warnText){
      return
    }
    let moneyVal = this.data.money
    let m = /^(([1-9][0-9]*)|([0]\.\d{1,2})|([1-9][0-9]*\.\d{1,2}))$/.test(moneyVal);
    if (!m) {
      this.setData({
        warnText: '请输入正确金额格式,最多两位小数',
        redColor: true
      })  
      return 
    }
    if (moneyVal > 10000) {
      this.setData({
        warnText : '单笔支付金额不可超过10000',
        redColor : true
      })
      return
    }

    let obj = {
      storeId: this.data.storeId,
      orderAmount: this.data.money,
      remark: this.data.sureTip,
      customerUserNo: this.data.userId,
      faceToFaceOrderDetailVOList: this.data.tag
    };

    obj.faceToFaceOrderDetailVOList = [{
      "amount": 100,
      "goodsDesc": "123",
      "goodsId": "1111111111",
      "goodsName": "测试数据",
      "num": 1,
      "unitPrice": 100
    }];
    app.http.postRequest("/admin/ftf/order",obj).then(res=>{
      wx.showToast({
        title: res.message,
        icon:'none'
      })
      if(res.code == '0'){
        setTimeout(() => {
          wx.navigateTo({
            url: '../createSuccess/createSuccess?code=' + res.obj.orderNumber + "&amount=" + res.obj.orderAmount + "&count=" + res.obj.todayOrderCount,
          })
        }, 800)
      }
    })
  },
  //获取用户
  getUser(){
    API.newUserInfor({ userId: this.data.userId }).then(res=>{
      this.setData({
        user:res.obj
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userId: options.user,
      storeId: wx.getStorageSync('storeId')
    })  
    this.getUser()
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