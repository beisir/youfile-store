// pages/role/supplyVoucher/supplyVoucher.js
const app = getApp();
import API from '../../../utils/api.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url:"",
    val:""
  },
  choseImg(){

    // wx.chooseImage({
    //   count:1,
    //   success: (res)=> {
    //     var tempFilePaths = res.tempFilePaths
    //     this.setData({
    //       url: tempFilePaths
    //     })
        
    //   }
    // })
    app.http.chooseImage().then(res=>{
      res = JSON.parse(res)
      this.setData({
        url:res.obj,
        showUrl: this.data.base + res.obj
      })
    });
  },
  showImg(){
    wx.previewImage({
      urls: [this.data.url],
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
    let url = this.data.url,
        txt = this.data.val.trim(),
        num = this.data.num;
    if(url && txt){
      API.uploadVoucher({
        orderNumber: num,
        payVoucher: this.data.url,
        voucherDesc: txt
      }).then(res => {
        wx.showToast({
          title: res.message,
          icon: 'none'
        })
        if (res.success) {
          setTimeout(() => {
            wx.navigateBack()
          }, 800)
        }
      })
      
    }else{
      wx.showToast({
        title: '请上传凭证并填写描述',
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      num:options.num,
      base:"https://dev.image.youlife.me/"
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