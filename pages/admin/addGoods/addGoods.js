const app = getApp();
var x, y, x1, y1, x2, y2, index, currindex, n, yy;
import Api from '../../../utils/api.js'
import util from '../../../utils/util.js'
import { saveFormID } from '../../../utils/modelMsg.js'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    pics: [],
    show1: false,
    isAllImg: false,
    skuNumTrue: false,
    isShow: true,
    uploadImg: false,
    switchChange:false,
    mainx: 0,
    newConst: '',
    isEmptySku: false,
    skuListData: [],//商品规格
    stockHide: false,
    pageShow: true,
    currentTab: 0,
    hiddenSelt: false,
    hiddenSend: true,
    clickSpecShow: false,
    stock: 0,
    codeName: '',
    allTotalNew: '',
    strName: '',
    goodsSkuVOList: [],
    skuNum: '',
    brand: '',
    name: '',
    recommendDesc: '',
    description: '',
    categoryCustomCode: '',
    categoryCode: '',
    showTale:false,
    marketPrice: '10',
    introduction: '',
    sellPrice: '',
    wholesalePrice: '',
    baseUrl: app.globalData.imageUrl,
    goodsImageVOList: [],
    mainImgUrl: '',
    addGoodsDetails: [],
    show: false,
    reImgIndex: 0,
    moveImgShow: true,
    addGitShow: true,
    // 视频
    videoUrl: false,
    // 分区
    zoneList: [],
    // 货号 备注
    remark: '',
    serialNumber:''
  },
  // 埋点存储formid
  getFormId(e) {
    saveFormID(e)
  },
  // 分区
  getZoneList(){
    Api.getZoneListAdmin().then(res=> {
      this.setData({
        zoneList: res.obj
      })
    })
  },
  selectZone(e){
    let num = e.currentTarget.dataset.num,
        arr = this.data.zoneList
    arr.forEach(el=>{
      if (el.zoneNumber == num){
        el.selected = !!!el.selected
      } else {
        el.selected = false
      }
    })
    this.setData({
      zoneList: arr
    })
  },
  // 上传视频
  // 展示图片视频底部菜单
  chooseImgOrVideo(){
    if (this.data.videoUrl){
      this.chooseImage()
    } else {
      if (this.data.pics.length >= 6) {
        app.http.chooseVedio({ upload: true, size: 10 }).then(res => {
          var url = res
          this.setData({ videoUrl: url }, () => {
            this.refreshCloseIcon()
          })
        })
      } else {
        wx.showActionSheet({
          itemList: ['视频', '图片'],
          success: (res) => {
            if (res.tapIndex === 0) {
              app.http.chooseVedio({ upload: true, size: 10 }).then(res => {
                var url = res
                this.setData({ videoUrl: url }, () => {
                  this.refreshCloseIcon()
                })
              }).catch(e => {
                // Api.showToast("上传失败")
              })
            } else {
              this.chooseImage()
            }
          }
        })
      }
    }
  },
  allScreen(){
    wx.createVideoContext('myVideo').requestFullScreen()
  },
  screenChange(e){
    if (e.detail.fullScreen === true){
      this.hideInput()
    } else {
      this.hideInput(true)
      wx.createVideoContext('myVideo').pause()
    }
  },
  removeVideo(){
    this.setData({
      videoUrl: false
    }, () => {
      this.refreshCloseIcon()
    })
  },
  refreshCloseIcon(){
    this.setData({
      moveImgShow: false
    }, () => {
      this.setData({
        moveImgShow: true
      })
    })
  },
  hideInput(show){
    if(show){
      this.setData({ showTale: false })
      return
    }
    this.setData({ showTale: true})
  },
  // 清空文本框
  clearText(e) {
    let type = e.currentTarget.dataset.type
    switch (type) {
      case 'title':
        this.setData({
          name: '',
          nameLen: 0
        })
        break;
      case 'des':
        this.setData({
          recommendDesc: '',
          recommendDescLen: 0
        })
        break;
    }
  },
  confirmMes:function(){
    this.setData({
      show1:false,
      showTale: false
    })
  },
  tipMes:function(){
    this.setData({
      show1:true,
      showTale: true
    })
  },
  // 删除商品图
  showRemoveImg: function(e) {
    var index = e.target.dataset.index
    this.setData({
      show: true,
      reImgIndex: index,
      showTale:true
    })
  },
  removeImg: function() {
    var index = this.data.reImgIndex,
      pics = this.data.pics
    pics.splice(index, 1)
    this.setData({
      showTale: false,
      show: false,
      pics
    })
  },
  // 删除详情信息
  removeImage: function(e) {
    var index = e.target.dataset.index
    this.changeData(index)
  },
  changeData: function(index) {
    var data = this.data.addGoodsDetails
    data.splice(index, 1)
    this.setData({
      addGoodsDetails: data
    })
  },
  // 下移
  upData: function(e) {
    var addGoodsDetails = this.data.addGoodsDetails,
      index = e.target.dataset.index,
      newObj = ''
    if (index == addGoodsDetails.length - 1) {
      return
    }
    newObj = addGoodsDetails[index]
    addGoodsDetails.splice(index, 1)
    addGoodsDetails.splice(index + 1, 0, newObj)
    this.setData({
      addGoodsDetails: addGoodsDetails
    })
  },
  topData: function(e) {
    var addGoodsDetails = this.data.addGoodsDetails,
      index = e.target.dataset.index,
      newObj = ''
    if (index == 0) {
      return
    }
    newObj = addGoodsDetails[index]
    addGoodsDetails.splice(index, 1)
    addGoodsDetails.splice(index - 1, 0, newObj)
    this.setData({
      addGoodsDetails: addGoodsDetails
    })
  },
  insertData: function(e) {
    var index = e.target.dataset.index
    this.insertImg(parseInt(index)+1)
  },
  // 输入描述内容
  addTitle: function() {
    var _this = this,
      data = this.data.addGoodsDetails
    data.push({
      input: true,
      value: ''
    })
    _this.setData({
      addGoodsDetails: data
    })
  },
  watchInput: function(e) {
    var value = e.detail.value,
      index = e.target.dataset.index,
      data = this.data.addGoodsDetails
    data[index].value = e.detail.value
    this.setData({
      addGoodsDetails: data
    })
  },
  watchDec: function(e) {
    var value = e.detail.value,
      index = e.target.dataset.index,
      data = this.data.addGoodsDetails
    data[index].value = e.detail.value
    this.setData({
      addGoodsDetails: data
    })
  },
  addCont: function() {
    var _this = this,
      data = this.data.addGoodsDetails
    data.push({
      textInput: true,
      value: ''
    })
    _this.setData({
      addGoodsDetails: data
    })
  },
  addImage: function() {
    this.insertImg()
  },
  insertImg: function(index) {
    let imageUrl = this.data.baseUrl
    Api.uploadImage({
      type: "GOODS",
      count: 9
    })
      .then(res => {
        var addGoodsDetails = this.data.addGoodsDetails
        if (index) {
          res.forEach(el=>{
            addGoodsDetails.splice(index, 0, { "img": imageUrl +el})
            index++
          })
        } else {
          res.forEach(el => {
            addGoodsDetails.push({ "img": imageUrl +el })
          })
        }
        this.setData({
          addGoodsDetails: addGoodsDetails
        })
      })
  },
  watchName: function(event) {
    var _this = this,
      val = event.detail.value,
      num = val.length
    if (num > 56) {
      Api.showToast("超过最长数字限制")
    }
    this.setData({
      name: val.substring(0, 55),
      nameLen: (val.substring(0, 55)).length
    })
  },
  // 起批量
  wholesaleSwitch(e){
    this.setData({
      wholesaleSwitch: e.detail.value
    })
  },
  stockFun: function(e) {
    var _this = this,
      val = e.detail.value
    if (val > 0) {
      this.setData({
        stock: val
      })
    } else {
      this.setData({
        stock: ''
      })
      Api.showToast("请输入大于0的有效值！")
    }
  },
  watchRec: function(event) {
    var _this = this,
      val = event.detail.value,
      num = val.length
    if (num > 61) {
      Api.showToast("超过最长数字限制")
    }
    this.setData({
      recommendDesc: val.substring(0, 60),
      recommendDescLen: (val.substring(0, 60)).length
    })
  },
  // 备注 货号
  watchRemark(e){
    this.setData({
      remark: e.detail.value
    })
  },
  watchGoodsCode(e){
    this.setData({
      serialNumber: e.detail.value
    })
  },
  // 库存
  stockNum: function (event){
    var _this = this,
      val = event.detail.value,
      num = val.length
    if (num == 2 && val.charAt(0) == '0') {
      if (val != "0.") {
        this.setData({
          stockNum: 0
        })
        return
      }
    }
    this.setData({
      stockNum: event.detail.value
    })
  },
  sellPrice: function(event) {
    var _this = this,
      val = event.detail.value,
      num = val.length
    if (num == 2 && val.charAt(0) == '0') {
      if (val != "0.") {
        this.setData({
          sellPrice: 0
        })
        return
      }
    }
    if (num > 9) {
      Api.showToast("超过最长数字限制")
    }
    this.setData({
      sellPrice: (util.newVal(val)).substring(0, 8)
    })
  },
  wholesalePrice: function (event) {
    var _this = this,
      val = event.detail.value,
      num = val.length
    if (num == 2 && val.charAt(0) == '0') {
      if (val != "0.") {
        this.setData({
          wholesalePrice: 0
        })
        return
      }
    }
    if (num > 9) {
      Api.showToast("超过最长数字限制")
    }
    this.setData({
      wholesalePrice: (util.newVal(val)).substring(0, 8)
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  getConfig: function() {
    var _this = this
    Api.saleBatch()
      .then(res => {
        var obj = res.obj
        if (obj.saleBatchNum) {
          _this.setData({
            stock: obj.saleBatchNum
          })
        } else {
          _this.setData({
            stock: null,
            stockHide: true
          })
        }

      })
  },
  getClassCode() {
    let code = wx.getStorageSync('addGoodsClass')
    if (code) {
      Api.getGoodsAllClass({ threeCategoryCode: code }).then(res => {
        if (res.obj) {
          this.setData({
            codeName: res.obj.oneCategoryName + '>' + res.obj.twoCategoryName + '>' + res.obj.threeCategoryName,
            categoryCode: res.obj.threeCategoryCode
          })
        }
      })
    }
  },
  onLoad: function(options) {
    // this.getConfig() // 起批量设置
    this.getZoneList()
    if(options.entryType){
      this.setData({
        entryType: options.entryType
      })
    }
    // 返显商品分类
    this.getClassCode()
  },
  // tab切换
  swichNav: function(e) {
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
  clearInput: function(e) {
    this.setData({
      stock: ''
    })
  },

  //长按拖动图片
  movestart: function(e) {
    currindex = e.currentTarget.dataset.index;
    x = e.touches[0].clientX;
    y = e.touches[0].clientY;
    x1 = e.currentTarget.offsetLeft;
    y1 = e.currentTarget.offsetTop;
  },
  move: function(e) {
    yy = e.currentTarget.offsetTop;
    x2 = e.touches[0].clientX - x + x1;
    y2 = e.touches[0].clientY - y + y1;
    this.setData({
      mainx: currindex,
      opacity: 0.7,
      moveImgShow: false,
      start: {
        x: x2,
        y: y2
      }
    })
  },
  moveend: function(e) {
    var arr1 = this.data.pics
    if (y2 != 0) {
      var left = e.currentTarget.offsetLeft
      if (left < 0) {
        left = 0
      }
      var top = e.currentTarget.offsetTop
      var windWidth = (wx.getSystemInfoSync().windowWidth - 15) / 4
      var leftIndex = (left / windWidth).toFixed()
      var num = parseInt((top / windWidth).toFixed()) + 1
      var newImg = arr1[currindex - 1]
      arr1.splice(currindex - 1, 1);
      if (num == 1) {
        if(this.data.videoUrl){
          let nowindex = leftIndex == 0 ? 0 : leftIndex - 1;
          arr1.splice(nowindex, 0, newImg);
        }else{
          arr1.splice(leftIndex, 0, newImg);
        }
      } else if (num == 2) {
        if (this.data.videoUrl) {
          arr1.splice(parseInt(leftIndex) + 3, 0, newImg);
        } else {
          arr1.splice(parseInt(leftIndex) + 4, 0, newImg);
        }
      }
      this.setData({
        mainx: "",
        pics: arr1,
        moveImgShow: true,
        opacity: 1
      })
    }
  },
  // 图片上传
  chooseImage() {
    app.http.onlychoseImg().then(res => {
      let url = res.tempFilePaths[0];
      Api.toCuttingImg(url)
    })
  },
  afterCuttingImg(url) {
    this.setData({
      uploadImg: true
    })
    var _this = this,
      pics = this.data.pics;
    var _this = this
    app.http.uploadImgArr([url], "GOODS").then(res => {
      var url = res[0]
      if (url) {
        pics = pics.concat(_this.data.baseUrl + url);
        if (pics.length > 6) {
          wx.showToast({
            title: '最多上传6张',
            icon: 'none',
            duration: 2000
          })
        } else {
          _this.setData({
            pics: pics,
            isAllImg: false
          }, function() {
            if (pics.length == 6) {
              _this.setData({
                isAllImg: true
              })
            }
          })
        }
      }
    })
  },
  // 图片预览
  previewImage: function(e) {
    var current = e.target.dataset.src
    wx.previewImage({
      current: current,
      urls: this.data.pics
    })
  },
  // 设置隐私
  switchChange:function(e){
    this.setData({
      switchChange:e.detail.value
    })
  },
  sureLayer() {
    this.setData({ sureAddLayer: true, showTale: true })
  },
  closeLaye() {
    this.setData({ sureAddLayer: false, showTale: false })
  },
  // 放入仓库
  addGit: function(e) {
    this.closeLaye()
    var status = e.target.dataset.status,
      pics = this.data.pics,
      _this=this,
      mainImgUrl = '',
      newConst = this.data.newConst,
      saleBatchNum = this.data.stock ? this.data.stock:1,
      goodsImageVOList = [],
      description = '',
      skuList0 = [],
      skuList1 = [],
      sellPrice = this.data.sellPrice,
      // stockNum = this.data.stockNum,
      wholesalePrice = this.data.wholesalePrice,
      goodsSkuVOList = this.data.goodsSkuVOList,
      skuListData = this.data.skuListData,
      addGoodsDetails = this.data.addGoodsDetails

    // 起批量  默认为1  当等于0或为空 原逻辑是代表不参与批发。现逻辑不存在0 不设置起批量，商友购买都参与批发
    if (!this.data.wholesaleSwitch){
      saleBatchNum = 1
    }

    // 图片
    for (var i = 0; i < addGoodsDetails.length; i++) {
      if (addGoodsDetails[i].input) {
        if (Api.isNotEmpty(addGoodsDetails[i].value)) {
          description += '<h4>' + addGoodsDetails[i].value + '</h4>'
        }
      } else if (addGoodsDetails[i].textInput) {
        if (Api.isNotEmpty(addGoodsDetails[i].value)) {
          description += '<p>' + addGoodsDetails[i].value + '</p>'
        }
      } else {
        description += '<img src="' + addGoodsDetails[i].img + '"/>'
      }
    }
    for (var i = 0; i < pics.length; i++) {
      if (i == 0) {
        mainImgUrl = pics[i].replace(this.data.baseUrl, '')
      }
      goodsImageVOList.push({
        imageUrl: pics[i].replace(this.data.baseUrl, '')
      })
    }
    if (!Api.isNotEmpty(mainImgUrl)) {
      Api.showToast("请上传商品图片！")
      return;
    }
    //为空或全部为空格
    if ((this.data.name).match(/^[ ]*$/)) {
      Api.showToast("标题不能为空！")
      return;
    }
    if(this.data.name==''){
      Api.showToast("标题不能为空")
      return;
    }
    if (!Api.isNotEmpty(this.data.categoryCode)) {
      Api.showToast("请输入商品类目！")
      return;
    }
    if (wholesalePrice == 0 && Api.isNotEmpty(wholesalePrice)) {
      Api.showToast("批发价不得低于0")
      return;
    }
    if (!Api.isNotEmpty(wholesalePrice)) {
      Api.showToast("请填写批发价")
      return;
    }
    if (sellPrice == 0 && Api.isNotEmpty(sellPrice)) {
      Api.showToast("零售价不得低于0")
      return;
    }
    if (!Api.isNotEmpty(sellPrice)) {
      Api.showToast("请填写零售价")
      return;
    }
    // if (stockNum == 0 && Api.isNotEmpty(stockNum)) {
    //   Api.showToast("库存不得低于0")
    //   return;
    // }
    // if (!Api.isNotEmpty(stockNum)) {
    //   Api.showToast("请填写库存")
    //   return;
    // }
    // 分区
    let zoneNum = ''
    try{
      let zoneArr = this.data.zoneList.filter(el => el.selected)
      if (zoneArr.length > 0 && zoneArr[0]) {
        zoneNum = zoneArr[0].zoneNumber
      }
    }catch(e){}
    // 缓存商品分类下次进来返显
    wx.setStorage({
      key: "addGoodsClass",
      data: this.data.categoryCode
    })
    var goodsVO = {
      "categoryCode": this.data.categoryCode,
      "customCategoryCode": this.data.categoryCustomCode,
      "description": description,
      "goodsImageVOList": goodsImageVOList,
      "goodsSkuVOList": goodsSkuVOList,
      "goodsSpecificationVOList": skuListData,
      "mainImgUrl": mainImgUrl,
      "mainVideoUrl": this.data.videoUrl ? this.data.videoUrl : '',
      "marketPrice": this.data.marketPrice,
      "name": this.data.name,
      "recommendDesc": this.data.recommendDesc,
      "sellPrice": sellPrice,
      "status": status,
      "privacy":this.data.switchChange?1:0,
      // "stockNum": stockNum,
      "saleBatchNum": saleBatchNum,
      "wholesalePrice": wholesalePrice,
      "zoneNumber": zoneNum,
      "remark": this.data.remark,
      "serialNumber": this.data.serialNumber
    }
    this.setData({
      addGitShow: false
    }, function() {
      Api.addGoods(goodsVO)
        .then(res => {
          wx.showToast({
              title: '添加成功',
              icon: 'none',
              duration: 2000,
              success: function() {
                if (_this.data.entryType === 'createOrder'){
                  wx.navigateBack()
                }else{
                  wx.redirectTo({
                    url: '../success/success',
                  })
                }
              }
            })
        })
        .catch(res => {
          _this.setData({
            addGitShow: true
          })
        })
    })
    return

  },
  // 选择规格
  alertSpec:function(){
    var goodsSkuVOList = this.data.goodsSkuVOList,
      skuListData = this.data.skuListData
    goodsSkuVOList = JSON.stringify(goodsSkuVOList)
    skuListData = JSON.stringify(skuListData)
    wx.navigateTo({
      url: '../goodsSpec/goodsSpec?goodsSkuVOList=' + goodsSkuVOList + '&skuListData=' + skuListData
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1]
    // 类目
    if (currPage.data.code) {
      that.setData({
        categoryCode: currPage.data.code,
        codeName: currPage.data.codeName,
      })
    }
    // 本店分类
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
    // 规格
    if (currPage.data.goodsSkuVOList) {
      if (currPage.data.goodsSkuVOList.length==0){
        return
      }
      var goodsSkuVOList = currPage.data.goodsSkuVOList, 
        skuListData = currPage.data.skuListData,
        wholesalePrice='',
        sellPrice='',
        stockNum=0
      //获取最小价格和总库存
      sellPrice = Math.min.apply(Math, goodsSkuVOList.map(function (o) {
        return o.sellPrice
      }))
      for (var v of goodsSkuVOList) {
        if (v.sellPrice == sellPrice) {
          wholesalePrice = v.wholesalePrice
        }
        // stockNum += parseInt(v.stockNum)
      }
      that.setData({
        goodsSkuVOList: goodsSkuVOList,
        skuListData: skuListData,
        // stockNum: stockNum? stockNum:0,
        sellPrice: sellPrice == Infinity ? '' : sellPrice,
        wholesalePrice: wholesalePrice == Infinity ? '' : wholesalePrice
      })
    }
    
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

})