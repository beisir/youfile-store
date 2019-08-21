// distribution/pages/warehouse/adjustStorck/adjustStorck.js
import Api from "../../../../utils/api.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    reason: [{
      name: '库存报溢',
      code: 'stock_overflow'
    }, {
      name: '销售退货',
      code: 'sale_return'
    }, {
      name: '破损',
      code: 'breakage'
    }, {
      name: '采购退货',
      code: 'purchase_return'
    }, {
      name: '其他',
      code: 'other'
    }],
    num: 0,
    remark: ''
  },
  choseReason(e) {
    let thisindex = e.currentTarget.dataset.index,
      arr = this.data.reason

    arr.forEach((el, index) => {
      el.checked = false
      if (index === thisindex) {
        el.checked = true
      }
    })
    this.setData({
      reason: arr
    })

  },
  seeFlow() {
    wx.navigateTo({
      url: '../goodsFlow/goodsFlow?code=' + this.data.code,
    })
  },
  testNum(str) {
    let reg = /^\-?[1-9][0-9]*$/
    return reg.test(str)
  },
  watchinput(e) {
    let val = e.detail.value
    this.showStr(val)
    this.setData({
      num: val
    })
  },
  showStr(val) {
    if (this.testNum(val)) {
      let str = ''
      val > 0 ? str = "增加 " + val + " 个" : str = "减少 " + Math.abs(val) + " 个"
      this.setData({
        numStatus: str
      })
    } else {
      this.setData({
        numStatus: ""
      })
    }
  },
  testblur(e) {
    let str = e.detail.value
    if (!this.testNum(str)) {
      this.setData({
        numStatus: ""
      })
      this.setData({
        num: 0
      })
    }
  },
  changeNum(e) {
    let num = this.data.num,
      type = e.currentTarget.dataset.type

    type === 'reduce' ? num-- : num++
      this.showStr(num)
    this.setData({
      num
    })
  },
  remark(e) {
    this.setData({
      remark: e.detail.value
    })
  },
  sure(){
    if (!this.data.supplierObj){
      Api.showToast("请选择供应商")
      return
    }
    if (!this.data.num || this.data.num==0){
      Api.showToast("请输入调整数量")
      return
    }
    let obj = {
      stockCode: this.data.code,
      changeNum: this.data.num,
      supplierNumber: this.data.supplierObj.supplierNumber,
      supplierName: this.data.supplierObj.name,
      supplierType: this.data.supplierObj.supplierType,
      remark: this.data.remark,
      skuName: this.data.skuName
    }
    
    let reason = this.data.reason.filter(el => el.checked)
    if (reason[0]){
      obj.adjustReason = reason[0].code
    }
    Api.adjustGoodsStock(obj).then(res=>{
      Api.showToast(res.message,()=>{
        wx.navigateBack()
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      skuCode: options.skuCode,
      name: options.name,
      stockNum: options.num,
      code: options.code,
      goodsId: options.goodsId,
      skuName: options.skuname ? options.skuname:'默认规格'
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