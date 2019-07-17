// distribution/pages/purchase/createOrder/createOrder.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseUrl: app.globalData.imageUrl,
  },
  delGoods(e){
    this.setData({
      delmodal:true,
      delIndex: e.currentTarget.dataset.index
    })
  },
  sureDel() {
    let arr = this.data.goodsList,
        goodsId = arr[this.data.delIndex].goods.id
    arr.splice(this.data.delIndex,1)
    this.setData({
      goodsList: arr
    })
    let allgoodsObj = wx.getStorageSync('purchaseGoods')
    delete allgoodsObj[goodsId]
    wx.setStorage({ key: 'purchaseGoods', data:allgoodsObj})
    this.closeModal()
  },
  closeModal(){
    this.setData({
      delmodal: false
    })
  },
  getGoodsList(){
    let goodsObj = wx.getStorageSync('purchaseGoods'),
        goodsList = []
    for (let key in goodsObj){
      let skuList = goodsObj[key].skuPriceNumList.filter(el => el.num && el.num>0)
      let reSkuList = []
      switch (goodsObj[key].skuNum){
        case 'two':
          skuList.forEach(el=>{
            let secArr = el.secondSku.filter(el=>el.num>0)
            secArr.forEach(sec=>{
              reSkuList.push({
                specValueName: el.specValueName+'|'+ sec.specValueName ,
                num: sec.num,
                price: sec.price,
                skuCode: sec.skuCode
              })
            })
          })
        break
        case 'one':
        default:
          // 无sku 或 一个
          skuList.forEach(el => {
            let secArr = el.secondSku.filter(el => el.num > 0)
            secArr.forEach(sec => {
              reSkuList.push({
                specValueName: el.specValueName,
                num: sec.num,
                price: sec.price,
                skuCode: sec.skuCode ? sec.skuCode:''
              })
            })
          })
        break
      }
      goodsObj[key].skuPriceNumList = reSkuList
      goodsList.push(goodsObj[key])
    }
    this.setData({
      goodsList
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // wx.setStorageSync('purchaseGoods', {})
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getGoodsList()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})