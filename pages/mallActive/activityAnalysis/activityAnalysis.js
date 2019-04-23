const app = getApp();
var wxCharts = require('../../../utils/wxcharts.js');
var lineChart = null;
var startPos = null;
import Api from "../../../utils/api.js";
import util from "../../../utils/util.js";
var rate = 0;
var canvasWidth = 0;
var canvasHeight = 0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseUrl: app.globalData.imageUrl,
    activeGoods:[],//商品销量榜
    customData:[],//进货商排行榜
    activityNumber: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.title){
      this.setData({
        title: options.title
      })
    }
    if (options.status){
      var status=options.status
      if (status =='finish'){
        status = "活动已结束"
      }
      if (status == 'be_doing') {
        status = "活动进行中"
      }
      this.setData({
        status: status
      })
    }
    if (options.activityNumber){
      this.getSalesList(options.activityNumber)
      this.getAnalysisAGoods(options.activityNumber)
    }
    
  },
  onShow:function(){
  
  },
  touchHandler: function (e) {
    lineChart.scrollStart(e);
  },
  moveHandler: function (e) {
    lineChart.scroll(e);
  },
  touchEndHandler: function (e) {
    lineChart.scrollEnd(e);
    lineChart.showToolTip(e, {
      format: function (item, category) {
        return category + ' ' + item.name + ':' + item.data
      }
    });
  },
  createSimulationData: function (arr) {
    var categories = [];
    var data = [];
    var mindata = Math.min.apply(Math, arr.map(function (o) {
      return o.salesDate
    }))
    var maxdata = Math.max.apply(Math, arr.map(function (o) {
      return o.salesDate
    }))
    var time = (maxdata - mindata) / 3600/1000
    if (time>24){
      for (var a of arr) {
        categories.push(util.formatMD(new Date(a.salesDate)))
        data.push(a.salesVolume)
      }
    }else{
      for (var a of arr) {
        categories.push(util.formatHour(new Date(a.salesDate)))
        data.push(a.salesVolume)
      }
    }
    this.initStatic({
      categories: categories,
      data: data
    })
  },
  // 初始化统计表
  initStatic: function (obj) {
    var windowWidth = app.systemInfo.screenWidth-20;
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = app.systemInfo.screenWidth-20
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }

    var simulationData = obj
    lineChart = new wxCharts({
      canvasId: 'lineCanvas',
      type: 'line',
      categories: simulationData.categories,
      animation: true,
      series: [{
        name: '成交量',
        data: simulationData.data,
        format: function (val, name) {
          return val.toFixed(2) + '元';
        }
      }],
      xAxis: {
        disableGrid: false,
      },
      yAxis: {
        // title: '成交金额 (元)',
        format: function (val) {
          return val.toFixed(2);
        },
        min: 0
      },
      width: windowWidth,
      height: 260,
      dataLabel: true,
      dataPointShape: true,
      enableScroll: true,
      extra: {
        lineStyle: ''//curve
      }
    });
  },
  // 获取统计店铺销售量列表 和商品销售总额
  getSalesList: function (activityNumber){
    var _this=this
    Api.saleActiveList({ activityNumber: activityNumber}).then(res=>{
      if (res.obj){
        _this.createSimulationData(res.obj)
      }
    })
    Api.statisticSales({ activityNumber: activityNumber }).then(res => {
      _this.setData({
        total:res.obj
      })
    })
  },
  // 获取商品销量排行榜
  getAnalysisAGoods: function (activityNumber){
    var _this=this
    Api.aAnalysisAGoods({ activityNumber: activityNumber, limit :10}).then(res=>{
      _this.setData({
        activeGoods:res.obj
      })
    })
    Api.aAnalysisCustom({ activityNumber: activityNumber, limit: 10 }).then(res => {
      _this.setData({
        customData: res.obj
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

})