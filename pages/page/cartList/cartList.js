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
    userId:'123',
    items: [{
      message: '18K锦囊金宝石',
      status: 0,
    }, {
      message: '18K锦囊金宝石',
      status: 0,
    }, {
      message: '18K锦囊金宝石',
      status: 1,
    }],
    weight: [{ weight: '500g' }, { weight: '600g' }],
    numbers: 1,
  },
  // 规格
  //选择规格
  showAlert: function () {
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
  getList:function(){
    var _this=this,
      userId = this.data.userId
    Api.cartList()
      .then(res => {
        const obj=res.obj,
          effectiveList = obj.effectiveList[0].goodsList,
          store = obj.effectiveList[0].store,
          failureList = obj.failureList[0].goodsList,
          storeMes=[]
        for (var i = 0; i < effectiveList.length;i++){
          effectiveList[i].num = 1
          effectiveList[i].selected=true
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
        console.log(failureList)
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
    this.getList()
    
  },
  onShow() {
    
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
    this.setData({
      lostcarts: [],
      lostList: false
    });
  },

  /**
   * 删除购物车当前商品
   */
  deleteList(e) {
    const index = e.currentTarget.dataset.index;
    let detailList = this.data.detailList;
    detailList.splice(index, 1);
    this.setData({
      detailList: detailList
    });
    if (!detailList.length) {
      this.setData({
        hasList: false
      });
    } else {
      this.getTotalPrice();
    }
    wx.showToast({
      title: '删除成功',
      icon: 'success',
      duration: 2000
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
  addCount(e) {
    const index = e.currentTarget.dataset.index;
    let detailList = this.data.detailList;
    let num = detailList[index].num;
    num = num + 1;
    detailList[index].num = num;
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
    let num = detailList[index].num;
    if (num <= 1) {
      return false;
    }
    num = num - 1;
    detailList[index].num = num;
    this.setData({
      detailList: detailList
    });
    this.getTotalPrice();
  },

  /**
   * 计算总价
   */
  getTotalPrice() {
    let detailList = this.data.detailList;                  // 获取购物车列表
    let total = 0;
    for (let i = 0; i < detailList.length; i++) {         // 循环列表得到每个数据
      if (detailList[i].selected) {  
        total += detailList[i].num * detailList[i].sellPrice;   // 所有价格加起来
      }
    }
    this.setData({                                // 最后赋值到data中渲染到页面
      detailList: detailList,
      totalPrice: total.toFixed(2)
    });
  },
 
 
})