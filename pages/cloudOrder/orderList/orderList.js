// pages/cloudOrder/orderList/orderList.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tab: [
      { name: "全部", type: 'all', check: true },
      { name: "待付款", type: 'wait', check: false },
      { name: "已付款", type: 'already', check: false },
      { name: "已取消", type: 'cancel', check: false }
    ],
    payCode:"",
    openModal:false
  },
  watchInput(e){
    let val = e.detail.value;
    this.setData({
      payCode:val
    })
  },
  sureOpen(){
    let num = this.data.num;
  },
  openStore(e){
    this.setData({
      payCode:"",
      openModal:true,
      num:e.currentTarget.dataset.data
    })
  },
  // 切换TAB
  switchTab(e) {
    let type = e.currentTarget.dataset.type,
      index = e.currentTarget.dataset.index;
    this.data.tab.forEach((el, i) => {
      if (i == index) {
        this.setData({
          ['tab[' + i + '].check']: true
        })
      } else {
        this.setData({
          ['tab[' + i + '].check']: false
        })
      }
    })
    //this.getList(true);
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