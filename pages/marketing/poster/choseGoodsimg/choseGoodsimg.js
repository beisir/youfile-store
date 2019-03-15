// pages/marketing/poster/choseGoodsimg/choseGoodsimg.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    img:[{},{},{},{},{},{},{},{}]
  },
  choseU(e){
    let thisindex = e.currentTarget.dataset.index;
    let arr = this.data.img.filter((el,index)=>{
      if(el.checked){
        el.index = index
        return el
      }
      return false
    });
    if(arr.length == 1 && arr[0].index == thisindex){return}
    this.setData({
      ['img[' + thisindex + '].checked']: !this.data.img[thisindex].checked
    })
  },
  choseImg(){
    let arr = this.data.img.filter(el=> el.checked);
    let pages = getCurrentPages();
    let prePage = pages[pages.length-2];
    if (prePage && prePage.saveImg){
      prePage.saveImg(arr)
    }
  },
  // 画海报辣
  create_poster(){

  },
  // 获取商品详情
  getGoodsDetail() {
    API.adminGetDetails({ goodsId: this.data.goodsId }).then(res => {
      this.setData({
        goods: res.obj,
        sureTitleVal: res.obj.name,
        sureDesVal: res.obj.recommendDesc
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ goodsId: options.goodsId,checkedarr:[]})
    this.getGoodsDetail()
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