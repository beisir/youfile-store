// distribution/pages/warehouse/partDetail/partDetail.js
import Api from '../../../../utils/api.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  getDetail(){
    Api.getHousePartMsg({code:this.data.code}).then(res=>{
      let obj = res.obj
      for(let key in obj){
        !obj[key] ? obj[key]='':''
      }
      this.setData({
        part: obj
      })
    })
  },
  del(){
    Api.delHousePart({code:this.data.code}).then(res=>{
      Api.showToast(res.message,()=>{
        wx.navigateBack()
      })
    })
  },
  edit(){
    wx.navigateTo({
      url: '../createPart/createPart?type=edit&code='+this.data.code,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      code: options.code
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
    this.getDetail()
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

  }
})