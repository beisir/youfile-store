// pages/page/payWay/payWay.js
import Api from "../../../utils/api.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    payList:[{
      name:'其他支付方式',
      type:'other',
      selected:true
    }],
    selectedItem: {
      name: '其他支付方式',
      type: 'other',
      selected: true
    }
  },

  selectItem(e){
    let arr = this.data.payList;
    arr.forEach((el,i)=>{
      if(i == e.currentTarget.dataset.index){
        el.selected = true
        this.setData({
          selectedItem:el
        })
      }else{
        el.selected = false
      }
    })
    this.setData({
      payList: arr
    })
  },

  sure(){
    var pages = getCurrentPages();
    if (pages.length > 1) {
      //上一个页面实例对象
      var prePage = pages[pages.length - 2];
      prePage.getPayWay(this.data.selectedItem);
      wx.navigateBack();
    }
  },
  recheck(type){
    let arr = this.data.payList;
    arr.forEach((el) => {
      if (el.type == type) {
        el.selected = true
        this.setData({
          selectedItem: el
        })
      } else {
        el.selected = false
      }
    })
    this.setData({
      payList: arr
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    Api.storeOnlinePay().then(res=>{
      let obj = {};
      if (res.obj && res.obj.onlinePay){
        obj.onlinePay = true
        let arr = this.data.payList;
        arr.push({
          name: '在线支付',
          type: "online",
          selected: false
        })
        this.setData({
          payList: arr
        })
        if (options.payway) {
          this.recheck(options.payway);
        }
      }
      this.setData(obj);
    }).catch(e=>{
      
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