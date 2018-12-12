// pages/faceToFaceOrder/myCustomerList/myCustomerList.js
const app = getApp();
import Api from "../../../utils/api.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nav: [{ name: "关注用户", type: "gzyh", checked: true }, { name: "进货商", type: "jhs", checked: false }, { name: "成交客户", type: "cjkh", checked: false }],
    list: [], 
    totalNum:0,
    checkedNav: { name: "关注用户", type: "gzyh", checked: true },
    searchText:"",
    baseUrl: app.globalData.imageUrl
  },
  switchNav(e) {
    let type = e.currentTarget.dataset.type;
    let arr = this.data.nav;
    arr.forEach(el => {
      if (el.type == type) {
        el.checked = true
        this.setData({
          checkedNav:el
        })
      } else {
        el.checked = false
      }
    })
    this.setData({
      nav: arr
    })
    this.getList(true);
  },
  watchInput(e){
    let val = e.detail.value
    this.setData({
      searchText : val
    })
  },
  search(){
    this.getList(true);
  },
  getList(re){
    if(re){
      app.pageRequest.pageData.pageNum = 0;
      this.setData({
        list : []
      })
    }
    let type = this.data.checkedNav.type;
    let data = {}
    switch(type){
      case "gzyh" : 
        data.keyword = this.data.searchText;
        Api.favoriteusers(data).then(res => {
          this.setData({
            totalNum: res.obj.totalCount,
            list:this.data.list.concat(res.obj.result)
          })
        }).catch(e => {

        });break;
      case "jhs" : 
        data.keyWords = this.data.searchText;
        data.orderCategory = 1;
        Api.dealUser(data).then(res => {
          this.setData({
            totalNum: res.obj.totalCount,            
            list: this.data.list.concat(res.obj.result)
          })
        }).catch(e => {

        }); break;
      case "cjkh" : 
        data.keyWords = this.data.searchText;
        data.orderCategory = 3;
        Api.dealUser(data).then(res => {
          this.setData({
            totalNum: res.obj.totalCount,            
            list: this.data.list.concat(res.obj.result)
          })
        }).catch(e => {

        });break;    
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getList(true);
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
    this.getList();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})