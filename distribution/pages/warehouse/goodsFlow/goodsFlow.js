// distribution/pages/warehouse/goodsFlow/goodsFlow.js
import Api from '../../../../utils/api.js'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
  },
  getList(re){
    if (re) {
      app.pageRequest.pageData.pageNum = 0;
      this.setData({
        flow: []
      })
    }
    Api.stockCodeGoodsFlow({ stockCode: this.data.code}).then(res=>{
      this.setData({
        goods: res.obj.num,
        flow: this.data.flow.concat(res.obj.flows.result ? res.obj.flows.result:[])
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      code: options.code
    },()=>{
      this.getList(true)
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
    this.getList()
  }
})