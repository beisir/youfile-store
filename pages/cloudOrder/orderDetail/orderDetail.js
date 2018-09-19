// pages/cloudOrder/orderDetail/orderDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //服务信息
    msgList: [{
        title: "电话",
        val: "tel"
      },
      {
        title: "服务时间",
        val: "tel"
      },
      {
        title: "开始时间",
        val: "tel"
      },
      {
        title: "结束时间",
        val: "tel"
      },
      {
        title: "服务状态",
        val: "tel"
      },
      {
        title: "剩余时间",
        val: "tel"
      }
    ],
    msg: {
      tel: 11111
    },
    //订单信息
    orderList: [{
      title: "订单号",
      val: "tel"
    },
    {
      title: "交易单号",
      val: "tel"
    },
    {
      title: "下单时间",
      val: "tel"
    },
    {
      title: "付款时间",
      val: "tel"
    }],
    order: {
      tel: 11111
    },
    //发票
    invoiceList: [{
      title: "发票信息",
      val: "tel"
    },
    {
      title: "公司名称",
      val: "tel"
    },
    {
      title: "纳税人识别号",
      val: "tel"
    }],
    invoice: {
      tel: 11111
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})