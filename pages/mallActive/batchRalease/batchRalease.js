import Api from '../../../utils/api.js';
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activityNumber: '',
    result: [],
    baseUrl: app.globalData.imageUrl,
    goodsIds: [],
    goodsIdsLen: 0,
    selectAllStatus: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.activityNumber) {
      this.setData({
        activityNumber: options.activityNumber
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
    Api.adminGoodsStatus({
      goodsStatus: "1"
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
    this.initData()
  },
  // 选择商品
  indexOf(val, arr) {
    for (var i = 0; i < arr.length; i++) {
      if (arr[i] == val) {
        return i;
      }
    }
    return -1;
  },
  remove(val, arr) {
    var index = this.indexOf(val, arr);
    if (index > -1) {
      arr.splice(index, 1);
    }
  },
  selectList(e) {
    const index = e.currentTarget.dataset.index,
      goodId = e.currentTarget.dataset.id,
      datas = this.data.result,
      arr = this.data.goodsIds
    const selected = datas[index].selected;
    if (!datas[index].selected) {
      arr.push(goodId)
    } else {
      this.remove(goodId, arr)
    }
    datas[index].selected = !selected;
    this.setData({
      result: datas,
      goodsIds: arr,
      goodsIdsLen: arr.length
    });
  },
  // 全选
  selectAll(e) {
    var data = this.data.result,
      selectAllStatus = this.data.selectAllStatus,
      arr = this.data.goodsIds
    arr = []
    for (var i = 0; i < data.length; i++) {
      if (selectAllStatus) {
        data[i].selected = false
        arr = []
      } else {
        data[i].selected = true
        arr.push(data[i].id)
      }
    }
    this.setData({
      result: data,
      goodsIds: arr,
      goodsIdsLen: arr.length,
      selectAllStatus: !selectAllStatus
    })
  },
  // 批量添加活动商品
  releaseMoreGoods: function () {
    var _this = this,
      activityNumber = this.data.activityNumber,
      goodsIds = this.data.goodsIds
    if (goodsIds.length>0){
      Api.releaseMoreGoods({ activityNumber: activityNumber, goodsId: goodsIds }).then(res => {
        Api.showToast(res.message)
      })
    }else{
      Api.showToast("请选择商品！")
    }
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },
  // 左滑删除
  moveStart:function(e){
    console.log("moveStart")
    console.log(e)
  }, 
  movIng: function(e) {
    console.log("doing")
    console.log(e)
  },
  moveEnd: function (e) {
    console.log("moveEnd")
    console.log(e)
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