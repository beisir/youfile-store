const app = getApp();
import Api from '../../../utils/api.js'
var WxParse = require('../../../wxParse/wxParse.js');
function getIdentity(_this,goodsId) {
  if (Api.isEmpty(wx.getStorageSync("access_token"))) {
    Api.userIdentity()
      .then(res => {
        var obj = res.obj,
          isStoreOwner = obj.isStoreOwner,
          isPurchaser = obj.isPurchaser
        if (isStoreOwner) {
          wx.setStorage({
            key: 'admin',
            data: 2, //1yon 2店主  3批发商
          })
          _this.setData({
            limitShow: 2
          })
        }
        if (isPurchaser) {
          wx.setStorage({
            key: 'admin',
            data: 3,
          })
          wx.setTabBarItem({
            index: 1,
            text: '进货车',
            iconPath: '/image/22.png',
            selectedIconPath: '/image/21.png'
          })
          _this.setData({
            limitShow: 3,
          })
        }
        if (!isPurchaser && !isStoreOwner) {
          wx.setStorage({
            key: 'admin',
            data: 1,
          })
          _this.setData({
            limitShow: 1
          })
        }
        _this.getDetails(goodsId)
      })
  }else{
    _this.getDetails(goodsId)
  }
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    limitShow:1,
    storeId: wx.getStorageSync('storeId'),
    imgUrls: [],
    baseUrl: app.globalData.imageUrl,
    goodsSpecificationVOList:[],
    goodsSkuVOList:[],
    skuArrTwo: [],
    newSkuArrTwo:[],
    nameTwo:'',
    className:'active',
    indicatorDots: true,
    autoplay: true,
    interval: 2000,
    duration: 500,
    bg: '#C79C77',
    Height: "" ,
    hidden: true,
    numbers: 1,
    name:'',
    likeShow: false,
    wholesalePrice:'',
    recommendDesc:'',
    introduction:'',
    swichNavCode:true,
    swichNav:-1,
    changeButtonCode:true,
    mainImgUrl:'',
    wholesale: '',
    sell:'',
    stockNum:'',
    saleBatchNum:'',
    saleBatchAmount:'',
    totalPrice:'',
    goodsId:'',
    numAll:0,
    moreCode:'',
    nums:0,
    getSpecDetails:true,
    classNums:0,
    newTotal:0,
    showCart:true,
    showCartOne:true,
    discountShow:true,
    spectArrDifference:[],
    editCode:false,
    newCartList:[],
    editOneName:false,
    store:''
  },
  /**
  * 生命周期函数--监听页面加载
  */
  showLogo:function(){
    this.selectComponent("#login").showPage();
  },
  addTip: function () {
    var Id = this.data.store.storeId,
      logo =this.data.store.logo,
      name = this.data.store.storeName
    wx.navigateTo({
      url: '../../businessFriend/information/information?status=0&send=&accept=' + Id + '&remark=&logo='+logo + '&name=' + name,
    })
    // this.setData({
    //   show:true
    // })
  },
  onLoad: function (options) {
    if (options.storeId) {
      wx.setStorageSync("storeId", options.storeId)
    }
    var that = this,
        arr=[],
        goodsId=''
    if(options.query){
      goodsId = options.query.goodsId
      wx.setStorageSync("storeId", options.query.storeId)
    }else{
      goodsId = options.goodsId
    }
    that.setData({
      goodsId: goodsId
    })
    if (options.code){
      that.setData({
        editCode: true,
      })
      Api.cartList()
        .then(res => {
          var res = res.obj.effectiveList[0].goodsList
          for (var i = 0; i < res.length; i++) {
            if (res[i].goodsId == options.goodsId) {
              arr = res[i].shoppingCartSkuList
            }
          }
          if (options.name == "more") {
            that.setData({
              showCart: false,
            })
          }else{
            that.setData({
              showCartOne: false,
              editOneName: true
            })
          }
          that.setData({
            newCartList: arr,
          }, function () {
            getIdentity(this,goodsId)
          })
        })
    }else{
      getIdentity(this,goodsId)
    }
  },

  imgHeight: function (e) {
    var winWid = wx.getSystemInfoSync().windowWidth; //获取当前屏幕的宽度
    var imgh = e.detail.height;//图片高度
    var imgw = e.detail.width;//图片宽度
    var swiperH = winWid * imgh / imgw + "px"//等比设置swiper的高度。 即 屏幕宽度 / swiper高度 = 图片宽度 / 图片高度  ==》swiper高度 = 屏幕宽度 * 图片高度 / 图片宽度
    this.setData({
      Height: swiperH//设置高度
    })
  },
  cancel: function () {
    this.setData({
      hidden: true
    });
  },
  //选择规格
  showAlert:function(){
    var that = this;
    var animation = wx.createAnimation({
      duration: 300,
      timingFunction: 'linear'
    })
    that.animation = animation
    animation.translateY(300).step()
    that.setData({
      animationData: animation.export(),
      hidden: false
    })
    setTimeout(function () {
      animation.translateY(0).step()
      that.setData({
        animationData: animation.export()
      })
    }, 30)
  },
  goodsSku:function(code,index){
    var _this=this,
      dataList = _this.data.goodsSkuVOList
     for (var i = 0; i < dataList.length; i++) {
       if (dataList[i].specValueCodeList.indexOf(code) != -1) {
        if(index==0){
          if (dataList[i].specValueCodeList.indexOf(_this.data.swichNavCode) != -1) {
            _this.setData({
              wholesale: dataList[i].wholesalePrice,
              stockNum: dataList[i].stockNum,
              sell: dataList[i].sellPrice
            })
          }
        }else{
          if (dataList[i].specValueCodeList.indexOf(_this.data.changeButtonCode) != -1) {
            _this.setData({
              wholesale: dataList[i].wholesalePrice,
              stockNum: dataList[i].stockNum,
              sell: dataList[i].sellPrice
            })
          }
        }
       }
     }
   
  },
  getNewData: function (current, changeButtonCode){
    this.goodsSku(changeButtonCode, 0)
    var that = this;
    if (this.data.specsTab === current) {
      return false;
    } else {
      that.setData({
        specsTab: current,
        changeButtonCode: changeButtonCode
      })
    }
  },
  getNewData1:function(current, swichNavCode){
    this.goodsSku(swichNavCode, 1)
    var that = this;
    if (this.data.currentTab === current) {
      return false;
    } else {
      that.setData({
        currentTab: current,
        swichNavCode: swichNavCode
      })
    }
  },
  //选择规格属性
  changeButton: function (e) {
    var changeButtonCode =e.target.dataset.code,
      current = e.target.dataset.current
    this.getNewData(current,changeButtonCode)
  },
  weghtSwi: function (e) {
    var swichNavCode = e.target.dataset.code,
    current = e.target.dataset.current
    this.getNewData1(current, swichNavCode)
  },
  getSpecDetails:function(index,code){
    var that = this,
      swichNavCode = index,
      code = code,
      skuArrTwo = this.data.skuArrTwo,
      skuArr = this.data.goodsSkuVOList,
      skuValueVOList = [],
      newSkuArrTwo =[],
      codeName = this.data.goodsSpecificationVOList,
      newList = {}, 
      returnStop=false,
      spectArrDifference = this.data.spectArrDifference
    if (skuArrTwo.length == 1) {
      skuValueVOList = skuArrTwo[0].goodsSpecificationValueVOList
    }
    for (var i = 0; i < skuArr.length; i++) {
      var childArr = skuArr[i].specValueCodeList
      if (childArr.indexOf(code) != -1) {
        newSkuArrTwo.push(skuArr[i])
      }
    }
    for (var i = 0; i < newSkuArrTwo.length; i++) {
      for (var j = 0; j < skuValueVOList.length; j++) {
        if ((newSkuArrTwo[j].specValueCodeList).indexOf(skuValueVOList[j].specValueCode) != -1) {
          newSkuArrTwo[j].name = skuValueVOList[j].specValueName
          if (newSkuArrTwo[j].num==undefined){
            newSkuArrTwo[j].num = 0
          }
        }
      }
    }

    // 修改购物车
    if (that.data.editCode) {
      var arr=[]
      arr = this.data.newCartList
      for (var i = 0; i < arr.length; i++) {
        if (this.data.editOneName) {
          var newArr = codeName[0].goodsSpecificationValueVOList
          if (newArr.length > 0) {
            var newArrLast = codeName[1].goodsSpecificationValueVOList
            for (var l = 0; l < newArrLast.length; l++) {
              if (arr[i].specValueCodes.indexOf(newArrLast[l].specValueCode) != -1) {
                this.getNewData1(l,newArrLast[l].specValueCode)
              }
            }
          }
          for (var l = 0; l < newArr.length; l++) {
            if (arr[i].specValueCodes.indexOf(newArr[l].specValueCode) != -1) {
              newSkuArrTwo[i].num = arr[i].num
              this.getNewData(l, newArr[l].specValueCode)
              that.setData({
                numbers: arr[i].num
              })
            }
          }
          that.setData({
            goodsSpecificationVOList: codeName
          })
        }else{
          var skuCode = arr[i].skuCode
          for (var j = 0; j < newSkuArrTwo.length; j++) {
            if (newSkuArrTwo[j].skuCode == skuCode) {
              newSkuArrTwo[j].num = arr[i].num
            }
          }
        }
      }
    }
    if (spectArrDifference.length==0){
      spectArrDifference.push({ code: code, newSkuArrTwo: newSkuArrTwo })
    }else{
      for (var i = 0; i < spectArrDifference.length; i++) {
        if (code == spectArrDifference[i].code) {
          returnStop=true
        }
      }
      if (!returnStop) {
        spectArrDifference.push({ code: code, newSkuArrTwo: newSkuArrTwo })
      }
    }
    if (this.data.currentTab ===index) {
      return false;
    } else {
      that.setData({
        swichNav: swichNavCode,
        newSkuArrTwo: newSkuArrTwo,
        moreCode: code,
        spectArrDifference:spectArrDifference
      })
    }
    this.getTotalPrice();
  },
  swichNav: function (e) {
    var index = e.target.dataset.current,
      code = e.target.dataset.code
    this.getSpecDetails(index,code)
  },
  //关闭弹框
  closeAlert:function(){
    if(this.data.editCode){
      var index = this.data.currentTab
      var pages = getCurrentPages();             //  获取页面栈
      var currPage = pages[pages.length - 1];
      var prevPage = pages[pages.length - 2];    // 上一个页面
      prevPage.setData({
        mydata:0
      })
      wx.navigateBack({
        data: 1
      })
    }else{
      var that = this;
      var animation = wx.createAnimation({
        duration: 500,
        timingFunction: 'linear'
      })
      that.animation = animation
      animation.translateY(1000).step()
      that.setData({
        animationData: animation.export(),

      })
      setTimeout(function () {
        animation.translateY(0).step()
        that.setData({
          animationData: animation.export(),
          hidden: true

        })
      }, 300)
    }
    
  }, 
  urlHome:function(){
    wx.switchTab({
      url:'../home/home'
    })
  },
  urlCart:function(){
    wx.switchTab({
      url: '../cartList/cartList'
    })
  },
  cratHome: function (e) { 
    var _this=this,
      num = this.data.numbers,
      goodsId = this.data.goodsId,
      status = e.target.dataset.status,
      skuCode='',
      changeButtonCode = this.data.changeButtonCode,
      swichNavCode = this.data.swichNavCode,
      goodsSpecificationVOList = this.data.goodsSpecificationVOList,
      goodsSkuVOList = this.data.goodsSkuVOList
    for (var i = 0; i < goodsSkuVOList.length;i++){
      var  childArr = goodsSkuVOList[i].specValueCodeList
      if (childArr.indexOf(swichNavCode) != -1 && childArr.indexOf(changeButtonCode) != -1){
       skuCode=goodsSkuVOList[i].skuCode
      }
    }
   
    if(goodsSpecificationVOList.length>0){
      if (skuCode==''){
        wx.showToast({
          title: '请选择商品属性',
          icon: 'none',
          duration: 1000,
          mask: true
        })
        return
      }
    }else{
      skuCode=0
    }
    if (!Api.isEmpty(wx.getStorageSync("access_token"))){
      _this.showLogo()
      return
    }
    if (status==0){
      if (this.data.editOneName){
        var data=[]
        data.push({ goodsId: goodsId, num: num, skuCode: skuCode, storeId: this.data.storeId})
        Api.updateMoreCart(JSON.stringify(data))
          .then(res => {
            wx.showToast({
              title: '修改成功',
              icon: 'none',
              duration: 1000,
              mask: true
            })
            wx.switchTab({
              url: '../cartList/cartList'
            })
          })
      }else{
        Api.addCart({ goodsId: goodsId, num: num, skuCode: skuCode })
          .then(res => {
            wx.showToast({
              title: '添加成功',
              icon: 'none',
              duration: 1000,
              mask: true
            })
            wx.switchTab({
              url: '../cartList/cartList'
            })
          })
      }
    }else{
      var model = { goodsId: goodsId, num: num, skuCode: skuCode }
      wx.navigateTo({
        url: '../address/address?model=' + JSON.stringify(model),
      })
    }
   
  },
  // 批量添加购物车
  moreAddCart:function(e){
    var specFirst = this.data.goodsSpecificationVOList[0].goodsSpecificationValueVOList,
      moreCode = this.data.moreCode,
      goodsId = this.data.goodsId,
      spectArrDifference = this.data.spectArrDifference,
      goodsSpecificationVOList = this.data.goodsSpecificationVOList,
      newArr=[],
      newSkuArrTwo=[],
      status=e.target.dataset.status
    for (var j = 0; j < spectArrDifference.length; j++) {
      newSkuArrTwo = spectArrDifference[j].newSkuArrTwo
      for (var i = 0; i < newSkuArrTwo.length; i++) {
        if (newSkuArrTwo[i].num > 0) {
          newArr.push({ goodsId: goodsId, num: newSkuArrTwo[i].num, skuCode: newSkuArrTwo[i].skuCode,storeId:wx.getStorageSync('storeId')})

        }
      }
    }
    if (goodsSpecificationVOList.length>0){
      if(newArr.length==0){
        wx.showToast({
          title: '请选择商品属性',
          icon: 'none',
          duration: 1000,
          mask: true
        })
        return
      }
    }
    if(status==1){
      var model = JSON.stringify(newArr);
      wx.navigateTo({
        url: '../address/address?model=' + model + '&enjoyCost=' + !this.data.discountShow + '&totalPrice=' + this.data.newTotal,
      })
    }else{
      if (this.data.editCode){
        Api.updateMoreCart(JSON.stringify(newArr))
          .then(res => {
            wx.showToast({
              title: '修改成功',
              icon: 'none',
              duration: 1000,
              mask: true
            })
            wx.switchTab({
              url: '../cartList/cartList'
            })
          })
      }else{
        Api.addMoreCart(JSON.stringify(newArr))
          .then(res => {
            wx.showToast({
              title: '添加成功',
              icon: 'none',
              duration: 1000,
              mask: true
            })
            wx.switchTab({
              url: '../cartList/cartList'
            })
          })
      }
    }
  },
  // 购买数量
  minusCount:function(){
    let num = this.data.numbers
    num = num - 1
    if(num==0){
      return
    }else{
      this.setData({
        numbers: num
      })
    }
    if (this.data.editOneName) {
      var newSkuArrTwo = this.data.newSkuArrTwo
      for (var i = 0; i < newSkuArrTwo.length; i++) {
        if (newSkuArrTwo[i].num > 0) {
          newSkuArrTwo[i].num = num
        }
      }
      this.setData({
        newSkuArrTwo: newSkuArrTwo
      }, function () {
        this.getTotalPrice();
      })
    }
  },
  addCount:function(){
    let num=this.data.numbers
    num=num+1
    this.setData({
      numbers:num
    })
    if (this.data.editOneName){
      var newSkuArrTwo = this.data.newSkuArrTwo
      for (var i = 0; i < newSkuArrTwo.length;i++){
        if (newSkuArrTwo[i].num>0){
          newSkuArrTwo[i].num = num
        }
      }
      this.setData({
        newSkuArrTwo: newSkuArrTwo
      },function(){
        this.getTotalPrice();
      })
    }
    
  },
  /**
  * 绑定加数量事件
  */
  addCount1(e) {
    const index = e.currentTarget.dataset.index;
    let spectArrDifference = this.data.spectArrDifference
    let code = this.data.moreCode
    for (var i = 0; i < spectArrDifference.length; i++) {
      if (spectArrDifference[i].code == code) {
        spectArrDifference[i].newSkuArrTwo[index].num = spectArrDifference[i].newSkuArrTwo[index].num+1
      }
    }
    this.setData({
      spectArrDifference: spectArrDifference
    });
    this.getTotalPrice();
  },

  /**
   * 绑定减数量事件
   */
  minusCount1(e) {
    const index = e.currentTarget.dataset.index;
    let spectArrDifference = this.data.spectArrDifference
    let code = this.data.moreCode
    for (var i = 0; i < spectArrDifference.length; i++) {
      if (spectArrDifference[i].code == code) {
        if (spectArrDifference[i].newSkuArrTwo[index].num <= 0) {
          return false;
        }
        spectArrDifference[i].newSkuArrTwo[index].num = spectArrDifference[i].newSkuArrTwo[index].num -1
      }
    }
    this.setData({
      spectArrDifference: spectArrDifference
    });
    this.getTotalPrice();
  },
  /**
  * 计算总价
  */
  getTotalPrice() {
    var childArr=[],
    code=this.data.moreCode,
    colorNum=0
    let newSkuArrTwo =[];
    let swichNav = this.data.swichNav;
    let spectArrDifference = this.data.spectArrDifference     
    let total = 0;
    let newTotal = 0;
    let discount = 0;
    let nums=0;
    let classNums=0;
    let saleBatchAmount = this.data.saleBatchAmount
    let saleBatchNum = this.data.saleBatchNum
    let difference=0
    let limitShow = this.data.limitShow
    let goodsSpecificationVOList = this.data.goodsSpecificationVOList
    if (goodsSpecificationVOList.length>0){
      var  childArr=goodsSpecificationVOList[0].goodsSpecificationValueVOList
    }
    for (var j = 0; j< spectArrDifference.length; j++) {
      newSkuArrTwo = spectArrDifference[j].newSkuArrTwo
      for (let i = 0; i < newSkuArrTwo.length; i++) {
        if (spectArrDifference[j].code == code) {
          colorNum += newSkuArrTwo[i].num
          childArr[swichNav].num = colorNum
        }
        if (newSkuArrTwo[i].num > 0) {
          classNums += 1
          nums += newSkuArrTwo[i].num
          total += newSkuArrTwo[i].num * newSkuArrTwo[i].sellPrice; 
          if (limitShow==3){
            if (nums > saleBatchNum - 1 || total.toFixed(2) > saleBatchAmount) {
              newTotal += newSkuArrTwo[i].num * newSkuArrTwo[i].wholesalePrice;
              difference = total - newTotal
              this.setData({
                discountShow: false,
                newTotal: newTotal,
              })
            } else {
              this.setData({
                discountShow: true,
              })
            }
          }
        }
      }
    }
    goodsSpecificationVOList[0].goodsSpecificationValueVOList = childArr
    this.setData({                    
      newSkuArrTwo: newSkuArrTwo,
      totalPrice: total.toFixed(2),
      nums: nums,
      classNums: classNums,
      newTotal: newTotal,
      difference: difference,
      goodsSpecificationVOList: goodsSpecificationVOList
    });
  },
  minusCountAll:function(){
    let newSkuArrTwo =[];
    let total = 0;
    let spectArrDifference = this.data.spectArrDifference
    let code = this.data.moreCode
    let index = null
    for (var i = 0; i < spectArrDifference.length; i++) {
      if (spectArrDifference[i].code == code) {
        index = i
        newSkuArrTwo = spectArrDifference[i].newSkuArrTwo
      }
    }
    for (let i = 0; i < newSkuArrTwo.length; i++) {
      if(newSkuArrTwo[i].num>0){
        newSkuArrTwo[i].num = newSkuArrTwo[i].num - 1
        total += newSkuArrTwo[i].num * newSkuArrTwo[i].sellPrice; 
      }
    }
    spectArrDifference[index].newSkuArrTwo = newSkuArrTwo
    this.getTotalPrice();
    this.setData({
      spectArrDifference: spectArrDifference,
      totalPrice: total.toFixed(2)
    });
  },
  addCountAll: function () {
    let newSkuArrTwo = [];
    let total = 0;
    let spectArrDifference = this.data.spectArrDifference
    let code = this.data.moreCode
    let index=null
    for (var i = 0; i < spectArrDifference.length;i++){
      if(spectArrDifference[i].code==code){
        index=i
        newSkuArrTwo=spectArrDifference[i].newSkuArrTwo
      }
    }
    for (let i = 0; i < newSkuArrTwo.length; i++) {
      newSkuArrTwo[i].num = newSkuArrTwo[i].num + 1
      total += newSkuArrTwo[i].num * newSkuArrTwo[i].sellPrice; 
    }
    spectArrDifference[index].newSkuArrTwo = newSkuArrTwo
    this.getTotalPrice();
    this.setData({
      spectArrDifference: spectArrDifference,
      totalPrice: total.toFixed(2)
    });
  },
  
  changeNum: function (e){
    const index = e.currentTarget.dataset.index;
    const code = e.currentTarget.dataset.code;
    const obj = e.currentTarget.dataset.obj;
    var value = parseInt(e.detail.value)
    if (value < 0 || isNaN(value)){
      value=0
    }
    let spectArrDifference = this.data.spectArrDifference;
    for (let i = 0; i < spectArrDifference.length; i++) {
      spectArrDifference[i].newSkuArrTwo[index].num = value
    }
    this.setData({
      spectArrDifference: spectArrDifference
    });
    this.getTotalPrice();
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  getDetails: function (goodsId){
    var _this=this,
      storeId = this.data.storeId
    Api.config(goodsId)
      .then(res => {
        var obj = res.obj,
          goodsSaleBatchNum = obj.goodsSaleBatchNum,
          goodsSaleBatchAmount = obj.goodsSaleBatchAmount,
          storeSaleBatchNum = obj.storeSaleBatchNum,
          storeSaleBatchAmount = obj.storeSaleBatchAmount
        if (goodsSaleBatchNum==null){
          _this.setData({
            saleBatchNum: storeSaleBatchNum
          })
        }else{
          _this.setData({
            saleBatchNum: goodsSaleBatchNum
          })
        }
        if (goodsSaleBatchAmount == null) {
          _this.setData({
            saleBatchAmount: storeSaleBatchAmount
          })
        } else {
          _this.setData({
            saleBatchAmount: goodsSaleBatchAmount
          })
        }
      })
    Api.goodsDetails({ goodsId:goodsId })
      .then(res => {
        var obj = res.obj.goodsVO,
          store = res.obj.store,
          skuArrTwo = [],
          name = ''
        var that = this;
        var article = '<div>' + obj.description+'</div>'
        WxParse.wxParse('article', 'html', article, that, 5);
        if (store.isFollow){
          _this.setData({
            likeShow:true
          })
        }else{
          _this.setData({
            likeShow: false
          })
        }
        if (Api.isEmpty(obj.goodsSpecificationVOList)){
          if (obj.goodsSpecificationVOList.length > 1) {
            skuArrTwo.push(obj.goodsSpecificationVOList[1])
            name = obj.goodsSpecificationVOList[1].specName
          }
        }else{
          obj.goodsSpecificationVOList=[]
        } 
        if (!Api.isEmpty(obj.goodsSkuVOList)){
          obj.goodsSkuVOList=[]
        }
        wx.setStorageSync("storeId", obj.storeId)
        _this.setData({
          imgUrls: obj.goodsImageVOList,
          name: obj.name,
          wholesalePrice: obj.wholesalePrice,
          recommendDesc: obj.recommendDesc,
          description: obj.description,
          goodsSpecificationVOList: obj.goodsSpecificationVOList,
          goodsSkuVOList: obj.goodsSkuVOList,
          skuArrTwo: skuArrTwo,
          sell: obj.sellPrice,
          stockNum: obj.stockNum,
          mainImgUrl: obj.mainImgUrl,
          nameTwo: name,
          store: store
        },function(){
          if (_this.data.getSpecDetails) {
            if (obj.goodsSpecificationVOList.length != 0) {
              var arr = obj.goodsSpecificationVOList[0].goodsSpecificationValueVOList
              if (_this.data.editCode){
                for (var i = arr.length - 1; i >= 0; i--) {
                  _this.getSpecDetails(i, arr[i].specValueCode)
                }
              }else{
                _this.getSpecDetails(0, arr[0].specValueCode)
              }
            }
          }
          let num = this.data.numbers
          this.setData({
            numbers: num
          })
          if (this.data.editOneName) {
            var newSkuArrTwo = this.data.newSkuArrTwo
            for (var i = 0; i < newSkuArrTwo.length; i++) {
              if (newSkuArrTwo[i].num > 0) {
                newSkuArrTwo[i].num = num
              }
            }
            this.setData({
              newSkuArrTwo: newSkuArrTwo
            }, function () {
              this.getTotalPrice();
            })
          }
          
        })
      })
  },
  onShow: function () {
  },
  likeStore: function () {
    var _this = this
    Api.likeStore()
      .then(res => {
        wx.showToast({
          title: '关注成功',
          icon: 'none',
          duration: 1000,
          mask: true,
        })
        _this.setData({
          likeShow: true
        })
      })
  },
  deteleLikeStore: function () {
    var _this = this
    Api.deteleLikeStore()
      .then(res => {
        wx.showToast({
          title: '取消关注成功',
          icon: 'none',
          duration: 1000,
          mask: true,
        })
        _this.setData({
          likeShow: false
        })
      })
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