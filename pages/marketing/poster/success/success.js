// pages/marketing/poster/success/success.js
import API from '../../../../utils/api.js'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    img:[],
    current:0
  },
  changeImg(e){
    if (e.detail.current === 0 && this.data.current>1){
      this.setData({ current: this.data.current })
    }else{
      this.setData({ current: e.detail.current })
    }
  },
  pre(){
    if (this.data.noturn) { return }    
    this.setData({noturn: true},()=>{
      let current = this.data.current;
      if (current > 0) {
        this.setData({ current: current - 1})
      }
      this.setData({ noturn: false })
    })
  },
  next(){
    if (this.data.noturn) { return }    
    this.setData({ noturn: true }, () => {
      let current = this.data.current;
      if (current < this.data.img.length-1) {
        this.setData({ current: current + 1})
      }
      this.setData({ noturn: false })
    })
  },
  downLoadImg() {
    wx.authorize({
      scope: 'scope.writePhotosAlbum',
      success: (res) => {
        let arr = this.data.img;
        wx.showLoading({
          title: '正在保存',
          mask: true,
        })
        arr.forEach((el, index) => {
          wx.getImageInfo({
            src: el,
            success(res) {
              wx.saveImageToPhotosAlbum({
                filePath: res.path,
                success: () => {
                  API.showToast('保存成功')
                },
                complete() {
                  if (index == arr.length - 1) {
                    wx.hideLoading()
                  }
                }
              })
            }
          })
        })
      },
      fail(e) {
        API.showToast("您未授权相册权限~")
      }
    })
  },
  toStoreroom(){
    this.setData({ storeroomModul: true })
  },
  getRoom() {
    API.getPosterTagList({ posterNum: 0 }).then(res => {
      let arr = res.obj;
      this.setData({ roomList: arr })
    })
    
  },
  // 选择专辑
  check_room(e) {
    let thisindex = e.currentTarget.dataset.index,
      arr = this.data.roomList;
    arr.forEach((el, index) => {
      if (index == thisindex) {
        el.checked = true
      } else {
        el.checked = false
      }
    })
    this.setData({ roomList: arr })
  },
  sureRoom(){
    let arr = this.data.roomList,
        room = '';
    arr.forEach(el => {
      if (el.checked ) {
        room = el
      }
    })
    this.closeModal()
    // 上传图片
    if(room){
      this.setData({chosedRoom:room})
      let imgarr = this.data.img;
      let porimseArr = [];
      // 串行上传
      app.http.uploadImgArr(imgarr)
      // 并行上传
      // imgarr.forEach(el => {
      //   porimseArr.push(app.http.onlyUploadImg(el,'',true))
      // })
      // Promise.all(porimseArr).then(res => {
      //   let sendArr = []
      //   res.forEach(el => {
      //     sendArr.push({
      //       goodsId: this.data.goodsId,
      //       poster: JSON.parse(el).obj,
      //       storeId: wx.getStorageSync('storeId'),
      //       tagCodes: [room.code],
      //       templateId: this.data.templateId
      //     })
      //   })
      //   API.uploadPoster(sendArr).then(res => {
      //     wx.hideLoading()
      //     API.showToast(res.message)
      //   })
      // }).catch(e=>{
      //   API.showToast("上传失败，请稍后再试")
      // })
    }
  },
  // 图片上传成功
  mulImgUploadSuccess(res){
    let sendArr = []
    res.forEach(el => {
      sendArr.push({
        goodsId: this.data.goodsId,
        poster: JSON.parse(el).obj,
        storeId: wx.getStorageSync('storeId'),
        tagCodes: [this.data.chosedRoom.code],
        templateId: this.data.templateId
      })
    })
    API.uploadPoster(sendArr).then(res => {
      wx.hideLoading()
      API.showToast(res.message)
    })
  },
  mulImgUploadFail(e){
    console.log(e)
    API.showToast("上传失败请稍后再试")
  },
  closeModal(){
    this.setData({
      storeroomModul:false
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      img: JSON.parse(options.url),
      templateId: options.templateId,
      goodsId: options.goodsId
    })
    this.getRoom()
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