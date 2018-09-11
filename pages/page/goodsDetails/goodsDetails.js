const app = getApp();
import Api from '../../../utils/api.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [],
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
    discountShow:true,
    spectArrDifference:[]
  },
  /**
  * 生命周期函数--监听页面加载
  */
  onLoad: function (options) {
    console.log(options.goodsId)
    var that = this,
      goodsId = options.goodsId
    that.setData({
      goodsId: "180831183155243d4de6"
    })
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
  //选择规格属性
  changeButton: function (e) {
    var changeButtonCode =e.target.dataset.code
    this.goodsSku(changeButtonCode,0)
    var that = this;
    if (this.data.specsTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        specsTab: e.target.dataset.current,
        changeButtonCode: changeButtonCode
      })
    }
  },
  weghtSwi: function (e) {
    var swichNavCode = e.target.dataset.code
    this.goodsSku(swichNavCode, 1)
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current,
        swichNavCode: swichNavCode
      })
    }
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
          newSkuArrTwo[j].num = 0
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
  cratHome: function () {
    var _this=this,
      num = this.data.numbers,
      goodsId = this.data.goodsId,
      status = this.data.status,
      skuCode='',
      changeButtonCode = this.data.changeButtonCode,
      swichNavCode = this.data.swichNavCode,
      goodsSkuVOList = this.data.goodsSkuVOList
    console.log(changeButtonCode + '[[[[' + swichNavCode)
    for (var i = 0; i < goodsSkuVOList.length;i++){
      var  childArr = goodsSkuVOList[i].specValueCodeList
      if (childArr.indexOf(swichNavCode) != -1 && childArr.indexOf(changeButtonCode) != -1){
       skuCode=goodsSkuVOList[i].skuCode
      }
    }
    Api.addCart({ goodsId: goodsId, num: num, skuCode: skuCode})
    .then(res =>{
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
  },
  // 批量添加购物车
  moreAddCart:function(){
    var specFirst = this.data.goodsSpecificationVOList[0].goodsSpecificationValueVOList,
      moreCode = this.data.moreCode,
      goodsId = this.data.goodsId,
      spectArrDifference = this.data.spectArrDifference,
      newArr=[],
      newSkuArrTwo=[]

    for (var j = 0; j < spectArrDifference.length; j++) {
      newSkuArrTwo = spectArrDifference[j].newSkuArrTwo
      for (var i = 0; i < newSkuArrTwo.length; i++) {
        if (newSkuArrTwo[i].num > 0) {
          newArr.push({ goodsId: goodsId, num: newSkuArrTwo[i].num, skuCode: newSkuArrTwo[i].skuCode,storeId:wx.getStorageSync('storeId')})

        }
      }
    }
    console.log(JSON.stringify([{ "goodsId": "180831183155243d4de6", "num": 1, "skuCode": "180831183155243d4de6_8a1", "storeId": "123" }]))
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
  },
  addCount:function(){
    let num=this.data.numbers
    num=num+1
    this.setData({
      numbers:num
    })
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
    let spectArrDifference = this.data.spectArrDifference     
    let total = 0;
    let newTotal = 0;
    let discount = 0;
    let nums=0;
    let classNums=0;
    let saleBatchAmount = this.data.saleBatchAmount
    let saleBatchNum = this.data.saleBatchNum
    let difference=0
    let goodsSpecificationVOList = this.data.goodsSpecificationVOList
    if (goodsSpecificationVOList.length>0){
      var  childArr=goodsSpecificationVOList[0].goodsSpecificationValueVOList
    }
    for (var j = 0; j< spectArrDifference.length; j++) {
      newSkuArrTwo = spectArrDifference[j].newSkuArrTwo
      for (let i = 0; i < newSkuArrTwo.length; i++) {
        if (newSkuArrTwo[i].num > 0) {
          for (var h = 0; h < childArr.length; h++) {
            if (childArr[h].specValueCode == code) {
              colorNum += newSkuArrTwo[i].num
              childArr[h].num = colorNum
            }
          }
          classNums += 1
          nums += newSkuArrTwo[i].num
          total += newSkuArrTwo[i].num * newSkuArrTwo[i].sellPrice; 
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
        console.log(i)
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
  getDetails:function(){
    var that=this
    Api.batchNum({ goodsId: this.data.goodsId })
      .then(res => {
        var obj = res.obj,
          saleBatchNum = obj.saleBatchNum,
          saleBatchAmount1 = obj.saleBatchAmount
        that.setData({
          saleBatchNum: saleBatchNum,
          saleBatchAmount: saleBatchAmount1
        })
        if (saleBatchNum==null){
          Api.saleBatch()
          .then(res=>{
            var obj = res.obj,
              saleBatchNum = obj.saleBatchNum,
              saleBatchAmount = obj.saleBatchAmount
              console.log(obj)
            that.setData({
              saleBatchNum: saleBatchNum
            })
            if (saleBatchAmount1== null){
              that.setData({
                saleBatchAmount: saleBatchAmount
              })
            }
          })
        }
      })
    Api.goodsDetails({ goodsId: this.data.goodsId })
      .then(res => {
        var obj = res.obj,
          skuArrTwo = [],
          name = ''
        if (obj.goodsSpecificationVOList.length > 1) {
          skuArrTwo.push(obj.goodsSpecificationVOList[1])
          name = obj.goodsSpecificationVOList[1].specName
        }
        that.setData({
          imgUrls: obj.goodsImageVOList,
          name: obj.name,
          wholesalePrice: obj.wholesalePrice,
          recommendDesc: obj.recommendDesc,
          introduction: obj.introduction,
          goodsSpecificationVOList: obj.goodsSpecificationVOList,
          goodsSkuVOList: obj.goodsSkuVOList,
          skuArrTwo: skuArrTwo,
          sell: obj.sellPrice,
          stockNum: obj.stockNum,
          mainImgUrl: obj.mainImgUrl,
          nameTwo: name
        },function(){
          if (that.data.getSpecDetails) {
            if (obj.goodsSpecificationVOList.length != 0) {
              var arr = obj.goodsSpecificationVOList[0].goodsSpecificationValueVOList
              that.getSpecDetails(0, arr[0].specValueCode)
            }
          }
        })
      })
  },
  onShow: function () {
    this.getDetails()
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