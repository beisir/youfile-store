const app = getApp();
import Api from '../../../utils/api.js'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    switch1Change:true,
    switch2Change: true,
    watchInput: false,
    value:'',
    value1:'',
    together:false,
    batch:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  // 开关
  switch1Change: function (e) {
    if (e.detail.value){
      this.setData({
        switch1Change:false
      })
    }else{
      this.setData({
        switch1Change: true
      })
    }
  },
  switch2Change: function (e) {
    if (e.detail.value) {
      this.setData({
        switch2Change: false
      })
    } else {
      this.setData({
        switch2Change: true
      })
    }
  },
  onLoad: function (options) {
  
  },
  // 取消
  cancel: function () {
    this.setData({
      together: false,
      batch: false
    })
  },
  // 监听input
  watchInput: function (event) {
    console.log(event.detail.value)
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
  watchInput1: function (event) {
    if (event.detail.value == '') {
      this.setData({
        watchInput: false
      })
    } else {
      this.setData({
        watchInput: true,
        value1:event.detail.value
      })
    }
  },
  togetherFun:function(){
    console.log(this.data.value)
    this.setData({
      together: true,
    })
  },
  batchFun: function () {
    this.setData({
      batch: true,
    })
  },
  setSuccess:function(){
    wx.showToast({
      title: '设置成功',
      icon: 'none',
      duration: 2000
    })
  },
  setMes: function () {
    wx.showToast({
      title: '请输入有效值',
      icon: 'none',
      duration: 2000
    })
    return
  },
  confirm:function(){
    var _this=this,
      value =this.data.value
    console.log(value)
    if (value==''){
      _this.setMes()
    }else{
      Api.saleBatchNum(value)
        .then(res => {
          _this.cancel()
          _this.setSuccess()
        })
    }
  },
  confirm1: function () {
    var _this = this,
      value = this.data.value1
    if (value == '') {
      _this.setMes()
    } else {
      Api.saleBatchAmount(value)
        .then(res => {
          _this.cancel()
          _this.setSuccess()
        })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getSet()
  },
  // switch1Change: true,
  // switch2Change: true,
  // watchInput: false,
  // value: '',
  // value1: '',
  getSet:function(){
    var _this=this
    Api.saleBatch()
      .then(res => {
        if (res.obj.saleBatchNum) {
          _this.setData({
            switch1Change:false,
            value: res.obj.saleBatchNum
          })
        }
        if (res.obj.saleBatchAmount){
          _this.setData({
            switch2Change: false,
            value1: res.obj.saleBatchAmount
          })
        }
        console.log(res)
        // _this.cancel()
        // _this.setSuccess()
      })
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