// pages/order/order.js
Page({

  /**
   * 页面的初始数据
   */
  // 0待付款 1待发货 2待填表  3待收货   4供货成功 5 交易关闭  6自提待付款 7自提待取货 8交易供货自提 9自提交易关闭
  data: {
    hasList: false,
    nav: [{ title: "全部" }, { title: "待付款" }, { title: "已付款" }, { title: "待收货" }, { title: "已完成" }],
    reson: [{ title: "无法联系上买家", selected: false }, { title: "买家误拍或重拍", selected: false }, { title: "买家无诚意完成交易", selected: false }, { title: "缺货无法交易", selected: false }, { title: "其他", selected: false }],
    carts: [
      { status: 0, name: "流星落", phone: 13161447522, list: [{ id: 1, title: '周大福 绝色系列 热情似火 18K金镶红宝石钻', price: '1200', small: '约1.66mm*0.23cm', image: '/image/s5.png', num: 4, selected: true }], attribute: [{ name: "金镶h红宝石", weight: "600g", num: 5, mon: 787.00 }, { name: "金镶h红宝石", weight: "600g", num: 5, mon: 787.00 }, { name: "金镶h红宝石", weight: "600g", num: 5, mon: 787.00 }] },
      { status: 6, name: "流星落", phone: 13161447522, list: [{ id: 1, title: '周大福 绝色系列 热情似火 18K金镶红宝石钻', price: '1200', small: '约1.66mm*0.23cm', image: '/image/s5.png', num: 4, selected: true }], attribute: [{ name: "金镶h红宝石", weight: "600g", num: 5, mon: 787.00 }, { name: "金镶h红宝石", weight: "600g", num: 5, mon: 787.00 }, { name: "金镶h红宝石", weight: "600g", num: 5, mon: 787.00 }] },
      { status: 1, name: "流星落", phone: 13161447522, list: [{ id: 1, title: '周大福 绝色系列 热情似火 18K金镶红宝石钻', price: '1200', small: '约1.66mm*0.23cm', image: '/image/s5.png', num: 4, selected: true }], attribute: [{ name: "金镶h红宝石", weight: "600g", num: 5, mon: 787.00 }, { name: "金镶h红宝石", weight: "600g", num: 5, mon: 787.00 }, { name: "金镶h红宝石", weight: "600g", num: 5, mon: 787.00 }] },
      { status: 7, name: "流星落", phone: 13161447522, list: [{ id: 1, title: '周大福 绝色系列 热情似火 18K金镶红宝石钻', price: '1200', small: '约1.66mm*0.23cm', image: '/image/s5.png', num: 4, selected: true }], attribute: [{ name: "金镶h红宝石", weight: "600g", num: 5, mon: 787.00 }, { name: "金镶h红宝石", weight: "600g", num: 5, mon: 787.00 }, { name: "金镶h红宝石", weight: "600g", num: 5, mon: 787.00 }] },
      { status: 2, name: "流星落", phone: 13161447522, list: [{ id: 1, title: '周大福 绝色系列 热情似火 18K金镶红宝石钻', price: '1200', small: '约1.66mm*0.23cm', image: '/image/s5.png', num: 4, selected: true }], attribute: [{ name: "金镶h红宝石", weight: "600g", num: 5, mon: 787.00 }, { name: "金镶h红宝石", weight: "600g", num: 5, mon: 787.00 }, { name: "金镶h红宝石", weight: "600g", num: 5, mon: 787.00 }] },
      { status: 3, name: "流星落", phone: 13161447522, list: [{ id: 1, title: '周大福 绝色系列 热情似火 18K金镶红宝石钻', price: '1200', small: '约1.66mm*0.23cm', image: '/image/s5.png', num: 4, selected: true }], attribute: [{ name: "金镶h红宝石", weight: "600g", num: 5, mon: 787.00 }, { name: "金镶h红宝石", weight: "600g", num: 5, mon: 787.00 }, { name: "金镶h红宝石", weight: "600g", num: 5, mon: 787.00 }] },
      { status: 4, name: "流星落", phone: 13161447522, list: [{ id: 1, title: '周大福 绝色系列 热情似火 18K金镶红宝石钻', price: '1200', small: '约1.66mm*0.23cm', image: '/image/s5.png', num: 4, selected: true }], attribute: [{ name: "金镶h红宝石", weight: "600g", num: 5, mon: 787.00 }, { name: "金镶h红宝石", weight: "600g", num: 5, mon: 787.00 }, { name: "金镶h红宝石", weight: "600g", num: 5, mon: 787.00 }] },
      { status: 5, name: "流星落", phone: 13161447522, list: [{ id: 1, title: '周大福 绝色系列 热情似火 18K金镶红宝石钻', price: '1200', small: '约1.66mm*0.23cm', image: '/image/s5.png', num: 4, selected: true }], attribute: [{ name: "金镶h红宝石", weight: "600g", num: 5, mon: 787.00 }, { name: "金镶h红宝石", weight: "600g", num: 5, mon: 787.00 }, { name: "金镶h红宝石", weight: "600g", num: 5, mon: 787.00 }] },
      { status: 8, name: "流星落", phone: 13161447522, list: [{ id: 1, title: '周大福 绝色系列 热情似火 18K金镶红宝石钻', price: '1200', small: '约1.66mm*0.23cm', image: '/image/s5.png', num: 4, selected: true }], attribute: [{ name: "金镶h红宝石", weight: "600g", num: 5, mon: 787.00 }, { name: "金镶h红宝石", weight: "600g", num: 5, mon: 787.00 }, { name: "金镶h红宝石", weight: "600g", num: 5, mon: 787.00 }] },
      { status: 9, name: "流星落", phone: 13161447522, list: [{ id: 1, title: '周大福 绝色系列 热情似火 18K金镶红宝石钻', price: '1200', small: '约1.66mm*0.23cm', image: '/image/s5.png', num: 4, selected: true }], attribute: [{ name: "金镶h红宝石", weight: "600g", num: 5, mon: 787.00 }, { name: "金镶h红宝石", weight: "600g", num: 5, mon: 787.00 }, { name: "金镶h红宝石", weight: "600g", num: 5, mon: 787.00 }] },
    ],
    navindex: 0,
    inputActive: 'inputActive ',
    style: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  confirm() {
    this.setData({ show: false })
    this.setData({ show1: false })
    this.setData({ show2: false })
    this.triggerEvent('confirm')
  },
  sureSelectAreaListener: function (e) {
    var that = this;
    that.setData({
      show: false
    })
  },
  // 验证取货码
  chooseAddress: function () {
    var that = this;
    that.setData({
      show: true,
    })
  },
  // 我要发货
  chooseAddress1: function () {
    var that = this;
    that.setData({
      show1: true,
    })
  },
  // 待填表
  chooseAddress2: function () {
    var that = this;
    that.setData({
      show2: true,
    })
  },
  // 取消订单
  closeAlert: function () {
    var that = this;
    that.setData({
      show3: true,
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
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  searchBtn(e) {
    this.setData({
      style: true,
    })
  },
  
  swichNav(e) {
    var current = e.target.dataset.current;
    if (current == this.data.navindex) {
      return false;
    } else {
      this.setData({
        navindex: current,
      })
      var data = this.data.carts
      var datalist = []
      for (let i = 0; i < data.length; i++) {
        if (data[i].status == current) {
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