// pages/goodsZone/manageZone/manageZone.js
import Api from '../../../utils/api.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    editModal: false
  },
  getList(){
    Api.adminShowZoneList().then(res=>{
      console.log(res)
      this.setData({
        list: res.obj
      })
    })
  },
  onOrOff(e){
    let id = e.currentTarget.dataset.num,
      type = e.currentTarget.dataset.type
    Api.zoneOnOrOff({ zoneNumber: id, onOrOff: type}).then(res=>{
      this.getList()
    })
  },
  toTop(e) {
    let id = e.currentTarget.dataset.num
    Api.zoneToTop({ zoneNumber: id }).then(res => {
      this.getList()
    })
  },
  edit(){
    this.setData({
      editModal: true
    })
  },  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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