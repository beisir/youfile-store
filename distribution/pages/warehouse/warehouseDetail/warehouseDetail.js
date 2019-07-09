// distribution/pages/warehouse/warehouseDetail/warehouseDetail.js
import Api from '../../../../utils/api.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    formData: {
      warningGoods: false,
      filterZero: false
    },
    classList: [{
      name: '男装'
    }, {
      name: '女装'
    }, {
      name: '女装'
    }, {
      name: '女装'
    }, {
      name: '女装'
    }, {
      name: '女装'
    }],
    warehouseList: [{
      name:'123',
    }]
  },
  search() {
    
  },
  // 获取列表
  getHouseList() {
    Api.getWarehouseList().then(res=> {

    })
  },
  // 获取详情
  getHouseMsg() {
    Api.getWarehouseMsg({code: 1}).then(res => {

    })
  },
  showFilter() {
    const side = this.selectComponent('#side')
    side.show()
  },
  selectClass(e) {
    let thisindex = e.currentTarget.dataset.index
    this.setData({
      ["classList[" + thisindex + "].selected"]: !this.data.classList[thisindex].selected
    })
  },
  switchChange(e) {
    let type = e.currentTarget.dataset.type,
      obj = {}
    switch (type) {
      case "warning":
        obj = {
          ["formData.warningGoods"]: e.detail.value
        }
        break;
      case "zero":
        obj = {
          ["formData.filterZero"]: e.detail.value
        }
        break;
    }
    this.setData(obj)
  },
  sureForm() {
    let arr = this.data.classList.filter(el => el.selected)
  },
  resetForm() {
    let arr = this.data.classList
    arr.forEach(el => {
      el.selected = false
    })
    this.setData({
      formData: {
        warningGoods: false,
        filterZero: false
      },
      classList: arr
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getHouseList()
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