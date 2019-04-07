// pages/user/user.js
import Api from '../../../utils/api.js';
import authHandler from '../../../utils/authHandler.js';
import IsStoreOwner from '../../../utils/isStoreOwner.js';
var app = getApp();
// 身份判断
function getIdentity(_this) {
  let isStoreOwner = new IsStoreOwner();
  isStoreOwner.enterIdentity().then(res => {
    if (res.isStoreOwner){
      _this.setData({
        thisOwner: true
      })
    }else{
      _this.setData({
        thisOwner: false
      })
    }
    _this.getUser()
  }).catch(res => {
  });
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    globalData: app.globalData,
    hasUser: false,
    limitShow:1,
    indexEmpty: true,
    goRetailStore: true,
  },
  navigateToMyStore() {
    app.navigate.toMyStore(app.globalData.navigateToAppID.xls, this.data.user.storeId)
  },
  toMyStore(){
    let toID = this.data.user.storeId;
    if (toID){
      wx.setStorageSync("storeId", toID)
      app.globalData.switchStore = true;
      let pages = getCurrentPages() //获取页面数组
      let curPage = pages[pages.length - 1]  //获取当前页
      curPage.onShow() 
    }
  },
  showLogin() {
    this.selectComponent("#login").showPage();
  },
  getUser() {
    this.setData({
      isStoreOwner: false,
      otherStoreOwner: false
    })
    app.http.getRequest("/api/user/byuserid").then((res) => {
      if (res.obj) {
        this.setData({
          user: res.obj,
          hasUser: true
        })
        //申请店订单列表
        //新批零店主
        if (res.obj.isStoreOwner == true && res.obj.storeNature == 1){
          this.setData({
            isStoreOwner:true
          })
        } else if (res.obj.isStoreOwner == true && res.obj.storeNature == 2) {
          this.setData({
            otherStoreOwner: true   //新零售店主
          })
        }

        if (res.obj.hasYunStoreOrder == true){
          this.setData({
            hasYunStoreOrder: true
          })
        }else{
          this.setData({
            hasYunStoreOrder: false
          })
        }
        // 店铺开通是否付费
        if (res.obj.isStoreOwner == true){
          this.setData({
            payStore: true
          })
        }else{
          this.setData({
            payStore: false
          })
        }

      }else{
        this.setData({
          user: "",
          hasUser: false,
        })
      }
    }).catch(e => {
      this.setData({
        user: "",
        hasUser: false,
      })
    })
  },
  getStore(){
    Api.storeIdInfo().then(res=>{
      let store = res.obj.store[0].store;
      if (!store || !store.name){
        this.setData({
          initOrder:true
        })
      }else{
        this.setData({
          initOrder: false
        })
      }
    })
    Api.simpleStoreMsg({ storeId: wx.getStorageSync('storeId') }).then(res => {
      if (res.obj.mallMiniProgramAppId && res.obj.mallMiniProgramAppId !== app.globalData.navigateToAppID.platform) {
        app.globalData.navigateToAppID.platform = res.obj.mallMiniProgramAppId
      }
    })  
  },
  getUnpaidNum() {
    if (authHandler.isLogin()) {
      //用户订单查询
      Api.unpaidOrderNum().then(res => {
        this.setData({
          retailOrderCount: res.obj.retailOrderCount,
          wholesaleOrderCount: res.obj.wholesaleOrderCount,
          faceToFaceOrderCount: res.obj.faceToFaceOrderCount
        })
      })
    } else {
      this.setData({
        retailOrderCount: 0,
        wholesaleOrderCount: 0,
        faceToFaceOrderCount: 0
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options==undefined){
      app.globalData.switchStore=true
    }
    this.setData({
      baseUrl: app.globalData.imageUrl
    })
    try{
      if (options.storeId) {
        wx.setStorageSync("storeId", options.storeId)
        app.globalData.switchStore = true;
      }
      if (options.layerText) {
        app.globalData.userShowTip = true
      }
    }catch(e){}
    
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },
  addTip: function () {
    var Id = Api.getThisStoreId()
    wx.navigateTo({
      url: '../../businessFriend/information/information?status=0&send=&accept=' + Id + '&remark=&logo=&name=',
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //跳转弹框
    if (app.globalData.userShowTip) {
      app.globalData.userShowTip = false;
      wx.showModal({
        title: '',
        content: '请登录您的账号（购买时的手机号），开启您的' + app.globalData.projectName+'吧！',
        showCancel:false,
      })
    }
      if (!Api.getStoreId()) {
        this.setData({
          indexEmpty: false
        })
      }
      if (app.globalData.storeIdRetail){
        this.setData({
          goRetailStore:false
        })
      }else{
        getIdentity(this)
        this.getStore();
      }
    this.getUnpaidNum();
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

})