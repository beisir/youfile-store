// pages/poster/prePoster/prePoster.js
import Poster from '../../miniprogram_npm/wxa-plugin-canvas/poster/poster.js';
import API from '../../../../utils/api.js'
const App = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseUrl: App.globalData.imageUrl,
    titleModal: false,
    titleVal:'',
    desVal:'',
    sureTitleVal: '',
    sureDesVal:'',
    checkedImg:[],
    moduleList:[],
    posterConfig:{}
  },
  // 选图片去
  toChoseImg(){
    if(!this.data.goods){API.showToast("请先选择商品");return;}
    wx.navigateTo({
      url: '../choseGoodsimg/choseGoodsimg?goodsId=' + this.data.goodsId + '&checkedImg=' + JSON.stringify(this.data.checkedImg),
    })
  },
  saveImg(imgarr){
    if (imgarr.length===0){return}
    this.setData({ checkedImg: imgarr})
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
    if (!this.data.titleVal.trim()) {
      API.showToast("请输入商品标题")
      return
    }
    this.setData({sureTitleVal:this.data.titleVal})
    this.closeModal()
  },
  sureDes() {
    this.setData({ sureDesVal: this.data.desVal })
    this.closeModal()
  },
  // 滚动
  scrolling(e){
    // console.log(e.detail)
  },
  // 选模板
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
  },
  // 一键创建海报
  create_poster(){
    if (this.data.postering){return}
    if (!this.data.goods){
      API.showToast("请选择商品")
      return
    }
    let arr = this.data.moduleList.filter(el => el.checked)
    if(arr.length == 0){
      API.showToast("请选择模板")
      return
    }
    if(this.data.checkedImg.length == 0){
      API.showToast("该商品缺少商品主图，请先选择其他商品")
      return
    }
    if (!this.data.sureTitleVal.trim()){
      API.showToast("请输入商品标题")
      return
    }
    this.setData({ posterArr:false, postering: true})
    wx.showLoading({
      title: '海报生成中',
      mask: true
    })
    this.canvasPoset(this.data.checkedImg[0].imageUrl)
  },
  // 海报配置与生成
  canvasPoset(imgUrl){
    let arr = this.data.moduleList.filter(el => el.checked)
    this.setData({ templateId: arr[0].id})
    var obj = this.posterStrParse(arr[0].posterConfig, {
      imageUrl: this.data.baseUrl,
      goodsName: this.data.sureTitleVal ? this.data.sureTitleVal.trim():this.data.goods.name,
      goodsDes: this.data.sureDesVal ? this.data.sureDesVal:'',
      goodsImg: this.data.baseUrl + imgUrl,
      storeName: this.data.goods.storeName ? this.data.goods.storeName:'',
      qrcode: this.data.goods.miniProgramCode ? this.data.baseUrl + this.data.goods.miniProgramCode : '/image/login-store-icon.png'
    });
    this.setData({ posterConfig: obj }, () => {
      Poster.create(true);
    })
  },
  posterStrParse(str, obj) {
    if (obj.storeName.length > 7) {
      obj.fontSize = 76 - (obj.storeName.length - 7) * 8
    } else {
      obj.fontSize = 76
    }
    if (obj.fontSize < 24) {
      obj.fontSize = 24
    }
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

    let posterarr = this.data.posterArr
    if (posterarr){
      posterarr.push(detail)
    }else{
      posterarr = [detail]
    }
    this.setData({ posterArr: posterarr})
    
    if (this.data.checkedImg.length === posterarr.length){
      wx.hideLoading()
      wx.navigateTo({
        url: '../success/success?goodsId=' + this.data.goodsId + '&templateId=' + this.data.templateId +'&url=' + JSON.stringify(this.data.posterArr),
        success: () => {
          this.setData({ postering: false })
        }
      })
    }else{
      this.canvasPoset(this.data.checkedImg[posterarr.length].imageUrl)
    }
    
    this.setData({
      url: [detail]
    })
  },
  onPosterFail(e){
    console.log(e)
  },
  get_module(){
    API.posterModuleList({ type: 'goods_poster'}).then(res=> {
      this.setData({ moduleList:res.obj})
    })
  },
  // 选择商品
  choseGoods(goods){  
    this.setData({ goodsId: goods.id})
    this.setGoodsMsg(goods)
  },  
  // 获取商品详情
  getGoodsDetail(){
    API.adminGetDetails({ goodsId: this.data.goodsId }).then(res=> {
      this.setGoodsMsg(res.obj)
    })
  },
  setGoodsMsg(data){
    let nowgoods = data
    if (nowgoods.goodsImageVOList){
      var checkedImgArr = nowgoods.goodsImageVOList.filter(el=>el.checked)
      if (checkedImgArr.length == 0){
        checkedImgArr = [nowgoods.goodsImageVOList[0]]
      }
    }
    this.setData({
      goods: data,
      checkedImg: checkedImgArr,
      sureTitleVal: data.name,
      sureDesVal: data.recommendDesc ? data.recommendDesc : '',
      desVal: data.recommendDesc ? data.recommendDesc : '',
      titleVal: data.name
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.goodsId){
      this.setData({ goodsId: options.goodsId })
      this.getGoodsDetail()
    }
    this.get_module()
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