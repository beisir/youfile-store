// pages/page/poster/poster.js
import Poster from '../../../miniprogram_npm/wxa-plugin-canvas/poster/poster.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tipsModal: false,
    posterConfig: '',
  },
  showImg(){
    wx.previewImage({
      urls: this.data.url
    })
  },
  onPosterSuccess(e) {
    const {
      detail
    } = e;
    console.log(detail)
    // wx.previewImage({
    //   current: detail,
    //   urls: [detail]
    // })
    this.setData({
      url: [detail]
    })
  },
  save() {
    wx.saveImageToPhotosAlbum({
      filePath: this.data.url[0],
    })
    // Poster.create(); 
  },
  creatpink(){
    let str = '{ "width": 750, "height": 1600, "debug": false, "backgroundColor": "white", "blocks": [{ "x": 0, "y": 0, "width": 750, "height": 426, "backgroundColor": "#f2e8e7" }], "images": [{ "x": 256, "y": 0, "height": 157, "width": 237, "url": "/image/poster-headflower.png", "zIndex": 1000 }, { "x": 226, "y": 280, "height": 7, "width": 298, "url": "/image/poster-text.png", "zIndex": 1000 }, { "x": 307, "y": 307, "height": 33, "width": 138, "url": "/image/poster-new.png", "zIndex": 1000 }, { "x": 75, "y": 482, "height": 600, "width": 600, "url": "{{goodsImg}}", "zIndex": 1000 }, { "x": 338, "y": 1432, "height": 90, "width": 91, "url": "/image/poster-flower.png", "zIndex": 1000 }, { "x": 295, "y": 1524, "height": 25, "width": 25, "url": "/image/poster-logo.png", "zIndex": 1000 }, { "x": 336, "y": 1526, "height": 21, "width": 150, "url": "/image/poster-youlife.png", "zIndex": 1000 }, { "x": 560, "y": 1177, "height": 130, "width": 130, "url": "{{qrcode}}", "zIndex": 1000 }], "texts": [{ "x": 375, "y": 250, "text": "{{storeName}}", "fontSize": 76, "fontWeight": "bold", "fontFamily": "STSong", "color": "#76757f", "textAlign": "center", "zIndex": 1000 }, { "x": 56, "y": 1200, "text": "{{goodsName}}", "width": 470, "lineNum": 2, "fontSize": 27, "lineHeight": 40, "fontWeight": "bold", "fontFamily": "STSong", "color": "#333", "zIndex": 1000 }, { "x": 56, "y": 1287, "text": "{{goodsDes}}", "width": 470, "lineNum": 4, "fontSize": 27, "lineHeight": 36, "fontFamily": "STSong", "color": "#333", "zIndex": 1000 }, { "x": 563, "y": 1337, "text": "识别小程序码了解商品详情", "width": 120, "lineNum": 2, "fontSize": 20, "lineHeight": 30, "fontFamily": "STSong", "color": "#666", "zIndex": 1000 }], "lines": [] }'

    var obj = this.posterStrParse(str, {
      goodsName: "浅秋专柜同款女装针织连衣裙秋冬季新品羊毛圆领撞色优雅木耳边厚",
      goodsDes: '浅秋专同款女装针浅秋专柜同款女装针织连衣裙浅秋专柜同款女装针织连衣裙秋冬季新品羊毛圆领撞色优雅木耳边厚浅秋专柜同款女装',
      goodsImg: 'https://dev-image.youlife.me/goods/41050839-567f-4b74-8065-efe1c25ed0f0.jpg?x-oss-process=style/general',
      storeName: '深秋',
      qrcode: '/image/poster-qrcode.jpg'
    });

    this.setData({ posterConfig: obj },()=>{
      Poster.create(true); 
    })

  },
  creatblue(){
    let bluestr = '{ "width": 750, "height": 1600, "debug": false, "init": true, "backgroundColor": "white",  "images": [{ "x": 0, "y": 0, "width": 750, "height": 426, "url": "/image/poster-blueback.png" },{ "x": 75, "y": 482, "height": 600, "width": 600, "url": "{{goodsImg}}", "zIndex": 1000 }, { "x": 338, "y": 1432, "height": 90, "width": 91, "url": "/image/poster-flower.png", "zIndex": 1000 }, { "x": 295, "y": 1524, "height": 25, "width": 25, "url": "/image/poster-logo.png", "zIndex": 1000 }, { "x": 336, "y": 1526, "height": 21, "width": 150, "url": "/image/poster-youlife.png", "zIndex": 1000 }, { "x": 560, "y": 1177, "height": 130, "width": 130, "url": "{{qrcode}}", "zIndex": 1000 }], "texts": [{ "x": 375, "y": 250, "text": "{{storeName}}", "fontSize": 76, "fontWeight": "bold", "fontFamily": "STSong", "color": "#76757f", "textAlign": "center", "zIndex": 1000 }, { "x": 56, "y": 1200, "text": "{{goodsName}}", "width": 470, "lineNum": 2, "fontSize": 27, "lineHeight": 40, "fontWeight": "bold", "fontFamily": "STSong", "color": "#333", "zIndex": 1000 }, { "x": 56, "y": 1287, "text": "{{goodsDes}}", "width": 470, "lineNum": 4, "fontSize": 27, "lineHeight": 36, "fontFamily": "STSong", "color": "#333", "zIndex": 1000 }, { "x": 563, "y": 1337, "text": "识别小程序码了解商品详情", "width": 120, "lineNum": 2, "fontSize": 20, "lineHeight": 30, "fontFamily": "STSong", "color": "#666", "zIndex": 1000 }], "lines": [] }'

    var obj = this.posterStrParse(bluestr, {
      goodsName: "儿童装",
      goodsDes: 'yuejuan',
      goodsImg: 'https://dev-image.youlife.me/goods/41050839-567f-4b74-8065-efe1c25ed0f0.jpg?x-oss-process=style/general',
      storeName: '童泰',
      qrcode: '/image/poster-qrcode.jpg'
    });

    this.setData({ posterConfig: obj }, () => {
      Poster.create(true);
    })
  },


  close() {
    this.setData({
      tipsModal: !this.data.tipsModal
    })
  },
  watchInput(e) {
    let type = e.currentTarget.dataset.type,
      val = e.detail.value,
      obj = {};
    switch (type) {
      case "tip":
        obj.tip = val;
        break;
    }
    this.setData(obj)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      posterConfig : {}
    })
    
  },
  posterStrParse(str,obj){
    for (let key in obj){
      let reg = new RegExp('{{' + key + '}}', "g");
      str = str.replace(reg, obj[key])
    }
    return JSON.parse(str)
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})