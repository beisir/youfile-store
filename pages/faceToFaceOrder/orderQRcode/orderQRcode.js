// pages/faceToFaceOrder/orderQRcode/orderQRcode.js
import API from "../../../utils/api.js";
import util from '../../../utils/util.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods:[{
      goodsName: 121231

    }, {
        goodsName: "121a's 121a's 阿斯达按说 231121a's 阿斯达按说 231121a's 阿斯达按说 231121a's 阿斯达按说 231阿斯达按说 231"

      }
    ]
  },
  getData() {
    API.ftfAdminOrderDetail({ orderNumber: this.data.code }).then(res => {


      try {
        res.obj.payDate = util.formatTime(new Date(res.obj.payDate));
        res.obj.createDate = util.formatTime(new Date(res.obj.createDate));
        res.obj.finishDate = util.formatTime(new Date(res.obj.finishDate));
        res.obj.cancelDate = util.formatTime(new Date(res.obj.cancelDate));
      } catch (e) { }

      this.setData({
        order: res.obj
      })
      //倒计时
      let timm = this.data.timeOnce;
      if (timm) {
        util.count_down(this, res.obj.timeoutExpressSecond ? res.obj.timeoutExpressSecond * 1000 : "")
        this.setData({ timeOnce: false })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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