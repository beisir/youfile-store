// pages/addressWe/addressWe.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[
      { title: "晨晨", phone: 13133337898, adress: "北京市朝阳区三环到四环之间 左安门时点新坐标家园（方庄东 路西）10AM新坐标",selected:true},
      { title: "晨晨", phone: 13133337898, adress: "北京市朝阳区三环到四环之间 左安门时点新坐标家园（方庄东 路西）10AM新坐标",selected: false },
      { title: "晨晨", phone: 13133337898, adress: "北京市朝阳区三环到四环之间 左安门时点新坐标家园（方庄东 路西）10AM新坐标",selected: false }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },
  selectList(e){
    const index1=e.currentTarget.dataset.index;
    var array = this.data.list
    array.forEach((item, index, arr) => {
      var sItem = "list[" + index + "].selected"
      this.setData({
        [sItem]: false,
      })
    })
    array[index1].selected = true
    this.setData({
      list: array
    })
  },
  // 删除
  deleteList(e) {
    const index = e.currentTarget.dataset.index;
    let detailList = this.data.list;
    detailList.splice(index, 1);
    this.setData({
      list: detailList
    });
    wx.showToast({
      title: '删除成功',
      icon: 'success',
      duration: 2000
    })
  },
  newAddress(e){
    wx.navigateTo({
      url: '../newAddress/newAddress',
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