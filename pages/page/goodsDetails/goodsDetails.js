const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [],
    goodsSpecificationVOList:[],
    goodsSkuVOList:[],
    className:'active',
    indicatorDots: true,
    autoplay: true,
    interval: 2000,
    duration: 500,
    bg: '#C79C77',
    Height: ""  ,
    hidden: true,
    numbers: 1,
    name:'',
    wholesalePrice:'',
    recommendDesc:'',
    introduction:'',
    swichNavCode:true,
    changeButtonCode:true,
    mainImgUrl:'',
    wholesale: '',
    sell:'',
    stockNum:''
  },
  /**
  * 生命周期函数--监听页面加载
  */
  onLoad: function (options) {
    var that = this,
      goodsId = options.goodsId
    console.log(goodsId)
    app.http.getRequest('/admin/shop/goods/180821182851051cbe48')
      .then(res => {
        var obj = res.obj
        console.log(obj.goodsSkuVOList)
        that.setData({
          imgUrls: obj.goodsImageVOList,
          name: obj.name,
          wholesalePrice: obj.wholesalePrice,
          recommendDesc: obj.recommendDesc,
          introduction: obj.introduction,
          goodsSpecificationVOList: obj.goodsSpecificationVOList,
          goodsSkuVOList: obj.goodsSkuVOList,
          sell: obj.sellPrice,
          stockNum: obj.stockNum,
          mainImgUrl: obj.mainImgUrl
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
  // swichNav: function (e) {
  //   var swichNavCode = e.target.dataset.code
  //   console.log(swichNavCode)
  //   var that = this;
  //   if (this.data.currentTab === e.target.dataset.current) {
  //     return false;
  //   } else {
  //     that.setData({
  //       currentTab: e.target.dataset.current,
  //       swichNavCode: swichNavCode
  //     })
  //   }
  // },
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
  CratHome: function () {
    wx.switchTab({
      url: '../cartList/cartList'
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