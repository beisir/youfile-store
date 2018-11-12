// pages/cloudOrder/myOrder/myOrder.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
  },

  getData(){
    app.http.getRequest("/api/yunstore/order/user/page/orderstatus/all").then(res=>{
      wx.showToast({
        title: res.message,
        icon:'none'
      })
      if(res.success){
        this.setData({
          msg:res.obj
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData()

   
    let obj = {
      "code": "0",
      "message": "查询成功",
      "obj": {
        "result": [
          {
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
              "invoiceCategory": "普通发票",
              "invoiceTitle": "123",
              "identificationNumber": "123",
              "registeredAddress": null,
              "registererMobile": null,
              "depositBank": null,
              "depositBankNumber": null
            },
            "merchantNumber": null,
            "orderNumber": "1059351782951485440",
            "orderAmount": 7660,
            "timeoutExpress": 72,
            "timeoutExpressType": "hour",
            "timeoutExpressSecond": 258462,
            "timeoutDate": 1541663322000,
            "orderStatus": "unpaid",
            "orderStatusChildSta": "unpaid",
            "userMemo": null,
            "num": 1,
            "bizSystemNo": "03",
            "payAmount": null,
            "payDate": null,
            "payWay": null,
            "sort": 0,
            "createDate": 1541404122000,
            "finishDate": null,
            "payVoucher": null,
            "remark": null,
            "yunStoreGoodsSnapshot": {
              "id": "YSG1007",
              "classifyNumber": "SC003",
              "classifyName": "新批零独立专业版",
              "serviceFee": 9960,
              "favourablePrice": 7660,
              "discountAmount": 2300,
              "serviceReriod": 2,
              "serviceReriodType": 0,
              "serviceReriodMonth": 24,
              "promotionCode": "123"
            }
          }
        ],
        "totalCount": 1
      },
      "success": true
    }
    this.setData({
      list: obj.obj.result
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


})