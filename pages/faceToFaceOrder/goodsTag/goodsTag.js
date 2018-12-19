// pages/faceToFaceOrder/goodsTag/goodsTag.js
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    editModal:false,
    delBtnWidth:133,
    name:"",
    list:[{
      name:"戒指",
      checked:false,
      id:1
    }, {
        name: "婚假用品",
        checked: false,
        id: 2
      }, {
        name: "施华洛世奇 LATISHA 四叶草项链女锁骨链 百搭配饰品四叶草吊坠项链施华洛世奇 LATISHA 四叶草项链女锁骨链 百搭配饰品四叶草吊坠项链",
        checked: false,
        id: 3
      }]
  },
  clickTag(e){
    let index = e.currentTarget.dataset.index;
    let key = "list["+index+"].checked";
    this.setData({
      [key]: !this.data.list[index].checked
    })
  },
  // 左滑删除
  touchS(e){
    if (e.touches.length == 1){
      this.setData({
        //设置触摸起始点水平方向位置
        startX: e.touches[0].clientX
      });
    }
  },
  touchM(e){
    if(e.touches.length == 1){
      let moveX = e.touches[0].clientX,
          disX = this.data.startX - moveX,
          delBtn = this.data.delBtnWidth,
          textStyle = "";
      if(disX == 0 || disX < 0){
        textStyle = "left:0rpx";
      } else if(disX > 0){
        textStyle = "left:-"+ disX +"rpx";
        
        if (disX >= delBtn){
          textStyle = "left:-" + delBtn + "rpx";
        }
      }

      let index = e.currentTarget.dataset.index;
      this.setData({
        ["list[" + index + "].textStyle"]: textStyle
      })    
    }
  },
  touchE(e){
    let endX = e.changedTouches[0].clientX,
      disX = this.data.startX - endX,
      delBtn = this.data.delBtnWidth,
      textStyle = "";

    textStyle = disX > delBtn / 2 ? "left:-" + delBtn +"rpx":"left=0rpx";

    let index = e.currentTarget.dataset.index;
    this.setData({
      ["list[" + index + "].textStyle"]: textStyle
    })    
  },
  getGoodsName(e){
    this.setData({
      name:e.detail.value
    })  
  },
  // 删除
  del(e){
    let id = e.currentTarget.dataset.id;

    let arr = this.data.list;
    let newarr = arr.filter(el=>{
      return el.id != id
    })  
    this.setData({
      list:newarr
    })
  },
  // 添加
  addTip(){
    let val = this.data.name.trim();
    wx.showLoading({
      title: '添加中'
    })
    if(val){
      let arr = this.data.list;
      arr.push({
        name: val,
        id: 5,
        checked: true
      })
      this.setData({
        list: arr
      })
    }
    wx.hideLoading()
  },
  // 编辑
  editGoods(){
    this.setData({
      editModal:true
    })  
  },
  sure(){
    let arr = [];
    this.data.list.forEach(el=>{
      if (el.checked){
        arr.push(el)
      }
    })

    var pages = getCurrentPages();
    if (pages.length > 1) {
      //上一个页面实例对象
      var prePage = pages[pages.length - 2];
      prePage.getTag(arr);
      wx.navigateBack();
    }
  },
  //复选
  recheck(){
    let arr = this.data.list;
    let checkedArr = this.data.checked;
    arr.forEach(el=>{
      checkedArr.every(item=>{
        if(el.id == item){
          el.checked = true
          return false
        }
        return true
      })
    })
    this.setData({
      list: arr
    })
  },
  getList(){
    app.http.getRequest("/admin/offlinegoods/"+this.data.storeId+"/list").then(res=>{
      res.obj
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.tag){
      this.setData({
        checked: options.tag.split(",")
      })
      this.recheck()
    }
    this.setData({
      storeId: wx.getStorageSync("storeId")
    })
    this.getList();
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