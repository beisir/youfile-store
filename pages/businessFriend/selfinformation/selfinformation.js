// pages/businessFriend/selfinformation/selfinformation.js
import Api from '../../../utils/api.js'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseUrl: app.globalData.imageUrl
  },
  getDetail(){
    Api.getSupplierMsg({
      no: this.data.no
    }).then(res => {
      for(let key in res.obj){
        if (!res.obj[key]){
          res.obj[key] = ''
        }
      }
      this.setData({
        msg: res.obj
      })
    })
  },
  calling(e){
    if(e.currentTarget.dataset.tel){
      wx.makePhoneCall({
        phoneNumber: e.currentTarget.dataset.tel
      })
    }
  },
  getGoodsList(re){
    if(re){
      app.pageRequest.pageData.pageNum = 0
      this.setData({
        goodsList: []
      })
    }
    Api.getSupplierGoodsList({
      supplierNumber: this.data.no,
    }).then(res => {
      this.setData({
        goodsList: this.data.goodsList.concat(res.obj.result)
      })
    })
  },
  setName: function () {
    this.setData({
      addSpec: true,
    })
  },
  edit(){
    wx.navigateTo({
      url: '/distribution/pages/supplier/createSupplier/createSupplier?no='+this.data.msg.no,
    })
  },
  del(){
    Api.delSupplier({no:this.data.no}).then(res=>{
      Api.showToast(res.message,()=>{
        wx.navigateBack()
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      no: options.no
    },()=>{
      this.getGoodsList(true)
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