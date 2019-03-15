// pages/marketing/poster/storeroomDetail/storeroomDetail.js
import API from "../../../../utils/api.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    img: [{ src: 'https://dev-image.youlife.me/goods/f0559389-514b-4a5c-bbae-65c0a84d6d48.jpg' }, { src: '/image/openpay-icon4.png' }, { src: '/image/openpay-icon4.png' }, { src: 'https://dev-image.youlife.me/goods/239b9aa9-4af5-4614-8295-0ef658188ead.jpg'}],
    edit: false,
    storeroomModul:false,
    roomList:[]
  },
 
  // 选择模板
  choseImg(e){
    if (!this.data.edit){return}
    let index = e.currentTarget.dataset.index;
    this.setData({
      ["img["+index+"].checked"] : !this.data.img[index].checked
    })
  },
  startEdit(){
    this.setData({ edit: true})
  },
  endEdit(){
    this.setData({ edit: false })

    let arr = this.data.img;
    arr.forEach(el=>{
      el.checked = false
    })
    this.setData({img:arr})
  },
  downLoadImg(){
    wx.authorize({
      scope: 'scope.writePhotosAlbum',
      success:(res)=> {

        let arr = [];
        this.data.img.forEach(el => {
          if (el.checked) {
            arr.push(el)
          }
        })
        if (arr.length == 0) {
          API.showToast("请选择图片")
          return
        }
        wx.showLoading({
          title: '正在保存',
          mask: true,
          complete:()=>{
            let imgarr = this.data.img;
            imgarr.forEach(el => {
              el.checked = false
            })
            this.setData({ img: imgarr })
            setTimeout(()=>{
              wx.hideLoading()
            },15000)
          }
        })
        arr.forEach((el,index)=>{
          wx.getImageInfo({
            src: el.src,
            success(res){
              wx.saveImageToPhotosAlbum({
                filePath: res.path,
                success:()=>{
                  API.showToast('保存成功')
                },
                complete(){
                  if(index == arr.length-1){
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
  // 移到其他专辑
  toOtherStoreroom(){
    let arr = this.data.img.filter(el => el.checked)
    if (arr.length == 0) {
      API.showToast("请选择图片")
      return
    }
    this.setData({ storeroomModul:true})

  },
  getRoom() {
    let arr = [{
      name: '精品女装',
      checked: false
    }]

    arr.unshift({
      name: '放入默认专辑',
      checked: true
    })
    this.setData({ roomList: arr })
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
  },
  /**
   *公用 
   */
  closeModal(){
    this.setData({
      storeroomModul:false
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})