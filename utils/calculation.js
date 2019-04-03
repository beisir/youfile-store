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
}
export default Calculation