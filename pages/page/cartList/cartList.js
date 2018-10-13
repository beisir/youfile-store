const app = getApp();
var that
import Api from '../../../utils/api.js'
// var recordStartX = 0;
// var currentOffsetX = 0;
Page({
  data: {
    indexEmpty: true,
    enjoyCost:false,
    detailList:[],
    detailList1:[],
    hasList:false,
    lostcarts: [],
    lostList: false,
    totalPrice:0, 
    selectAllStatus:true, 
    allEmpty:true,
    total1:0,
    obj:{
        name:"hello"
    },
    storeMes:[],
    storeId: wx.getStorageSync('storeId'),
    hidden: true,
    idnex:'',
    leftVal:'',
    numbers: 1,
    baseUrl: app.globalData.imageUrl,
    limitShow: wx.getStorageSync('admin'),
    storeAmount: '',
    storeNum: '',
    editDetailList:'',
    goodsConfig:[]
  },
  
  // 规格
  //选择规格
  showAlert: function (e) {
    var that = this,
      name=e.target.dataset.name
      if(name=="more"){
        var index = e.target.dataset.index,
          detailList = this.data.detailList[index]
        wx.navigateTo({
          url: '../goodsDetails/goodsDetails?goodsId=' + detailList["goodsId"] + "&code=" + index+"&name=more",
        })
      }else{
        var gid = e.target.dataset.gid
        wx.navigateTo({
          url: '../goodsDetails/goodsDetails?goodsId=' +gid+ "&code=" + index+"&name=one",
        })
      }
  },
  //选择规格属性
  changeButton: function (e) {
    var that = this;
    if (this.data.specsTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        specsTab: e.target.dataset.current,
      })
    }
  },
  // 购买数量
  minusCount1: function () {
    var num = this.data.numbers
    num = num - 1
    if (num == 0) {
      return
    } else {
      this.setData({
        numbers: num
      })
    }
  },
  addCount1: function () {
    var num = this.data.numbers
    num = num + 1
    this.setData({
      numbers: num
    })
  },
  weghtSwi: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current,
      })
    }
  },
  //关闭弹框
  closeAlert: function () {
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
  rightList:function(e){
    this.setData({
      leftVal:0
    });
  },
  //手指触摸动作开始 记录起点X坐标
  touchstart: function (e) {
    //开始触摸时 重置所有删除
    let data = app.touch._touchstart(e, this.data.detailList)
    this.setData({
      detailList: data
    })
  },

  //滑动事件处理
  touchmove: function (e) {
    let data = app.touch._touchmove(e, this.data.detailList)
    this.setData({
      detailList: data
    })
  },
  urlHome: function () {
    wx.switchTab({
      url: '../home/home'
    })
  },
  getList:function(){
    this.setData({
      detailList: [],
      lostcarts:[],
    }, function () {
      _this.getTotalPrice();
    })
    var _this=this
    Api.cartList()
      .then(res => {
        const obj=res.obj
        if (obj==null){
          _this.setData({
            allEmpty: false
          })
          return
        }else{
          _this.setData({
            allEmpty: true
          })
        }
          var newEffectiveListLen = res.obj.effectiveList.length,
          newFailureListLen= res.obj.failureList.length,
          storeMes=[]
        if (newEffectiveListLen>0){
         var  effectiveList = obj.effectiveList[0].goodsList,
           store = obj.effectiveList[0].store
        }else{
          var effectiveList=[]
        }
        if (newFailureListLen > 0) {
          var failureList = obj.failureList[0].goodsList,
            store = obj.failureList[0].store
        } else {
          var failureList = []
        }
        if (effectiveList.length>0){
          _this.setData({
            hasList: true,
          });
        }
        if (failureList.length > 0) {
          _this.setData({
            lostList: true,
          });
        }
        if (effectiveList.length == 0 && failureList.length==0){
          _this.setData({
            allEmpty:false
          })
        }
        storeMes.push(store)
        if(effectiveList.length==0){
          _this.setData({
            hasList:false
          })
        }
        for (var i = 0; i < effectiveList.length;i++){
          effectiveList[i].selected = true
          var newSkvArr = effectiveList[i].shoppingCartSkuList
          if (Api.isEmpty(newSkvArr)){
            var num=0;
            var allGoodsAmount = 0
            var allGoodsPf=0
            for (var j = 0; j < newSkvArr.length;j++){
              num+= newSkvArr[j].num
              allGoodsAmount += newSkvArr[j].sellPrice * newSkvArr[j].num
              allGoodsPf += newSkvArr[j].wholesalePrice * newSkvArr[j].num
            }
            effectiveList[i].num = num
            effectiveList[i].allGoodsAmount = allGoodsAmount
            effectiveList[i].allGoodsPf = allGoodsPf
          }else{
            effectiveList[i].allGoodsAmount = effectiveList[i].sellPrice*effectiveList[i].num
            effectiveList[i].allGoodsPf = effectiveList[i].wholesalePrice*effectiveList[i].num
          }
        }
        _this.setData({
          storeAmount:store.saleBatchAmount,
          storeNum: store.saleBatchNum,
          detailList: effectiveList,
          lostcarts: failureList,
          storeMes: storeMes
        },function(){
          _this.getTotalPrice();
        })
      })
    
  },
  onLoad: function (options) {
 
  },
  onShow() {
    this.setData({
      detailList:[]
    })
    if (wx.getStorageSync("storeId") == undefined || wx.getStorageSync("storeId") == '') {
      this.setData({
        indexEmpty: false
      })
    }
    if (wx.getStorageSync('admin') == 3) {
      wx.setNavigationBarTitle({
        title:'进货车'
      })
      wx.setTabBarItem({
        index: 1,
        text: '进货车',
        iconPath: '/image/22.png',
        selectedIconPath: '/image/21.png'
      })
    }
    this.getList(this)
  },
  /**
   * 当前商品选中事件
   */
  /**
   * 当前商品选中事件
   */
  selectList(e) {
    const index = e.currentTarget.dataset.index;
    let detailList = this.data.detailList;
    const selected = detailList[index].selected;
    detailList[index].selected = !selected;
    this.setData({
      detailList: detailList
    });
    this.getTotalPrice();
  },
  /**
   * 清空失效宝贝
   */
  emptyAll(e) {
    Api.deteleCartFai()
     .then(res => {
        wx.showToast({
          title: '清空成功',
          icon: 'none',
          duration: 2000
        })
        this.getList()
    })
  },

  /**
   * 删除购物车当前商品
   */
  deleteList(e) {
    const index = e.currentTarget.dataset.index,
      goodsId = e.currentTarget.dataset.id,
          _this=this
    Api.deteleCartGoods({ goodsId: goodsId})
    .then(res=>{
      Api.showToast("删除成功")
      _this.getList()
    })
  },

  /**
   * 购物车全选事件
   */
  selectAll(e) {
    let selectAllStatus = this.data.selectAllStatus;
    selectAllStatus = !selectAllStatus;
    let detailList = this.data.detailList;

    for (let i = 0; i < detailList.length; i++) {
      detailList[i].selected = selectAllStatus;
    }
    this.setData({
      selectAllStatus: selectAllStatus,
      detailList: detailList
    });
    this.getTotalPrice();
  },

  /**
   * 绑定加数量事件
   */
  addCart(goodsId,data){
    Api.updateMoreCart(data)
      .then(res => {
      })
  },
  addCount(e) {
    const index = e.currentTarget.dataset.index;
    let detailList = this.data.detailList;
    let num = detailList[index].shoppingCartSkuList[0].num;
    num = num + 1;
    let storeId = this.data.storeId
    detailList[index].shoppingCartSkuList[0].num = num;
    detailList[index].num=num
    var data = detailList[index].shoppingCartSkuList
    var dataArr=[]
    dataArr.push({ goodsId: data[0]["goodsId"], num: num, skuCode: data[0]["skuCode"], storeId:storeId})
    this.addCart(data[0]["goodsId"],JSON.stringify(dataArr))
    this.setData({
      detailList: detailList
    });
    this.getTotalPrice();
  },

  /**
   * 绑定减数量事件
   */
  
  minusCountNew(e) {
    const index = e.currentTarget.dataset.index;
    const obj = e.currentTarget.dataset.obj;
    let detailList = this.data.detailList;
    let storeId = this.data.storeId
    let num = detailList[index].num
    if (num <= 1) {
      return false;
    }
    num = num - 1;
    detailList[index].num = num;
    var dataArr = []
    dataArr.push({ goodsId:detailList[index]["goodsId"], num: num, skuCode:0, storeId: storeId })
    this.addCart(detailList[index]["goodsId"], JSON.stringify(dataArr))
    this.setData({
      detailList: detailList
    });
    this.getTotalPrice();
  },
  addCountNew(e) {
    const index = e.currentTarget.dataset.index;
    let detailList = this.data.detailList;
    let num = detailList[index].num;
    num = num + 1;
    let storeId = this.data.storeId
    detailList[index].num = num
    var dataArr = []
    dataArr.push({ goodsId: detailList[index]["goodsId"], num: num, skuCode: 0, storeId: storeId })
    this.addCart(detailList[index]["goodsId"], JSON.stringify(dataArr))
    this.setData({
      detailList: detailList
    });
    this.getTotalPrice();
  },
  minusCount(e) {
    const index = e.currentTarget.dataset.index;
    const obj = e.currentTarget.dataset.obj;
    let detailList = this.data.detailList;
    let storeId = this.data.storeId
    let num = detailList[index].shoppingCartSkuList[0].num;
    if (num <= 1) {
      return false;
    }
    num = num - 1;
    detailList[index].shoppingCartSkuList[0].num = num;
    detailList[index].num = num
    var data = detailList[index].shoppingCartSkuList
    var dataArr = []
    dataArr.push({ goodsId: data[0]["goodsId"], num: num, skuCode: data[0]["skuCode"], storeId: storeId })
    this.addCart(data[0]["goodsId"], JSON.stringify(dataArr))
    this.setData({
      detailList: detailList
    });
    this.getTotalPrice();
  },
  /**
   * 计算总价
   */
  getTotalPrice() {
    var limitShow = this.data.limitShow,
      storeNum = this.data.storeNum,
      storeAmount = this.data.storeAmount,
      allTotalNum=0,
      total1=0,
      totalNew=0,
      saleBatchGoodsNum=0,
      allGoodsAmount=0
    let detailList = this.data.detailList;// 获取购物车列表
    let total = 0;
    this.setData({
      enjoyCost: false
    })
    console.log(detailList)
    for (let i = 0; i < detailList.length; i++) { 
      if (detailList[i].selected) {
        if (limitShow==3){
          allTotalNum = parseInt(detailList[i].num)
          allGoodsAmount = parseInt(detailList[i].allGoodsAmount)
          saleBatchGoodsNum = detailList[i].saleBatchNum
          if (Api.isEmpty(saleBatchGoodsNum)) {
            // allTotalNum += parseInt(detailList[i].num)
            // allStoreAmount += parseInt(detailList[i].sellPrice)
            // if (detailList[i].saleBatchNum < parseInt(detailList[i].num + 1)) {
            //   detailList[i].enjoyPrice = true
            //   detailList[i].allNum = detailList[i].saleBatchNum
            // }else{
            //   detailList[i].enjoyPrice = false
            //   detailList[i].allNum = detailList[i].saleBatchNum
            // }
          }else{
            // detailList[i].enjoyPrice = false
            // detailList[i].allNum = storeNum
          }
          // if (allTotalNum > storeNum || allStoreAmount>storeAmount){
          //   detailList[i].enjoyPrice = true
          //   this.setData({
          //     enjoyCost:true
          //   })
          // }
        }else{
          totalNew += detailList[i].allGoodsAmount;
          // if (detailList[i].shoppingCartSkuList != null) {
          //   // var arr = detailList[i].shoppingCartSkuList
          //   // for (var j = 0; j < arr.length; j++) {
          //   //   total += arr[j].num * arr[j].sellPrice;
          //   // }
          // } else {
            
          // }
        }
        
      }
    }
    if (limitShow == 3){
      for (var i = 0; i < detailList.length;i++){
        if (detailList[i].selected){
          var enjoy = detailList[i].enjoyPrice
          if (detailList[i].shoppingCartSkuList != null) {
            var arr = detailList[i].shoppingCartSkuList
            for (var j = 0; j < arr.length; j++) {
              total1 += arr[j].num * arr[j].wholesalePrice;
              total += arr[j].num * arr[j].sellPrice;
            }
            if (total > storeAmount) {
              detailList[i].enjoyPrice = true
              this.setData({
                enjoyCost: true
              })
            }
          } else {
            if (enjoy) {
              totalNew = detailList[i].num * detailList[i].wholesalePrice;
            } else {
              totalNew = detailList[i].num * detailList[i].sellPrice;
            }
          }
        }
      }
    }
    this.setData({ 
      detailList: detailList,
      total1: total1.toFixed(2),
      totalPrice: (total + totalNew).toFixed(2)
    });
  },
  creatOrder:function(){
    var data=this.data.detailList,
        model=[]
    for(var i=0;i<data.length;i++){
      if (data[i].selected){
        var dataArr = data[i].shoppingCartSkuList
        if (dataArr!=null){
          for (var j = 0; j < dataArr.length; j++) {
            model.push({ goodsId: data[i].goodsId, num: dataArr[j].num, skuCode: dataArr[j].skuCode })
          }
        }else{
          model.push({ goodsId: data[i].goodsId, num: data[i].num, skuCode:0})
        }
      }
    }
   if(model.length==0){
     Api.showToast("请勾选商品！")
     return
   }
    var model = JSON.stringify(model);
    wx.navigateTo({
      url: '../address/address?model=' + model + '&enjoyCost=' + this.data.enjoyCost + '&totalPrice=' + this.data.totalPrice,
    })
  },
})