// pages/role/supplyVoucher/supplyVoucher.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url:"",
    val:""
  },
  choseImg(){

    wx.chooseImage({
      count:1,
      success: (res)=> {
        var tempFilePaths = res.tempFilePaths
        this.setData({
          url: tempFilePaths
        })
        
      }
    })

  },
  showImg(){
    wx.previewImage({
      urls: this.data.url,
    })
  },
  //输入
  input(e){
    let val = e.detail.value;
    this.setData({
      val
    })
  },
  upload(){
    let url = this.data.url.trim(),
        txt = this.data.val.trim();
    if(url && txt){
      wx.uploadFile({
        url: 'https://example.weixin.qq.com/upload', //仅为示例，非真实的接口地址
        filePath: tempFilePaths[0],
        name: 'file',
        formData: {
          'user': 'test'
        },
        success: (res) => {
          var data = res.data
          //do something
        }
      })
    }else{
      
    }
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