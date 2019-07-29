// distribution/pages/warehouse/warningSetting/warningSetting.js
import Api from '../../../../utils/api.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    formData:{
      warningLower: '',
      warningUpper: '',
      warehouseStatus: false,
      warningStatus: false
    }
  },
  watchinput(e){
    this.setData({
      ['formData.'+e.currentTarget.dataset.type+'']: e.detail.value
    })
  },
  switchChange(e){
    this.setData({
      ['formData.' + e.currentTarget.dataset.type + '']: e.detail.value
    })
  },
  getSetting(){
    Api.getWarningSetting().then(res=>{
      let data = res.obj
      this.setData({
        formData:{
          warningLower: data.warningLower,
          warningUpper: data.warningUpper,
          warehouseStatus: data.warehouseStatus==='on'? true : false,
          warningStatus: data.warningStatus === 'on' ? true : false
        }
      })
    })
  },
  updateSet(){
    let formData = this.data.formData
    let obj = {
      warehouseStatus: formData.warehouseStatus?'on':'off'
    }
    if (formData.warningStatus){
      obj.warningStatus = 'on'
      if (formData.warningLower !== '' && formData.warningUpper!=''){
        if (parseInt(formData.warningLower) > parseInt(formData.warningUpper)){
          Api.showToast('下限应低于上限')
          return 
        }
        obj.warningLower = formData.warningLower
        obj.warningUpper = formData.warningUpper
      }else {
        Api.showToast('请填写库存预警上下限')
        return 
      }
    } else {
      obj.warningStatus = 'off'
    }
    Api.updateWarningSetting(obj).then(res=>{
      Api.showToast(res.message, () => {
        wx.navigateBack()
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getSetting()
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