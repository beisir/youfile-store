// assembly/goodsActivityBinding/goodsActivityBinding.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    /**
     * 位置 
     */
    position: {
      type: String,//类型
      value: ""//默认值
    },
    /**
     * 活动数据
     */
    activityShowInfo: {
      type: JSON,//类型
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
      var data = {
        "activity_1": [
          {
            "promotionMode": "special_offer",
            "activityPrice": 200,
            "sellPrice": 500,
            "beginDate": "2019-04-20 10:00:00"
          }
        ]
      }
      var goodsVO = response.obj.goodsVO
      var store = response.obj.store

      //处理展位1的数据集
      this.handleActivityPosition1(goodsVO);

      //绑定活动到sku上
      console.log(this.bindingTOSKU(goodsVO))

      //绑定活动到spu上
      this.bindingTOSPU(goodsVO);


      let pages = getCurrentPages()
      let curPage = pages[pages.length - 1]
      curPage.setData({
        activityData: data
      })

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
      console.log(goodsVO)
      var goodsSkuVOList = goodsVO.goodsSkuVOList
      var standardGoodsSkuPromotions = goodsVO.extInfo.SALES_PROMOTION[0].standardGoodsSkuPromotions
      for (var val of goodsSkuVOList) {
        val.standardGoodsSkuPromotions = []
        for (var v of standardGoodsSkuPromotions) {
          if (val.skuCode == v.skuCode) {
            val.standardGoodsSkuPromotions.push(v)
            val.isActivity = true
            val.saleBatch = 5
            val.activityPrice = v.activityPrice
            goodsVO.hasActiveGoods=true
          }
        }
      }
      return goodsSkuVOList
    },
    //把活动绑定到spu上
    bindingTOSPU(goodsVO) {

    }
  }
})
