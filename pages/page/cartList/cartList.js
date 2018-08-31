const app = getApp();
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
    hidden: true,
    idnex:'',
    leftVal:'',
    detailList: [
      { id: 1, title: '周大福 绝色系列 热情似火 18K金镶红宝石钻...', price: '1200', small: '约1.66mm*0.23cm', image: '/image/s5.png', num: 4, selected: true },
      { id: 2, title: '周大福新款珠宝', price: '1200', small: '14号', image: '/image/s6.png', num: 1, selected: true }
    ],
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
    // 用that取代this，防止不必要的情况发生
    var that = this;
    // 创建一个动画实例
    var animation = wx.createAnimation({
      // 动画持续时间
      duration: 300,
      // 定义动画效果，当前是匀速
      timingFunction: 'linear'
    })
    // 将该变量赋值给当前动画
    that.animation = animation
    // 先在y轴偏移，然后用step()完成一个动画
    animation.translateY(300).step()
    // 用setData改变当前动画
    that.setData({
      // 通过export()方法导出数据
      animationData: animation.export(),
      // 改变view里面的Wx：if
      hidden: false
    })
    // 设置setTimeout来改变y轴偏移量，实现有感觉的滑动
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
  onLoad: function (options) {


  },
  onShow() {
    var that=this
    app.http.getRequest('/api/shop/shoppingcart/findByGoodsId/'+1)
      .then(res => {
        const obj = res.obj
        console.log(obj)
        that.setData({
          carts: obj,
          hasList: true,
        })
      })
    this.setData({
      hasList: true,
      carts:[
        { id: 1, title: '周大福 绝色系列 热情似火 18K金镶红宝石钻...', price: '1200', small: '约1.66mm*0.23cm', image: '/image/s5.png', num: 4, selected: true },
        { id: 2, title: '周大福新款珠宝', price: '1200', small: '14号', image: '/image/s6.png', num: 1, selected: true }
      ],
      lostList: true,
      lostcarts: [
        { id: 1, title: '周大福 绝色系列 热情似火 18K金镶红宝石钻...', price: '1200', small: '约1.66mm*0.23cm', image: '/image/s5.png', num: 4, selected: true },
        { id: 2, title: '周大福新款珠宝', price: '1200', small: '14号', image: '/image/s6.png', num: 1, selected: true }
      ],
    });
    this.getTotalPrice();
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
      if (detailList[i].selected) {                     // 判断选中才会计算价格
        total += detailList[i].num * detailList[i].price;   // 所有价格加起来
      }
    }
    this.setData({                                // 最后赋值到data中渲染到页面
      detailList: detailList,
      totalPrice: total.toFixed(2)
    });
  },
 
 
})