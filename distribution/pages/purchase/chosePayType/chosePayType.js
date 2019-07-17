// distribution/pages/purchase/chosePayType/chosePayType.js
import Api from '../../../../utils/api.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    typeList: []
  },
  checked(e){
    let thisindex = e.currentTarget.dataset.index,
        arr = this.data.typeList,
        payway = {}
    arr.forEach((el,index)=>{
      el.selected = false
      if(index === thisindex){
        el.selected = true
        payway = el
      }
    })    
    this.setData({
      typeList: arr
    })

    let pages = getCurrentPages(),
        pre = pages[pages.length-2]
    if(pre){
      pre.setData({
        payway
      })
    }    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    Api.getPurchaseOrderPayWay().then(res=>{
      if (options.code) {
        res.obj.forEach(el => {
          if (el.payWayCode === options.code) {
            el.selected = true
          }
        })
      }
      this.setData({
        typeList: res.obj
      })
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