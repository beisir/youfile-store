// pages/update/update.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    value:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      value:options.name
    })
  },
  // 清空input的内容
  emptyInput(e) {
    this.setData({
      value: ''
    })
  },
  searchInput(e){
    let val = e.detail.value;
    this.setData({
      value: val
    })
  },
  save(){
    let text = this.data.value;
    if(text){
      app.http.putRequest("/api/user/nickname/" + text).then(res => {
        after(res)
      })
    }else{
      wx.showToast({
        title: '请输入昵称',
        icon: "none"
      })
    }
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