import Api from './api.js'
class Calculation {
  // 添加商品数量，判断活动商品是否超出库存
  selectedSkuNum(obj, value, isTrue) {
    // isTrue为true代表减
    var isActivity = obj.isActivity //判断是否是活动商品
    var stockNum = obj.stockNum
    var saleBatch = obj.saleBatch
    // 判断修改的数量是否超出库存
    if (value >= stockNum) {
      if (isActivity) {
        if (saleBatch > stockNum) {
          obj.num = 0
          // Api.showToast("库存小于起购量！")
        } else {
          if (value >= stockNum) {
            obj.num = stockNum
          } else {
            obj.num = value
          }
        }
      } else {
        obj.num = stockNum
      }
    } else {
      // 判断是否有活动SKU
      if (isActivity) {
        // 判断数量不能小于起购量
        if (saleBatch > stockNum) {
          // 如果起购量大于库存 数量为0 不能购买
          obj.num = 0
        } else {
          if (value >= saleBatch) {
            obj.num = value
          } else {
            if (isTrue) {
              obj.num = 0
            } else {
              obj.num = saleBatch
            }
          }
        }
      } else {
        obj.num = value
      }
    }
    return obj
  }
  /**
  * 计算总价
  */
  getTotalPrice(goodsSpecificationVOList, spectArrDifference, code, showCartOne, swichNav, saleBatchAmount, saleBatchNum, saleBatchNumGoods) {
    var childArr = [],
      colorNum = 0,
      differNum = 0,
      differMoney = 0,
      newSkuArrTwo = [],
      skuStr = '', //页面显示选择的规格
      total = 0, //总价
      activeGoodsTotal = 0, //活动商品总价
      newTotal = 0,
      discount = 0,
      nomalGoodsNums = 0, //除了活动的数量
      nums = 0, //一共的数量
      classNums = 0,
      difference = 0, //差价
      discountShow = true, //是否享受批发价
      limitShow = wx.getStorageSync('admin') //判断是否是进货商身份  3代表是
    let goodsSkuLen = goodsSpecificationVOList.length
    // 判断商品是否存在起批量
    if (saleBatchNumGoods == 0) {
      saleBatchNumGoods = saleBatchNum
    }
    //判断是是否有规格
    if (goodsSkuLen > 0) {
      if (goodsSpecificationVOList.length > 0) {
        var childArr = goodsSpecificationVOList[0].goodsSpecificationValueVOList //获取商品的第一个规格属性
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
          if (newSkuArrTwo[i].num > 0) {
            skuStr += newSkuArrTwo[i].skuName + ","
            classNums += 1 //种类
            // 当前SKU是否是活动商品isActivity
            var isActivity = newSkuArrTwo[i].isActivity ? true : false
            if (!isActivity) {
              nums += newSkuArrTwo[i].num //数量
            }
            nomalGoodsNums += newSkuArrTwo[i].num
            if (showCartOne) { //true添加 为false 是修改购物车
              if (isActivity) {
                activeGoodsTotal += newSkuArrTwo[i].num * newSkuArrTwo[i].activityPrice;
              } else {
                total += newSkuArrTwo[i].num * newSkuArrTwo[i].sellPrice;
              }
            } else {
              if (!isActivity) {
                total += newSkuArrTwo[i].num * goodsInfo.sell;
              }
            }
            if (!isActivity) {
              newTotal += newSkuArrTwo[i].num * newSkuArrTwo[i].wholesalePrice; //总的批发价

            }
          }
        }
      }
      goodsSpecificationVOList[0].goodsSpecificationValueVOList = childArr
    } else {
      var goodsInfo = goodsInfo
      var hasActiveGoods = goodsInfo.hasActiveGoods
      if (hasActiveGoods) {
        activeGoodsTotal = goodsInfo.num * goodsInfo.activityPrice
      } else {
        total = goodsInfo.num * goodsInfo.sellPrice
        newTotal = goodsInfo.num * goodsInfo.wholesalePrice
      }
      nomalGoodsNums = this.data.numbers
      classNums = 1
    }
    // 进货商身份
    if (limitShow == 3) {
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
    skuStr = (skuStr.substring(skuStr.length - 1) == ',') ? skuStr.substring(0, skuStr.length - 1) : skuStr
    let pages = getCurrentPages()
    let curPage = pages[pages.length - 1]
    curPage.setData({
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
  }
}
export default Calculation