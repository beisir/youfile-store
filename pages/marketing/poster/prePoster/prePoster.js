// pages/poster/prePoster/prePoster.js
import Poster from '../../miniprogram_npm/wxa-plugin-canvas/poster/poster.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    titleModal: false,
    titleVal:'',
    desVal:'',
    sureTitleVal: '',
    sureDesVal:'',
    checkedImg:[],
    moduleList:[{
      name:'案例',
      img:'/image/sRe.png'
    }, {
      name: '案例',
      img: '/image/sRe.png'
    }],
    posterConfig:{}
  },
  // 选图片去
  toChoseImg(){
    if(this.data.goods){}
    wx.navigateTo({
      url: '../choseGoodsimg/choseGoodsimg',
    })
  },
  saveImg(imgarr){
    console.log(imgarr)
  },
  showModal(e){
    let type = e.currentTarget.dataset.type,
        obj = {};
    
    switch(type){
      case 'title':
        obj.titleModal = true
      break;
      case 'des':
        obj.desModal = true
      break;
    }
    this.setData(obj)


  },
  closeModal(){
    this.setData({
      titleModal: false,
      desModal: false
    })
  },
  watchInput(e){
    let type = e.currentTarget.dataset.type,
        val = e.detail.value,
        obj = {};
    switch(type){
      case 'title':
        obj.titleVal = val
      break;
      case 'des':
        obj.desVal = val
      break;
    }
    this.setData(obj)
  },
  sureTitle(){
    this.setData({sureTitleVal:this.data.titleVal})
    this.closeModal()
  },
  sureDes() {
    this.setData({ sureDesVal: this.data.desVal })
    this.closeModal()
  },
  // 滚动
  scrolling(e){
    console.log(e.detail)
  },
  checkimg(e){
    let thisindex = e.currentTarget.dataset.index,
        arr = this.data.moduleList;
    arr.forEach((el, index)=> {
      if (index == thisindex){
        el.checked = true
      }else{
        el.checked = false
      }
    })
    this.setData({
      moduleList: arr
    })


    let bluestr = '{ "width": 750, "height": 1600, "debug": false, "init": true, "backgroundColor": "white",  "images": [{ "x": 0, "y": 0, "width": 750, "height": 426, "url": "/image/poster-blueback.png" },{ "x": 75, "y": 482, "height": 600, "width": 600, "url": "{{goodsImg}}", "zIndex": 1000 }, { "x": 338, "y": 1432, "height": 90, "width": 91, "url": "/image/poster-flower.png", "zIndex": 1000 }, { "x": 295, "y": 1524, "height": 25, "width": 25, "url": "/image/poster-logo.png", "zIndex": 1000 }, { "x": 336, "y": 1526, "height": 21, "width": 150, "url": "/image/poster-youlife.png", "zIndex": 1000 }, { "x": 560, "y": 1177, "height": 130, "width": 130, "url": "{{qrcode}}", "zIndex": 1000 }], "texts": [{ "x": 375, "y": 250, "text": "{{storeName}}", "fontSize": 76, "fontWeight": "bold", "fontFamily": "STSong", "color": "#76757f", "textAlign": "center", "zIndex": 1000 }, { "x": 56, "y": 1200, "text": "{{goodsName}}", "width": 470, "lineNum": 2, "fontSize": 27, "lineHeight": 40, "fontWeight": "bold", "fontFamily": "STSong", "color": "#333", "zIndex": 1000 }, { "x": 56, "y": 1287, "text": "{{goodsDes}}", "width": 470, "lineNum": 4, "fontSize": 27, "lineHeight": 36, "fontFamily": "STSong", "color": "#333", "zIndex": 1000 }, { "x": 563, "y": 1337, "text": "识别小程序码了解商品详情", "width": 120, "lineNum": 2, "fontSize": 20, "lineHeight": 30, "fontFamily": "STSong", "color": "#666", "zIndex": 1000 }], "lines": [] }'
    this.setData({ modulestr: bluestr })
  },
  create_poster(){
    var obj = this.posterStrParse(this.data.modulestr, {
      goodsName: "儿童装",
      goodsDes: 'yuejuan',
      goodsImg: '/image/poster-des.png',
      storeName: '童泰',
      qrcode: '/image/poster-des.png'
    });

    this.setData({ posterConfig: obj }, () => {
      Poster.create(true);
    })
  },
  posterStrParse(str, obj) {
    for (let key in obj) {
      let reg = new RegExp('{{' + key + '}}', "g");
      str = str.replace(reg, obj[key])
    }
    return JSON.parse(str)
  },
  onPosterSuccess(e) {
    const {
      detail
    } = e;
    console.log(detail)
    
    wx.navigateTo({
      url: '../success/success?url=' + encodeURI(detail) + '&url2=' + encodeURI(detail),
      success:()=>{

      }
    })


    this.setData({
      url: [detail]
    })
  },
  onPosterFail(e){
    console.log(e)
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