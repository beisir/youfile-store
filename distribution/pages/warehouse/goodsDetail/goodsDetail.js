// distribution/pages/warehouse/goodsDetail/goodsDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabType: 'house',
    dayList: [{
      name: '近七天',
      type: 'day',
      day: 7
    }, {
      name: '近30天',
      type: 'day',
      day: 30
    }, {
      name: '自定义',
      type: 'own'
    }]
  },
  tabclick(e) {
    let type = e.currentTarget.dataset.type
    this.setData({
      tabType: type
    })
  },
  clearEnd(){
    this.setData({endTime:''})
  },
  bindDateChange(e) {
    let type = e.currentTarget.dataset.type,
      obj = {}
    if (type === 'start') {
      obj.startTime = e.detail.value
    } else if (type === 'end') {
      obj.endTime = e.detail.value
    }
    this.setData(obj)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let query = wx.createSelectorQuery()
    query.select("#filter").boundingClientRect()
    query.exec((res) => {
      console.log(res)
      this.setData({
        menuTop: res[0].top
      })
    })
  },

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

  },
  onPageScroll: function(e) {
    e.scrollTop > this.data.menuTop ? this.setData({
      menuFixed: true
    }) : this.setData({
      menuFixed: false
    })
  }
})