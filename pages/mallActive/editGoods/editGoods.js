// pages/mallActive/editGoods/editGoods.js
const app = getApp()
import API from '../../../utils/api.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseUrl: app.globalData.imageUrl,
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
    activeSkuList: [],
    // 选择规格
    checkedNum: 0,
    // 无SKU
    noSkuPrich: 0,
    noSkuNum: 0,
    noSkuBuynum: 0
  },
  // 关闭弹框
  closeFrame: function () {
    this.setData({
      showFrame: true
    })
  },
  // edit
  editGoods() {
    let obj = {
      activityNumber: this.data.activityNumber,
      goodsId: this.data.goodsId
    }
    let err = '';

    if (this.data.noSku) {
      let price = this.data.noSkuPrich,
        num = this.data.noSkuNum,
        buyNum = this.data.noSkuBuynum;
      if (!buyNum || buyNum == 0) {
        err = '请填写起购量'
      }
      if(!num || num == 0){
        err = '请填写活动库存'
      }
      if (buyNum > num){
        err = '商品活动库存不能低于商品起购量'
      }
      if (num > this.data.goods.stockNum) {
        err = '商品活动库存不能超过商品库存'
      }
      if (!price || price == 0) {
        err = '请填写活动价格'
      } else {
        if (!/^(([1-9][0-9]*)|([0]\.\d?[0-9])|([1-9][0-9]*\.\d{1,2}))$/.test(price)) {
          err = '请输入正确金额格式，最多两位小数'
        }
      }

      if (price > this.data.goods.wholesalePrice){
        err = '商品活动价格不能超过商品批发价'
      }

      let noskuarr = [{
        activityNumber: this.data.activityNumber,
        activityPrice: price,
        batchNum: buyNum,
        goodsActNumber: this.data.noSkugoodsActNumber ? this.data.noSkugoodsActNumber : '',
        goodsId: this.data.goodsId,
        skuCode: '',
        stockNum: num
      }]
      obj.goodsActivityPromotionVOList = noskuarr
    } else {
      let acArr = [];
      this.data.skuList.forEach((el, index) => {
        if (el.checked && err == '') {
          if (!el.buyNum || el.buyNum == 0) {
            err = '商品规格' + (index + 1) + '：请填写起购量'
          }
          if (!el.sureNum || el.sureNum == 0) {
            err = '商品规格' + (index + 1) + '：请填写活动库存'
          }
          if (el.buyNum > el.sureNum) {
            err = '商品规格' + (index + 1) + '：商品活动库存不能低于商品起购量'
          }
          if (el.sureNum > el.stockNum) {
            err = '商品规格' + (index + 1) + '：商品活动库存不能超过商品库存'
          }
          if (!el.surePrice || el.surePrice == 0) {
            err = '商品规格' + (index + 1) + '：请填写活动价格'
          } else {
            if (!/^(([1-9][0-9]*)|([0]\.\d?[0-9])|([1-9][0-9]*\.\d{1,2}))$/.test(el.surePrice)) {
              err = '请输入正确金额格式，最多两位小数'
            }
          }  
          if (el.surePrice > el.wholesalePrice) {
            err = '商品规格' + (index + 1) + '：商品活动价格不能超过商品批发价'
          }

            acArr.push({
              activityNumber: this.data.activityNumber,
              activityPrice: el.surePrice ? el.surePrice : el.sellPrice,
              batchNum: el.buyNum ? el.buyNum : 0,
              goodsActNumber: el.goodsActNumber ? el.goodsActNumber : '',
              goodsId: this.data.goodsId,
              skuCode: el.skuCode,
              stockNum: el.sureNum ? el.sureNum : 0
            })
          }
        })

      obj.goodsActivityPromotionVOList = acArr
    }

    if (err) {
      API.showToast(err);
      return
    }

    API.editActiveGoods(obj).then(res => {
      API.showToast(res.message)
      setTimeout(() => {
        wx.navigateBack()
      }, 1000)
    })
  },
  // 获取详情
  getDetail() {
    API.getActiveGoodsDetail({ activityNumber: this.data.activityNumber, goodsId: this.data.goodsId }).then(res => {
      this.setData({
        goods: res.obj.goodsVO,
      })
      let allArr = res.obj.goodsVO.goodsSkuVOList
      let acArr = res.obj.goodsActivityRelationVOS
      this.handleSkuList(res.obj.goodsVO.goodsSpecificationVOList)
      if (allArr && allArr.length > 0) {  // 有sku
        allArr.forEach(el => {
          acArr.forEach(acitem => {
            if (acitem.skuCode == el.skuCode) {
              el.checked = true
              el.surePrice = acitem.goodsPromotionList[0].activityPrice
              el.sureNum = acitem.stockNum
              el.goodsActNumber = acitem.goodsActNumber
              el.buyNum = acitem.batchNum
            }
            acitem.hasIt = true
          })
        })

        this.setData({ activeSkuList: acArr, skuList: allArr })
        this.getCheckedNum()
      } else {  // 无sku
        this.setData({
          noSku: true,
          noSkuPrich: acArr[0].goodsPromotionList[0] ? acArr[0].goodsPromotionList[0].activityPrice : '',
          noSkuNum: acArr[0].stockNum,
          noSkuBuynum: acArr[0].batchNum,
          noSkugoodsActNumber: acArr[0].goodsActNumber
        })
      }
    })
  },
  handleSkuList(list){
    if(list && list.length>0){
      let obj = {}
      list.forEach(el=>{
        el.goodsSpecificationValueVOList.forEach(sku=>{
          obj[sku.specValueCode] = sku.specValueName
        })
      })
      this.setData({ skuNameList: obj })
    }
  },
  // 折扣
  discountGoods: function () {
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
      discount: arr,
      ownCut: ""
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
      let arr = this.data.skuList;
      arr.forEach(el => {
        el.surePrice = (el.wholesalePrice * discount).toFixed(2)
      })
      this.setData({ skuList: arr })
      console.log(discount)
    } else {
      API.showToast("折扣值错误，请重新选择")
    }
  },
  // 选择规格
  choiceSpec: function () {
    let acArr = []
    this.data.skuList.forEach(el => {
      if (el.checked) {
        acArr.push(el.skuCode)
      }
    })
    wx.navigateTo({
      url: '../choseSpec/choseSpec?goodsId=' + this.data.goodsId + '&activityNumber=' + this.data.activityNumber + '&acArr=' + JSON.stringify(acArr),
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
        arr.forEach(el => { el.checked = false })
        obj.discount = arr
        break;
      case 'price':
        this.setData({
          ['skuList[' + e.currentTarget.dataset.index + '].surePrice']: val
        })
        break;
      case 'stockNum':

        this.setData({
          ['skuList[' + e.currentTarget.dataset.index + '].sureNum']: parseInt(val)
        })
        break;
      case 'buyNum':
        this.setData({
          ['skuList[' + e.currentTarget.dataset.index + '].buyNum']: parseInt(val)
        })
        break;
      case 'noSku-price':
        obj.noSkuPrich = val
        break;
      case 'noSku-num':
        obj.noSkuNum = parseInt(val)
        break;
      case 'noSku-buynum':
        obj.noSkuBuynum = parseInt(val)
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
  getSku(arr) {
    let nowArr = this.data.skuList
    if (arr.length > 0) {
      arr.forEach(checkel => {
        switch (checkel.ownstatus) {
          case 'add':
            nowArr.forEach((el, index) => {
              if (el.skuCode === checkel.skuCode) {
                this.setData({
                  ['skuList[' + index + '].checked']: true
                })
              }
            })
            break;
          case 'del':
            nowArr.forEach((el, index) => {
              if (el.skuCode === checkel.skuCode) {
                this.setData({
                  ['skuList[' + index + '].checked']: false
                })
              }
            })
            break;
          case 'stay':

            break;
          case 'no':

            break;
        }
      })
    }

    this.getCheckedNum()
  },
  getCheckedNum() {
    let arr = this.data.skuList.filter(el => el.checked);
    this.setData({ checkedNum: arr.length })
  },
  remarkSkuList(acArr, allArr) {
    if (allArr.length > 0) {  // 有sku
      allArr.forEach(el => {
        acArr.forEach(acitem => {
          if (acitem.skuCode == el.skuCode) {
            el.checked = true
            el.surePrice = acitem.goodsPromotionList[0].activityPrice
            el.sureNum = acitem.stockNum
            el.goodsActNumber = acitem.goodsActNumber
            el.buyNum = acitem.batchNum
          }
          acitem.hasIt = true
        })
      })
    } else {  // 无sku
      this.setData({ noSku: true })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      activityNumber: options.activityNumber,
      goodsId: options.goodsId
      // activityNumber: 1904110301000031,
      // goodsId: 190411135300
    })
    this.getDetail()
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
    wx.setNavigationBarTitle({
      title: '活动商品设置',
    })
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

  }
})