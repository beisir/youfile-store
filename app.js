import http from './utils/http.js'
import pageRequest from './utils/pageRequest.js'
import AuthHandler from './utils/authHandler.js'
import { imageUrl } from './utils/const.js'
import touch from './utils/touch.js'
App({
  onLaunch: function (options) {
    if (options.query){
      wx.setStorageSync("storeId",options.query.storeId)
    }
    // wx.setStorageSync("storeId", "S1000349")
    // wx.setStorage({
    //   key: 'storeId',
    //   data:'S1000349',  
    // })
    // wx.setStorage({
    //   key: 'admin',xyd
    //   data:2, //1yon 2店主  3批发商
    // })
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
  touch: new touch()
});


