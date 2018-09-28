const app = getApp();
import Api from '../../../utils/api.js'
function getIdentity(_this) {
  if (Api.isEmpty(wx.getStorageSync("access_token"))) {
    Api.userIdentity()
      .then(res => {
        var obj=res.obj,
          isStoreOwner = obj.isStoreOwner,
          isPurchaser = obj.isPurchaser
        if (isStoreOwner){
          wx.setStorage({
            key: 'admin',
            data: 2, //1yon 2店主  3批发商
          })
          _this.setData({
            limitShow:2
          })
        }
        if (isPurchaser){
          wx.setStorage({
            key: 'admin',
            data: 3,
          })
          wx.setTabBarItem({
            index: 1,
            text: '进货车',
            iconPath: '/image/22.png',
            selectedIconPath: '/image/21.png'
          })
          _this.setData({
            limitShow: 3
          })
        }
        if (!isPurchaser && !isStoreOwner){
          wx.setStorage({
            key: 'admin',
            data: 1,
          })
          _this.setData({
            limitShow: 1
          })
        }
        _this.homeIndex()
      })
  }else{
    _this.homeIndex()
  }
}
Page({
  /**
   * 页面的初始数据
   */
  data: {
    indexEmpty: true,
    winWidth:0,
    winHeight: 0,
    show:false,
    isShow:false,
    showHide:true,
    showDp:true,
    currentTab: 0,
    result: [],
    keyword:'',
    descShow:false,
    totalCount:0,
    store:'',
    coverUrl:'',
    identity:'',
    baseUrl: app.globalData.imageUrl,
    likeShow:false,
    limitShow:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  addTip:function(){
    this.setData({
      show:true
    })
  },
  confirm:function(){
    this.setData({
      show: false,
      isShow:true,
    })
  },
  editFun:function(e){
    var goodsId=e.target.dataset.id
    this.setData({
      showHide: false,
      goodsId: goodsId
    })
  }, 
  // 分享
  // onShareAppMessage: function (res) {
  //   console.log(res.from)
  //   var goodsId = this.data.goodsId
  //   return {
  //     title: '弹出分享时显示的分享标题',
  //     desc: '分享页面的内容',
  //     path: '/pages/page/goodsDetails/goodsDetails?goodsId=' + goodsId
  //   }
  // },
  // 下架商品
  upGoods:function(e){
    var _this=this,
      goodsIdList=[],
      goodsId = this.data.goodsId
    goodsIdList.push(goodsId)
    Api.adminGoodsDown(goodsIdList)
      .then(res => {
        wx.showToast({
          title: '下架成功',
          icon: 'none',
          duration: 2000,
          success: function () {
            _this.setData({
              showHide: true,
              currentTab:0
            })
            _this.emptyArr()
          }
        })
      })
  },
  editGoods:function(){
    var goodsId = this.data.goodsId
    wx.navigateTo({
      url: '../../admin/editGoods/editGoods?goodsId=' + goodsId,
    })
  },
  closeShow: function() {
    this.setData({
      showHide: true,
      showDp:true
    })
  }, 
  editDp: function () {
    this.setData({
      showDp: false,
    })
  }, 
  getList: function () {
    var _this = this,
      keyword = this.data.keyword,
      currentTab = this.data.currentTab,
      descShow = this.data.descShow,
      sortType=''
    if (currentTab == 0) {
      sortType = 'multiple'
    } else if (currentTab == 1) {
      sortType = 'sales'
    } else if (currentTab == 2) {
      if (descShow){
        sortType = 'prices_asc'
      }else{
        sortType = 'prices_desc'
      }
    } 
    Api.shopList({ keyword: '', sortType: sortType})
      .then(res => {
        var detailList = res.obj.result,
          datas = _this.data.result,
          newArr = app.pageRequest.addDataList(datas, detailList)
        _this.setData({
          result: newArr
        })
      })
  },
  chooseImage:function(){
    var _this=this
    Api.uploadImage("STORE")
    .then(res=>{
      var url = JSON.parse(res).obj
      _this.setData({
        coverUrl: url
      })
      Api.updateCover({ coverUrl:url})
        .then(res => {
          wx.showToast({
            title: res.message,
            icon: 'none',
            duration: 1000,
            mask: true,
            success:function(){
              _this.closeShow()
            }
          })
        })
    })
  },
  homeIndex:function(){
    var that = this;
    Api.homeIndex()
      .then(res => {
        var obj = res.obj
        wx.setNavigationBarTitle({
          title: obj.store.storeName
        })
        that.setData({
          store: obj.store,
          coverUrl: obj.store.coverUrl,
          result: obj.goods.result,
          totalCount: obj.goods.totalCount,
          likeShow: obj.isFollow
        })
      })    
  },
  onLoad: function (options) {
    if (Api.isEmpty(wx.getStorageSync("storeId"))==false){
      this.setData({
        indexEmpty:true
      })
    }
    getIdentity(this)
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    });
    
  },
  bindChange: function (e) {
    var that = this;
    that.setData({ currentTab: e.detail.current });
  },
  emptyArr: function () {
    this.setData({
      result: []
    });
    app.pageRequest.pageData.pageNum = 0
    this.getList()
  },
  swichNav: function (e) {
    var that = this,
      descShow = this.data.descShow
    if (this.data.currentTab === e.target.dataset.current) {
      if (e.target.dataset.current == 2) {
        that.setData({
          descShow: !descShow
        }, function () {
          this.emptyArr()
        })
      }
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current,
      },function(){
        this.emptyArr()
      })
    }
  },
  // 置顶
  topGoods:function(){
    var goodsId = this.data.goodsId,
      _this=this
    Api.topGoods({goodsId: goodsId})
    .then(res=>{
      wx.showToast({
        title: "置顶成功",
        icon: 'none',
        duration: 1000,
        mask: true,
        success: function () {
          _this.closeShow()
          _this.emptyArr()
        }
      })
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  likeStore:function(){
    var _this=this
    Api.likeStore()
    .then(res=>{
      wx.showToast({
        title: '关注成功',
        icon: 'none',
        duration: 1000,
        mask: true,
      })
      _this.setData({
        likeShow: true
      })
    })
  }, 
  deteleLikeStore: function() {
    var _this = this
    Api.deteleLikeStore()
      .then(res => {
        wx.showToast({
          title: '取消关注成功',
          icon: 'none',
          duration: 1000,
          mask: true,
        })
        _this.setData({
          likeShow: false
        })
      })
  },
  onReady: function () {


  },
  searchBtn(e) {
    this.setData({
      result:[]
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {
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
    this.emptyArr()
    this.setData({
      currentTab:0
    })
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getList()
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },


})