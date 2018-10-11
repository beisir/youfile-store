const app = getApp();
var x, y, x1, y1, x2, y2, index, currindex, n, yy;
import Api from '../../../utils/api.js'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    pics: [],
    isShow: true,
    uploadImg:false,
    mainx: 0,
    newConst:'',
    pageall:[],
    pageShow:true,
    currentTab: 0,
    hiddenSelt: false,
    hiddenSend: true,
    clickSpecShow:false,
    stock:'',
    codeName:'',
    allTotalNew:'',
    strName:'',
    skuListAll:[],
    skuNum:'',
    brand:'',
    name: '',
    recommendDesc:'',
    description:'',
    categoryCustomCode:'',
    categoryCode:'',
    marketPrice:'10',
    introduction: '',
    sellPrice: '',
    wholesalePrice:'',
    baseUrl: app.globalData.imageUrl,
    goodsImageVOList: [],
    mainImgUrl:'',
    addGoodsDetails: []
  },
  // 输入描述内容
  addTitle:function(){
    var _this=this,
      data = this.data.addGoodsDetails
    data.push({ input: true,value: '' })
    _this.setData({
      addGoodsDetails:data
    })
  },
  watchInput:function(e){
    var value = e.detail.value,
      index=e.target.dataset.index,
      data = this.data.addGoodsDetails
    data[index].value = e.detail.value
    this.setData({
      addGoodsDetails: data
    })
  },
  watchDec: function (e) {
    var value = e.detail.value,
      index = e.target.dataset.index,
      data = this.data.addGoodsDetails
    data[index].value = e.detail.value
    this.setData({
      addGoodsDetails: data
    })
  },
  addCont:function(){
    var _this = this,
      data = this.data.addGoodsDetails
    data.push({ textInput: true, value: '' })
    _this.setData({
      addGoodsDetails: data
    })
  },
  addImage: function () {
    var _this = this
    Api.uploadImage("GOODS")
      .then(res => {
        console.log(res)
        var data = this.data.addGoodsDetails
        var url = JSON.parse(res).obj
        data.push({ img:_this.data.baseUrl+url})
        _this.setData({
          addGoodsDetails: data
        })
      })
  },
  newConst: function (event) {
    var _this = this,
      val = event.detail.value,
      pageall = this.data.pageall,
      index1 = 1,
      index2 = 1,
      len = 1
    console.log(pageall)
    for (var i = 0; i < pageall.length; i++) {
      var data = pageall[i].goodsSpecificationValueVOList.length
      if (i == 0) {
        index1 = pageall[i].goodsSpecificationValueVOList.length
      } else {
        index2 = pageall[i].goodsSpecificationValueVOList.length
      }
    }
    len = index1 * index2
    this.setData({
      newConst: val,
      allTotalNew: len * val
    })
  },
  watchName: function (event) {
    var _this = this,
      val = event.detail.value
    this.setData({
      name: val
    })
  },
  stockFun:function(e){
    var _this = this,
      val = e.detail.value
    this.setData({
      stock: val
    })
  },
  watchRec: function (event) {
    var _this = this,
      val = event.detail.value
    this.setData({
      recommendDesc: val
    })
  },

  wholesalePrice: function (event) {
    var _this = this,
      val = event.detail.value
    this.setData({
      wholesalePrice: val
    })
  },
  sellPrice: function (event) {
    var _this = this,
      val = event.detail.value
    this.setData({
      sellPrice: val
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  getConfig:function(){
    var _this=this
    Api.saleBatch()
    .then(res=>{
      var obj=res.obj
      _this.setData({
        stock: obj.saleBatchNum
      })
    })
  },
  onLoad: function (options) {
    this.getConfig()
  },
  // tab切换
  swichNav: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      var index = e.target.dataset.current
      if (index == 1) {
        that.setData({
          currentTab: e.target.dataset.current,
          hiddenSelt: true,
          hiddenSend: false
        })
      } else {
        that.setData({
          currentTab: e.target.dataset.current,
          hiddenSelt: false,
          hiddenSend: true
        })
      }

    }
  },
  // 清空起批量
  clearInput:function(e){
    this.setData({
      stock:''
    })
  },
  // 分别设置价格和库存
  clickSpec:function(e){
    var model = JSON.stringify(this.data.pageall);
    var sellPrice = this.data.sellPrice
    var newConst = this.data.newConst
    var wholesalePrice = this.data.wholesalePrice
    wx.navigateTo({
      url: '../set/set?model=' + model + "&sellPrice=" + sellPrice + "&wholesalePrice=" + wholesalePrice + "&newConst=" + newConst,
    })
  //  if(e.target.dataset.id=='000'){
  //    var model = JSON.stringify(this.data.skuListAll);
  //    wx.navigateTo({
  //      url: '../set/set?model=' + model,
  //    })
  //  }else{
  //    var model = JSON.stringify(this.data.pageall);
  //    console.log(model)
  //    wx.navigateTo({
  //      url: '../set/set?model=' + model,
  //    })
  //  }
   
  },
  //长按拖动图片
  movestart: function (e) {
    currindex = e.currentTarget.dataset.index;
    x = e.touches[0].clientX;
    y = e.touches[0].clientY;
    x1 = e.currentTarget.offsetLeft;
    y1 = e.currentTarget.offsetTop;
  },
  move: function (e) {
    yy = e.currentTarget.offsetTop;
    x2 = e.touches[0].clientX - x + x1;
    y2 = e.touches[0].clientY - y + y1;
    this.setData({
      mainx: currindex,
      opacity: 0.7,
      start: { x: x2, y: y2 }
    })
  },
  moveend: function (e) {
    var arr1=this.data.pics
    if (y2 != 0) {
      var left = e.currentTarget.offsetLeft
      var top = e.currentTarget.offsetTop
      var windWidth = (wx.getSystemInfoSync().windowWidth-15)/4
      var leftIndex = (left / windWidth).toFixed()
      var num = parseInt((top / windWidth).toFixed()) + 1
      var newImg = arr1[currindex - 1]
      arr1.splice(currindex - 1, 1);
      if(num==1){
        arr1.splice(leftIndex, 0, newImg);
      } else if (num == 2){
        arr1.splice(leftIndex+4, 0, newImg);
      }
      this.setData({
        mainx: "",
        pics: arr1,
        opacity: 1
      })
    }
  },
  // 图片上传
  chooseImage: function () {
    this.setData({
      uploadImg:true
    })
    var _this = this,
      pics = this.data.pics;
    var _this = this
    Api.uploadImage("GOODS")
      .then(res => {
        var url = JSON.parse(res).obj
        pics = pics.concat(_this.data.baseUrl+url);
        if (pics.length >6) {
          wx.showToast({
            title: '最多上传6张',
            icon: 'none',
            duration: 2000
          })
        } else {
          _this.setData({
            pics: pics
          })
        }
      })
  },
  // 图片预览
  previewImage: function (e) {
    var current = e.target.dataset.src
    wx.previewImage({
      current: current,
      urls: this.data.pics
    })
  },
  // 放入仓库
  addGit:function(e){
    var status=e.target.dataset.status,
      pics = this.data.pics,
      mainImgUrl='',
      saleBatchNum=this.data.stock,
      goodsImageVOList=[],
      description='',
      addGoodsDetails = this.data.addGoodsDetails
    for (var i = 0; i < addGoodsDetails.length;i++){
      if (addGoodsDetails[i].input){
        description += '<h4>' + addGoodsDetails[i].value+'</h4>'
      } else if (addGoodsDetails[i].textInput){
        description += '<p>' + addGoodsDetails[i].value+'</p>'
      }else{
        description += '<img src="' + addGoodsDetails[i].img+'"/>'
      }
    }
    for (var i = 0; i < pics.length;i++){
      if(i==0){
        mainImgUrl = pics[i].replace(this.data.baseUrl, '')
      }
      goodsImageVOList.push({ imageUrl: pics[i].replace(this.data.baseUrl, '') })
    }
    var goodsVO =  {
      "categoryCode": this.data.categoryCode,
      "customCategoryCode": this.data.categoryCustomCode,
      "description": description,
      "goodsImageVOList":goodsImageVOList,
      "goodsSkuVOList": this.data.skuListAll,
      "goodsSpecificationVOList": this.data.pageall,
      "mainImgUrl": mainImgUrl,
      "marketPrice": this.data.marketPrice,
      "name": this.data.name,
      "recommendDesc": this.data.recommendDesc,
      "sellPrice": this.data.sellPrice,
      "status":status,
      "stockNum": this.data.skuNum,
      "saleBatchNum": saleBatchNum,
      "wholesalePrice": this.data.wholesalePrice
    }
    Api.addGoods(goodsVO)
      .then(res => {
        wx.showToast({
          title: '添加成功',
          icon: 'none',
          duration: 2000,
          success:function(){
            wx.navigateTo({
              url: '../success/success',
            })
          }
        })
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
    var that=this
    var pages=getCurrentPages();
    var currPage=pages[pages.length-1]
    if (currPage.data.code){
      that.setData({
        categoryCode: currPage.data.code,
        codeName: currPage.data.codeName,
      })
    }
    if (currPage.data.skuListAll!='') {
      that.setData({
        skuListAll: currPage.data.skuListAll,
        skuNum: currPage.data.skuNum,
        clickSpecShow:true
      })
    }
    if (currPage.data.codeList){
      var codeList = currPage.data.codeList,
          strName='',
          code=''
      for (var i = 0; i < codeList.length;i++){
        strName += codeList[i].name+","
        code += codeList[i].customCategoryCode+","
      }
      that.setData({
        categoryCustomCode: code.slice(0, -1),
        strName: strName.slice(0, -1)
      })
    }
    if(currPage.data.mydata){
      that.setData({
        pageall: currPage.data.mydata,
        pageShow:false
      })
    }
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