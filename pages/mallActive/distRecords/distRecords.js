import Api from "../../../utils/api.js";
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userId:"899898",
    lastDay:"8989989"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initData()
    this.getDetails("8975878787")
    this.getTransList()
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
  // 初始化数据
  initData: function () {
    var _this = this
    app.pageRequest.pageData.pageNum = 0
    this.setData({
      result: []
    })
  },
  // 获取进货商数据详情
  getDetails:function(userId){
    var _this=this
    Api.statPurchasersDetails({ userId: userId}).then(res=>{
      console.log(res)
    })
  },
  // 获取进货商交易记录
  getTransList: function (){
    var _this=this,
      lastDay = this.data.lastDay,
      userId = this.data.userId
    Api.purchaserTrans({ userId: userId, lastDay: lastDay}).then(res=>{
      if(res.obj){
        var detailList = res.obj.result,
          datas = _this.data.result,
          newArr = app.pageRequest.addDataList(datas, detailList)
        _this.setData({
          result: newArr,
        })
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})