// distribution/pages/purchase/choseSupplier/choseSupplier.js
import Api from '../../../../utils/api.js'
import {
  tabSelceted
} from '../../../../distribution/static/js/common.js'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    supplierList: [],
    serText: '',
    tabStatus: 'sup'
  },
  // 切换
  choseTab(e) {
    this.setData({
      tabStatus: e.currentTarget.dataset.type
    }, () => {
      this.getList(true)
    })
  },
  chose(e) {
    tabSelceted(e.currentTarget.dataset.index, this.data.supplierList, 'supplierList', this)
    let arr = this.data.supplierList.filter(el => el.selected)
    let pages = getCurrentPages(),
      pre = pages[pages.length - 2]
    if (pre) {
      // 供应商 no 云供应商 storeId merchantNumber
      if (this.data.tabStatus === 'sup') {
        pre.setData({
          supplierObj: {
            supplierNumber: arr[0].no,
            name: arr[0].name,
            supplierType: 'self_maintenance'
          }
        })
      } else {
        pre.setData({
          supplierObj: {
            supplierNumber: arr[0].merchantNumber,
            supplierStoreId: arr[0].storeId,
            name: arr[0].name,
            supplierType: 'platform_merchant'
          }
        })
      }
      wx.navigateBack()
    }
  },
  getList(re) {
    if (re) {
      app.pageRequest.pageData.pageNum = 0
      this.setData({
        supplierList: []
      })
    }
    if (this.data.tabStatus === 'sup') {
      Api.getGoodsSupplier({
        keyword: this.data.serText,
        goodsId: this.data.goodsId,
        skuCode: this.data.code,
        supplierType: 'self_maintenance'
      }).then(res => {
        this.setData({
          supplierList: this.data.supplierList.concat(res.obj.result),
          totalNum: res.obj.totalCount
        })
      })
    } else {

    }
  },
  serinput(e) {
    this.setData({
      serText: e.detail.value
    })
  },
  serch() {
    this.getList()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      goodsId: options.goodsId,
      code: options.code
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
    this.getList(true)
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
    this.getList()
  }

})