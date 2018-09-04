const app = getApp();
import Api from '../../../utils/api.js'
var getTempList = function (that) {
  Api.template()
    .then(res => {
      const obj = res.obj
      const templateCont = (that.data.templateCont).concat(obj)
      that.setData({
        templateCont: templateCont
      })
    })
}
Array.prototype.baoremove = function (dx) {
  if (isNaN(dx) || dx > this.length) { return false; }
  this.splice(dx, 1);
} 
Page({
  /**
   * 页面的初始数据
   */
  data: {
    navindex: -1,
    currentTab: 0,
    templateCont: [{
    templateName: "不用模板", specificationTemplateContentVOList: [{id:'010',specName: "颜色", specValueList: ["如图", "米白色"] }] }],
    addSpec: false,
    addSpecAttc: false,
    watchInput: false,
    updateSpec: false,
    editSpec: false,
    editId: '',
    templateId: '',
    templateContentId: '',
    notemp: { templateName: "衣服" },
    specName: '',
    value: '',
    goodsListData: [],
    show1:false

  },
  // 返回上一页
  goback: function () {
    var index = this.data.currentTab
    var pages = getCurrentPages();             //  获取页面栈
    var currPage = pages[pages.length - 1];
    var prevPage = pages[pages.length - 2];    // 上一个页面
    prevPage.setData({
      mydata:this.data.goodsListData
    })
    wx.navigateBack({
      data: 1
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  //点击切换
  clickTab: function (e) {
    var that = this;
    var templateId = e.target.dataset.id
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current,
        templateId: templateId,
        navindex:-1,
        navindex1:-1,
        goodsListData:[]
      })
    }
  },
  // 添加规格
  addAttrc: function () {
    var index = this.data.currentTab
    var templateId = this.data.templateId
    var newArr = { specName: "规格", specValueList: [] }
    var templateCont = this.data.templateCont
    var tempArr = templateCont[index].specificationTemplateContentVOList
    templateCont[index].specificationTemplateContentVOList = tempArr
    tempArr.push(newArr)
    this.setData({
      templateCont: templateCont
    })
    var tempArr = { specName: "规格", templateId: templateId, specValueList:[]}
    if (index != 0) {
      app.http.postRequest('/admin/shop/specificationTemplate/saveSpecTemplateContent', tempArr)
        .then(res => {
        })
    }
  },
  // 监听input
  watchInput: function (event) {
    if (event.detail.value == '') {
      this.setData({
        watchInput: false
      })
    } else {
      this.setData({
        watchInput: true,
        value: event.detail.value
      })
    }
  },
  // 取消
  cancel: function () {
    this.setData({
      addSpec: false,
      addSpecAttc: false,
      updateSpec: false,
      editSpec: false,
      show1:false
    })
  },
  // 添加规格值
  addSpec: function (e) {
    this.setData({
      addSpec: true,
      value: '',
      templateContentId: e.target.dataset.id,
      specName: e.target.dataset.name
    })
  },
  confirm: function (e) {
    var _this = this
    var specName = _this.data.value,
        newSpecValueList=[],
        specArr=[],
        str = "";
    var templateContentId = _this.data.templateContentId
    var index = _this.data.currentTab
    var templateCont = _this.data.templateCont
    var tempArr = templateCont[index].specificationTemplateContentVOList
    var parentName = _this.data.specName
    for (var i = 0; i < tempArr.length; i++) {
      if (tempArr[i].specName == parentName) {
        if (tempArr[i].specValueList==null){
          str = specName
          specArr.push(specName)
          tempArr[i].specValueList= specArr
        }else{
          for (var j = 0; j < tempArr[i].specValueList.length;j++){
            console.log(tempArr[i].specValueList[j])
            str += tempArr[i].specValueList[j] + ",";
          }
          str += specName
          tempArr[i].specValueList.push(specName)
        }
        newSpecValueList = tempArr[i].specValueList
      } 
    }
    templateCont[index].specificationTemplateContentVOList = tempArr
    _this.setData({
      templateCont: templateCont
    })
    _this.cancel()
    if(templateContentId==''){return}
    app.http.postRequest('/admin/shop/specificationTemplate/updateTemplateContentSpecValue?templateContentId='+templateContentId+'&specValueList='+str,{})
      .then(res => {
        const code = res.code
        if (code == 1) {
          wx.showToast({
            title: '新建成功',
            icon: 'none',
            duration: 1000,
            mask: true
          })
        }
      })
  },
  saveTemplate: function (e) {
    var _this = this
    _this.setData({
      addSpecAttc: true
    })
  },
  // 删除规格值
  removeTemp:function(e){
    var specName=e.target.dataset.name,
        _this=this,
        id = e.target.dataset.id,
        pId=this.data.templateId,
        tempArr={},
        valData=[],
        str='',
        index=e.target.dataset.index,
        valList = this.data.templateCont
    for(var i=0;i<valList.length;i++){
      if(valList[i].id==pId){
        valData = valList[i].specificationTemplateContentVOList
        for (var j = 0; j < valData.length;j++){
          if(valData[j].id==id){
            valData=valData[j].specValueList
            valData.baoremove(index)
            valList[i].specificationTemplateContentVOList[j].specValueList
            for (var h =0; h < valData.length;h++){
              str += valData[h] + ","
            }
          }
        }
      }
    }
    str = (str.substring(str.length - 1) == ',') ? str.substring(0, str.length - 1) : str;
    var tempArr = { specName: "specName", templateId: id, specValueList: valData}
    app.http.postRequest('/admin/shop/specificationTemplate/updateTemplateContentSpecValue?templateContentId='+id+ '&specValueList='+str,{})
        .then(res => {
          _this.setData({
            templateCont: valList
          })
    })
  },
  // 确定 保存模板
  confirm1: function () {
    var _this = this
    var templateId = _this.data.templateId
    var index = _this.data.currentTab
    var tempArr = {}
    var listData = _this.data.templateCont[index]
    tempArr["specificationTemplateContentVOList"] = listData["specificationTemplateContentVOList"]
    tempArr["userId"] = "00000000"
    if (_this.data.value != '') {
      tempArr["templateName"] = _this.data.value
    }
    Api.addTemplate(tempArr)
      .then(res => {
          wx.showToast({
            title: '添加成功',
            icon: 'none',
            duration: 1000,
            mask: true
          })
          getTempList(_this);
          _this.cancel()
      })
  },
  // 排序
  zIndexUp:function (arr, index, length){
    if(index+ 1 != length){
        swapArray(arr, index, index + 1);
      console.log(swapArray)
      }else {
        console.log('已经处于置顶，无法上移');
      }
  },
  upTop:function(){
    var _this = this,
        templateId = _this.data.templateId,
        templateCont= _this.data.templateCont
    for (var i = 0; i < templateCont.length;i++){
      if (templateCont[i].id == templateId){
        var specList = templateCont[i]
        _this.zIndexUp(specList,1,0)
        console.log(templateCont[i])
      }
    }

  },
  // 属性切换
  swichNav(e) {
    var current= e.target.dataset.current,
        pName= e.target.dataset.name,
        code= e.target.dataset.code,
        list={},
        listChi=[],
        goodsList=[],
        addIndex = false,
        addIndexChi=false,
        goodsListData = this.data.goodsListData,
        codeTd = this.data.templateId
        code+=code+""+code
    for (var i = 0; i < goodsListData.length;i++){
      if(goodsListData[i].specName==pName){
        addIndex=true
        if (goodsListData[i].goodsSpecificationValueVOList.length>0){
          for (var j = 0; j < goodsListData[i].goodsSpecificationValueVOList.length; j++) {
            if (goodsListData[i].goodsSpecificationValueVOList[j].specValueName==e.target.dataset.namechi) {
              addIndexChi=true
            }
          }
          if (!addIndexChi){
            goodsListData[i].goodsSpecificationValueVOList.push({ specValueCode: code, specValueName: e.target.dataset.namechi })
          }
        }else{
          goodsListData[i].goodsSpecificationValueVOList.push({ specValueCode: code, specValueName: e.target.dataset.namechi })
        }
      }
    }
    if (codeTd == '') {
      codeTd = '000'
    }
    if(!addIndex){
      listChi.push({ specValueCode: code, specValueName: e.target.dataset.namechi })
      list.specName = pName
      list.goodsSpecificationValueVOList = listChi
      list.specCode = codeTd + code
      goodsListData.push(list)
    }
    if (current == this.data.navindex) {
      return false;
    } else {
      this.setData({
        navindex: current,
        goodsListData: goodsListData
      })
    }
  },
  // 删除模板
  unsetSpec: function () {
    var _this = this
    _this.setData({
      show1:true
    })
   
  },
  confirmDetele:function(){
    var _this = this
    var templateId = this.data.templateId
    Api.templateDelete({ templateId: templateId })
      .then(res => {
        wx.showToast({
          title: '删除成功',
          icon: 'none',
          duration: 1000,
          mask: true
        })
        getTempList(_this);
        _this.cancel()
      })
  },
  // 删除模板内容
  deleteTemplateContentId: function (e) {
    var _this = this
    var templateContentId = e.target.dataset.id
    var templateId = this.data.templateId
    var currentTab = this.data.currentTab
    var templateCont = _this.data.templateCont
    var tempContList = templateCont[currentTab].specificationTemplateContentVOList
    var len = tempContList.length
    tempContList.pop()
    templateCont[currentTab].specificationTemplateContentVOList = tempContList
    wx.showModal({
      title: '提示',
      content: '是否要删除？',
      success: function (res) {
        if (res.confirm) {
          _this.setData({
            templateCont: templateCont
          })
          app.http.deleteRequest('/admin/shop/specificationTemplate/deleteTemplateContentByTemplateContentId?templateContentId=' + templateContentId)
            .then(res => {
              const code = res.code
              if (code == 1) {
                wx.showToast({
                  title: '删除成功',
                  icon: 'none',
                  duration: 1000,
                  mask: true
                })
              }
            })
        }
      }
    })
  },
  // 更新模板名称
  updateTemplate: function () {
    this.setData({
      updateSpec: true
    })
  },
  confirm2: function () {
    var _this = this
    var templateId = this.data.templateId
    var currentTab = this.data.currentTab
    var templateCont = _this.data.templateCont
    var templateName = this.data.value
    var templateCont = _this.data.templateCont
    templateCont[currentTab].templateName = templateName
    _this.setData({
      templateCont: templateCont
    })
    if (templateName == '') { _this.checkName() }
    Api.updateTemplateNameUrl({ templateId: templateId, templateName: templateName})
      .then(res => {
          wx.showToast({
            title: '更新成功',
            icon: 'none',
            duration: 1000,
            mask: true
          })
          _this.cancel()
      })
  },
  // 更新规格名字
  editName: function (e) {
    var editId = e.target.dataset.id
    var name = e.target.dataset.name
    var _this = this
    _this.setData({
      editSpec: true,
      editId: editId,
      value1: name,
      specName: name
    })
  },
  confirm3: function () {
    var _this = this
    var templateContentId = this.data.editId
    var specName = this.data.value
      _this.checkName()
    var templateId = _this.data.templateId
    var index = _this.data.currentTab
    var templateCont = _this.data.templateCont
    var tempArr = templateCont[index].specificationTemplateContentVOList
    var parentName = _this.data.specName
    for (var i = 0; i < tempArr.length; i++) {
      if (tempArr[i].specName == parentName) {
        tempArr[i].specName = specName
      }
    }
    templateCont[index].specificationTemplateContentVOList = tempArr
    _this.setData({
      templateCont: templateCont,
      editSpec: false
    })
    Api.updateSpecNameUrl({ templateContentId: templateContentId, specName: specName})
      .then(res => {
          wx.showToast({
            title: '更新成功',
            icon: 'none',
            duration: 1000,
            mask: true
          })
          _this.cancel()
      })

  },
  checkName:function(){
    if(this.data.value==''){
      wx.showToast({
        title: '请输入文字！',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      return
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
    var that = this;
    getTempList(that);
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