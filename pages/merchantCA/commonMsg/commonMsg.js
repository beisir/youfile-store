// pages/merchantCA/commonMsg/commonMsg.js
import Api from '../../../utils/api.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    formData: {
      merchantType: '', // 1、个人；2；个体；3；企业
    },
    oneList: [{
        name: '商户名称',
        value: '',
        key: "merchantName"
      },
      {
        name: '商户编号',
        value: '',
        key: "merchantNumber"
      },
      {
        name: '商户简称',
        value: '',
        key: "merchantAbbre"
      },
      {
        name: '商户类型',
        value: '新批零',
        disabled: true,
        key: "merchantType"
      },
      {
        name: '商户性质',
        type : 'select',
        value: '',
        code: '',
        key: "merchantCharacter",
        selectData: [{ name: '个人', code: '1' }, { name: '个体', code: '2' }, { name: '企业', code: '3' }]
      },
      // index 5
      {
        name: '联系人',
        key: 'linkman',
        value: ''
      },
      {
        name: '联系人电话',
        key: 'linkmanPhone',
        value: '',
        maxlength: 11
      },
      {
        name: '联系人邮箱',
        key: 'linkmanEmail',
        value: ''
      },
      // index 8
      {
        name: '商户经营范围',
        key: 'merchantScope',
        value: ''
      },
      {
        name: '商户一级分类',
        key: 'firstCategory',
        value: '',
        code: '',
        type : 'select'
      },
      {
        name: '商户二级分类',
        key: 'secondCategory',
        value: '',
        code: '',
        type : 'select'
      },
      {
        name: '经营省份',
        key: 'province',
        value: '',
        code: '',
        type : 'select'
      }, {
        name: '经营市',
        key: 'city',
        value: '',
        code: '',
        type : 'select'
      }, {
        name: '经营区县',
        key: 'county',
        value: '',
        code: '',
        type : 'select'
      },
      {
        name: '详细地址',
        key: 'address',
        value: ''
      },
    ],
    twoList:[]
  },
  pickerChange(e){
    e = e.detail
    let index = e.currentTarget.dataset.index,
        value = e.detail.value,
        nowItem = this.data.oneList[index]
    if (!nowItem.selectData){
      return 
    }    
    this.setData({
      ['oneList[' + index + '].value']: value
    })
    // 选择后
    switch (nowItem.key) {
      case 'firstCategory':
        this.getClassTwo(nowItem.selectData[value].code)
      break;
    }  
  },
  watchInput(e){
    e = e.detail
    let index = e.currentTarget.dataset.index,
        value = e.detail.value
    this.setData({
      ['oneList[' + index + '].value']: value,
    })
  },
  // 一二级分类
  getClassone(){
    Api.merchantClassOne().then(res=> {
      let arr = res.obj,
          selectArr = []
      arr.forEach(el=>{
        selectArr.push({
          name: el.industryName,
          code: el.industryCode
        })
      })
      this.setSelect('firstCategory',selectArr)
    })
  },
  getClassTwo(parentCode) {
    Api.merchantClassTwo({ parentCode}).then(res => {
      let arr = res.obj,
        selectArr = []
      arr.forEach(el => {
        selectArr.push({
          name: el.industryName,
          code: el.industryCode
        })
      })
      this.setSelect('secondCategory', selectArr)
    })
  },
  // 插入下拉选项
  setSelect(key,arr){
    let nowindex = ''
    this.data.oneList.forEach((el, index) => {
      if (el.key === key) {
        nowindex = index
      }
    })
    this.setData({
      ['oneList[' + nowindex + '].value'] : '',
      ['oneList[' + nowindex + '].selectData']: arr
    })
  },
  toTwo(){
    let dataArr = this.data.oneList,
        obj = {}
    dataArr.forEach(el=>{
      if (el.type === 'select' && el.value){
        obj[el.key] = el.selectData[el.value].code
        return
      } 
      obj[el.key] = el.value
    })    

    this.setData({
      merchantType: obj.merchantCharacter
    },()=>{
      this.getTwoList()
    })
    console.log(obj)
  },
  // 动态生成二级列表
  getTwoList(){
    let arr = [{
      name: '统一社会信用代码证号',
      key: 'unifiedCertificateNo',
      role: '3'
    },{
      name: '开户许可证编号',
      key: 'openCertificateNo',
      role: '3'
    },{
      name: '统一社会信用代码证',
      key: 'unifiedCertificateUrl',
      type: 'img',
      role: '3'
      }, {
        name: '银行开户许可证',
        key: 'bankOrganUrl',
        type: 'img',
        role: '3'
      }, {
        name: '法人姓名',
        key: 'legalPerson',
        role: '1,2,3'
      }, {
        name: '法人电话',
        key: 'legalPhone',
        role: '1,2,3'
      }, {
        name: '法人身份证号',
        key: 'legalIdCard',
        role: '1,2,3'
      }, {
        name: '营业执照编号',
        key: 'businessLicenseNo',
        role: '2'
      }, {
        name: '营业执照',
        key: 'businessLicenseUrl',
        type: 'img',
        role: '2'
      },{
        name: '身份证正面',
        key: 'idCardFaceUrl',
        type: 'img',
        role: '1,2,3'
      }, {
        name: '身份证反面',
        key: 'idCardConUrl',
        type: 'img',
        role: '1,2,3'
      }, {
        name: '手持身份证',
        key: 'handIdCardUrl',
        type: 'img',
        role: '1,2,3'
      }, {
        name: '经营场所门头照',
        key: 'storePhotoUrl',
        type: 'img',
        role: '1,2,3'
      }, {
        name: '收银台场景照',
        key: 'scenePhoneUrl',
        type: 'img',
        role: '1,2,3'
      }]

    if (this.data.merchantType){
      let newTwo = arr.filter(el=>{
        return el.role.indexOf(this.data.merchantType) > -1
      })
      this.setData({
        twoList: newTwo
      })
    }  
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getClassone()  //一级分类
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