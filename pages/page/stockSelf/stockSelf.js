// pages/page/stockSelf/stockSelf.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    status5: true, ///待付款
    status6: true,  //待取货--
    status7: true,  //交易成功
    status8: true,  //交易关闭
    //取消订单
    reason: [{ title: "我不想买了", selected: true }, { title: "信息填写错误，重新拍", selected: false }, { title: "卖家缺货", selected: false }, { title: "同城见面交易", selected: false }, { title: "其他", selected: false }],
    cancelIndex: 0
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
    let num = this.data.num,
      index = this.data.cancelIndex;
    app.http.requestAll("/api/order/" + num + "/cancel", {
      reason: this.data.reason[index].title
    }, "PUT").then((res) => {
      wx.showToast({
        title: res.message,
        icon: 'none'
      })
      this.afterOperation();
    })
  },
  //上传还款凭证
  uploadVoucher() {
    let num = this.data.num;
    wx.navigateTo({
      url: '../../role/supplyVoucher/supplyVoucher?num' + num,
    })
  },
  //删除
  sureDel() {
    let num = this.data.num;

      app.http.deleteRequest("/api/order/" + num).then((res) => {
        wx.showToast({
          title: res.message,
          icon: 'none'
        })
        this.afterOperation();
      })
  },

  //刷新数据
  afterOperation() {
    this.closeModal();
    setTimeout(() => {
      this.getData();
    }, 800)
  },
  showModal(e) {
    let type = e.currentTarget.dataset.type;
    let num = e.currentTarget.dataset.num;
    let obj = {};
    switch (type) {
      case "goodCode":
        obj = {
          codeModal: true,
        }; break;
      // case 'sureGet':
      //   obj = {
      //     sureModal: true,
      //     sureNum: num,
      //   }; break;
      case 'del':
        obj = {
          delModal: true,
        }; break;
      case 'cancel':
        obj = {
          cancelModal: true,
        }; break;
      case 'after':
        obj = {
          afterModal: true,
          afterTel: e.currentTarget.dataset.tel
        };break;  
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


  getData(){
    let num = this.data.num;
    app.http.getRequest("/api/order/byordernumber/"+num).then((res)=>{

    })
    this.orderStatus()
  },
  //获取状态调整显示内容
  orderStatus(status, isForm) {
    let a = "closed"
    switch (a) {
      case "unpaid":
        wx.setNavigationBarTitle({
          title: "待付款"
        })
        this.setData({
          status5: false
        })
        break;
      case "paid":
        wx.setNavigationBarTitle({
          title: "已付款"
        })
        this.setData({
          status6: false
        })
        break;
      case "shipped":

        break;
      case "cancelled":

        break;
      case "closed":
        wx.setNavigationBarTitle({
          title: "已关闭"
        })
        this.setData({
          status8: false,
          allStatus: true
        })
        break;
      case "finish":
        wx.setNavigationBarTitle({
          title: "已完成",
        })
        this.setData({
          status7: false,
          allStatus: true
        })
        break;
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let num = options.num
    this.getData()

    this.setData({
      order: {
        "goodsInfos": [
          {
            "orderDetails": [
              {
                "id": 53,
                "orderDetailNumber": "201809071509355464096",
                "orderNumber": "1037961561102090240",
                "skuCode": "180831183155243d4de6_793",
                "goodsId": "180831183155243d4de6",
                "goodsName": " BR4066 L码",
                "num": 2,
                "unitPrice": 500,
                "amount": 1000,
                "marketPrice": 500,
                "sellPrice": 500,
                "wholesalePrice": 300,
                "cover": null,
                "goodsDesc": null
              },
              {
                "id": 54,
                "orderDetailNumber": "201809071509355474096",
                "orderNumber": "1037961561102090240",
                "skuCode": "180831183155243d4de6_8a1",
                "goodsId": "180831183155243d4de6",
                "goodsName": "短袖T恤",
                "num": 2,
                "unitPrice": 600,
                "amount": 1200,
                "marketPrice": 600,
                "sellPrice": 600,
                "wholesalePrice": 400,
                "cover": null,
                "goodsDesc": null
              }
            ],
            "goodsId": "180831183155243d4de6",
            "goodsName": "阿迪达斯ADIDAS 2018夏季",
            "goodEnName": "adidas",
            "mainImgUrl": "http://img2.imgtn.bdimg.com/it/u=1758226492,603315287&fm=214&gp=0.jpg"
          }
        ],
        "storeInfo": {
          "storeId": "123",
          "storeName": "三只松鼠",
          "storeEnName": "three",
          "logo": "松鼠logo",
          "merchantNumber": "04958613",
          "openingTime": "7:00-15:00",
          "servicePhone": "18231565894",
          "wechatNumber": "wechart1",
          "address": "北京海淀"
        },
        "userInfo": {
          "userId": "2a9153bffb2bdcf5cedc92019fbba79b",
          "userName": "16888888888",
          "nickName": "youkedmin"
        },
        "receiveMerchant": {
          "merchantNumber": "04958613"
        },
        "receiptInfo": null,
        "postageinfo": {
          "postageType": "0",
          "postagePrice": 10
        },
        "consigneeInfo": {
          "provinceCode": null,
          "province": null,
          "cityCode": null,
          "city": null,
          "countyCode": null,
          "county": null,
          "detailAddress": "北京市朝阳区望京sohu t1 502",
          "userName": "老王",
          "userPhone": "8888888888",
          "postCode": "00000"
        },
        "id": 33,
        "orderNumber": "1037961561102090240",
        "orderAmount": 2210,
        "timeoutExpress": 72,
        "timeoutExpressType": "hour",
        "timeoutExpressSecond": 2592000,
        "timeoutDate": 1538896295000,
        "orderStatus": "cancelled",
        "orderStatusChildSta": "cancelled",
        "userMemo": "请尽快出货",
        "num": 4,
        "totalRefundAmount": null,
        "totalRefundTimes": null,
        "bizSystemNo": "00",
        "payAmount": null,
        "payDate": null,
        "payWay": null,
        "sort": 0,
        "orderType": "2",
        "orderCategory": "3",
        "claimGoodsNum": null,
        "cancelReason": "不想要了",
        "closedReason": null,
        "expressStatus": null,
        "expressNumber": null,
        "expressCompany": null,
        "createDate": 1536304295000,
        "finishTime": null
      }
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