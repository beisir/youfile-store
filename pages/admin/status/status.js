const app = getApp();
var that
import Api from '../../../utils/api.js'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    currentTab: -1,
    alertTab:0,
    hidden:true,
    keyword:'',
    currentTabSer:0,
    showXl:true,
    list:[],
    totalCount:'',
    sImg:'/image/xl.png',
    detailList: [],
    goodsStatus:'',
    classStatus:false,
    baseUrl: app.globalData.imageUrl,
    code:'',
    alertData:["全部商品","引用商品","自建商品"],
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

  //删除事件
  del: function (e) {
    wx.showModal({
      title: '提示',
      content: '确认要删除此条信息么？',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          that.data.detailList.splice(e.currentTarget.dataset.index, 1)
          that.setData({
            detailList: that.data.detailList
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  swichNavLast:function(){
    if (this.data.currentTab>-1){
      this.setData({
        hidden: false,
        sImg: '/image/xl1.png',
        classStatus: true,
      })
    }
  },
  swichNav: function (e) {
    var that = this,
        status=e.target.dataset.index
    that.setData({
      goodsStatus: status,
      hidden: true,
      classStatus:false,
      detailList: []
    })
    app.pageRequest.pageData.pageNum = 0
    this.classCode('')
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
        that.setData({
          currentTab: e.target.dataset.current,
          sImg: '/image/xl.png'
        })
    }
  },
  alertNav:function(e){
    var that = this;
    if (that.data.alertTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        alertTab: e.target.dataset.current,
      })

    }
  },
  hideSer:function(){
    this.setData({
      hidden: true,
    })
  },
  /**
 * 删除
 */
  deleteList(e) {
    const index = e.currentTarget.dataset.index,
      goodId = e.currentTarget.dataset.id
    let detailList = this.data.detailList;
    detailList.splice(index, 1);
    this.setData({
      detailList: detailList
    });
    if (!detailList.length) {
      this.setData({
        hasList: false
      });
    }
    Api.adminGoodsDelete({ goodId: goodId })
      .then(res => {
        wx.showToast({
          title: '删除成功',
          icon: 'none',
          duration: 2000
        })
      })
  },
  // 上下架
  changeStatus:function(e){
    const goodId = e.currentTarget.dataset.id,
          index = e.currentTarget.dataset.index,
          _this=this,
          detailList = this.data.detailList,
          goodsIdList=[]
    goodsIdList.push(goodId)
    Api.adminGoodsUp(goodsIdList)
      .then(res => {
        detailList[index].status = "1"
        detailList.splice(index, 1)
        _this.setData({
          detailList: detailList,
        })
        wx.showToast({
          title: '上架成功',
          icon: 'none',
          duration: 2000
        })
      })
      
  },
  upStatus:function(e){
    const goodId = e.currentTarget.dataset.id,
      index = e.currentTarget.dataset.index,
      _this = this,
      detailList = this.data.detailList,
      goodsIdList = []
    goodsIdList.push(goodId)
    Api.adminGoodsDown(goodsIdList)
      .then(res => {
        detailList[index].status = "0"
        detailList.splice(index, 1)
        _this.setData({
          detailList: detailList,
        })
        wx.showToast({
          title: '下架成功',
          icon: 'none',
          duration: 2000
        })
      })
  },
  /**
   * 生命周期函数--监听页面加载
   */

  getList: function () {
    var _this = this,
      keyword = this.data.keyword
    Api.adminGoodsList({ keyword: '' })
      .then(res => {
        var detailList = res.obj.result,
          datas = _this.data.detailList,
          totalCount = res.obj.totalCount,
          newArr = app.pageRequest.addDataList(datas, detailList)
        console.log(detailList)
        _this.setData({
          detailList: newArr,
          totalCount: totalCount
        })
      })
  },
  
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
        obj.unshift({ name: "全部商品", customCategoryCode: "0000" })
        that.setData({
          list: obj
        })
      })
  },
  classCode:function(code){
    var _this = this,
      goodsStatus =this.data.goodsStatus
    Api.adminGoodsStatus({ goodsStatus: goodsStatus})
      .then(res => {
        var detailList = res.obj.result,
          datas = _this.data.detailList,
          totalCount = res.obj.totalCount,
          newArr = app.pageRequest.addDataList(datas, detailList)
        _this.setData({
          detailList: newArr,
          totalCount: totalCount
        })
      })
  },
  swichSer: function (e) {
    var that = this,
        code=e.target.dataset.code
    app.pageRequest.pageData.pageNum = 0
    this.classCode(code)
    that.setData({
      detailList: []
    })
    if (that.data.currentTabSer === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTabSer: e.target.dataset.current,
        code:code
      })

    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    app.pageRequest.pageData.pageNum = 0
    this.setData({
      detailList:[]
    })
    this.getList()
  },
  bindDownLoad: function () {
    var that = this,
        code = this.data.code,
        goodsStatus = this.data.goodsStatus
      if (this.data.goodsStatus == '' && this.data.code == '') {
        that.getList()
      }
      if (this.data.goodsStatus != '' && this.data.code==''){
        that.classCode('')
      }
      if (this.data.goodsStatus != '' && this.data.code != '') {
        that.classCode(code)
      }
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
    this.setData({
      currentTab:-1,
      detailList: []
    })
    app.pageRequest.pageData.pageNum = 0
    this.getList()
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