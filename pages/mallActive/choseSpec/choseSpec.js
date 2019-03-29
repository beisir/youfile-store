// pages/mallActive/choseSpec/choseSpec.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    checkednum:0,
    goods: [{
      name: 'asdas',
      num: 12312
    }, {
      name: 'asdas',
      num: 12312
    }]
  },
  chooseThis(e) {
    let thisindex = e.currentTarget.dataset.index,
      arr = this.data.goods;
    arr.forEach((el, index) => {
      thisindex == index ? el.checked = !el.checked : '';
    })
    let checkednum = arr.filter(el=>el.checked)
    if (checkednum.length < arr.length){
      this.setData({ selectAllStatus: false})
    } else if (checkednum.length == arr.length){
      this.setData({ selectAllStatus: true })
    }
    this.setData({
      goods: arr,
      checkednum: checkednum.length
    })
  },
  // 全选
  selectAll(){
    let now = !this.data.selectAllStatus,
      arr = this.data.goods;
    arr.forEach((el, index) => {
      el.checked = now;
    })
    let checkednum = arr.filter(el => el.checked)
    this.setData({
      selectAllStatus: now,
      goods: arr,
      checkednum: checkednum.length
    })
  },
  sureSelect(){
    let arr = this.data.goods;
    let checkednum = arr.filter(el => el.checked)
    
    let pages = getCurrentPages(),
        current = pages[pages.length-2];
    current && current.getSku ? current.getSku(checkednum):''
    wx.navigateBack()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    
    console.log(JSON.parse(options.sku))
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

  }
})