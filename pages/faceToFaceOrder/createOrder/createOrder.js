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
  // 加减器
  changeNum(e){
    let type = e.currentTarget.dataset.type,
        item = e.currentTarget.dataset.item,
        tags = this.data.tag;

    tags.forEach((el, index)=> {
      if (el.goodsId === item.goodsId){
        if(type==='add') {
          if (el.num == 9999) {
            API.showToast("数量最多9999个")
            return
          }
          el.num++
        } else {
          el.num--
        }
        
        if(el.num <= 0){
          tags.splice(index,1)
        }
      }
    })
    this.setData({tag:tags})    
  },
  watchInput(e){
    let type = e.currentTarget.dataset.type,
        val = e.detail.value,
        obj = {};
    switch(type){
      case "money":
        let m = /^(([1-9][0-9]*)|([0]\.\d?[1-9])|([1-9][0-9]*\.\d{1,2}))$/.test(val);
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
      case "goodsnum":
        let item = e.currentTarget.dataset.item
        let arr = this.data.tag;
        if ( val>0 && val<9999){
          arr.forEach(el=>{
            if (el.goodsId === item.goodsId){
              el.num = val
            }
          })
          obj.tag = arr
        }else if(val > 9999){
          arr.forEach(el => {
            if (el.goodsId === item.goodsId) {
              el.num = 9999
            }
          })
          obj.tag = arr
        } else if (val <= 0 && val!=""){
          arr.forEach((el,index) => {
            if (el.goodsId === item.goodsId) {
              arr.splice(index, 1)
            }
          })
          obj.tag = arr
        }
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
      sureTip: this.data.tip.trim(),
      tip: this.data.tip.trim()
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
        let obj = {
          num: el.num,
          goodsId: el.goodsId
        }
        strarr.push(obj);
      })
      str = "?tag=" + JSON.stringify(strarr)
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
    if (!(this.data.tag && this.data.tag.length>0)){
      API.showToast('请选择商品')
      return
    }

    let obj = {
      storeId: this.data.storeId,
      orderAmount: this.data.money,
      remark: this.data.sureTip,
      faceToFaceOrderDetailVOList: this.data.tag
    };
    app.http.postRequest("/admin/ftf/order",obj).then(res=>{
      API.showToast(res.message)
      if(res.code == '0'){
        setTimeout(() => {
          wx.redirectTo({
            url: '../orderQRcode/orderQRcode?code=' + res.obj
          })
        }, 800)
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    this.setData({
      storeId: wx.getStorageSync('storeId')
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