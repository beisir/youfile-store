import http from './utils/http.js'
import pageRequest from './utils/pageRequest.js'
import AuthHandler from './utils/authHandler.js'
import { imageUrl } from './utils/const.js'
App({
  onLaunch: function (options) {
    // options.query.storeId
    if (options.query.storeId){
      wx.setStorage({
        key: 'storeId',
        data: options.query.storeId,
      })
    }
    // wx.setStorage({
    //   key: 'storeId',
    //   data:'S1000349',
    // })
    // wx.setStorage({
    //   key: 'admin',xyd
    //   data:2, //1yon 2店主  3批发商
    // })
    // 购物车
    // if (wx.getStorageSync('admin')==3){
    //   wx.setTabBarItem({
    //     index: 1,
    //     text: '进货车',
    //     iconPath: '/image/22.png',
    //     selectedIconPath: '/image/21.png'
    //   })
    // }
    // 展示本地存储能力
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)
  },
  globalData: {
    userInfo: null,
    skin: "normal",
    imageUrl: imageUrl
  },
  http: new http(),
  pageRequest: new pageRequest(),
  authHandler: new AuthHandler(),
});


