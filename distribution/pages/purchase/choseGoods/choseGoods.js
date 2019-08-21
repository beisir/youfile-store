// distribution/pages/purchase/choseGoods/choseGoods.js
import Api from "../../../../utils/api.js"
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabType: 'supplier',
    serText: '',
    baseUrl: app.globalData.imageUrl 
  },
  ser(e){
    this.setData({
      serText: e.detail.value
    })
  },
  search(){
    this.getList(true)
  },
  tabclick(e){
    this.setData({
      tabType: e.currentTarget.dataset.type
    },()=>{
      this.getList(true)
    })
  },
  getList(re){
    let arr = this.data.goodsList
    if (re) {
      app.pageRequest.pageData.pageNum = 0
      arr = []
    }
    if (this.data.tabType === 'supplier'){
      Api.getSupplierGoodsList({
        supplierNumber: this.data.supplierNumber,
        keywords: this.data.serText
      }).then(res => {
        this.setData({
          goodsList: this.resetList(arr.concat(res.obj.result))
        })
      })
    }else{
      Api.getAllGoods({ keyword: this.data.serText}).then(res=>{
        this.setData({
          goodsList: this.resetList(arr.concat(res.obj.result))
        })
      })
    }
  },
  resetList(arr) {
    let goodsObj = wx.getStorageSync('purchaseGoods'),
      goodsList = []
    arr.forEach(el=>{
      if (goodsObj[el.id]){
        el.chosenum = goodsObj[el.id].num
      }
    })
    return arr
  },
  getAllCount(){
    let goodsObj = wx.getStorageSync('purchaseGoods'),
      allnum = 0,
      allPrice = 0
    for(let key in goodsObj) {
      allnum += goodsObj[key].num
      allPrice += goodsObj[key].price
    }
    this.setData({
      allnum,
      allPrice
    })
  },
  tosetGoods(e){
    wx.navigateTo({
      url: '../choseGoodsDetail/choseGoodsDetail?goodsId='+e.currentTarget.dataset.id,
    })
  },
  sure(){
    wx.navigateBack()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      supplierNumber: options.num,
      serText: options.serText ? options.serText:''
    })
    if(options.name){
      wx.setNavigationBarTitle({
        title: options.name,
      })
    }
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
    this.getList(true)
    this.getAllCount()
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
    this.getList()
  }
})