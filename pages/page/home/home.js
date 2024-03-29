const app = getApp();
import Api from '../../../utils/api.js'
import authHandler from '../../../utils/authHandler.js';
import EnterStoreHandler from '../../../utils/enterStoreHandler.js';
import IsStoreOwner from '../../../utils/isStoreOwner.js';
import util from '../../../utils/util.js';
import { handleQRCode } from '../../../utils/scanCode.js';
import { saveFormID } from '../../../utils/modelMsg.js'
var timerList = []
// 身份判断
function getIdentity(_this) {
  let isStoreOwner = new IsStoreOwner();
  isStoreOwner.enterIdentity().then(res => {
    if (_this) {
      _this.homeIndex()
      _this.getActiveGoods()
    }
  }).catch(res => {
  });
}
Page({
  /**
   * 页面的初始数据
   */
  data: {
    globalData: app.globalData,
    indexEmpty: true,
    show: false,
    samePre: false,
    isShow: false,
    showHide: true,
    showDp: true,
    goRetailStore: true,
    currentTab: 0,
    currentTabActive: 0,
    acSwiperIndex: 0, // bannerindex
    confirmDown: false,
    baseUrl: app.globalData.imageUrl,
    activeResult: [],
    result: [],
    noMoreData: true,
    keyword: '',
    descShow: false,
    totalCount: 0,
    goodsNum: 0,
    samePreStore: false,
    samePreStoreId: '',
    store: '',
    bannerHeight: 0,
    swiperHeight: 0,
    goodsHeight: 0,
    coverUrl: '',
    disLike: false,
    identity: '',
    likeShow: false,
    isOnloaded: false,
    limitShow: 1,
    src: '',
    goodsName: '',
    copyGoods: false,
    openStore: false,
    tipIndex: 0,
    tabSwitch: "1",
    tabSwitchShow: false,
    avtiveGoods: []
  },
  // 埋点存储formid
  getFormId(e){
    saveFormID(e)
  },
  // 切换抢购商品
  tabSwitch: function (e) {
    this.preventPulldown()
    var index = e.target.dataset.index
    // 1 活动 0全部  
    if (index == "1") {
      this.setData({
        tabSwitchShow: false
      })
    } else {
      this.setData({
        tabSwitchShow: true
      })
    }
    this.setData({
      tabSwitch: index
    })
  },
  //到店弹框
  showStoreOrder() {
    if (authHandler.isLogin()) {
      this.selectComponent("#storeOrder").open(this);
    } else {
      this.selectComponent("#storeOrder").close();
    }
  },
  //轮播消息
  toUser() {
    wx.switchTab({
      url: '/pages/page/user/user'
    })
  },
  stopSwiperTip() {
    this.setData({
      showAllTip: true,
      tipIndex: 0
    })
  },
  continueSwiperTip() {
    this.setData({
      showAllTip: false,
    })
  },
  swiperItemControl() {
    if (authHandler.isLogin()) {
      Api.unpaidOrderNum().then(res => {
        this.setData({
          unpaidOrderNum: res.obj.totalOrderCount
        })
      })
    } else {
      this.setData({
        unpaidOrderNum: 0
      })
    }
    this.setData({ tipIndex: 0, showAllTip: false })
  },
  //开店
  openStore: function () {
    wx.navigateTo({
      url: '../../cloudOrder/newCloud/newCloud',
    })
  },
  // 一键入库
  copyGoods: function (e) {
    var originGoodsId = e.target.dataset.id
    this.setData({
      copyGoods: true,
      originGoodsId: originGoodsId
    })
  },
  copyGoodsYes: function () {
    var _this = this,
      originGoodsId = this.data.originGoodsId
    this.setData({
      copyGoods: false
    })
    Api.copyGoods({
      originGoodsId: originGoodsId
    })
      .then(res => {
        Api.showToast(res.message)
      })
      .catch(res => {
        var code = res.data.code
        if (code == "E101") {
          _this.setData({
            openStore: true
          })
        }
      })
  },
  samePreBtn: function () {
    this.setData({
      samePre: false
    })
  },
  samePreStore: function () {
    var samePreStoreId = this.data.samePreStoreId
    this.setData({
      samePreStore: false
    })
    wx.setStorageSync("storeId", samePreStoreId)
    app.globalData.switchStore = true
    this.onShow()
  },
  // 获取与扫描商户之前的关系
  getFriendMes: function (userId) {
    var limitShow = wx.getStorageSync("admin")
    var that = this
    if (limitShow == 2) {
      Api.showMerchant({
        userId: userId
      })
        .then(res => {
          var status = res.obj.status
          if (status) {
            Api.newUserInfor({
              userId: userId
            })
              .then(res => {
                var accept = res.obj.id,
                  phone = res.obj.mobile,
                  userName = res.obj.userName,
                  storeId = Api.getThisStoreId()
                var pic = that.data.baseUrl + res.obj.headPic
                if (status == 2) {
                  wx.navigateTo({
                    url: '/pages/businessFriend/merchant/reach/reach?accept=' + accept,
                  })
                }
                if (status != 2) {
                  if (status == 3) {
                    status = 0
                  }
                  wx.navigateTo({
                    url: '/pages/businessFriend/merchant/merchantInfo/merchantInfo?status=' + status + '&send=' + storeId + '&accept=' + accept + '&remark=&greet=&name=' + userName + '&logo=' + pic + '&phone=' + phone,

                  })
                }
              })
              .catch(res => {

              })
          }
        })

    } else {
      Api.userInfor().then(res => {
        let obj = res.obj
        if (obj) {
          let isStoreOwner = res.obj.isStoreOwner
          if (isStoreOwner) {
            if (res.obj.storeNature == "1") {
              let samePreStoreId = res.obj.storeId
              that.setData({
                samePreStore: true,
                samePreStoreId: res.obj.storeId
              })
              return
            }
          }
        }
        Api.showPurchaser({
          userId: userId
        })
          .then(res => {
            var obj = res.obj,
              status = obj.status,
              storeId_ = obj.storeId_
            if (storeId_) {
              wx.setStorageSync("storeId", storeId_)
              app.globalData.switchStore = true
            }
            if (status) {
              if (status == 3) {
                status = 0
              }
              wx.navigateTo({
                url: '/pages/businessFriend/information/information?status=' + status + '&send=&accept=' + obj.storeId_ + '&remark=&name=&logo=',
              })
            }
          })
          .catch(res => {
            var data = res.data
            if (data.code) {
              var code = data.code
              if (code == "006") {
                that.setData({
                  isStoreOwner: true
                })
              } else if (code == "005") {
                that.setData({
                  isNotStore: true
                })
              }
            }
          })
      })

    }
  },
  // 获取当前登录的身份
  getUserInfor: function (userId, storeId) {
    var limitShow = wx.getStorageSync("admin")
    var _this = this
    Api.userInfor().then(res => {
      let obj = res.obj
      if (obj) {
        let isStoreOwner = res.obj.isStoreOwner
        if (isStoreOwner) {
          if (res.obj.storeNature == "1") {
            _this.initStoreData()
            let samePreStoreId = res.obj.storeId
            if (limitShow == 2) {
              if (storeId != samePreStoreId) {
                _this.setData({
                  samePre: true
                })
              }
            } else {
              _this.setData({
                samePreStore: true,
                samePreStoreId: res.obj.storeId
              })
            }

          } else {
            _this.getFriendMes(userId)
          }
        } else {
          _this.getFriendMes(userId)
        }
      } else {
        this.selectComponent("#login").showPage();
      }
    })
  },
  // 关闭
  closeTip: function () {
    this.setData({
      isStoreOwner: false,
      isNotStore: false
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  // 查看资料
  addTip: function () {
    var Id = Api.getThisStoreId()
    wx.navigateTo({
      url: '../../businessFriend/information/information?status=0&send=&accept=' + Id + '&remark=',
    })
  },
  addWholesalePrice: function () {
    this.setData({
      show: true
    })
  },
  confirm: function () {
    this.setData({
      show: false,
      isShow: true,
    })
    this.addTip()
  },
  lookDetails: function (e) {
    var goodsId = e.target.dataset.id
    wx.navigateTo({
      url: '../goodsDetails/goodsDetails?goodsId=' + goodsId,
    })
  },
  // 编辑商品
  editFun: function (e) {
    var goodsId = e.target.dataset.id,
      src = e.target.dataset.src,
      goodsName = e.target.dataset.name
    this.setData({
      showHide: false,
      goodsId: goodsId,
      src: src,
      goodsName: goodsName,
    })
  },
  // 下架商品
  upGoods: function (e) {
    this.setData({
      confirmDown: true
    })
  },
  confirmDown: function () {
    var _this = this,
      goodsIdList = [],
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
              confirmDown: false,
              currentTab: 0
            })
            _this.emptyArr()
          }
        })
      })
  },
  editGoods: function () {
    var goodsId = this.data.goodsId
    wx.navigateTo({
      url: '../../admin/editGoods/editGoods?goodsId=' + goodsId,
    })
  },
  closeShow: function () {
    this.setData({
      showHide: true,
      showDp: true,
      currentTab: 0
    })
  },
  // 编辑信息
  editDpMes: function () {
    var limitShow = this.data.limitShow
    if (limitShow == 2) {
      wx.navigateTo({
        url: '../mesEdit/mesEdit',
      })
    } else {
      wx.navigateTo({
        url: '../mes/mes?code=' + limitShow,
      })
    }
  },
  // 获取商品列表
  getList: function () {
    var _this = this,
      keyword = this.data.keyword,
      currentTab = this.data.currentTab,
      descShow = this.data.descShow,
      sortType = ''
    if (currentTab == 0) {
      sortType = 'multiple'
    } else if (currentTab == 2) {
      sortType = 'sales'
    } else if (currentTab == 3) {
      if (descShow) {
        sortType = 'prices_desc'
      } else {
        sortType = 'prices_asc'
      }
    }


    Api.shopList({
      keyword: '',
      sortType: sortType,
      zoneNumber: this.getZoneNum()
    })
      .then(res => {
        var detailList = res.obj.result,
          totalCount = res.obj.totalCount
        if (Api.isNotEmpty(detailList)) {
          var datas = _this.data.result,
            newArr = app.pageRequest.addDataList(datas, detailList)
          _this.setData({
            result: newArr,
            totalCount: totalCount,
            noMoreData: true
          },()=>{
            _this.getHeight(newArr)
          })
        } else {
          _this.setData({
            noMoreData: false
          })
          Api.showToast("暂无更多数据了！")
        }
      })
  },
  // 修改封面图
  chooseImage: function () {
    var _this = this
    Api.uploadImage({type:"STORE_IMAGE"})
      .then(res => {
        var url = res[0]
        _this.setData({
          coverUrl: url
        })
        Api.updateCover(url)
          .then(res => {
            wx.showToast({
              title: res.message,
              icon: 'none',
              duration: 1000,
              mask: true,
              success: function () {
                _this.closeShow()
              }
            })
          })
      })
  },
  /**
  * 获取首页数据
  */
  homeIndex: function () {
    var that = this;
    Api.homeIndex({
      goodsSortType: "multiple"
    })
      .then(res => {
        var obj = res.obj
        // 获取tab切换列表
        this.getTabList(obj).then(res=>{

          wx.setNavigationBarTitle({
            title: obj.store.storeName == null ? app.globalData.projectName : obj.store.storeName
          })
          app.globalData.isFollow = obj.isFollow
          var result = obj.goods.result
          var floorInfo = Api.isFloorInfo(obj.store.floor)
          that.setData({
            store: obj.store,
            floorInfo: floorInfo,
            coverUrl: obj.store.coverUrl,
            // result: result,
            totalCount: obj.goods.totalCount,
            likeShow: app.globalData.isFollow,
            acSwiperList: obj.activityVOList ? obj.activityVOList:[]
          }, function () {
            // that.getHeight(result)
            this.handelACBanner()
          })
          this.emptyArr()
        })
      })
  },
  handelACBanner(){
    this.setData({ acSwiperIndex: 0 })
    let arr = this.data.acSwiperList
    arr.forEach((el,index)=>{
      this.timerhandle(el.timeSeconds, index)
    })
  },
  // 获取店铺活动列表
  getActiveGoods: function () {
    var _this = this
    timerList.forEach(el => {
      clearInterval(el)
    })
    timerList = []
    Api.storeActiveGoods().then(res => {
      var obj = res.obj
      if (obj.length > 0) {
        for (var i = 0; i < obj.length; i++) {
          // this.timerhandle(obj[i].timeSeconds, i, 'doing')
        }
      }
      if (obj[0]) {
        _this.setData({
          avtiveGoods: obj,
          activeResult: [],
          activityNumber: obj[0].activityNumber,
          currentTabActive: 0
        }, function () {
          _this.getActiveList()
        })
      } else {
        // 清空
        _this.setData({
          avtiveGoods: [],
          activeResult: [],
          activityNumber: ''
        })
        // 切换到全部商品
        this.setData({
          tabSwitchShow: false,
          tabSwitch: 1
        })
      }
    })
  },
  timerhandle(timeSeconds, index, type) {
    let dataName = 'timerList'
    if (timeSeconds) {
      this.setData({
        [dataName + '[' + index + ']']: [parseInt(timeSeconds / 86400), parseInt(timeSeconds / 60 / 60 % 24), parseInt(timeSeconds / 60 % 60), parseInt(timeSeconds % 60)]
      })
      let timer = setInterval(() => {
        timeSeconds--
        if (timeSeconds <= 0) {
          clearInterval(timer)
        }
        this.setData({
          [dataName + '[' + index + ']']: [parseInt(timeSeconds / 86400), parseInt(timeSeconds / 60 / 60 % 24), parseInt(timeSeconds / 60 % 60), parseInt(timeSeconds % 60)]
        })
      }, 1000)
      timerList.push(timer)
    } else {
      this.setData({
        [dataName + '[' + index + ']']: ['00', '00', '00', '00']
      })
    }
  },

  // 获取高度
  getHeight(result) {
    var that = this;
    var query = wx.createSelectorQuery();
    query.select('#myText').boundingClientRect()
    query.exec(function (res) {
      if (res[0]) {
        that.setData({
          bannerHeight: res[0].height
        })
      }
    })
    if (result.length > 0) {
      var query2 = wx.createSelectorQuery();
      query2.select('#result-list').boundingClientRect()
      query2.exec(function (res) {
        if (res[0]) {
          that.setData({
            goodsHeight: res[0].height
          })
        }
      })
    }
    var query1 = wx.createSelectorQuery();
    query1.select('#swiper-tab').boundingClientRect()
    query1.exec(function (res) {
      if (res[0]) {
        that.setData({
          swiperHeight: res[0].height
        })
      }
    })
  },
  getStore() {
    Api.storeIdInfo().then(res => {
      let store = res.obj.store[0].store;
      if (!store || !store.name) {
        this.setData({
          initOrder: true
        })
      } else {
        this.setData({
          initOrder: false
        })
      }
    })
  },
  /**
   * 初始化信息
   */
  initStoreData: function () {
    this.closeShow()
    app.pageRequest.pageDataIndex.pageNum = 1
    app.pageRequest.pageData.pageNum = 0
    app.pageRequest.pageDataActive.pageNum = 0
    getIdentity(this)
    app.globalData.switchStore = false
  },
  /**
   * 判断是否有店铺ID
   */
  loadData: function () {
    var _this = this
    if (!Api.getStoreId()) {
      this.setData({
        indexEmpty: false
      })
    } else {
      this.setData({
        indexEmpty: true
      })
      _this.initStoreData()
    }
  },
  // 获取活动商品
  getActiveList() {
    var _this = this
    Api.storeIndexAGoods({ activityNumber: this.data.activityNumber }).then(res => {
      var detailList = res.obj.result,
        totalCount = res.obj.totalCount
      if (Api.isNotEmpty(detailList)) {
        if (detailList.length > 0) {
          detailList.forEach(el => {
            if (el.extInfo) {
              let stockNum = el.extInfo.PRIORITY_SALES_PROMOTION.stockNum,
                salesNum = el.extInfo.PRIORITY_SALES_PROMOTION.salesNum
              if (!stockNum || stockNum == 0) {
                el.salepercent = 100
              } else {
                let all = salesNum + stockNum
                el.salepercent = parseInt(salesNum / all * 100)
              }
            }
          })
        }
        var datas = _this.data.activeResult,
          newArr = app.pageRequest.addDataList(datas, detailList)
        _this.setData({
          activeResult: newArr,
        })
      }
    })
  },

  // 获取tab切换列表
  getTabList(obj) {
    return new Promise((resolve, reject) => {
      // 是否参与活动
      obj.existActivity ? this.setData({ hasAc: true }) : this.setData({ hasAc: false })
      let tabArr = []
      Api.apiShowAllZone().then(res => {
        if (res.obj && res.obj.length > 0) {
          res.obj.forEach(el => {
            tabArr.push({
              name: el.zoneAlias ? el.zoneAlias : el.zoneName,
              acback: '/image/tab-ye-center.png',
              back: '/image/tab-gray-center.png',
              type: el.zoneType,
              selected: false,
              zoneNumber: el.zoneType == 'all' ? '' : el.zoneNumber
            })
          })
        }
        if (obj.existActivity) {
          // 有参加活动 活动标签放前面
          tabArr.unshift({
            name: '正在抢订',
            acback: '/image/tab-red-left.png',
            back: '/image/tab-gray-left.png',
            type: 'ac',
            selected: true,
          })

          tabArr[tabArr.length - 1].acback = '/image/tab-ye-right.png'
          tabArr[tabArr.length - 1].back = '/image/tab-gray-right.png'
          this.setData({ tabSwitchShow: true })
        } else {
          // 无参加活动
          tabArr.push({
            name: '正在抢订',
            acback: '/image/tab-red-right.png',
            back: '/image/tab-gray-right.png',
            type: 'ac',
            selected: false,
          })
          tabArr[0].acback = '/image/tab-ye-left.png'
          tabArr[0].back = '/image/tab-gray-left.png'
          tabArr[0].selected = true
          this.setData({ tabSwitchShow: false })
        }
        this.setData({
          tabList: tabArr
        }, () => {
          resolve()
        })
      }).catch(e => {
        reject()
      })
    })

  },
  // 切换tab
  selectTab(e) {
    this.preventPulldown()
    let thisindex = e.currentTarget.dataset.index,
      tabarr = this.data.tabList

    tabarr.forEach((el, index) => {
      if (index == thisindex) {
        el.selected = true
        // 是否是活动
        switch (el.type) {
          case 'ac':
            this.setData({ tabSwitchShow: true })
            break;
          case 'all':
          default:
            this.setData({ tabSwitchShow: false })
            if (this.data.currentTab == 1) {
              this.emptyArrNew()
            } else {
              this.emptyArr()
            }
            break;
        }
      } else {
        el.selected = false
      }
    })

    this.setData({
      tabList: tabarr
    })
  },
  getZoneNum() {
    // tab
    let tab = this.data.tabList.filter(el => el.selected),
      zoneNumber = ''
    if (tab[0] && tab[0].zoneNumber) {
      zoneNumber = tab[0].zoneNumber
    }
    return zoneNumber
  },

  /**
 * 生命周期函数--监听页面加载
 */
  onLoad: function (options) {
    var _this = this
    if (options != undefined) {
      let enEnterStoreHandler = new EnterStoreHandler("1");
      enEnterStoreHandler.enterStore(options).then(store => {
        console.log(store)
        _this.loadData()
        //进店成功
        if (store.userId) {
          let userId = store.userId
          _this.getFriendMes(userId)
        }
        _this.setData({
          isOnloaded: true
        });

      }).catch(store => {
        _this.setData({
          isOnloaded: true
        });
        _this.loadData()
        if (store) {
          if (store.userId) {
            let userId = store.userId
            _this.getFriendMes(userId)
          }
          // 判断零售店进到批零
          if (store.storeIdRetail) {
            _this.setData({
              goRetailStore: false
            })
          }
        }
      });
    } else {
      _this.loadData()
      this.setData({
        getFollw: authHandler.isLogin(),
        disLike: false,
      })
    }
  },
  bindChange: function (e) {
    var that = this;
    that.setData({
      currentTab: e.detail.current
    });
  },
  emptyArr: function () {
    this.setData({
      result: []
    });
    app.pageRequest.pageDataIndex.pageNum = 0
    this.getList()
  },
  getListNew: function () {
    var _this = this
    Api.recentGoods({ zoneNumber: this.getZoneNum() })
      .then(res => {
        var detailList = res.obj.result,
          totalCount = res.obj.totalCount
        if (Api.isNotEmpty(detailList)) {
          var datas = _this.data.result,
            newArr = app.pageRequest.addDataList(datas, detailList)
          _this.setData({
            result: newArr,
            totalCount: totalCount,
            noMoreData: true
          }, () => {
            _this.getHeight(newArr)
          })
          if (newArr.length > 0) {
            var query2 = wx.createSelectorQuery();
            query2.select('#result-list').boundingClientRect()
            query2.exec(function (res) {
              _this.setData({
                goodsHeight: res[0].height
              })
            })
          }
        } else {
          _this.setData({
            noMoreData: false
          })
          Api.showToast("暂无更多数据了！")
        }
      })
  },
  emptyArrNew: function () {
    var _this = this
    this.setData({
      result: []
    }, function () {
      app.pageRequest.pageData.pageNum = 0
      _this.getListNew()
    });
  },
  preventPulldown() {
    this.setData({
      noPulldown: true
    }, () => {
      setTimeout(() => {
        this.setData({
          noPulldown: false
        })
      }, 1000)
    })
  },
  // 切换商品tab
  swichNav: function (e) {
    this.preventPulldown()
    var that = this,
      descShow = this.data.descShow,
      index = e.target.dataset.current
    if (this.data.currentTab === index) {
      if (index == 3) {
        that.setData({
          descShow: !descShow
        }, function () {
          this.emptyArr()
        })
      }
      return false;
    } else {
      that.setData({
        currentTab: index,
      }, function () {
        if (index == 1) {
          that.emptyArrNew()
        } else {
          that.emptyArr()
        }
      })
    }
  },
  // 切换活动商品tab
  swichNavActive: function (e) {
    this.preventPulldown()
    var _this = this,
      index = e.target.dataset.current,
      activityNumber = e.target.dataset.number
    app.pageRequest.pageDataActive.pageNum = 0
    // _this.getDjs(this.data.avtiveGoods[index].endTime)
    // 切换活动swiper
    this.acswiperChange(activityNumber)
    _this.setData({
      currentTabActive: index,
      activeResult: [],
      // endTime:'',
      activityNumber: activityNumber
    }, function () {
      _this.getActiveList()
    })
  },
  acswiperChange(activityNumber){
    let arr = this.data.acSwiperList
    arr.forEach((el,index)=>{
      if (el.activityNumber == activityNumber){
        this.setData({
          acSwiperIndex: index,
        })
      }
    })
  },
  acswiper(e){
    let cur = e.detail.current
    this.setData({
      acSwiperIndex: cur,
    })
  },
  reloadAcList() {
    app.pageRequest.pageDataActive.pageNum = 0
    this.setData({
      activeResult: [],
    }, function () {
      this.getActiveList()
    })
  },
  // 置顶
  topGoods: function () {
    var goodsId = this.data.goodsId,
      _this = this
    Api.topGoods({
      goodsId: goodsId
    })
      .then(res => {
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
  likeStore: function () {
    var _this = this
    Api.likeStore()
      .then(res => {
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
  disLike: function () {
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
          likeShow: false,
          disLike: false
        })
      })
  },
  deteleLikeStore: function () {
    var _this = this
    this.setData({
      disLike: true
    })
  },
  onReady: function () {


  },
  searchBtn(e) {
    this.setData({
      result: []
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {
    this.getStore()
    var _this = this,
      isOnloaded = this.data.isOnloaded
    if (isOnloaded) {
      if (authHandler.isLogin()) {
        var limitShow = this.data.limitShow
        var setlimitShow = wx.getStorageSync("admin")
        if (Api.isNotEmpty(setlimitShow)) {
          this.setData({
            limitShow: setlimitShow
          })
        }
        if (app.globalData.isFollow) {
          this.setData({
            likeShow: true
          })
        }
        if (!app.globalData.isFollow) {
          this.setData({
            likeShow: false
          })
        }
      } else {
        this.setData({
          limitShow: 1,
          likeShow: false
        })
      }
      if (app.globalData.switchStore) {
        _this.loadData()
      }
    }
    this.setData({
      getFollw: authHandler.isLogin(),
      disLike: false,
    })

    // this.showStoreOrder();  //到店订单弹窗
    this.swiperItemControl()  //轮播接口
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () { },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.initStoreData()
    wx.stopPullDownRefresh();
    // 刷新列表
    // var currentTab = this.data.currentTab
    // this.setData({
    //   currentTab: currentTab,
    //   noMoreData: true
    // }, function () {
    //   if (this.data.tabSwitchShow){
    //     this.reloadAcList()
    //   } else {
    //     if (currentTab == 1) {
    //       this.emptyArrNew()
    //     } else {
    //       this.emptyArr()
    //     }
    //   }
    //   wx.stopPullDownRefresh();
    // })
  },
  toPageTop() {
    if (this.data.noPulldown) { return }
    setTimeout(() => {
      if (!this.data.noPulldown) {
        this.preventPulldown()
        wx.startPullDownRefresh()
      }
    }, 300)
  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    var store = this.data.store,
      img = this.data.src,
      goodsName = this.data.goodsName,
      id = this.data.goodsId,
      storeId = store.storeId,
      storeName = store.storeName
    if (res.from === 'button') {
      var name = res.target.dataset.name
      if (name == "names") {
        return {
          title: goodsName,
          path: '/pages/page/goodsDetails/goodsDetails?goodsId=' + id + "&storeId" + storeId,
          imageUrl: img,
          success: (res) => { },
          fail: (res) => { }
        }
      }
    } else {
      return {
        title: storeName,
        path: '/pages/page/home/home?storeId=' + storeId,
        success: (res) => { },
        fail: (res) => { }
      }
    }

  },
  /**
   * 页面上拉触底事件的处理函数
   */
  toBottom: function () {
    var noMoreData = this.data.noMoreData
    var currentTab = this.data.currentTab
    if (this.data.tabSwitchShow) {
      this.getActiveList()
    } else {
      if (noMoreData) {
        if (currentTab == 1) {
          this.getListNew()
        } else {
          this.getList()
        }
      }
    }

  },
  myPageScroll(e) {
    var top = e.detail.scrollTop,
      result = this.data.result,
      goodsHeight = this.data.goodsHeight,
      totalCount = this.data.totalCount,
      swiperHeight = this.data.swiperHeight,
      allHeight = this.data.bannerHeight + swiperHeight - goodsHeight,
      getHeght = top - allHeight,
      goodsNum = (parseInt(getHeght / goodsHeight) + 1) * 2
    if (goodsNum > result.length) {
      this.setData({
        goodsNum: result.length
      })
    } else {
      this.setData({
        goodsNum: goodsNum
      })
    }
  }
})