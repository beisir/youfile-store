import Api from '../../../utils/api.js'
import authHandler from '../../../utils/authHandler.js';
import IsStoreOwner from '../../../utils/isStoreOwner.js';
import { saveFormID } from '../../../utils/modelMsg.js'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    globalData: app.globalData,
    followNum: 0,
    payOrders: 0,
    todaySaleNum: 0,
    unshippedOrders: 0,
    verifyFriends: 0,
    isStoreOwerShow: false,
    loadOnece: false,
    unshippedPurchaseOrders: 0,
    payPurchaseOrders: 0,
    auditStatus:true,
    // 新功能弹窗
    newFunLayer: false
  },
  getNewFunStorage() {
    let val = wx.getStorageSync("newFun")
    if (!val) {
      this.setData({ newFunLayer: true })
    }
  },
  // 关闭新功能弹窗
  closeModal(e) {
    this.setData({ newFunLayer: false })
    wx.setStorage({
      key: 'newFun',
      data: true,
    })
  },
  // 埋点存储formid
  getFormId(e) {
    saveFormID(e)
  },
  // 页面跳转
  goUser: function() {
    wx.switchTab({
      url: '../../page/user/user'
    })
    this.setData({
      hidden: false
    })
  },
  goHome: function () {
    wx.switchTab({
      url: '../../page/home/home'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 新功能提示框
    this.getNewFunStorage()
    
    var _this = this
    if (options) {
      if (options.storeId) {
        this.setData({
          isStoreOwerShow: true
        })
        // 身份判断
        wx.setStorageSync("storeId", options.storeId)
        let isStoreOwner = new IsStoreOwner();
        isStoreOwner.enterIdentity().then(res => {
          if (res.isStoreOwner){
            _this.getStore();
            _this.getMes()
            _this.setData({
              isStoreOwerShow: false,
              loadOnece: true
            })
          }else{
            _this.goUser()
          }
        }).catch(res => {
        });
      } else {
        this.setData({
          loadOnece: true
        })
      }
    }
    // 是否支持在线支付
    this.getPayway()
  },
  goDerm: function() {
    wx.navigateTo({
      url: '../../page/storeIcon/storeIcon',
    })
  },
  getMes: function() {
    var _this = this
    Api.storeIndex()
      .then(res => {
        var obj = res.obj
        _this.setData({
          indexData: obj,
          followNum: obj.followNum,
          payOrders: obj.payOrders,
          unshippedPurchaseOrders: obj.unshippedPurchaseOrders,
          payPurchaseOrders: obj.payPurchaseOrders,
          todaySaleNum: obj.todaySaleNum == null ? 0 : (obj.todaySaleNum).toFixed(2),
          unshippedOrders: obj.unshippedOrders,
          verifyFriends: obj.verifyFriends,
          auditStatus: obj.auditStatus,
        })
      })
  },
  getStore() {
    Api.storeIdInfo().then(res => {
      let store = res.obj.store[0].store;
      if (!store || !store.name) {
        this.setData({
          initOrder: true
        })
      } else {
        wx.setNavigationBarTitle({
          title: store.name + "工作台"
        })
        this.setData({
          initOrder: false
        })
      }
    })
  },
  getPayway() {
    Api.storeOnlinePay().then(res => {
      if (res.obj && res.obj.onlinePay) {
        this.setData({onlinePay: true});
      }else{
        this.setData({ onlinePay: false });
      }
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
    if (this.data.loadOnece) {
      this.getMes()
      this.getStore();
    }
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

})