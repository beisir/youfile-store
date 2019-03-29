// pages/mallActive/editGoods/editGoods.js
import API from '../../../utils/api.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsId: "181105902000",
    showFrame: true,
    discount: [{
      name: '9折',
      value: 0.9
    }, {
      name: '8折',
      value: 0.8
    }, {
      name: '7折',
      value: 0.7
    }, {
      name: '6折',
      value: 0.6
    }, {
      name: '5折',
      value: 0.5
    }, {
      name: '4折',
      value: 0.4
    }, {
      name: '3折',
      value: 0.3
    }, {
      name: '2折',
      value: 0.2
    }],
    ownCut: '',
    activeSkuList: [{ id: 111, name: '黄', price: '222', num: '111' }, { id: 222, name: '123', price: '33333', num: '11'}]
  },
  // 关闭弹框
  closeFrame: function() {
    this.setData({
      showFrame: true
    })
  },
  // 折扣
  discountGoods: function() {
    this.setData({
      showFrame: false
    })
  },
  chooseOff(e) {
    let thisindex = e.currentTarget.dataset.index
    let arr = this.data.discount;
    arr.forEach((el, index) => {
      if (index == thisindex) {
        el.checked = true
      } else {
        el.checked = false
      }
    })
    this.setData({
      discount: arr
    })
  },
  sureDiscount() {
    let cut = this.data.ownCut;
    if (cut) {
      if (cut > 0 && cut < 10) {
        this.cutPrice(cut / 10)
      } else {
        API.showToast("请输入正确折扣值，大于0小于10")
        return
      }
    } else {
      let arr = this.data.discount.filter(el => el.checked)
      if (arr[0]) {
        this.cutPrice(arr[0].value)
      } else {
        API.showToast("请选择折扣，或输入自定义折扣")
        return
      }
    }
    this.closeModal()
  },
  cutPrice(discount) {
    if (discount && discount > 0 && discount < 1) {
      let arr = this.data.activeSkuList;
      arr.forEach(el=>{
        el.surePrice = (el.price * discount).toFixed(2)
      })
      this.setData({ activeSkuList: arr})
      console.log(discount)
    } else {
      API.showToast("折扣值错误，请重新选择")
    }
  },
  // 选择规格
  choiceSpec: function() {
    wx.navigateTo({
      url: '../choseSpec/choseSpec?sku=' + JSON.stringify(this.data.activeSkuList),
    })
  },
  watchInput(e) {
    let val = e.detail.value,
      type = e.currentTarget.dataset.type,
      obj = {};
    switch (type) {
      case 'ownCut':
        obj.ownCut = val
        let arr = this.data.discount;
        arr.forEach(el=>{el.checked = false})
        obj.discount = arr
        break;
    }
    this.setData(obj)
  },
  stopScroll() {
    return
  },
  closeModal() {
    this.setData({
      showFrame: true
    })
  },
  getSku(arr){
    console.log(arr)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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
    wx.setNavigationBarTitle({
      title: '活动商品设置',
    })
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