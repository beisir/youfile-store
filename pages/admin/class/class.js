const app = getApp();
import Api from '../../../utils/api.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  getList:function(){
    var that = this
    Api.classList()
      .then(res => {
        const obj = res.obj
        for (var i = 0; i < obj.length; i++) {
          obj[i].selected = false
        }
        that.setData({
          list: obj
        })
      })
  },
  onLoad: function (options) {
    this.getList()
  },
  // 新建分类
   watchInput: function (event) {
    if (event.detail.value == '') {
      this.setData({
        watchInput: false
      })
    } else {
      this.setData({
        watchInput: true,
        value: event.detail.value
      })
    }
  },
  addClass: function (e) {
    this.setData({
      show: true,
      value: ''
    })
  },
  cancel: function () {
    this.setData({
      show: false
    })
  },
  confirm: function () {
    var _this = this,
      tempArr = {},
      name = this.data.value
    if (_this.data.watchInput){
      Api.addClass({ name: name })
        .then(res => {
          const obj = res.obj
          Api.showToast("新建成功")
          _this.cancel()
          _this.getList()
        })
    }
   
  },
  manaClass:function(){
    var model = JSON.stringify(this.data.list);
    wx.navigateTo({
      url: '../classEdit/classEdit?model=' + model,
    })
  },
  classList:function(e){
    var code = e.target.dataset.code,
        name=e.target.dataset.name
        wx.navigateTo({
          url: '../../page/classList/classList?name='+name+'&code='+code
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