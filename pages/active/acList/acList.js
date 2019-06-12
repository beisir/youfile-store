// pages/active/acList/acList.js
const app = getApp()
import Api from '../../../utils/api.js'
const util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nav:[{
      name:'全部',
      type:'',
      checked: true
    }, {
      name: '未开始',
      type: 'init'
    }, {
      name: '进行中',
      type: 'be_doing'
    }, {
      name: '已结束',
      type: 'finish'
    }],
    list:[]  
  },
  // 活动分析
  activityAnalysis: function (e) {
    var activityNumber = e.target.dataset.index,
      title = e.target.dataset.title,
      status = e.target.dataset.status
    wx.navigateTo({
      url: '../../mallActive/activityAnalysis/activityAnalysis?activityNumber=' + activityNumber + "&title=" + title + "&status=" + status,
    })
  },
  checkNav(e){
    let thisindex = e.currentTarget.dataset.index,
        arr = this.data.nav
    arr.forEach((el,index)=>{
      if(index === thisindex){
        el.checked = true
      }else{
        el.checked = false
      }
    })    
    this.setData({
      nav:arr
    },()=>{
      this.getList(true)
    })
  },
  getList(re){
    if (re) {
      app.pageRequest.pageData.pageNum = 0;
    }
    let obj = {}
    let arr = this.data.nav
    for(let el in arr){
      if (arr[el].checked){
        obj.activityStatus = arr[el].type
        break
      }
    }
    
    Api.storeACList(obj).then(res=>{
      if (res.obj && res.obj.result) {
        let arr = res.obj.result
        arr.forEach(el=>{
          el.startTime = util.formatTime(new Date(el.startTime))
          el.endTime = util.formatTime(new Date(el.endTime))
        })
        if (re) {
          this.setData({
            list: res.obj.result
          })
        } else {
          this.setData({
            list: this.data.list.concat(res.obj.result)
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getList(true)
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
    this.getList()
  },
})