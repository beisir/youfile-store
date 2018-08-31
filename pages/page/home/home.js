const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    winWidth: 0,
    winHeight: 0,
    show:false,
    isShow:false,
    showHide:true,
    showDp:true,
    // tab切换 
    currentTab: 0,
    result: [],
    keyword:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  addTip:function(){
    this.setData({
      show:true
    })
  },
  confirm:function(){
    this.setData({
      show: false,
      isShow:true,
    })
  },
  editFun:function(){
    this.setData({
      showHide: false,
    })
  }, 
  closeShow: function() {
    this.setData({
      showHide: true,
      showDp:true
    })
  }, 
  editDp: function () {
    this.setData({
      showDp: false,
    })
  }, 

  getList: function () {
    var _this = this,
      keyword = this.data.keyword
    app.pageRequest.pageGet('/admin/shop/store/{{storeId}}/goods', { keyword: keyword })
      .then(res => {
        var detailList = res.obj.result,
          datas = _this.data.result,
          totalCount = res.obj.totalCount,
          newArr = app.pageRequest.addDataList(datas, detailList)
          console.log(newArr)
        _this.setData({
          result: newArr,
        })
      })
  },
  onLoad: function (options) {

    var that = this;
    that.getList()
    // wx.navigateToMiniProgram({
    //   appId: 'wx339cc894ccbde5ab',
    //   path: 'pages/index/index?id=123',
    //   extraData: {
    //     foo: 'bar'
    //   },
    //   envVersion: 'develop',
    //   success(res) {
    //     // 打开成功
    //   }
    // })
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }

    });
  },


  bindChange: function (e) {
    var that = this;
    that.setData({ currentTab: e.detail.current });

  },

  swichNav: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current,
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {


  },
  searchBtn(e) {
    this.setData({
      result:[]
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {
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
    console.log(111)
    app.pageRequest.pageData.pageNum = 0
    this.getList()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log(111)
    this.getList()
  },
  bindDownLoad: function () {
    this.getList()
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },


})