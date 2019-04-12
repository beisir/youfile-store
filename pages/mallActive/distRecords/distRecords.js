import Api from "../../../utils/api.js";
import util from '../../../utils/util.js';
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userId:"",
    userDetails: '',
    dayData: [{ val: "近7天", index: 0 }, { val: "近30天", index: 1 }, { val: "全部", index: 2 }],
    datIndex:0,
    result:[],
    baseUrl: app.globalData.imageUrl,
  },
  clickFun:function(e){
    var paymentNumber=e.target.dataset.id
    if (Api.isNotEmpty(paymentNumber)){
      wx.navigateTo({
        url: '../detailsOfCollection/detailsOfCollection?paymentNumber=' + paymentNumber,
      })
    }else{
      Api.showToast("线下交易没有收款明细哦！")
    }
  },
  /** 
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this=this
    if(options.userId){
      _this.setData({
        userId:options.userId
      },function(){
        _this.initData()
      })
    }
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
    },function(){
      _this.getDetails()
      _this.getTransList()
    })
  },
  // 获取进货商数据详情
  getDetails:function(){
    var _this=this,
      userId = this.data.userId
    Api.statPurchasersDetails({ userId: userId}).then(res=>{
      if(res.obj){
        _this.setData({
          userDetails:res.obj
        })
      }
    })
  },
  cickButton:function(e){
    var index=e.target.dataset.index
    var _this=this
    this.setData({
      datIndex:index
    },function(){
      _this.initData()
    })
  },
  // 获取进货商交易记录
  getTransList: function (){
    var _this=this,
      lastDay = this.data.datIndex,
      userId = this.data.userId
    if (lastDay==0){
      lastDay=7
    }
    if (lastDay == 1) {
      lastDay = 30
    }
    if (lastDay == 2) {
      lastDay = ''
    }
    Api.purchaserTrans({ userId: userId, lastDay: lastDay}).then(res=>{
      if(res.obj){
        var detailList = res.obj.orderPage.result,
          datas = _this.data.result
        if (detailList.length==0){
          Api.showToast("暂无更多数据了!")
        }else{
          for (var i of detailList) {
            i.payDate = util.formatTime(new Date(i.payDate));
          }
          var newArr = app.pageRequest.addDataList(datas, detailList)
          _this.setData({
            result: newArr,
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
    this.getTransList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})