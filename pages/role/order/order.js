// pages/order/order.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  // 0待付款 1已付款 2待填表  3已发货   4交易成功 5 交易关闭  6自提待付款 7自提已付款 8交易成功自提 9自提交易关闭
  data: {
    hasList: false,
    nav: [{
      title: "全部",
      state: 'all'
    }, {
      title: "待付款",
      state: 'unpaid'
    }, {
      title: "已付款",
      state: "paid"
    }, {
      title: "待收货",
      state: "shipped"
    }, {
      title: "已完成",
      state: "finish"
    }],
    reson: [{
      title: "无法联系上买家",
      selected: true
    }, {
      title: "买家误拍或重拍",
      selected: false
    }, {
      title: "买家无诚意完成交易",
      selected: false
    }, {
      title: "缺货无法交易",
      selected: false
    }, {
      title: "其他",
      selected: false
    }],
    navindex: 0,
    cancelIndex:0,
    inputActive: 'inputActive ',
    hidden: false,
    value: '',
    style: false,
    //加载列表种类
    whitch: 'all',
    //弹框
    changeModal: false,
    changeMoney: 0,
    //取货码
    getGoodCode: "",
    //快递
    expressageCom:"",
    expressageCode: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },
  //查看凭证
  seeVoucher(e){
    let num = e.currentTarget.dataset.num;
    app.http.getRequest("/admin/order/orderpayment/"+num).then((res)=>{
        if(res.obj){
          // wx.previewImage({
          //   current: current, // 当前显示图片的http链接
          //   urls: this.data.imgalist // 需要预览的图片http链接列表
          // })
        }
    })
    

  },
  sureSelectAreaListener: function(e) {
    var that = this;
    that.setData({
      show: false
    })
  },
  // 监听输入
  watchInput(e) {
    let type = e.currentTarget.dataset.type;
    let key = "";
    switch (type) {
      case "change": key = 'changeMoney'; break;
      case "goodCode" : key = "getGoodCode";break;
      case "exCom": key = "expressageCom";break;
      case "exCode": key = "expressageCode"; break;
    }

    this.setData({
      [key]: e.detail.value
    })
  },
  showModal(e){
    let type = e.currentTarget.dataset.type;
    let num = e.currentTarget.dataset.num;
    let obj = {};
    switch (type) {
      case "change": 
        obj = {
          changeModal: true,
          changeNum: num,
          changeMoney: ""
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
          noBtn:true
        }; break;
      case "ex": 
        obj = {
          expressage: true,
          exNum: num,
          expressageCom:"",
          expressageCode:"",
          noBtn: false
        }; break;
      case 'sureGet':
        obj = {
          sureModal: true,
          sureNum: num,
        }; break;
      case 'del' :
        obj = {
          delModal: true,
          delNum: num
        };break;
      case 'cancel': 
        obj = {
          cancelModal: true,
          closeNum: num
        };break;  
    }
    this.setData(obj)
  },
  closeModal(){
    this.setData({
      changeModal:false,  //改价
      codeModal:false,  //取货码
      sureModal:false,  //收款
      delModal: false,  //删除
      cancelModal: false, //取消订单
      expressage: false, //发货
    })
  },
  // 整体改价
  sureChange(){
    let num = this.data.changeNum;
    let money = this.data.changeMoney;
    if (!money || money < 0){
      wx.showToast({
        title: '请输入金额',
        icon: 'none'
      })
      return
    }
    app.http.requestAll("/admin/order/" + num + "/updatetotal", {
      orderNumber: num,
      orderAmount: money
    }, "PUT").then((res) => {
      this.afterOperation();
      wx.showToast({
        title: res.message,
        icon: 'none'
      })
    })
  },
  // 验证取货码
  testCode(){
    let num = this.data.testNum;
    let money = this.data.getGoodCode;
    if (!money || money < 0) {
      wx.showToast({
        title: '请输入验证码',
        icon: 'none'
      })
      return
    }
    app.http.requestAll("/admin/order/" + num + "/claim", {
        orderNumber : num ,
        claimGoodsNum : money
    }, "PUT").then((res) => {
      wx.showToast({
        title: res.message,
        icon: 'none'
      })
    })
  },
  //确认收款
  receiveMoney(e){
    let num = this.data.sureNum;
    app.http.requestAll("/admin/order/orderpayment/" + num + "/confirm", {
      orderNumber: num
    }, "POST").then((res) => {
      wx.showToast({
        title: res.message,
        icon: 'none'
      })
      this.afterOperation();
    })
  },
  // 我要发货
  // 待填表
  sendGoods(e){
    let type = e.currentTarget.dataset.type,
        num = this.data.exNum,
        obj = {
          orderNumber :num
        };
    if(type == 'no'){
      //不填单发货
    }else{
      //填单发货
      obj.expressCompany = this.data.expressageCom;
      obj.expressNumber = this.data.expressageCode;
      if (!obj.expressNumber){
        wx.showToast({
          title: "请填写运单号",
          icon: 'none'
        })
        return
      }
    }
    app.http.putRequest("/admin/order/" + num + "/addexpress", obj).then((res) => {
      this.afterOperation();
      wx.showToast({
        title: res.message,
        icon: 'none'
      })
    })
    
  },
  //删除订单
  delOrder(e) {
    let num = this.data.delNum;
    app.http.deleteRequest("/api/order/"+num).then((res) => {
      this.afterOperation();
      wx.showToast({
        title: res.message,
        icon: 'none'
      })
    })
    
  },
  // 取消订单
  sureCancel(){
    let num = this.data.closeNum,
      index = this.data.cancelIndex;
    app.http.requestAll("/admin/order/" + num + "/closed", {
      reason: this.data.reson[index].title
    }, "PUT").then((res) => {
      this.afterOperation();
      wx.showToast({
        title: res.message,
        icon: 'none'
      })
    })
  },
  afterOperation(){
    this.closeModal();
    setTimeout(()=>{
      this.getList();
    },800)
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
        whitch:state
      })
    }
    this.getList();
  },
 
  //取消理由
  swichReason(e){
    var current = e.currentTarget.dataset.current;
    var array = this.data.reson
    array.forEach((item, index, arr) => {
      if (current == index){
        item.selected = true;
      }else{
        item.selected = false;
      }
    })
    this.setData({
      reson: array,
      cancelIndex: current
    })
  },
  //跳转
  toOrderDetail(e) {
    let type = e.currentTarget.dataset.type,
      status = e.currentTarget.dataset.status,
      num = e.currentTarget.dataset.num,
      url = "";
    //是否自提
    switch (type) {
      case '1':
        url = "../orderSelf/orderSelf?status=";
        break;
      case '2':
        url = "../orderDetails/orderDetails?status=";
        break;
    }
    //状态
    // 0待付款 1已付款 2待收货 3交易成功 4交易关闭  5自提待付款 6自提待取货 7交易成功自提 8自提交易关闭
    // 0待付款 1已付款 2待填表  3已发货   4交易成功 5 交易关闭  6自提待付款 7自提已付款 8交易成功自提 9自提交易关闭

    switch (status) {
      case "unpaid":
        type == 1 ? url += "5" : url += "0";
        break;
      case "paid":
        type == 1 ? url += "6" : url += "1";
        break;
      case "shipped":
        url += "2";
        break;
      case "closed":
        type == 1 ? url += "8" : url += "4";
        break;
      case "finish":
        type == 1 ? url += "7" : url += "3";
        break;
    }
    url += '&num=' + num;
    wx.navigateTo({
      url
    })
  },
  //获取订单列表
  getList() {
    app.http.getRequest("/admin/order/store/123/ordercategory/3/orderstatus/" + this.data.whitch, {
       //pageNum:1,
       pageSize:100
    }).then((res) => {
      this.resetData(res.obj.result);
      //this.resetData(this.data.orderList.obj.result)
    })

  },
  resetData(data) {
    let arr = [];
    for (let i = 0; i < data.length; i++) { // 循环订单
      let oldGoods = data[i].goodsInfos, //商品数组
        newGoods = [];
      for (let j = 0; j < oldGoods.length; j++) { //货品循环

        let type = oldGoods[j].orderDetails; //规格数组

        for (let k = 0; k < type.length; k++) {
          //当前货物,类型变为对象
          let nowGood = {};
          Object.assign(nowGood, oldGoods[j]);
          nowGood.orderDetails = type[k];
          newGoods.push(nowGood);
        }
      }
      //编辑新订单数组
      let newOrder = data[i];
      newOrder.goodsInfos = newGoods;
      arr.push(newOrder)
    }
    this.setData({
      showList: arr
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  searchBtn(e) {
    this.setData({
      style: true,
    })
  },
  
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.getList();

    this.setData({
      orderList: {
        "code": 0,
        "message": "string",
        "obj": {
          "result": [{
              "bizSystemNo": "string",
              "cancelReason": "string",
              "claimGoodsNum": "string",
              "closedReason": "string",
              "expressCompany": "string",
              "expressNumber": "string",
              "expressStatus": "string",
              "consigneeInfo": {
                "userName":'zzz',
                "ueerPhone":13333333333
              },
              "goodsInfos": [{
                "goodEnName": "脉动",
                "goodsId": 1000001,
                "goodsName": "脉动",
                "mainImgUrl": "脉动",
                "orderDetails": [{
                  "amount": 4.5,
                  "cover": "string",
                  "goodsDesc": "颜色:红色",
                  "goodsId": 1000001,
                  "goodsName": "脉动",
                  "id": 0,
                  "marketPrice": 4.5,
                  "num": 2,
                  "orderDetailNumber": 1000001,
                  "orderNumber": 1000001,
                  "sellPrice": 4.5,
                  "skuAmount": 4.5,
                  "skuCode": 1000001,
                  "wholesalePrice": 4.5
                }],
                "qrcode": "脉动",
                "storeId": "脉动"
              }, {
                "goodEnName": "脉动",
                "goodsId": 1000001,
                "goodsName": "脉动",
                "mainImgUrl": "脉动",
                "orderDetails": [{
                    "amount": 4.5,
                    "cover": "string",
                    "goodsDesc": "颜色:红色",
                    "goodsId": 1000001,
                    "goodsName": "脉动",
                    "id": 0,
                    "marketPrice": 4.5,
                    "num": 2,
                    "orderDetailNumber": 1000001,
                    "orderNumber": 1000001,
                    "sellPrice": 4.5,
                    "skuAmount": 4.5,
                    "skuCode": 1000001,
                    "wholesalePrice": 4.5
                  },
                  {
                    "amount": 4.5,
                    "cover": "string",
                    "goodsDesc": "颜色:蓝色",
                    "goodsId": 1000001,
                    "goodsName": "脉动",
                    "id": 0,
                    "marketPrice": 4.5,
                    "num": 2,
                    "orderDetailNumber": 1000001,
                    "orderNumber": 1000001,
                    "sellPrice": 4.5,
                    "skuAmount": 4.5,
                    "skuCode": 1000001,
                    "wholesalePrice": 4.5
                  },
                ],
                "qrcode": "脉动",
                "storeId": "脉动"
              }],
              "id": 1,
              "num": 0,
              "orderAmount": 1000001,
              "orderCategory": "string",
              "orderNumber": 1000001,
          //   "unpaid":
          //   "paid":
          //    "shipped":
          //    "closed":
          //  "finish":
            "orderStatus": "finish",
              "orderType": "2",
              "payAmount": 100,
              "payDate": "2018-09-06T02:53:22.470Z",
              "payWay": "string",
              "postageinfo": {
                "postagePrice": 0,
                "postageType": "string"
              },
              "receiptInfo": {
                "depositBank": "string",
                "depositBankNumber": "string",
                "identificationNumber": "string",
                "invoiceCategory": "string",
                "invoiceTitle": "string",
                "invoiceType": "string",
                "isInvoice": false,
                "registeredAddress": "string",
                "registererMobile": "string"
              },
              "sort": 0,
              "storeInfo": {
                "merchantNumber": 100001,
                "storeEnName": "nike",
                "storeId": 100001,
                "storeName": "耐克"
              },
              "timeoutDate": "2018-09-06T02:53:22.470Z",
              "timeoutExpress": 0,
              "timeoutExpressSecond": 0,
              "timeoutExpressType": "string",
              "totalRefundAmount": 0,
              "totalRefundTimes": 0,
              "userInfo": {
                "nickName": "string",
                "userId": 100011,
                "userName": "string"
              },
              "userMemo": "string"
          }],
          "totalCount": 0
        },
        "success": true
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})