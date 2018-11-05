// pages/cloudOrder/orderDetail/orderDetail.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },
  getData() {
    app.http.getRequest("/api/yunstore/order/"+this.data.num).then(res => {
      wx.showToast({
        title: res.message,
        icon: 'none'
      })
      if (res.success) {
        this.setData({
          msg: res.obj
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      num:options.num
    })
    this.getData();

    let obj = {
      "code": "0",
      "message": "用户获取云店铺订单信息成功",
      "obj": {
        "userInfoVO": {
          "userId": "cbced730cc43cead0592fbdd5ef10f99",
          "userName": "13363527425",
          "nickName": "youke7425",
          "mobile": "13363527425",
          "headPic": "youlife/20181016/7ccab9e9-2c9e-4b73-8977-a1c0d32a0584.jpg"
        },
        "receiptInfo": {
          "isInvoice": null,
          "invoiceType": null,
          "invoiceCategory": null,
          "invoiceTitle": "youlife",
          "identificationNumber": "123123",
          "registeredAddress": null,
          "registererMobile": null,
          "depositBank": null,
          "depositBankNumber": null
        },
        "merchantNumber": null,
        "orderNumber": "1058198780148449280",
        "orderAmount": 18640,
        "timeoutExpress": 72,
        "timeoutExpressType": "hour",
        "timeoutExpressSecond": 235549,
        "timeoutDate": 1541388424000,
        "orderStatus": "unpaid",
        "orderStatusChildSta": "unpaid",
        "userMemo": null,
        "num": 1,
        "bizSystemNo": "03",
        "payAmount": null,
        "payDate": null,
        "payWay": null,
        "sort": 0,
        "createDate": 1541129224000,
        "finishDate": null,
        "payVoucher": null,
        "remark": null,
        "yunStoreGoodsSnapshot": {
          "id": "YSG1011",
          "classifyNumber": "SC004",
          "classifyName": "新批零独立高级版",
          "serviceFee": 20940,
          "favourablePrice": 18640,
          "discountAmount": 2300,
          "serviceReriod": 3,
          "serviceReriodType": 0,
          "serviceReriodMonth": 36,
          "promotionCode": "123"
        }
      },
      "success": true
    }
    this.setData({
      msg: obj.obj
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

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

})