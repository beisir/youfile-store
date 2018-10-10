const app = getApp();
import Api from '../../../utils/api.js'
var x, y, x1, y1, x2, y2, index, currindex, n, yy;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    pics: [],
    isShow: true,
    mainx: 0,
    newConst:'',
    pageall: [],
    allTotalNew: '',
    pageShow: true,
    currentTab: 0,
    hiddenSelt: false,
    hiddenSend: true,
    clickSpecShow: false,
    stock: '4',
    strName: '',
    skuListAll: [],
    skuNum: 0,
    brand: '',
    name: '',
    code:'',
    recommendDesc: '',
    description: '',
    categoryCustomCode: '',
    categoryCode: '',
    marketPrice: 100,
    introduction: '',
    sellPrice: '',
    stockNum:0,
    baseUrl: app.globalData.imageUrl,
    wholesalePrice: '',
    goodsId:'',
    addGoodsDetails: [{ input: true, value: '' }, { textInput: true, value: '' }],
    mainImgUrl: "",
  },
  // 输入描述内容
  addTitle: function () {
    var _this = this,
      data = this.data.addGoodsDetails
    data.push({ input: true, value: '' })
    _this.setData({
      addGoodsDetails: data
    })
  },
  watchInput: function (e) {
    var value = e.detail.value,
      index = e.target.dataset.index,
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
  addCont: function () {
    var _this = this,
      data = this.data.addGoodsDetails
    data.push({ textInput: true, value: '' })
    _this.setData({
      addGoodsDetails: data
    })
  },
  watchName: function (event) {
    var _this = this,
      val = event.detail.value
    this.setData({
      name: val
    })
  },
  watchRec: function (event) {
    var _this = this,
      val = event.detail.value
    this.setData({
      recommendDesc: val
    })
  },
  watchDec: function (event) {
    var _this = this,
      val = event.detail.value
    this.setData({
      description: val
    })
  },
  addImage: function () {
    var _this = this
    Api.uploadImage("GOODS")
      .then(res => {
        var data = this.data.addGoodsDetails
        var url = JSON.parse(res).obj
        data.push({ img: this.data.baseUrl + url })
        _this.setData({
          addGoodsDetails: data
        })
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
  stockNum: function (event) {
    var _this = this,
      val = event.detail.value
    this.setData({
      stockNum: val
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  getClassList: function (customCategoryCode){
    var _this=this
    Api.adminShopCate()
      .then(res => {
        var obj = res.obj
        for(var i=0;i<obj.length;i++){
          if (obj[i].customCategoryCode == customCategoryCode){
            _this.setData({
              strName: obj[i].name
            })
          }
        }       
      })
  },
  getCodeList: function (parentCategoryCode){
    var _this=this
    app.http.getRequest('/admin/shop/category/sublist/{{parentCategoryCode}}', { parentCategoryCode: parentCategoryCode})
      .then(res => {
        var data = res.obj[0]
        _this.setData({
          code: data.name
        })       
      })
  },

  getDetails: function (goodsId){
    var _this=this
    Api.adminGetDetails({ goodsId: goodsId})
      .then(res => {
        var obj = res.obj,
            arrs=[],
          skuTotal = this.data.skuNum,
          skuNum = obj.goodsSkuVOList,
          objImg = obj.goodsImageVOList
        console.log(obj)
        for (var i = 0; i <objImg.length;i++){
          arrs.push(objImg[i].imageUrl)
        }
        for (var i = 0; i < skuNum.length;i++){
          skuTotal = skuTotal + skuNum[i].stockNum
        }
        _this.getClassList(obj.customCategoryCode)
        _this.getCodeList(obj.categoryCode)
        var modelData = JSON.stringify(obj.goodsSpecificationVOList)
        if (obj.goodsSkuVOList.length>0){
         _this.setData({
           clickSpecShow: true
         })
        }
        console.log(obj.description.match(/<h4>([\s\S]*?)<\/h4>/)[1])
        console.log(obj.description.match(/<p>([\s\S]*?)<\/p>/)[1])
        console.log(obj.description.match(/src=[\'\"]?([^\'\"]*)[\'\"]?/i))
        return
        var str = obj.description
        //匹配图片（g表示匹配所有结果i表示区分大小写）
        var  imgReg = /<img.*?(?:>|\/>)/gi;
        var  srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i;
        
        var arr = str.match(imgReg);
        for (var i = 0; i < arr.length; i++) {
           var src = arr[i].match(srcReg);
           if (src[1]) {
             console.log(src[1]);
           }
        }
        _this.setData({
          pics: arrs,
          name: obj.name,
          mainImgUrl: obj.mainImgUrl,
          recommendDesc: obj.recommendDesc,
          pageall: obj.goodsSpecificationVOList,
          sellPrice: obj.sellPrice,
          stockNum: obj.stockNum,
          model: modelData,
          storeId: obj.storeId,
          storeName: obj.storeName,
          wholesalePrice: obj.wholesalePrice,
          skuNum: skuTotal,
          newConst: skuTotal,
          skuListAll: obj.goodsSkuVOList,
          description: obj.description,
          categoryCode: obj.categoryCode,
          categoryCustomCode: obj.customCategoryCode
        })
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
  getConfig: function () {
    var _this = this
    Api.saleBatch()
      .then(res => {
        var obj = res.obj
        _this.setData({
          stock: obj.saleBatchNum == null ? 0 : obj.saleBatchNum
        })
      })
  },
  onLoad: function (options) {
    this.getConfig()
    this.setData({
      goodsId:"180929210000"
    })
    this.getDetails("180929210000")
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
  clearInput: function (e) {
    this.setData({
      stock: ''
    })
  },
  newConst: function (event) {
    var _this = this,
      val = event.detail.value,
      pageall = this.data.pageall,
      len = 1
    for (var i = 0; i < pageall.length; i++) {
      var data = pageall[i].goodsSpecificationValueVOList.length
      len = data * data
    }
    this.setData({
      newConst: val,
      allTotalNew: len * val
    })
  },
  // 分别设置价格和库存
  clickSpec: function (e) {
    var model = JSON.stringify(this.data.pageall),
        skuListAll=this.data.skuListAll,
      sellPrice = this.data.sellPrice,
      newConst = this.data.newConst,
      wholesalePrice = this.data.wholesalePrice
    if (skuListAll.length>0){
     var  modeList = JSON.stringify(this.data.skuListAll)
      wx.navigateTo({
        url: '../set/set?model=' + model + '&modeList=' + modeList
      })
    }else{
      wx.navigateTo({
        url: '../set/set?model=' + model + "&sellPrice=" + sellPrice + "&wholesalePrice=" + wholesalePrice + "&newConst=" + newConst,
      })
    }
    
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
    var arr1 = this.data.pics
    if (y2 != 0) {
      var left = e.currentTarget.offsetLeft
      var top = e.currentTarget.offsetTop
      var windWidth = (wx.getSystemInfoSync().windowWidth - 15) / 4
      var leftIndex = (left / windWidth).toFixed()
      var num = parseInt((top / windWidth).toFixed()) + 1
      var newImg = arr1[currindex - 1]
      arr1.splice(currindex - 1, 1);
      if (num == 1) {
        arr1.splice(leftIndex, 0, newImg);
      } else if (num == 2) {
        arr1.splice(leftIndex + 4, 0, newImg);
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
      uploadImg: true
    })
    var _this = this,
      pics = this.data.pics;
    var _this = this
    Api.uploadImage("GOODS")
      .then(res => {
        var url = JSON.parse(res).obj
        pics = pics.concat(url);
        if (pics.length > 6) {
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
  /**
 * 删除
 */
  deleteList(e) {
    const goodsId = this.data.goodsId,
      _this=this
    app.http.deleteRequest('/admin/shop/goods/{{goodsId}}', { goodsId: goodsId })
      .then(res => {
        wx.showToast({
          title: '删除成功',
          icon: 'none',
          duration: 2000
        })
        _this.goback()
      })

  },
  goback:function(){
    wx.navigateTo({
      url: '../status/status',
    })
  },
  // 更新
  updateGoods: function (e) {
    var _this=this,
      pics = this.data.pics,
      mainImgUrl = '',
      goodsImageVOList = []
    for (var i = 0; i < pics.length; i++) {
      if (i == 0) {
        mainImgUrl = pics[i]
      }
      goodsImageVOList.push({ imageUrl: pics[i] })
    } 
    console.log(this.data.skuListAll)
    var goodsVO = {
      "categoryCode": this.data.categoryCode,
      "customCategoryCode": this.data.customCategoryCode,
      "description": this.data.description,
      "goodsImageVOList": goodsImageVOList,
      "goodsSkuVOList": this.data.skuListAll,
      "goodsSpecificationVOList": this.data.pageall,
      "id": this.data.goodsId,
      "mainImgUrl": this.data.mainImgUrl,
      "marketPrice": 10,
      "name": this.data.name,
      "recommendDesc": this.data.recommendDesc,
      "saleBatchNum":10,
      "sellPrice": this.data.sellPrice,
      "status": "1",
      "stockNum": this.data.skuNum,
      "storeId": this.data.storeId,
      "storeName": this.data.storeName,
      "top": false,
      "wholesalePrice": this.data.wholesalePrice
    }
    console.log(goodsVO)
    Api.updateGoods(goodsVO)
      .then(res => {
    //   //   wx.showToast({
    //   //     title: '保存成功',
    //   //     icon: 'none',
    //   //     duration: 2000
    //   //   })
    //   //   _this.goback()
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
    var that = this
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1]
    if (currPage.data.code) {
      that.setData({
        categoryCode: currPage.data.code,
        codeName: currPage.data.codeName,
      })
    }
 
    if (currPage.data.codeList) {
      var codeList = currPage.data.codeList,
        strName = '',
        code = ''
      for (var i = 0; i < codeList.length; i++) {
        strName += codeList[i].name + ","
        code += codeList[i].customCategoryCode + ","
      }
      that.setData({
        categoryCustomCode: code.slice(0, -1),
        strName: strName.slice(0, -1)
      })
    }
    if (currPage.data.skuListAll != '') {
      that.setData({
        skuListAll: currPage.data.skuListAll,
        skuNum: currPage.data.skuNum,
        clickSpecShow: true
      })
    }

    if (currPage.data.mydata) {
      var modelData = JSON.stringify(currPage.data.mydata)
      that.setData({
        pageall: currPage.data.mydata,
        model: modelData,
        // skuListAll:[],
        skuNum:'',
        sellPrice:'',
        wholesalePrice:'',
        newConst:'',
        clickSpecShow: false,
        pageShow: false
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