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
    activityNumber: '',
    listData: [],
    confirm:false,
    baseUrl: app.globalData.imageUrl,
    releaseStatus: "init",
    loadData: false
  },
  // 分享
  share(e) {
    this.setData({
      shareItem: e.currentTarget.dataset.item 
    })
    this.selectComponent("#shareway").open();
  },
  closeBootom(){
    this.selectComponent("#shareway").close();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.activityNumber) {
      this.setData({
        activityNumber: options.activityNumber,
        loadData:true
      })
    }
  },
  /**
  * 生命周期函数--监听页面显示
  */
  onShow: function () {
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1]
    if (currPage.data.status) {
      this.setData({
        tabSwitch: 1,
        releaseStatus: "release"
      },function(){
        this.initData()
        this.getGoodsList(this.data.activityNumber)
      })
    }else{
      if (this.data.loadData) {
        this.initData()
        this.getDetails(this.data.activityNumber)
        this.getGoodsList(this.data.activityNumber)
      }
    }
  },

  // 编辑
  editGoods: function (e) {
    var id = e.target.dataset.id,
      activityNumber = this.data.activityNumber
    wx.navigateTo({
      url: '../editGoods/editGoods?goodsId=' + id + "&activityNumber=" + activityNumber,
    })
  },
  // 切换抢购商品
  tabSwitch: function (e) {
    var index = e.target.dataset.index,
      _this = this
    if (index == "1") {
      this.setData({
        tabSwitchShow: false,
        releaseStatus: 'release'
      })
    } else {
      this.setData({
        tabSwitchShow: true,
        releaseStatus: "init"
      })
    }
    this.setData({
      tabSwitch: index
    }, function () {
      _this.initData().then(()=>{
        _this.getGoodsList(_this.data.activityNumber)
      })
    })
  },
  initData: function () {
    app.pageRequest.pageData.pageNum = 0
    return new Promise((resolve,reject)=>{
      this.setData({
        listData: []
      },()=>{
        resolve()
      })
    })
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
        participate: obj.participate,
        activeDetails: obj
      })
    })
  },
  getGoodsList: function(activityNumber) {
    if(this.data.loadingList){return}
    this.setData({ loadingList: true})
    var _this = this
    Api.activityGoods({
      activityNumber: activityNumber,
      releaseStatus: this.data.releaseStatus
    }).then(res => {
      if (res.obj) {
        var listData = res.obj.result
        var datas = _this.data.listData,
          newArr = app.pageRequest.addDataList(datas, listData)
        _this.setData({
          listData: newArr
        },()=>{
          this.setData({ loadingList: false })
        })
      }else{
        this.setData({ loadingList: false })
      }
    }).catch(e=>{
      this.setData({ loadingList: false })
    })
  },
  // 发布商品
  releaseGood: function(e) {
    var goodsId = e.target.dataset.id
    this.setData({
      goodsId: goodsId,
      confirm:true
    })
  },
  confirmRalease:function(){
    var _this=this,
      goodsId = this.data.goodsId,
      activityNumber = this.data.activityNumber
    Api.releaseGoods({
      goodsId: goodsId,
      activityNumber: activityNumber
    }).then(res => {
      Api.showToast("发布成功！")
      setTimeout(res=>{
        _this.setData({
          confirm: false
        })
        _this.onShow()
      },500)
    })
  },
  // 添加活动商品
  addGoods: function() {
    wx.navigateTo({
      url: '../addGoods/addGoods?activityNumber=' + this.data.activityNumber,
    })
  },
  joinAct:function(){
    // 参加活动
    this.setData({
      joinShow: true,
    })
  },
  // 参加活动
  joinActive: function () {
    var _this = this,
      activityNumber = this.data.activityNumber
    Api.participate({ activityNumber: activityNumber }).then(res => {
      Api.showToast(res.message)
      setTimeout(res => {
        _this.onShow()
        _this.setData({
          joinShow: false,
        })
      }, 500)
    })
  },
  // 批量发布商品
  releaseGoods: function() {
    wx.navigateTo({
      url: '../batchRalease/batchRalease?activityNumber=' + this.data.activityNumber,
    })
  },
  // 查看商品详情
  lookDetails: function (e) {
    var goodsId = e.target.dataset.id
    wx.navigateTo({
      url: '/pages/page/goodsDetails/goodsDetails?goodsId=' + goodsId,
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

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
  onShareAppMessage: function(e) {
    var storeId = Api.getThisStoreId()
    if (e.from === 'button') {
      var goodsId = e.target.dataset.id,
        img = e.target.dataset.img,
        goodsName = e.target.dataset.name
      return {
        title: goodsName,
        path: '/pages/page/goodsDetails/goodsDetails?goodsId=' + goodsId + "&storeId" + storeId,
        imageUrl: img,
        success: (res) => { },
        fail: (res) => { }
      }
    } else {
      return {
        path: '/pages/page/home/home?storeId=' + storeId,
        success: (res) => { },
        fail: (res) => { }
      }
    }
    this.closeBootom()
  }
})