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
    this.closeModal()
  },
  // 选择模板
  choseImg(e){
    let index = e.currentTarget.dataset.index;
    if (!this.data.edit){
      let urlarr = [];
      this.data.img.forEach(el => {
        urlarr.push(this.data.baseUrl + el.poster)
      })
      wx.previewImage({
        urls: urlarr,
        current: urlarr[index],
        success: ()=>{
          this.setData({seeingImg: true})
        }
      })      
      return
    }
    this.setData({
      ["img["+index+"].checked"] : !this.data.img[index].checked
    })
  },
  startEdit(){
    this.setData({ edit: true, newName:this.data.tag.name})
  },
  endEdit(){
    if(!this.data.newName.trim()){
      API.showToast('请输入专辑名称')
      return 
    }
    if (this.data.newName !== this.data.tag.name){
      API.updatePosterTagName({
        tagCode: this.data.code,
        name: this.data.newName.trim()
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
          API.showToast("请选择海报")
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
            },30000)
          }
        })
        this.recursionDownload(0, arr)
      },
      fail(e) {
        API.openSetting()
      }
    })
  },
  recursionDownload(index,arr){
    if (!arr[index]){
      wx.hideLoading()
      API.showToast('保存成功')
      return
    }
    wx.getImageInfo({
      src: this.data.baseUrl + arr[index].poster,
      success:(res)=> {
        wx.saveImageToPhotosAlbum({
          filePath: res.path,
          success: () => {
            
          },
          complete: ()=> {
            this.recursionDownload(index + 1, arr)
          }
        })
      }
    })
  },
  // 移到其他专辑
  toOtherStoreroom(){
    let arr = this.data.img.filter(el => el.checked)
    if (arr.length == 0) {
      API.showToast("请选择海报")
      return
    }
    this.setData({ storeroomModul:true})

  },
  getRoom() {
    API.getPosterTagList({ posterNum: 0 }).then(res => {
      let arr = res.obj;
      let hasTag = false
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

    if (room.code === this.data.tag.code){
      API.showToast("已经在当前专辑了哦~~")
      return
    }

    let imgarr = this.data.img.filter(el=> el.checked)
    let idArr = []
    imgarr.forEach(el=>{
      idArr.push(el.id)
    })
    API.toOtherPosterTag({
      posterIds: idArr.join(','),
      targetTagCode: room.code,
      originTagCode: this.data.tag.code
    }).then(res=> {
      API.showToast(res.message)
      setTimeout(()=>{
        this.getThisPage()
        this.getMsg()
      },800)
      
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
      app.pageRequest.pageData.pageSize = 18
    }
    API.getPosterTagDetail({ tagCode: this.data.code }).then(res => {
      let arr = res.obj.result
      this.setData({ totalCount: res.obj.totalCount, img: res.obj.result})
    })
  },
  getThisPage(){
    if (app.pageRequest.pageData.pageNum>0){
      app.pageRequest.pageData.pageNum = app.pageRequest.pageData.pageNum - 1
    }
    this.getPage()
  },
  // 下页
  nextpage(){
    if (this.data.img.length < 18){return}
    this.getPage()
  },
  // 全部清空
  delAllPoster(){
    API.delAllPoster({tagCode: this.data.code}).then(res=>{
      API.showToast('该专辑下的海报全部清空成功~')
      setTimeout(()=> {
        this.getMsg()
        this.getPage(true)
      },800)
    })
    this.closeModal()
  },
  /**
   *公用 
   */
  closeModal(){
    this.setData({
      storeroomModul:false,
      delModule: false,
      delAllPosterModule: false,
      delPosterArrModule: false
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
      case 'delPoster':
        let arr = this.data.img.filter(el => el.checked)
        if (arr.length == 0) {
          API.showToast("请选择海报")
          return
        }
        obj.delPosterArrModule = true
      break;  
    }
    this.setData(obj)
  },
  delSomePoster(){
    let imgarr = this.data.img.filter(el => el.checked)
    let idArr = []
    imgarr.forEach(el => {
      idArr.push(el.id)
    })
    API.delPosterArr({ posterIds: idArr.join(',')}).then(res=> {
      API.showToast(res.message)
      setTimeout(()=>{
        this.getThisPage()
        this.getMsg()
      },800)
    })
    this.closeModal()
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
    if (this.data.seeingImg){
      this.setData({ seeingImg: false})
      return
    }
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