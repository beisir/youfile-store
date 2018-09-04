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
    goodsId:''
  },
  /**
  * 生命周期函数--监听页面加载
  */
  onLoad: function (options) {
    var that = this,
      goodsId = options.goodsId
    that.setData({
      goodsId: '180831183155243d4de6'
    })
    Api.batchNum({ goodsId: '180831183155243d4de6'})
      .then(res => {
        var obj = res.obj
        that.setData({
          saleBatchNum: obj.saleBatchNum,
          saleBatchAmount: obj.saleBatchAmount
        })
      })
    Api.goodsDetails({ goodsId: '180831183155243d4de6' })
      .then(res => {
        var obj = res.obj,
          skuArrTwo=[],
          name=''
        console.log(obj)
        if (obj.goodsSpecificationVOList.length>1){
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
        })
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
  swichNav: function (e) {
    var that = this,
        swichNavCode = e.target.dataset.current,
        code = e.target.dataset.code,
        skuArrTwo = this.data.skuArrTwo,
        skuArr = this.data.goodsSkuVOList,
        skuValueVOList=[],
        newSkuArrTwo=[],
      codeName = this.data.goodsSpecificationVOList,
        newList={}
    if (skuArrTwo.length==1){
      skuValueVOList=skuArrTwo[0].goodsSpecificationValueVOList
    }
    for (var i = 0; i < skuArr.length;i++){
      var childArr = skuArr[i].specValueCodeList
      if(childArr.indexOf(code)!=-1){
        newSkuArrTwo.push(skuArr[i])
      }
    }
    for (var i = 0; i < newSkuArrTwo.length;i++){
      for (var j = 0; j < skuValueVOList.length; j++) {
        if ((newSkuArrTwo[j].specValueCodeList).indexOf(skuValueVOList[j].specValueCode)!=-1){
          newSkuArrTwo[j].name = skuValueVOList[j].specValueName
          newSkuArrTwo[j].num=0
        }
      }
    }
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        swichNav: swichNavCode,
        newSkuArrTwo: newSkuArrTwo
      })
    }
    this.getTotalPrice();
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
    let newSkuArrTwo = this.data.newSkuArrTwo;
    let num = newSkuArrTwo[index].num;
    num = num + 1;
    newSkuArrTwo[index].num = num;
    this.setData({
      newSkuArrTwo: newSkuArrTwo
    });
    this.getTotalPrice();
  },

  /**
   * 绑定减数量事件
   */
  minusCount1(e) {
    const index = e.currentTarget.dataset.index;
    const obj = e.currentTarget.dataset.obj;
    let newSkuArrTwo = this.data.newSkuArrTwo;
    let num = newSkuArrTwo[index].num;
    if (num <= 0) {
      return false;
    }
    num = num - 1;
    newSkuArrTwo[index].num = num;
    this.setData({
      newSkuArrTwo: newSkuArrTwo
    });
    this.getTotalPrice();
  },
  /**
  * 计算总价
  */
  getTotalPrice() {
    let newSkuArrTwo = this.data.newSkuArrTwo;        
    let total = 0;
    for (let i = 0; i < newSkuArrTwo.length; i++) {       
        total += newSkuArrTwo[i].num * newSkuArrTwo[i].sellPrice; 
    }
    this.setData({                    
      newSkuArrTwo: newSkuArrTwo,
      totalPrice: total.toFixed(2)
    });
  },
  minusCountAll:function(){
    let newSkuArrTwo = this.data.newSkuArrTwo;
    let total = 0;
    for (let i = 0; i < newSkuArrTwo.length; i++) {
      newSkuArrTwo[i].num = newSkuArrTwo[i].num-1
      total += newSkuArrTwo[i].num * newSkuArrTwo[i].sellPrice; 
    }
    this.setData({
      newSkuArrTwo: newSkuArrTwo,
      totalPrice: total.toFixed(2)
    });
  },
  addCountAll: function () {
    let newSkuArrTwo = this.data.newSkuArrTwo;
    let total = 0;
    for (let i = 0; i < newSkuArrTwo.length; i++) {
      newSkuArrTwo[i].num = newSkuArrTwo[i].num + 1
      total += newSkuArrTwo[i].num * newSkuArrTwo[i].sellPrice; 
    }
    this.setData({
      newSkuArrTwo: newSkuArrTwo,
      totalPrice: total.toFixed(2)
    });
  },
  changeNum: function (e){
    const index = e.currentTarget.dataset.index;
    const obj = e.currentTarget.dataset.obj;
    var value = e.detail.value
    if (value < 0 || isNaN(value)){
      wx.showToast({
        title: '请输入有效数字！',
        icon: 'none',
        duration: 2000
      })
      value=0
    }
    let newSkuArrTwo = this.data.newSkuArrTwo;
    newSkuArrTwo[index].num = value;
    this.setData({
      newSkuArrTwo: newSkuArrTwo
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