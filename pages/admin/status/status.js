const app = getApp();
var that
import Api from '../../../utils/api.js'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0,
    alertTab: 0,
    hidden: true,
    confirmUp: false,
    confirmDown: false,
    showIndex: -1,
    upIndex: 0,
    keyword: '',
    indexDel: '',
    goodsId: '',
    currentTabSer: 0,
    list: [],
    goodsId: '',
    show1: false,
    showNum: false,
    isCopied: '',
    value: '',
    className:'本店分类',
    totalCount: '',
    sImg: '/image/xl.png',
    detailList: [],
    goodsStatus: 1,
    classStatus: false,
    selGoods: 0,
    baseUrl: app.globalData.imageUrl,
    code: '',
    showMore: true,
    allGoodsShow: false,
    alertData: ["全部商品", "引用商品", "自建商品"],
  },
  // 显示更多操作
  showMoreClick: function (e) {
    var index = e.target.dataset.index
    this.setData({
      showMore: false,
      showIndex: index
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
  // 隐藏更多操作
  closeShow: function () {
    this.setData({
      showMore: true,
      showIndex: -1
    })
  },
  allGoodsShow: function () {
    this.setData({
      allGoodsShow: !this.data.allGoodsShow
    })
  },
  changeValue: function (e) {
    var value = e.detail.value
    this.setData({
      value: value
    })
  },
  blurInputEvent: function () {
    wx.navigateTo({
      url: '../serStatus/serStatus?value=' + this.data.value,
    })
  },
  //手指触摸动作开始 记录起点X坐标
  touchstart: function (e) {
    //开始触摸时 重置所有删除
    let data = app.touch._touchstart(e, this.data.detailList)
    this.setData({
      detailList: data
    })
  },
  goWork: function () {
    wx.reLaunch({
      url: '/pages/page/workIndex/workIndex',
    })
  },
  //删除事件
  del: function (e) {
    var indexDel = e.currentTarget.dataset.index,
      goodsId = e.currentTarget.dataset.id
    var _this = this
    _this.setData({
      show1: true,
      indexDel: indexDel,
      goodsId: goodsId
    })
  },
  confirmDetele: function () {
    var that = this,
      indexDel = this.data.indexDel,
      goodsId = this.data.goodsId
    that.data.detailList.splice(indexDel, 1)
    Api.adminGoodsDelete({
      goodId: goodsId
    })
      .then(res => {
        Api.showToast("删除成功")
        that.setData({
          show1: false,
          showMore: true,
          detailList: that.data.detailList
        })
      })
  },
  swichNavLast: function () {
    if (this.data.currentTab > -1) {
      this.setData({
        hidden: false,
        sImg: '/image/xl1.png',
        classStatus: true,
      })
    }
  },
  // 选择自建或者引用
  selGoods: function (e) {
    var that = this,
      index = e.target.dataset.current
    this.setData({
      classStatus: false
    })
    if (this.data.selGoods === index) {
      return false;
    } else {
      var isCopied = ''
      if (index == 1) {
        isCopied = false
      }
      if (index == 2) {
        isCopied = true
      }
      that.setData({
        selGoods: index,
        allGoodsShow: false,
        isCopied: isCopied
      }, function () {
        that.initData()
      })
    }
  },
  swichNav: function (e) {
    var that = this,
      status = e.target.dataset.index
    that.setData({
      goodsStatus: status,
      hidden: true,
      classStatus: false,
      currentTabSer: 0,
      code: '',
    }, function () {
      that.initData()
    })
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current,
        sImg: '/image/xl.png',
        className: "本店分类"
      })
    }
  },
  alertNav: function (e) {
    var that = this;
    if (that.data.alertTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        alertTab: e.target.dataset.current,
      })

    }
  },
  hideSer: function () {
    this.setData({
      hidden: true,
    })
  },

  // 上下架
  confirmTip: function () {
    var id = this.data.goodsId
    wx.navigateTo({
      url: '../editGoods/editGoods?goodsId=' + id,
    })
  },
  confirmUp: function () {
    var _this = this,
      goodsIdList = [],
      index = this.data.upIndex,
      detailList = this.data.detailList,
      goodId = this.data.goodsId
    goodsIdList.push(goodId)
    Api.adminGoodsUp(goodsIdList)
      .then(res => {
        detailList[index].status = "1"
        detailList.splice(index, 1)
        _this.setData({
          detailList: detailList,
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
      detailList = this.data.detailList,
      goodId = this.data.goodsId
    goodsIdList.push(goodId)
    Api.adminGoodsDown(goodsIdList)
      .then(res => {
        detailList[index].status = "0"
        detailList.splice(index, 1)
        _this.setData({
          detailList: detailList,
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
  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function (options) {

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this
    Api.adminShopCate()
      .then(res => {
        var obj = res.obj
        obj.unshift({
          name: "全部商品",
          customCategoryCode: ""
        })
        that.setData({
          list: obj
        })
      })
  },
  classCode: function () {
    var _this = this,
      goodsStatus = this.data.goodsStatus,
      customCategoryCodes = this.data.code,
      isCopied = this.data.isCopied
    if (goodsStatus == 0) {
      goodsStatus = "0,2"
    }
    Api.adminGoodsStatus({
      goodsStatus: goodsStatus,
      customCategoryCodes: customCategoryCodes,
      isCopied: isCopied
    })
      .then(res => {
        var detailList = res.obj.result
        if (Api.isNotEmpty(detailList)) {
          var datas = _this.data.detailList,
            totalCount = res.obj.totalCount,
            newArr = app.pageRequest.addDataList(datas, detailList)
          _this.setData({
            detailList: newArr,
            totalCount: totalCount
          })
        }
      })

  },
  initData: function () {
    app.pageRequest.pageData.pageNum = 0
    var _this = this
    this.setData({
      detailList: [],
      showIndex: -1,
      showMore: true,
    }, function () {
      _this.classCode()
    })

  },
  swichSer: function (e) {
    var that = this,
      code = e.target.dataset.code,
      name = e.target.dataset.name
    if (that.data.currentTabSer === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTabSer: e.target.dataset.current,
        code: code,
        className:name
      }, function () {
        that.initData()
      })
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var gS = this.data.goodsStatus,
      currentTab = this.data.currentTab
    this.setData({
      goodsStatus: gS,
      hidden: true,
      showNum: false,
      confirmUp: false,
      confirmDown: false
    })
    app.globalData.switchStore = true
    this.initData()
  },
  bindDownLoad: function () {

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
    this.onShow()
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this
    that.classCode()
  },
  editGoods: function (e) {
    var id = e.target.dataset.id
    wx.navigateTo({
      url: '../editGoods/editGoods?goodsId=' + id,
    })
  },
  //手指触摸动作开始 记录起点X坐标
  touchstart: function (e) {
    //开始触摸时 重置所有删除
    let data = app.touch._touchstart(e, this.data.detailList)
    this.setData({
      detailList: data
    })
  },

  //滑动事件处理
  touchmove: function (e) {
    let data = app.touch._touchmove(e, this.data.detailList)
    this.setData({
      detailList: data
    })
  },
  /**
   * 用户点击右上角分享
   */
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

  },
})