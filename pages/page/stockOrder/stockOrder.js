// pages/page/stockOrder/stockOrder.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userId: 111,
    //导航
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
    navindex: 0,
    whitch: 'all', //切换
    //理由
    reason: [{ title: "无法联系上买家", selected: true }, { title: "买家误拍或重拍", selected: false }, { title: "买家无诚意完成交易", selected: false }, { title: "缺货无法交易", selected: false }, { title: "其他", selected: false }],
    cancelIndex: 0,
   

  },
  
  
  showModal(e) {
    let type = e.currentTarget.dataset.type,
      num = e.currentTarget.dataset.num,
      obj = {};
    switch (type) {
      case "code":
        obj = {
          codeModal: true,
          codeNum: e.currentTarget.dataset.code
        }
        break;
      case 'get':
        obj = {
          sureModal: true,
          getNum: e.currentTarget.dataset.num
        }; break;
      case 'del':
        let index = e.currentTarget.dataset.index;
        obj = {
          delModal: true,
          delNum: { num: num, index: index }
        }; break;
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
      this.afterOperation();
      wx.showToast({
        title: res.message,
        icon: none
      })
    })
  },
  //上传还款凭证
  uploadVoucher(e){
    let num = e.currentTarget.dataset.num;
    wx.navigateTo({
      url: '../../role/supplyVoucher/supplyVoucher?num'+ num,
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
      this.afterOperation();
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



  //切换导航
  swichNav(e) {
    var current = e.currentTarget.dataset.current;
    var state = e.currentTarget.dataset.state;
    if (current == this.data.navindex) {
      return false;
    } else {
      this.setData({
        navindex: current,
        whitch: state
      })
    }
    this.getList();
  },
  searchBtn(e) {
    this.setData({
      style: true,
    })
  },

  //跳转
  toOrderDetail(e){
    let num = e.currentTarget.dataset.num,
      type = e.currentTarget.dataset.type,
      tourl="";
    if(type == 1){
      //自提
      tourl = "../stockSelf/stockSelf";
    }else{
      tourl = "../stockDetail/stockDetail";
    }  
    wx.navigateTo({
      url: tourl+"?num="+num,
    })
  }, 

  //刷新数据
  afterOperation() {
    this.closeModal();
    setTimeout(() => {
      this.getList();
    }, 800)
  },


  //获取订单列表
  getList() {
    
    app.http.getRequest("/api/order/store/123/ordercategory/1/orderstatus/" + this.data.whitch + "/user/" + this.data.userId, {
      //pageNum:1,
      //pageSize:100
    }).then((res) => {
      //this.resetData(res.obj.result);
      //this.resetData(this.data.orderList.obj.result)
      this.setData({
        showList: this.data.orderList.obj.result
        //showList: res.obj.result
      })
    })

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
              "userName": 'zzz',
              "ueerPhone": 13333333333
            },
            "orderStatusChildSta": "unForm",
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
            "num": 10,
            "orderAmount": 1000001,
            "orderCategory": "string",
            "orderNumber": 1000001,
            //   "unpaid":
            //   "paid":
            //    "shipped":
            //    "closed":
            //  "finish":
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
          }],
          "totalCount": 0
        },
        "success": true
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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
    this.getList();
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