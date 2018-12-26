const app = getApp();
import Api from '../../../utils/api.js'
import authHandler from '../../../utils/authHandler.js';
import EnterStoreHandler from '../../../utils/enterStoreHandler.js';

function getIdentity(_this) {
  if (authHandler.isLogin()) {
    Api.userIdentity()
      .then(res => {
        var obj = res.obj
        if (obj == "null" || obj == null) {
          wx.setStorageSync("admin", 1)
          _this.setData({
            limitShow: 1
          })
        } else {
          var isStoreOwner = obj.isStoreOwner,
            isPurchaser = obj.isPurchaser
          if (isPurchaser) {
            wx.setStorageSync("admin", 3)
            wx.setTabBarItem({
              index: 2,
              text: '进货车',
              iconPath: '/image/22.png',
              selectedIconPath: '/image/21.png'
            })
            _this.setData({
              limitShow: 3
            })
          }
          if (isStoreOwner) {
            if (obj.storeNature == 1) {
              wx.setStorageSync("admin", 2)
              _this.setData({
                limitShow: 2
              })
            }
            if (obj.storeNature == 2) {
              wx.setStorageSync("admin", 1)
              _this.setData({
                limitShow: 1
              })
            }
          }
          if (!isPurchaser && !isStoreOwner) {
            wx.setStorageSync("admin", 1)
            _this.setData({
              limitShow: 1
            })
          }
        }
        _this.homeIndex()
      })
  } else {
    _this.homeIndex()
    wx.setStorageSync("admin", 1)
    _this.setData({
      limitShow: 1
    })
  }
}
Page({
  /**
   * 页面的初始数据
   */
  data: {
    indexEmpty: true,
    show: false,
    samePre: false,
    isShow: false,
    showHide: true,
    showDp: true,
    goRetailStore: true,
    currentTab: 0,
    confirmDown: false,
    baseUrl: '',
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
    openStore: false
  },
  //到店弹框
  showStoreOrder() {
    this.selectComponent("#storeOrder").open();
  },
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
  // 扫码
  addFriend: function () {
    var _this = this;
    wx.scanCode({
      success: (res) => {
        var qrUrl = res.result
        let options = {
          getUserIdFromQrCode: qrUrl
        }
        let enEnterStoreHandler = new EnterStoreHandler("1");
        enEnterStoreHandler.enterStore(options).then(store => {
          if (store.storeNature == "1") {
            var userId = store.userId
            var storeId = store.storeId
            _this.getUserInfor(userId, storeId)
          }
        }).catch(store => {
          let userId = store.userId
          _this.getFriendMes(userId)

        });
      },
      fail: (res) => {
        // Api.showToast("未获取用户信息！")
      },
      complete: (res) => { }
    })
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
  addTip: function () {
    var Id = Api.getThisStoreId(),
      logo = this.data.store.logo,
      name = this.data.store.storeName
    wx.navigateTo({
      url: '../../businessFriend/information/information?status=0&send=&accept=' + Id + '&remark=&logo=' + logo + '&name=' + name,
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
  // editDp: function () {
  //   this.setData({
  //     showDp: false,
  //   })
  // }, 
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
        sortType = 'prices_asc'
      } else {
        sortType = 'prices_desc'
      }
    }
    Api.shopList({
      keyword: '',
      sortType: sortType
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
            baseUrl: app.globalData.imageUrl,
            noMoreData: true
          })
        } else {
          _this.setData({
            noMoreData: false
          })
          Api.showToast("暂无更多数据了！")
        }
      })
  },
  chooseImage: function () {
    var _this = this
    Api.uploadImage("STORE_IMAGE")
      .then(res => {
        var url = JSON.parse(res).obj
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
  homeIndex: function () {
    var that = this;
    Api.homeIndex({
      goodsSortType: "multiple"
    })
      .then(res => {
        var obj = res.obj
        wx.setNavigationBarTitle({
          title: obj.store.storeName == null ? "小云店" : obj.store.storeName
        })
        app.globalData.isFollow = obj.isFollow
        var result = obj.goods.result
        var floorInfo = Api.isFloorInfo(obj.store.floor)
        that.setData({
          store: obj.store,
          floorInfo: floorInfo,
          baseUrl: app.globalData.imageUrl,
          coverUrl: obj.store.coverUrl,
          result: result,
          totalCount: obj.goods.totalCount,
          likeShow: app.globalData.isFollow
        }, function () {
          var query = wx.createSelectorQuery();
          query.select('#myText').boundingClientRect()
          query.exec(function (res) {
            that.setData({
              bannerHeight: res[0].height
            })
          })
          if (result.length > 0) {
            var query2 = wx.createSelectorQuery();
            query2.select('#result-list').boundingClientRect()
            query2.exec(function (res) {
              that.setData({
                goodsHeight: res[0].height
              })
            })
          }
          var query1 = wx.createSelectorQuery();
          query1.select('#swiper-tab').boundingClientRect()
          query1.exec(function (res) {
            that.setData({
              swiperHeight: res[0].height
            })
          })
        })
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
  initStoreData: function () {
    this.closeShow()
    app.pageRequest.pageDataIndex.pageNum = 1
    app.pageRequest.pageData.pageNum = 0
    getIdentity(this)
    app.globalData.switchStore = false
  },
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
  onLoad: function (options) {
    var _this = this
    if (options != undefined) {
      let enEnterStoreHandler = new EnterStoreHandler("1");
      enEnterStoreHandler.enterStore(options).then(store => {
        //进店成功
        if (store.userId) {
          let userId = store.userId
          _this.getFriendMes(userId)
        }
        _this.setData({
          isOnloaded: true
        });
        _this.loadData()

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
          if (store.storeIdRetail){
           _this.setData({
             goRetailStore:false
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
    Api.recentGoods()
      .then(res => {
        var detailList = res.obj.result,
          totalCount = res.obj.totalCount
        if (Api.isNotEmpty(detailList)) {
          var datas = _this.data.result,
            newArr = app.pageRequest.addDataList(datas, detailList)
          _this.setData({
            result: newArr,
            totalCount: totalCount,
            baseUrl: app.globalData.imageUrl,
            noMoreData: true
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
  swichNav: function (e) {
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
          this.emptyArr()
        }
      })
    }
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
    var currentTab = this.data.currentTab
    this.setData({
      currentTab: currentTab,
      noMoreData: true
    }, function () {
      if (currentTab == 1) {
        this.emptyArrNew()
      } else {
        this.emptyArr()
      }
      wx.stopPullDownRefresh();
    })
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
  onReachBottom: function () {
    var noMoreData = this.data.noMoreData
    var currentTab = this.data.currentTab
    if (noMoreData) {
      if (currentTab == 1) {
        this.getListNew()
      } else {
        this.getList()
      }
    }
  },
  onPageScroll: function (e) {
    var top = e.scrollTop,
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