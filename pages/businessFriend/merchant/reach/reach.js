import Api from '../../../../utils/api.js'
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userId:'',
    showMes:false,
    name:'',
    baseUrl: app.globalData.imageUrl,
    deleteUser:false
  },
  // 删除商友关系
  deleteFriend: function () {
    this.setData({
      deleteUser: true
    })
  },
  cancel:function(){
    this.setData({
      deleteUser:false
    })
  },
  // 确定删除
  conSpecName:function(){
    var _this = this,
      userId = this.data.userId,
      data = {}
    data.purchaserUserId = userId
    Api.deleteUser(data)
      .then(res => {
        Api.showToast(res.message)
        setTimeout(() => {
          wx.navigateBack()
        }, 1000)
      })
  },
  // 电话
  call(){
    if (this.data.phone){
      wx.makePhoneCall({
        phoneNumber: this.data.phone,
      })
    }
  },
 
  /**
   * 生命周期函数--监听页面加载
   */
  getMession: function (data) {
    var _this = this
    Api.remakInfo(data)
      .then(res => {
        var obj = res.obj
        if (obj != null) {
          _this.setData({
            buyAmount: obj.countData.buyAmount,
            buyTimes: obj.countData.buyTimes,
            recentBuy: obj.countData.recentBuy,
            name: obj.name==null? '' : obj.name,
            note: obj.note == null ? '' : obj.note,
            birthday: obj.birthday == null ? '' : obj.birthday,
            phone: obj.phone == null ? '' : obj.phone,
            headPic:obj.headPic,
            nickName: obj.nickName == null ? '' : obj.nickName,
            remark: obj.remark == null ? '' : obj.remark,
            wechart: obj.wechart == null ? '' : obj.wechart,
          })
        }
      })
  },
  onLoad: function (options) {
    var accept = options.accept
    this.setData({
      userId: accept
    })
    this.getMession({purchaserUserId : accept})
    if (options.code){
      this.setData({
        showMes: true
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  urlHome: function () {
    wx.switchTab({
      url: '../../../page/home/home'
    })
  },
  passFunc: function () {

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1]
    if (currPage.data.userId) {
      this.getMession({ purchaserUserId: currPage.data.userId })
    }
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


})