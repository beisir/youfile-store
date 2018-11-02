import Api from '../../../../utils/api.js'
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detailList: [],
    value: '',
    baseUrl: app.globalData.imageUrl,
  },
  click: function () {
    var that = this;
    var show;
    wx.scanCode({
      success: (res) => {
        var userId = res.result
        if (userId!="*") {
          var userId = userId.split("user_")[1]
          Api.showMerchant({ userId: userId })
            .then(res => {
              var status = res.obj.status
              if (status) {
                Api.newUserInfor({ userId: userId })
                  .then(res => {
                    var accept = res.obj.id,
                      phone = res.obj.mobile,
                      userName = res.obj.userName,
                      storeId = wx.getStorageSync("storeId")
                    var pic = that.data.baseUrl + res.obj.headPic
                    if (status == 2) {
                      wx.navigateTo({
                        url: '/pages/businessFriend/merchant/reach/reach?accept=' + accept,
                      })
                    }
                    if (status != 2) {
                      if (status == 3) {
                        status = 0
                      }
                      wx.navigateTo({
                        url: '../merchantInfo/merchantInfo?status=' + status + '&send=' + storeId + '&accept=' + accept + '&remark=&greet=&name=' + userName + '&logo=' + pic + '&phone=' + phone,

                      })
                    }
                  })
              }
            })
        }else{
          Api.showToast("未获取信息！")
        }
      },
      fail: (res) => {
        // Api.showToast("扫码失败")
      },
      complete: (res) => {
      }
    })
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
  searchBtn: function (e) {
    var val = e.detail.value
    wx.navigateTo({
      url: '../serList/serList?value=' + val,
    })
  },
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