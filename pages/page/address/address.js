// pages/address/address.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0,
    carts: [{
      "goodEnName": "脉动",
      "goodsId": 1000001,
      "goodsName": "脉动",
      "mainImgUrl": "脉动",
      "orderDetails": [{
        "amount": 4.5,
        "cover": "string",
        "goodsDesc": "颜色:红色",
        "goodsId": 1000001,
        "goodsName": "脉动",
        "id": 0,
        "marketPrice": 4.5,
        "num": 2,
        "orderDetailNumber": 1000001,
        "orderNumber": 1000001,
        "sellPrice": 4.5,
        "skuAmount": 4.5,
        "skuCode": 1000001,
        "wholesalePrice": 4.5
      }],
      "qrcode": "脉动",
      "storeId": "脉动"
    }, {
      "goodEnName": "脉动",
      "goodsId": 1000001,
      "goodsName": "脉动",
      "mainImgUrl": "脉动",
      "orderDetails": [{
        "amount": 4.5,
        "cover": "string",
        "goodsDesc": "颜色:红色",
        "goodsId": 1000001,
        "goodsName": "脉动",
        "id": 0,
        "marketPrice": 4.5,
        "num": 2,
        "orderDetailNumber": 1000001,
        "orderNumber": 1000001,
        "sellPrice": 4.5,
        "skuAmount": 4.5,
        "skuCode": 1000001,
        "wholesalePrice": 4.5
      },
      {
        "amount": 4.5,
        "cover": "string",
        "goodsDesc": "颜色:蓝色",
        "goodsId": 1000001,
        "goodsName": "脉动",
        "id": 0,
        "marketPrice": 4.5,
        "num": 2,
        "orderDetailNumber": 1000001,
        "orderNumber": 1000001,
        "sellPrice": 4.5,
        "skuAmount": 4.5,
        "skuCode": 1000001,
        "wholesalePrice": 4.5
      },
      ],
      "qrcode": "脉动",
      "storeId": "脉动"
    }],
    hiddenSelt: false,
    hiddenSend: true,
    address:"",  //地址
    invoice:{},  //发票
    phone:"", //电话
    msg:"",  //留言
    sendData:{} //获取列表传递参数
  },

  //提交
  submit(){
    let type = this.data.currentTab,
        obj = {};
    if(type == 0){
      //自提
      let phone = this.data.phone;
      if (!phone || !/^1[3|4|5|6|7|8|9]\d{9}$/.test(phone)) {
        wx.showToast({
          title: '请输入正确手机号码',
          icon:'none'
        })
        return false;
      }
      obj.userPhone = phone;
      obj.orderType = 1;
    }else if(type == 1){
      //物流
      let add = this.data.address;
      if(add={}){
        wx.showToast({
          title: '请选择收货人信息',
          icon: 'none'
        })
        return false;
      }
      obj.address = add;
      obj.orderType = 2;
    }

    let goods = this.data.goods;
    let goodsArr = [];
    goods.forEach((el,index,arr)=>{
      let detail = el.preOrderGoodsSkuList;
      if(detail){
        detail.forEach((item, index, arr) => {
          let obj = {};
          obj.goodsId = item.goodsId;
          obj.num = item.num;
          obj.skuCode = item.skuCode;
          goodsArr.push(obj);
        })
      }else{
        goodsArr.push({
          goodsId: el.goodsId,
          num: el.num
        });
      }
    })
    obj.receiptInfo = this.data.invoice;  //发票
    obj.userMemo = this.data.msg  //留言
    obj.orderGoods = goodsArr;  //商品
    obj.orderCategory = 1 //this.data.orderCategory //订单种类
    obj.valuationWay = 1 //delit
    app.http.postRequest("/api/order/",
      obj
    ).then((res)=>{
      //'../success/success'
    })
  },

  watchInput(e){
    let val = e.detail.value,
        type = e.currentTarget.dataset.type;
    switch(type){
      case "phone" :
        this.setData({
          phone: val
        });break;
      case "msg":
        this.setData({
          msg: val
        }); break;
    }    
    
  },
  //获取地址
  getAddress(obj){
    console.log(obj)
    if(!obj){return}
    this.setData({
      address:obj
    })
  },
  //获取发票
  getInvoice(obj){
    if (!obj) { return }
    this.setData({
      invoice: obj
    })
  },
  toInvoiceDetail(){
    let arr = [],
      invoice = this.data.invoice;
    for (let key in invoice){
      arr.push(key + "=" + invoice[key]);
    }
    let str = arr.join("&")
    wx.navigateTo({
      url: "../invoice/invoice?" + str,
    })
  },
  //获取默认地址
  getDefaultAdress(){
    //userid
    app.http.getRequest("/admin/user/usershopaddress/123/default").then((res)=>{
      if(res.obj){
        this.setData({
          address:res.obj
        })
      }
    })
  },
  // 获取数据
  getData(){
    app.http.postRequest("/api/order/store/" + this.data.storeId+"/preorder", this.data.sendData
    ).then((res)=>{
        this.setData({
          store: res.obj.preOrderStore,
          goods: res.obj.preOrderGoodsList
        })
      this.resetGoods();
    })
  },
  //重置goods
  resetGoods(){
    let goods = this.data.goods;
    goods.forEach((el)=>{
      if (!el.num && el.preOrderGoodsSkuList){
        let num = 0;
        el.preOrderGoodsSkuList.forEach((item)=>{
          if (item.num){
            num += item.num;
          }
        })
        el.num = num;
      }
    })
    this.setData({
      goods
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //订单分类[1 进货单|2 普通订单|3 购物车订单]
    let type = options.type;
    this.setData({
      //orderCategory : type,
      storeId : 123,    //delit
      sendData: [
        {
          "goodsId": "180831183155243d4de6",
          "num": 20,
          "skuCode": "180831183155243d4de6_793"
        }, {
          "goodsId": "180831183155243d4de6",
          "num": 50,
          "skuCode": "180831183155243d4de6_edd"
        }, {
          "goodsId": "18090409224959318bf1",
          "num": 100,
          "skuCode": "0"
        }
      ]
    })
    this.getData();
    this.getDefaultAdress();
        

  },
  swichNav: function (e) {
    var that = this;
    if (this.data.currentTab === e.currentTarget.dataset.current) {
      return false;
    } else {
      var index = e.currentTarget.dataset.current
      if(index==1){
        that.setData({
          currentTab: e.currentTarget.dataset.current,
          hiddenSelt: true,
          hiddenSend: false
        })
      }else{
        that.setData({
          currentTab: e.currentTarget.dataset.current,
          hiddenSelt: false,
          hiddenSend: true
        })
      }
      
    }
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