import Api from "../../../utils/api.js";
import util from '../../../utils/util.js'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabSwitchShow: true,
    tabSwitch: "0",
    activityNumber: '1903260301000010',
    listData: [],
    baseUrl: app.globalData.imageUrl,
    releaseStatus: "init"
  },
  // 编辑
  editGoods: function(e) {
    var id = e.target.dataset.id,
      activityNumber = this.data.activityNumber
    console.log('../editGoods/editGoods?id' + id + "&activityNumber=" + activityNumber)
    wx.navigateTo({
      url: '../editGoods/editGoods?id' + id + "&activityNumber=" + activityNumber,
    })
  },
  // 切换抢购商品
  tabSwitch: function(e) {
    var index = e.target.dataset.index,
    _this=this
    if (index == "1") {
      this.setData({
        tabSwitchShow: false,
        releaseStatus:'release'
      })
    } else {
      this.setData({
        tabSwitchShow: true,
        releaseStatus: "init"
      })
    }
    this.setData({
      tabSwitch: index
    },function(){
      _this.initData()
      _this.getGoodsList(_this.data.activityNumber)
    })
  },
  initData:function(){
    app.pageRequest.pageData.pageNum = 0
    this.setData({
      listData: []
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.activityNumber) {
      this.initData()
      this.getDetails(options.activityNumber)
      this.getGoodsList(options.activityNumber)
      this.setData({
        activityNumber: options.activityNumber
      })
    }
    this.getGoodsList("1903260301000010")
    this.getDetails("1903260301000010")
  },
  // 获取活动xiangq和活动下的列表
  getDetails: function(activityNumber) {
    var _this = this
    Api.activeDetails({
      activityNumber: activityNumber
    }).then(res => {
      var obj = res.obj
      obj.startTime = util.formatTimeday(new Date(obj.startTime))
      obj.endTime = util.formatTimeday(new Date(obj.endTime))
      _this.setData({
        activeDetails: obj
      })
    })
  },
  getGoodsList: function(activityNumber) {
    var _this = this
    Api.activityGoods({
      activityNumber: activityNumber,
      releaseStatus: this.data.releaseStatus
    }).then(res => {
      console.log(res)
      if (res.obj) {
        var listData = res.obj.result
        var datas = _this.data.listData,
          newArr = app.pageRequest.addDataList(datas, listData)
        _this.setData({
          listData: newArr
        })
      }
    })
  },
  // 发布商品
  releaseGood: function(e) {
    var goodsId = e.target.dataset.id,
      activityNumber = this.data.activityNumber
    Api.releaseGoods({
      goodsId: goodsId,
      activityNumber: activityNumber
    }).then(res => {
      console.log(res)
    })
  },
  // 添加活动商品
  addGoods: function() {
    wx.navigateTo({
      url: '../addGoods/addGoods?activityNumber=' + this.data.activityNumber,
    })
  },
  // 批量发布商品
  releaseGoods: function() {
    wx.navigateTo({
      url: '../batchRalease/batchRalease?activityNumber=' + this.data.activityNumber,
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    this.getGoodsList(this.data.activityNumber)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})