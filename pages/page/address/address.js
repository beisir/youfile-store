// pages/address/address.js
const app = getApp();
import Api from '../../../utils/api.js'
import { goodsListBindingSku } from '../../../utils/goodsActivity.js'
import { saveFormID } from '../../../utils/modelMsg.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 1,
    hiddenSelt: true,
    hiddenSend: false,
    address:"",  //地址
    invoice:"",  //发票
    phone:"", //电话
    msg:"",  //留言
    sendData:{}, //获取列表传递参数
    orderTitle:"订单",
    payType:[{
      name: "其他支付方式",
      check: true,
      type: 'offline'
    }],
    checkedPaytype: {
      name: "其他支付方式",
      check: true,
      type: 'offline'
    }
  },
  getFormId(e) {
    saveFormID(e)
  },
  //自动获取手机
  getMobile(){
    Api.userInfor().then(res=>{
      if(res.obj.mobile){
        this.setData({
          phone: res.obj.mobile
        })
      }else{
        Api.showToast('获取手机号码失败，请您手动填写')
      }
    })
  },
  //提交
  submit(){
    let type = this.data.currentTab,
        obj = {};
    if(type == 0){
      //自提
      let phone = this.data.phone;
      if (!phone || !/^1[3|4|5|6|7|8|9]\d{9}$/.test(phone)) {
        Api.showToast('请输入正确手机号码')
        return false;
      }
      obj.pickerPhone = phone;
      obj.logisticsMode = 1;
    }else if(type == 1){
      //物流
      let add = this.data.address;
      if(add=={}||!add){
        Api.showToast('请选择收货人信息')
        return false;
      }
      obj.consigneeInfo = add;
      obj.logisticsMode = 2;
      obj.postageinfo = {
        postageType: this.data.postType   //邮费
      }
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
          if (item.isActivity){
            obj.activityNumber = item.standardGoodsSkuPromotions[0].activityNumber
          }
          goodsArr.push(obj);
        })
      }else{
        let newObj = {
          goodsId: el.goodsId,
          num: el.num,
          skuCode: 0
        }
        if (el.hasActiveGoods){
          newObj.activityNumber = el.promotions.SALES_PROMOTION[0].activityNumber
        }
        goodsArr.push(newObj);
      }
    })
    if (this.data.invoice){
      obj.receiptInfo = this.data.invoice;  //发票
    }
    obj.userMemo = this.data.msg  //留言
    obj.orderDetailReqVOList = goodsArr;  //商品
    obj.orderCategory = this.data.orderCategory //订单种类
    obj.payType = this.data.checkedPaytype.type //支付种类
    // 防重
    if (this.data.creatingOrder){return}
    this.setData({creatingOrder: true})
    Api.supplyOrde(obj).then((res)=>{
      //'../success/success'
      setTimeout(()=>{
        Api.showToast(res.message)
      },0)
      setTimeout(()=>{
        if (obj.payType == 'online'){
          wx.redirectTo({
            url: '../../casher/casher/casher?num=' + res.obj.orderNumber
          })
        }else{
          wx.redirectTo({
            url: '../orderSuccess/orderSuccess?num=' + res.obj.orderNumber
          })
        }
      },800)
    }).catch(e=> {
      this.setData({ creatingOrder: false })
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
    app.http.getRequest("/api/user/usershopaddress/default").then((res)=>{
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
        //起批量
        let  conObj = {};       
        res.obj.goodsWholesaleConfigs.forEach((el,index)=>{
          if (el.saleBatchNum && el.saleBatchNum>0){
            conObj[el.goodsId] = el.saleBatchNum
          }
        })

        this.setData({
          store: res.obj.preOrderStore,
          goods: res.obj.preOrderGoodsList,
          goodsConfig: conObj,
          storeConfig: res.obj.storeWholesaleConfig
        })
      this.handleActionGoods(res.obj.preOrderGoodsList)
    })
  },
  // 处理活动商品
  handleActionGoods(goods){
    console.log(goods)
    goods
    let newGoods = goodsListBindingSku(goods, 'preorder')
    this.resetGoods(newGoods);
  },
  //重置goods
  resetGoods(goods){
    let price = 0,
        allnum = 0,
        config = this.data.goodsConfig;
    goods.forEach((el)=>{
      //是否参与活动
      let active = el.hasActiveGoods
      //是否优惠
      let off = el.satisfiedWholesale;
      //起批量
      if (config[el.goodsId]){
        el.goodsConfig = config[el.goodsId];
      }

      //有sku
      if (!el.num && el.preOrderGoodsSkuList){
        el.hasSku = true
        let num = 0,
            myprice = 0 ; 
        el.preOrderGoodsSkuList.forEach((item)=>{
          if (item.num){
            num += item.num;
            let thisPrice = 0;
            //价格
            if (item.isActivity==true){
              thisPrice = item.activityPrice;
            } else if(off==true){
              thisPrice = item.wholesalePrice;
            } else {
              thisPrice = item.sellPrice;
            }

            if (!isNaN(thisPrice * item.num)){
              myprice += thisPrice * item.num;
              price += thisPrice * item.num;
            }
          }
        })
        el.myPrice = myprice.toFixed(2);
        el.num = num;
      }
      //没有sku
      if (el.num && !el.preOrderGoodsSkuList){
        el.hasSku = false
        let thisPrice = 0;
        //价格
        if (active == true) {
          thisPrice = el.activityPrice;
        } else if (off==true) {
          thisPrice = el.wholesalePrice;
        } else {
          thisPrice = el.sellPrice;
        }
        if (!isNaN(thisPrice * el.num)) {
          el.myPrice = (thisPrice * el.num).toFixed(2);
          price += thisPrice * el.num;
        }
      }
      allnum += el.num;      
    })
  
    //全场混批设置
    let storeNum = this.data.storeConfig.saleBatchNum,
        storeAmount = this.data.storeConfig.saleBatchAmount,
        pricesatisfy = false,
        numsatisfy = false;

    if (storeAmount && storeAmount>0 && price > storeAmount){
      pricesatisfy = true;
    }
    if (storeNum && storeNum > 0 && allnum > storeNum){
      numsatisfy = true;
    }

    this.setData({
      goods,
      price: price.toFixed(2),
      allnum,
      numsatisfy,
      pricesatisfy      
    })
  },
  handleSkuList(list) {
    if (list && list.length > 0) {
      let obj = {}
      list.forEach(el => {
        el.goodsSpecificationValueVOList.forEach(sku => {
          obj[sku.specValueCode] = sku.specValueName
        })
      })
      this.setData({ skuNameList: obj })
    }
  },
  //获取店铺信息，得到运费类型
  getStore(){
    Api.storeIdInfo().then(res=>{
      let post = res.obj.store[0].store.postageInfo;
      if(!post){
        post = "邮费到付";
      }
      this.setData({
        postType : post
      })
    })
  },
  //支付方式
  showPayway(){
    this.selectComponent("#payway").open();
  },
  getPayway(){
    Api.storeOnlinePay().then(res => {
      let obj = {};
      if (res.obj && res.obj.onlinePay) {
        obj.onlinePay = true
        let arr = this.data.payType;
        arr.forEach(el=>{
          el.check = false
        })
        let onlinepayObj = {
          name: '在线支付',
          type: "online",
          check: true
        };
        arr.unshift(onlinepayObj)
        this.setData({
          payType: arr,
          checkedPaytype: onlinepayObj
        })

        this.setData(obj);
      }
    }).catch(e => {

    })
  },
  sureBottomLayer(){
    let arr = this.data.payType;
    let checkedItem = "";
    arr.forEach(el => {
      if(el.check == true){
        checkedItem = el
      }
    })
    this.setData({
      checkedPaytype: checkedItem
    })
  },
  chosePaytype(e){
    let type = e.currentTarget.dataset.type;
    let arr = this.data.payType;
    arr.forEach(el => {
      if (el.type == type){
        el.check = true
      }else{
        el.check = false
      }
    })
    this.setData({ payType:arr})
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let userType = wx.getStorageSync('identity'),
      storeId = wx.getStorageSync('storeId'),
      adminType= wx.getStorageSync("admin");
    
    this.setData({
      baseUrl: app.globalData.imageUrl
    })

    //订单分类[1 进货单|2 普通订单|3 购物车订单]
    let orderType = 3;
    //adminType=3;//delit
    if (adminType==1){
      //普通用户
      orderType = 3;
    } else if (adminType == 3 || adminType == 2){
      //批发商
      orderType = 1;  
      this.setData({orderTitle:'进货单'})
      wx.setNavigationBarTitle({
        title: '提交进货单',
      })
    }

    //let type = options.type;
    let model = "";
    if (options.model){
      model = JSON.parse(options.model);
    }
    //model = { "goodsId": "180904092152685923df", "num": 1, "skuCode": "180904092152685923df_38a" }
    
    //读取数据

    if(!Array.isArray(model)){
      model = [model]
    }
    this.setData({
      orderCategory: orderType,
      storeId: storeId ?storeId:123,    
      sendData: model,
    })
    this.getData();
    this.getDefaultAdress();

    this.getStore();
    //初始化支付方式
    this.getPayway();
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
    var admin = wx.getStorageSync('admin')
    this.setData({
      admin: admin
    })
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