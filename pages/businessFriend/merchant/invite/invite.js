import Api from '../../../../utils/api.js'
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    accept: '',
    baseUrl: app.globalData.imageUrl,
    headPic:'',
    storeName:'',
    allName:'',
    name:''
  },
  goBack: function () {
    wx.navigateBack({
      delta: 1
    })
  },
  emptyVal: function () {
    this.setData({
      allName: ''
    })
  },
  searchBtn: function (e) {
    var val = e.detail.value
    this.setData({
      allName: val,
    })
  },
  invita: function () {
    var _this = this,
      accept = this.data.accept,
      greet = this.data.allName,
      send = wx.getStorageSync('storeId'),
      remark = this.data.remark
    if (Api.isNotEmpty(remark)){
      var data = { accept: accept, send: send, greet: greet, remark: remark }
    }else{
      var data = { accept: accept, send: send, greet: greet, remark:'' }
    }
    Api.apply(data)
      .then(res => {
        wx.showToast({
          title: '发送成功',
          icon: 'none',
          duration: 1000,
          mask: true
        })
        wx.navigateTo({
          url: '../newMerchant/newMerchant',
        })
      })
      .catch(res => {
        var data = res.data
        if (data.code){
          if (data.code =="004"){
            Api.showToast(data.message)
            setTimeout(function () {
              _this.goBack()
            }, 1000)
          }
        }
      })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  getStoreName:function(){
    var _this=this
    Api.getStoreName()
    .then(res=>{
      var storeName = res.obj.name
      _this.setData({
        allName: "我是" + storeName +"，我的优店，精挑细选优质商品，快来和我一起赚钱吧！"
      })
    })
  },
  onLoad: function (options) {
    this.getStoreName()
    if (options.headPic){
      this.setData({
        headPic: options.headPic,
      })
    }
    if(options.name){
      this.setData({
        name:options.name
      })
    }
    this.setData({
      accept: options.accept,
      remark: options.remark
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

})