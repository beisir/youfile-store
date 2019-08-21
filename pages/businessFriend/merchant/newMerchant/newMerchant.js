import Api from '../../../../utils/api.js'
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detailList: [],
    send: wx.getStorageSync('storeId'),
    baseUrl: app.globalData.imageUrl,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  // status 1 等待对方认证 2已添加 3等待自己认证 
  getList: function (data) {
    var _this = this
    Api.newMerchant(data)
      .then(res => {
        var detailList = res.obj.result
        if (detailList != null) {
          for (var i = 0; i < detailList.length;i++){
            if(detailList[i].greet!=null){
              var arr = (detailList[i].greet).split("#;#")
              var greet = arr[arr.length - 1]
            }else{
              var greet=''
            }
            detailList[i].greet=greet
            detailList[i].createDate = this.getTime(detailList[i].createDate)
          }
          var datas = _this.data.detailList,
            newArr = app.pageRequest.addDataList(datas, detailList)
          _this.setData({
            detailList: newArr,
          })
        } else {
          wx.showToast({
            title: '暂无更多了',
            icon: 'none',
            duration: 1000,
            mask: true
          })
        }

      })
  },
  getTime(timesec){
    if (!timesec){return ''}
    let date = new Date(timesec)
    const month = date.getMonth() + 1
    const day = date.getDate()
    
    return month + "月" + day + "日"
  },
  changeValue: function (e) {
    var val = e.detail.value
    this.setData({
      value: val
    })
  },
  searchBtn: function (e) {
    var val = this.data.value
    if (!val){return}
    app.pageRequest.pageData.pageNum = 0
    this.setData({
      detailList: []
    })
    this.getList({keyword: val })
  },
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
    this.setData({
      detailList: []
    })
    app.pageRequest.pageData.pageNum = 0
    this.getList()
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
    this.setData({
      detailList: [],
      value: ''
    })
    app.pageRequest.pageData.pageNum = 0
    this.getList({ userId: wx.getStorageSync('userId') })
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var val = this.data.value
    if (val == '') {
      this.getList({ userId: wx.getStorageSync('userId') })
    } else {
      this.getList({keyword: val })
    }
  },

})