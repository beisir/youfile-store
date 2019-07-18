// distribution/pages/purchase/inHouse/inHouse.js
import Api from "../../../../utils/api.js"
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseUrl: app.globalData.imageUrl
  },
  getDate(e){
    this.setData({
      inDate: e.detai.value
    })
  },
  getDetail() {
    Api.getPurchaseMsg({ no: this.data.no }).then(res => {
      this.setData({
        order: res.obj
      })
      let goodsArr = res.obj.purchaseGoodsVOS
      let waitArr = goodsArr.filter(el => el.remainNum>0)
      waitArr.forEach(el=>{
        el.purchaseOrderDetailVOList = el.purchaseOrderDetailVOList.filter(sku => sku.remainNum > 0)
      })
      this.setData({
        goodsList: waitArr
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      // no: options.no
      no: 190718800000
    },()=>{
      this.getDetail()
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