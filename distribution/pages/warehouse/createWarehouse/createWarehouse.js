// distribution/pages/warehouse/createWarehouse/createWarehouse.js
import Api from '../../../../utils/api.js'
import { regTest } from '../../../../utils/util.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    formData: {}
  },
  submit() {
    let data = this.data.formData
    if(!data.name){
      Api.showToast("请填写仓库名称")
      return
    }
    if (data.phone && !regTest({ type: 'telephone', str: data.phone})){
      Api.showToast("请填写正确的联系电话")
      return
    }

    if (data.email && !regTest({ type: 'email', str: data.email })){
      Api.showToast("请填写正确的邮箱")
      return
    }

    if (this.data.showarea){
      let areaArr = this.data.showarea.split(',')
      data.province = areaArr[0]
      data.city = areaArr[1]
      data.county = areaArr[2]
    }
    Api.createWareHouse(data).then(res=> {

    })
  },
  watchinput(e){
    let type = e.currentTarget.dataset.type,
        obj = {},
        val = e.detail.value

    this.setData({
      ['formData.'+ type]: val
    })    
  },
  areachange(e){
    console.log(e.detail.value)
    this.setData({
      showarea: e.detail.value[0] + "," + e.detail.value[1] + "," + e.detail.value[2]
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