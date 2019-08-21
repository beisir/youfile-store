// distribution/pages/purchase/choseGoodsDetail/choseGoodsDetail.js
import Api from '../../../../utils/api.js'
import {
  regTest
} from '../../../../utils/util.js'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseUrl: app.globalData.imageUrl,
    nowIndex: 0, //当前选中sku
    totalPrice: 0, //总价
    totalNum: 0 //总数
  },
  // 点击加减按钮
  changeNumBtn(e) {
    let type = e.currentTarget.dataset.type
    if (type === 'add' || type === 'reduce') {
      let thisindex = e.currentTarget.dataset.index,
        itemnum = this.data.skuPriceNumList[this.data.nowIndex].secondSku[thisindex].num

      itemnum = itemnum ? itemnum : 0
      if (type === 'add') {
        itemnum++
      } else if (type === 'reduce') {
        itemnum != 0 ? itemnum-- : itemnum = 0
      }
      this.setData({
        ['skuPriceNumList[' + this.data.nowIndex + '].secondSku[' + thisindex + '].num']: itemnum
      }, () => {
        this.reCalcGoods()
      })
    } else if (type === 'allreduce' || type === 'alladd') {
      let secondArr = this.data.skuPriceNumList[this.data.nowIndex].secondSku
      if (type === 'allreduce') {
        secondArr.forEach(el => {
          if (el.num && el.num > 0) {
            el.num--
          } else {
            el.num = 0
          }
        })
      } else {
        secondArr.forEach(el => {
          if (el.num || el.num === 0) {
            el.num++
          } else {
            el.num = 0
          }
        })
      }
      this.setData({
        ['skuPriceNumList[' + this.data.nowIndex + '].secondSku']: secondArr
      }, () => {
        this.reCalcGoods()
      })
    }
  },
  // 监听输入数量采购价
  watchInput(e) {
    let val = e.detail.value,
      firstIndex = this.data.nowIndex,
      secIndex = e.currentTarget.dataset.index,
      type = e.currentTarget.dataset.type
    let funobj = {
      price: () => {
        this.setData({
          ['skuPriceNumList[' + firstIndex + '].secondSku[' + secIndex + '].price']: val
        }, () => {
          this.reCalcGoods()
        })
      },
      num: () => {
        this.setData({
          ['skuPriceNumList[' + firstIndex + '].secondSku[' + secIndex + '].num']: val
        }, () => {
          this.reCalcGoods()
        })
      },
      commonPrice: () => {
        this.setData({
          commonPrice: val
        })
      },
      commonNum: () => {
        this.setData({
          commonNum: val
        })
      }
    }
    funobj[type]()
  },
  // 失去焦点校验值
  checkInput(e) {
    let val = e.detail.value,
      type = e.currentTarget.dataset.type
    let funobj = {
      num: () => {
        let firstIndex = this.data.nowIndex,
            secIndex = e.currentTarget.dataset.index
        if (!/^(0 | [1 - 9][0 - 9]*)$/.test(val) && val !==''){
          this.setData({
            ['skuPriceNumList[' + firstIndex + '].secondSku[' + secIndex + '].num']: parseInt(val)
          })    
        }
      },
      price: () => {
        let firstIndex = this.data.nowIndex,
          secIndex = e.currentTarget.dataset.index
        if (!regTest({
            str: val,
            type: 'money'
          })) {
          this.setData({
            ['skuPriceNumList[' + firstIndex + '].secondSku[' + secIndex + '].price']: 0
          }, () => {
            this.reCalcGoods()
            Api.showToast('采购价应为整数或至多两位小数')
          })
        }
      },
      commonPrice: () => {
        if (!regTest({
            str: val,
            type: 'money'
          })) {
          this.setData({
            commonPrice: ''
          }, () => {
            this.reCalcGoods()
            Api.showToast('采购价应为整数或至多两位小数')
          })
        }
      }
    }
    funobj[type]()
  },
  // 计算数量以及总数量
  reCalcGoods() {
    let nowItem = this.data.skuPriceNumList[this.data.nowIndex],
      totalNum = 0,
      totalPrice = 0,
      itemTotalNum = 0,
      itemTotalPrice = 0
    nowItem.secondSku.forEach(el => {
      if (el.num !== '' && el.price !== '') {
        itemTotalNum += parseInt(el.num)
        itemTotalPrice += el.num * el.price
      }
    })
    this.setData({
      ['skuPriceNumList[' + this.data.nowIndex + '].num']: parseInt(itemTotalNum),
      ['skuPriceNumList[' + this.data.nowIndex + '].totalPrice']: itemTotalPrice,
    }, () => {
      // 总和
      this.data.skuPriceNumList.forEach(el => {
        totalNum += parseInt(el.num) ? el.num : 0
        totalPrice += el.totalPrice ? el.totalPrice : 0
      })
      this.setData({
        totalNum: parseInt(totalNum),
        totalPrice: totalPrice,
      })
    })
  },
  // 获取商品详情
  getGoodsDetail() {
    Api.adminGetDetails({
      goodsId: this.data.goodsId
    }).then(res => {
      // goods
      this.setData({
        goods: res.obj
      })
      // sku
      let skulist = res.obj.goodsSpecificationVOList ? res.obj.goodsSpecificationVOList : [],
        allSkuObj = this.handeltotalSku(res.obj.goodsSkuVOList)
      let skuPriceNumList = [] // 组合列表
      let firstSkuTitle = "", // 第一sku标题
        secondSkuTitle = "" // 第二sku标题
      let skuType = false
      let oldStatus = this.reshowGoodsNum() //旧记录
      switch (skulist.length) {
        case 1: //单条sku
          skuType = 'one'
          firstSkuTitle = skulist[0].specName
          if (oldStatus) {
            skuPriceNumList = oldStatus
          } else {
            skuPriceNumList = skulist[0].goodsSpecificationValueVOList
            skuPriceNumList.forEach(el => {
              el.secondSku = [{
                specValueName: '默认',
                lastPurchasePrice: allSkuObj[el.specValueCode].lastPurchasePrice,
                stockNum: allSkuObj[el.specValueCode].stockNum,
                skuCode: allSkuObj[el.specValueCode].skuCode,
                num: 0,
                price: 0
              }]
            })
          }
          break;
        case 2: //双条sku
          skuType = 'two'
          firstSkuTitle = skulist[0].specName
          secondSkuTitle = skulist[1].specName
          if (oldStatus) {
            skuPriceNumList = oldStatus
          } else {
            skuPriceNumList = skulist[0].goodsSpecificationValueVOList
            skuPriceNumList.forEach(el => {
              let secondArr = JSON.parse(JSON.stringify(skulist[1].goodsSpecificationValueVOList))
              secondArr.forEach(sec => {
                let nowItem = allSkuObj[el.specValueCode + "|" + sec.specValueCode] || allSkuObj[sec.specValueCode + "|" + el.specValueCode]
                if (!nowItem){return}
                sec.lastPurchasePrice = nowItem.lastPurchasePrice
                sec.stockNum = nowItem.stockNum
                sec.skuCode = nowItem.skuCode
                sec.num = 0
                sec.price = 0
              })
              el.secondSku = secondArr
            })
          }
          break;
        default: //无sku
          skuType = false
          if (oldStatus) {
            skuPriceNumList = oldStatus
          } else {
            skuPriceNumList = [{
              specValueName: '默认',
              secondSku: [{
                specValueName: '默认',
                lastPurchasePrice: this.data.goods.lastPurchasePrice,
                stockNum: this.data.goods.stockNum,
                num: 0,
                price: 0
              }]
            }]
          }
          break;
      }
      this.setData({
        skuType,
        skuPriceNumList,
        firstSkuTitle,
        secondSkuTitle
      }, () => {
        if (oldStatus) {
          this.reCalcGoods()
        }
      })
      // 总合并sku列表
    })
  },
  // 处理全部sku列表 重组为obj方便定位 减少循环
  handeltotalSku(skuList) {
    if (!skuList) {
      return {}
    }
    let obj = {}
    skuList.forEach((el, index) => {
      obj[el.specValueCodeList.join('|')] = el
    })
    return obj
  },
  // 点击sku按钮
  skuClick(e) {
    setTimeout(()=>{
      this.setData({
        nowIndex: e.currentTarget.dataset.index
      })
    }, 300)
  },
  showModal() {
    this.setData({
      settingsModal: true,
      commonPrice: '',
      commonNum: ''
    })
  },
  closeModal() {
    this.setData({
      settingsModal: false
    })
  },
  sureCommonSet() {
    this.closeModal()
    let comNum = this.data.commonNum !== '' ? parseInt(this.data.commonNum) : false,
      conPri = this.data.commonPrice !== '' ? this.data.commonPrice : false
    let arr = this.data.skuPriceNumList[this.data.nowIndex].secondSku
    arr.forEach(el => {
      if (comNum !== false) {
        el.num = comNum
      }
      if (conPri !== false) {
        el.price = conPri
      }
    })
    this.setData({
      ['skuPriceNumList[' + this.data.nowIndex + '].secondSku']: arr
    }, () => {
      this.reCalcGoods()
    })
  },
  reshowGoodsNum() {
    let goodsObj = wx.getStorageSync('purchaseGoods')
    if (goodsObj && goodsObj[this.data.goods.id]) {
      return goodsObj[this.data.goods.id].skuPriceNumList
    } else {
      return false
    }
  },
  sureGoods() {
    let goodsObj = wx.getStorageSync('purchaseGoods') ? wx.getStorageSync('purchaseGoods'):{},
      skuPriceNumList = this.data.skuPriceNumList,
      nowItem = {
        skuPriceNumList,
        goods: this.data.goods,
        price: this.data.totalPrice,
        num: this.data.totalNum,
        skuNum: this.data.skuType
      }
    if (this.data.totalNum > 0){
      goodsObj[this.data.goodsId] = nowItem
      wx.setStorageSync('purchaseGoods', goodsObj)
    } else {
      if (goodsObj[this.data.goodsId]){
        delete goodsObj[this.data.goodsId]
        wx.setStorageSync('purchaseGoods', goodsObj)
      }
    }
    wx.navigateBack()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      goodsId: options.goodsId
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
    this.getGoodsDetail()
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