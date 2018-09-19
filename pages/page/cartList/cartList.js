const app = getApp();
import Api from '../../../utils/api.js'
var recordStartX = 0;
var currentOffsetX = 0;
Page({
  data: {
    detailList:[],               // 购物车列表
    hasList:false,          // 列表是否有数据
    lostcarts: [],              //失效列表
    lostList: false,          //失效列表是否有数据
    totalPrice:0,           // 总价，初始为0
    selectAllStatus:true,    // 全选状态，默认全选
    obj:{
        name:"hello"
    },
    storeMes:[],
    hidden: true,
    idnex:'',
    leftVal:'',
    numbers: 1,
    limitShow: app.pageRequest.limitShow(),
    storeAmount: '',
    goodsAmount:'',
    storeNum: '',
    goodsNum:'',
    editDetailList:''
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
    // var animation = wx.createAnimation({
    //   duration: 300,
    //   timingFunction: 'linear'
    // })
    // that.animation = animation
    // animation.translateY(300).step()
    // that.setData({
    //   animationData: animation.export(),
    //   hidden: false,
    //   editDetailList
    // })
    // setTimeout(function () {
    //   animation.translateY(0).step()
    //   that.setData({
    //     animationData: animation.export()
    //   })
    // }, 30)
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
          effectiveList[i].selected = true
          if(effectiveList[i].shoppingCartSkuList==null){
            effectiveList[i].height =270
          }else{
           if(effectiveList[i].shoppingCartSkuList.length>1){
             effectiveList[i].height = effectiveList[i].shoppingCartSkuList.length * 75 + 270
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
          goodsId=e.target.dataset.id;
    Api.deteleCartGoods({ goodsId: goodsId})
    .then(res=>{
      wx.showToast({
        title: '删除成功',
        icon: 'none',
        duration: 2000
      })
      this.getList()
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
  addCart(data){
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
    detailList[index].shoppingCartSkuList[0].num = num;
    detailList[index].num=num
    var data = detailList[index].shoppingCartSkuList
    var dataArr=[]
    dataArr.push({goodsId: data[0]["goodsId"], num: num, skuCode: data[0]["skuCode"] })
    // this.addCart({ goodsId: data[0]["goodsId"], shoppingCartVOList: JSON.stringify(dataArr)})
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
    let num = detailList[index].shoppingCartSkuList[0].num;
    if (num <= 1) {
      return false;
    }
    num = num - 1;
    detailList[index].shoppingCartSkuList[0].num = num;
    detailList[index].num = num
    var data = detailList[index].shoppingCartSkuList
    // this.addCart({ goodsId: data[0]["goodsId"], num:num, skuCode: data[0]["skuCode"] })
    this.setData({
      detailList: detailList
    });
    this.getTotalPrice();
  },
  getConfig(goodsId){
    Api.config({ goodsId: goodsId})
      .then(res => {
        var obj = res.obj,
          goodsSaleBatchNum = obj.goodsSaleBatchNum,
          goodsSaleBatchAmount = obj.goodsSaleBatchAmount,
          storeSaleBatchNum = obj.storeSaleBatchNum,
          storeSaleBatchAmount = obj.storeSaleBatchAmount
        console.log(obj)
        _this.setData({
          storeAmount: storeSaleBatchAmount,
          goodsAmount: goodsSaleBatchAmount,
          storeNum: storeSaleBatchNum,
          goodsNum: goodsSaleBatchNum
        })
      })
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
 
 
})