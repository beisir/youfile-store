// pages/userdetails/userdetails.js
const app = getApp();
import Api from '../../../utils/api.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sexData: [{ sex: "男", val: '1' }, { sex: "女", val: '2' }, { sex: "保密", val: '0' }],
    sex: '男',
    show: true,
    region: ['', '', ''],
    customItem: '全部'
  },
  // 选择地区
  bindRegionChange(e) {
    this.setData({
      region: e.detail.value
    })
    let obj = {
      province: e.detail.value[0],
      city: e.detail.value[1],
      area: e.detail.value[2],
    }
    Api.updateUserInfo(obj).then(res=> {
      Api.showToast('修改成功')
    })
  },
  getData() {
    app.http.getRequest("/api/user/byuserid").then(res => {
      if (res.success) {
        this.setData({
          user: res.obj
        })
        let addArr = [res.obj.province, res.obj.city, res.obj.area]
        this.setData({
          region: addArr
        })
      }
    })
  },
  bindDateChange(e) {
    let date = e.detail.value;
    app.http.putRequest("/api/user/birthday/" + date).then(res => {
      this.after(res)
    })
  },
  choseSex(e) {
    var text = e.target.dataset.text
    this.setData({
      show: true
    })
    app.http.putRequest("/api/user/gender/" + text).then(res => {
      this.after(res)
    })
  },
  after(res) {
    if (res.success) {
      this.getData()
    }
  },
  // 改地区
  changeArea(){
    
  },
  //改微信
  changeWx() {

  },
  //改头像
  changeIcon() {
    app.http.onlychoseImg().then(res => {
      let url = res.tempFilePaths[0];
      Api.toCuttingImg(url,false,200,200)
    })
  },
  afterCuttingImg(url) {
    this.setData({
      noUpload: true
    })
    app.http.uploadImgArr([url],"USER_HEAD_PIC").then(res => {
      var url = res[0]
      if (url) {
        Api.changeIcon({
          headPic: url
        }).then(res => {
          Api.showToast(res.message)
          this.setData({
            ['user.headPic']: url
          })
        })

      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      baseUrl: app.globalData.imageUrl
    })

  },
  updataSex(e) {
    this.setData({
      show: false
    })
  },
  closeShow(e) {
    this.setData({
      show: true
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
    if (this.data.noUpload) {
      this.setData({
        noUpload: false
      })
    } else {
      this.getData();
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