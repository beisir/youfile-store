// pages/faceToFaceOrder/helpOrder/helpOrder.js
import API from "../../../utils/api.js";
import { testTel} from "../../../utils/util.js";
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    baseUrl: app.globalData.imageUrl
  },
  getFocusList(){
    API.recentlyFocusUser({num:5}).then(res=>{
      this.setData({
        list:res.obj
      })
    })
  },
  searchInput(e){
    this.setData({
      mobile:e.detail.value
    })
  },
  search(e){
    let tel = this.data.mobile;
    if(testTel(tel)){
      API.searchUserInfoByTel({mobile:tel}).then(res=>{
        if(res.obj){
          this.setData({
            searchUser: res.obj
          })
        }else{
          this.setData({
            searchUser: false
          })
        }
        this.setData({
          afterSearch:true
        })
      })
    }else{
      wx.showToast({
        title: '请输入正确的手机号',
        icon: "none"
      })
    }
  },
  scan(){
    wx.scanCode({
      success:res=>{
        let str = res.result;
        if(str.indexOf("type=user") > -1){
          let arr1 = str.split("&");
          for(let i in arr1){
            let key = arr1[i].split("=")[0];
            if (key == 'userId'){
              let val = arr1[i].split("=")[1];
              wx.navigateTo({
                url: '../../businessFriend/merchant/lookInfo/lookInfo?userId=' + val+'&entry=faceOrder',
              })
              break;
            }
          }
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getFocusList()
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