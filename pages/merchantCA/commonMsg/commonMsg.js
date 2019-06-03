// pages/merchantCA/commonMsg/commonMsg.js
import Api from '../../../utils/api.js'
const app = getApp()
import { regTest } from '../../../utils/util.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nowStep: 1,
    merchantType: '', // 1、个人；2；个体；3；企业
    formData: {

    },
    oneList: [],
    twoList: []
  },
  pickerChange(e) {
    let nowList = ''
    switch (this.data.nowStep) {
      case 1: nowList = 'oneList'; break;
      case 2: nowList = 'twoList'; break;
      case 3: nowList = 'threeList'; break;
    }
    e = e.detail
    let index = e.currentTarget.dataset.index;  //第几个字段
    if (!this.data[nowList][index].selectData){return}
    let  item = this.data[nowList][index].selectData[e.detail.value],  //选中的项
      nowItem = {}

    this.setData({
      [nowList + '[' + index + '].value']: e.detail.value // 选中的index
    })
    // 选择后
    switch (this.data[nowList][index].key) {
      case 'firstCategory':
        this.getClassTwo(item.code)
        break;
      case 'provinceCode':
        this.clearSelect('countyCode')
        this.getAddressMes(item.code, 'cityCode')
        break;
      case 'cityCode':
        this.getAddressMes(item.code, 'countyCode')
        break;
      case 'bankProvinceCode':
        this.getAddressMes(item.code, 'bankCityCode')
        this.getsubBank()
        break;
      case 'bankCityCode':
        this.getsubBank()
        break;
    }
  },
  watchInput(e) {
    e = e.detail
    if (!e.currentTarget){return}
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
    let index = e.detail.index,
      nowList = ''

    switch (this.data.nowStep) {
      case 1:
        nowList = 'oneList'
        break;
      case 2:
        nowList = 'twoList'
        break;
      case 3:
        nowList = 'threeList'
        break;
    }
    Api.imagesignUp({ filePath: e.detail.url }).then(res => {
      let value = res.obj
      this.setData({
        [nowList + '[' + index + '].value']: e.detail.url,
        [nowList + '[' + index + '].showUrl']: value
      })
    })
  },
  clickItem(e) {
    if (this.data.alreadySuccess) { return }
    if (this.data.reClick) { return }
    let item = e.detail.item
    if (item.key === "headBankCode") {
      this.setData({ reClick: true }, () => {
        setTimeout(() => {
          this.setData({ reClick: false })
        }, 2000)
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
      this.setSelect('firstCategory', selectArr, this.data.message.merchantVO.firstCategory)
      if (this.data.message.merchantVO.firstCategory){
        this.getClassTwo(this.data.message.merchantVO.firstCategory)
      }
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
      this.setSelect('secondCategory', selectArr, this.data.message.merchantVO.secondCategory)
    })
  },
  // 插入下拉选项
  setSelect(key, arr, reCode) {
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
    if (!nowindex) { return }
    // 返现
    let thisvalue = ''
    if (reCode){
      arr.forEach((el,index)=>{
        if (el.code == reCode){
          thisvalue = index+''
        }
      })
    }
    this.setData({
      [dataarr + '[' + nowindex + '].value']: thisvalue,
      [dataarr + '[' + nowindex + '].selectData']: arr ? arr : []
    })
  },
  clearSelect(key) {
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
  ifEmpty(dataArr,ex) {
    let obj = {}
    ex = ex?ex:[]
    for (let el of dataArr) {
      if (el.type === 'select' && el.value) {
        obj[el.key] = el.selectData[el.value].code
        switch (el.key){
          case 'provinceCode':
            obj.province = el.selectData[el.value].name
          break; 
          case 'cityCode':
            obj.city = el.selectData[el.value].name
          break; 
          case 'countyCode':
            obj.county = el.selectData[el.value].name
          break;
          case 'bankProvinceCode': 
            obj.bankProvince = el.selectData[el.value].name
          break;
          case 'bankCityCode':
            obj.bankCity = el.selectData[el.value].name
          break;
        }
        continue
      }
      if (el.value == '' || !el.value) {
        if (ex.indexOf(el.key) == -1){
          Api.showToast("请完善" + el.name)
          return false
        }
      }
      try{
        obj[el.key] = el.value.replace(/\s*/g, "")
      }catch(e){
        obj[el.key] = el.value
      }
    }
    return obj
  },
  toTwo() {
    let dataArr = this.data.oneList
    let obj = this.ifEmpty(dataArr)
    if (!obj) { return }

    if(!regTest({ str: obj.linkmanPhone, type:'phone'})){
      Api.showToast("请填写正确的联系人电话")
      return
    }
    if (!regTest({ str: obj.linkmanEmail, type: 'email' })) {
      Api.showToast("请填写正确的联系人邮箱")
      return
    }

    obj.merchantType = app.globalData.projectType == 'xpl' ? 1 : 2
    Api.merchantBaseMsg(obj).then(res => {
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

    if (!regTest({ str: obj.legalPhone, type: 'phone' })) {
      Api.showToast("请填写正确的法人电话")
      return
    }
    if (!regTest({ str: obj.legalIdCard, type: 'id' })) {
      Api.showToast("请填写正确的法人身份证号")
      return
    }

    obj.merchantNumber = this.data.message.merchantNumber
    Api.merchantCAMsg(obj).then(res => {
      this.setData({
        nowStep: 3
      }, () => {
        this.getThreeList()
      })
    })
  },
  returnPreStep(){
    let nowStep = this.data.nowStep
    switch (nowStep){
      case 2:
        this.setData({
          nowStep:1
        },()=>{
          this.getDetail()
        })
      break;
      case 3:
        this.setData({
          nowStep: 2
        }, () => {
          this.getDetail()
        })
      break;
    }
  },
  submit() {
    let dataArr = this.data.threeList
    dataArr
    let obj = this.ifEmpty(dataArr, ['subBankCode'])
    if (!obj) { return }
    
    //1 对公 2 对私
    obj.bankCardType = this.data.merchantType == 3 ? 1 : 2,
    obj.headBankCode = this.data.choseBank.bankCode
    obj.merchantNumber = this.data.message.merchantNumber
    Api.merchantSettleMsg(obj).then(res => {
      Api.showToast(res.message)
      setTimeout(()=>{
        wx.redirectTo({
          url: '../../page/userM/userM',
        })
      },800)
    })
  },
  // 获取省市区
  getAddressMes(parentCode, targetKey) {
    return new Promise((resolve,reject)=>{
      Api.getAddressMes({
        parentCode: parentCode ? parentCode : '100000',
        pageNum: 1,
        pageSize: 50
      }).then(res => {
        let addArr = []
        res.obj.result.forEach(el => {
          addArr.push({ name: el.name, code: el.code })
        })
        if (!parentCode && !targetKey) {
          // 省
          this.setData({ province: addArr },()=>{
            resolve(res)
          })
          return
        }
        // 联动
        if (targetKey) {
          let reData = ''
          switch (targetKey){
            case 'provinceCode':
            case 'cityCode': 
            case 'countyCode':
            reData = this.data.message.merchantVO[targetKey]
            break;
            case 'bankProvinceCode':
            case 'bankCityCode':
              reData = this.data.message.merchantSettleVO[targetKey]
            break;
          }
          this.setSelect(targetKey, addArr, reData)
        }
        resolve(res)
      }).catch(e=>{
        reject(e)
      })
    })
  },
  resetList(arr,data){
    data = data?data:{}
    arr.forEach((el,index)=>{
      if (this.data.alreadySuccess) {
        el.disabled = true
        el.hideIcon = true
      }
      if(el.type === 'select'){
        if(el.selectData){
          this.setSelect(el.key, el.selectData, data[el.key])
        }
        
      }
      if(el.type === 'img'){
        if (!data[el.key]){return}
        Api.imagesignUp({ filePath: data[el.key] }).then(res => {
          this.setItemData(index,{ value: data[el.key], showUrl: res.obj})
        })
      }
      if(!el.type){
        if (el.key === 'merchantType'){return}
        if (el.key === 'bankCardType') { return }
        el.value = data[el.key] ? data[el.key]:''
      }
    })
    return arr
  },
  setItemData(index,obj){
    let nowList = ''
    switch (this.data.nowStep) {
      case 1: nowList = 'oneList'; break;
      case 2: nowList = 'twoList'; break;
      case 3: nowList = 'threeList'; break;
    }
    for(let key in obj){
      let str = nowList+'['+index+'].'+ key
      this.setData({
        [str]: obj[key]
      })
    }
  },
  getOneList() {
    let arr = [{
      name: '商户名称',
      value: '',
      key: "merchantName",
      maxlength: 40
    },
    {
      name: '商户编号',
      value: this.data.message.merchantNumber,
      key: "merchantNumber",
      disabled: true
    },
    {
      name: '商户简称',
      value: '',
      key: "merchantAbbre",
      maxlength: 40
    },
    {
      name: '商户类型',
      value: app.globalData.projectType == 'xpl' ? '批发商' : '零售商',
      disabled: true,
      key: "merchantType"
    },
    {
      name: '商户性质',
      type: 'select',
      value: '',
      code: '',
      key: "merchantCharacter"
    },
    // index 5
    {
      name: '联系人',
      key: 'linkman',
      value: '',
      maxlength: 30
    },
    {
      name: '联系人电话',
      key: 'linkmanPhone',
      value: '',
      maxlength: 18,
      inputType: 'number'
    },
    {
      name: '联系人邮箱',
      key: 'linkmanEmail',
      value: '',
      maxlength: 40
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
      key: 'provinceCode',
      value: '',
      code: '',
      type: 'select',
      selectData: this.data.province
    }, {
      name: '经营市',
      key: 'cityCode',
      value: '',
      code: '',
      type: 'select'
    }, {
      name: '经营区县',
      key: 'countyCode',
      value: '',
      code: '',
      type: 'select'
    },
    {
      name: '详细地址',
      key: 'address',
      value: ''
    }]
    
    this.setData({
      oneList: this.resetList(arr, this.data.message.merchantVO)
    },()=>{
      let data = this.data.message.merchantVO
      this.setSelect('merchantCharacter', [{
        name: '企业',
        code: '3'
      }, {
        name: '个体',
        code: '2'
      },{
        name: '个人',
        code: '1'
      }], this.data.merchantType)
      this.getAddressMes('', 'provinceCode')
      this.getAddressMes(data.provinceCode, 'cityCode')
      this.getAddressMes(data.cityCode, 'countyCode')
      this.getClassone() //一级分类
    })
  },
  // 动态生成二级列表
  getTwoList() {
    let arr = [{
      name: '统一社会信用代码证号',
      key: 'unifiedCertificateNo',
      role: '3',
      maxlength: 30
    }, {
      name: '开户许可证编号',
      key: 'openCertificateNo',
      role: '3',
      maxlength: 32
    }, {
      name: '统一社会信用代码证',
      key: 'unifiedCertificateUrl',
      type: 'img',
      role: '3',
      imgUrl: '/image/xydmz.png',
      eximg: 'default/businessLicense.png'  
    }, {
      name: '银行开户许可证',
      key: 'bankOrganUrl',
      type: 'img',
      imgUrl: '/image/yhkkhxkz.png',
      role: '3',
      eximg: 'default/licenceForOpeningAccounts.png'  
    }, {
      name: '法人姓名',
      key: 'legalPerson',
      role: '1,2,3',
      maxlength: 30
    }, {
      name: '法人电话',
      key: 'legalPhone',
      role: '1,2,3',
      inputType: 'number',
      maxlength: 18
    }, {
      name: '法人身份证号',
      key: 'legalIdCard',
      role: '1,2,3',
      maxlength: 18
    }, {
      name: '营业执照编号',
      key: 'businessLicenseNo',
      role: '2',
      maxlength: 30
    }, {
      name: '营业执照',
      key: 'businessLicenseUrl',
      type: 'img',
      imgUrl: '/image/xydmz.png',
      role: '2',
      eximg: 'default/businessLicense.png'
    }, {
      name: '身份证正面',
      key: 'idCardFaceUrl',
      type: 'img',
      imgUrl: '/image/sfzzm.png',
      role: '1,2,3',
      eximg: 'default/IDcard.png'
    }, {
      name: '身份证反面',
      key: 'idCardConUrl',
      type: 'img',
      imgUrl: '/image/sfzfm.png',
      role: '1,2,3',
      eximg: 'default/IDcardReverse.png'
    }, {
      name: '手持身份证',
      key: 'handIdCardUrl',
      type: 'img',
      imgUrl: '/image/scsfz.png',
      role: '1,2',
      eximg: 'default/handleIDcard.png'
    }, {
      name: '经营场所门头照',
      key: 'storePhotoUrl',
      type: 'img',
      imgUrl: '/image/mtz.png',
      role: '1,2,3',
      eximg: 'default/shopFront.jpg'
    }, {
      name: '收银台场景照',
      key: 'scenePhoneUrl',
      type: 'img',
      imgUrl: '/image/syt.png',
      role: '1,2,3',
      eximg: 'default/cashierDesk.jpg'
    }]

    if (this.data.merchantType) {
      let newTwo = arr.filter(el => {
        return el.role.indexOf(this.data.merchantType) > -1
      })
      this.setData({
        twoList: this.resetList(newTwo, this.data.message.merchantQualificationVO)
      })
    }
  },
  getThreeList() {
    let arr = [{
      name: '银行账户',
      key: 'bankCard',
      role: '1,2,3',
      maxlength: 32
    }, {
      name: '开户卡类型',
      key: 'bankCardType',
      value: this.data.merchantType == 3 ? '对公' : '对私',
      disabled: true,
      role: '1,2,3'
    }, {
      name: '开户名',
      key: 'accountName',
      role: '1,2,3',
      maxlength: 30
    }, {
      name: '开户银行总行',
      key: 'headBankCode',
      role: '1,2,3',
      disabled: true,
      placeholder:'请选择开户银行总行'
    }, {
      name: '开户银行省份',
      key: 'bankProvinceCode',
      value: '',
      code: '',
      type: 'select',
      role: '1,2,3'
    }, {
      name: '开户行城市',
      key: 'bankCityCode',
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
      role: '1,2',
      eximg: '/default/bankCard.png'
    }, {
      name: '手持银行卡',
      key: 'handBankCardUrl',
      type: 'img',
      imgUrl: '/image/scyhk.png',
      role: '1,2',
      eximg: '/default/handlebankCard.png'
    }]
    if (this.data.merchantType) {
      let newThree = arr.filter(el => {
        return el.role.indexOf(this.data.merchantType) > -1
      })
      this.setData({
        threeList: this.resetList(newThree, this.data.message.merchantSettleVO)
      },()=>{
        let data =  this.data.message.merchantSettleVO
        
        Promise.all([this.getAddressMes('', 'bankProvinceCode'), this.getAddressMes(data.bankProvinceCode, 'bankCityCode')]).then(res=>{
          if (data.headBankCode) {
            this.checkBank({
              bankCode: data.headBankCode,
              bankName: data.headBankName
            })
          }
        })
      })
    }
  },
  // 获取到总行
  checkBank(item) {
    let arr = this.data.threeList,
      nowIndex = ''
    arr.forEach((el, index) => {
      if (el.key === 'headBankCode') {
        nowIndex = index
      }
    })
    this.setData({
      ['threeList[' + nowIndex + '].value']: item.bankName,
      choseBank: item
    }, () => { this.getsubBank() })
  },
  getsubBank() {
    setTimeout(() => {

      let arr = this.data.threeList,
        obj = {}
      arr.forEach(el => {
        switch (el.key) {
          case 'headBankCode':
            obj[el.key] = el.value
            break;
          case 'bankProvinceCode':
          case 'bankCityCode':
            if (el.value) {
              obj[el.key] = el.selectData[el.value].code
            }
            break;
        }
      })
      if (obj.headBankCode && obj.bankProvinceCode && obj.bankCityCode) {
        Api.getSubBankList({
          headBankCode: this.data.choseBank.bankCode,
          provinceCode: obj.bankProvinceCode,
          cityCode: obj.bankCityCode
        }).then(res => {
          if (!res.obj) { this.setSelect('subBankCode', []);return}
          let arr = []
          res.obj.forEach(el => {
            arr.push({ name: el.bankName, code: el.bankCode })
          })
          this.setSelect('subBankCode', arr, this.data.message.merchantSettleVO.subBankCode)
        })
      }else{
        this.setSelect('subBankCode', [])
      }
    }, 300)
  },
  getDetail() {
    Api.merchantDeatail().then(res => {
      if(!res.obj.merchantVO){
        res.obj.merchantVO = {}
      }  
      if (!res.obj.merchantQualificationVO){
        res.obj.merchantQualificationVO = {}
      }
      if (!res.obj.merchantSettleVO){
        res.obj.merchantSettleVO = {}
      }
      if (res.obj.merchantVO.merchantCharacter){
        this.setData({
          merchantType: parseInt(res.obj.merchantVO.merchantCharacter)
        })
      }
      if (res.obj.auditStatus == 'success'){
        this.setData({
          alreadySuccess: true
        })
      }
      this.setData({
        message: res.obj
      }, () => {
        this.getAddressMes().then(res=>{
          if(this.data.nowStep == 1){
            this.getOneList() 
          }else if (this.data.nowStep == 2) {
            this.getTwoList()
          } else if (this.data.nowStep == 3) {
            this.getThreeList()
          }
        })
      })
    })
  },
  navStep(e){
    if (!this.data.alreadySuccess) { return }
    let step = e.currentTarget.dataset.step
    switch (step) {
      case '1':
        this.setData({
          nowStep: 1
        }, () => {
          if (!this.data.oneList || this.data.oneList.length == 0) {
            this.getOneList()
          }
        })
        break;
      case '2':
        this.setData({
          nowStep: 2
        }, () => {
          if (!this.data.twoList || this.data.twoList.length == 0) {
            this.getTwoList()
          }
        })
        break;
      case '3':
        this.setData({
          nowStep: 3
        }, () => {
          if (!this.data.threeList || this.data.threeList.length == 0) {
            this.getThreeList()
          }
        })
        break;
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      merchantType: options.merchantType ? options.merchantType:'',
      nowStep: options.step ? parseInt(options.step):1
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