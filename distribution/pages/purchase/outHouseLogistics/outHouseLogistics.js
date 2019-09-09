// distribution/pages/purchase/outHouseLogistics/outHouseLogistics.js
import Api from '../../../../utils/api.js'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseUrl: app.globalData.imageUrl,
    claimGoodsNum: ''
  },
  closeModal(){
    this.setData({
      supplierShow: false
    })
  },
  showSupplier(e){
    let goodsIndex = e.currentTarget.dataset.goodsindex,
        houseIndex = e.currentTarget.dataset.index,
        skuList = this.data.list[houseIndex].outGoodsList[goodsIndex].skuList
    
    this.setData({
      supplierShow: true,
      supSku: skuList
    })
  },
  stopScroll() { return },
  sure(){
    let obj = {}
    if (this.data.orderType === 'ziti'){
      // 自提
      if (this.data.claimGoodsNum.trim() === ''){
        Api.showToast("请填写取货码")
        return
      }
      obj.claimGoodsNum = this.data.claimGoodsNum
    } else {
      // 物流
      let arr = this.data.list,
          warning = false
      arr.forEach(el=>{
        if (!el.expressNumber || !el.expressCompany){
          warning = '请填写物流公司运单号'
        }
      })
      if (warning){
        Api.showToast(warning)
        return
      }
    }
    obj.inFlowForOutList = this.data.flowList
    obj.outDetailsList = this.data.list
    obj.orderNumber = this.data.orderNum
    Api.sureOutHouse(obj).then(res=>{
      let msg = res.message
      if (this.data.orderType === 'ziti'){
        msg = '验证成功'
      }
      Api.showToast(msg,()=>{
        wx.navigateBack({ delta: 2 })
      })
    })
  },
  showHide(e){
    this.setData({
      ['list[' + e.currentTarget.dataset.index + '].hide']: !this.data.list[e.currentTarget.dataset.index ].hide
    })
  },
  watchinput(e){
    let type = e.currentTarget.dataset.type,
        thisIndex = e.currentTarget.dataset.index
    if (type === 'claimGoodsNum'){
      this.setData({
        [type]: e.detail.value
      })
    }else{
      this.setData({
        ['list[' + thisIndex + '].' + type + '']: e.detail.value
      })    
    }
  },  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('sendSkuData', (data)=> {
      // 初始化隐藏
      data.list.outDetailsList.forEach(el=>el.hide=true)
      this.setData({
        list: data.list.outDetailsList,
        flowList: data.list.inFlowForOutList
      })
    })

    this.setData({
      orderType: options.orderType,
      orderNum: options.orderNum
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