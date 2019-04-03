import Api from "../../../utils/api.js";
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsId:'',
    goodsStatus:"1",//上架商品
    activityNumber:'',
    joinShow:false,
    baseUrl: app.globalData.imageUrl,
    result: [],
    goodsIndex:'',
    value:'',
    hiddenClose:true
  },
  // 清空
  emptyInput:function(){
    this.setData({
      value:'',
      hiddenClose: true
    })
  },
  searchInput:function(e){
    var val = e.detail.value
    if(val.length>0){
      this.setData({
        hiddenClose:false
      })
    }else{
      this.setData({
        hiddenClose: true
      })
    }
    this.setData({
      value: val
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this=this
    if (options.activityNumber){
      this.setData({
        activityNumber: options.activityNumber
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
  // 初始化数据
  initData: function () {
    var _this = this
    app.pageRequest.pageData.pageNum = 0
    this.setData({
      result: []
    }, function () {
      _this.getList()
    })
  },
  // 获取商品
  getList: function () {
    var _this = this
    Api.allGoods({
      activityNumber: _this.data.activityNumber,
      keyword: _this.data.value,
      goodsStatus: this.data.goodsStatus
    })
      .then(res => {
        var obj = res.obj.result
        if (obj) {
          if (obj.length == 0) {
            Api.showToast("暂无更多了！")
          } else {
            var datas = _this.data.result,
              newArr = app.pageRequest.addDataList(datas, obj)
            _this.setData({
              result: newArr,
            })
          }
        }
      })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  },
  // 添加商品
  addActiveShow:function(e){
    this.setData({
      goodsId:e.target.dataset.id,
      goodsIndex: e.target.dataset.index,
      joinShow:true
    })
  },
  addActiveGoods:function(){
    var _this=this,
      goodsId = this.data.goodsId,
      activityNumber = this.data.activityNumber,
      result = this.data.result,
      goodsIndex = this.data.goodsIndex
    Api.addActiveGoods({ goodsId: goodsId, activityNumber: activityNumber }).then(res=>{
      Api.showToast(res.message)
      result[goodsIndex].participate=true
      goodsIndex
      _this.setData({
        joinShow:false
      },function(){
       _this.setData({
         result: result
       })
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