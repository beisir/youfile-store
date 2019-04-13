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
      var goodsVO = response.obj.goodsVO
      var activeVal = goodsVO.extInfo.SALES_PROMOTION[0]
     if(activeVal){
       var newData=[]
       var timestamp = (new Date()).valueOf();
       var beginDate = activeVal.beginDate
       var endDate = activeVal.endDate
       console.log(timestamp)
       console.log(beginDate)
       var timeSeconds=''
       if (beginDate-timestamp >0){
         console.log(3)
         //未开始
         timeSeconds = beginDate - timestamp
       }else{
         console.log(33)
         timeSeconds = endDate - beginDate
       }
       console.log(timeSeconds)
       newData.push({ d: parseInt(timeSeconds / 86400), h: parseInt(timeSeconds / 60 / 60 % 24), m: parseInt(timeSeconds / 60 % 60), s: parseInt(timeSeconds % 60)})
       console.log(newData)
      //  console.log(utils.timeStamp(timeSeconds)); 
          // setInterval(function () {
      //   var newDate = utils.formatTime(new Date(date))
      //   console.log(newDate)
      //   data.activity_1[0].beginDate = newDate
      //   date = date - 1000
      // }, 1000)

       var data = {
         "activity_1": [
           {
             "promotionMode": activeVal.promotionMode,
             "activityPrice": activeVal.activityPrice,
             "sellPrice": lit == 1 ? goodsVO.sellPrice : goodsVO.wholesalePrice,
             "beginDate": ''
           }
         ]
       }
     }
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
      var goodsSkuVOList = goodsVO.goodsSkuVOList
      var extInfoLen = (goodsVO.extInfo.SALES_PROMOTION).length
      // 判断是否有额外参数
      if(extInfoLen>0){
        var standardGoodsSkuPromotions = goodsVO.extInfo.SALES_PROMOTION[0].standardGoodsSkuPromotions
        goodsVO.hasActiveGoods = true
        if (goodsSkuVOList.length==0){
          goodsVO.saleBatch = goodsVO.extInfo.SALES_PROMOTION[0].salesNum
          goodsVO.activityPrice = goodsVO.extInfo.SALES_PROMOTION[0].activityPrice
        }else{
          for (var val of goodsSkuVOList) {
            val.standardGoodsSkuPromotions = []
            if (standardGoodsSkuPromotions) {
              for (var v of standardGoodsSkuPromotions) {
                if (val.skuCode == v.skuCode) {
                  val.standardGoodsSkuPromotions.push(v)
                  val.isActivity = true
                  val.saleBatch = v.salesNum
                  val.activityPrice = v.activityPrice
                }
              }
            }
          }
        }
       
      }else{
        goodsVO.hasActiveGoods = false
      }
      return goodsVO
    },
    //把活动绑定到spu上
    bindingTOSPU(goodsVO) {

    }
  }
})
