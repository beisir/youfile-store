// distribution/pages/purchase/orderList/orderList.js
import { tabSelceted } from '../../../../distribution/static/js/common.js'
import Api from "../../../../utils/api.js"
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseUrl: app.globalData.imageUrl,
    flowtab: [{
      name: "全部",
      type: '',
      selected: true
    }, {
      name: "待入库",
      type: 'init,part'
    }, {
      name: "已入库",
      type: 'whole'
    }],
    tabType: 'caigou',
    serText: ""
  },
  toDetail(e){
    wx.navigateTo({
        url: '../orderDetail/orderDetail?no=' + e.currentTarget.dataset.no,
    })
  },
  choseflowtab(e) {
    tabSelceted(e.currentTarget.dataset.index, this.data.flowtab, 'flowtab', this)
    this.getList(true)
  },
  getList(re){
    if (re) {
      app.pageRequest.pageData.pageNum = 0
      this.setData({ goodsList: [] })
    }
    
    if (this.data.tabType === 'caigou') {
      let obj = {
        keywords: this.data.serText
      }
      let c = this.data.flowtab.filter(el => el.selected)
      obj.status = c[0].type

      Api.getPurchaseOrderList(obj).then(res => {
        if (!res.obj.result) { res.obj.result = []}
        this.setData({
          goodsList: this.data.goodsList.concat(res.obj.result)
        })
      })
    } else {

    }
  },
  serchinput(e) {
    this.setData({
      serText: e.detail.value
    })
  },
  search() {
    this.getList(true)
  },
  clearSerch(){
    this.setData({
      serText: ''
    })
  },
  tabclick(e) {
    this.setData({
      tabType: e.currentTarget.dataset.type
    }, () => {
      this.getList(true)
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getList()
  }
})