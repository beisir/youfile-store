// distribution/pages/warehouse/warehouseParts/warehouseParts.js
import Api from "../../../../utils/api.js"
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showMsg: false,
    partList:[]
  },
  showmsg(e){
    this.setData({ showMsg: e.currentTarget.dataset.type})
  },
  getDetail(){
    Api.getWarehouseMsg({ code: this.data.code}).then(res=>{
      let obj = res.obj
      console.log(obj)
      for (let key in obj){
        if(!res.obj[key]){
          obj[key] = ''
        }
      }
      this.setData({
        warehouse: obj
      })
    })
  },
  getPartList(re){
    if(re){
      app.pageRequest.pageData.pageNum = 0
      this.setData({
        partList: []
      })
    }
    Api.getHousePartList({
      warehouseCode: this.data.code
    },'page').then(res=>{
      this.setData({
        partList: this.data.partList.concat(res.obj.result)
      })
    })
  },
  toCreate(){
    wx.navigateTo({
      url: '../createPart/createPart?code=' + this.data.code + '&name=' + this.data.warehouse.name,
    })
  },
  editHouse(){
    wx.navigateTo({
      url: '../createWarehouse/createWarehouse?code=' + this.data.code + '&type=edit',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      code: options.code
    })
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
    this.getDetail()
    this.getPartList(true)
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
    getPartList()
  }
})