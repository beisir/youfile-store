import Api from '../../../../utils/api.js'
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detailList: [],
    value: '',
    totalCount: 0,
    currentTab: -1,
    sortKey: '',
    sortValue: ''
  },
  emptyArr: function () {
    this.setData({
      detailList: [],
      totalCount: 0
    });
  },
  swichNav: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current,
      }, function () {
        that.emptyArr()
        app.pageRequest.pageData.pageNum = 0
        that.getList()
      })
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
  changeValue: function (e) {
    var val = e.detail.value
    this.setData({
      value: val
    })
  },
  searchBtn: function (e) {
    app.pageRequest.pageData.pageNum = 0
    this.emptyArr()
    this.getList()
  },
  getList: function () {
    var _this = this,
      value = this.data.value,
      sortKey = '',
      sortValue = '',
      currentTab = this.data.currentTab
    if (currentTab == 0) {
      sortKey = 'totalAmount'
    }
    if (currentTab == 1) {
      sortKey = 'latelyTradingDate'
    }
    if (currentTab == 2) {
      sortKey = 'tradingNum'
    }
    var data = { orderCategory:1}
    if (sortKey != '') {
      data["sortKey"] = sortKey
      data["sortValue"] = ''
    }
    data["keyWords"] = value
    Api.dealUser(data)
      .then(res => {
        console.log(res)
        var detailList = res.obj.result,
          totalCount = res.obj.totalCount
        console.log(detailList)
        _this.setData({
          totalCount: totalCount
        })
        if (detailList != null) {
          var datas = _this.data.detailList,
            newArr = app.pageRequest.addDataList(datas, detailList)
          _this.setData({
            detailList: newArr,
          })
        } else {
          wx.showToast({
            title: '暂无更多了',
            icon: 'none',
            duration: 1000,
            mask: true
          })
        }
      })
  },
  onShow: function () {
    app.pageRequest.pageData.pageNum = 0
    this.setData({
      detailList: []
    })
    this.getList()
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
    this.setData({
      detailList: [],
      value: ''
    })
    app.pageRequest.pageData.pageNum = 0
    this.getList()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var val = this.data.value
    this.getList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})