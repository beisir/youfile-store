import Api from '../../../utils/api.js';
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    totalCount:0
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
  onShow: function () {
    this.initData()
    this.getData()
    this.getlist()
  },
  // 获取统计云分销数据
  getData:function(){
    var _this=this
    Api.yunStatistics().then(res=>{
      _this.setData({
        staticData:res.obj
      })
    })
  },
  // 初始化数据
  initData: function () {
    var _this = this
    app.pageRequest.pageData.pageNum = 0
    this.setData({
      result: []
    })
  },
  // 进货商汇总列表
  getlist:function(){
    Api.statPurchasers().then(res=>{
      console.log(res)
      if (res.obj) {
        var obj = res.obj.result
        if (obj.length == 0) {
          Api.showToast("暂无更多了！")
        } else {
          var datas = _this.data.result,
            newArr = app.pageRequest.addDataList(datas, obj)
          _this.setData({
            result: newArr,
            totalCount: res.obj.totalCount
          })
        }
      }
    })
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
    this.getlist()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})