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
    activeSkuList: []
  },
  // 关闭弹框
  closeFrame: function() {
    this.setData({
      showFrame: true
    })
  },
  // edit
  editGoods(){
    let obj = {
      activityNumber: this.data.activityNumber,
      goodsId: this.data.goodsId 
    }
    let acArr = [];
    this.data.activeSkuList.forEach(el=>{
      acArr.push({
        activityNumber: this.data.activityNumber,
        activityPrice: el.surePrice ? el.surePrice : el.sellPrice,
        batchNum: el.buyNum?el.buyNum:0,
        goodsActNumber: el.goodsActNumber ? el.goodsActNumber:'',
        goodsId: this.data.goodsId,
        skuCode: el.skuCode,
        stockNum: el.sureNum ? el.sureNum:0
      })
    })
    obj.goodsActivityPromotionVOList = acArr
    console.log(obj)
    API.editActiveGoods(obj).then(res=>{

    })
  },
  // 获取详情
  getDetail(){
    API.getActiveGoodsDetail({ activityNumber: this.data.activityNumber, goodsId: this.data.goodsId}).then(res=>{
      this.setData({
        goods:res.obj.goodsVO,
        skuList: res.obj.goodsVO.goodsSkuVOList,
        activeSkuList: res.obj.goodsActivityRelationVOS
      })
      let allArr = this.data.skuList
      let acArr = this.data.activeSkuList
      if(allArr.length>0){  // 有sku
        allArr.forEach(el => {
          acArr.forEach(acitem => {
            if (acitem.skuCode == el.skuCode) {
              acitem.hasIt = true
              el.checked = true
            }
          })
        })

        this.setData({ activeSkuList: acArr })
      } else {  // 无sku
        this.setData({noSku: true})
      }
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
    let acArr = []
    this.data.activeSkuList.forEach(el=>{
      acArr.push(el.skuCode)
    })
    wx.navigateTo({
      url: '../choseSpec/choseSpec?goodsId=' + this.data.goodsId + '&activityNumber=' + this.data.activityNumber+'&acArr='+ JSON.stringify(acArr),
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
      case 'price':
        this.setData({
          ['activeSkuList[' + e.currentTarget.dataset.index +'].surePrice'] : parseInt(val)
        })
        break;  
      case 'stockNum':
        
        this.setData({
          ['activeSkuList[' + e.currentTarget.dataset.index + '].sureNum']: parseInt(val)
        })
        break; 
      case 'buyNum':
        this.setData({
          ['activeSkuList[' + e.currentTarget.dataset.index + '].buyNum']: parseInt(val)
        })
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
    if(arr.length>0){
      arr.forEach(checkel => {
        let hasarr = this.data.activeSkuList.filter(el => el.skuCode == checkel.skuCode)
        if (hasarr.length==0){
        } else {

        }
      })
    } else {
      this.setData({
        activeSkuList: []
      })
    }

    this.setData({
      activeSkuList: arr
    })
   
  },
  remarkSkuList(acArr, allArr){
    if (allArr.length > 0) {  // 有sku
      allArr.forEach(el => {
        acArr.forEach(acitem => {
          if (acitem.skuCode == el.skuCode) {
            acitem.hasIt = true
            el.checked = true
          }
        })
      })
      this.setData({ activeSkuList: acArr })
    } else {  // 无sku
      this.setData({ noSku: true })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      activityNumber: options.activityNumber,
      goodsId: options.goodsId
      // activityNumber: 1903280301000012,
      // goodsId: 180929212000
    })
    this.getDetail()
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