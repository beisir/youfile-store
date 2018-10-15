import http from '../../../utils/util';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    colorData: ["DA2728", "25A5EC", "1CB72E", "C63278","FBA82A"],
    showColor:"333",
    changeFont:false,
    changeColor:false,
    changeColorFont:false,
    lists: [{ input: false, no: 0 }],
    value:'',
    index:'',
    params: {jsondata: "{'idcard':'110108198009256079','date':'2018-05-14','type':'day'" +
        "}"},
    viewData: [],
  },
  addList: function () {
    var lists = this.data.lists;
    var newData = { input: 0};
    lists.push(newData);//实质是添加lists数组内容，使for循环多一次
    this.setData({
      lists: lists,
    })
  },
  delList: function () {
    var lists = this.data.lists;
    lists.pop();      //实质是删除lists数组内容，使for循环少一次
    this.setData({
      lists: lists,
    })
  },   
  getInput: function (e) {
    var data = (e.detail.value).split('\n').join('&')
    var array=data.split("&")
    var list=[]
    for(var i=0;i<array.length;i++){
      list.push({ cont: array[i] })
    }
    this.setData({
      viewData:list
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  // timer: setInterval(function () {//这里把setInterval赋值给变量名为timer的变量
  //   this.onLoad()
  // }, 1000),
  onLoad: function (options) {
    // http.request('https://xyk-doctor.com/api/shop/shoppingcart/findByGoodsId/1', 'get', this.data.params, '正在加载数据', function (res) {
    // })
  },
  searchSubmit: function (e) {
    var lists = this.data.lists;
    var index=e.target.dataset.id
    var newData = { input: true, no: 0};
    lists.splice(index, 0, newData);
    // lists.push(newData);//实质是添加lists数组内容，使for循环多一次
    this.setData({
      lists: lists,

    })
  },
  // 图片上传
  chooseImage: function () {
    var _this = this;
    wx.chooseImage({
      count: 6, // 最多可以选择的图片张数，默认9
      sizeType: ['compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function (res) {
        // success
        var imgSrc = res.tempFilePaths;
        var lists = _this.data.lists;
        for (var i = 0; i < imgSrc.length; i++) {
          var str = imgSrc[i]
          var newData = { img: str };
          var newInput = { input: false, no: 0 };
          lists.push(newData);
        }
        lists.push(newInput);
        
        // 控制触发添加图片的最多时隐藏
        _this.setData({
          lists: lists,
        })
        // var tempFilePaths = res.tempFilePaths
        // wx.uploadFile({
        //   url: 'http://example.weixin.qq.com/upload', //仅为示例，非真实的接口地址
        //   filePath: tempFilePaths[0],
        //   name: 'file',
        // header: {
        //   "Content-Type": "multipart/form-data"
        // }
        //   formData: {
        //     'user': 'test'
        //   },
        //   success: function (res) {
        //     var data = res.data
        //     //do something
        //   }
        // })
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
  },
  // 字体加粗 
  changeFont:function(){
    this.setData({
      changeFont:true
    })
  },
  // 改变颜色
  showColor:function(){
    this.setData({
      showColor: !this.data.showColor
    })
  },
  changeColor:function(e){
    this.setData({
      changeColorFont: e.target.dataset.index
    })
  },
 
  // 添加图片
  changeImg:function(){

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

  },

})