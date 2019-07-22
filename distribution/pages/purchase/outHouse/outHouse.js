// distribution/pages/purchase/outHouse/outHouse.js
import Api from '../../../../utils/api.js'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseUrl: app.globalData.imageUrl
  },
  sure(){
    let arr = []
    this.data.goodsList.forEach(el=>{
      el.adviceSkuList.forEach(sku=>{
        sku.warehouseList.forEach(house=>{
          house.regionList.forEach(region=>{
            region.flowList.forEach(flow=>{
              if (flow.adviceOutNum>0){
                arr.push({
                  code: flow.code,
                  outNum: flow.adviceOutNum
                })
              }
            })
          })
        })
      })
    })
    Api.preOutHouseList(arr).then(res=>{
      wx.navigateTo({
        url: '../outHouseLogistics/outHouseLogistics',
        success: (a) => {
          a.eventChannel.emit('sendSkuData', {
            list: res.obj
          })
        }
      })
    })
  },
  toSetSku(e) {
    let goodsIndex = e.currentTarget.dataset.goodsindex,
      skuIndex = e.currentTarget.dataset.skuindex
    wx.navigateTo({
      url: '../outHouseSkuSet/outHouseSkuSet',
      events: {
        getSkuData: (res) => {
          this.setData({
            ['goodsList[' + res.goodsIndex + '].adviceSkuList[' + res.skuIndex + ']']: res.sku
          })
        }
      },
      success: (a)=> {
        a.eventChannel.emit('sendSkuData', {
          skuIndex,
          goodsIndex,
          goods: this.data.goodsList[goodsIndex]
        })
      }
    })
  },
  getDetail() {
    Api.outHouse({
      orderNumber: this.data.orderNum
    }).then(res => {
      // // 重新组装数据

      this.setData({
        goodsList: res.obj.stockOutGoodsVos,
        totalNum: res.obj.totalNum
      }, () => {
        this.handleGoods()
      })
    })
  },
  handleGoods() {
    let goodsArr = this.data.goodsList
    goodsArr.forEach(goods => {
      // 商品
      // sku
      goods.adviceSkuList.forEach(sku => {
        // 计算每个sku 的数量
        let nowNum = 0
        // 仓库
        sku.warehouseList.forEach(house => {
          let houseSetNum = 0
          // 库区
          house.regionList.forEach(region => {
            let regionSetNum = 0
            // 流水
            region.flowList.forEach(flow => {
              if (!flow.adviceOutNum){
                flow.adviceOutNum = 0
              }
              nowNum += parseInt(flow.adviceOutNum)
              houseSetNum += parseInt(flow.adviceOutNum)
              regionSetNum += parseInt(flow.adviceOutNum)
            })
            region.setNum = regionSetNum
          })
          house.setNum = houseSetNum
        })
        sku.setNum = nowNum
      })
    })
    this.setData({
      goodsList: goodsArr
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      // orderNum: options.orderNum
      orderNum: 19072201001286
    }, () => {
      this.getDetail()
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

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
  onShareAppMessage: function() {

  }
})