// pages/login/floor/floor.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //操作菜单
    showMenu:false,
    companyLogo:"/image/dp.png",
    moreSrc: "/image/moreO.png",
    companyName:"百荣世贸商城一期",
    floorList:[
      {
        floorTitle:'1F',
        floorType:"鞋帽",
        admin:"/image/pic.png",
        area: [
          {
            areaName: 'A区',
            areaType: "名品男装",
            admin: [
              "/image/pic.png",
              "/image/pic.png"
            ]
          },
          {
            areaName: 'A区',
            areaType: "名品男装",
            admin: [
              "/image/pic.png",
              "/image/pic.png"
            ]
          },
          {
            areaName: 'A区',
            areaType: "名品男装",
            admin: [
              "/image/pic.png",
              "/image/pic.png"
            ]
          }
        ]  
      },
      {
        floorTitle: '1F',
        floorType: "鞋帽",
        admin: "/image/pic.png"
      } 
    ]
    
  },
  more(){
    this.setData({
      showMenu:true
    })
  },
  closeShow(){
    this.setData({
      showMenu: false
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})