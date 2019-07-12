// distribution/pages/purchase/chosePayType/chosePayType.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    typeList: [{
      name: '微信转账'
    }, {
      name: '支付宝转账'
    }, {
      name: '现金支付'
    }, {
      name: '银行转账'
    }, {
      name: 'POS刷卡'
    }, {
      name: '其他支付支付'
    }]
  },
  checked(e){
    let thisindex = e.currentTarget.dataset.index,
        arr = this.data.typeList
    arr.forEach((el,index)=>{
      el.selected = false
      if(index === thisindex){
        el.selected = true
      }
    })    
    this.setData({
      typeList: arr
    })
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