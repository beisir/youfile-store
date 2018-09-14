const app = getApp();
import Api from '../../../utils/api.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    userId:'123',
    show1:false,
    id:'',
  },
  
  selectAdd(e){
    let obj = this.data.list[e.currentTarget.dataset.index];
    var pages = getCurrentPages();
    if (pages.length > 1) {
      //上一个页面实例对象
      var prePage = pages[pages.length - 2];
      prePage.getAddress(obj)
      wx.navigateBack();
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  
  onLoad: function (options) {
    this.getList()
  },
  getList:function(){
    var _this = this,
      userId = this.data.userId
    Api.addressList({ userId: userId })
      .then(res => {
        var res = res.obj
        _this.setData({
          list: res,
          show1: false,
        })
      })
  },
  selectList(e){
    const index1=e.currentTarget.dataset.index,
          id = e.target.dataset.id,
          userId=this.data.userId,
          array = this.data.list
    array.forEach((item, index, arr) => {
      var sItem = "list[" + index + "].isDefault"
      this.setData({
        [sItem]: false,
      })
    })
    array[index1].isDefault = true
    Api.addressDefault({userId: userId,id: id})
      .then(res => {
        var res = res.obj
      })
    this.setData({
      list: array
    })
  },
  // 删除
  deleteList(e) {
    this.setData({
      show1:true,
      id: e.target.dataset.id,
    })
   
  },
  confirm:function(){
    var _this=this
    Api.addressDelete({ id:this.data.id})
      .then(res => {
        wx.showToast({
          title: '删除成功',
          icon: 'none',
          duration: 2000,
        })
        this.getList()
      })
  },
  // 编辑
  editList(e) {
    var id=e.target.dataset.id
    wx.navigateTo({
      url: '../newAddress/newAddress?id='+id,
    })
    // const index = e.currentTarget.dataset.index,
    //   id = e.target.dataset.id,
    //   _this = this
    //   console.log(id)
    // let detailList = this.data.list;
    // detailList.splice(index, 1);
    // app.http.deleteRequest('/admin/user/usershopaddress/{{id}}', { id: id })
    //   .then(res => {
    //     var res = res.obj
    //     _this.setData({
    //       list: detailList
    //     })
    //     wx.showToast({
    //       title: '成功',
    //       icon: 'none',
    //       duration: 2000
    //     })
    //   })
  },
  newAddress(e){
    wx.navigateTo({
      url: '../newAddress/newAddress',
    })
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