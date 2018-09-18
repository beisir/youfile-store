import Api from '../../../utils/api.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    watchInput: false,
    value:'',
    addSpec:false,
    storeId: wx.getStorageSync('storeId'),
    send:'',
    status:'',
    success: false,
    oneGreet: false,
    aginGreet: false,
    accept:'',
    logo:'',
    name:'',
    addShow:false,
    storeName:'',
    address:'',
    servicePhone:'',    
    floor:'',
    wechatNumber:'',
    businessScope:'',
    area:'',
    goodsList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  getMession: function (data,status) {
  var _this = this,
      url=''
    if (status == 1 || status == 0) {
      url ='/admin/bizfriend/store/applyinfo/{{storeId}}'
    }
    if(status == 0) {
      url = '/api/store/{{storeId}}/floorinfo'
    }
    if (status == 2){
      url ='/admin/bizfriend/store/merchantinfo/{{storeId}}'
    }
    if(status == 3) {
      url = '/admin/bizfriend/store/applyinfo/{{storeId}}'
    }
    Api.purchaserUserId(data,url)
    .then(res => {
      var obj = res.obj,
        store = obj.store[0],
        goodsList = store.goodsList,
        storeMes = store.store,
        floor = obj.floor,
        info=''
      console.log(obj)
      if (goodsList!=null){
        _this.setData({
          goodsList:goodsList
        })
      }
      if (floor!=null){
        info = floor.floorInfo
        _this.setData({
          area: info.area,
          floor: info.floor,
          mallName: info.mallName,
          balcony: info.balcony
        })
      }
      if (obj != null) {
        _this.setData({
          address: storeMes.address,
          servicePhone: storeMes.servicePhone,
          wechatNumber: storeMes.wechatNumber, 
          businessScope: storeMes.businessScope, 
        })
      }
    })
},
  onLoad: function (options) {
    var status = options.status,
        send=options.send,
        storeId = this.data.storeId,
        accept = options.accept,
        logo = options.logo,
        name=options.name,
        remark = options.remark
    this.setData({
      status:status,
      send:send,
      accept: accept,
      value: remark,
      name:name,
      logo:logo
    })
  this.getMession({ purchaserUserId: accept }, status)
  if(status==2){
    this.setData({
      success:true
    })
  } 
  if (status == 1){
    this.setData({
      aginGreet: true
    })
  }
  if (status == 3) {
    this.setData({
      oneGreet: true
    })
  } 
  if(status==0){
    this.setData({
      addShow:true
    })
  }
   
  },
  // 监听input
  watchInput: function (event) {
    if (event.detail.value == '') {
      this.setData({
        watchInput: false,
        value: '',
      })
    } else {
      this.setData({
        watchInput: true,
        value: event.detail.value,
      })
    }
  },
  setName:function(){
    if(this.data.value!=''){
      this.setData({
        watchInput: true,
      })
    }
    this.setData({
      addSpec: true,
    })
  },
  // 取消
  cancel: function () {
    this.setData({
      addSpec: false
    })
  },
  confirm:function(){
    var _this=this,
      purchaserUserId = this.data.accept,
      remark = this.data.value
    this.cancel()
    if (this.data.status==2){
      Api.setName({remark: remark})
      .then(res=>{
        console.log(res)
        wx.showToast({
          title: '修改成功',
          icon: 'none',
          duration: 1000,
          mask: true
        })
      })
    }
  },
  invitation:function(){
    wx.navigateTo({
      url: '../invitation/invitation?accept=' + this.data.accept + "&remark=" + this.data.value+"&name="+this.data.name+"&logo="+this.data.logo+"&send="+this.data.send,
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  urlHome: function () {
    wx.switchTab({
      url: '../../page/home/home'
    })
  },
  passFunc:function(){
    var send = this.data.send,
      accept = this.data.accept,
      remark = this.data.value
    Api.acceptmerchant({ accept: accept, send: send, remark: remark })
      .then(res => {
        wx.showToast({
          title: '添加成功',
          icon: 'none',
          duration: 1000,
          mask: true
        })
        wx.navigateTo({
          url: '../mewWholesaler/mewWholesaler'
        })
      })
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