// pages/page/manageM/manageM.js
import Api from '../../../utils/api.js';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    globalData: app.globalData,
  },

  getData(){
    Api.getUserInfoAdmin().then(res=>{
        if(res.success){
          this.setData({
            user:res.obj
          })
        }
    })
  },  
  merchantTo(){
    if(!this.data.user){return}
    let data = this.data.user

    if(data.auditStatus){
      wx.navigateTo({
        url: '../../merchantCA/auditStatus/auditStatus',
      })
    } else {
      if (data.entryStepNo){
        let step = 1
        switch (data.entryStepNo){
          case 'step_one': step =2;break;
          case 'step_two': step =3;break;
          case 'step_last': 
            wx.navigateTo({
              url: '../../merchantCA/auditStatus/auditStatus',
            })
          break;
        }
        wx.navigateTo({
          url: '../../merchantCA/commonMsg/commonMsg?merchantType='+data.merchantCharacter+'&step='+step,
        })
      } else {
        wx.navigateTo({
          url: '../../merchantCA/merchantType/merchantType',
        })
      }
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      baseUrl: app.globalData.imageUrl
    })
  },
  goHome: function () {
    wx.switchTab({
      url: '../../page/home/home'
    })
  },
  //打电话
  tel: function () {
    wx.makePhoneCall({
      phoneNumber: app.globalData.servesPhone
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
    this.getData();
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