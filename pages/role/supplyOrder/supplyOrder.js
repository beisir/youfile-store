// pages/order/order.js
const app = getApp();
var seeImg = false;
import API from '../../../utils/api.js';
let timer;
import { saveFormID } from '../../../utils/modelMsg.js'
Page({

  /**
   * 页面的初始数据
   */
  // 0待付款 1待发货 2待填表  3待收货   4供货成功 5 交易关闭  6自提待付款 7自提待取货 8交易供货自提 9自提交易关闭
  data: {
    showList: [],
    hasList: false,
    nav: [{
      title: "全部",
      state: 'all'
    }, {
      title: "待付款",
      state: 'unpaid'
    }, {
      title: "待发货",
        state: "wait_deliver"
    }, {
      title: "待收货",
        state: "delivered"
    }, {
      title: "已完成",
      state: "finish"
    }],
    reason: [{ title: "无法联系上买家", selected: true }, { title: "买家误拍或重拍", selected: false }, { title: "买家无诚意完成交易", selected: false }, { title: "缺货无法交易", selected: false }, { title: "其他原因", selected: false }],
    navindex: 0,
    cancelIndex: 0,
    inputActive: 'inputActive ',
    style: false,
    whitch: 'all' //切换

  },
  // 发货
  sendOutGoods(e) {
    let type = e.currentTarget.dataset.type,
      num = e.currentTarget.dataset.num
    wx.navigateTo({
      url: '/distribution/pages/purchase/outHouse/outHouse?orderNum=' + num + '&orderType=' + type,
    })
  },
  // 埋点存储formid
  getFormId(e) {
    saveFormID(e)
  },
  // 监听输入
  watchInput(e) {
    let type = e.currentTarget.dataset.type;
    let key = "";
    switch (type) {
      case "change":
        key = 'changeMoney';
        let nowMoney = Number(e.detail.value),
          order = Number(this.data.thisOrderMoney),
          moneyIcon = "-";
        if (nowMoney > order) {
          moneyIcon = "+"
        }
        this.setData({
          moneyIcon: moneyIcon
        })
        break;
      case "goodCode": key = "getGoodCode"; break;
      case "exCom": key = "expressageCom"; break;
      case "exCode": key = "expressageCode"; break;
    }

    let val = e.detail.value
    if (key == "changeMoney") {
      this.setData({
        showChangeMoney: Number(val).toFixed(2)
      })
    }
    this.setData({
      [key]: val
    })
  },
  showModal(e) {
    let type = e.currentTarget.dataset.type;
    let num = e.currentTarget.dataset.num;
    let obj = {};
    switch (type) {
      case "change":
        obj = {
          changeModal: true,
          changeNum: num,
          changeMoney: 0,
          showChangeMoney: 0,
          moneyIcon: "-",
          thisOrderMoney: e.currentTarget.dataset.change
        }; break;
      case "goodCode":
        obj = {
          codeModal: true,
          testNum: num,
          getGoodCode: ""
        }; break;
      case "ex2":
        obj = {
          expressage: true,
          exNum: num,
          expressageCom: "",
          expressageCode: "",
          noBtn: true
        }; break;
      case "ex":
        obj = {
          expressage: true,
          exNum: num,
          expressageCom: "",
          expressageCode: "",
          noBtn: false
        }; break;
      case 'sureGet':
        obj = {
          sureModal: true,
          sureNum: num,
        }; break;
      case 'del':
        obj = {
          delModal: true,
          delNum: num
        }; break;
      case 'cancel':
        obj = {
          cancelModal: true,
          closeNum: num
        }; break;
    }
    this.setData(obj)
  },
  //查看凭证
  seeVoucher(e) {
    let num = e.currentTarget.dataset.num;
    API.seeVoucher({ orderNumber: num }).then((res) => {
      if (res.obj.payVoucher) {
        seeImg = true;
        wx.previewImage({
          urls: [this.data.baseUrl + res.obj.payVoucher]
        })
      } else {
        API.showToast('未上传付款凭证')
      }
    })
  },

  // 验证取货码
  testCode() {
    let num = this.data.testNum;
    let money = this.data.getGoodCode;
    if (!money || money < 0) {
      API.showToast('请输入验证码')
      return
    }
    API.testGoodCode({
      orderNumber: num,
      claimGoodsNum: money
    }).then((res) => {
      this.afterOperation();
      API.showToast(res.message)
    })
  },

  // 取消订单
  sureCancel() {
    let num = this.data.closeNum,
      index = this.data.cancelIndex;
    API.closeOrder({
      reason: this.data.reason[index].title,
      orderNumber: num
    }).then((res) => {
      this.afterOperation();
      API.showToast(res.message)
    })
  },
  //取消理由
  swichReason(e) {
    var current = e.currentTarget.dataset.current;
    var array = this.data.reason
    array.forEach((item, index, arr) => {
      if (current == index) {
        item.selected = true;
      } else {
        item.selected = false;
      }
    })
    this.setData({
      reason: array,
      cancelIndex: current
    })
  },
  
  // 我要发货
  // 待填表
  sendGoods(e) {
    let type = e.currentTarget.dataset.type,
      num = this.data.exNum,
      obj = {
        orderNumber: num
      };
    if (type == 'no') {
      //不填单发货
    } else {
      //填单发货
      obj.expressCompany = this.data.expressageCom;
      obj.expressNumber = this.data.expressageCode;
      if (!obj.expressNumber) {
        API.showToast("请填写运单号")
        return
      }
    }
    API.addExpress(obj).then((res) => {
      this.afterOperation();
      API.showToast(res.message)
    })

  },
  // 整体改价
  sureChange() {
    let num = this.data.changeNum;
    let money = this.data.changeMoney;
    if (!money || money <= 0) {
      API.showToast('请输入金额')
      return
    }
    API.updatetotal({
      orderNumber: num,
      orderAmount: money
    }).then((res) => {
      this.afterOperation();
      API.showToast(res.message)
    })
  },
  //确认收款
  receiveMoney(e) {
    let num = this.data.sureNum;
    app.http.requestAll("/admin/order/orderpayment/" + num + "/confirm", {
      orderNumber: num
    }, "POST").then((res) => {
      API.showToast(res.message)
      this.afterOperation();
    })
  },
  // 保存备注
  saveRemark(e) {
    let val = e.detail.value;
    API.addRemark({
      orderNumber: this.data.num,
      remark: val
    }).then(res => {
      API.showToast(res.message)
      if (res.success) {

      }
    })
  },

  //刷新数据
  afterOperation() {
    this.closeModal();
    setTimeout(() => {
      this.getList(true);
    }, 800)
  },
  closeModal() {
    this.setData({
      changeModal: false,  //改价
      codeModal: false,  //取货码
      sureModal: false,  //收款
      delModal: false,  //删除
      cancelModal: false, //取消订单
      expressage: false, //发货
    })
  },
  //切换导航
  swichNav(e) {
    var current = e.currentTarget.dataset.current;
    var state = e.currentTarget.dataset.state;
    if (current == this.data.navindex) {
      return false;
    } else {
      this.setData({
        navindex: current,
        whitch: state,
        showList: []
      })
    }
    this.getList(true);
  },

 
  
  searchBtn(e) {
    clearTimeout(timer);
    this.setData({
      style: true,
      keyword: e.detail.value
    })
    timer = setTimeout(() => {
      this.getList(true);
    }, 1000)
  },

  //获取订单列表
  getList(re) {
    if(re){
      app.pageRequest.pageData.pageNum = 0;
      this.setData({
        showList: []
      })
    }
    app.pageRequest.pageGet("/admin/order/store/" + this.data.storeId+"/ordercategory/1/orderstatus/" + this.data.whitch, {
      keyWords: this.data.keyword ? this.data.keyword : ""
    }).then((res) => {
      if (!res.obj || !res.obj.result){return}
      this.setData({
        showList: this.data.showList.concat(res.obj.result)
      })
    })

  },
 
  //跳转
  toOrderDetail(e) {
    let type = e.currentTarget.dataset.type,
      status = e.currentTarget.dataset.status,
      num = e.currentTarget.dataset.num,
    //   url = "";
    // //是否自提
    // switch (type) {
    //   case '1':
    //     url = "../supplySelf/supplySelf?status=";
    //     break;
    //   case '2':
    //     url = "../supplyDetails/supplyDetails?status=";
    //     break;
    // }
    // url += status;
    // url += '&num=' + num;

    url = "../allOrder/allOrder";
    //是否自提
    switch (type) {
      case '1':
        //url = "../orderSelf/orderSelf?status=";
        url += "?self=true";
        break;
      case '2':
        //url = "../orderDetails/orderDetails?status=";
        url += "?self=false";
        break;
    }
    url += "&status=" + status;
    url += '&num=' + num;
    url += "&type=list"
    wx.navigateTo({
      url
    })
  },
  initListType(type){
    let list = this.data.nav;
    let currentIndex = 2;
    list.forEach((i,index)=>{
      if (i.state == type){
        currentIndex = index
      }
    })
    this.setData({
      navindex: currentIndex,
      whitch: type,
      showList: []
    })
  },
  /**
  * 生命周期函数--监听页面加载
  */
  onLoad: function (options) {
    this.setData({
      storeId: API.getThisStoreId(),   //列表请求
      baseUrl: app.globalData.imageUrl      //图片
    })
    if(options.navType){
      this.initListType(options.navType)
    }
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
    if (seeImg) {
      seeImg = false;
      return;
    }
    this.getList(true);
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
    this.getList()
  },


})