// pages/order/order.js
Page({

  /**
   * 页面的初始数据
   */
  // 0待付款 1已付款 2待收货 3交易成功 4交易关闭  5自提待付款 6自提待取货 7交易成功自提 8自提交易关闭
  data: {
    hasList: false, 
    nav: [{ title: "全部" }, { title: "待付款" }, { title: "已付款" }, { title: "待收货" }, { title: "已完成" }],
    reson: [{ title: "我不想买了", selected: false }, { title: "信息填写错误，重新拍", selected: false }, { title: "卖家缺货", selected: false }, { title: "同城见面交易", selected: false }, { title: "其他", selected: false}],
    carts: [
      { status: 0, name: "周大福国贸店", phone: 13161447522, list: [{ id: 1, title: '周大福 绝色系列 热情似火 18K金镶红宝石钻', price: '1200', small: '约1.66mm*0.23cm', image: '/image/s5.png', num: 4, selected: true }, { id: 1, title: '周大福 绝色系列 热情似火 18K金镶红宝石钻', price: '1200', small: '约1.66mm*0.23cm', image: '/image/s5.png', num: 4, selected: true }] },
      { status: 5, name: "周大福国贸店", phone: 13161447522, list: [{ id: 1, title: '周大福 绝色系列 热情似火 18K金镶红宝石钻', price: '1200', small: '约1.66mm*0.23cm', image: '/image/s5.png', num: 4, selected: true }] },
      { status: 1, name: "周大福国贸店", phone: 13161447522, list: [{ id: 1, title: '周大福 绝色系列 热情似火 18K金镶红宝石钻', price: '1200', small: '约1.66mm*0.23cm', image: '/image/s5.png', num: 4, selected: true }] },
      { status: 2, name: "周大福国贸店", phone: 13161447522, list: [{ id: 1, title: '周大福 绝色系列 热情似火 18K金镶红宝石钻', price: '1200', small: '约1.66mm*0.23cm', image: '/image/s5.png', num: 4, selected: true }] },
      { status: 3, name: "周大福国贸店", phone: 13161447522, list: [{ id: 1, title: '周大福 绝色系列 热情似火 18K金镶红宝石钻', price: '1200', small: '约1.66mm*0.23cm', image: '/image/s5.png', num: 4, selected: true }] },
      { status: 4, name: "周大福国贸店", phone: 13161447522, list: [{ id: 1, title: '周大福 绝色系列 热情似火 18K金镶红宝石钻', price: '1200', small: '约1.66mm*0.23cm', image: '/image/s5.png', num: 4, selected: true }] },
      { status: 6, name: "周大福国贸店", phone: 13161447522, list: [{ id: 1, title: '周大福 绝色系列 热情似火 18K金镶红宝石钻', price: '1200', small: '约1.66mm*0.23cm', image: '/image/s5.png', num: 4, selected: true }] },
      { status: 7, name: "周大福国贸店", phone: 13161447522, list: [{ id: 1, title: '周大福 绝色系列 热情似火 18K金镶红宝石钻', price: '1200', small: '约1.66mm*0.23cm', image: '/image/s5.png', num: 4, selected: true }] },
      { status: 8, name: "周大福国贸店", phone: 13161447522, list: [{ id: 1, title: '周大福 绝色系列 热情似火 18K金镶红宝石钻', price: '1200', small: '约1.66mm*0.23cm', image: '/image/s5.png', num: 4, selected: true }] }
    ],
    navindex:0,
    inputActive:'inputActive ',
  },
  confirm() {
    this.setData({ show: false })
    this.setData({ show1: false })
    this.setData({ show2: false })
    this.triggerEvent('confirm')
  },
  // 确认收货
  sureSelectAreaListener: function (e) {
    var that = this;
    that.setData({
      show: false
    })
  },
  chooseAddress: function () {
    var that = this;
    that.setData({
      show: true,
    })
  },
  // 删除订单
  chooseAddress1: function () {
    var that = this;
    that.setData({
      show1: true,
    })
  },
  // 取消订单
  closeAlert: function () {
    var that = this;
    that.setData({
      show3: true,
    })
  },
  // 取件码
  closeAlert2: function () {
    var that = this;
    that.setData({
      show4: true,
    })
  },
  // 售后
  chooseAddress2: function () {
    var that = this;
    that.setData({
      show2: true,
    })
  },
  selecRes(e) {
    const index1 = e.currentTarget.dataset.index;
    let reson = this.data.reson;
    var array = this.data.reson
    array.forEach((item, index, arr) => {
      var sItem = "reson[" + index + "].selected"
      this.setData({
        [sItem]: false,
      })
    })
    reson[index1].selected = true
    this.setData({
      reson: reson
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
  clickInput:function(event){
    this.setData({
      inputActive: ''
    });
  },
  swichNav(e){
    var current=e.target.dataset.current;
    if(current==this.data.navindex){
      return false;
    }else{
      this.setData({
        navindex:current,
      })
      var data = this.data.carts
      var datalist=[]
      for (let i = 0; i < data.length; i++) {
        if (data[i].status == current){
          datalist.push(data[i])
        }
      }
      
    }
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