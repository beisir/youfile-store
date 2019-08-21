import Api from '../../../utils/api.js'
const app = getApp();
const util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataArr:[]
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
  getData: function () {
    var _this = this
    Api.getAccountin().then(res => {
      var detailList = res.obj.result
      if (Api.isNotEmpty(detailList)) {
        for (var i = 0; i < detailList.length;i++){
          detailList[i].inAccountDate = util.formatTime(new Date(detailList[i].inAccountDate))
        }
        var datas = _this.data.dataArr,
          newArr = app.pageRequest.addDataList(datas, detailList)
        _this.setData({
          dataArr: newArr
        })
      } else {
        Api.showToast("暂无更多数据了！")
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  initData:function(){
    this.setData({
      dataArr: []
    })
    app.pageRequest.pageData.pageNum = 0
    this.getData()
  },
  onShow: function () {
    this.initData()
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
    this.getData()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})