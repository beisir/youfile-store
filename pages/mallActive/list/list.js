import Api from '../../../utils/api.js'
import util from '../../../utils/util.js'
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listData:[],
    navData: [{ name: "全部", index: "" }, { name: "未开始", index: "init" }, { name: "进行中", index: "be_doing" }, { name: "已结束", index: "finish" }],
    navIndex:"",
    mallCode:"1000",
    joinShow:false,
    joinNumber:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  // 活动分析
  activityAnalysis:function(){
    wx.navigateTo({
      url: '../activityAnalysis/activityAnalysis',
    })
  },
  // 编辑商品
  editGoods:function(){
    wx.navigateTo({
      url: '../editGoods/editGoods',
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  // 切换tab
  clickNav:function(e){
    var index=e.target.dataset.index,
    _this=this
    this.setData({
      navIndex:index
    },function(){
      _this.initData()
    })
  },
  getList:function(){
    var _this=this
    Api.activityList({
      mallCode: this.data.mallCode, activityStatus: this
      .data.navIndex}).then(res=>{
      var listData = res.obj.result
      for (var v of listData){
        v.startTime = util.formatTimeday(new Date(v.startTime))
        v.endTime = util.formatTimeday(new Date(v.endTime))
      }
      var datas = _this.data.listData,
        newArr = app.pageRequest.addDataList(datas, listData)
      _this.setData({
        listData: newArr
      })
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  initData:function(){
    app.pageRequest.pageData.pageNum = 0
    this.setData({
      listData:[]
    })
    this.getList()
  },
  onShow: function () {
    this.initData()
  },
  // 参加活动
  joinShow: function (e){
    var activityNumber = e.target.dataset.index
    this.setData({
      joinShow: true,
      joinNumber: activityNumber
    })
  },
  joinActive:function(){
    var _this=this,
      activityNumber = this.data.joinNumber
    Api.participate({ activityNumber: activityNumber}).then(res=>{
      Api.showToast("参加活动成功！")
      _this.initData()
      _this.setData({
        joinShow: false,
      })
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
    this.getList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})