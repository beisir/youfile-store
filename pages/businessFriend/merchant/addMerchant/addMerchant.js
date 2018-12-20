import Api from '../../../../utils/api.js'
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detailList: [],
    value: '',
    samePre: false,
    baseUrl: app.globalData.imageUrl,
  },
  samePreBtn: function () {
    this.setData({
      samePre: false
    })
  },
  click: function () {
    var that = this;
    var show;
    wx.scanCode({
      success: (res) => {
        var qrUrl = res.result
        if (qrUrl) {
          if (qrUrl.indexOf("&userId") == -1) {
            Api.showToast("未获取信息！")
            return
          }
          let type = qrUrl.match(/type=(\S*)&/)[1];
          if (type == "user") {
            let userId = qrUrl.match(/userId=(\S*)/)[1];
            if (Api.isEmpty(userId)) {
              Api.showMerchant({ userId: userId })
                .then(res => {
                  var status = res.obj.status
                  var hasStore = res.obj.hasStore
                  if (hasStore) {
                    var storeNature = res.obj.store.storeNature
                    if (storeNature == 1) {
                      that.setData({
                        samePre: true
                      })
                      return
                    }
                  }
                  if (status) {
                    Api.newUserInfor({ userId: userId })
                      .then(res => {
                        var accept = res.obj.id,
                          phone = res.obj.mobile,
                          userName = res.obj.userName,
                          storeId = Api.getThisStoreId()
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
            } else {
              Api.showToast("未获取信息！")
            }
          } else {
            Api.showToast("未获取信息！")
          }
        } else {
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
  changeValue: function (e) {
    var val = e.detail.value
    this.setData({
      value: val
    })
  },
  searchBtn: function (e) {
    var val = this.data.value
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