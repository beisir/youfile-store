// distribution/pages/purchase/outHouseSkuSet/outHouseSkuSet.js
import Api from '../../../../utils/api.js'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseUrl: app.globalData.imageUrl,
    chosedhouseIndex: 0,
    diffNum: 0
  },
  // 输入
  watchInput(e) {
    let flowindex = e.currentTarget.dataset.index,
      regionindex = e.currentTarget.dataset.regionindex
    this.setData({
      ['goods.adviceSkuList[' + this.data.skuIndex + '].warehouseList[' + this.data.chosedhouseIndex + '].regionList[' + regionindex + '].flowList[' + flowindex + '].adviceOutNum']: e.detail.value
    })
  },
  checkNum(e) {
    let flowindex = e.currentTarget.dataset.index,
      regionindex = e.currentTarget.dataset.regionindex,
      itemStocknum = this.data.goods.adviceSkuList[this.data.skuIndex].warehouseList[this.data.chosedhouseIndex].regionList[regionindex].flowList[flowindex].inRemainNum,
      nowVal = e.detail.value
    if (!nowVal) {
      nowVal = 0
    } else if (nowVal > itemStocknum) {
      nowVal = itemStocknum
    }
    this.setData({
      ['goods.adviceSkuList[' + this.data.skuIndex + '].warehouseList[' + this.data.chosedhouseIndex + '].regionList[' + regionindex + '].flowList[' + flowindex + '].adviceOutNum']: nowVal
    }, () => {
      this.reCalcGoods()
    })
  },
  // 点击加减按钮
  changeNumBtn(e) {
    let type = e.currentTarget.dataset.type,
      flowindex = e.currentTarget.dataset.index,
      regionindex = e.currentTarget.dataset.regionindex,
      itemnum = this.data.goods.adviceSkuList[this.data.skuIndex].warehouseList[this.data.chosedhouseIndex].regionList[regionindex].flowList[flowindex].adviceOutNum

    itemnum = itemnum ? itemnum : 0
    if (type === 'add') {
      itemnum++
    } else if (type === 'reduce') {
      itemnum != 0 ? itemnum-- : itemnum = 0
    }
    this.setData({
      ['goods.adviceSkuList[' + this.data.skuIndex + '].warehouseList[' + this.data.chosedhouseIndex + '].regionList[' + regionindex + '].flowList[' + flowindex + '].adviceOutNum']: itemnum
    }, () => {
      this.reCalcGoods()
    })
  },
  reCalcGoods() {
    // 计算仓库选中个数
    let house = this.data.goods.adviceSkuList[this.data.skuIndex].warehouseList[this.data.chosedhouseIndex]
    let houseSetNum = 0
    house.regionList.forEach(regionItem => {
      let regionSetNum = 0
      regionItem.flowList.forEach(flowItem => {
        if (!flowItem.adviceOutNum) {
          flowItem.adviceOutNum = 0
        }
        regionSetNum += parseInt(flowItem.adviceOutNum)
      })
      regionItem.setNum = parseInt(regionSetNum)
      houseSetNum += parseInt(regionSetNum)
    })
    house.setNum = houseSetNum
    this.setData({
      ['goods.adviceSkuList[' + this.data.skuIndex + '].warehouseList[' + this.data.chosedhouseIndex + ']']: house
    }, () => {
      // 计算全部
      let allNum = 0
      this.data.goods.adviceSkuList[this.data.skuIndex].warehouseList.forEach(house => {
        allNum += parseInt(house.setNum)
      })
      let needNum = this.data.goods.adviceSkuList[this.data.skuIndex].needOutNum
      this.setData({
        ['goods.adviceSkuList[' + this.data.skuIndex + '].setNum']: allNum,
        diffNum: Math.abs(needNum - allNum)
      })
    })
  },
  send() {
    this.eventChannel.emit('getSkuData', {
      data: 'test'
    });
  },
  choseHouse(e) {
    this.setData({
      chosedhouseIndex: e.currentTarget.dataset.index
    })
  },
  sure() {
    if (this.data.goods.adviceSkuList[this.data.skuIndex].needOutNum == this.data.goods.adviceSkuList[this.data.skuIndex].setNum) {
      this.eventChannel.emit('getSkuData', {
        skuIndex: this.data.skuIndex,
        goodsIndex: this.data.goodsIndex,
        sku: this.data.goods.adviceSkuList[this.data.skuIndex]
      });
      wx.navigateBack()
    } else {
      Api.showToast('请设置正确的待出库数量')
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.eventChannel = this.getOpenerEventChannel()
    this.eventChannel.on('sendSkuData', (data) => {
      this.setData({
        goods: JSON.parse(JSON.stringify(data.goods)),
        skuIndex: data.skuIndex,
        goodsIndex: data.goodsIndex,
      })
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})