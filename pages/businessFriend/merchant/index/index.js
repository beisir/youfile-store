import Api from '../../../../utils/api.js'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    waitPass: 0,
    waitVerify: 0,
    purchaserNumber: 0,
    buyPurchasers:0,
    buyUsers:0,
    followUsers:0,
    // 新增
    baseUrl: app.globalData.imageUrl,
    tabType: 'distribution',
    distributor: [],
    supplierNum: 0,
    supListType: 'sup',
    supList: []
  },
  choseTab(e){
    this.setData({
      tabType: e.currentTarget.dataset.type
    },()=>{
      this.getList(true)
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  getInfo: function () {
    var _this = this
    Api.merchantIndex()
      .then(res => {
        var obj = res.obj
        _this.setData({
          waitPass: obj.waitPass,
          waitVerify: obj.waitVerify,
          purchaserNumber: obj.purchaserNumber,
          buyPurchasers: obj.buyPurchasers,
          buyUsers: obj.buyUsers,
          followUsers: obj.followUsers
        })
      })
  },
  goHome: function () {
    wx.switchTab({
      url: '../../../page/home/home'
    })
  },
  getList(re){
    if (re) {
      app.pageRequest.pageData.pageNum = 0
    }
    if (this.data.tabType === 'distribution') {
      this.getDistributorList(re)
    } else {
      this.getSupList(re)
    }
  },
  // 获取进货商
  getDistributorList(re){
    let arr = this.data.distributor
    if(re){arr = []}
    Api.merchantList().then(res=>{
      if (res.obj.result){
        this.setData({
          distributor: arr.concat(res.obj.result),
        })
      }
    })
  },
  // 获取供应商
  getSupList(re){
    let arr = this.data.supList
    if (re) { arr = [] }
    if(this.data.supListType == 'sup'){
      Api.getSupplierList().then(res => {
        this.setData({
          supList: arr.concat(res.obj.result),
          supplierNum: res.obj.totalCount
        })
      })
    } else {
      // 云供应商
    }
  },
  choseSupType(e){
    this.setData({
      choseSupType: e.currentTarget.dataset.type
    })
  },
  onLoad: function (options) {

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
    this.getInfo()
    this.getList(true)
  },
  addWholesaler: function () {
    wx.navigateTo({
      url: '../addMerchant/addMerchant',
    })
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
  onReachBottom: function () {
    this.getList()
    
  }
})