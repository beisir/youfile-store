// pages/role/changeOrderAdd/changeOrderAdd.js
import Api from '../../../utils/api.js'
import { regTest} from '../../../utils/util.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    region:[]
  },
  watchInput(e){
    let val = e.detail.value,
        obj = {},
        type = e.currentTarget.dataset.type;    
    switch(type){
      case 'name':
        obj.name = val
      break;
      case 'tel':
        obj.tel = val      
      break
      case 'address':
        obj.address = val
      break;
    }

    this.setData(obj)
  },
  cleearInput(){
    this.setData({
      address: ''
    })
  },
  save(){
    let name = this.data.name,
        tel = this.data.tel,
        area = this.data.region,
        address = this.data.address
    if (!name) { Api.showToast("请填写收货人");return}
    console.log(regTest({ type: 'telephone', str: tel }))
    if(!regTest({ type: 'telephone', str: tel})){
      Api.showToast("请填写正确手机联系方式")
      return 
    }
    if (!address) { Api.showToast("请填写详细地址"); return }
    Api.editConsignee({
      orderNumber: this.data.num,
      userName: name,
      userPhone: tel,
      detailAddress: address,
      province: this.data.region[0],
      city: this.data.region[1],
      county: this.data.region[2]
    }).then(res=>{
      Api.showToast(res.message)
      setTimeout(()=>{
        wx.navigateBack()
      },800)
    })
  },
  bindRegionChange(e){
    this.setData({
      region: e.detail.value
    })
  },
  getData(){
    Api.adminGetOrderDetail({ orderNumber: this.data.num}).then(res=>{
      let msg = res.obj.consigneeInfo
      this.setData({
        name: msg.userName ? msg.userName:'',
        tel: msg.userPhone ? msg.userPhone:'',
        address: msg.detailAddress ? msg.detailAddress:'',
        region: [msg.province, msg.city, msg.county]
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      num: options.num
    },()=>{
      this.getData()
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})