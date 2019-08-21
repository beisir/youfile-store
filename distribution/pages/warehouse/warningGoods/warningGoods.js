// distribution/pages/warehouse/warningGoods/warningGoods.js
import Api from "../../../../utils/api.js"
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listType: 'low',
    serText: '',
    sureWare: { name: "全部仓库", code: '' },
    baseUrl: app.globalData.imageUrl
  },
  search(){
    this.getList(true)
  },
  watchInput(e){
    this.setData({
      serText: e.detail.value
    })
  },
  setLow(e){
    this.setData({
      listType: e.detail.value
    },()=>{
      this.getList(true)
    })
  },
  getList(re){
    if (re) {
      app.pageRequest.pageData.pageNum = 0
      this.setData({ 
        goodsList: [] 
      })
    }
    let obj = {
      keyword: this.data.serText
    }
    if (this.data.listType =='low'){
      obj.warningLessFlag = true
    }else {
      obj.warningMoreFlag = true
    }

    obj.warehouseCode = this.data.sureWare.code

    Api.warningGoodsList(obj).then(res=>{
      if(!res.obj.result){return}
      res.obj.result.forEach(el=>{
        this.data.listType == 'low' ? el.warningLow = true : el.warningLow =false
        el.goodsMainImgUrl = this.data.baseUrl + el.goodsMainImgUrl
      })
      this.setData({
        goodsList: this.data.goodsList.concat(res.obj.result)
      })
    })
  },
  getWarehouse() {
    Api.getWarehouseList().then(res => {
      let arr = [{ name: "全部仓库", code: '' }]
      this.setData({
        wareHouse: arr.concat(res.obj)
      })
    })
  },
  setHouse(e) {
    this.setData({
      sureWare: this.data.wareHouse[e.detail.value]
    }, () => {
      this.getList(true)
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getWarehouse()
    this.getList(true)
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