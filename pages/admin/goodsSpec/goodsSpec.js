const app = getApp();
import Api from '../../../utils/api.js'
import util from '../../../utils/util.js'
import GetTempList from '../specSet/getTempList.js'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    listData: [{
      specName: "颜色",
      goodsSpecificationValueVOList: []
    }],
    defaultName: '颜色',
    watchInput: false,
    unifiedSet: false,
    goodsSkuVOList: [], //sku组合
    goodsSpecVOList: [], //规格属性
    showSetModel: false,
    changePriceVal: "", //统一设置批发价
    changeSellVal: "", //统一设置零售价
    changeStockVal: "", //统一设置库存
    resNum:0
  },
  // 获取规格数量
  getNum:function(){
    var getTempList = new GetTempList(),
      _this = this
    getTempList.getTempCont().then(res => {
      if (res){
        _this.setData({
          resNum: res.length
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 单独修改规格
    if (options.goodsId) {
      this.getGoodsSku(options.goodsId)
      this.setData({
        storeId: options.storeTd,
        goodsId: options.goodsId
      })
    }
    // 编辑或添加规格
    if (options.skuListData) {
      this.getConent(JSON.parse(options.skuListData), JSON.parse(options.goodsSkuVOList))
    }
  },
  // 接受上个页面传来的数据
  getConent: function (voListData, goodsSkuVOList) {
    var _this = this
    if (voListData) {
      var len = voListData.length
      if (len == 0) {
        voListData.push({
          specName: "颜色",
          goodsSpecificationValueVOList: []
        })
      } else {
        for (var i = 0; i < voListData.length; i++) {
          var childData = voListData[i].goodsSpecificationValueVOList
          for (var j = 0; j < childData.length; j++) {
            childData[j].sClick = true
            for (let u of goodsSkuVOList) {
              if (i == 0) {
                if (u.specValueCodeList.indexOf(childData[j].specValueCode) != -1) {
                  u.skuName = childData[j].specValueName
                }
              } else {
                if (u.specValueCodeList.indexOf(childData[j].specValueCode) != -1) {
                  u.skuNameSign = childData[j].specValueName
                }
              }
            }
          }
        }
      }
      _this.setData({
        listData: voListData,
        goodsSkuVOList: goodsSkuVOList
      })
    }
  },
  // 根据ID获取规格
  getGoodsSku: function (goodsId) {
    var _this = this
    Api.getGoodsSku({
      goodsId: goodsId
    })
      .then(res => {
        var voListData = res.obj.goodsSpecificationVOList,
          goodsSkuVOList = res.obj.goodsSkuVOList
        _this.getConent(voListData, goodsSkuVOList)
      })
  },
  //取消弹框
  cancel: function () {
    this.setData({
      updataSpecName: false,
      deteleVo: false,
      addSpecChild: false,
      value: '',
      watchInput: false,
      unifiedSet: false
    })
  },
  // 监听input字数长度
  watchInput: function (event) {
    var value = event.detail.value,
      updataSpecName = this.data.updataSpecName,
      addSpecChild = this.data.addSpecChild,
      num = value.length
    value = value.replace(/\s+/g, "")
    if (value == '') {
      this.setData({
        watchInput: false,
        value: '',
      })
    } else {
      if (updataSpecName) {
        if (num > 7) {
          Api.showToast("超过最长数字限制")
        }
        this.setData({
          value: value.substring(0, 6),
        })
      }
      if (addSpecChild) {
        if (num > 17) {
          Api.showToast("超过最长数字限制")
        }
        this.setData({
          value: value.substring(0, 16),
        })
      }
      this.setData({
        watchInput: true,
      })
    }
  },
  // 添加规格
  addAttrc: function () {
    var listData = this.data.listData,
      _this = this,
      defaultName = this.data.defaultName,
      tempArrNew = {}
    if (listData.length > 0) {
      var childValue = listData[0].specName
      if (childValue == defaultName) {
        listData.push({
          specName: "规格",
          goodsSpecificationValueVOList: []
        })
      } else {
        listData.push({
          specName: "颜色",
          goodsSpecificationValueVOList: []
        })
      }
    } else {
      listData.push({
        specName: "颜色",
        goodsSpecificationValueVOList: []
      })
    }
    this.setData({
      listData: listData
    })
  },
  // 编辑规格名称
  editSpecName: function (e) {
    var index = e.target.dataset.index,
      name = e.target.dataset.name
    this.setData({
      updataSpecName: true,
      value: name,
      efitSpecIndex: index,
      watchInput: true
    })
  },
  conSpecName: function () {
    var listData = this.data.listData,
      efitSpecIndex = this.data.efitSpecIndex,
      value = this.data.value
    if (Api.isNotEmpty(value)) {
      listData[efitSpecIndex].specName = value
    }
    this.setData({
      listData: listData,
    })
    this.cancel()
  },
  // 排序
  upTop: function () {
    var listData = this.data.listData,
      goodsSkuVOList = this.data.goodsSkuVOList
    this.setData({
      listData: listData.reverse()
    },function(){
      for (var v of goodsSkuVOList){
        v.temp = v.skuName
        v.skuName = v.skuNameSign
        v.skuNameSign = v.temp
      }
      this.setData({
        goodsSkuVOList: goodsSkuVOList
      },function(){
        this.getSkuData()
      })
    })
  },
  // 删除
  deleteAttrc: function (e) {
    var index = e.target.dataset.index
    this.setData({
      deteleVo: true,
      indexAttrc: index
    })
  },
  conDeleteAttrc: function () {
    var listData = this.data.listData,
      indexAttrc = this.data.indexAttrc
    listData.splice(indexAttrc, 1)
    this.setData({
      deteleVo: false,
      listData: listData
    }, function () {
      this.getSkuData()
    })
  },
  // 添加规格值
  addSpecValue: function (e) {
    var index = e.target.dataset.index
    this.setData({
      addSpexIndex: index,
      addSpecChild: true
    })
  },
  conSpecChild: function () {
    var value = this.data.value,
      addSpexIndex = this.data.addSpexIndex,
      listData = this.data.listData
    if (Api.isNotEmpty(value)) {
      var newArr = listData[addSpexIndex].goodsSpecificationValueVOList
      for (let v of newArr) {
        if (v.specValueName == value) {
          Api.showToast("规格值不能重复")
          return
        }
      }
      listData[addSpexIndex].goodsSpecificationValueVOList.push({
        specValueName: value,
        sClick: true
      })
      this.setData({
        listData: listData,
      }, function () {
        this.getSkuData()
      })
      this.cancel()
    }
  },
  //SKU组合
  getSkuData: function () {
    var listData1 = this.data.listData,
      listData = [],
      tempGoodsSkuList = this.data.goodsSkuVOList,
      goodsSkuVOList = [], //SKU组合，
      tempData1 = [],
      tempData2 = []
    for (let v of listData1) {
      if (v.goodsSpecificationValueVOList.length > 0) {
        listData.push(v)
      }
    }
    var length = listData.length
    if (length == 1) {
      var tempData1 = listData[0].goodsSpecificationValueVOList
      for (var v of tempData1) {
        goodsSkuVOList.push({
          skuName: v.specValueName,
          marketPrice: '0',
          sellPrice: '',
          stockNum: '',
          wholesalePrice: '',
          specValueCodeList: []
        })
      }
    } else if (length == 2) {
      var tempData1 = listData[0].goodsSpecificationValueVOList
      var tempData2 = listData[1].goodsSpecificationValueVOList
      for (var v of tempData1) {
        for (var val of tempData2) {
          goodsSkuVOList.push({
            skuName: v.specValueName,
            skuNameSign: val.specValueName,
            marketPrice: '0',
            sellPrice: '',
            stockNum: '',
            wholesalePrice: '',
            specValueCodeList: []
          })
        }
      }
    } else {
      goodsSkuVOList = []
    }
    // 判断是否已经设置过价格和库存
    if (tempGoodsSkuList.length > 0) {
      if (tempGoodsSkuList[0].skuNameSign) {
        if (goodsSkuVOList.length > 0) {
          if (goodsSkuVOList[0].skuNameSign) {
            // 最新规格还是两个规格
            for (var i = 0; i < goodsSkuVOList.length; i++) {
              for (var k of tempGoodsSkuList) {
                if (goodsSkuVOList[i].skuName == k.skuName && goodsSkuVOList[i].skuNameSign == k.skuNameSign) {
                  goodsSkuVOList[i].stockNum = k.stockNum
                  goodsSkuVOList[i].wholesalePrice = k.wholesalePrice
                  goodsSkuVOList[i].sellPrice = k.sellPrice
                  goodsSkuVOList[i].specValueCodeList = k.specValueCodeList
                }
              }
            }
          }
        }
      } else {
        // 重新组合之前只有一个规格
        if (goodsSkuVOList.length > 0) {
          if (!goodsSkuVOList[0].skuNameSign) {
            // 最新规格还是一个规格
            for (var i = 0; i < goodsSkuVOList.length; i++) {
              for (var k of tempGoodsSkuList) {
                if (goodsSkuVOList[i].skuName == k.skuName) {
                  goodsSkuVOList[i].stockNum = k.stockNum
                  goodsSkuVOList[i].wholesalePrice = k.wholesalePrice
                  goodsSkuVOList[i].sellPrice = k.sellPrice
                }
              }
            }
          }
        }
      }
    }
    this.setData({
      goodsSkuVOList: goodsSkuVOList
    })
  },
  // 监听input价格和库存
  monitor: function (e) {
    var name = e.target.dataset.name,
      val = e.detail.value,
      index = e.target.dataset.index,
      goodsSkuVOList = this.data.goodsSkuVOList
    if (name == "stockNum") {
      goodsSkuVOList[index].stockNum = val
    } else {
      if (val.length == 2 && val.charAt(0) == '0') {
        if (val != "0.") {
          val = 0
          goodsSkuVOList[index][name] = 0
          this.setData({
            goodsSkuVOList: goodsSkuVOList
          })
          return
        }
      }
      goodsSkuVOList[index][name] = util.newVal(val)
    }
    this.setData({
      goodsSkuVOList: goodsSkuVOList,
    })
  },
  // 长按或者点击事件
  bindTouchStart: function (e) {
    this.startTime = e.timeStamp;
  },
  bindTouchEnd: function (e) {
    this.endTime = e.timeStamp;
  },
  bindTap: function (e) {
    if (this.endTime - this.startTime < 350) {
      var listData = this.data.listData
      for (var v of listData) {
        for (var k of v.goodsSpecificationValueVOList) {
          k.selected = false
        }
      }
      this.setData({
        listData: listData
      })
    }
  },
  // 规格操作
  chengeData: function (e, value) {
    var index = e.target.dataset.index,
      name = e.target.dataset.name,
      listData = this.data.listData
    for (var v of listData) {
      for (var k of v.goodsSpecificationValueVOList) {
        k.selected = false
      }
      if (v.specName == name) {
        var goodsSpecificationValueVOList = v.goodsSpecificationValueVOList
        if (value == "delete") {
          goodsSpecificationValueVOList.splice(index, 1)
        } else {
          goodsSpecificationValueVOList[index].selected = true
        }
      }
    }
    this.setData({
      listData: listData
    }, function () {
      this.getSkuData()
    })
  },
  // 长按
  bingLongTap: function (e) {
    this.chengeData(e, "press")
  },
  // 删除规格值
  operationBind: function (e) {
    this.chengeData(e, "delete")
  },
  // 统一设置
  unifiedSet: function () {
    this.setData({
      unifiedSet: true,
      watchInput: true,
    })
  },
  confirmSet: function () {
    var goodsSkuVOList = this.data.goodsSkuVOList,
      changePriceVal = this.data.changePriceVal,
      changeSellVal = this.data.changeSellVal,
      changeStockVal = this.data.changeStockVal
    if (changePriceVal == 0 && Api.isNotEmpty(changePriceVal)) {
      Api.showToast("批发价不得低于0")
      return;
    }
    if (changeSellVal == 0 && Api.isNotEmpty(changeSellVal)) {
      Api.showToast("零售价不得低于0")
      return;
    }
    if (changeStockVal == 0 && Api.isNotEmpty(changeStockVal)) {
      Api.showToast("库存不得低于0")
      return;
    }
    for (let v of goodsSkuVOList) {
      v.wholesalePrice = changePriceVal
      v.sellPrice = changeSellVal
      v.stockNum = changeStockVal
    }
    this.cancel()
    this.setData({
      goodsSkuVOList: goodsSkuVOList
    })
  },

  // 监听统一设置 价格库存
  changePrice: function (e) {
    var val = e.detail.value
    if (val.length == 2 && val.charAt(0) == '0') {
      if (val != "0.") {
        val = 0
      }
      this.setData({
        changePriceVal: val
      })
      return
    }
    this.setData({
      changePriceVal: (util.newVal(val)).substring(0, 8)
    })
  },
  changeSell: function (e) {
    var val = e.detail.value
    if (val.length == 2 && val.charAt(0) == '0') {
      if (val != "0.") {
        val = 0
      }
      this.setData({
        changeSellVal: val
      })
      return
    }
    this.setData({
      changeSellVal: (util.newVal(val)).substring(0, 8)
    })
  },
  changeStock: function (e) {
    this.setData({
      changeStockVal: e.detail.value
    })
  },
  // 选择规格模板
  goAlertSpec: function () {
    var listData = this.data.listData,
      tempArr = []
    // 去除空的规格组
    for (let v of listData) {
      if (v.goodsSpecificationValueVOList.length > 0) {
        tempArr.push(v)
      }
    }
    wx.navigateTo({
      url: '../specSet/specSet?listData=' + JSON.stringify(tempArr),
    })
  },
  //确定返回
  goback: function () {
    var _this = this,
      goodsSkuVOList = this.data.goodsSkuVOList,
      listData = this.data.listData,
      skuListData = [],
      skuParms = {},
      getTempCode = [],
      goodsSpecificationVOList = [] //编辑规格需要的规格
    // 去除空的规格组
    for (let v of listData) {
      if (v.goodsSpecificationValueVOList.length > 0) {
        skuListData.push(v)
      }
    }
    for (var v of goodsSkuVOList) {
      if (v.wholesalePrice == 0 && Api.isNotEmpty(v.wholesalePrice)){
        Api.showToast("批发价不得低于0")
        return
      }
      if (!Api.isNotEmpty(v.wholesalePrice)) {
        Api.showToast("批发价不能为空！")
        return
      }
      if (v.sellPrice == 0 && Api.isNotEmpty(v.sellPrice)) {
        Api.showToast("零售价不得低于0")
        return
      }
      if (!Api.isNotEmpty(v.sellPrice)) {
        Api.showToast("零售价不能为空！")
        return
      }
      if (v.stockNum == 0 && Api.isNotEmpty(v.stockNum)) {
        Api.showToast("库存不得低于0")
        return
      }
      if (!Api.isNotEmpty(v.stockNum)) {
        Api.showToast("库存不能为空！")
        return
      }
    }
    if (skuListData.length > 0) {
      // 判断是新的规格还是编辑规格
      var isChangeSku = 0,
        skuTotal = skuListData.length
      for (var v of skuListData) {
        if (v.goodsId == undefined) {
          isChangeSku++
        }
      }
      // 新增规格
      if (isChangeSku == skuTotal) {
        var specNum = skuTotal
        var firstSpecValueNum = skuListData[0].goodsSpecificationValueVOList.length
        var secondSpecValueNum = 0
        if (skuTotal == 2) {
          secondSpecValueNum = skuListData[1].goodsSpecificationValueVOList.length
        }
        skuParms = {
          specNum: specNum,
          firstSpecValueNum: firstSpecValueNum,
          secondSpecValueNum: secondSpecValueNum
        }
        // 查询SKUCODE
        Api.skuCode(skuParms)
          .then(res => {
            var codeData = res.obj
            for (var i = 0; i < skuListData.length; i++) {
              skuListData[i].specCode = codeData[i].specCode[0]
              var specVoList = skuListData[i].goodsSpecificationValueVOList
              for (var v of goodsSkuVOList){
                v.specValueCodeList=[]
              }
              for (var j = 0; j < specVoList.length; j++) {
                delete specVoList[j].sClick
                specVoList[j].specCode = codeData[i].specCode[0]
                specVoList[j].specValueCode = codeData[i].specValueCode[j]
                getTempCode.push(specVoList[j])
              }
              skuListData[i].goodsSpecificationValueVOList = specVoList
            }
            goodsSkuVOList = _this.copySkuCode(getTempCode, goodsSkuVOList)
            _this.updataGoodsSku(skuListData, goodsSkuVOList)
          })
      }
      // 编辑
      if (isChangeSku == 0) {
        var fData = [],
          sData = [],
          firstSpecCode = '',
          firstNum = 0,
          secondSpecCode = '',
          secondNum = 0
        // 判断新增的规格值
        fData = skuListData[0].goodsSpecificationValueVOList
        firstSpecCode = skuListData[0].specCode
        for (var f of fData) {
          if (f.goodsId == undefined) {
            firstNum++
          }
        }
        if (skuTotal == 2) {
          sData = skuListData[1].goodsSpecificationValueVOList
          secondSpecCode = skuListData[1].specCode
          for (var s of sData) {
            if (s.goodsId == undefined) {
              secondNum++
            }
          }
        }
        var data = {
          firstSpecCode: firstSpecCode,
          firstNum: firstNum,
          secondSpecCode: secondSpecCode,
          secondNum: secondNum
        }
        Api.specValCode(data)
          .then(res => {
            var codeData = res.obj,
              getTempCode = []
            for (var i = 0; i < skuListData.length; i++) {
              var specVoList = skuListData[i].goodsSpecificationValueVOList
              for (var j = 0; j < specVoList.length; j++) {
                if (i == 0) {
                  var len = skuListData[i].goodsSpecificationValueVOList.length - 1
                  // 给新增的规格值复制code
                  if (specVoList[j].goodsId == undefined) {
                    if (specVoList[j].specCode){
                      specVoList[j].specCode = specVoList[j].specCode
                    }else{
                      specVoList[j].specCode = skuListData[i].specCode
                    }
                    if (specVoList[j].specValueCode){
                      specVoList[j].specValueCode = specVoList[j].specValueCode
                    }else{
                      specVoList[j].specValueCode = (codeData[skuListData[0].specCode])[len - j]
                    }
                    delete specVoList[j].sClick
                  }
                }
                if (i == 1) {
                  var lens = skuListData[i].goodsSpecificationValueVOList.length - 1
                  // 给新增的规格值复制code
                  if (specVoList[j].goodsId == undefined) {
                    if (specVoList[j].specCode){
                      specVoList[j].specCode = specVoList[j].specCode
                    }else{
                      specVoList[j].specCode = skuListData[i].specCode
                    }
                    if (specVoList[j].specValueCode){
                      specVoList[j].specValueCode = specVoList[j].specValueCode
                    }else{
                      specVoList[j].specValueCode = (codeData[skuListData[1].specCode])[lens - j]
                    }
                    delete specVoList[j].sClick
                  }
                }
                getTempCode.push(specVoList[j])
              }
              skuListData[i].goodsSpecificationValueVOList = specVoList
            }
            goodsSkuVOList = _this.copySkuCode(getTempCode, goodsSkuVOList)
            _this.updataGoodsSku(skuListData, goodsSkuVOList)
          })
      }
      // 一个新增一个编辑
      if (isChangeSku == 1 && isChangeSku < skuTotal) {
        for (var i = 0; i < skuListData.length; i++) {
          // 新加的规格
          if (skuListData[i].goodsId == undefined) {
            var childVoData = skuListData[i],
              index = i
            firstSpecValueNum = skuListData[i].goodsSpecificationValueVOList.length
            skuParms = {
              specNum: 1,
              firstSpecValueNum: firstSpecValueNum,
              secondSpecValueNum: 0
            }
            // 查询SKUCODE
            Api.skuCode(skuParms)
              .then(res => {
                var codeData = res.obj,
                  getTempCode = []
                childVoData.specCode = codeData[0].specCode[0]
                var specVoList = childVoData.goodsSpecificationValueVOList
                for (var j = 0; j < specVoList.length; j++) {
                  delete specVoList[j].sClick
                  specVoList[j].specCode = codeData[0].specCode[0]
                  specVoList[j].specValueCode = codeData[0].specValueCode[j]
                  getTempCode.push(specVoList[j])
                }
                childVoData.goodsSpecificationValueVOList = specVoList
                // 判断已经存在的规格
                if (index == 0) {
                  var num = 1
                } else {
                  var num = 0
                }
                var childVoData1 = skuListData[num]
                // 已经存在的规格
                var firstSpecCode = '',
                  firstNum = 0,
                  secondSpecCode = '0',
                  secondNum = 0,
                  fData = []
                fData = childVoData1.goodsSpecificationValueVOList
                firstSpecCode = childVoData1.specCode
                for (var f of fData) {
                  if (f.goodsId == undefined) {
                    firstNum++
                  }
                }
                var data = {
                  firstSpecCode: firstSpecCode,
                  firstNum: firstNum,
                  secondSpecCode: secondSpecCode,
                  secondNum: secondNum
                }
                Api.specValCode(data)
                  .then(res => {
                    var codeData = res.obj,
                      getTempCode = []
                    var specVoList = childVoData1.goodsSpecificationValueVOList
                    for (var j = 0; j < specVoList.length; j++) {
                      var len = childVoData1.goodsSpecificationValueVOList.length - 1
                      // 给新增的规格值复制code
                      if (specVoList[j].goodsId == undefined) {
                        if (specVoList[j].specCode){
                          specVoList[j].specCode = specVoList[j].specCode
                        }else{
                          specVoList[j].specCode = childVoData1.specCode
                        }
                        if (specVoList[j].specValueCode){
                          specVoList[j].specCode = specVoList[j].specCode
                        }else{
                          specVoList[j].specValueCode = (codeData[skuListData[0].specCode])[len - j]
                        }
                        delete specVoList[j].sClick
                      }
                    }
                    for (var val of skuListData) {
                      var list = val.goodsSpecificationValueVOList
                      for (var k of list) {
                        getTempCode.push(k)
                      }
                    }
                    childVoData1.goodsSpecificationValueVOList = specVoList
                    goodsSkuVOList = _this.copySkuCode(getTempCode, goodsSkuVOList)
                    _this.updataGoodsSku(skuListData, goodsSkuVOList)
                  })
              })
          }
        }
      }
    } else {
      _this.updataGoodsSku(skuListData, goodsSkuVOList)
    }
  },
  //code赋值
  copySkuCode: function (getTempCode, goodsSkuVOList) {
    // getTempCodo所有的code对象  goodsSkuVOListsku组合
    for (var i of getTempCode) {
      var specValueName = i.specValueName
      for (var j of goodsSkuVOList) {
        if (specValueName == j.skuName) {
          if (j.specValueCodeList.indexOf(i.specValueCode) == -1) {
            j.specValueCodeList.push(i.specValueCode)
          }

        }
        if (j.skuNameSign) {
          if (specValueName == j.skuNameSign) {
            if (j.specValueCodeList.indexOf(i.specValueCode) == -1) {
              j.specValueCodeList.push(i.specValueCode)
            }
          }
        }
      }
    }
    return goodsSkuVOList
  },
  // 修改规格
  updataGoodsSku(skuListData, goodsSkuVOList) {
    var goodsId = this.data.goodsId
    // 有ID单独修改的规格
    if (goodsId) {
      var wholesalePrice = '',
        sellPrice = '',
        stockNum = 0
      //获取最小价格和总库存
      sellPrice = Math.min.apply(Math, goodsSkuVOList.map(function (o) {
        return o.sellPrice
      }))
      for (var v of goodsSkuVOList) {
        if (v.sellPrice == sellPrice) {
          wholesalePrice = v.wholesalePrice
        }
        stockNum += parseInt(v.stockNum)
      }
      var dataVo = {
        goodsSpecificationVOList: skuListData,
        goodsSkuVOList: goodsSkuVOList,
        id: this.data.goodsId,
        storeId: this.data.storeId,
        sellPrice: sellPrice,
        stockNum: stockNum,
        wholesalePrice: wholesalePrice
      }
      Api.updateGooodsSku(dataVo)
        .then(res => {
          Api.showToast(res.message)
          wx.navigateTo({
            url: '../status/status',
          })
        })
    } else {
      var pages = getCurrentPages(),
        currPage = pages[pages - 1],
        prevPage = pages[pages.length - 2]
      prevPage.setData({
        skuListData: skuListData,
        goodsSkuVOList: goodsSkuVOList
      })
      wx.navigateBack({
        data: 1
      })
    }

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
    this.getNum()
    var pages = getCurrentPages()
    var currPage = pages[pages.length - 1]
    if (currPage.data.listDataSpec) {
      var listDataSpec = currPage.data.listDataSpec
      for (var c of listDataSpec) {
        var childList = c.goodsSpecificationValueVOList
        for (var v of childList) {
          v.sClick = true
          delete v.newSpec
        }
      }
      this.setData({
        listData: currPage.data.listDataSpec,
      }, function () {
        this.getSkuData()
      })
    }
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


})