const app = getApp();
var that
import Api from '../../../utils/api.js'
Page({
  data: {
    baseUrl: app.globalData.imageUrl,
    result: [],
    value: '',
    showResult: false,
    closeCont: false,
    showMore:true,
  },
  searchInput(e) {
    this.setData({
      value: e.detail.value
    })
  },
  // 显示更多操作
  showMoreClick: function (e) {
    var index = e.target.dataset.index
    this.setData({
      showMore: false,
      showIndex: index
    })
  },
  //手指触摸动作开始 记录起点X坐标
  touchstart: function (e) {
    //开始触摸时 重置所有删除
    let data = app.touch._touchstart(e, this.data.result)
    this.setData({
      result: data
    })
  },

  //滑动事件处理
  touchmove: function (e) {
    let data = app.touch._touchmove(e, this.data.result)
    this.setData({
      result: data
    })
  },
  //搜索确定键
  getList: function () {
    var keyword = this.data.value,
      _this = this
    Api.goodsSearchList({ keyword: keyword })
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
  // 初始化数据
  initData: function () {
    app.pageRequest.pageData.pageNum = 0
    this.setData({
      result: []
    })
  },
  searchBtn(e) {
    var val = this.data.value
    if (!val) { return }
    this.initData()
    this.getList()
  },
  onLoad(options) {
   
  },
  onShow() {
    var val = this.data.value
    if (!val) { return }
    this.initData()
    this.getList()
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    var val = this.data.value
    this.initData()
    wx.stopPullDownRefresh();
    if (!val) { return }
    this.getList()
  },
  onShareAppMessage: (res) => {
    var img = '',
      name = '',
      id = '',
      storeId = wx.getStorageSync('storeId')
    if (res.from === 'button') {
      var res = res.target.dataset
      img = res.img;
      id = res.id
      name = res.name
      return {
        title: name,
        path: '/pages/page/goodsDetails/goodsDetails?goodsId=' + id + "&storeId=" + storeId,
        imageUrl: img,
        success: (res) => {
        },
        fail: (res) => {
        }
      }
    } else {
      return {
        path: '/pages/page/home/home?storeId=' + storeId,
        success: (res) => {
        },
        fail: (res) => {
        }
      }
    }
  },
  lookGoodsDetails: function (e) {
    var id = e.target.dataset.id
    wx.navigateTo({
      url: '/pages/page/goodsDetails/goodsDetails?goodsId=' + id,
    })
  },
  editGoods: function (e) {
    var id = e.target.dataset.id
    wx.navigateTo({
      url: '../editGoods/editGoods?goodsId=' + id,
    })
  },
  // 上下架
  confirmUp: function () {
    var _this = this,
      goodsIdList = [],
      index = this.data.upIndex,
      result = this.data.result,
      goodId = this.data.goodsId
    goodsIdList.push(goodId)
    Api.adminGoodsUp(goodsIdList)
      .then(res => {
        result[index].status = "1"
        _this.setData({
          result: result,
          confirmUp: false
        })
        Api.showToast("上架成功")
      })
  },
  changeStatus: function (e) {
    const goodId = e.currentTarget.dataset.id,
      num = e.currentTarget.dataset.num,
      index = e.currentTarget.dataset.index
    this.setData({
      goodsId: goodId
    })
    if (1 > num) {
      this.setData({
        showNum: true
      })
    } else {
      this.setData({
        confirmUp: true,
        upIndex: index
      })
    }
  },
  confirmDown: function () {
    var _this = this,
      goodsIdList = [],
      index = this.data.upIndex,
      result = this.data.result,
      goodId = this.data.goodsId
    goodsIdList.push(goodId)
    Api.adminGoodsDown(goodsIdList)
      .then(res => {
        result[index].status = "0"
        _this.setData({
          result: result,
          confirmDown: false
        })
        Api.showToast("下架成功")
      })
  },
  upStatus: function (e) {
    const goodId = e.currentTarget.dataset.id,
      index = e.currentTarget.dataset.index
    this.setData({
      confirmDown: true,
      upIndex: index,
      goodsId: goodId
    })

  },
  // 操作之后隐藏弹框
  cancel:function(){
    this.setData({
      showMore: true,
      confirmDown: false,
      confirmUp: false,
      showNum: false,
      show1:false,
      showIndex: -1
    })
  },
  // 隐藏更多操作
  closeShow: function () {
    this.setData({
      showMore: true,
      showIndex: -1
    })
  },
  // 修改规格
  updateSpec: function (e) {
    var id = e.target.dataset.id,
      storeTd = e.target.dataset.storeid
    wx.navigateTo({
      url: '../goodsSpec/goodsSpec?goodsId=' + id + '&storeTd=' + storeTd,
    })
  },
  //删除事件
  del: function (e) {
    var indexDel = e.currentTarget.dataset.index,
      goodsIdDel = e.currentTarget.dataset.id
    var _this = this
    _this.setData({
      show1: true,
      indexDel: indexDel,
      goodsIdDel: goodsIdDel
    })
  },
  confirmDetele: function () {
    var that = this,
      indexDel = this.data.indexDel,
      goodsIdDel = this.data.goodsIdDel
    that.data.result.splice(indexDel, 1)
    Api.adminGoodsDelete({ goodId: goodsIdDel })
      .then(res => {
        wx.showToast({
          title: '删除成功',
          icon: 'none',
          duration: 2000
        })
        that.setData({
          result: that.data.result
        })
        that.cancel()
      })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var val = this.data.value
    if (!val) { return }
    this.getList()
  }
})