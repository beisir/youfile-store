// pages/marketing/poster/posterStoreroom/posterStoreroom.js
import API from '../../../../utils/api.js'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseUrl: app.globalData.imageUrl,
    storeroom:[],
    creatModal: false,
    newName:''
  },
  // 获取专辑列表
  getStore(){
    API.getPosterTagList({ posterNum: 4}).then(res=> {
      this.setData({storeroom: res.obj})
    })
  },
  // 添加专辑
  createshow(){
    this.setData({ newName:'',creatModal: true})
  },
  inputNewName(e){
    let val = e.detail.value
    this.setData({ newName: val})
  },
  addStore(){
    let val = this.data.newName.trim();
    if (val.length > 0) {
      API.addPosterTag({ name: val }).then(res => {
        API.showToast(res.message)
        this.closeModal()
        setTimeout(()=>{
          this.getStore()
        },800)
      })
    }else{
      API.showToast("请输入专辑名称")
    }
  }, 
  closeModal(){
    this.setData({
      creatModal: false
    })
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
    this.getStore()

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