import Api from '../../../../utils/api.js'
const util = require('../../../../utils/util.js');
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
    descShow:false,
    baseUrl: app.globalData.imageUrl,
    sortKey: '',
    sortValue: ''
  },
  emptyArr: function () {
    var _this = this
    this.setData({
      detailList: [],
      totalCount: 0
    },function(){
      app.pageRequest.pageData.pageNum = 0
      _this.getList()
    });
  },
  swichNav: function (e) {
    var that = this,
      descShow = this.data.descShow
    if (this.data.currentTab === e.target.dataset.current) {
      if (e.target.dataset.current == 0) {
        that.setData({
          descShow: !descShow
        }, function () {
          that.emptyArr()
        })
      }
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current,
      }, function () {
        that.emptyArr()
      })
    }

    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current,
      }, function () {
        
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
    var val = this.data.value
    if (!val) { return }
    this.emptyArr()
  },
  getList: function () {
    var _this = this,
      value = this.data.value,
      sortKey = 'totalAmount',
      sortValue = '',
      descShow = this.data.descShow,
      currentTab = this.data.currentTab
    if (currentTab == 0) {
      if (descShow) {
        sortValue = 'desc'
      } else {
        sortValue = 'asc'
      }
      sortKey = 'totalAmount'
    }
    if (currentTab == 1) {
      sortKey = 'latelyTradeDate'
    }
    if (currentTab == 2) {
      sortKey = 'tradeNum'
    }
    var data = { orderCategory: 1 }
    data["sortKey"] = sortKey
    data["keyWords"] = value
    data["sortValue"] = sortValue
    Api.dealUser(data)
      .then(res => {
        var detailList = res.obj.result,
          totalCount = res.obj.totalCount
        if (Api.isNotEmpty(detailList)) {
          for (var i = 0; i < detailList.length; i++) {
            if (Api.isNotEmpty(detailList[i].latelyTradeDate)){
              var time = util.formatTime(new Date(detailList[i].latelyTradeDate))
              detailList[i].latelyTradeDate = time.split(" ")[0]
            }else{
              detailList[i].latelyTradeDate=''
            }
          }
        }
        _this.setData({
          totalCount: totalCount
        })
        if (detailList != null) {
          var datas = _this.data.detailList,
            newArr = app.pageRequest.addDataList(datas, detailList)
          _this.setData({
            detailList: newArr,
          })
        }
      })
  },
  onShow: function () {
    this.emptyArr()
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
    wx.stopPullDownRefresh();
    this.emptyArr()
  },

  /**
   * 页面上拉事件的处理函数
   */
  onReachBottom: function () {
    this.getList()
  },


})