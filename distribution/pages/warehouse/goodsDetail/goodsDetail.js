// distribution/pages/warehouse/goodsDetail/goodsDetail.js
import { tabSelceted} from '../../../../distribution/static/js/common.js'
import Api from '../../../../utils/api.js'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseUrl: app.globalData.imageUrl,
    tabType: 'house',
    sureWare: { name: "全部仓库", code: '' },
    dayList: [{
      name: '近七天',
      type: 'day',
      day: 7,
      selected: true
    }, {
      name: '近30天',
      type: 'day',
      day: 30
    }, {
      name: '自定义',
      type: 'own'
    }],
    flowtab: [{
      name: "全部",
      selected: true,
      type: ""
    }, {
      name: "入库",
      type: "in"
    }, {
      name: "出库",
      type: "out"
    }]
  },
  switchChange(e){
    this.setData({
      merger: e.detail.value
    })
  },
  tabtab(e){
    let thisindex = e.currentTarget.dataset.index,
        arr = this.data.dayList;

    if (arr[thisindex].type === 'day') {
      this.clearDate()
    }
    tabSelceted(thisindex, arr, 'dayList', this) 
    this.setData({ dataFilterType: arr[thisindex].type }, () => {
      this.reflow(true)
    })
  },
  choseflowtab(e){
    tabSelceted(e.currentTarget.dataset.index, this.data.flowtab, 'flowtab',this)    
  },
  clearDate() {
    this.setData({
      endTime: '',
      startTime: ''
    })
  },
  tabclick(e) {
    let type = e.currentTarget.dataset.type
    this.setData({
      tabType: type
    })
  },
  bindDateChange(e) {
    let type = e.currentTarget.dataset.type,
      obj = {}
    if (type === 'start') {
      obj.startTime = e.detail.value
    } else if (type === 'end') {
      obj.endTime = e.detail.value
    }
    this.setData(obj)
  },
  getDetail(){
    Api.getGoodswareHouseDetail({ goodsId: this.data.goodsId}).then(res=>{
      this.setData({
        goods: res.obj.goods
      })
      let goodsMsg = res.obj.goods,
          regionList = res.obj.regionStockList,
          allSkuList = goodsMsg.goodsSkuVOList,
          skuItemList = goodsMsg.goodsSpecificationVOList
      if (goodsMsg.goodsSpecificationVOList){
        // 有一类或两类规格
        // 取sku名字
        let skuListObj = {}
        skuItemList.forEach(sku=>{
          sku.goodsSpecificationValueVOList.forEach(skuitem=>{
            skuListObj[skuitem.specValueCode] = skuitem
          })
        })
        // 合并的SKUcode对象
        let allSkuObj = {}
        allSkuList.forEach(sku=>{
          if(sku.specValueCodeList[0]){
            sku.myResetSku = []
            sku.myResetSku[0] = skuListObj[sku.specValueCodeList[0]]
          }
          if(sku.specValueCodeList[1]){
            sku.myResetSku[1]= skuListObj[sku.specValueCodeList[1]]
          }
          allSkuObj[sku.skuCode] = sku
        })
        
        // 会填到合并列表
        let mergeGoods = res.obj.skuStockList
        let mergeList = this.mergeGoods(mergeGoods, allSkuObj, true)

        // 回填到仓库sku列表
        regionList.forEach(house=>{
          let stockList = house.stockList
          house.resetGoodsList = this.mergeGoods(stockList, allSkuObj)
        })
        
        this.setData({
          regionList,
          mergeList,
          totalNum: res.obj.totalNum
        })
      } else {
        this.setData({
          regionList,
          mergeList: res.obj.skuStockList,
          totalNum: res.obj.totalNum,
          noSku: true
        })
      }
    })
  },
  mergeGoods(stockList, allSkuObj,totalNum){
    let reGoodsObj = {}
    stockList.forEach((goods, index) => {
      if (allSkuObj[goods.skuCode]) {
        goods.myResetSku = allSkuObj[goods.skuCode].myResetSku
        // 第一sku相同的话，放到一个数组里面
        let firstSkuCode = goods.myResetSku[0].specValueCode
        if (reGoodsObj[firstSkuCode]) {
          reGoodsObj[firstSkuCode].push(goods)
        } else {
          reGoodsObj[firstSkuCode] = [goods]
        }
      }
    })
    let resetGoodsList = []
    for (let key in reGoodsObj) {
      let allnum = 0
      reGoodsObj[key].forEach(el => {
        if (totalNum){
          allnum += el.totalNum ? el.totalNum : 0
        } else {
          allnum += el.stockNum ? el.stockNum : 0
        }
      })
      resetGoodsList.push({
        firstSku: reGoodsObj[key][0].myResetSku[0],
        goodsList: reGoodsObj[key],
        allnum
      })
    }
    return resetGoodsList
  },
  // 流水
  getFlow(re){
    if (re) {
      app.pageRequest.pageData.pageNum = 0;
      this.setData({
        flow: []
      })
    }
    let data = {
      goodsId: this.data.goodsId,
      changeType: this.data.flowtab.filter(el => el.selected)[0].type
    }
    let day = this.data.dayList.filter(el=> el.selected)[0]
    if(day.day){
      data.latestDay = day.day
    } else {
      data.dateFrom = this.data.startTime
      data.dateTo = this.data.endTime
    }
    data.warehouseCode = this.data.sureWare.code
    Api.wareHouseGoodsFlow(data).then(res=>{
      this.setData({
        flow: this.data.flow.concat(res.obj.result)
      })
    })
  },
  getWarehouse(){
    Api.getWarehouseList().then(res => {
      let arr = [{ name: "全部仓库", code:''}]
      this.setData({
        wareHouse: arr.concat(res.obj)
      })
    })
  },
  setHouse(e){
    this.setData({
      sureWare: this.data.wareHouse[e.detail.value]
    },()=>{
      this.reflow(true)
    })
  },
  reflow(){
    this.getFlow(true)
  },
  editWare(e){
    console.log(e.currentTarget.dataset)
    wx.navigateTo({
      url: '../adjustStorck/adjustStorck?code=' + e.currentTarget.dataset.code + '&num=' + e.currentTarget.dataset.num + '&name=' + e.currentTarget.dataset.name,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    options.id = 190716159400  //delit
    // options.id = 190516152500 // 双
    // options.id = 190302125700 // 无
    this.setData({
      goodsId: options.id
    })
    this.getDetail()
    
    this.getWarehouse()
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
    let query = wx.createSelectorQuery()
    query.select("#filter").boundingClientRect()
    query.exec((res) => {
      console.log(res)
      this.setData({
        menuTop: res[0].top
      })
    })

    this.getFlow(true)
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
    if (this.data.tabType === 'flow'){
      this.getFlow()
    }
  },
  onPageScroll: function(e) {
    e.scrollTop > this.data.menuTop ? this.setData({
      menuFixed: true
    }) : this.setData({
      menuFixed: false
    })
  }
})