const app = getApp();
import Api from '../../../utils/api.js'
var recordStartX = 0;
var currentOffsetX = 0;
Page({
  data: {
    detailList:[],
    detailList1:[],
    hasList:false,
    lostcarts: [],
    lostList: false,
    totalPrice:0, 
    selectAllStatus:true, 
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
    goodsAmount:'',
    storeNum: '',
    goodsNum:'',
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
  recordStart: function (e) {
    this.setData({
      leftVal:''
    });
    var index1 = this.data.index;
    recordStartX = e.touches[0].clientX;
    var detailList = this.data.detailList;
    if (index1 != undefined) {
      detailList[index1].offsetX = 0;
    }
    var index = e.currentTarget.dataset.index
    currentOffsetX = this.data.detailList[index].offsetX;
  }
  ,
  recordMove: function (e) {
    var detailList = this.data.detailList;
    var index=e.currentTarget.dataset.index
    var item = detailList[index];
    var x = e.touches[0].clientX;
    var mx = recordStartX - x;
    var result = currentOffsetX - mx;
    if (result >= -80 && result <= 0) {
      item.offsetX = result;
    }
    this.setData({
      detailList: detailList
    });
  }
  ,
  recordEnd: function (e) {
    var detailList = this.data.detailList;
    var index = e.currentTarget.dataset.index
    var item = detailList[index];
    this.setData({
      index: index
    });
    if (item.offsetX < -40) {
      item.offsetX = -80;

    } else {
      item.offsetX = 0;

    }
    this.setData({
      detailList: detailList
    });
  },
  urlHome: function () {
    wx.switchTab({
      url: '../home/home'
    })
  },
  getList:function(){
    var _this=this
    Api.cartList()
      .then(res => {
        const obj=res.obj,
          newEffectiveListLen = res.obj.effectiveList.length,
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
        for (var i = 0; i < effectiveList.length;i++){
          // _this.getConfig(effectiveList[i]["goodsId"])
          effectiveList[i].selected = true
          if(effectiveList[i].shoppingCartSkuList==null){
            effectiveList[i].height =270
          }else{
           if(effectiveList[i].shoppingCartSkuList.length>1){
             effectiveList[i].height = effectiveList[i].shoppingCartSkuList.length * 90 + 270
           }
          }
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
        storeMes.push(store)
        _this.getConfig(effectiveList)
        _this.setData({
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
    this.getList()
   if(this.data.limitShow==3){
     wx.setNavigationBarTitle({
       title:'进货车'
     })
   }
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
        wx.showToast({
          title: '修改成功',
          icon: 'none',
          duration: 1000,
          mask: true
        })
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
    this.addCart(JSON.stringify(dataArr))
    this.setData({
      detailList: detailList
    });
    this.getTotalPrice();
  },

  /**
   * 绑定减数量事件
   */
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
  getConfig(data){
    var _this=this,
      data=data
      console.log(data)
    // for (var i = 0; i < data.length;i++){
    //   var dataMes = data[i]
    //   Api.config({ goodsId: data[i].goodsId})
    //   .then(res=>{
    //     var obj = res.obj,
    //       goodsSaleBatchNum = obj.goodsSaleBatchNum,
    //       goodsSaleBatchAmount = obj.goodsSaleBatchAmount,
    //       storeSaleBatchNum = obj.storeSaleBatchNum,
    //       storeSaleBatchAmount = obj.storeSaleBatchAmount,
    //       arr = this.data.goodsConfig
    //     arr.push({ goodsNum: goodsSaleBatchNum, goodsAmount: goodsSaleBatchAmount })
    //     if (goodsSaleBatchNum==null){
    //       goodsSaleBatchNum=0
    //     }
    //     if (goodsSaleBatchAmount == null) {
    //       goodsSaleBatchAmount = 0
    //     }
    //     dataMes.goodsSaleBatchNum = goodsSaleBatchNum
    //     dataMes.goodsSaleBatchAmount = goodsSaleBatchAmount
    //     console.log(dataMes)
    //   })
    // }
    // Api.config({ goodsId: goodsId})
    //   .then(res => {
        // var obj = res.obj,
        //   goodsSaleBatchNum = obj.goodsSaleBatchNum,
        //   goodsSaleBatchAmount = obj.goodsSaleBatchAmount,
        //   storeSaleBatchNum = obj.storeSaleBatchNum,
        //   storeSaleBatchAmount = obj.storeSaleBatchAmount,
        //   arr = this.data.goodsConfig,
    //       detailList=this.data.detailList1
    //     arr.push({ goodsNum: goodsSaleBatchNum, goodsAmount: goodsSaleBatchAmount})
    //     var len = detailList.length
    //     for (var i = 0; i < detailList.length;i++){
    //       if (i == len - 1 && arr.length==len-1){
    //         for (var j = 0; j < arr.length;j++){
    //             if (arr[j]["goodsNum"] != null) {
    //               detailList[j].goodsNum = arr[j]["goodsNum"]
    //             } else {
    //               detailList[j].goodsNum = 0
    //             }
    //             if (arr[j]["goodsAmount"] != null) {
    //               detailList[j].goodsAmount = arr[j]["goodsAmount"]
    //             } else {
    //               detailList[j].goodsAmount = 0
    //             }
    //             console.log(detailList)
    //             _this.setData({
    //               detailList: detailList,
    //               storeAmount: storeSaleBatchAmount,
    //               storeNum: storeSaleBatchNum,
    //               goodsConfig: arr
    //             })
    //         }
           
    //       }
    //     }
        
    //   })
  },
  /**
   * 计算总价
   */
  getTotalPrice() {
    var limitShow = this.data.limitShow
    let detailList = this.data.detailList;// 获取购物车列表
    console.log(detailList)
    let total = 0;
    for (let i = 0; i < detailList.length; i++) { 
      if (detailList[i].selected) {
        if (detailList[i].shoppingCartSkuList!=null){
          var arr = detailList[i].shoppingCartSkuList
          for (var j = 0; j < arr.length; j++) {
            total += arr[j].num * arr[j].sellPrice;
          }
        }
      }
    }
    this.setData({ 
      detailList: detailList,
      totalPrice: total.toFixed(2)
    });
  },
  creatOrder:function(){
    var data=this.data.detailList,
        model=[]
    for(var i=0;i<data.length;i++){
      if (data[i].selected){
        var dataArr = data[i].shoppingCartSkuList
        for (var j = 0; j < dataArr.length;j++){
          model.push({ goodsId: data[i].goodsId, num: dataArr[j].num, skuCode: dataArr[j].skuCode})
        }
      }
    }
    var model = JSON.stringify(model);
    wx.navigateTo({
      url: '../address/address?model=' + model,
    })
  },
})