const app = getApp();
import Api from '../../../utils/api.js'
import Calculation from '../../../utils/calculation.js'
var Method = new Calculation()
var timerList = []
import {
  uploadImg,
  navigateToAppID
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
    mallCode: '',
    storeId: wx.getStorageSync('storeId'),
    baseUrl: app.globalData.imageUrl,
    goodsSpecificationVOList: [],
    goodsSkuVOList: [],
    skuArrTwo: [],
    goodsInfo: {}, //商品信息
    disLike: false,
    stockNumHide: false,
    saleBatchNumGoods: 0,
    newSkuArrTwo: [],
    nameTwo: '',
    differNum: 0,
    differMoney: 0,
    newSkuOnly: false, //只有一个规格
    className: 'active',
    indicatorDots: true,
    autoplay: true,
    interval: 2000,
    duration: 500,
    bg: '#C79C77',
    Height: "",
    hidden: true,
    numbers: 0,
    likeShow: false,
    introduction: '',
    swichNavCode: '',
    swichNav: -1,
    changeButtonCode: '',
    sell: '',
    saleBatchNum: 0,
    saleBatchAmount: 0,
    totalPrice: '0.00',
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
  onLoad: function(options) {
    var that = this,
      arr = [],
      goodsId = ''
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
              getIdentity(this, goodsId, true)
              // if (options.name == "more") {
              //   getIdentity(this, goodsId, true)
              // } else {
              //   getIdentity(this, goodsId, false)
              // }
            })
          })
      } else {
        getIdentity(this, goodsId, false) //查看详情
      }
    } else {
      getIdentity(this, this.data.goodsId, false) //刷新登录
    }
    this.getMallCode()
  },
  // 获取mallcode
  getMallCode(){
    Api.simpleStoreMsg({ storeId: wx.getStorageSync('storeId') }).then(res => {
      this.setData({
        mallCode: res.obj.mallCode ? res.obj.mallCode : '1000'
      })
    })
  },
  // 获取商品详情
  getDetails: function (goodsId, isTrue) {
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
            success: function (res) {
              ctx.drawImage(res.path, 0, 0, 350, 350)
              ctx.drawImage("/image/isshow.png", 135, 50, 80, 80)
              ctx.setFontSize(18)
              ctx.fillStyle = "#fff"
              ctx.fillText("该商品", 145, 140)
              ctx.fillText("加商友可见", 133, 160)
              ctx.globalAlpha = 0.7
              ctx.drawImage("/image/op.png", 0, 0, 350, 350)
              ctx.draw(true)
              setTimeout(function () {
                wx.canvasToTempFilePath({ //生成图片
                  x: 0,
                  y: 0,
                  width: 350,
                  height: 350,
                  destWidth: 300,
                  destHeight: 350,
                  quality: 1,
                  canvasId: 'myCanvas',
                  success: function (res) {
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
        if (obj.extInfo.PURCHASE_HISTORY) {
          _this.setData({
            histtory: obj.extInfo.PURCHASE_HISTORY
          })
        }
        timerList.forEach(el => {
          clearInterval(el)
        })
        timerList = []
        var timeSeconds=''
        if (obj.extInfo.SALES_PROMOTION.length>0){
          var activeVal = obj.extInfo.SALES_PROMOTION[0]
          var timestamp = new Date().getTime();
          var beginDate = activeVal.beginDate
          var endDate = activeVal.endDate
          if (beginDate - timestamp > 0) {
            //未开始
            timeSeconds = beginDate - timestamp
            this.setData({
              activeMes:"距开始还有"
            })
          } else {
            //已经结束
            timeSeconds = endDate - timestamp
            this.setData({
              activeMes: "距结束还有"
            })
          }
          timeSeconds = timeSeconds/1000
          activeVal.timeSeconds = timeSeconds
          var newArr = []
          newArr.push(activeVal)
          for (var i = 0; i < newArr.length; i++) {
            this.timerhandle(newArr[i].timeSeconds, i, 'doing')
          }
        }
        console.log(obj)
        _this.setData({
          goodsInfo: obj,
          goodsSpecificationVOList: obj.goodsSpecificationVOList,
          goodsSkuVOList: obj.goodsSkuVOList,
          skuArrTwo: skuArrTwo, 
          nameTwo: name,
          store: store,
          favoriteNum: favoriteNum,
        }, function () {
          // isTrue为true编辑进货车或者购物车 false是添加
          // 有规格
          if (obj.goodsSpecificationVOList.length != 0) {
            var arr = obj.goodsSpecificationVOList[0].goodsSpecificationValueVOList
            var len = obj.goodsSpecificationVOList
            // 只有一个规格
            if (len.length == 1) {
              for (var i = arr.length - 1; i >= 0; i--) {
                _this.getSpecDetails(i, arr[i].specValueCode)
              }
               _this.setData({
                  newSkuOnly: true
                })
            }
            // 只有两个规格
            if (len.length == 2) {
              if (isTrue) {
                for (var i = arr.length - 1; i >= 0; i--) {
                  _this.getSpecDetails(i, arr[i].specValueCode)
                }
              } else {
                _this.getSpecDetails(0, arr[0].specValueCode)
              }
            }
          }
        })
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
  //确认入库
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
        //未开店状态
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
  //加好友
  addTip: function() {
    var Id = this.data.store.storeId,
      logo = this.data.store.logo,
      name = this.data.store.storeName
    wx.navigateTo({
      url: '../../businessFriend/information/information?status=0&send=&accept=' + Id + '&remark=&logo=' + logo + '&name=' + name,
    })
  },
  //给swiper一个适应的高度
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
  //改变展示的属性规格对应的  价格和库存
  goodsSku: function(code, index) {
    var _this = this,
      swichNavCode = this.data.swichNavCode,
      changeButtonCode = this.data.changeButtonCode,
      dataList = _this.data.goodsSkuVOList,
      goodsInfo = this.data.goodsInfo
    for (var i = 0; i < dataList.length; i++) {
      if (dataList[i].specValueCodeList.indexOf(code) != -1) {
        if (dataList[i].specValueCodeList.length == 2) {
          if (index == 0) {
            if (dataList[i].specValueCodeList.indexOf(swichNavCode) != -1) {
              goodsInfo.wholesale = dataList[i].wholesalePrice
              goodsInfo.stockNum = dataList[i].stockNum
              goodsInfo.saleStockNum = dataList[i].saleStockNum
              goodsInfo.sellPrice = dataList[i].sellPrice
              if (dataList[i].isActivity) {
                var num=this.data.numbers
                _this.selectedSkuNum(dataList[i], num)
                goodsInfo.saleBatch = dataList[i].num
                _this.setData({
                  goodsInfo: goodsInfo,
                  numbers: dataList[i].num,
                  hasActiveGoodsClick:true,
                })
              }else{
                _this.setData({
                  hasActiveGoodsClick: false,
                })
              }
              _this.setData({
                goodsInfo: goodsInfo
              })
              break
            }
          } else {
            if (dataList[i].specValueCodeList.indexOf(changeButtonCode) != -1) {
              goodsInfo.wholesale = dataList[i].wholesalePrice
              goodsInfo.stockNum = dataList[i].stockNum
              goodsInfo.saleStockNum = dataList[i].saleStockNum
              goodsInfo.sellPrice = dataList[i].sellPrice
              _this.setData({
                goodsInfo: goodsInfo
              })
              break
            }
          }
        } else {
          goodsInfo.wholesale = dataList[i].wholesalePrice
          goodsInfo.stockNum = dataList[i].stockNum
          goodsInfo.saleStockNum = dataList[i].saleStockNum
          goodsInfo.sellPrice = dataList[i].sellPrice
          _this.setData({
            goodsInfo: goodsInfo
          })
          break
        }
      }
    }
    // if (!this.data.showCartOne) {修改购物车
    //   this.getTotalPrice();
    // }
  },
  //选择规格属性 点击第一个规格 
  changeButton: function(e) {
    var changeButtonCode = e.target.dataset.code,
      current = e.target.dataset.current
    this.getNewData(current, changeButtonCode)
  },
  getNewData: function (current, changeButtonCode) {
    this.goodsSku(changeButtonCode, 0)
    var that = this;
    if (this.data.specsTab === current) {
      return false;
    } else {
      that.setData({
        specsTab: current,//高亮选择规格值标识
        changeButtonCode: changeButtonCode
      }, function () {
        that.selectedSku(false, 1)
      })
    }
  },
  // 点击第二个规格
  weghtSwi: function(e) {
    var swichNavCode = e.target.dataset.code,
      current = e.target.dataset.current
    this.getNewData1(current, swichNavCode)
  },
  getNewData1: function (current, swichNavCode) {
    this.goodsSku(swichNavCode, 1)
    var that = this;
    if (this.data.currentTab === current) {
      return false;
    } else {
      that.setData({
        currentTab: current,//高亮选择规格值标识
        swichNavCode: swichNavCode
      }, function () {
        that.selectedSku(false,1)
      })
    }
  },
  // 进货车点击切换规格
  swichNav: function(e) {
    var index = e.target.dataset.current,
      code = e.target.dataset.code
    if (this.data.newSkuOnly) {//只有一个规格
      this.newGetSpecDetails(index, code)
    } else {
      this.getSpecDetails(index, code)
    }
  },
  // 改变点击的规格code
  newGetSpecDetails: function (index, code) {
    var that = this,
      swichNavCode = index,
      code = code,
      skuArrTwo = this.data.skuArrTwo,
      skuArr = this.data.goodsSkuVOList,
      skuValueVOList = [],
      newSkuArrTwo = [],
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
  getSpecDetails: function (index, code) {
    var that = this,
      swichNavCode = index,
      code = code,
      skuArrTwo = this.data.skuArrTwo,
      skuArr = this.data.goodsSkuVOList,
      skuValueVOList = [],
      newSkuArrTwo = [],
      newList = {},
      returnStop = false,
      codeName = this.data.goodsSpecificationVOList,
      spectArrDifference = this.data.spectArrDifference,
      newCartList=this.data.newCartList,
      newCartListLen = newCartList.length
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
    // // 修改购物车
    if (this.data.limitShow == 1 && newCartList.length>1){
      this.setData({
        limitShow:4,
      })
    }
    if(newCartListLen> 0){
      this.setData({
        hidden: false
      })
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
  //关闭弹框
  closeAlert: function() {
    if (this.data.editCode) {
      //编辑购物车或者进货车
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
  //回到首页
  urlHome: function() {
    wx.switchTab({
      url: '../home/home'
    })
  },
  // 回到进货车或者购物车
  urlCart: function() {
    wx.switchTab({
      url: '../cartList/cartList'
    })
  },
  // 批量添加购物车、添加购物车
  moreAddCart: function(e) {
    if (!authHandler.isLogin()) {
      this.showLogo()
      return
    }
    var goodsId = this.data.goodsId,
      goodsSkuVOList = this.data.goodsSkuVOList,
      goodsSpecificationVOList = this.data.goodsSpecificationVOList,
      spectArrDifference = this.data.spectArrDifference,
      goodsSelectdLen = spectArrDifference.length,
      newArr = [],
      newSkuArrTwo = [],
      _this = this,
      attr = e.target.dataset.attr,
      status = e.target.dataset.status //判断是否是立即下单
    // 判断商品属性是否有异常
    if (goodsSpecificationVOList.length > 0) {
      if (goodsSkuVOList.length == 0) {
        Api.showToast("该属性异常，请联系客服！")
        return
      }
    }
    //small代表购物车或者属性规格没有
    if (attr =="more"){
       if (goodsSelectdLen > 0) {
      // 多个规格数据组装
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
      if (newArr.length == 0) {
        Api.showToast("请选择商品属性")
        return
      }
      var model = JSON.stringify(newArr);
      if (status == 1) {
        wx.navigateTo({
          url: '../address/address?model=' + model + '&enjoyCost=' + !this.data.discountShow + '&totalPrice=' + this.data.newTotal,
        })
      } else {
        if (this.data.editCode) {
          Api.updateMoreCart(model)
            .then(res => {
              Api.showToast("修改成功")
              wx.switchTab({
                url: '../cartList/cartList'
              })
            })
        } else {
          Api.addMoreCart(model)
            .then(res => {
              Api.showToast("添加成功")
              _this.setData({
                hidden: true
              })
            })
        }
      }
    } 
    }else{
      // 不是批量添加
      var num = this.data.numbers,
        skuCode = '', //没有规格的时候默认code为0
        changeButtonCode = this.data.changeButtonCode,
        swichNavCode = this.data.swichNavCode,
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
        if (skuCode == '') {
          Api.showToast("请选择商品属性!")
          return
        }
      } else {
        skuCode = 0
      }
      if (num < 1) {
        Api.showToast("请添加购买数量！")
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
              Api.showToast("修改成功")
              wx.switchTab({
                url: '../cartList/cartList'
              })
            })
        } else {
          //添加购物车或者没有规格的进火车
          // _this.selectedSku()
            Api.addCart({
              goodsId: goodsId,
              num: num,
              skuCode: skuCode
            })
              .then(res => {
                Api.showToast("添加成功")
                _this.setData({
                  hidden: true
                })
              })
        }
      } else {
        //预订单
        var model = {
          goodsId: goodsId,
          num: num,
          skuCode: skuCode
        }
        wx.navigateTo({
          url: '../address/address?model=' + JSON.stringify(model),
        })
      }
    }
  },
  //添加
  addCount: function (e) {
    var sign = e.currentTarget.dataset.sign //获取是增加还是减少 或者手动输入 input代表手动输入
    let num = this.data.numbers
    let goodsInfo = this.data.goodsInfo
    let goodsSkuVOList = this.data.goodsSkuVOList
      if (sign == "add") {
        if (goodsSkuVOList.length > 0) {
          this.selectedSku(false)
        } else {
          num = num + 1
          Method.selectedSkuNum(goodsInfo, num) //调用calculation。js 中selectedSkuNum方法 判断起购量库存
          this.setData({
            numbers: goodsInfo.num,
          })
        }
      } 
      if (sign =="reduce") {
        if (goodsSkuVOList.length > 0) {
          this.selectedSku(true)
        }else{
          num = num - 1
          Method.selectedSkuNum(goodsInfo, num, true)
          this.setData({
            numbers: goodsInfo.num,
          })
        }
    }
  },
  // 判断选中的SKU
  selectedSku: function(isTrue,index) {
    var skuStr = '',
      swichNavCode = this.data.swichNavCode,//第一个规格code
      changeButtonCode = this.data.changeButtonCode,//第二个规格code
      goodsSkuVOList = this.data.goodsSkuVOList,
      num=this.data.numbers
    var goodsInfo = this.data.goodsInfo
    for (var i = 0; i < goodsSkuVOList.length; i++) {
      var childArr = goodsSkuVOList[i].specValueCodeList
      if (childArr.length == 1) {
        if (childArr.indexOf(changeButtonCode) != -1) {
          if (goodsSkuVOList[i].isActivity) {
            goodsInfo.saleBatch = goodsSkuVOList[i].saleBatch
          }
          if (isTrue) {
            if (num > 0) {
              num--
            }
            this.selectedSkuNum(goodsSkuVOList[i], num, true)
          } else {
            if (index) {
              goodsSkuVOList[i].num = 0
            } else {
              num++
              this.selectedSkuNum(goodsSkuVOList[i], num)
            }
            goodsInfo.isActivity = goodsSkuVOList[i].isActivity
            this.setData({
              numbers: goodsSkuVOList[i].num,
              goodsInfo: goodsInfo
            })
          }
          goodsInfo.isActivity = goodsSkuVOList[i].isActivity
          this.setData({
            numbers: goodsSkuVOList[i].num,
            goodsInfo: goodsInfo
          })
          skuStr = goodsSkuVOList[i].skuName
        }
      } else {
        if (childArr.indexOf(swichNavCode) != -1 && childArr.indexOf(changeButtonCode) != -1) {
          if (goodsSkuVOList[i].isActivity) {
            goodsInfo.saleBatch=goodsSkuVOList[i].saleBatch
          }
          if (isTrue) {
            if (num>0){
              num--
            }
            this.selectedSkuNum(goodsSkuVOList[i], num, true)
          } else {
            if(index){
              goodsSkuVOList[i].num=0
            }else{
              num++
              this.selectedSkuNum(goodsSkuVOList[i], num)
            }
          }
          goodsInfo.isActivity = goodsSkuVOList[i].isActivity
          this.setData({
            numbers: goodsSkuVOList[i].num,
            goodsInfo: goodsInfo
          })
          skuStr = goodsSkuVOList[i].skuName
        }
      }
    }
    this.setData({
      skuStr: skuStr
    })
  },
  /**
   * 绑定减数量事件/绑定加数量事件
   */
  updateSkuNum: function(e) {
    var sign = e.currentTarget.dataset.sign //获取是增加还是减少 或者手动输入 input代表手动输入
    const index = e.currentTarget.dataset.index;
    if (sign == "input") {
      var nums = e.detail.value
      this.updateSkuVoList(sign, index, parseInt(nums))
    } else {
      this.updateSkuVoList(sign, index)
    }
  },
  // 调用商品数量增加或者减少方法
  updateSkuVoList: function(sign, index, nums) {
    var spectArrDifference = this.data.spectArrDifference,
      code = this.data.moreCode,
      newSkuOnly = this.data.newSkuOnly, //只有一个sku
      goodsSpecificationVOListNew = this.data.goodsSpecificationVOList,
      skuLengh = goodsSpecificationVOListNew.length
    // 判断是否有规格
    if (skuLengh > 0) {
      var goodsSpecificationVOList = goodsSpecificationVOListNew[0].goodsSpecificationValueVOList
      for (var i = 0; i < spectArrDifference.length; i++) {
        if (spectArrDifference[i].code == code) {
          if (sign == "add") {
            if (spectArrDifference[i].newSkuArrTwo[index].num == undefined) {
              spectArrDifference[i].newSkuArrTwo[index].num = 0
            }
            this.selectedSkuNum(spectArrDifference[i].newSkuArrTwo[index], spectArrDifference[i].newSkuArrTwo[index].num + 1)
          }
          if (sign == "reduce") {
            if (spectArrDifference[i].newSkuArrTwo[index].num <= 0) {
              return false;
            }
            this.selectedSkuNum(spectArrDifference[i].newSkuArrTwo[index], spectArrDifference[i].newSkuArrTwo[index].num - 1, true)
          }
          if (sign == "input") {
            this.selectedSkuNum(spectArrDifference[i].newSkuArrTwo[index], nums)
          }
        }
      }
      this.setData({
        spectArrDifference: spectArrDifference
      });
    } else {
      var goodsInfo = this.data.goodsInfo
      if (sign == "add") {
        this.selectedSkuNum(goodsInfo, this.data.numbers + 1)
      }
      if (sign == "reduce") {
        let num = this.data.numbers
        if (num == 0) {
          return
        }
        this.selectedSkuNum(goodsInfo, num - 1,true)
      }
      this.setData({
        numbers: goodsInfo.num
      })
    }
    this.getTotalPrice();
  },
  // 批量减少 或者批量增加
  batchChange: function(e) {
    var sign = e.currentTarget.dataset.sign //获取是增加还是减少 或者手动输入
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
      if (newSkuArrTwo[i].num == undefined || newSkuArrTwo[i].num == NaN) {
        newSkuArrTwo[i].num = 0
      }
      if (sign == "add") {
        this.selectedSkuNum(newSkuArrTwo[i], newSkuArrTwo[i].num + 1)
      }
      if (sign == "reduce") {
        if (newSkuArrTwo[i].num > 0) {
          this.selectedSkuNum(newSkuArrTwo[i], newSkuArrTwo[i].num - 1, true)
        }
      }
    }
    spectArrDifference[index].newSkuArrTwo = newSkuArrTwo
    this.setData({
      spectArrDifference: spectArrDifference
    }, function() {
      _this.getTotalPrice();
    });

  },
  // 添加商品数量，判断活动商品是否超出库存
  selectedSkuNum: function(obj, value, isTrue) {
    Method.selectedSkuNum(obj, value, isTrue) //调用calculation。js 中selectedSkuNum方法 判断起购量库存
  },
  /**
   * 计算总价
   */
  getTotalPrice() {
    let code = this.data.moreCode;
    let swichNav = this.data.swichNav;
    let spectArrDifference = this.data.spectArrDifference //SKU组合
    let saleBatchAmount = this.data.saleBatchAmount //店铺的起批金额
    let saleBatchNum = this.data.saleBatchNum //店铺的起批数量
    let saleBatchNumGoods = this.data.saleBatchNumGoods //商品的起批数量
    let goodsSpecificationVOList = this.data.goodsSpecificationVOList
    let goodsInfo = this.data.goodsInfo
    Method.getTotalPrice(goodsSpecificationVOList, spectArrDifference, code, swichNav, saleBatchAmount, saleBatchNum, saleBatchNumGoods, goodsInfo)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},
  // 下载多张图片
  dowLoadImg: function() {
    var _this = this,
      imgUrls = this.data.goodsInfo.imgUrls,
      arr = []
    for (var i = 0; i < imgUrls.length; i++) {
      arr.push(this.data.baseUrl + imgUrls[i].imageUrl + "?x-oss-process=style/store-cover")
      wx.getImageInfo({     //下载图片
        src: arr[i],
        //这里放要下载图片的数组(多张) 或 字符串(一张)    
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
        Api.showToast("关注成功")
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
        Api.showToast("取消关注成功")
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
    this.setData({
      limitShow: wx.getStorageSync("admin")
    })
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
      name = this.data.goodsInfo.name
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