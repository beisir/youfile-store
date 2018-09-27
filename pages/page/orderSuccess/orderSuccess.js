// pages/page/orderSuccess/orderSuccess.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
  },
  getData() {
    app.http.getRequest("/api/order/byordernumber/" + this.data.num).then((res) => {
      this.setData({
        user: res.obj,
      })
    })
  },
  toDetail(){
    let type = this.data.user.orderCategory; //订单分类[1 进货单|2 小云店订单|3 普通订单]
    let sendType = this.data.user.orderType; //订单类型[0 其他|1 门店自提|2 物流配送]
    let url = "";
    if (type == 1 && sendType == 1){
      url = "../stockSelf/stockSelf";
    }
    if (type == 1 && sendType == 2){
      url = "../stockDetail/stockDetail";
    }
    if (type == 3 && sendType == 1) {
      url = "../self/self";
    }
    if (type == 3 && sendType == 2) {
      url = "../nopay/nopay";
    }

    url += "?num="+this.data.num;

    wx.redirectTo({
      url: url
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    this.setData({
      num: options.num
    })
    this.getData();
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})