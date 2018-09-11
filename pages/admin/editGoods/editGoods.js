const app = getApp();
var x, y, x1, y1, x2, y2, index, currindex, n, yy;
// var util = require('../../../utils/util.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    pics: [],
    isShow: true,
    mainx: 0,
    pageall: [],
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
    wholesalePrice: '',
    goodsId:'',
    mainImgUrl: "http://img2.imgtn.bdimg.com/it/u=1758226492,603315287&fm=214&gp=0.jpg",
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
    app.http.getRequest('/admin/shop/customcategory/store/{{storeId}}', {})
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
    app.http.getRequest('/admin/shop/goods/{{goodsId}}', { goodsId: goodsId})
      .then(res => {
        var obj = res.obj,
            arrs=[],
          skuTotal = this.data.skuNum,
          skuNum = obj.goodsSkuVOList,
          objImg = obj.goodsImageVOList
        for (var i = 0; i <objImg.length;i++){
          arrs.push(objImg[i].imageUrl)
        }
        for (var i = 0; i < skuNum.length;i++){
          skuTotal = skuTotal + skuNum[i].stockNum
        }
        _this.getClassList(obj.customCategoryCode)
        _this.getCodeList(obj.categoryCode)
        _this.setData({
          pics: arrs,
          name: obj.name,
          recommendDesc: obj.recommendDesc,
          pageall: obj.goodsSpecificationVOList,
          sellPrice: obj.sellPrice,
          stockNum: obj.stockNum,
          wholesalePrice: obj.wholesalePrice,
          skuNum: skuTotal,
          skuListAll: obj.goodsSkuVOList,
          description: obj.introduction,
          categoryCode: obj.categoryCode,
          categoryCustomCode: obj.customCategoryCode
        })
      })
  },
  onLoad: function (options) {
    this.setData({
      goodsId:"180831183155243d4de6"
    })
    this.getDetails("180831183155243d4de6")
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
  // 分别设置价格和库存
  clickSpec: function (e) {
    var model = JSON.stringify(this.data.pageall),
      modeList = JSON.stringify(this.data.skuListAll)
    wx.navigateTo({
      url: '../set/set?model=' + model + '&modeList=' + modeList,
    })
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
    var _this = this,
      pics = this.data.pics;
    wx.chooseImage({
      count: 9 - pics.length, // 最多可以选择的图片张数，默认9
      sizeType: ['compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function (res) {
        // success
        var imgSrc = res.tempFilePaths;
        pics = pics.concat(imgSrc);
        // 控制触发添加图片的最多时隐藏
        if (pics.length >= 9) {
          _this.setData({
            isShow: (!_this.data.isShow)
          })
        } else {
          _this.setData({
            isShow: (_this.data.isShow)
          })
        }
        _this.setData({
          pics: pics
        })
        // var tempFilePaths = res.tempFilePaths
        // wx.uploadFile({
        //   url: 'http://example.weixin.qq.com/upload', //仅为示例，非真实的接口地址
        //   filePath: tempFilePaths[0],
        //   name: 'file',
        // header: {
        //   "Content-Type": "multipart/form-data"
        // }
        //   formData: {
        //     'user': 'test'
        //   },
        //   success: function (res) {
        //     var data = res.data
        //     //do something
        //   }
        // })
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
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
  // 放入仓库
  addGit: function (e) {
    var status = e.target.dataset.status,
        _this=this
    var goodsVO = {
      "categoryCode": this.data.categoryCode,
      "categoryCustomCode": this.data.categoryCustomCode,
      "description": this.data.description,
      "goodsImageVOList": this.data.pics,
      "goodsSkuVOList": this.data.skuListAll,
      "goodsSpecificationVOList": this.data.pageall,
      "mainImgUrl": this.data.mainImgUrl,
      "marketPrice": this.data.marketPrice,
      "name": this.data.name,
      "recommendDesc": this.data.recommendDesc,
      "sellPrice": this.data.sellPrice,
      "status": status,
      "wholesalePrice": this.data.wholesalePrice
    }
    app.http.postRequest('/admin/shop/goods/',goodsVO)
      .then(res => {
        wx.showToast({
          title: '保存成功',
          icon: 'none',
          duration: 2000
        })
        _this.goback()
      })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log(this.data.skuListAll)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1]
    if (currPage.data.skuListAll != '') {
      that.setData({
        skuListAll: currPage.data.skuListAll,
        skuNum: currPage.data.skuNum,
        clickSpecShow: true
      })
    }
    if (currPage.data.codeList) {
      var codeList = currPage.data.codeList,
        strName = this.data.strName,
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
    if (currPage.data.mydata) {
      that.setData({
        pageall: currPage.data.mydata,
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