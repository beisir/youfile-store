const app = getApp();
import Api from '../../../utils/api.js'
import util from '../../../utils/util.js'
import GetTempList from './getTempList.js'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    listData: [],
    currentTab: 0,
    defaultName: '颜色', //默认规格名字
    templateId: '', //模板ID
    templateName: '', //模板名称
    addTempParent: false, //显示添加模板属性
    updateSpec: false,
    specTempVOList: [{
      specName: "颜色",
      specValueList: []
    }],
    unsetTemp: false, //删除模板
    haveSpecShow: false, //提示已经有的规格
    voId: '', //规格ID
    deteleVo: false, //删除规格
    updataSpecName: false, //更新规格值
    initSpecId: '', //需要修改的规格ID
    addSpecChild: false, //添加规格值
    indexDeleteVal: '', //删除规格索引标识
    listDataSpec: [{
      specName: "颜色",
      goodsSpecificationValueVOList: [{
        specValueName: "蓝色"
      }, {
        specValueName: "2121"
      }]

    }], //上个页面带来的规格数组
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getListData(options)
  },
  // 获取规格组
  getListData: function(options) {
    this.setData({
      listDataSpec: JSON.parse(options.listData)
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  // 返回上个页面
  goback: function() {
    var listDataSpec = this.data.listDataSpec,
      pages = getCurrentPages(),
      currPage = pages[pages - 1],
      prevPage = pages[pages.length - 2]
    prevPage.setData({
      listDataSpec: listDataSpec,
    })
    wx.navigateBack({
      data: 1
    })
  },
  // 判断是否有选中规格
  isSelected: function(data, haveSku) {
    var dataChild = data.specificationTemplateContentVOList,
      listData = this.data.listData,
      currentTab = this.data.currentTab
    if (dataChild) { //模板数据
      for (var v of dataChild) {
        for (var k of haveSku) { //已经存在的sku
          if (v.specName == k.specName) {
            var specValueNameList = v.specValueNameList
            var goodsSpecificationValueVOList = k.goodsSpecificationValueVOList
            if (specValueNameList == null) {
              specValueNameList = []
            }
            for (var item of specValueNameList) {
              for (var kItem of goodsSpecificationValueVOList) {
                if (item.specValueName == kItem.specValueName) {
                  if (kItem.newSpec == undefined) {
                    item.haveSelected = true
                  }
                }
              }
            }
          }
        }
      }
    }
    listData[currentTab].specificationTemplateContentVOList = dataChild
    this.setData({
      listData: listData
    })
  },
  // 获取规格模板列表
  getTempList: function() {
    var getTempList = new GetTempList(),
      _this = this
    getTempList.getTempCont().then(res => {
        for (var v of res) {
          var voList = v.specificationTemplateContentVOList
          for (var i of voList) {
            if (i.specValueNameList == null) {
              i.specValueNameList = []
            }
            if (i.specValueList == null) {
              i.specValueList = []
            }
          }
        }
        _this.setData({
          listData: res,
          currentTab: 0,
          templateId: res[0].id
        }, function() {
          var listDataSpec = _this.data.listDataSpec
          _this.isSelected(res[0], listDataSpec)
        })
      })
      .catch(res => {})
  },
  // 添加或者删除之后重新渲染额页面
  getInitData: function(mes) {
    Api.showToast(mes)
    this.getTempList()
    this.cancel()
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.getTempList()
  },
  // 点击切换模板
  clickTab: function(e) {
    var that = this,
      templateId = e.target.dataset.id,
      index = e.target.dataset.current,
      templateName = e.target.dataset.name
    if (this.data.currentTab === index) {
      return false;
    } else {
      that.setData({
        templateId: templateId,
        templateName: templateName,
        currentTab: index,
      }, function() {
        var listDataSpec = that.data.listDataSpec,
          listData = this.data.listData
        that.isSelected(listData[index], listDataSpec)
      })
    }
  },
  // 初始化value值
  initValue: function() {
    this.setData({
      value: ''
    })
  },
  //取消弹框
  cancel: function() {
    this.setData({
      addTempParent: false,
      unsetTemp: false,
      watchInput: false,
      updateSpec: false,
      deteleVo: false,
      updataSpecName: false,
      addSpecChild: false,
    })
  },
  // 监听input字数长度
  watchInput: function(event) {
    var value = event.detail.value,
      addTempParent = this.data.addTempParent,
      updateSpec = this.data.updateSpec,
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
      if (addTempParent || updateSpec || updataSpecName) {
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
  // 添加模板
  addTempParent: function() {
    var _this = this
    _this.setData({
      addTempParent: true,
      value: ''
    })
  },
  confirmAddTemp: function() {
    var _this = this,
      listDataLen = this.data.listData.length,
      value = this.data.value,
      specTempVOList = this.data.specTempVOList,
      tempObj = {}
    if (Api.isNotEmpty(value)) {
      tempObj["specificationTemplateContentVOList"] = specTempVOList
      tempObj["templateName"] = value
      Api.addTemplate(tempObj)
        .then(res => {
          _this.getInitData("添加成功")
        })
    }
  },
  // 删除模板
  unsetSpec: function() {
    var _this = this
    _this.setData({
      unsetTemp: true
    })
  },
  confirmDetele: function() {
    var _this = this,
      templateId = this.data.templateId
    Api.templateDelete(templateId)
      .then(res => {
        _this.getInitData("删除成功")
      })
  },
  // 更新模板名称
  updateTemplate: function() {
    var templateName = this.data.templateName
    this.setData({
      updateSpec: true,
      value: templateName,
      watchInput: true
    })
  },
  confirmUpdateSpec: function() {
    var _this = this,
      templateId = this.data.templateId,
      value = this.data.value
    if (Api.isNotEmpty(value)) {
      Api.updateTemplateName(templateId, value)
        .then(res => {
          _this.getInitData("更新成功")
        })
    }
  },
  // 添加规格
  addAttrc: function() {
    var templateId = this.data.templateId,
      currentTab = this.data.currentTab,
      listData = this.data.listData,
      tempContentVOList = listData[currentTab].specificationTemplateContentVOList,
      _this = this,
      defaultName = this.data.defaultName,
      tempArrNew = {}
    if (tempContentVOList) {
      var childValue = tempContentVOList[0].specName
      if (childValue == defaultName) {
        tempArrNew = {
          specName: "规格",
          templateId: templateId,
          specValueList: [],
          specValueNameList: []
        }
      } else {
        tempArrNew = {
          specName: "颜色",
          templateId: templateId,
          specValueList: [],
          specValueNameList: []
        }
      }
    } else {
      tempArrNew = {
        specName: "颜色",
        templateId: templateId,
        specValueList: [],
        specValueNameList: []
      }
    }

    Api.saveSpecTemplateContent(tempArrNew)
      .then(res => {
        _this.getInitData("添加成功")
      })
  },
  //删除规格
  deleteAttrc: function(e) {
    this.setData({
      deteleVo: true,
      voId: e.target.dataset.id
    })

  },
  conDeleteAttrc: function() {
    var _this = this,
      voId = this.data.voId
    Api.deleteTemplate(voId)
      .then(res => {
        _this.getInitData("删除成功")
      })
  },
  // 编辑规格名称
  editSpecName: function(e) {
    var initSpecName = e.target.dataset.name,
      initSpecId = e.target.dataset.id
    this.setData({
      value: initSpecName,
      initSpecId: initSpecId,
      updataSpecName: true,
      watchInput: true
    })
  },
  conSpecName: function() {
    var _this = this,
      initSpecId = this.data.initSpecId,
      listData = this.data.listData,
      index = _this.data.currentTab,
      tempArr = listData[index].specificationTemplateContentVOList,
      value = this.data.value
    for (var i = 0; i < tempArr.length; i++) {
      if (tempArr[i].specName == value) {
        Api.showToast("已经有此规格名称！")
        return
      }
    }
    if (Api.isNotEmpty(value)) {
      Api.updateSpecName(initSpecId, value)
        .then(res => {
          _this.getInitData("修改成功")
        })
    }
  },
  // 模板中的规格置顶
  upTop: function(e) {
    var _this = this,
      templateContentId = e.target.dataset.id
    Api.tempSort({
        templateContentId: templateContentId
      })
      .then(res => {
        _this.getInitData("操作成功")
      })
  },
  // 添加规格值
  addSpecValue: function(e) {
    var specChildId = e.target.dataset.id
    this.setData({
      specChildId: specChildId,
      addSpecChild: true,
      value: '',
    })
  },
  conSpecChild: function() {
    this.addOrDelete("add")
  },
  // 取消替换规格
  cancelSpec: function() {
    var index = this.data.currentTab,
      listData = this.data.listData,
      specCont = listData[index].specificationTemplateContentVOList,
      specValueList = [],
      indexDeleteVal = this.data.indexDeleteVal,
      specValueNameList = [],
      specChildId = this.data.specChildId
    for (let v of specCont) {
      if (v.id == specChildId) {
        specValueList = v.specValueList
        specValueNameList = v.specValueNameList
      }
    }
    specValueNameList[indexDeleteVal].sClick = !specValueNameList[indexDeleteVal].sClick
    listData[index].specificationTemplateContentVOList.specValueNameList = specValueNameList
    this.setData({
      haveSpecShow: false,
      listData: listData
    })
  },
  // 确定替换
  conNewSpec: function() {
    var listDataSpec = this.data.listDataSpec,
      specParentName = this.data.specParentName,
      newSpecName = this.data.newSpecName,
      newListDataSpec = [],
      listData = this.data.listData
    newListDataSpec.push({
      specName: specParentName,
      goodsSpecificationValueVOList: [{
        specValueName: newSpecName
      }]
    })
    for (var val of listData) {
      var cList = val.specificationTemplateContentVOList
      for (var a of cList) {
        var childArr = a.specValueNameList
        for (var cArr of childArr) {
          if (cArr.haveSelected) {
            delete cArr.haveSelected
          }
          if (cArr.sClick) {
            delete cArr.sClick
          }
          if (cArr.specValueName == newSpecName && a.specName == specParentName) {
            cArr.sClick = true
          }
        }
      }
    }
    this.setData({
      listDataSpec: newListDataSpec,
      haveSpecShow: false,
      listData: listData
    })
  },
  // 添加或者删除规格值操作
  addOrDelete: function(sign, parentName) {
    var _this = this,
      specChildId = this.data.specChildId,
      str = '',
      value = this.data.value,
      index = this.data.currentTab,
      listData = this.data.listData,
      indexDeleteVal = this.data.indexDeleteVal,
      specCont = listData[index].specificationTemplateContentVOList,
      specValueList = [],
      specValueNameList = [],
      listDataSpec = this.data.listDataSpec, // 判断点击的规格值是否已经存在
      listDataSpecLen = listDataSpec.length //已经存在的规格长度
    for (let v of specCont) {
      if (v.id == specChildId) {
        specValueList = v.specValueList
        specValueNameList = v.specValueNameList
      }
    }
    // 长按或者点击
    if (sign == 'longpress' || sign == 'click') {
      if (sign == 'click') {
        specValueNameList[indexDeleteVal].sClick = !specValueNameList[indexDeleteVal].sClick
        // 获取当前点击的规格值和规格名称
        var name = specValueNameList[indexDeleteVal].specValueName
        // 临时规格数组
        var tempSpecArr = []
        for (var val of listDataSpec) {
          tempSpecArr.push(val.specName)
        }
        if (tempSpecArr.indexOf(parentName) == -1 && listDataSpecLen == 2) {
          this.setData({
            haveSpecShow: true,
            specParentName: parentName,
            newSpecName: name
          })
        }
        console.log(listDataSpec)
        if (listDataSpecLen == 0) {
          listDataSpec.push({
            specName: parentName,
            goodsSpecificationValueVOList: [{
              specValueName: name,
              newSpec: true
            }]
          })
        } else {
          for (var val of listDataSpec) {
            if (val.specName == parentName) {
              var childList = val.goodsSpecificationValueVOList
              for (var l = 0; l < childList.length; l++) {
                if (specValueNameList[indexDeleteVal].sClick) {
                  val.goodsSpecificationValueVOList.push({
                    specValueName: name,
                    newSpec: true
                  })
                  break
                } else {
                  if (childList[l].specValueName == name) {
                    childList.splice(l, 1)
                    break
                  }
                }
              }
            } else {
              if (listDataSpec.length == 1) {
                listDataSpec.push({
                  specName: parentName,
                  goodsSpecificationValueVOList: [{
                    specValueName: name,
                    newSpec: true
                  }]
                })
                break
              }
            }
          }
        }
      } else {
        for (let v of specValueNameList) {
          v.selected = false
        }
        // 判断是否存在已经选中的属性值
        if (!specValueNameList[indexDeleteVal].haveSelected) {
          specValueNameList[indexDeleteVal].selected = true
        }
      }
      listData[index].specificationTemplateContentVOList.specValueNameList = specValueNameList
      this.setData({
        listData: listData
      })
      return
    }
    // 添加或者删除
    if (sign == 'add') {
      if (Api.isNotEmpty(value)) {
        if (specValueList != null) {
          if (specValueList.indexOf(value) != -1) {
            Api.showToast("此规格名称已存在！")
            return
          }
        }
      } else {
        return
      }
    } else if (sign == 'delete') {
      var name = specValueNameList[indexDeleteVal].specValueName
      for (var item of listDataSpec) {
        if (item.specName == parentName) {
          var listNew = item.goodsSpecificationValueVOList
          for (var h = 0; h < listNew.length; h++) {
            if (listNew[h].specValueName == name) {
              listNew.splice(h, 1)
            }
          }
        }
      }
      specValueList.splice(indexDeleteVal, 1)
      specValueNameList.splice(indexDeleteVal, 1)
      // listData[index].specificationTemplateContentVOList.specValueNameList = specValueNameList
    }
    for (var j = 0; j < specValueList.length; j++) {
      str += specValueList[j] + ",";
    }
    if (sign == 'add') {
      str += value
      specValueNameList.push({
        specValueName: value
      })
      listData[index].specificationTemplateContentVOList.specValueNameList = specValueNameList
    }
    str = (str.substring(str.length - 1) == ',') ? str.substring(0, str.length - 1) : str;
    Api.addTempCont(specChildId, str)
      .then(res => {
        _this.setData({
          listData: listData
        })
        _this.cancel()
      })
  },
  // 删除规格值 
  operationBind: function(e) {
    var specChildId = e.target.dataset.id,
      index = e.target.dataset.index
    this.setData({
      specChildId: specChildId,
      indexDeleteVal: index,
    }, function() {
      this.addOrDelete("delete", e.target.dataset.name)
    })
  },
  // 长按或者点击事件
  bindTouchStart: function(e) {
    this.startTime = e.timeStamp;
  },
  bindTouchEnd: function(e) {
    this.endTime = e.timeStamp;
  },
  bindTap: function(e) {
    if (this.endTime - this.startTime < 350) {
      if (e.target.dataset.havesku) {
        // 已经有的禁止编辑
        return
      }
      this.clickOrPress(e, "click", e.target.dataset.name)
    }
  },
  bingLongTap: function(e) {
    this.clickOrPress(e, "longTap")
  },
  clickOrPress: function(e, value, name) {
    var specChildId = e.target.dataset.id,
      index = e.target.dataset.index
    this.setData({
      specChildId: specChildId,
      indexDeleteVal: index,
    }, function() {
      if (value == "longTap") {
        this.addOrDelete('longpress')
      } else {
        // name标识当前规格值的规格名字
        this.addOrDelete('click', name)
      }
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


})