// pages/mallActive/choseSpec/choseSpec.js
import API from '../../../utils/api.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    checkednum:0,
    skuList: []
  },
  chooseThis(e) {
    let thisindex = e.currentTarget.dataset.index,
      arr = this.data.skuList;
    arr.forEach((el, index) => {
      thisindex == index ? el.checked = !el.checked : '';
    })
    let checkednum = arr.filter(el=>el.checked)
    if (checkednum.length < arr.length){
      this.setData({ selectAllStatus: false})
    } else if (checkednum.length == arr.length){
      this.setData({ selectAllStatus: true })
    }
    this.setData({
      skuList: arr,
      checkednum: checkednum.length
    })
  },
  // 全选
  selectAll(){
    let now = !this.data.selectAllStatus,
      arr = this.data.skuList;
    arr.forEach((el, index) => {
      el.checked = now;
    })
    this.setCheckNum(arr)
    this.setData({
      selectAllStatus: now,
      skuList: arr,
    })
  },
  sureSelect(){
    let arr = this.data.skuList;
    let checkedarr = arr.filter(el => el.checked)
    
    let pages = getCurrentPages(),
        current = pages[pages.length-2];
    current && current.getSku ? current.getSku(checkedarr):''
    wx.navigateBack()
  },
  // 获取详情
  getDetail() {
    API.getActiveGoodsDetail({ activityNumber: this.data.activityNumber, goodsId: this.data.goodsId }).then(res => {
      this.setData({
        goods: res.obj.goodsVO,
        skuList: res.obj.goodsVO.goodsSkuVOList,
        activeSkuList: res.obj.goodsActivityRelationVOS
      })
      let allArr = this.data.skuList
      let acArr = this.data.acArr
      if (allArr.length > 0) {  // 有sku
        allArr.forEach(el => {
          acArr.forEach(acitem => {
            if (acitem == el.skuCode) {
              el.checked = true
            }
          })
        })
        this.setCheckNum(allArr)
        this.setData({ skuList: allArr })
      } else {  // 无sku
        this.setData({ noSku: true })
      }
    })
  },
  setCheckNum(arr){
    let checkednum = arr.filter(el => el.checked)
    this.setData({ checkednum: checkednum.length})
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({ goodsId: options.goodsId, activityNumber: options.activityNumber, acArr: JSON.parse(options.acArr)})
    this.getDetail()
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