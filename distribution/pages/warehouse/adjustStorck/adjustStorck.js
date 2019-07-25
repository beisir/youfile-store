// distribution/pages/warehouse/adjustStorck/adjustStorck.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    reason: [{
      name: '库存报溢'
    }, {
        name: '销售退货'
    }, {
        name: '破损'
    }, {
        name: '采购退货'
    }, {
        name: '其他'
    }]
  },
  choseReason(e){
    let thisindex = e.currentTarget.dataset.index,
        arr = this.data.reason

    arr.forEach((el,index)=> {
      el.checked = false
      if(index === thisindex){
        el.checked = true
      }
    })    
    this.setData({reason:arr})

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      name:options.name,
      num: options.num,
      code: options.code
    })
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