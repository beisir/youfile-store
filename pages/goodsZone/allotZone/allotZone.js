// pages/goodsZone/allotZone/allotZone.js
import Api from '../../../utils/api.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[{}]
  },
  getList(){
    Api.getZoneListAdmin().then(res=>{
      this.setData({
        list: res.obj
      })
    })
  },

  selectItem(e){
    let thisindex = e.currentTarget.dataset.index,
        arr = this.data.list

    arr.forEach((el,index)=> {
      if (thisindex === index){
        el.selected = true
      } else {
        el.selected = false
      }
    })    
    this.setData({
      list: arr
    })
  },
  sure(){
    let arr = this.data.list,
        s = arr.filter(el => el.selected)
    if(s.length==0){
      Api.showToast('请选择分区')
      return
    }
    let obj = {
      zoneNumber: s[0].zoneNumber,
      goodsIds: this.data.code.split(',')
    }
    Api.addGoodsToZone(obj).then(res=> {
      Api.showToast(res.message)
      setTimeout(()=>{
        wx.navigateBack()
      },800)
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      code: options.code
    })
    this.getList()
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