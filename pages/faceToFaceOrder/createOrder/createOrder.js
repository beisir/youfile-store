// pages/faceToFaceOrder/createOrder/createOrder.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    warnText:""
  },
  watchInput(e){
    let type = e.currentTarget.dataset.type,
        val = e.detail.value,
        obj = {};
    switch(type){
      case "money":
        let m = /^(([1-9][0-9]*)|([0]\.\d{1,2})|([1-9][0-9]*\.\d{1,2}))$/.test(val);
        if(m){
          if (val <= 10000) {
            obj.warnText = false;
            obj.redColor = false;
          } else {
            obj.warnText = '单笔支付金额不可超过10000';
            obj.redColor = true
          }
          obj.money = val;  
        }else{
          obj.warnText = '请输入正确金额格式,最多两位小数';
          obj.redColor = true;          
        }
      break;
    }
    this.setData(obj)
  },
  addTip(){
    this.setData({
      
    })
  },
  tipShow(){
    this.selectComponent("#layer").open();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.tipShow()
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