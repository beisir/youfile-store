// distribution/pages/purchase/inHouse/inHouse.js
import Api from "../../../../utils/api.js"
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseUrl: app.globalData.imageUrl,
    allnum: 0,
    warehouse: []
  },
  // 入库
  sureIn(){
    if (!this.data.house){
      Api.showToast("请选择仓库库区")
      return
    }
    if (!this.data.inDate){
      Api.showToast("请选择入库时间")
      return
    }
    if (!this.data.allnum || this.data.allnum === 0 ){
      Api.showToast("请选择入库商品")
      return
    }
    let obj = {
      purchaseOrderNo: this.data.order.no,
      regionCode: this.data.house.regionCode,
      warehouseCode: this.data.house.warehouseCode,
      stockTime: this.data.inDate
    }
    
    let goodsArr = this.data.goodsList,
        arrSend = []
    goodsArr.forEach(el=>{
      el.purchaseOrderDetailVOList.forEach(sku=>{
        if(sku.num && sku.num>0){
          arrSend.push({
            "id": sku.id,
            "inputNum": sku.num
          })
        }
      })
    })
    obj.purchaseStockDetailVOS = arrSend
    Api.purchaseStockIn(obj).then(res=>{
      Api.showToast(res.message,()=>{
        wx.navigateBack()
      })
    })
  }, 
  getDate(e) {
    this.setData({
      inDate: e.detail.value
    })
  },
  getDetail() {
    Api.getPurchaseMsg({
      no: this.data.no
    }).then(res => {
      this.setData({
        order: res.obj
      })
      let goodsArr = res.obj.purchaseGoodsVOS
      let waitArr = goodsArr.filter(el => el.remainNum > 0)
      waitArr.forEach(el => {
        el.purchaseOrderDetailVOList = el.purchaseOrderDetailVOList.filter(sku =>{
          sku.num = 0
          return sku.remainNum > 0
        })
      })
      this.setData({
        goodsList: waitArr
      })
    })
  },
  // 设数量
  watchInput(e) {
    let dataset = e.currentTarget.dataset,
      goodsindex = dataset.index,
      skuindex = dataset.skuindex
    this.setData({
      ['goodsList[' + goodsindex + '].purchaseOrderDetailVOList[' + skuindex + '].num']: e.detail.value
    })
  },
  diffNum(e) {
    let dataset = e.currentTarget.dataset,
      goodsindex = dataset.index,
      skuindex = dataset.skuindex,
      arr = this.data.goodsList,
      sku = arr[goodsindex].purchaseOrderDetailVOList[skuindex],
      valueNum = e.detail.value,
      num = 0

    console.log(valueNum > sku.remainNum)
    if (valueNum > sku.remainNum) {
      num = sku.remainNum
    } else if (valueNum === '') {
      num = 0
    } else {
      num = valueNum
    }
    this.setData({
      ['goodsList[' + goodsindex + '].purchaseOrderDetailVOList[' + skuindex + '].num']: num
    },()=>{
      this.getAllnum()
    })
  },
  getAllnum(){
    let allnum = 0
    this.data.goodsList.forEach(el=>{
      el.purchaseOrderDetailVOList.forEach(sku=>{
        if(sku.num){
          try{
            allnum += parseInt(sku.num)
          }catch(e){}
        }
      })
    })
    this.setData({ allnum})
  },
  changeNumBtn(e){
    let dataset = e.currentTarget.dataset,
      goodsindex = dataset.index,
      skuindex = dataset.skuindex,
      arr = this.data.goodsList,
      sku = arr[goodsindex].purchaseOrderDetailVOList[skuindex],
      num = sku.num

    if (dataset.type === 'add') {
      num ++
    } else {
      num --
    }

    this.setData({
      ['goodsList[' + goodsindex + '].purchaseOrderDetailVOList[' + skuindex + '].num']: num
    },()=>{
      this.getAllnum()
    })  
  },
  getWarehouse(){
    Api.getWarehouseList().then(res=>{
      this.setData({
        wareData: res.obj,
        warehouse: [res.obj, res.obj[0].regionList]
      })
    })
  },
  setHouse(e){
    let ware = this.data.warehouse[0],
        region = this.data.warehouse[1]

    if (e.detail.value[1] == null){
      e.detail.value[1] = 0
    }    
    this.setData({
      house:{
        name: ware[e.detail.value[0]].name + " " + region[e.detail.value[1]].name,
        warehouseCode: ware[e.detail.value[0]].code,
        regionCode: region[e.detail.value[1]].code
      }
    })
  },
  houseChange(e){
    if(e.detail.column == 0){
      this.setData({
        ['warehouse[1]']: this.data.wareData[e.detail.value].regionList ? this.data.wareData[e.detail.value].regionList:[]
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      no: options.no
      // no: 190718800000
    }, () => {
      this.getDetail()
      this.getWarehouse()
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