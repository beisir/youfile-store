const app = getApp();
Component({
  properties: {
   
  },
  data: {
  },
  methods: {
    goRetailStore:function(){
      var retailStoreId = wx.getStorageSync("storeIdRetail")
      wx.navigateToMiniProgram({
        appId: 'wx1a7532a2abdd1698', // 要跳转的小程序的appid
        path: 'pages/page/home/home', // 跳转的目标页面
        extarData: {
          storeId: retailStoreId
        },
        success(res) {
          // 打开成功  
        }
      })
    }
  }
})
