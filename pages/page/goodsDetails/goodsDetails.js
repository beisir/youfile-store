const app = getApp();
import Api from '../../../utils/api.js'
import {
  uploadImg
} from '../../../utils/const.js'
var WxParse = require('../../../wxParse/wxParse.js');
import authHandler from '../../../utils/authHandler.js';
const util = require('../../../utils/util.js')
import IsStoreOwner from '../../../utils/isStoreOwner.js';
const ctx = wx.createCanvasContext('myCanvas')
// 身份判断
function getIdentity(_this, goodsId, isTrue) {
  let isStoreOwner = new IsStoreOwner();
  isStoreOwner.enterIdentity().then(res => {
    _this.getDetails(goodsId, isTrue)
  }).catch(res => {});
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    globalData: app.globalData,
    limitShow: 1,
    storeId: wx.getStorageSync('storeId'),
    imgUrls: [],
    baseUrl: app.globalData.imageUrl,
    goodsSpecificationVOList: [],
    isShowNewOne: false,
    goodsSkuVOList: [],
    newSkuOnlyIndex: 0,
    skuArrTwo: [],
    disLike: false,
    stockNumHide: false,
    saleBatchNumGoods: 0,
    newSkuArrTwo: [],
    nameTwo: '',
    differNum: 0,
    differMoney: 0,
    newSkuOnly: false,
    newSkuOnlyEdit: false,
    className: 'active',
    indicatorDots: true,
    autoplay: true,
    interval: 2000,
    sdescription: '',
    duration: 500,
    bg: '#C79C77',
    Height: "",
    hidden: true,
    numbers: 1,
    name: '',
    likeShow: false,
    wholesalePrice: '',
    recommendDesc: '',
    introduction: '',
    swichNavCode: true,
    swichNav: -1,
    changeButtonCode: true,
    mainImgUrl: '',
    wholesale: '',
    sell: '',
    stockNum: '',
    saleBatchNum: 0,
    saleBatchAmount: 0,
    totalPrice: '',
    goodsId: '',
    skuStr: '',
    numAll: 0,
    moreCode: '',
    nums: 0,
    getSpecDetails: true,
    classNums: 0,
    newTotal: 0,
    showCart: true,
    showCartOne: true,
    discountShow: true,
    spectArrDifference: [],
    editCode: false,
    newCartList: [],
    favoriteNum: 0,
    editOneName: false,
    store: '',
    copyGoods: false,
    openStore: false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  call() {
    if (this.data.store.servicePhone) {
      wx.makePhoneCall({
        phoneNumber: this.data.store.servicePhone
      })
    } else {
      Api.showToast("该商户暂无客服电话哦~")
    }
  },
  openStore: function() {
    wx.navigateTo({
      url: '../../cloudOrder/newCloud/newCloud',
    })
  },
  // 一键入库
  copyGoods: function(e) {
    var originGoodsId = this.data.goodsId
    this.setData({
      copyGoods: true,
      originGoodsId: originGoodsId
    })
  },
  copyGoodsYes: function() {
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
  showLogo: function() {
    this.selectComponent("#login").showPage();
  },
  addTip: function() {
    var Id = this.data.store.storeId,
      logo = this.data.store.logo,
      name = this.data.store.storeName
    wx.navigateTo({
      url: '../../businessFriend/information/information?status=0&send=&accept=' + Id + '&remark=&logo=' + logo + '&name=' + name,
    })
    // this.setData({
    //   show:true
    // })
  },
  onLoad: function(options) {
    var that = this,
      arr = [],
      goodsId = '180929212000'
    if (options != undefined) {
      if (options.goodsId) {
        goodsId = options.goodsId
        that.setData({
          goodsId: goodsId
        })
      }
      // 修改进货车或者购物车
      if (options.code) {
        that.setData({
          editCode: true, //编辑进货车或者购物车
        })
        Api.cartList()
          .then(res => {
            var res = res.obj.effectiveList[0].goodsList
            for (var i = 0; i < res.length; i++) {
              if (res[i].goodsId == options.goodsId) {
                arr = res[i].shoppingCartSkuList
              }
            }
            if (options.name == "more") {
              that.setData({
                showCart: false, //修改进货车或者多个规格
              })
            } else {
              // 修改购物车
              that.setData({
                showCartOne: false,
                editOneName: true
              })
            }
            that.setData({
              newCartList: arr,
            }, function() {
              if (options.name == "more") {
                getIdentity(this, goodsId, true)
              } else {
                getIdentity(this, goodsId, false)
              }
            })
          })
      } else {
        getIdentity(this, goodsId, false) //查看详情
      }
    } else {
      getIdentity(this, this.data.goodsId, false) //刷新登录
    }
  },

  imgHeight: function(e) {
    var winWid = wx.getSystemInfoSync().windowWidth; //获取当前屏幕的宽度
    var imgh = e.detail.height; //图片高度
    var imgw = e.detail.width; //图片宽度
    var swiperH = winWid * imgh / imgw + "px" //等比设置swiper的高度。 即 屏幕宽度 / swiper高度 = 图片宽度 / 图片高度  ==》swiper高度 = 屏幕宽度 * 图片高度 / 图片宽度
    this.setData({
      Height: swiperH //设置高度
    })
  },
  cancel: function() {
    this.setData({
      hidden: true
    });
  },
  //选择规格
  showAlert: function() {
    var that = this,
      limitShow = this.data.limitShow,
      stockNumHide = this.data.stockNumHide
    if (stockNumHide) {
      Api.showToast("该商品已售罄！")
      return
    }
    if (limitShow == 2) {
      Api.showToast("不能购买自己店铺的东西哦！")
      return
    }
    var animation = wx.createAnimation({
      duration: 300,
      timingFunction: 'linear'
    })
    that.animation = animation
    animation.translateY(300).step()
    that.setData({
      animationData: animation.export(),
      hidden: false
    })
    setTimeout(function() {
      animation.translateY(0).step()
      that.setData({
        animationData: animation.export()
      })
    }, 30)
  },
  goodsSku: function(code, index) {
    var _this = this,
      swichNavCode = this.data.swichNavCode,
      changeButtonCode = this.data.changeButtonCode,
      dataList = _this.data.goodsSkuVOList
    for (var i = 0; i < dataList.length; i++) {
      if (dataList[i].specValueCodeList.indexOf(code) != -1) {
        if (dataList[i].specValueCodeList.length == 2) {
          if (index == 0) {
            if (dataList[i].specValueCodeList.indexOf(swichNavCode) != -1) {
              _this.setData({
                wholesale: dataList[i].wholesalePrice,
                stockNum: dataList[i].stockNum,
                sell: dataList[i].sellPrice
              })
              break
            }
          } else {
            if (dataList[i].specValueCodeList.indexOf(changeButtonCode) != -1) {
              _this.setData({
                wholesale: dataList[i].wholesalePrice,
                stockNum: dataList[i].stockNum,
                sell: dataList[i].sellPrice
              })
              break
            }
          }
        } else {
          _this.setData({
            wholesale: dataList[i].wholesalePrice,
            stockNum: dataList[i].stockNum,
            sell: dataList[i].sellPrice
          })
          break
        }
      }
    }
    if (!this.data.showCartOne) {
      this.getTotalPrice();
    }
  },
  getNewData: function(current, changeButtonCode) {
    this.goodsSku(changeButtonCode, 0)
    var that = this;
    if (this.data.specsTab === current) {
      return false;
    } else {
      that.setData({
        specsTab: current,
        changeButtonCode: changeButtonCode
      }, function() {
        that.selectedSku()
      })
    }
  },
  getNewData1: function(current, swichNavCode) {
    this.goodsSku(swichNavCode, 1)
    var that = this;
    if (this.data.currentTab === current) {
      return false;
    } else {
      that.setData({
        currentTab: current,
        swichNavCode: swichNavCode
      }, function() {
        that.selectedSku()
      })
    }
  },
  //选择规格属性
  changeButton: function(e) {
    var changeButtonCode = e.target.dataset.code,
      current = e.target.dataset.current
    this.getNewData(current, changeButtonCode)
  },
  weghtSwi: function(e) {
    var swichNavCode = e.target.dataset.code,
      current = e.target.dataset.current
    this.getNewData1(current, swichNavCode)
  },
  getSpecDetails: function(index, code) {
    var that = this,
      swichNavCode = index,
      code = code,
      skuArrTwo = this.data.skuArrTwo,
      skuArr = this.data.goodsSkuVOList,
      skuValueVOList = [],
      newSkuArrTwo = [],
      codeName = this.data.goodsSpecificationVOList,
      newList = {},
      returnStop = false,
      spectArrDifference = this.data.spectArrDifference
    if (skuArrTwo.length == 1) {
      skuValueVOList = skuArrTwo[0].goodsSpecificationValueVOList
    }
    for (var i = 0; i < skuArr.length; i++) {
      var childArr = skuArr[i].specValueCodeList
      if (childArr.indexOf(code) != -1) {
        newSkuArrTwo.push(skuArr[i])
      }
    }
    for (var i = 0; i < newSkuArrTwo.length; i++) {
      for (var j = 0; j < skuValueVOList.length; j++) {
        if ((newSkuArrTwo[j].specValueCodeList).indexOf(skuValueVOList[j].specValueCode) != -1) {
          newSkuArrTwo[j].name = skuValueVOList[j].specValueName
          if (newSkuArrTwo[j].num == undefined) {
            newSkuArrTwo[j].num = 0
          }
        }
      }
    }
    // 修改购物车
    if (that.data.editCode) {
      var arr = []
      arr = this.data.newCartList
      for (var i = 0; i < arr.length; i++) {
        if (this.data.editOneName) {
          var newArr = codeName[0].goodsSpecificationValueVOList
          if (newArr.length > 0) {
            if (codeName.length == 1) {
              var newArrLast = codeName[0].goodsSpecificationValueVOList
            }
            if (codeName.length == 2) {
              var newArrLast = codeName[1].goodsSpecificationValueVOList
            }
            for (var l = 0; l < newArrLast.length; l++) {
              if (arr[i].specValueCodes.indexOf(newArrLast[l].specValueCode) != -1) {
                this.getNewData1(l, newArrLast[l].specValueCode)
              }
            }
          }
          for (var l = 0; l < newArr.length; l++) {
            if (arr[i].specValueCodes.indexOf(newArr[l].specValueCode) != -1) {
              newSkuArrTwo[i].num = arr[i].num
              this.getNewData(l, newArr[l].specValueCode)
              that.setData({
                numbers: arr[i].num
              })
            }
          }
          that.setData({
            goodsSpecificationVOList: codeName
          })
        } else {
          var skuCode = arr[i].skuCode
          var lenNum = 1
          if (arr[0].specValueCodes) {
            var lenArr = arr[0].specValueCodes
            lenNum = lenArr.length
          }
          for (var j = 0; j < newSkuArrTwo.length; j++) {
            if (newSkuArrTwo[j].skuCode == skuCode) {
              if (lenNum == 1) {
                newSkuArrTwo[j].num = arr[i].num

              } else {
                if (newSkuArrTwo[j].num == 0) {
                  newSkuArrTwo[j].num = arr[i].num
                  arr[i].num = 0
                }
              }

            }
          }
        }
      }
    }
    if (spectArrDifference.length == 0) {
      spectArrDifference.push({
        code: code,
        newSkuArrTwo: newSkuArrTwo
      })
    } else {
      for (var i = 0; i < spectArrDifference.length; i++) {
        if (code == spectArrDifference[i].code) {
          returnStop = true
        }
      }
      if (!returnStop) {
        spectArrDifference.push({
          code: code,
          newSkuArrTwo: newSkuArrTwo
        })
      }
    }
    if (this.data.newSkuOnly) {
      for (var i = 0; i < spectArrDifference.length; i++) {
        var arrDataNew = spectArrDifference[i].newSkuArrTwo
        arrDataNew[0].num = 0
      }
    }
    if (this.data.currentTab === index) {
      return false;
    } else {
      that.setData({
        swichNav: swichNavCode,
        newSkuArrTwo: newSkuArrTwo,
        moreCode: code,
        spectArrDifference: spectArrDifference
      })
    }
    this.getTotalPrice();
  },
  newGetSpecDetails: function(index, code) {
    var that = this,
      swichNavCode = index,
      code = code,
      skuArrTwo = this.data.skuArrTwo,
      skuArr = this.data.goodsSkuVOList,
      skuValueVOList = [],
      newSkuArrTwo = [],
      codeName = this.data.goodsSpecificationVOList,
      newList = {},
      returnStop = false,
      spectArrDifference = this.data.spectArrDifference
    if (this.data.currentTab === index) {
      return false;
    } else {
      that.setData({
        swichNav: swichNavCode,
        newSkuArrTwo: newSkuArrTwo,
        moreCode: code,
        spectArrDifference: spectArrDifference
      })
    }
    this.getTotalPrice();
  },
  swichNav: function(e) {
    var index = e.target.dataset.current,
      code = e.target.dataset.code
    if (this.data.newSkuOnly) {
      this.newGetSpecDetails(index, code)
      this.setData({
        newSkuOnlyIndex: index
      })
    } else {
      this.getSpecDetails(index, code)
    }
  },
  //关闭弹框
  closeAlert: function() {
    if (this.data.editCode) {
      var index = this.data.currentTab
      var pages = getCurrentPages(); //  获取页面栈
      var currPage = pages[pages.length - 1];
      var prevPage = pages[pages.length - 2]; // 上一个页面
      prevPage.setData({
        mydata: 0
      })
      wx.navigateBack({
        data: 1
      })
    } else {
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
    }

  },
  urlHome: function() {
    wx.switchTab({
      url: '../home/home'
    })
  },
  urlCart: function() {
    wx.switchTab({
      url: '../cartList/cartList'
    })
  },
  cratHome: function(e) {
    var _this = this,
      num = this.data.numbers,
      goodsId = this.data.goodsId,
      status = e.target.dataset.status,
      skuCode = '',
      changeButtonCode = this.data.changeButtonCode,
      swichNavCode = this.data.swichNavCode,
      goodsSpecificationVOList = this.data.goodsSpecificationVOList,
      goodsSkuVOList = this.data.goodsSkuVOList
    for (var i = 0; i < goodsSkuVOList.length; i++) {
      var childArr = goodsSkuVOList[i].specValueCodeList
      if (childArr.length == 1) {
        if (childArr.indexOf(changeButtonCode) != -1) {
          skuCode = goodsSkuVOList[i].skuCode
        }
      } else {
        if (childArr.indexOf(swichNavCode) != -1 && childArr.indexOf(changeButtonCode) != -1) {
          skuCode = goodsSkuVOList[i].skuCode
        }
      }
    }

    if (goodsSpecificationVOList.length > 0) {
      if (goodsSkuVOList.length == 0) {
        Api.showToast("该属性异常，请联系客服！")
        return
      }
      if (skuCode == '') {
        Api.showToast("请选择商品属性!")
        return
      }
    } else {
      skuCode = 0
    }
    if (!Api.isNotEmpty(wx.getStorageSync("access_token"))) {
      _this.showLogo()
      return
    }
    if (status == 0) {
      if (this.data.editOneName) {
        var data = []
        data.push({
          goodsId: goodsId,
          num: num,
          skuCode: skuCode,
          storeId: this.data.storeId
        })
        Api.updateMoreCart(JSON.stringify(data))
          .then(res => {
            wx.showToast({
              title: '修改成功',
              icon: 'none',
              duration: 1000,
              mask: true
            })
            wx.switchTab({
              url: '../cartList/cartList'
            })
          })
      } else {
        _this.selectedSku()
        Api.addCart({
            goodsId: goodsId,
            num: num,
            skuCode: skuCode
          })
          .then(res => {
            wx.showToast({
              title: '添加成功',
              icon: 'none',
              duration: 1000,
              mask: true
            })
            _this.setData({
              hidden: true
            })
          })
      }
    } else {
      var model = {
        goodsId: goodsId,
        num: num,
        skuCode: skuCode
      }
      wx.navigateTo({
        url: '../address/address?model=' + JSON.stringify(model),
      })
    }

  },
  // 批量添加购物车
  moreAddCart: function(e) {
    var specFirst = this.data.goodsSpecificationVOList[0].goodsSpecificationValueVOList,
      moreCode = this.data.moreCode,
      goodsId = this.data.goodsId,
      goodsSkuVOList = this.data.goodsSkuVOList,
      spectArrDifference = this.data.spectArrDifference,
      goodsSpecificationVOList = this.data.goodsSpecificationVOList,
      newArr = [],
      newSkuArrTwo = [],
      _this = this,
      status = e.target.dataset.status
    for (var j = 0; j < spectArrDifference.length; j++) {
      newSkuArrTwo = spectArrDifference[j].newSkuArrTwo
      for (var i = 0; i < newSkuArrTwo.length; i++) {
        if (newSkuArrTwo[i].num > 0) {
          newArr.push({
            goodsId: goodsId,
            num: newSkuArrTwo[i].num,
            skuCode: newSkuArrTwo[i].skuCode,
            storeId: wx.getStorageSync('storeId')
          })

        }
      }
    }
    if (goodsSpecificationVOList.length > 0) {
      if (goodsSkuVOList.length == 0) {
        Api.showToast("该属性异常，请联系客服！")
        return
      }
      if (newArr.length == 0) {
        wx.showToast({
          title: '请选择商品属性',
          icon: 'none',
          duration: 1000,
          mask: true
        })
        return
      }
    }
    if (status == 1) {
      var model = JSON.stringify(newArr);
      wx.navigateTo({
        url: '../address/address?model=' + model + '&enjoyCost=' + !this.data.discountShow + '&totalPrice=' + this.data.newTotal,
      })
    } else {
      if (this.data.editCode) {
        Api.updateMoreCart(JSON.stringify(newArr))
          .then(res => {
            wx.showToast({
              title: '修改成功',
              icon: 'none',
              duration: 1000,
              mask: true
            })
            wx.switchTab({
              url: '../cartList/cartList'
            })
          })
      } else {
        Api.addMoreCart(JSON.stringify(newArr))
          .then(res => {
            wx.showToast({
              title: '添加成功',
              icon: 'none',
              duration: 1000,
              mask: true
            })
            _this.setData({
              hidden: true
            })
          })
      }
    }
  },
  // 没有规格进货商身份
  getTotalPriceNew: function(num) {
    var wholesalePrice = this.data.wholesalePrice,
      sell = this.data.sell,
      saleBatchNumGoods = this.data.saleBatchNumGoods,
      saleBatchNum = this.data.saleBatchNum,
      difference = 0,
      differMoney = 0,
      differNum = 0,
      discountShow = true,
      saleBatchAmount = this.data.saleBatchAmount,
      total = 0
    total = num * sell
    difference = total - num * wholesalePrice
    if (saleBatchNumGoods == 0) {
      saleBatchNumGoods = saleBatchNum
    }
    if (saleBatchNum == 0) {
      if (saleBatchAmount == 0) {
        discountShow = false
      } else {
        discountShow = true
        if (total >= saleBatchAmount) {
          discountShow = false
        } else {
          discountShow = true
        }
      }
      differMoney = saleBatchAmount - total
    } else {
      if (saleBatchAmount == 0) {
        if (num >= saleBatchNum || num >= saleBatchNumGoods) {
          discountShow = false
        } else {
          discountShow = true
        }
      }
      if (saleBatchAmount > 0) {
        if (num >= saleBatchNum || total >= saleBatchAmount || num >= saleBatchNumGoods) {
          discountShow = false
        } else {
          discountShow = true
        }

      }
      differNum = saleBatchNumGoods - num
      differMoney = saleBatchAmount - total
    }
    this.setData({
      discountShow: discountShow,
      differNum: differNum,
      differMoney: differMoney.toFixed(2),
      difference: parseInt(difference)
    })
  },
  // 购买数量
  minusCount: function() {
    let num = this.data.numbers
    num = num - 1
    if (num == 0) {
      return
    } else {
      this.setData({
        numbers: num
      })
    }
    this.selectedSku()
    if (this.data.isShowNewOne) {
      this.getTotalPriceNew(num)
    }
    if (this.data.editOneName) {
      var newSkuArrTwo = this.data.newSkuArrTwo
      for (var i = 0; i < newSkuArrTwo.length; i++) {
        if (newSkuArrTwo[i].num > 0) {
          newSkuArrTwo[i].num = num
        }
      }
      this.setData({
        newSkuArrTwo: newSkuArrTwo
      }, function() {
        this.getTotalPrice();
      })
    }
  },
  // 判断选中的SKU
  selectedSku: function() {
    var skuStr = '',
      swichNavCode = this.data.swichNavCode,
      changeButtonCode = this.data.changeButtonCode,
      goodsSkuVOList = this.data.goodsSkuVOList
    for (var i = 0; i < goodsSkuVOList.length; i++) {
      var childArr = goodsSkuVOList[i].specValueCodeList
      if (childArr.length == 1) {
        if (childArr.indexOf(changeButtonCode) != -1) {
          skuStr = goodsSkuVOList[i].skuName
        }
      } else {
        if (childArr.indexOf(swichNavCode) != -1 && childArr.indexOf(changeButtonCode) != -1) {
          skuStr = goodsSkuVOList[i].skuName
        }
      }
    }
    this.setData({
      skuStr: skuStr
    })
  },
  addCount: function() {
    let num = this.data.numbers
    var stockNum = this.data.stockNum
    if (num >= stockNum) {
      Api.showToast("库存不足！")
      return
    }
    num = num + 1
    this.setData({
      numbers: num,
    })
    this.selectedSku()
    if (this.data.isShowNewOne) {
      this.getTotalPriceNew(num)
    }
    if (this.data.editOneName) {
      var newSkuArrTwo = this.data.newSkuArrTwo
      for (var i = 0; i < newSkuArrTwo.length; i++) {
        if (newSkuArrTwo[i].num > 0) {
          newSkuArrTwo[i].num = num
        }
      }
      this.setData({
        newSkuArrTwo: newSkuArrTwo
      }, function() {
        this.getTotalPrice();
      })
    }

  },
  /**
   * 绑定加数量事件
   */
  addCount1(e) {
    const index = e.currentTarget.dataset.index;
    let spectArrDifference = this.data.spectArrDifference
    let code = this.data.moreCode
    var goodsSpecificationVOListNew = this.data.goodsSpecificationVOList
    var goodsSpecificationVOList = goodsSpecificationVOListNew[0].goodsSpecificationValueVOList
    for (var i = 0; i < spectArrDifference.length; i++) {
      if (spectArrDifference[i].code == code) {
        if (spectArrDifference[i].newSkuArrTwo[index].num == undefined) {
          spectArrDifference[i].newSkuArrTwo[index].num = 0
        }
        if (spectArrDifference[i].newSkuArrTwo[index].num >= spectArrDifference[i].newSkuArrTwo[index].stockNum) {
          Api.showToast("库存不足！")
          return
        } else {
          spectArrDifference[i].newSkuArrTwo[index].num = spectArrDifference[i].newSkuArrTwo[index].num + 1
        }
      }
    }
    if (this.data.newSkuOnly) {
      for (var i = 0; i < goodsSpecificationVOList.length; i++) {
        for (var j = 0; j < spectArrDifference.length; j++) {
          if ((spectArrDifference[j].newSkuArrTwo[0].specValueCodeList).indexOf(goodsSpecificationVOList[i].specValueCode) != -1) {
            goodsSpecificationVOList[i].num = spectArrDifference[j].newSkuArrTwo[0].num
          }
        }
        goodsSpecificationVOListNew[0].goodsSpecificationValueVOList = goodsSpecificationVOList
      }
      this.setData({
        goodsSpecificationVOList: goodsSpecificationVOListNew,
        spectArrDifference: spectArrDifference
      })
      this.getTotalPrice();
    } else {
      this.setData({
        spectArrDifference: spectArrDifference
      });
      this.getTotalPrice();
    }
  },

  /**
   * 绑定减数量事件
   */
  minusCount1(e) {
    const index = e.currentTarget.dataset.index;
    let spectArrDifference = this.data.spectArrDifference
    let code = this.data.moreCode
    for (var i = 0; i < spectArrDifference.length; i++) {
      if (spectArrDifference[i].code == code) {
        if (spectArrDifference[i].newSkuArrTwo[index].num <= 0) {
          return false;
        }
        spectArrDifference[i].newSkuArrTwo[index].num = spectArrDifference[i].newSkuArrTwo[index].num - 1
      }
    }
    this.setData({
      spectArrDifference: spectArrDifference
    });
    this.getTotalPrice();
  },
  /**
   * 计算总价
   */
  getTotalPrice() {
    var childArr = [],
      code = this.data.moreCode,
      colorNum = 0,
      differNum = 0,
      differMoney = 0
    let newSkuArrTwo = [];
    let swichNav = this.data.swichNav;
    let spectArrDifference = this.data.spectArrDifference
    let total = 0; //总价
    let activeGoodsTotal = 0; //活动商品总价
    let newTotal = 0;
    let discount = 0;
    let nomalGoodsNums = 0; //除了活动的数量
    let nums = 0; //一共的数量
    let classNums = 0;
    let saleBatchAmount = this.data.saleBatchAmount //店铺的起批金额
    let saleBatchNum = this.data.saleBatchNum //店铺的起批数量
    let saleBatchNumGoods = this.data.saleBatchNumGoods //商品的起批金额
    let difference = 0 //差价
    let discountShow = true //是否享受批发价
    let newSkuOnly = this.data.newSkuOnly
    let limitShow = this.data.limitShow //判断是否是进货商身份  3代表是
    let goodsSpecificationVOList = this.data.goodsSpecificationVOList
    if (goodsSpecificationVOList.length > 0) {
      var childArr = goodsSpecificationVOList[0].goodsSpecificationValueVOList
    }
    if (saleBatchNumGoods == 0) {
      saleBatchNumGoods = saleBatchNum
    }
    for (var j = 0; j < spectArrDifference.length; j++) {
      newSkuArrTwo = spectArrDifference[j].newSkuArrTwo
      for (let i = 0; i < newSkuArrTwo.length; i++) {
        //用来表示有多少个规格 红色显示数量
        if (spectArrDifference[j].code == code) {
          colorNum += newSkuArrTwo[i].num
          childArr[swichNav].num = colorNum
        }
        // 计算选择的SKU 数量大于0的相加
        // isActivity
        if (newSkuArrTwo[i].num > 0) {
          classNums += 1 //种类
          // 当前SKU是否是活动商品
          var isActivity = newSkuArrTwo[i].isActivity ? true : false
          if (!isActivity) {
            nums += newSkuArrTwo[i].num //数量
          }
          nomalGoodsNums += newSkuArrTwo[i].num
          if (this.data.showCartOne) { //true添加 为false 是修改购物车
            if (isActivity) {
              activeGoodsTotal += newSkuArrTwo[i].num * newSkuArrTwo[i].activityPrice;
            } else {
              total += newSkuArrTwo[i].num * newSkuArrTwo[i].sellPrice;
            }
          } else {
            if (!isActivity) {
              total += newSkuArrTwo[i].num * this.data.sell;
            }
          }
          // 进货商身份
          if (limitShow == 3) {
            if (!isActivity) {
              newTotal += newSkuArrTwo[i].num * newSkuArrTwo[i].wholesalePrice; //总的批发价
              difference = total - newTotal //差价
              // 判断是否享受 起批设置
              if (saleBatchNum == 0) {
                if (saleBatchAmount == 0) {
                  discountShow = false
                } else {
                  discountShow = true
                  if (total >= saleBatchAmount) {
                    discountShow = false
                  } else {
                    discountShow = true
                  }
                }
                differMoney = saleBatchAmount - total
              } else {
                if (saleBatchAmount == 0) {
                  if (nums >= saleBatchNum || nums >= saleBatchNumGoods) {
                    discountShow = false
                  } else {
                    discountShow = true
                  }
                }
                if (saleBatchAmount > 0) {
                  if (nums >= saleBatchNum || total >= saleBatchAmount || nums >= saleBatchNumGoods) {
                    discountShow = false
                  } else {
                    discountShow = true
                  }
                }
                differNum = saleBatchNumGoods - nums
                differMoney = saleBatchAmount - total
              }
            }
          }
        }
      }
    }
    goodsSpecificationVOList[0].goodsSpecificationValueVOList = childArr
    //页面显示选择的规格
    var skuStr = ''
    for (var j = 0; j < spectArrDifference.length; j++) {
      newSkuArrTwo = spectArrDifference[j].newSkuArrTwo
      for (var i = 0; i < newSkuArrTwo.length; i++) {
        if (newSkuArrTwo[i].num > 0) {
          skuStr += newSkuArrTwo[i].skuName + ","

        }
      }
    }
    skuStr = (skuStr.substring(skuStr.length - 1) == ',') ? skuStr.substring(0, skuStr.length - 1) : skuStr
    this.setData({
      newSkuArrTwo: newSkuArrTwo,
      skuStr: skuStr, ///页面显示选择的规格
      totalPrice: (total + activeGoodsTotal).toFixed(2),
      nums: nomalGoodsNums, //数量
      differNum: differNum == 0 ? saleBatchNumGoods : differNum, //差的数量
      differMoney: differMoney == 0 ? saleBatchAmount : differMoney.toFixed(2), //差价
      discountShow: discountShow,
      classNums: classNums, //种类商品
      newTotal: (newTotal + activeGoodsTotal).toFixed(2),
      difference: parseInt(difference),
      goodsSpecificationVOList: goodsSpecificationVOList
    });
  },
  // 批量减少
  minusCountAll: function() {
    let _this = this;
    let newSkuArrTwo = [];
    let spectArrDifference = this.data.spectArrDifference
    let code = this.data.moreCode
    let index = null
    for (var i = 0; i < spectArrDifference.length; i++) {
      if (spectArrDifference[i].code == code) {
        index = i
        newSkuArrTwo = spectArrDifference[i].newSkuArrTwo
      }
    }
    for (let i = 0; i < newSkuArrTwo.length; i++) {
      if (newSkuArrTwo[i].num > 0) {
        // 改变数量
        this.selectedSkuNum(newSkuArrTwo[i], newSkuArrTwo[i].num - 1,true)
      }
    }
    spectArrDifference[index].newSkuArrTwo = newSkuArrTwo
    this.setData({
      spectArrDifference: spectArrDifference
    }, function() {
      _this.getTotalPrice();
    });
  },
  // 批量添加
  addCountAll: function() {
    let newSkuArrTwo = [];
    let spectArrDifference = this.data.spectArrDifference
    let code = this.data.moreCode
    let index = null
    for (var i = 0; i < spectArrDifference.length; i++) {
      if (spectArrDifference[i].code == code) {
        index = i
        newSkuArrTwo = spectArrDifference[i].newSkuArrTwo
      }
    }
    for (let i = 0; i < newSkuArrTwo.length; i++) {
      if (newSkuArrTwo[i].num == undefined || newSkuArrTwo[i].num == NaN) {
        newSkuArrTwo[i].num = 0
      }
      // 改变数量
      this.selectedSkuNum(newSkuArrTwo[i], newSkuArrTwo[i].num+1)
    }
    spectArrDifference[index].newSkuArrTwo = newSkuArrTwo
    this.setData({
      spectArrDifference: spectArrDifference, //选择哪些规格属性的数组
    }, function() {
      this.getTotalPrice();
    });
  },
  // 手动输入数量
  changeNum: function(e) {
    const index = e.currentTarget.dataset.index;
    const code = e.currentTarget.dataset.code;
    const obj = e.currentTarget.dataset.obj;
    var value = parseInt(e.detail.value)
    var goodsSpecificationVOListNew = this.data.goodsSpecificationVOList
    var goodsSpecificationVOList = goodsSpecificationVOListNew[0].goodsSpecificationValueVOList
    if (value < 0 || isNaN(value)) {
      value = 0
    }
    let spectArrDifference = this.data.spectArrDifference;
    if (this.data.newSkuOnly) {
      var current = this.data.newSkuOnlyIndex
      goodsSpecificationVOList[current].num = value
      for (var j = 0; j < spectArrDifference.length; j++) {
        if ((spectArrDifference[j].newSkuArrTwo[0].specValueCodeList).indexOf(goodsSpecificationVOList[current].specValueCode) != -1) {
          // 改变数量
          this.selectedSkuNum(spectArrDifference[j].newSkuArrTwo[0], value)

          // if (value >= spectArrDifference[j].newSkuArrTwo[0].stockNum) {
          //   value = spectArrDifference[j].newSkuArrTwo[0].stockNum
          //   spectArrDifference[j].newSkuArrTwo[0].num = value
          //   Api.showToast("库存不足！")
          // } else {
          //   spectArrDifference[j].newSkuArrTwo[0].num = value
          // }
        }
      }
      goodsSpecificationVOListNew[0].goodsSpecificationValueVOList = goodsSpecificationVOList
      this.setData({
        goodsSpecificationVOList: goodsSpecificationVOListNew,
      })
    } else {
      for (let i = 0; i < spectArrDifference.length; i++) {
        if (spectArrDifference[i].code == code) {
          // 改变数量
          this.selectedSkuNum(spectArrDifference[i].newSkuArrTwo[index], value)
        }
      }
    }
    this.setData({
      spectArrDifference: spectArrDifference
    }, function() {
      this.getTotalPrice();
    });

  },

  // 添加商品数量，判断活动商品是否超出库存
  selectedSkuNum: function(obj, value,isTrue) {
    // isTrue为true代表减
    console.log(value)
    var isActivity = obj.isActivity //判断是否是活动商品
    if (isActivity) {
      // 判断数量不能小于起购量
      var saleBatch = obj.saleBatch
      if (value >= saleBatch) {
        obj.num = value
      } else {
        // 判断起购量不能小于库存才可以购买
        if (obj.stockNum >= obj.saleBatch) {
          obj.num = obj.saleBatch
        } else {
          obj.num = 0
        }
      }
    } else {
      obj.num = value + 1
    }
    if (value >= obj.stockNum) {
      obj.num = obj.stockNum
      // Api.showToast("库存不足！")
    }
    return obj
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  getDetails: function(goodsId, isTrue) {
    var _this = this,
      storeId = this.data.storeId,
      limitShow = this.data.limitShow
    if (limitShow == 3) {
      // 根据商友关系 查询店铺的起批量和起批金额
      Api.config(goodsId)
        .then(res => {
          var obj = res.obj
          if (obj != null) {
            var storeSaleBatchNum = obj.storeSaleBatchNum == null ? 0 : obj.storeSaleBatchNum,
              storeSaleBatchAmount = obj.storeSaleBatchAmount == null ? 0 : obj.storeSaleBatchAmount,
              saleBatchNumGoods = obj.goodsSaleBatchNum == null ? 0 : obj.goodsSaleBatchNum
            _this.setData({
              saleBatchNum: storeSaleBatchNum,
              saleBatchAmount: storeSaleBatchAmount,
              saleBatchNumGoods: saleBatchNumGoods
            })
          }
        })
    }
    Api.goodsDetails({
        goodsId: goodsId
      })
      .then(res => {
        var obj = res.obj.goodsVO,
          store = res.obj.store,
          skuArrTwo = [],
          name = ''
        //隐私商品直接返回首页
        if (limitShow == 1 && obj.privacy == 1) {
          wx.switchTab({
            url: '../home/home'
          })
          return
        }
        // 描述信息编辑器解析
        var that = this;
        var article = '<div>' + obj.description + '</div>'
        if (Api.isNotEmpty(obj.description)) {
          _this.setData({
            description: true
          })
        } else {
          _this.setData({
            description: false
          })
        }
        WxParse.wxParse('article', 'html', article, that, 5);
        // 是否关注信息
        if (store.isFollow) {
          app.globalData.isFollow = true
          _this.setData({
            likeShow: true
          })
        } else {
          app.globalData.isFollow = false
          _this.setData({
            likeShow: false
          })
        }
        // 查看商品规格是否为空
        if (Api.isNotEmpty(obj.goodsSpecificationVOList)) {
          if (obj.goodsSpecificationVOList.length > 1) {
            // 两个规格属性
            skuArrTwo.push(obj.goodsSpecificationVOList[1])
            name = obj.goodsSpecificationVOList[1].specName
          }
        } else {
          obj.goodsSpecificationVOList = []
          _this.setData({
            isShowNewOne: true
          }, function() {
            _this.getTotalPriceNew(1)
          })
        }
        if (!Api.isNotEmpty(obj.goodsSkuVOList)) {
          obj.goodsSkuVOList = []
        }
        // 统计关注人数
        var favoriteNum = 0
        if (store.favoriteNum.obj) {
          favoriteNum = store.favoriteNum.obj
        }
        // 商品下架或者库存为0
        var stockNum = obj.stockNum
        var status = obj.status
        if (stockNum == 0 || status != 1) {
          _this.setData({
            stockNumHide: true
          })
        }
        wx.setStorageSync("storeId", obj.storeId)
        // 分享设置
        if (obj.privacy == 0) {
          _this.setData({
            imgTemp: _this.data.baseUrl + obj.mainImgUrl
          })
        } else {
          // 合成图片、隐私商品分享样式
          wx.getImageInfo({
            src: _this.data.baseUrl + obj.mainImgUrl,
            success: function(res) {
              ctx.drawImage(res.path, 0, 0, 350, 350)
              ctx.drawImage("/image/isshow.png", 135, 50, 80, 80)
              ctx.setFontSize(18)
              ctx.fillStyle = "#fff"
              ctx.fillText("该商品", 145, 140)
              ctx.fillText("加商友可见", 133, 160)
              ctx.globalAlpha = 0.7
              ctx.drawImage("/image/op.png", 0, 0, 350, 350)
              ctx.draw(true)
              setTimeout(function() {
                wx.canvasToTempFilePath({ //生成图片
                  x: 0,
                  y: 0,
                  width: 350,
                  height: 350,
                  destWidth: 300,
                  destHeight: 350,
                  quality: 1,
                  canvasId: 'myCanvas',
                  success: function(res) {
                    wx.uploadFile({
                      url: uploadImg,
                      filePath: res.tempFilePath,
                      name: 'file',
                      success: (res => {
                        _this.setData({
                          imgTemp: _this.data.baseUrl + JSON.parse(res.data).obj
                        })
                      }),
                    })
                  }
                })
              }, 800)
            }
          })
        }
        //绑定活动
        _this.selectComponent("#goodsActivityBinding").bindingForGoodsDetail(res);
        console.log(obj.goodsSkuVOList)
        _this.setData({
          imgUrls: obj.goodsImageVOList,
          wholesalePrice: obj.wholesalePrice,
          sell: obj.sellPrice,
          recommendDesc: obj.recommendDesc,
          goodsSpecificationVOList: obj.goodsSpecificationVOList,
          goodsSkuVOList: obj.goodsSkuVOList,
          skuArrTwo: skuArrTwo,
          stockNum: obj.stockNum,
          mainImgUrl: obj.mainImgUrl,
          name: obj.name,
          nameTwo: name,
          store: store,
          hasActiveGoods: obj.hasActiveGoods ? true : false, //标识这个商品是否有活动商品
          favoriteNum: favoriteNum,
          sdescription: store.description == null ? '' : store.description
        }, function() {
          // isTrue为true编辑进货车或者购物车 false是添加
          var lenNum = true
          // 有规格
          if (obj.goodsSpecificationVOList.length != 0) {
            var arr = obj.goodsSpecificationVOList[0].goodsSpecificationValueVOList
            var len = obj.goodsSpecificationVOList
            // 只有一个规格
            if (len.length == 1) {
              for (var i = arr.length - 1; i >= 0; i--) {
                _this.getSpecDetails(i, arr[i].specValueCode)
              }
              if (isTrue) {
                var newArrOne = obj.goodsSkuVOList
                if (newArrOne[0].specValueCodeList.length == 1) {
                  _this.setData({
                    newSkuOnly: true,
                    newSkuOnlyEdit: true
                  })
                } else {
                  _this.setData({
                    newSkuOnly: false,
                    newSkuOnlyEdit: true
                  })
                }
              } else {
                _this.setData({
                  newSkuOnly: true
                })
              }
            }
            // console.log(this.data.newCartList)
            // if (this.data.newCartList.length == 0) {
            //   _this.getSpecDetails(0, arr[0].specValueCode)
            // }
            // showCartOne为false 修改购物车
            // if (!this.data.showCartOne) {
            //   _this.getSpecDetails(0, arr[0].specValueCode)
            // }
            // 只有两个规格
            if (len.length == 2) {
              lenNum = false
              if (isTrue) {
                for (var i = arr.length - 1; i >= 0; i--) {
                  _this.getSpecDetails(i, arr[i].specValueCode)
                }
              } else {
                _this.getSpecDetails(0, arr[0].specValueCode)
              }
            }
          }
          let num = this.data.numbers
          this.setData({
            numbers: num
          })
          // editOneName编辑进货车购物车
          if (this.data.editOneName) {
            var newSkuArrTwo = this.data.newSkuArrTwo
            if (lenNum) {
              for (var i = 0; i < newSkuArrTwo.length; i++) {
                if (newSkuArrTwo[i].num >= 0) {
                  newSkuArrTwo[i].num = num
                }
              }
            }
            this.setData({
              newSkuArrTwo: newSkuArrTwo
            }, function() {
              this.getTotalPrice();
            })
          }
        })
      })
  },
  onShow: function() {},
  // 下载多张图片
  dowLoadImg: function() {
    var _this = this,
      imgUrls = this.data.imgUrls,
      arr = [],
      mainImgUrl = this.data.baseUrl + this.data.mainImgUrl
    for (var i = 0; i < imgUrls.length; i++) {
      arr.push(this.data.baseUrl + imgUrls[i].imageUrl + "?x-oss-process=style/store-cover")
      wx.getImageInfo({     //下载图片
        src: arr[i],
        //这里放你要下载图片的数组(多张) 或 字符串(一张)          下面代码不用改动
        success: function(ret) {
          var path = ret.path;
          wx.saveImageToPhotosAlbum({
            filePath: path,
            success(result) {
              if (i == arr.length) {
                wx.hideLoading();
                Api.showToast("图片下载成功")
              }
            },
            fail(result) {
              wx.openSetting({
                success: (res) => {}
              })
            }
          });
        }
      });
    }
  },
  likeStore: function() {
    var _this = this
    Api.likeStore()
      .then(res => {
        wx.showToast({
          title: '关注成功',
          icon: 'none',
          duration: 1000,
          mask: true,
        })
        app.globalData.isFollow = true
        _this.setData({
          likeShow: true,
          favoriteNum: this.data.favoriteNum + 1
        })
      })
  },
  // 取消关注
  disLike: function() {
    var _this = this
    Api.deteleLikeStore()
      .then(res => {
        wx.showToast({
          title: '取消关注成功',
          icon: 'none',
          duration: 1000,
          mask: true,
        })
        app.globalData.isFollow = false
        _this.setData({
          likeShow: false,
          disLike: false,
          favoriteNum: this.data.favoriteNum - 1
        })
      })
  },
  deteleLikeStore: function() {
    this.setData({
      disLike: true
    })

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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {
    var img = this.data.imgTemp,
      storeId = wx.getStorageSync('storeId'),
      id = this.data.goodsId,
      name = this.data.name
    var _this = this
    return {
      title: name,
      path: '/pages/page/goodsDetails/goodsDetails?goodsId=' + id + "&storeId=" + storeId,
      imageUrl: img,
      success: (res) => {},
      fail: (res) => {}
    }
  },
})