// pages/merchantCA/merchantType/merchantType.js
Page({

  /**
   * 页面的初始数据
   */
  //1、个人；2；个体；3；企业
  // 对应页面里的index
  data: {
    list: [{
      name: '企业',
      type: '3',
      url: '/image/merchant-qy.png',
      des: '企业组织商户认证，优先审核开通在线支付服务，需要提供企业营业执照等资质；'
    },{
      name: '个人',
      type: '1',
      url: '/image/merchant-gr.png',
      des: '个人商户认证，申请开通在线支付服务，需要提供个人身份证等资质；'
    },{
      name: '个体',
      type: '2',
      url: '/image/merchant-gt.png',
      des: '个体工商户认证，优先审核开通在线支付服务，需要提供个体营业执照等资质；'
    }]
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