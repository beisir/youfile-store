// 把活动绑定sku上
function bindingTOSKU(goodsVO, entry) {
  switch(entry){
    case 'preorder':
      var goodsSkuVOList = goodsVO.preOrderGoodsSkuList
      var acInfo = goodsVO.promotions ? goodsVO.promotions.SALES_PROMOTION:[]
    break;
    default:
    break;
  }
  // 判断是否有额外参数
  if (acInfo && acInfo.length > 0) {
    goodsVO.hasActiveGoods = true
    var standardGoodsSkuPromotions = acInfo[0].standardGoodsSkuPromotions
    if (standardGoodsSkuPromotions){
      for (var val of goodsSkuVOList) {
        val.standardGoodsSkuPromotions = []
        for (var v of standardGoodsSkuPromotions) {
          if (val.skuCode == v.skuCode) {
            val.standardGoodsSkuPromotions.push(v)
            val.isActivity = true
            val.saleBatch = 5
            val.activityPrice = v.activityPrice
            goodsVO.hasActiveGoods = true
          }
        }
      }
    } else {
      goodsVO.noSkuActiveGoods = true
      goodsVO.activityPrice = acInfo[0].activityPrice
    }
  } else {
    goodsVO.hasActiveGoods = false
  }
  return goodsVO
}

function goodsListBindingSku(goodsList, entry){
  goodsList.forEach(el=>{
    el = bindingTOSKU(el, entry)
  })
  return goodsList
}

module.exports = {
  goodsListBindingSku,
  bindingTOSKU
}