const app = getApp();
Component({
  properties: {
   
  },
  data: {
    globalData: app.globalData,
  },
  methods: {
    goRetailStore:function(){
      var retailStoreId = wx.getStorageSync("storeIdRetail")
      app.navigate.toProgram(app.globalData.navigateToAppID.xls, 'pages/page/home/home?storeId=' + retailStoreId, {})
    }
  }
})
