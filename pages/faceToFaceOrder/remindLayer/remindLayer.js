import API from "../../../utils/api.js"
Component({
  properties: {
    // 这里定义了innerText属性，属性值可以在组件使用时指定
    modalShow: {
      type: Boolean,
      value: false,
    },
    orderNum:{
      type: String,
      value: ""
    }
  },
  data: {
    modalShow: false
  },
  methods: {
    close() {
      this.setData({
        modalShow: false
      })
    },
    open(obj){
      API.ftfRecentOrder().then(res=>{
        if (!(res.obj && res.obj.id && res.obj.userInfo.userId)) {
          return false
        }
        if (this.checkIfLayer(res.obj)) {
          this.setData({
            modalShow: true,
            ftfNowOrder: res.obj
          })
        }else{
          this.setData({
            modalShow: false,
            ftfNowOrder: ""
          })
        }
      })
    },
    pay(){
      let code = this.data.ftfNowOrder.id;
      if(!code){
        wx.showToast({
          title: '缺少订单号',
          icon: 'none'
        })
        return
      }
      wx.navigateTo({
        url: '../../casher/casher/casher?num=' + code + '&type=ftf',
      })
    },
    noTip(){
      if (!this.data.ftfNowOrder){
        wx.showToast({
          title: '缺少订单信息',
          icon:'none'
        })
        return
      }
      let order = this.data.ftfNowOrder;
      let code = order.id,
        storeID = order.storeInfo.storeId,
        userId = order.userInfo.userId,
        checkStr = code + storeID + userId, //唯一标识符
        now = Date.parse(new Date());
      let ifLayer = wx.getStorageSync("ftfLayer");
      ifLayer.push({
        str: checkStr,
        date: now
      })  
      wx.setStorageSync("ftfLayer", ifLayer)
    },
    //检验是否不再提醒
    checkIfLayer(order){
      let nowUser = wx.getStorageSync("userId"),
        storeId = wx.getStorageSync("storeId")
      if ((order.userInfo.userId != nowUser) || (order.storeInfo.storeId != storeId)){ //登录用户与当前店是否正确
        return false
      }
      let ifLayer = wx.getStorageSync("ftfLayer");
      if (ifLayer){
        let code = order.id,
            storeID = storeId,
            userId = nowUser,
            checkStr = code + storeID + userId; //唯一标识符
        if (!(code && storeID && userId)){
          return false
        }

        let layerBollen = true;
        ifLayer.forEach((el, index)=>{
          if(this.timeoutDel(el)){
            ifLayer.splice(index,1)
          }
          if(el.str == checkStr){
            layerBollen = false;
          }
        })
        wx.setStorageSync("ftfLayer", ifLayer)
        return layerBollen
      }else{
        return true
      }
    },

    timeoutDel(item){
      let now = Date.parse(new Date());
      if(now - item.date > 1800000){
        //设置超过半小时
        return true
      }
      return false
    }
  }
})
