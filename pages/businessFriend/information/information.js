import Api from '../../../utils/api.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    watchInput: false,
    value:'',
    addSpec:false,
    storeId: wx.getStorageSync('storeId'),
    send:'',
    status:'',
    success: false,
    oneGreet: false,
    aginGreet: false,
    accept:'',
    remark:null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var status = options.status,
        send=options.send,
        storeId = this.data.storeId,
        accept = options.accept,
        remark = options.remark
    this.setData({
      status:status,
      send:send,
      accept: accept,
      remark: remark
    })
  if(status==2){
    this.setData({
      success:true
    })
  }else{
    if (storeId==send) {
      this.setData({
        aginGreet: true
      })
    } else {
      this.setData({
        oneGreet: true
      })
    }
  }
   
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
  setName:function(){
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
  confirm:function(){
    var val = this.data.value,
    status=this.data.status
    if (status==1){

    }else{
      if (val != '') {
        Api.setName({ purchaserUserId: wx.getStorageSync('purchaserUserId'), remark: val })
          .then(res => {
            wx.showToast({
              title: '设置成功',
              icon: 'none',
              duration: 1000,
              mask: true
            })
            this.cancel()
          })
      }
    }
    
  },
  invitation:function(){
    wx.navigateTo({
      url: '../invitation/invitation?accept=' + this.data.accept + "&remark=" + this.data.remark,
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  urlHome: function () {
    wx.switchTab({
      url: '../../page/home/home'
    })
  },
  passFunc:function(){

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