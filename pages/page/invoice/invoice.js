// pages/invoice/invoice.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataInvoice:[
      { title: "不开发票", selected: true },
      { title: "个人", selected: false },
      { title: "普通发票", selected: false },
      { title: "增值税专用发票", selected:false},
    ],
    ordinary:true,
    com:true,
  },
  selectList(e){
    const index1=e.currentTarget.dataset.index;
    let dataInvoice=this.data.dataInvoice;
    var array=this.data.dataInvoice
    array.forEach((item,index,arr)=>{
      var sItem="dataInvoice["+index+"].selected"
      this.setData({
        [sItem]:false,
      })
    })
    if (index1 == 3) {
      this.setData({
        com: false,
        ordinary: true,
      })
    }else if(index1==2){
      this.setData({
        com: true,
        ordinary: false,
      })
    }else{
      this.setData({
        com:true,
        ordinary: true,
      })
    }
    dataInvoice[index1].selected = true
    
    this.setData({
      dataInvoice: dataInvoice
    })
  },
  addWrite(e){
    wx.navigateTo({
      url: '../address/address', 
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