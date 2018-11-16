// pages/user/user.js
import Api from '../../../utils/api.js';
import authHandler from '../../../utils/authHandler.js';
var app = getApp();
function getIdentity(_this) {
  if (authHandler.isLogin()) {
    Api.userIdentity()
      .then(res => {
        var obj = res.obj
        if (obj == "null" || obj == null) {
          wx.setStorageSync("admin", 1)
          _this.setData({
            limitShow: 1
          }, function () {
            _this.getUser()
          })
        }else{
          var isStoreOwner = obj.isStoreOwner,
            isPurchaser = obj.isPurchaser
          if (isStoreOwner) {
            if (obj.storeNature == 1) {
              wx.setStorageSync("admin", 2)
              _this.setData({
                limitShow: 2
              }, function () {
                _this.getUser()
              })
            }
            if (obj.storeNature == 2) {
              wx.setStorageSync("admin", 1)
              _this.setData({
                limitShow: 1
              }, function () {
                _this.getUser()
              })
            }
           
          }
          if (isPurchaser) {
            wx.setStorageSync("admin", 3)
            wx.setTabBarItem({
              index: 2,
              text: '进货车',
              iconPath: '/image/22.png',
              selectedIconPath: '/image/21.png'
            })
            _this.setData({
              limitShow: 3,
            }, function () {
              _this.getUser()
            })
          }
          if (!isPurchaser && !isStoreOwner) {
            wx.setStorageSync("admin", 1)
            _this.setData({
              limitShow: 1
            }, function () {
              _this.getUser()
            })
          }
        }
      })
  } else {
    _this.getUser()
    wx.setStorageSync("admin", 1)
    _this.setData({
      limitShow: 1
    })
  }
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasUser: false,
    limitShow:1,
    indexEmpty: true,
    showCloud: false,
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
        //小云点订单列表
        if (this.data.user.id == "cbced730cc43cead0592fbdd5ef10f99") {
          this.setData({
            showCloud: true
          })
        }else{
          this.setData({
            showCloud: false
          })
        }
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
  addTip: function () {
    var Id = Api.getThisStoreId()
    wx.navigateTo({
      url: '../../businessFriend/information/information?status=0&send=&accept=' + Id + '&remark=&logo=&name=',
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (!Api.getStoreId()) {
      this.setData({
        indexEmpty: false
      })
    }
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

})