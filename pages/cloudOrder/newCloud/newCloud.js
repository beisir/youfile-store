// pages/cloudOrder/newCloud/newCloud.js
const Api = require("../../../utils/api.js");
import { indexUrl} from "../../../utils/const.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    src: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    Api.userInfor().then(res => {
      if (res.obj) {
        let id = res.obj.id;
        this.setData({
          src: indexUrl + "?user=" + id
        })
      } else {
        this.setData({
          src: indexUrl
        })
      }
    }).catch(e => {
      this.setData({
        src: indexUrl
      })
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