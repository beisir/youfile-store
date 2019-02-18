//  pages/faceToFaceOrder/goodsTag/goodsTag.js
const API = require("../../../utils/api.js")
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    editModal:false,
    delBtnWidth:133,
    name:"",
    list:[],
    editText:""
  },
  clickTag(e){
    
    let index = e.currentTarget.dataset.index;
    let key = "list["+index+"].checked";

    //最多六个
    if (!this.data.list[index].checked){
      let arr = [];
      this.data.list.forEach(el => {
        if (el.checked) {
          arr.push(el)
        }
      })
      if (arr.length >= 6) {
        API.showToast('最多选择6个商品')
        return
      }
    }

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
    let id = e.currentTarget.dataset.id,
        index = e.currentTarget.dataset.index;
    API.ftfDelGoods({ goodsId: id}).then(res=>{
      let arr = this.data.list;
      arr.splice(index, 1)
      this.setData({
        list: arr
      })
    })
  },
  // 添加
  addTip(){
    let val = this.data.name.trim();
    
    if(val){
      wx.showLoading({
        title: '添加中'
      })
      API.ftfCreatGoods({goodsName:val}).then(res=>{
        wx.hideLoading()
        let goods = res.obj;

        //最多六个
        let checkedArr = [];
        this.data.list.forEach(el => {
          if (el.checked) {
            checkedArr.push(el)
          }
        })
        if (checkedArr.length >= 6) {
          goods.checked = false;
        }else{
          goods.checked = true;
        }

        let arr = this.data.list;
        arr.unshift(goods)
        this.setData({
          list: arr,
          name: ""
        })
      })
    } else {
      API.showToast("请输入商品名称")
    }
  },
  // 编辑
  editGoods(e){
    let name = e.currentTarget.dataset.name,
        nowId = e.currentTarget.dataset.id;
    this.setData({
      editModal:true,
      editText:name,
      nowId,
    })  
  },
  editInput(e){
    this.setData({
      editText : e.detail.value
    })
  },
  saveTip(){
    let val = this.data.editText.trim();
    if(val){
      API.ftfEditGoods({ goodsName: val, goodsId: this.data.nowId}).then(res=>{
        this.setData({
          editModal: false,
          editText: ""
        })
        let arr = this.data.list;

        for(let el of arr){
          if (el.goodsId == this.data.nowId) {
            el.goodsName = val;
            break;
          }
        }
        this.setData({
          list : arr
        })
      })
    }else{
      API.showToast('请填写新名称')
    }
  },


  //确认
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
        if (el.goodsId == item){
          el.checked = true
          return false
        }
        return true
      })
    })
    this.setData({
      list: arr
    })
    this.setData({
      checked: ""
    })
  },
  getList(){
    API.ftfGoodsList().then(res=>{
      let list = res.obj;
      if(list){
        list.forEach(el=>{
          el.checked = false
        })
        this.setData({list})

        if (this.data.checked){
          this.recheck()
        }

      }
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