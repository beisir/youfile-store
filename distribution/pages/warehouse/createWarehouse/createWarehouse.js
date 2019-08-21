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
  delModal(){
    this.setData({closeModal: true})
  },
  close(){
    this.setData({ closeModal: false })
  },
  del(){
    Api.delWarehouse({code:this.data.code}).then(res=>{
      Api.showToast(res.message,()=>{
        wx.navigateBack({
          delta: 2
        })
      })
    })
    this.close()
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
    if (this.data.pageType === 'edit'){
      data.code = this.data.code
      Api.updateWarehouse(data).then(res=>{
        Api.showToast(res.message,()=>{
          wx.navigateBack()
        })
      })
    }else {
      Api.createWareHouse(data).then(res => {
        Api.showToast(res.message)
        setTimeout(() => {
          wx.navigateBack()
        }, 800)
      })
    }
    
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
  // 编辑获取详情数据回填
  getDeatail(){
    Api.getWarehouseMsg({code:this.data.code}).then(res=>{
      let obj = res.obj,
          formData = {}
      for(let key in obj){
        if(!obj[key]){
          obj[key] = ''
        }
      }
      formData.name = obj.name
      formData.no = obj.no
      formData.manager = obj.manager
      formData.phone = obj.phone
      formData.address = obj.address
      formData.email = obj.email
      formData.remark = obj.remark
      this.setData({
        formData
      })
      if (obj.province){
        this.setData({
          showarea: obj.province+","+obj.city+","+obj.county
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.type === 'edit'){
      wx.setNavigationBarTitle({
        title: '编辑仓库',
      })
      this.setData({
        pageType: 'edit',
        code: options.code
      })
      this.getDeatail()
    }else {
      wx.setNavigationBarTitle({
        title: '新建仓库',
      })
    }
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