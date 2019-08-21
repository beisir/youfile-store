// distribution/pages/purchase/orderInHouseDetail/orderInHouseDetail.js
import Api from "../../../../utils/api.js"
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseUrl: app.globalData.imageUrl
  },
  getDetail(){
    Api.orderInDetail({no: this.data.no}).then(res=>{
      this.setData({
        houseList: res.obj
      })
    })
  },
  showHide(e){
    this.setData({
      ['houseList[' + e.currentTarget.dataset.index + '].hide']: !this.data.houseList[e.currentTarget.dataset.index].hide
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      no: options.no
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

  }
})