// pages/order/order.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  // 0待付款 1已付款 2待收货 3交易成功 4交易关闭  5自提待付款 6自提待取货 7交易成功自提 8自提交易关闭
  data: {
    hasList: false, 
    nav: [{ title: "全部" }, { title: "待付款" }, { title: "已付款" }, { title: "待收货" }, { title: "已完成" }],
    reason: [{ title: "我不想买了", selected: true }, { title: "信息填写错误，重新拍", selected: false }, { title: "卖家缺货", selected: false }, { title: "同城见面交易", selected: false }, { title: "其他", selected: false}],
    navindex:0,
    inputActive:'inputActive ',

    whitch:'all',
    cancelIndex:0

  },


  showModal(e){
    let type = e.currentTarget.dataset.type,
        num = e.currentTarget.dataset.num,
        obj = {};
    switch(type){
      case "code" : 
        obj={
          codeModal: true,
          codeNum: e.currentTarget.dataset.code
        }
        break;
      case 'get' : 
        obj={
          sureModal: true,
          getNum: e.currentTarget.dataset.num
        };break;
      case 'del':
        let index = e.currentTarget.dataset.index;
        obj = {
          delModal: true,
          delNum: { num: num, index: index }
        } ;break;
      case 'cancel':
        obj = {
          cancelModal: true,
          cancelNum: num
        }; break;
      case 'after':
        obj = {
          afterModal: true,
          afterTel: e.currentTarget.dataset.tel
        }  
    }
    this.setData(obj)
  },
  closeModal() {
    this.setData({
      codeModal: false,  //取货码
      sureModal: false,  //收款
      delModal: false,  //删除
      cancelModal: false, //取消订单
      afterModal: false //售后
    })
  },

  // 确认收货
  sureSure(e) {
    let num = this.data.getNum;
    app.http.requestAll("/api/order/" + num + "/receive", {}, "PUT").then((res) => {
      wx.showToast({
        title: res.message,
        icon: 'none'
      })
    })
  },
  //删除
  sureDel() {
    let del = this.data.delNum,
      list = this.data.showList;

    if (del) {
      app.http.deleteRequest("/api/order/" + del.num).then((res) => {
        wx.showToast({
          title: res.message,
          icon: 'none'
        })
        //删除成功剔除
        if (code == 0) {
          list.splice(del.index, 1);
          this.setData({
            showList: list
          })
        }
      })
    }
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
  sureCancel() {
    let num = this.data.cancelNum,
      index = this.data.cancelIndex;
    app.http.requestAll("/api/order/" + num + "/cancel", {
      reason: this.data.reason[index].title
    }, "PUT").then((res) => {
      wx.showToast({
        title: res.message,
        icon: none
      })
    })
  },


  //刷新数据
  afterOperation() {
    this.closeModal();
    setTimeout(() => {
      this.getList();
    }, 800)
  },
  // 切换列表
  swichNav(e) {
    var current = e.currentTarget.dataset.current;
    if (current == this.data.navindex) {
      return false;
    } else {
      this.setData({
        navindex: current,
      })
      let whitch = 'all';
      switch (current) {
        case 0: whitch = 'all'; break;
        case 1: whitch = "unpaid"; break;
        case 2: whitch = 'paid'; break;
        case 3: whitch = 'shipped'; break;
        case 4: whitch = 'finish'; break;
      }
      this.setData({
        whitch
      })
      this.getList();
    }
  },


  //跳转
  toOrderDetail(e){
    let type = e.currentTarget.dataset.type,
      status = e.currentTarget.dataset.status,
      num = e.currentTarget.dataset.num,
        url = "";
    //是否自提
    switch (type){
      case '1': url = "../self/self?status=";break;
      case '2': url = "../nopay/nopay?status="; break;
    }
    //状态
    // 0待付款 1已付款 2待收货 3交易成功 4交易关闭  5自提待付款 6自提待取货 7交易成功自提 8自提交易关闭
    switch (status){
      case "unpaid" : 
        type == 1 ? url += "5" : url += "0";break;
      case "paid" :
        type == 1 ? url += "6" : url += "1"; break;
      case "shipped":
        url += "2"; break;
      case "closed":
        type == 1 ? url += "8" : url += "4"; break;
      case "finish":
        type == 1 ? url += "7" : url += "3"; break;    
    }
    url += '&num=' + num;
    wx.navigateTo({
      url
    })
  },
  //获取订单列表
  getList(){
    app.http.getRequest("/api/order/store/" + this.data.storeId +"/ordercategory/3/orderstatus/" + this.data.whitch+"/user/1111",{
      // pageNum:1,
      // pageSize:5
    }).then((res) => {
      //this.resetData(res.obj.result);
      this.resetData(this.data.orderList.obj.result)
    })
    
  },
  resetData(data){
    let arr = [];
    for(let i =0; i<data.length;i++){ // 循环订单
      let oldGoods = data[i].goodsInfos,  //商品数组
          newGoods = [];
      for (let j = 0; j < oldGoods.length;j++){ //货品循环
        
        let type = oldGoods[j].orderDetails;  //规格数组
        
        for(let k = 0;k < type.length;k++){
          //当前货物,类型变为对象
          let nowGood = {};  
          Object.assign(nowGood,oldGoods[j]);
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
      showList:arr
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      storeId : wx.getStorageSync("storeId")
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },
  clickInput:function(event){
    this.setData({
      inputActive: ''
    });
  },
  
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getList();
    
    this.setData({
      orderList: {
        "code": 0,
        "message": "string",
        "obj": {
          "result": [
            {
              "bizSystemNo": "string",
              "cancelReason": "string",
              "claimGoodsNum": "1",
              "closedReason": "string",
              "expressCompany": "string",
              "expressNumber": "string",
              "expressStatus": "string",
              "goodsInfos": [
                {
                  "goodEnName": "脉动",
                  "goodsId": 1000001,
                  "goodsName": "脉动",
                  "mainImgUrl": "脉动",
                  "orderDetails": [
                    {
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
                    }
                  ],
                  "qrcode": "脉动",
                  "storeId": "脉动"
                }, {
                  "goodEnName": "脉动",
                  "goodsId": 1000001,
                  "goodsName": "脉动",
                  "mainImgUrl": "脉动",
                  "orderDetails": [
                    {
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
                }
              ],
              "id": 1,
              "num": 0,
              "orderAmount": 1000001,
              "orderCategory": "string",
              "orderNumber": 1000001,
              "orderStatus": "paid",
              "orderType": "1",
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
            },
            {
              "bizSystemNo": "string",
              "cancelReason": "string",
              "claimGoodsNum": "string",
              "closedReason": "string",
              "expressCompany": "string",
              "expressNumber": "string",
              "expressStatus": "string",
              "goodsInfos": [
                {
                  "goodEnName": "脉动",
                  "goodsId": 1000001,
                  "goodsName": "脉动",
                  "mainImgUrl": "脉动",
                  "orderDetails": [
                    {
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
                    }
                  ],
                  "qrcode": "脉动",
                  "storeId": "脉动"
                }
              ],
              "id": 1,
              "num": 0,
              "orderAmount": 1000001,
              "orderCategory": "string",
              "orderNumber": 1000001,
              "orderStatus": "shipped",
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
            },
            {
              "bizSystemNo": "string",
              "cancelReason": "string",
              "claimGoodsNum": "string",
              "closedReason": "string",
              "expressCompany": "string",
              "expressNumber": "string",
              "expressStatus": "string",
              "goodsInfos": [
                {
                  "goodEnName": "脉动",
                  "goodsId": 1000001,
                  "goodsName": "脉动",
                  "mainImgUrl": "脉动",
                  "orderDetails": [
                    {
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
                    }
                  ],
                  "qrcode": "脉动",
                  "storeId": "脉动"
                }
              ],
              "id": 1,
              "num": 0,
              "orderAmount": 1000001,
              "orderCategory": "string",
              "orderNumber": 1000001,
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
            },
            {
              "bizSystemNo": "string",
              "cancelReason": "string",
              "claimGoodsNum": "string",
              "closedReason": "string",
              "expressCompany": "string",
              "expressNumber": "string",
              "expressStatus": "string",
              "goodsInfos": [
                {
                  "goodEnName": "脉动",
                  "goodsId": 1000001,
                  "goodsName": "脉动",
                  "mainImgUrl": "脉动",
                  "orderDetails": [
                    {
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
                    }
                  ],
                  "qrcode": "脉动",
                  "storeId": "脉动"
                }
              ],
              "id": 1,
              "num": 0,
              "orderAmount": 1000001,
              "orderCategory": "string",
              "orderNumber": 1000001,
              "orderStatus": "closed",
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
            },
            {
              "bizSystemNo": "string",
              "cancelReason": "string",
              "claimGoodsNum": "string",
              "closedReason": "string",
              "expressCompany": "string",
              "expressNumber": "string",
              "expressStatus": "string",
              "goodsInfos": [
                {
                  "goodEnName": "脉动",
                  "goodsId": 1000001,
                  "goodsName": "脉动",
                  "mainImgUrl": "脉动",
                  "orderDetails": [
                    {
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
                    }
                  ],
                  "qrcode": "脉动",
                  "storeId": "脉动"
                }
              ],
              "id": 1,
              "num": 0,
              "orderAmount": 1000001,
              "orderCategory": "string",
              "orderNumber": 1000001,
              "orderStatus": "closed",
              "orderType": "1",
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
            },
            {
              "bizSystemNo": "string",
              "cancelReason": "string",
              "claimGoodsNum": "string",
              "closedReason": "string",
              "expressCompany": "string",
              "expressNumber": "string",
              "expressStatus": "string",
              "goodsInfos": [
                {
                  "goodEnName": "脉动",
                  "goodsId": 1000001,
                  "goodsName": "脉动",
                  "mainImgUrl": "脉动",
                  "orderDetails": [
                    {
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
                    }
                  ],
                  "qrcode": "脉动",
                  "storeId": "脉动"
                }
              ],
              "id": 1,
              "num": 0,
              "orderAmount": 1000001,
              "orderCategory": "string",
              "orderNumber": 1000001,
              "orderStatus": "finish",
              "orderType": "1",
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
            },
            {
              "bizSystemNo": "string",
              "cancelReason": "string",
              "claimGoodsNum": "string",
              "closedReason": "string",
              "expressCompany": "string",
              "expressNumber": "string",
              "expressStatus": "string",
              "goodsInfos": [
                {
                  "goodEnName": "脉动",
                  "goodsId": 1000001,
                  "goodsName": "脉动",
                  "mainImgUrl": "脉动",
                  "orderDetails": [
                    {
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
                    }
                  ],
                  "qrcode": "脉动",
                  "storeId": "脉动"
                }
              ],
              "id": 1,
              "num": 0,
              "orderAmount": 1000001,
              "orderCategory": "string",
              "orderNumber": 1000001,
              "orderStatus": "shipped",
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
            },
            {
              "bizSystemNo": "string",
              "cancelReason": "string",
              "claimGoodsNum": "string",
              "closedReason": "string",
              "expressCompany": "string",
              "expressNumber": "string",
              "expressStatus": "string",
              "goodsInfos": [
                {
                  "goodEnName": "脉动",
                  "goodsId": 1000001,
                  "goodsName": "脉动",
                  "mainImgUrl": "脉动",
                  "orderDetails": [
                    {
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
                    }
                  ],
                  "qrcode": "脉动",
                  "storeId": "脉动"
                }
              ],
              "id": 1,
              "num": 0,
              "orderAmount": 1000001,
              "orderCategory": "string",
              "orderNumber": 1000001,
              "orderStatus": "paid",
              "orderType": "1",
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
            },
            {
              "bizSystemNo": "string",
              "cancelReason": "string",
              "claimGoodsNum": "string",
              "closedReason": "string",
              "expressCompany": "string",
              "expressNumber": "string",
              "expressStatus": "string",
              "goodsInfos": [
                {
                  "goodEnName": "脉动",
                  "goodsId": 1000001,
                  "goodsName": "脉动",
                  "mainImgUrl": "脉动",
                  "orderDetails": [
                    {
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
                    }
                  ],
                  "qrcode": "脉动",
                  "storeId": "脉动"
                }
              ],
              "id": 1,
              "num": 0,
              "orderAmount": 1000001,
              "orderCategory": "string",
              "orderNumber": 1000001,
              "orderStatus": "unpaid",
              "orderType": "1",
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
            }
          ],
          "totalCount": 0
        },
        "success": true
      }
    })
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