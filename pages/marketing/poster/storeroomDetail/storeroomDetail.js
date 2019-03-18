// pages/marketing/poster/storeroomDetail/storeroomDetail.js
import API from "../../../../utils/api.js"
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseUrl: app.globalData.imageUrl,
    img: [],
    edit: false,
    delModule: false,
    storeroomModul:false,
    roomList:[],
    totalCount: 0
  },
  newName(e){
    this.setData({newName:e.detail.value})
  },

  sureDel(){
    API.delPosterTag({
      tagCode: this.data.code
    }).then(res=> {
      API.showToast(res.message)
      setTimeout(()=>{
        wx.navigateBack()
      },800)
    })
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
    this.setData({ edit: true, newName:this.data.tag.name})
  },
  endEdit(){
    if(!this.data.newName){
      API.showToast('请填写新名字')
      return 
    }
    if (this.data.newName !== this.data.tag.name){
      API.updatePosterTagName({
        tagCode: this.data.code,
        name: this.data.newName
      }).then(res => {
        this.getMsg()
      })
    }
    this.setData({ edit: false })

    let arr = this.data.img;
    arr.forEach(el => {
      el.checked = false
    })
    this.setData({ img: arr })
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
            src: el.poster,
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
    API.getPosterTagList({ posterNum: 0 }).then(res => {
      let arr = res.obj;
      let hasTag = false
      arr.forEach(el=>{
        if(el.name == '默认专辑'){
          hasTag = true
        }
      })
      if (!hasTag){
        arr.unshift({
          name: '放入默认专辑',
          checked: true
        })
      }
      
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
  },
  // 详情
  getMsg(){
    API.getPosterTagMsg({
      code: this.data.code
    }).then(res=> {
      this.setData({tag:res.obj})
    })
  },
  // 列表
  getPage(re){
    if (re) {
      app.pageRequest.pageData.pageNum = 0;
    }
    API.getPosterTagDetail({ tagCode: this.data.code }).then(res => {
      let arr = res.obj.result
      this.setData({ totalCount: res.obj.totalCount, img: res.obj.result})
    })
  },
  // 下页
  nextpage(){
    if (this.data.img.length < 20){return}
    this.getPage()
  },
  // 全部清空
  delAllPoster(){
    API.delAllPoster({tagCode: this.data.code}).then(res=>{
      this.getMsg()
    })
  },
  /**
   *公用 
   */
  closeModal(){
    this.setData({
      storeroomModul:false,
      delModule: false,
      delAllPosterModule: false
    })
  },
  showModal(e){
    let type = e.currentTarget.dataset.type,
        obj = {};
    switch(type){
      case 'del':
        obj.delModule = true
      break;
      case 'delAllPoster':
        obj.delAllPosterModule = true
      break;  
    }
    this.setData(obj)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ code: options.code})
    this.getMsg()
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
    this.getPage(true)
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