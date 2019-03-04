const app = getApp();
import Api from '../../../utils/api.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    parentCategoryCode:0,
    listData: [],
    value:'',
    isShowClose:false,
    initShow:false
  },
  //监听input输入的值
  searchInput:function(e){
    var val=e.detail.value,
      len = val.length
    if(len>0){
      this.setData({
        isShowClose:true
      })
    }else{
      this.setData({
        isShowClose: false
      })
    }
    this.setData({
      value:val
    })
  },
  emptyInput:function(){
    this.setData({
      isShowClose: false,
      value:''
    })
  },
  searchBtn:function(){
    var data={},
    _this=this,
    value=this.data.value
    if (value){
      data.threeCategoryName = value
      Api.searchClass(data)
        .then(res => {
          var listData=res.obj
          _this.setData({
            listData: listData,
            initShow:true
          })
        })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  classFun: function (e) {
      var code=e.target.dataset.id,
        name = e.target.dataset.name
    var pages = getCurrentPages();             //  获取页面栈
    var currPage = pages[pages.length - 1];
    var prevPage = pages[pages.length - 2];    // 上一个页面
    prevPage.setData({
      code: code,
      codeName: name
    })
    wx.navigateBack({
      data: 1
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

 
})