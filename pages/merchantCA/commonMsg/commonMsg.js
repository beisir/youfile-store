// pages/merchantCA/commonMsg/commonMsg.js
import Api from '../../../utils/api.js'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nowStep: 1,
    merchantType: '', // 1、个人；2；个体；3；企业
    formData: {

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
        value: app.globalData.projectType == 'xpl' ? '批发商' :'零售商',
        disabled: true,
        key: "merchantType"
      },
      {
        name: '商户性质',
        type: 'select',
        value: '',
        code: '',
        key: "merchantCharacter",
        selectData: [{
          name: '个人',
          code: '1'
        }, {
          name: '个体',
          code: '2'
        }, {
          name: '企业',
          code: '3'
        }]
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
        maxlength: 11,
        inputType: 'number'
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
        type: 'select'
      },
      {
        name: '商户二级分类',
        key: 'secondCategory',
        value: '',
        code: '',
        type: 'select'
      },
      {
        name: '经营省份',
        key: 'province',
        value: '',
        code: '',
        type: 'select'
      }, {
        name: '经营市',
        key: 'city',
        value: '',
        code: '',
        type: 'select'
      }, {
        name: '经营区县',
        key: 'county',
        value: '',
        code: '',
        type: 'select'
      },
      {
        name: '详细地址',
        key: 'address',
        value: ''
      },
    ],
    twoList: []
  },
  pickerChange(e) {
    let nowList = ''
    switch (this.data.nowStep) {
      case 1:nowList='oneList';break;
      case 2:nowList = 'twoList';break;
      case 3:nowList = 'threeList';break;
    }
    e = e.detail
    let index = e.currentTarget.dataset.index,  //第几个字段
        item = this.data[nowList][index].selectData[e.detail.value],  //选中的项
        nowItem = {}

    this.setData({
      [nowList + '[' + index + '].value']: e.detail.value // 选中的index
    })
    // 选择后
    switch (this.data[nowList][index].key) {
      case 'firstCategory':
        this.getClassTwo(item.code)
        break;
      case 'province':
        this.clearSelect('county')
        this.getAddressMes(item.code,'city')
        break; 
      case 'city':
        this.getAddressMes(item.code, 'county')
        break;    
      case 'bankProvince':
        this.getAddressMes(item.code, 'bankCity')
        this.getsubBank()
        break;
      case 'bankCity':
        this.getsubBank()
        break;
    }
  },
  watchInput(e) {
    e = e.detail
    let index = e.currentTarget.dataset.index,
      value = e.detail.value
    switch (this.data.nowStep) {
      case 1:
        this.setData({
          ['oneList[' + index + '].value']: value
        })
        break;
      case 2:
        this.setData({
          ['twoList[' + index + '].value']: value
        })
        break;
      case 3:
        this.setData({
          ['threeList[' + index + '].value']: value
        })
        break;
    }
  },
  uploadImg(e) {
    let index = e.detail.index

    Api.imagesignUp({ filePath: e.detail.url}).then(res=>{
      let value = res.obj
      switch (this.data.nowStep) {
        case 1:
          this.setData({
            ['oneList[' + index + '].value']: value
          })
          break;
        case 2:
          this.setData({
            ['twoList[' + index + '].value']: value
          })
          break;
        case 3:
          this.setData({
            ['threeList[' + index + '].value']: value
          })
          break;
      }
    })    
  },
  clickItem(e){
    if(this.data.reClick){return}
    let item = e.detail.item
    if (item.key === "headBankCode"){
      this.setData({reClick:true},()=>{
        setTimeout(()=>{
          this.setData({reClick: false})
        },2000)
      })
      wx.navigateTo({
        url: '../bankList/bankList',
      })
    }
  },
  // 一二级分类
  getClassone() {
    Api.merchantClassOne().then(res => {
      let arr = res.obj,
        selectArr = []
      arr.forEach(el => {
        selectArr.push({
          name: el.industryName,
          code: el.industryCode
        })
      })
      this.setSelect('firstCategory', selectArr)
    })
  },
  getClassTwo(parentCode) {
    Api.merchantClassTwo({
      parentCode
    }).then(res => {
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
  setSelect(key, arr, step) {
    let dataarr = 'oneList'
    switch (this.data.nowStep) {
      case 2:
        dataarr = 'twoList'
        break;
      case 3:
        dataarr = 'threeList'
        break;
    }
    let nowindex = ''
    this.data[dataarr].forEach((el, index) => {
      if (el.key === key) {
        nowindex = index
      }
    })
    if (!nowindex){return}
    this.setData({
      [dataarr + '[' + nowindex + '].value']: '',
      [dataarr + '[' + nowindex + '].selectData']: arr?arr:[]
    })
  },
  clearSelect(key){
    let dataarr = 'oneList'
    switch (this.data.nowStep) {
      case 2:
        dataarr = 'twoList'
        break;
      case 3:
        dataarr = 'threeList'
        break;
    }
    let nowindex = ''
    this.data[dataarr].forEach((el, index) => {
      if (el.key === key) {
        nowindex = index
      }
    })
    this.setData({
      [dataarr + '[' + nowindex + '].value']: '',
      [dataarr + '[' + nowindex + '].selectData']: []
    })
  },
  ifEmpty(dataArr){
    let obj = {}
    for (let el of dataArr) {
      if (el.type === 'select' && el.value) {
        obj[el.key] = el.selectData[el.value].code
        continue
      }
      obj[el.key] = el.value
      if (obj[el.key] == '' || !obj[el.key]) {
        Api.showToast("请完善" + el.name)
        return false
      }
    }
    return obj
  },
  toTwo() {
    let dataArr = this.data.oneList
    let obj = this.ifEmpty(dataArr)
    if (!obj){return}

    Api.merchantBaseMsg(obj).then(res=>{
      obj.merchantType = app.globalData.projectType == 'xpl' ? 1 : 2
      this.setData({
        merchantType: obj.merchantCharacter,  // 1、个人；2；个体；3；企业
        nowStep: 2
      }, () => {
        this.getTwoList()
      })
    })
  },
  toThree() {
    let dataArr = this.data.twoList
    let obj = this.ifEmpty(dataArr)
    if (!obj) { return }

    obj.merchantNumber = this.data.message.merchantNumber
    Api.merchantCAMsg(obj).then(res => {
      this.setData({
        nowStep: 3
      }, () => {
        this.getThreeList()
      })
    })
  },
  submit(){
    let dataArr = this.data.threeList
    let obj = this.ifEmpty(dataArr)
    if (!obj) { return }

    obj.merchantNumber = this.data.message.merchantNumber
    Api.merchantSettleMsg(obj).then(res=>{

    })
  },
  // 获取省市区
  getAddressMes(parentCode,targetKey){
    Api.getAddressMes({
      parentCode: parentCode ? parentCode :'100000',
      pageNum: 1,
      pageSize: 50
    }).then(res=> {

      let addArr = []
      res.obj.result.forEach(el => {
        addArr.push({ name: el.name, code: el.code })
      })
      if (!parentCode){
        // 省
        this.setData({ province: addArr})
        this.setSelect('province', addArr)
        return
      }
      // 联动
      if(targetKey){
        this.setSelect(targetKey, addArr)
      }
    })
  },
  // 动态生成二级列表
  getTwoList() {
    let arr = [{
      name: '统一社会信用代码证号',
      key: 'unifiedCertificateNo',
      role: '3'
    }, {
      name: '开户许可证编号',
      key: 'openCertificateNo',
      role: '3'
    }, {
      name: '统一社会信用代码证',
      key: 'unifiedCertificateUrl',
      type: 'img',
      role: '3',
      imgUrl: '/image/xydmz.png'
    }, {
      name: '银行开户许可证',
      key: 'bankOrganUrl',
      type: 'img',
      imgUrl: '/image/yhkkhxkz.png',
      role: '3'
    }, {
      name: '法人姓名',
      key: 'legalPerson',
      role: '1,2,3'
    }, {
      name: '法人电话',
      key: 'legalPhone',
      role: '1,2,3',
      inputType: 'number',
      maxlength: 11
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
      imgUrl: '/image/xydmz.png',
      role: '2'
    }, {
      name: '身份证正面',
      key: 'idCardFaceUrl',
      type: 'img',
      imgUrl: '/image/sfzzm.png',
      role: '1,2,3'
    }, {
      name: '身份证反面',
      key: 'idCardConUrl',
      type: 'img',
      imgUrl: '/image/sfzfm.png',
      role: '1,2,3'
    }, {
      name: '手持身份证',
      key: 'handIdCardUrl',
      type: 'img',
      imgUrl: '/image/scsfz.png',
      role: '1,2,3'
    }, {
      name: '经营场所门头照',
      key: 'storePhotoUrl',
      type: 'img',
      imgUrl: '/image/mtz.png',

      role: '1,2,3'
    }, {
      name: '收银台场景照',
      key: 'scenePhoneUrl',
      type: 'img',
      imgUrl: '/image/syt.png',
      role: '1,2,3'
    }]

    if (this.data.merchantType) {
      let newTwo = arr.filter(el => {
        return el.role.indexOf(this.data.merchantType) > -1
      })
      this.setData({
        twoList: newTwo
      })
    }
  },
  getThreeList() {
    let arr = [{
      name: '银行账户',
      key: 'bankCard',
      role: '1,2,3'
    }, {
      name: '开户卡类型',
      key: 'bankCardType',
      value: this.data.merchantType == 3 ? '对公' : '对私',
      disabled: true,
      role: '1,2,3'
    }, {
      name: '开户名',
      key: 'accountName',
      role: '1,2,3'
    }, {
      name: '开户银行总行',
      key: 'headBankCode',
      role: '1,2,3',
      disabled: true
    }, {
      name: '开户银行省份',
      key: 'bankProvince',
      value: '',
      code: '',
      type: 'select',
      role: '1,2,3',
      selectData: this.data.province
    }, {
      name: '开户行城市',
      key: 'bankCity',
      value: '',
      code: '',
      type: 'select',
      role: '1,2,3'
    }, {
      name: '开户行支行',
      key: 'subBankCode',
      value: '',
      code: '',
      type: 'select',
      role: '1,2,3'
    }, {
      name: '结算银行卡',
      key: 'settlementCardUrl',
      type: 'img',
      imgUrl: '/image/yhk.png',
      role: '1,2'
    }, {
      name: '手持银行卡',
      key: 'handBankCardUrl',
      type: 'img',
      imgUrl: '/image/scyhk.png',
      role: '1,2'
    }]
    if (this.data.merchantType) {
      let newThree = arr.filter(el => {
        return el.role.indexOf(this.data.merchantType) > -1
      })
      this.setData({
        threeList: newThree
      })
    }
  },
  // 获取到总行
  checkBank(item){
    console.log(item)
    let arr = this.data.threeList,
        nowIndex = ''
    arr.forEach((el,index)=>{
      if (el.key === 'headBankCode') {
        nowIndex = index
      }
    })
    this.setData({
      ['threeList['+nowIndex+'].value']:item.bankName,
      choseBank: item
    }, () => { this.getsubBank()})
  },
  getsubBank(){
    setTimeout(()=>{

    let arr = this.data.threeList,
        obj = {}
    arr.forEach(el=>{
      switch(el.key){
        case 'headBankCode':
          obj[el.key] = el.value
          break;
        case 'bankProvince':
        case 'bankCity':
          if (el.value){
            obj[el.key] = el.selectData[el.value].code
          }
          break;
      }
    })
    if (obj.headBankCode && obj.bankProvince && obj.bankCity){
      Api.getSubBankList({
        headBankCode: this.data.choseBank.bankCode,
        provinceCode: obj.bankProvince,
        cityCode: obj.bankCity
      }).then(res=> {
        let arr = []
        res.obj.forEach(el=>{
          arr.push({ name: el.bankName, code: el.bankCode})
        })
        this.setSelect('subBankCode',arr)
      })
    }
    },300)
  },
  getDetail(){
    Api.merchantDeatail().then(res=>{
      this.setData({
        message: res.obj
      },()=>{
        this.getClassone() //一级分类
        this.getAddressMes()
        this.setData({
          nowStep: 2,
          merchantType:1
        }, () => {
          this.getTwoList()
          setTimeout(() => {
            this.getThreeList()
          }, 1000)
        })
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
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

  }
})