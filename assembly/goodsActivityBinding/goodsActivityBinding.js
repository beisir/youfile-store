// assembly/goodsActivityBinding/goodsActivityBinding.js
import utils from '../../utils/util.js';
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    /**
     * 位置 
     */
    position: {
      type: String, //类型
      value: "" //默认值
    },
    /**
     * 活动数据
     */
    activityShowInfo: {
      type: JSON, //类型
      value: [] //默认值
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    bindingForGoodsDetail(response) {
      var goodsVO = response.obj.goodsVO
      var activeVal = goodsVO.extInfo.SALES_PROMOTION[0]

      var lit = wx.getStorageSync("admin")

      var store = response.obj.store

      //处理展位1的数据集
      this.handleActivityPosition1(goodsVO);

      //绑定活动到sku上
      this.bindingTOSKU(goodsVO)

      //绑定活动到spu上
      this.bindingTOSPU(goodsVO);


      let pages = getCurrentPages()
      let curPage = pages[pages.length - 1]
      // curPage.setData({
      //   activityData: data
      // })
    },
    //处理展位1
    handleActivityPosition1(goodsVO) {
      if (!(goodsVO.extInfo && goodsVO.extInfo.SALES_PROMOTION)) {
        return;
      }
      var promotion = goodsVO.extInfo.SALES_PROMOTION;
    },

    //把活动绑定sku上
    bindingTOSKU(goodsVO) {
      var goodsSkuVOList = goodsVO.goodsSkuVOList
      var extInfoLen = (goodsVO.extInfo.SALES_PROMOTION).length
      // 判断是否有额外参数
      if (extInfoLen > 0) {
        var standardGoodsSkuPromotions = goodsVO.extInfo.SALES_PROMOTION[0].standardGoodsSkuPromotions
        goodsVO.isActivity = true
        goodsVO.saleBatch = goodsVO.extInfo.SALES_PROMOTION[0].batchNum
        goodsVO.saleStockNum = goodsVO.extInfo.SALES_PROMOTION[0].stockNum
        goodsVO.activityPrice = goodsVO.extInfo.SALES_PROMOTION[0].activityPrice
        if (goodsSkuVOList.length > 0) {
          for (var val of goodsSkuVOList) {
            val.standardGoodsSkuPromotions = []
            if (standardGoodsSkuPromotions) {
              for (var v of standardGoodsSkuPromotions) {
                if (val.skuCode == v.skuCode) {
                  val.standardGoodsSkuPromotions.push(v)
                  val.isActivity = true
                  val.saleBatch = v.batchNum
                  val.saleStockNum = v.stockNum
                  val.activityPrice = v.activityPrice
                }
              }
            }
          }
        }
      } else {
        goodsVO.isActivity = false
      }
      return goodsVO
    },
    //把活动绑定到spu上
    bindingTOSPU(goodsVO) {

    }
  }
})