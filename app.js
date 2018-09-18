import http from './utils/http.js'
import pageRequest from './utils/pageRequest.js'
App({
  onLaunch: function (options) {
    console.log(options.storeId)
    wx.setStorage({
      key: 'storeId',
      data: "180500",
    })
    wx.setStorage({
      key: 'baseUrl',
      data: 'https://dev.image.youlife.me/',
    })
    // 购物车
    if (wx.getStorageSync('admin')==3){
      wx.setTabBarItem({
        index: 1,
        text: '进货车',
        iconPath: '/image/22.png',
        selectedIconPath: '/image/21.png'
      })
    }
    // 展示本地存储能力
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)
    
  },
 
  globalData: {
    userInfo: null,
    skin: "normal",
  },
  http: new http(),
  pageRequest: new pageRequest(),
  
});


