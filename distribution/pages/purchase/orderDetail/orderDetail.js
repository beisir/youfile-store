// distribution/pages/purchase/orderDetail/orderDetail.js
import Api from "../../../../utils/api.js"
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    allshow:false,
    baseUrl: app.globalData.imageUrl
  },
  toInhouse(){
    wx.navigateTo({
      url: '../inHouse/inHouse?no=' + this.data.no,
    })
  },
  // 是否展开
  changeShow(){
    this.setData({
      allshow: !this.data.allshow
    })
  },
  getDetail(){
    Api.getPurchaseMsg({no:this.data.no}).then(res=>{
      this.setData({
        order: res.obj
      })
    })
  },
  call(){
    if (!this.data.order.supplierPhone){
      Api.showToast("未留下电话哦")
      return
    }
    wx.makePhoneCall({
      phoneNumber: this.data.order.supplierPhone,
    })
  },
  copy(e){
    wx.setClipboardData({
      data: e.currentTarget.dataset.msg,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      no: options.no
      // no: 190718800000
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
    this.getDetail()
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