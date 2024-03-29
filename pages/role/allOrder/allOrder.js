// pages/nopay/nopay.js
const util = require('../../../utils/util.js');
import API from "../../../utils/api.js";
import { saveFormID } from '../../../utils/modelMsg.js'
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    reason: [{ title: "无法联系上买家", selected: true }, { title: "买家误拍或重拍", selected: false }, { title: "买家无诚意完成交易", selected: false }, { title: "缺货无法交易", selected: false }, { title: "其他原因", selected: false }],
    cancelIndex: 0,
    orderName: "订单",
    timeOnce: true,
    remark: ""
  },
  // 查看出库详情
  toDetail(){
    wx.navigateTo({
      url: '/distribution/pages/purchase/orderOutHouseDetail/orderOutHouseDetail?orderType=' + this.data.orderType,
      success: (a) => {
        a.eventChannel.emit('sendSkuData', {
          list: this.data.order.stockOutDetailsVos
        })
      }
    })
  },
  // 发货
  sendOutGoods(e){
    let type = e.currentTarget.dataset.type
    wx.navigateTo({
      url: '/distribution/pages/purchase/outHouse/outHouse?orderNum=' + this.data.num + '&orderType=' + type,
    })
  },
  // 埋点存储formid
  getFormId(e) {
    saveFormID(e)
  },
  // 编辑物流
  editExpress(){
    if (this.data.editexpressCom && this.data.editexpressNum){
      API.editOrderExpress({ 
        code: this.data.order.stockOutDetailsVos[this.data.editexpressIndex].code,
        expressNumber: this.data.editexpressNum,
        expressCompany: this.data.editexpressCom
      }).then(res => {
        API.showToast(res.message)
        this.afterOperation();
      })
    }else{
      API.showToast("请填写完整")
    }
  },
  // 复制地址
  copyAdd(){
    wx.setClipboardData({
      data: `收货人：`+ this.data.order.consigneeInfo.userName + `
手机号码: ` + this.data.order.consigneeInfo.userPhone + `
收货地址：` + this.data.order.consigneeInfo.province +this.data.order.consigneeInfo.city+ this.data.order.consigneeInfo.county+ this.data.order.consigneeInfo.detailAddress,
      success(res) {
        API.showToast("已成功复制收货人信息和收货地址")
      }
    })
  },
  // 编辑地址
  editAdd(){
    wx.navigateTo({
      url: '../changeOrderAdd/changeOrderAdd?num=' + this.data.order.orderNumber,
    })
  },

  toHome() {
    API.toHome();
  },

  //复制订单号
  copyCode() {
    wx.setClipboardData({
      data: this.data.order.orderNumber,
      success: () => {
        API.showToast('复制' + this.data.orderName + '号成功')
      }
    })
  },
  //复制运单号
  copyKdCode() {
    if (this.data.order.expressNumber) {
      wx.setClipboardData({
        data: this.data.order.expressNumber,
        success: () => {
          API.showToast('复制快递单号成功')
        }
      })
    }

  },

  // 监听输入
  watchInput(e) {
    let type = e.currentTarget.dataset.type;
    let key = "";
    switch (type) {
      case "change":
        key = 'changeMoney';
        let nowMoney = Number(e.detail.value),
          order = Number(this.data.thisOrderMoney),
          moneyIcon = "-";
        if (nowMoney > order) {
          moneyIcon = "+"
        }
        this.setData({
          moneyIcon: moneyIcon
        })
        break;
      case "goodCode": key = "getGoodCode"; break;
      case "exCom": key = "expressageCom"; break;
      case "exCode": key = "expressageCode"; break;
      case "tip": key = "tipText"; break;
      case 'editExCom': key = 'editexpressCom';break;
      case 'editExCode': key = 'editexpressNum'; break;
    }

    let val = e.detail.value
    if (key == "changeMoney") {
      this.setData({
        showChangeMoney: Number(val).toFixed(2)
      })
    }
    this.setData({
      [key]: val
    })
  },
  showModal(e) {
    console.log(e)
    let type = e.currentTarget.dataset.type;
    let num = e.currentTarget.dataset.num;
    let obj = {};
    switch (type) {
      case 'express':
        let index = e.currentTarget.dataset.index
        obj = {
          expressModal: true,
          editexpressCom: this.data.order.stockOutDetailsVos[index].expressCompany,
          editexpressNum: this.data.order.stockOutDetailsVos[index].expressNumber,
          editexpressIndex: index
        }
        break;
      case "tip":
        obj = {
          tipModal: true,
          tipText: ""
        };
        break;
      case "change":
        obj = {
          changeModal: true,
          changeMoney: 0,
          showChangeMoney: 0,
          moneyIcon: "-",
          thisOrderMoney: e.currentTarget.dataset.change
        }; break;
      case "goodCode":
        obj = {
          codeModal: true,
          getGoodCode: ""
        }; break;
      case "yundan":
        obj = {
          expressage: true,
          expressageCom: "",
          expressageCode: "",
          noBtn: true
        }; break;
      case "ex":
        obj = {
          expressage: true,
          expressageCom: "",
          expressageCode: "",
          noBtn: false
        }; break;
      case 'sureGet':
        obj = {
          sureModal: true,
        }; break;
      case 'del':
        obj = {
          delModal: true,
        }; break;
      case 'cancel':
        obj = {
          cancelModal: true,
        }; break;
    }
    this.setData(obj)
  },
  //查看凭证
  seeVoucher(e) {
    let num = this.data.num;
    API.seeVoucher({ orderNumber: num }).then((res) => {
      if (res.obj.payVoucher) {
        wx.previewImage({
          urls: [this.data.baseUrl + res.obj.payVoucher]
        })
      } else {
        API.showToast('未上传付款凭证')
      }
    })
  },

  // 验证取货码
  testCode() {
    let num = this.data.num;
    let money = this.data.getGoodCode;
    if (!money || money < 0) {
      API.showToast('请输入验证码')
      return
    }
    API.testGoodCode({
      orderNumber: num,
      claimGoodsNum: money
    }).then((res) => {
      this.afterOperation();
      API.showToast(res.message)
    })
  },

  // 取消订单
  sureCancel() {
    let num = this.data.num,
      index = this.data.cancelIndex;
    API.closeOrder({
      reason: this.data.reason[index].title,
      orderNumber: num
    }).then((res) => {
      this.afterOperation();
      API.showToast(res.message)
    })
  },
  //取消理由
  swichReason(e) {
    var current = e.currentTarget.dataset.current;
    var array = this.data.reason
    array.forEach((item, index, arr) => {
      if (current == index) {
        item.selected = true;
      } else {
        item.selected = false;
      }
    })
    this.setData({
      reason: array,
      cancelIndex: current
    })
  },


  // 我要发货
  // 待填表
  sendGoods(e) {
    let type = e.currentTarget.dataset.type,
      num = this.data.num,
      obj = {
        orderNumber: num
      };
    if (type == 'no') {
      //不填单发货
    } else {
      //填单发货
      obj.expressCompany = this.data.expressageCom;
      obj.expressNumber = this.data.expressageCode;
      if (!obj.expressNumber) {
        API.showToast("请填写运单号")
        return
      }
    }
    API.addExpress(obj).then((res) => {
      this.afterOperation();
      API.showToast(res.message)
    })

  },
  // 整体改价
  sureChange() {
    let num = this.data.num;
    let money = this.data.changeMoney;
    if (!money || money <= 0) {
      API.showToast('请输入金额')
      return
    }
    API.updatetotal({
      orderNumber: num,
      orderAmount: money
    }).then((res) => {
      this.afterOperation();
      API.showToast(res.message)
    })
  },
  //确认收款
  receiveMoney(e) {
    let num = this.data.num;
    app.http.requestAll("/admin/order/orderpayment/" + num + "/confirm", {
      orderNumber: num
    }, "POST").then((res) => {
      API.showToast(res.message)
      this.afterOperation();
    })
  },
  // 保存备注
  saveRemark(e) {
    let val = this.data.tipText;
    if (!val) {
      API.showToast('请修改备注')
      return
    }
    API.addRemark({
      orderNumber: this.data.num,
      remark: val
    }).then(res => {
      API.showToast(res.message)
      this.afterOperation();
    })
  },

  //刷新数据
  afterOperation() {
    this.closeModal();
    setTimeout(() => {
      this.getData(true);
    }, 800)
  },
  closeModal() {
    this.setData({
      changeModal: false,  //改价
      codeModal: false,  //取货码
      sureModal: false,  //收款
      delModal: false,  //删除
      cancelModal: false, //取消订单
      expressage: false, //发货
      tipModal: false, //备注
      expressModal: false //物流
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.type == 'list') {
      wx.setNavigationBarTitle({
        title: "供货单详情"
      })
      this.setData({
        orderName: '供货单'
      })
    }
    if (options.num.substring(6, 8) == '04'){
      wx.redirectTo({
        url: '../../faceToFaceOrder/shopkeeperDetail/shopkeeperDetail?code=' + options.num,
      })
    }
    this.setData({
      num: options.num,
      baseUrl: app.globalData.imageUrl,
    })

  },
  //打电话
  tel: function () {
    if (this.data.order.userInfo.mobile) {
      wx.makePhoneCall({
        phoneNumber: this.data.order.userInfo.mobile,
      })
    } else {
      API.showToast('买家未设置电话号码')
    }
  },


  getData() {
    API.getOrderDetail({ orderNumber: this.data.num }).then((res) => {
      this.setData({
        order: res.obj,
        status: res.obj.orderStatus  //状态
      })

      //自提  //订单类型[0 其他|1 门店自提|2 物流配送]
      if (this.data.order.logisticsMode == '1') {
        this.setData({ self: 'true' })
      } else {
        this.setData({ self: 'false' })
      }
      //订单种类 //订单分类[1 进货单|2 店订单|3 普通订单]
      if (this.data.order.orderCategory == '1') {
        this.setData({ orderType: 'list' })
      } else {
        this.setData({ orderType: 'order' })
      }

      if (this.data.orderType == 'order') {
        this.resetData([this.data.order]);
      }
      this.setData({
        'order.createDate': this.timeFormat(this.data.order.createDate),
        'order.payDate': this.timeFormat(this.data.order.payDate),
        'order.finishDate': this.timeFormat(this.data.order.finishDate),
        'order.deliverDate': this.timeFormat(this.data.order.deliverDate),
        'order.cancelDate': this.timeFormat(new Date(res.obj.cancelDate))
      })
      //倒计时
      let timm = this.data.timeOnce;
      if (timm) {
        util.count_down(this, res.obj.timeoutExpressSecond ? res.obj.timeoutExpressSecond * 1000 : "")
        this.setData({ timeOnce: false })
      }
    })
  },
  //时间戳转化成时间格式
  timeFormat(timestamp) {
    if (!timestamp) { return "" }
    //timestamp是整数，否则要parseInt转换,不会出现少个0的情况
    var time = new Date(timestamp);
    var year = time.getFullYear();
    var month = time.getMonth() + 1;
    var date = time.getDate();
    var hours = time.getHours();
    var minutes = time.getMinutes();
    var seconds = time.getSeconds();
    return year + '-' + add0(month) + '-' + add0(date) + ' ' + add0(hours) + ':' + add0(minutes) + ':' + add0(seconds);
    function add0(m) { return m < 10 ? '0' + m : m }

  },
  resetData(data) {
    let arr = [];
    for (let i = 0; i < data.length; i++) { // 循环订单
      let oldGoods = data[i].goodsInfoList,  //商品数组
        newGoods = [];
      for (let j = 0; j < oldGoods.length; j++) { //货品循环

        let type = oldGoods[j].goodsSkuInfoVOList;  //规格数组

        for (let k = 0; k < type.length; k++) {
          //当前货物,类型变为对象
          let nowGood = {};
          Object.assign(nowGood, oldGoods[j]);
          nowGood.goodsSkuInfoVOList = type[k];
          newGoods.push(nowGood);
        }
      }
      //编辑新订单数组
      let newOrder = data[i];
      newOrder.goodsInfoList = newGoods;
      arr.push(newOrder)
    }
    this.setData({
      order: arr[0]
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
    this.getData();
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