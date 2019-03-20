// pages/page/navigateMiddleware/navigateMiddleware.js
import API from "../../../utils/api.js";
import EnterStoreHandler from '../../../utils/enterStoreHandler.js';

import {
  handleQRCode
} from "../../../utils/scanCode.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    options: {},
    indexEmpty:true,
    goRetailStore: true
  },
  
  sitchType(){
    let options = this.data.options

    // 小程序二维码进入
    if (options.scene) {
      let scene = decodeURIComponent(options.scene);
      let dataarr = scene.split("_");

      // "G_" + storeId + "_" + goodsId  商品小程序码 "S_" + storeId 店铺小程序码
      switch (dataarr[0]){
        case 'G':
          if(dataarr[2]){
            wx.redirectTo({
              url: '/pages/page/goodsDetails/goodsDetails?goodsId=' + dataarr[2]
            })
          }else{
            API.showToast("缺少商品~~无法识别小程序码")
          }
        break;
        case 'S':
          console.log(dataarr[1], wx.getStorageSync('storeId'))
          if (dataarr[1] === wx.getStorageSync('storeId')){
            this.toHome()
          } else {
            API.showToast("进入店铺失败~~请稍后再试")
          }
        break;
      }

      return
    }

    // 普通二维码
    if (options.q) {
      handleQRCode(decodeURIComponent(this.data.options.q), 'middle')
      return
    }
    // 跳转进入
    if (!options.scene && !options.q) {

    }
  },

  toHome() {
    wx.switchTab({
      url: '../home/home',
    })
  },
  /**
   * 判断是否有店铺ID
   */
  loadData: function() {
    var _this = this
    if (!API.getStoreId()) {
      this.setData({
        indexEmpty: false
      })
    } else {
      this.setData({
        indexEmpty: true
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // options = { scene:'G_S1000349_181105902000' }
    // options = { scene: 'S_S1000349' }

    var _this = this
    if (options != undefined) {
      this.setData({
        options
      })
      let enEnterStoreHandler = new EnterStoreHandler("1");
      enEnterStoreHandler.enterStore(options).then(store => {
        _this.loadData()
        //进店成功
        this.sitchType()

      }).catch(store => {
        _this.loadData()
        if (store) {
          // 判断零售店进到批零
          if (store.storeIdRetail) {
            _this.setData({
              goRetailStore: false
            })
          }
        }
      });
    }else{
      this.sitchType()
    }
    // handleQRCode('http://youlife.cn?type=ftforder&storeId=S1000349&code=880f1880e819c9ba1855f7975fb49236', 'middle', { q: 'http://youlife.cn?type=ftforder&storeId=S1000349&code=880f1880e819c9ba1855f7975fb49236'})
    // handleQRCode('http://youlife.cn?type=user&userId=cbced730cc43cead0592fbdd5ef10f99', 'middle', { q: 'http://youlife.cn?type=user&userId=cbced730cc43cead0592fbdd5ef10f99'})
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

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