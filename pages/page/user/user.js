// pages/user/user.js
import Api from '../../../utils/api.js';
var app = getApp();
function getIdentity(_this) {
  if (Api.isEmpty(wx.getStorageSync("access_token"))) {
    Api.userIdentity()
      .then(res => {
        var obj = res.obj,
          isStoreOwner = obj.isStoreOwner,
          isPurchaser = obj.isPurchaser
        if (isStoreOwner) {
          wx.setStorage({
            key: 'admin',
            data: 2, //1yon 2店主  3批发商
          })
          _this.setData({
            limitShow: 2
          })
        }
        if (isPurchaser) {
          wx.setStorage({
            key: 'admin',
            data: 3,
          })
          wx.setTabBarItem({
            index: 1,
            text: '进货车',
            iconPath: '/image/22.png',
            selectedIconPath: '/image/21.png'
          })
          _this.setData({
            limitShow: 2,
          })
        }
        if (!isPurchaser && !isStoreOwner) {
          wx.setStorage({
            key: 'admin',
            data: 1,
          })
          _this.setData({
            limitShow: 1
          })
        }
        _this.getUser()
      })
  } else {
    _this.getUser()
  }
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasUser: false,
    limitShow:1,
  },

  showLogin() {
    this.selectComponent("#login").showPage();
  },
  getUser() {
    app.http.getRequest("/api/user/byuserid").then((res) => {
      if (res.obj) {
        this.setData({
          user: res.obj,
          hasUser: true
        })
      }else{
        this.setData({
          user: "",
          hasUser: false
        })
      }
    }).catch(e => {
      this.setData({
        user: "",
        hasUser: false
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      baseUrl: app.globalData.imageUrl
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
    
    getIdentity(this)
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