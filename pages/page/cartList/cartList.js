const app = getApp();
var that
import Api from '../../../utils/api.js'
import authHandler from '../../../utils/authHandler.js';
import IsStoreOwner from '../../../utils/isStoreOwner.js';
import Calculation from '../../../utils/calculation.js'
var Method = new Calculation()
function getIdentity(_this) {
  let isStoreOwner = new IsStoreOwner();
  isStoreOwner.enterIdentity().then(res => {
    _this.getList(_this)
    if (wx.getStorageSync("admin") == 3) {
      wx.setNavigationBarTitle({
        title: '进货车',
      })
    } else {
      wx.setNavigationBarTitle({
        title: '购物车',
      })
    }
  }).catch(res => {});
}
Page({
  data: {
    indexEmpty: true,
    enjoyCost: false,
    detailList: [],
    detailList1: [],
    hasList: false,
    lostcarts: [],
    lostList: false,
    totalPrice: 0,
    enjoyCostNew: false,
    baseUrl: app.globalData.imageUrl,
    selectAllStatus: true,
    allEmpty: true,
    goRetailStore: true,
    total1: 0,
    obj: {
      name: "hello"
    },
    storeMes: [],
    storeId: wx.getStorageSync('storeId'),
    hidden: true,
    idnex: '',
    leftVal: '',
    numbers: 1,
    baseUrl: app.globalData.imageUrl,
    limitShow: wx.getStorageSync("admin"),
    storeAmount: 0,
    storeNum: 0,
    differentPrice: 0,
    editDetailList: '',
    goodsConfig: []
  },

  // 规格
  //选择规格
  showAlert: function(e) {
    var that = this,
      name = e.target.dataset.name,
      limitShow = this.data.limitShow
    // 修改进货车
    if (name == "more") {
      var index = e.target.dataset.index,
        detailList = this.data.detailList[index]
      wx.navigateTo({
        url: '../goodsDetails/goodsDetails?goodsId=' + detailList["goodsId"] + "&code=" + index + "&name=more",
      })
    }
    // 修改进货车
    if (limitShow == 3 && name == "one") {
      var gid = e.target.dataset.gid
      wx.navigateTo({
        url: '../goodsDetails/goodsDetails?goodsId=' + gid + "&code=" + index + "&name=more",
      })
    }
    // 修改购物车
    if (limitShow != 3 && name == "one") {
      var gid = e.target.dataset.gid
      wx.navigateTo({
        url: '../goodsDetails/goodsDetails?goodsId=' + gid + "&code=" + index + "&name=one",
      })
    }
  },
  changeNum: function(e) {
    var num = e.detail.value
    if (num == '') {
      return
    }
    num = num.replace(/\b(0+)/gi, "")
    if (num == 0) {
      num = 1
    }
    const index = e.currentTarget.dataset.index;
    let detailList = this.data.detailList;
    let storeId = this.data.storeId
    let stockNum = detailList[index].shoppingCartSkuList[0].stockNum
    if (num > stockNum) {
      num = stockNum
    }
    detailList[index].shoppingCartSkuList[0].num = num;
    detailList[index].num = num
    var arr = this.updatePrice(num, index)
    detailList[index].allGoodsAmount = arr[0]
    detailList[index].allGoodsPf = arr[1]
    var data = detailList[index].shoppingCartSkuList
    var dataArr = []
    dataArr.push({
      goodsId: data[0]["goodsId"],
      num: parseInt(num),
      skuCode: data[0]["skuCode"],
      storeId: storeId
    })
    this.addCart(data[0]["goodsId"], JSON.stringify(dataArr))
    this.setData({
      detailList: detailList
    });
    this.getTotalPrice();
  },
  //选择规格属性
  changeButton: function(e) {
    var that = this;
    if (this.data.specsTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        specsTab: e.target.dataset.current,
      })
    }
  },
  lookDetails: function(e) {
    var goodsId = e.target.dataset.id
    wx.navigateTo({
      url: '../goodsDetails/goodsDetails?goodsId=' + goodsId,
    })
  },
  // 购买数量
  minusCount1: function() {
    var num = this.data.numbers
    num = num - 1
    if (num == 0) {
      return
    } else {
      this.setData({
        numbers: num
      })
    }
  },
  addCount1: function() {
    var num = this.data.numbers
    num = parseInt(num) + 1
    this.setData({
      numbers: num
    })
  },
  weghtSwi: function(e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current,
      })
    }
  },
  urlHome: function() {
    wx.switchTab({
      url: '../home/home'
    })
  },
  //关闭弹框
  closeAlert: function() {
    var that = this;
    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'linear'
    })
    that.animation = animation
    animation.translateY(1000).step()
    that.setData({
      animationData: animation.export(),

    })
    setTimeout(function() {
      animation.translateY(0).step()
      that.setData({
        animationData: animation.export(),
        hidden: true

      })
    }, 300)
  },
  rightList: function(e) {
    this.setData({
      leftVal: 0
    });
  },
  //手指触摸动作开始 记录起点X坐标
  touchstart: function(e) {
    //开始触摸时 重置所有删除
    let data = app.touch._touchstart(e, this.data.detailList)
    this.setData({
      detailList: data
    })
  },

  //滑动事件处理
  touchmove: function(e) {
    let data = app.touch._touchmove(e, this.data.detailList)
    this.setData({
      detailList: data
    })
  },
  urlHome: function() {
    wx.switchTab({
      url: '../home/home'
    })
  },
  getList: function() {
    this.setData({
      detailList: [],
      lostcarts: [],
    })
    var _this = this
    Api.cartList()
      .then(res => {
        const obj = res.obj
        if (obj == null) {
          _this.setData({
            allEmpty: false
          })
          return
        } else {
          _this.setData({
            allEmpty: true
          })
        }
        var newEffectiveListLen = res.obj.effectiveList.length,
          newFailureListLen = res.obj.failureList.length,
          storeMes = []
        if (newEffectiveListLen > 0) {
          var effectiveList = obj.effectiveList[0].goodsList,
            store = obj.effectiveList[0].store
        } else {
          var effectiveList = []
        }
        if (newFailureListLen > 0) {
          var failureList = obj.failureList[0].goodsList
        } else {
          var failureList = []
        }
        if (effectiveList.length > 0) {
          _this.setData({
            hasList: true,
            selectAllStatus: true,
          });
          //绑定活动
          var numAc = 0
          if (effectiveList.length > 0) {
            for (var v of effectiveList) {
              var extInfo = v.extInfo.SALES_PROMOTION
              if (extInfo.length > 0) {
                var standardGoodsSkuPromotions = extInfo[0].standardGoodsSkuPromotions
                v.isActivity = true
                v.saleBatch = extInfo[0].batchNum
                v.saleStockNum = extInfo[0].stockNum
                v.activityPrice = extInfo[0].activityPrice
                if (standardGoodsSkuPromotions) {
                  var goodsSkuVOList = v.shoppingCartSkuList
                  for (var val of goodsSkuVOList) {
                    for (var k of standardGoodsSkuPromotions) {
                      if (val.skuCode == k.skuCode) {
                        numAc++
                        val.isActivity = true
                        val.saleBatch = k.batchNum
                        val.saleStockNum = k.stockNum
                        val.activityPrice = k.activityPrice
                      }
                    }
                  }
                  if (numAc > 0) {
                    v.isActivity = true
                  } else {
                    v.isActivity = false
                  }
                }
              } else {
                v.isActivity = false
              }
            }
          }
          for (var i = 0; i < effectiveList.length; i++) {
            effectiveList[i].selected = true
            var newSkvArr = effectiveList[i].shoppingCartSkuList
            var isActivity = effectiveList[i].isActivity
            if (Api.isNotEmpty(newSkvArr)) {
              var num = 0;
              var allGoodsAmount = 0
              var allGoodsPf = 0
              var sellPrice = 0;
              var sellPrice1 = 0;
              var wPrice = 0;
              var wPrice1 = 0;
              for (var j = 0; j < newSkvArr.length; j++) {
                num += newSkvArr[j].num
                var isActivity = newSkvArr[j].isActivity
                if (isActivity){
                  sellPrice += newSkvArr[j].activityPrice * newSkvArr[j].num
                  wPrice += newSkvArr[j].activityPrice * newSkvArr[j].num
                }else{
                  sellPrice1 += newSkvArr[j].sellPrice * newSkvArr[j].num
                  wPrice1 += newSkvArr[j].wholesalePrice * newSkvArr[j].num
                }
              }
              effectiveList[i].num = num
              effectiveList[i].allGoodsAmount = (sellPrice + sellPrice1).toFixed(2)
              effectiveList[i].allGoodsPf = (wPrice + wPrice1).toFixed(2)
            } else {
              if (isActivity){
                effectiveList[i].allGoodsAmount = (effectiveList[i].activityPrice * effectiveList[i].num).toFixed(2)
                effectiveList[i].allGoodsPf = (effectiveList[i].activityPrice * effectiveList[i].num).toFixed(2)
              }else{
                effectiveList[i].allGoodsAmount = (effectiveList[i].sellPrice * effectiveList[i].num).toFixed(2)
                effectiveList[i].allGoodsPf = (effectiveList[i].wholesalePrice * effectiveList[i].num).toFixed(2)
              }
              
            }
          }
        }
        if (failureList.length > 0) {
          _this.setData({
            lostList: true,
          });
        }
        if (effectiveList.length == 0 && failureList.length == 0) {
          _this.setData({
            allEmpty: false
          })
        }
        if (store) {
          storeMes.push(store)
        }
        if (effectiveList.length == 0) {
          _this.setData({
            hasList: false
          })
        }
        var saleBatchNum = 0
        var saleBatchAmount = 0
        if (Api.isNotEmpty(store)) {
          if (store.saleBatchAmount == null) {
            saleBatchAmount = 0
          } else {
            saleBatchAmount = store.saleBatchAmount
          }
          if (store.saleBatchNum == null) {
            saleBatchNum = 0
          } else {
            saleBatchNum = store.saleBatchNum
          }
        }
        _this.setData({
          storeAmount: saleBatchAmount,
          storeNum: saleBatchNum,
          detailList: effectiveList,
          lostcarts: failureList,
          storeMes: storeMes
        }, function() {
          _this.getTotalPrice();
        })
      })

  },

  onLoad: function(options) {

  },
  onShow() {
    this.setData({
      detailList: []
    })
    if (!Api.getStoreId()) {
      this.setData({
        indexEmpty: false
      })
    } else {
      if (app.globalData.storeIdRetail) {
        this.setData({
          goRetailStore: false
        })
      } else {
        getIdentity(this)
      }
    }

  },
  /**
   * 当前商品选中事件
   */
  /**
   * 当前商品选中事件
   */
  selectList(e) {
    const index = e.currentTarget.dataset.index;
    let detailList = this.data.detailList;
    const selected = detailList[index].selected;
    detailList[index].selected = !selected;
    var len = detailList.length,
      num = 0;
    for (var i = 0; i < detailList.length; i++) {
      if (detailList[i].selected) {
        num = num + 1
      }
    }
    if (num == len) {
      this.setData({
        selectAllStatus: true
      })
    } else {
      this.setData({
        selectAllStatus: false
      })
    }
    this.setData({
      detailList: detailList
    });
    this.getTotalPrice();
  },
  /**
   * 清空失效宝贝
   */
  emptyAll(e) {
    var _this = this
    Api.deteleCartFai()
      .then(res => {
        Api.showToast('清空成功')
        setTimeout(function() {
          _this.getList()
        }, 1000)
      })
  },

  /**
   * 删除购物车当前商品
   */
  deleteList(e) {
    const index = e.currentTarget.dataset.index,
      goodsId = e.currentTarget.dataset.id,
      _this = this
    Api.deteleCartGoods({
        goodsId: goodsId
      })
      .then(res => {
        Api.showToast("删除成功")
        _this.getList()
      })
  },

  /**
   * 购物车全选事件
   */
  selectAll(e) {
    let selectAllStatus = this.data.selectAllStatus;
    selectAllStatus = !selectAllStatus;
    let detailList = this.data.detailList;

    for (let i = 0; i < detailList.length; i++) {
      detailList[i].selected = selectAllStatus;
    }
    this.setData({
      selectAllStatus: selectAllStatus,
      detailList: detailList
    });
    this.getTotalPrice();
  },

  /**
   * 绑定加数量事件
   */
  addCart(goodsId, data) {
    Api.updateMoreCart(data)
      .then(res => {})
  },
  addCount(e) {
    var sign = e.currentTarget.dataset.sign
    const index = e.currentTarget.dataset.index;
    let detailList = this.data.detailList;
    let num = detailList[index].shoppingCartSkuList[0].num;
    if (sign=="reduce"){
      num = parseInt(num) - 1;
      Method.selectedSkuNum(detailList[index].shoppingCartSkuList[0], num,true,"cart")
    }
    if(sign=="add"){
      num = parseInt(num) + 1;
      Method.selectedSkuNum(detailList[index].shoppingCartSkuList[0], num)
    }
    if (sign == "input") {
      num = e.detail.value
      if (num == '') {
        num = 1
      }
      Method.selectedSkuNum(detailList[index].shoppingCartSkuList[0], num)
    } 
    num = detailList[index].shoppingCartSkuList[0].num
    let storeId = this.data.storeId
    detailList[index].shoppingCartSkuList[0].num = num;
    detailList[index].num = num
    var arr = this.updatePrice(num, index)
    detailList[index].allGoodsAmount = arr[0]
    detailList[index].allGoodsPf = arr[1]
    var data = detailList[index].shoppingCartSkuList
    var dataArr = []
    dataArr.push({
      goodsId: data[0]["goodsId"],
      num: parseInt(num),
      skuCode: data[0]["skuCode"],
      storeId: storeId
    })
    this.addCart(data[0]["goodsId"], JSON.stringify(dataArr))
    this.setData({
      detailList: detailList
    });
    this.getTotalPrice();
  },
  bindInputValue(e){
    let thisindex = e.currentTarget.dataset.index,
        value = e.detail.value
    this.setData({
      ['detailList[' + thisindex+'].num']: value
    })
  },
  /**
   * 绑定改变数量事件
   */
  addCountNew(e) {
    console.log(e)
    var sign = e.currentTarget.dataset.sign //获取是增加还是减少 或者手动输入 input代表手动输入
    const index = e.currentTarget.dataset.index;
    let detailList = this.data.detailList;
    let num = parseInt(detailList[index].num);
    if (sign == "input") {
      num = (e.detail.value).replace(/\s/g, "")
      if (num == 0 || num == '') {
        num = 1
      }
      Method.selectedSkuNum(detailList[index], num)
    }
    if (sign == "add") {
      num = parseInt(num) + 1;
      Method.selectedSkuNum(detailList[index], num)
    }
    if (sign == "reduce") {
      num = parseInt(num) - 1;
      Method.selectedSkuNum(detailList[index], num,true,"cart")
    }
    num = detailList[index].num
    let storeId = this.data.storeIdFV
    var isActivity = detailList[index].isActivity
    if (isActivity) {
      detailList[index].allGoodsPf = num * detailList[index].activityPrice
      detailList[index].allGoodsAmount = num * detailList[index].activityPrice
      if (num > detailList[index].saleStockNum) {
        Api.showToast("活动库存不足！")
      }
    } else {
      detailList[index].allGoodsPf = num * detailList[index].wholesalePrice
      detailList[index].allGoodsAmount = num * detailList[index].sellPrice
      if (num > detailList[index].stockNum) {
        Api.showToast("库存不足！")
      }
    }

    var dataArr = []
    dataArr.push({
      goodsId: detailList[index]["goodsId"],
      num: parseInt(num),
      skuCode: 0,
      storeId: storeId
    })
    this.addCart(detailList[index]["goodsId"], JSON.stringify(dataArr))
    this.setData({
      detailList: detailList
    }, function () {
      this.getTotalPrice();
    });
  },

  // 更改商品价格
  updatePrice: function(num, index) {
    var effectiveList = this.data.detailList[index],
      shoppingCartSkuList = effectiveList.shoppingCartSkuList
    if (Api.isNotEmpty(shoppingCartSkuList)) {
      var arr = []
      if (shoppingCartSkuList[0].isActivity){
        arr.push(shoppingCartSkuList[0].activityPrice * num)
        arr.push(shoppingCartSkuList[0].activityPrice * num)
      }else{
        arr.push(shoppingCartSkuList[0].sellPrice * num)
        arr.push(shoppingCartSkuList[0].wholesalePrice * num)
      }
      return arr
    } else {
      var arr = []
      if (effectiveList.isActivity){
        arr.push(effectiveList.activityPrice * num)
        arr.push(effectiveList.activityPrice * num)
      }else{
        arr.push(effectiveList.sellPrice * num)
        arr.push(effectiveList.wholesalePrice * num)
      }
      return arr
    }
  },

  /**
   * 计算总价
   */
  getTotalPrice() {
    var limitShow = this.data.limitShow,
      storeNum = this.data.storeNum,
      storeAmount = this.data.storeAmount,
      allTotalNum = 0,
      total1 = 0,
      totalNew = 0,
      differentPrice = this.data.differentPrice,
      differentPriceNew = 0,
      differentNum = 0,
      saleBatchGoodsNum = 0,
      allGoodsAmount = 0,
      enjoyCost = false
    var detailList = this.data.detailList; // 获取购物车列表
    for (var i = 0; i < detailList.length; i++) {
      if (detailList[i].selected) {
        if (limitShow == 3) {
          saleBatchGoodsNum = detailList[i].saleBatchNum
          if (!Api.isNotEmpty(saleBatchGoodsNum)) {
            detailList[i].saleBatchNum = storeNum
          }
        } else {
          total1 += parseFloat(detailList[i].allGoodsAmount);
        }

      }
    }
    if (limitShow == 3) {
      var allGoodsNum = 0
      var allGoodsTotal = 0
      for (var i = 0; i < detailList.length; i++) {
        if (detailList[i].selected) {
          //求除了活动商品数量
          if (detailList[i].isActivity){
            if (detailList[i].shoppingCartSkuList){
              var tempA = detailList[i].shoppingCartSkuList
              var num1 = 0
              var newAllSellPrice=0
              for(var v of tempA){
                if (!v.isActivity){
                  console.log(v)
                  num1 += v.num
                  newAllSellPrice += parseInt(v.num) * v.sellPrice
                }
              }
              detailList[i].newAllSellPrice = newAllSellPrice
              detailList[i].tempLen = num1
            }else{
              detailList[i].tempLen = 0
              detailList[i].newAllSellPrice = 0
            }
          }else{
            detailList[i].tempLen = detailList[i].num
            detailList[i].newAllSellPrice = detailList[i].allGoodsAmount
          }
          // console.log(detailList[i])
          allTotalNum = parseInt(detailList[i].num)
          allGoodsAmount = parseFloat(detailList[i].newAllSellPrice)
          differentPriceNew += allGoodsAmount
          saleBatchGoodsNum = detailList[i].saleBatchNum
          
          allGoodsNum += allTotalNum
          allGoodsTotal += allGoodsAmount

          if (saleBatchGoodsNum > 0 && allTotalNum < saleBatchGoodsNum) {
              detailList[i].enjoyPrice = false
          }
          
          if (storeNum == 0) {
            if (storeAmount == 0) {
              // detailList[i].enjoyPrice = true
              // enjoyCost = true
            } else {
              detailList[i].enjoyPrice = false
              enjoyCost = false
              if (storeAmount > 0) {
                if (allGoodsTotal > storeAmount) {
                  detailList[i].enjoyPrice = true
                  enjoyCost = true
                } else {
                  detailList[i].enjoyPrice = false
                  enjoyCost = false
                }
              }
            }
          }
          if (storeNum > 0) {
            var saleBatchGoodsNum = detailList[i].saleBatchNum
            if (storeAmount == 0) {
              if (allGoodsNum >= storeNum) {
                detailList[i].enjoyPrice = true
                enjoyCost = true
              } else {
                detailList[i].enjoyPrice = false
                enjoyCost = false
              }
            }
            if (storeAmount > 0) {
              if (allGoodsNum >= storeNum || allGoodsTotal > storeAmount) {
                detailList[i].enjoyPrice = true
                enjoyCost = true
              } else {
                detailList[i].enjoyPrice = false
                enjoyCost = false
              }
            }
            // if (saleBatchGoodsNum > 0) {
            //   if (allGoodsNum >= saleBatchGoodsNum) {
            //     detailList[i].enjoyPrice = true
            //   } else {
            //     detailList[i].enjoyPrice = false
            //   }
            // }
          }
          if (saleBatchGoodsNum > 0 && allTotalNum >= saleBatchGoodsNum) {
            detailList[i].enjoyPrice = true
          }
        } else {
          detailList[i].enjoyPrice = false
        }
      }

      var newTotalPrice = 0
      var newTotalPrice1 = 0
      var len = detailList.length
      var numTrue = 0
      for (var i = 0; i < detailList.length; i++) {
        var newChild1 = 0
        var newChild2 = 0
        if (detailList[i].selected) {
          if (enjoyCost) {
            detailList[i].enjoyPrice = true
            newTotalPrice1 += parseFloat(detailList[i].allGoodsPf) 
          } else {
            var enjoy = detailList[i].enjoyPrice
            if (enjoy) {
              numTrue++
              newTotalPrice += parseFloat(detailList[i].allGoodsPf) 
            } else {
              newTotalPrice1+= parseFloat(detailList[i].allGoodsAmount)
            }
          }
          total1 = newTotalPrice1 + newTotalPrice
        }
      }
      // 购物车的所有商品满足批发，则显示全场满足
      // if (numTrue == len) {
      //   this.setData({
      //     enjoyCostNew: true
      //   })
      // } else {
      //   this.setData({
      //     enjoyCostNew: false
      //   })
      // }
      differentPrice = storeAmount - differentPriceNew
      differentNum = storeNum - allGoodsNum
    }
    this.setData({
      detailList: detailList,
      total1: total1.toFixed(2),
      enjoyCost: enjoyCost,
      differentPrice: parseInt(differentPrice),
      differentNum: parseInt(differentNum)
    });
  },
  creatOrder: function() {
    var data = this.data.detailList,
      model = []
    for (var i = 0; i < data.length; i++) {
      if (data[i].selected) {
        var dataArr = data[i].shoppingCartSkuList
        if (dataArr != null) {
          for (var j = 0; j < dataArr.length; j++) {
            model.push({
              goodsId: data[i].goodsId,
              num: parseInt(dataArr[j].num),
              skuCode: dataArr[j].skuCode
            })
          }
        } else {
          model.push({
            goodsId: data[i].goodsId,
            num: parseInt(data[i].num),
            skuCode: 0
          })
        }
      }
    }
    if (model.length == 0) {
      Api.showToast("请勾选商品！")
      return
    }
    var model = JSON.stringify(model);
    wx.navigateTo({
      url: '../address/address?model=' + model + '&enjoyCost=' + this.data.enjoyCost + '&totalPrice=' + this.data.totalPrice,
    })
  },
  onPullDownRefresh: function() {
    this.onShow()
    wx.stopPullDownRefresh();
  },
})