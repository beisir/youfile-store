import Api from '../../../../utils/api.js'
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    watchInput: false,
    value: '',
    addSpec: false,
    userId:'',
    mobile:'',
    baseUrl: app.globalData.imageUrl,
    data:'',
    ifWholesaler:true
  },
  calling: function () {
    var mobile = this.data.data.mobile
    wx.makePhoneCall({
      phoneNumber: mobile,
      success: function () {
      },
      fail: function () {
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this=this
    this.setData({
      userId: options.userId,
      mobile: options.mobile ? options.mobile:""
    })
    if (options.userId){
      _this.getUserDetails({ userId: options.userId })
    }
    //门店订单
    if (options.entry == "faceOrder") {
      this.setData({
        faceOrderIn: true,
        entry: 'ftf'
      })
    }
  },
  // 获取信息
  getUserDetails:function(data){
    var _this=this
    Api.newUserInfor(data)
      .then(res => {
        var obj = res.obj
        _this.setData({
          data: obj
        })
      })
  },
  // 监听input
  watchInput: function (event) {
    if (event.detail.value == '') {
      this.setData({
        watchInput: false,
        value: '',
      })
    } else {
      this.setData({
        watchInput: true,
        value: event.detail.value,
      })
    }
  },
  setName: function () {
    if (this.data.value != '') {
      this.setData({
        watchInput: true,
      })
    }
    this.setData({
      addSpec: true,
    })
  },
  // 取消
  cancel: function () {
    this.setData({
      addSpec: false
    })
  },
  confirm: function () {
    var _this = this,
      remark = this.data.value,
      userId = this.data.userId
    if (remark!=''){
      Api.setUserName({ userId: userId, remark: remark })
        .then(res => {
          wx.showToast({
            title: res.message,
            icon: 'none',
            duration: 1000,
            mask: true,
          })
        })
      this.cancel()
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
    //门店订单
    if (this.data.entry === 'ftf'){
      Api.ifWholesaler({ userId: this.data.userId }).then(res => {
        if (res.obj.isPurchaser) {
          this.setData({ ifWholesaler: true })
        } else {
          this.setData({ ifWholesaler: false })
        }
      })
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