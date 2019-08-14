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
    API.uploadImage().then(res=>{
      this.setData({
        url:res[0],
        showUrl: this.data.base + res[0]
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
    if(url){
      API.uploadVoucher({
        orderNumber: num,
        payVoucher: this.data.url,
        voucherDesc: txt
      }).then(res => {
        API.showToast(res.message)
        if (res.success) {
          let pages = getCurrentPages();
          let prevPage = pages[pages.length - 2];
          prevPage.setData({
            orderSuccessHiddenBtn:true
          })
          setTimeout(() => {
            wx.navigateBack()
          }, 800)
        }
      })
      
    }else{
      API.showToast('请上传付款凭证')
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      num:options.num,
      base: app.globalData.imageUrl
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