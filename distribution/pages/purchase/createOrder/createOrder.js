// distribution/pages/purchase/createOrder/createOrder.js
import Api from '../../../../utils/api.js'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseUrl: app.globalData.imageUrl,
    allPrice: 0,
    allNum: 0,
    serText:"",
    nickName:'',
    remark: ''
  },
  // 创建
  createOrder(){
    if (!this.data.supplierObj){
      Api.showToast("请选择供应商")
      return
    }
    if (!this.data.goodsList || this.data.goodsList.length==0) {
      Api.showToast("请选择商品")
      return
    }
    if (!this.data.payway) {
      Api.showToast("请选择支付方式")
      return
    }
    if (!this.data.orderDate) {
      Api.showToast("请选择采购时间")
      return
    }

    let obj = { 
      supplierNumber: this.data.supplierObj.supplierNumber,
      payWay: this.data.payway.payWayCode,
      operator: this.data.nickName,
      purchaseTime: this.data.orderDate,
      remark: this.data.remark
    }
    let goodsList = this.data.goodsList,
        sendGoodsList = []
    goodsList.forEach(el=>{
      el.skuPriceNumList.forEach(sku=>{
        sendGoodsList.push({
          totalNum: sku.num,
          purchasePrice: sku.price,
          skuCode: sku.skuCode ? sku.skuCode:0,
          goodsId: el.goods.id
        })
      })
      
    })
    obj.purchaseGoodsReqVOList = sendGoodsList
    Api.createPurchaseOrder(obj).then(res=>{
      Api.showToast(res.message,()=>{
        wx.navigateBack()
      })
    })
  },
  // 备注
  remarkInput(e){
    this.setData({
      remark: e.detail.value
    })
  },
  // 时间
  getTime(e){
    this.setData({
      orderDate: e.detail.value
    })
  },
  // 搜索
  ser(e){
    this.setData({
      serText: e.detail.value
    })
  },
  search(){
    this.tochoseGoods()
  },
  // 选择商品
  tochoseGoods(){
    if(this.data.supplierObj){
      wx.navigateTo({
        url: '../choseGoods/choseGoods?num=' + this.data.supplierObj.supplierNumber + '&name=' + this.data.supplierObj.name+"&serText="+ this.data.serText,
      })
    } else {
      Api.showToast("请先选择供应商")
    }
  },
  // 删除商品
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
        goodsList = [],
        allPrice = 0,
        allNum = 0
    for (let key in goodsObj){
      let skuList = goodsObj[key].skuPriceNumList.filter(el => el.num && el.num>0)
      let reSkuList = []
      allPrice += goodsObj[key].price
      allNum += goodsObj[key].num
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
      goodsList,
      allPrice: allPrice.toFixed(2),
      allNum
    })
  },
  getUserInfo(){
    Api.getUserInfo().then(res=>{
      this.setData({
        nickName: res.obj.nickName
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setStorageSync('purchaseGoods', {})
    this.getUserInfo()
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