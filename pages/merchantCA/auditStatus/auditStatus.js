// pages/merchantCA/auditStatus/auditStatus.js
import Api from '../../../utils/api.js'
import { formatTimeday} from '../../../utils/util.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  getDetail() {
    Api.merchantDeatail().then(res => {
      if (res.obj.auditTime){
        res.obj.auditTime = formatTimeday(new Date(res.obj.auditTime))
      } else {
        res.obj.auditTime = ''
      }
      this.setData({
        message: res.obj
      })
      if (res.obj.auditStatus === 'success' && !res.obj.auditBroadcast){
        Api.hideMerchantTip()
      }
    })
  },  
  toDetail(){
    wx.navigateTo({
      url: '../commonMsg/commonMsg',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getDetail()
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