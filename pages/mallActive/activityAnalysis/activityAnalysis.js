const app = getApp();
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
    columnCanvasData: {
      canvasId: 'columnCanvas',
    },
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
      this.initStatic()
    }
  },
  onShow:function(){
  
  },
  // 初始化统计表
  initStatic: function () {
    var systemInfo = app.systemInfo;
    rate = systemInfo.screenWidth / 750;
    var updateData = {};
    canvasWidth = systemInfo.screenWidth - rate * 64;
    canvasHeight = rate * 306 + rate * 44 + rate * 34 + rate * 22;

    var culumnYMax = 100;
    var culumnYMin = 0;
    updateData['columnCanvasData.canvasWidth'] = canvasWidth;
    updateData['columnCanvasData.axisPadd'] = { left: rate * 5, top: rate * 13, right: rate * 5 };
    updateData['columnCanvasData.axisMargin'] = { bottom: rate * 34, left: rate * 26 };
    updateData['columnCanvasData.yAxis.fontSize'] = rate * 22;
    updateData['columnCanvasData.yAxis.fontColor'] = '#637280';
    updateData['columnCanvasData.yAxis.lineColor'] = '#DCE0E6';
    updateData['columnCanvasData.yAxis.lineWidth'] = rate * 5;
    updateData['columnCanvasData.yAxis.dataWidth'] = rate * 62;
    updateData['columnCanvasData.yAxis.isShow'] = true;
    updateData['columnCanvasData.yAxis.isDash'] = true;
    updateData['columnCanvasData.yAxis.minData'] = culumnYMin;
    updateData['columnCanvasData.yAxis.maxData'] = culumnYMax;
    updateData['columnCanvasData.yAxis.padd'] = rate * 306 / (culumnYMax - culumnYMin);

    updateData['columnCanvasData.xAxis.dataHeight'] = rate * 26;
    updateData['columnCanvasData.xAxis.fontSize'] = rate * 18;
    updateData['columnCanvasData.xAxis.fontColor'] = '#637280';
    updateData['columnCanvasData.xAxis.lineColor'] = '#DCE0E6';
    updateData['columnCanvasData.xAxis.lineWidth'] = rate * 5;
    updateData['columnCanvasData.xAxis.padd'] = rate * 52;
    updateData['columnCanvasData.xAxis.dataWidth'] = rate * 64;
    updateData['columnCanvasData.xAxis.leftOffset'] = rate * 40;


    updateData['columnCanvasData.canvasHeight'] = canvasHeight;
    updateData['columnCanvasData.enableScroll'] = true;

    this.setData(updateData);
  },
  initDataBiao: function (arr) {
    var updateData = {};
    var columnYMax = 100;
    var columnYMin = 0;
    var salesDate = [],
      salesVolume = []
    for (var a of arr) {
      salesDate.push(util.formatTimeday(new Date(a.salesDate)))
      if (a.salesVolume==0){
        salesVolume.push(a.salesVolume)
      }else{
        salesVolume.push((a.salesVolume)*0.02)
      }
    }
    updateData['columnCanvasData.yAxis.minData'] = columnYMin;
    updateData['columnCanvasData.yAxis.maxData'] = columnYMax;
    updateData['columnCanvasData.series'] = [{
      data: salesVolume,
    }];
    updateData['columnCanvasData.xAxis.data'] = salesDate;
    updateData['columnCanvasData.yAxis.data'] = [
      { x: 0, y: 0, title: '0' },
      { x: 0, y: 20, title: '1000' },
      { x: 0, y: 40, title: '2000' },
      { x: 0, y: 60, title: '3000' },
      { x: 0, y: 80, title: '4000' },
      { x: 0, y: 100, title: '5000' }
    ];

    this.setData(updateData);
  },
  // 获取统计店铺销售量列表 和商品销售总额
  getSalesList: function (activityNumber){
    var _this=this
    Api.saleActiveList({ activityNumber: activityNumber}).then(res=>{
      if (res.obj){
        _this.initDataBiao(res.obj)
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

  onTouchHandler(e) {
    if (null == this.column_chart) {
      this.column_chart = this.selectComponent("#column-chart");
    }
    this.column_chart.onTouchHandler(e);
  },
  onTouchMoveHandler(e) {
    if (null == this.column_chart) {
      this.column_chart = this.selectComponent("#column-chart");
    }
    this.column_chart.onTouchMoveHandler(e);
  },
  onTouchEndHandler(e) {
    if (null == this.column_chart) {
      this.ccolumn_chart = this.selectComponent("#column-chart");
    }
    this.column_chart.onTouchEndHandler(e);
  },


})