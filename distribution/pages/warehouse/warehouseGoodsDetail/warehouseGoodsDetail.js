// distribution/pages/warehouse/warehouseDetail/warehouseDetail.js
import Api from '../../../../utils/api.js'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    formData: {
      warningFlag: false,
      filterOutZeroFlag: false
    },
    baseUrl: app.globalData.imageUrl,
    serText: '',
    classList: [{
      name: '男装'
    }, {
      name: '女装'
    }, {
      name: '女装'
    }, {
      name: '女装'
    }, {
      name: '女装'
    }, {
      name: '女装'
    }],
    warehouseList: [{
      name:'123',
    }]
  },
  toGoodsDetail(e){
    wx.navigateTo({
      url: '../goodsDetail/goodsDetail?id='+e.currentTarget.dataset.id,
    })
  },
  search() {
    this.closeFilter()
    this.getList(true)
  },
  watchInput(e){
    this.setData({
      serText: e.detail.value
    })
  },
  // 获取详情
  getList(re) {
    if(re){
      app.pageRequest.pageData.pageNum = 0;
      this.setData({
        goods: []
      })
    }

    let obj = {
      keyword: this.data.serText
    }
    Object.assign(obj, this.data.formData)

    let type = this.data.classList.filter(el => el.selected)
    if(type[0]){
      obj.customCategoryCode = type[0].customCategoryCode
    }
    Api.wareHouseGoodsList(obj).then(res => {
      if (!res.obj.result){return}
      this.setData({
        goods: this.data.goods.concat(res.obj.result)
      })
    })
  },
  showFilter() {
    this.side.show()
  },
  closeFilter() {
    this.side.hide()
  },
  selectClass(e) {
    let thisindex = e.currentTarget.dataset.index,
        arr = this.data.classList
    arr.forEach((el,index)=>{
      if (thisindex == index){
        el.selected = !el.selected
      }else{
        el.selected = false
      }
    })    
    this.setData({
      classList: arr
    })
  },
  switchChange(e) {
    let type = e.currentTarget.dataset.type,
      obj = {}
    switch (type) {
      case "warning":
        obj = {
          ["formData.warningFlag"]: e.detail.value
        }
        break;
      case "zero":
        obj = {
          ["formData.filterOutZeroFlag"]: e.detail.value
        }
        break;
    }
    this.setData(obj)
  },
  sureForm() {
    let arr = this.data.classList.filter(el => el.selected)
  },
  resetForm() {
    let arr = this.data.classList
    arr.forEach(el => {
      el.selected = false
    })
    this.setData({
      formData: {
        warningFlag: false,
        filterOutZeroFlag: false
      },
      classList: arr
    })
  },
  getZoneList() {
    Api.classList().then(res => {
      this.setData({
        classList: res.obj
      })
    })
  },
  getData() {
    Api.wareHouseAllgoods().then(res => {
      this.setData({
        msg: res.obj
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getList(true)
    this.getZoneList()
    this.getData()
    this.side = this.selectComponent('#side')
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