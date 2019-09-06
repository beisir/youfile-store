// pages/active/createAC/createAC.js
const app = getApp()
import Api from '../../../utils/api.js'
var dateTimePicker = require('../../../utils/dateTimePicker.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseUrl: app.globalData.imageUrl,
    dayandhour: [[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29], [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24]],
    moduleList:[{},{}]
  },
  // 上传模板
  uploadModul(){
    app.http.onlychoseImg({sourceType: ['album'] ,upload: true}).then(res=>{
      console.log(res)
    })
  },
  mulImgUploadSuccess(arr, type){
    let uploadUrl = arr[0]
    if (uploadUrl){
      let arr = this.data.moduleList
      if (this.data.uploadImg){
        arr.shift()
      }else{
        this.setData({ uploadImg: uploadUrl })
      }
      arr.forEach(el=>el.checked=false)
      arr.unshift({ url: uploadUrl, showUrl: uploadUrl,checked:true})
      this.setData({
        moduleList: arr
      })
    }
  },
  // 字段保存
  submit(){
    let data = {},
      activityName = this.data.activityName,
      activityAbbr = this.data.activityAbbr,
      startTime = this.data.startDataTime,
      time = this.data.time,
      endTime = this.data.endDataTime,
      introduction = this.data.introduction,
      activityPoster = [this.data.activityPoster],
      activityPosterList = this.data.moduleList.filter(el=>el.checked)
    
    if (activityPosterList.length==0){
      Api.showToast("请选择背景模板")
      return
    }
    if (!Api.isNotEmpty(activityName)) {
      Api.showToast("活动名称不能为空！")
      return
    }
    if (!Api.isNotEmpty(activityAbbr)) {
      Api.showToast("活动简称不能为空！")
      return
    }
    if (!Api.isNotEmpty(startTime)) {
      Api.showToast("活动开始时间不能为空！")
      return
    }
    if (!Api.isNotEmpty(time)) {
      Api.showToast("持续时间不能为空！")
      return
    }
    if (!Api.isNotEmpty(introduction)) {
      Api.showToast("活动介绍不能为空！")
      return
    }

    startTime = startTime.replace(/\-/g, '/')
    endTime = endTime.replace(/\-/g, '/')
    var date = new Date(startTime)
    var date1 = new Date(endTime)
    startTime = date.getTime()
    endTime = date1.getTime()
    data.activityName = activityName
    data.activityAbbr = activityAbbr
    data.startTime = startTime
    data.endTime = endTime
    data.introduction = introduction
    data.activityPosterList = [activityPosterList[0].url]
    this.setData({
      confirmCreate: true,
      postData: data
    })    
  },
  // 关闭弹框
  cancel: function () {
    this.setData({
      confirmCreate: false
    })
  },
  // 创建活动
  confirm: function () {
    var data = this.data.postData
    Api.createAC(data).then(res => {
      Api.showToast("创建成功！")
      this.prePage()
      setTimeout(() => {
        wx.navigateBack()
      }, 1000)
    })
  },
  prePage(){
    let cur = getCurrentPages(),
        pre = cur[cur.length-2]
    pre.getList ? pre.getList(true):''    
  },
  // 选择模板
  checkModel(e){
    let thisindex = e.currentTarget.dataset.index,
        arr = this.data.moduleList

    arr.forEach((el,index)=>{
      if(index==thisindex){
        el.checked = true
      }else{
        el.checked = false
      }
    })    
    this.setData({
      moduleList: arr
    })
  },
  getTemList(){
    Api.storeTemList().then(res=>{
      console.log(res)
      let arr = []
      res.obj.forEach(el=>{
        arr.push({
          showUrl: el.posterTemplateSmallUrl,
          url: el.posterTemplateBigUrl
        })
      })
      this.setData({
        moduleList: arr
      })
    })
  },
  setTimePickerData() {
    let dayArr = []
    for (let i = 0; i < 30; i++) {
      dayArr.push(i + '天')
    }
    let hourArr = []
    for (let i = 0; i < 24; i++) {
      hourArr.push(i + '小时')
    }
    this.setData({
      dayandhour: [dayArr, hourArr]
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setTimePickerData()
    this.getTemList()
    this.initData()
    var phone = wx.getSystemInfoSync();  //调用方法获取机型
    if (phone.platform == 'ios') {
      this.setData({ iosTextarea: true })
    }
  },
  watchInput(e){
    let type = e.currentTarget.dataset.type,
        val = e.detail.value,
        obj = {}
    switch(type){
      case 'acname':
        obj.activityName = val
      break;
      case 'acshortname':
        obj.activityAbbr = val
      break;
      case 'acintro':
        obj.introduction = val
      break;
    }
    this.setData(obj)
  },
  // 初始化时间
  initData: function () {
    // 获取完整的年月日 时分秒，以及默认显示的数组
    var obj1 = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
    // 精确到小时的处理，将数组的分秒去掉
    var lastArray = obj1.dateTimeArray.pop();
    var lastTime = obj1.dateTime.pop();
    obj1.dateTimeArray.pop()
    obj1.dateTime.pop();
    this.setData({
      dateTimeArray1: obj1.dateTimeArray,
      dateTime1: obj1.dateTime
    });
  },
  // 改变时间
  changeDateTimeColumn1(e) {
    var arr = this.data.dateTime1,
      dateArr = this.data.dateTimeArray1;
    arr[e.detail.column] = e.detail.value;
    dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);
    this.setData({
      dateTimeArray1: dateArr,
      dateTime1: arr,
    });
  },
  changeDateTime: function () {
    var arr = this.data.dateTime1,
      dateArr = this.data.dateTimeArray1;
    this.setData({
      dateTimeArray1: dateArr,
      dateTime1: arr,
      time: '',
      endDataTime: '',
      startDataTime: dateArr[0][arr[0]] + "-" + dateArr[1][arr[1]] +
        "-" + dateArr[2][arr[2]] + " " + dateArr[3][arr[3]] + ":00:00"
    });
  },
  // 算出结束日期
  addDate: function (dateTemp, days, h) {
    dateTemp = dateTemp.replace(/\-/g, '/')
    var nDate = new Date(dateTemp); //转换为MM-DD-YYYY格式  
    var millSeconds = nDate.getTime() + (days * 24 * 60 * 60 * 1000) + 1000 * 60 * 60 * h;
    var rDate = new Date(millSeconds);
    var year = rDate.getFullYear();
    var month = rDate.getMonth() + 1;
    if (month < 10) month = "0" + month;
    var date = rDate.getDate();
    if (date < 10) date = "0" + date;
    var hour = rDate.getHours();
    if (hour < 10) hour = "0" + hour;
    // var minute = rDate.getMinutes();
    return year + "-" + month + "-" + date + " " + hour + ":00:00"
  },
  changeTime: function (e) {
    var value = e.detail.value,
      startDataTime = this.data.startDataTime,
      days = value[0],
      h = value[1]
    if (!Api.isNotEmpty(startDataTime)) {
      Api.showToast("请选择开始时间！")
      return
    }
    if (!Api.isNotEmpty(days)) {
      days = 0
    }
    if (!Api.isNotEmpty(h)) {
      h = 0
    }
    this.setData({
      time: days + "天" + h + "小时",
      endDataTime: this.addDate(this.data.startDataTime, days, h)
    })
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})