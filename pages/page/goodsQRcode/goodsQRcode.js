// pages/derm/derm.js
const app = getApp();
import Api from '../../../utils/api.js';
import util from '../../../utils/util.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseUrl: app.globalData.imageUrl,
    urlCode: ''
  },
  saveImg() {
    if (this.data.urlCode) {
      let imgUrl = this.data.baseUrl + this.data.urlCode;
      util.saveImgToPhone(imgUrl)
    } else {
      Api.showToast('暂无二维码')
    }
  },
  share() {
    wx.showShareMenu({
      withShareTicket: true
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.goodsId) {
      var _this = this
      Api.goodsDetails({
        goodsId: options.goodsId
      }).then(res => {
        var obj = res.obj.goodsVO.miniProgramCode
        _this.setData({
          urlCode: obj
        })
      })
    } else {
      Api.showToast("没有该商品哦~~")
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function(options) {
    
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
  onShareAppMessage: function(res) {
    let id = wx.getStorageSync('storeId');
    if (id) {
      return {
        path: "pages/page/home/home?storeId=" + id
      }
    } else {
      Api.showToast('请进入店铺，再分享给好友')
    }
  }
})