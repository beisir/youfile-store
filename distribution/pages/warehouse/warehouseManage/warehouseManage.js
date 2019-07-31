// distribution/pages/warehouse/warehouseManage/warehouseManage.js
import Api from '../../../../utils/api.js'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    houseList: [],
    serchText:'',
    // 开启仓库弹窗
    newFunLayer: false
  },
  // 关闭新功能弹窗
  closeModal(e) {
    this.setData({ newFunLayer: false })
    if (e.currentTarget.dataset.type === 'know') {

    }
  },
  getList(re) {
    if(re){
      app.pageRequest.pageData.pageNum = 0
      this.setData({ houseList:[]})
    }
    Api.getWarehouseList({ keyword: this.data.serchText},'page').then(res=> {
      this.setData({
        houseList: this.data.houseList.concat(res.obj.result)
      })
    })
  },
  // 搜索
  search(){
    this.getList(true)
  },
  serchinput(e){
    this.setData({
      serchText: e.detail.value
    })
  },
  clearSerch(){
    this.setData({
      serchText: ''
    })
  },
  getSetting() {
    Api.getWarningSetting().then(res => {
      let data = res.obj
      this.setData({
        newFunLayer: data.warehouseStatus === 'off' ? true : false,
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getSetting()
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
    this.getList(true)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getList()
  }
})