// distribution/pages/warehouse/partGoodsList/partGoodsList.js
import Api from '../../../../utils/api.js'
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    serText: '',
    baseUrl: app.globalData.imageUrl
  },
  search(){
    this.getGoodsList(true)
  },
  delGoods(e){
    Api.delRegionGoods({ regionCode: this.data.code, goodsId: e.currentTarget.dataset.id}).then(res=>{
      Api.showToast(res.message,()=>{
        this.getGoodsList(true)
      })

      this.setData({
        delModal: true
      })
    })
    
  }, 
  closeModal(){
    this.setData({
      delModal: false
    })
  },
  //手指触摸动作开始 记录起点X坐标
  touchstart: function (e) {
    //开始触摸时 重置所有删除
    let data = app.touch._touchstart(e, this.data.goodsList)
    this.setData({
      goodsList: data
    })
  },

  //滑动事件处理
  touchmove: function (e) {
    let data = app.touch._touchmove(e, this.data.goodsList)
    this.setData({
      goodsList: data
    })
  },
  getGoodsList(re){
    if (re) {
      app.pageRequest.pageData.pageNum = 0
      this.setData({
        goodsList: []
      })
    }
    Api.regionGoodsList({ regionCode: this.data.code,keyword: this.data.serText}).then(res=>{
      if (res.obj.result)
        res.obj.result.forEach(el => el.baseUrl = this.data.baseUrl)
      this.setData({
        goodsList: this.data.goodsList.concat(res.obj.result)
      })
    })
  },
  watchinput(e){
    this.setData({
      serText: e.detail.value
    })
  },
  toDetail(e){
    wx.navigateTo({
      url: '../goodsDetail/goodsDetail?id='+e.currentTarget.dataset.id,
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
    this.getGoodsList(true)
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
    this.getGoodsList()
  }
})