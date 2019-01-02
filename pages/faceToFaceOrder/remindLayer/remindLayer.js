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
        if (this.checkIfLayer()) {
          this.setData({
            modalShow: true
          })
        }
      })
    },
    pay(){
      let code = this.data.orderNum;
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
      let code = "",
        storeID = wx.getStorageSync("storeId"),
        userId = "cbced730cc43cead0592fbdd5ef10f99",
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
    checkIfLayer(){
      wx.setStorageSync("ftfLayer", [{
        str: '123S1000349cbced730cc43cead0592fbdd5ef10f99',
        date: 1545989447000
      }, {
        str: '1234S1000349cbced730cc43cead0592fbdd5ef10f99',
        date: 1545991763000
      }])
      
      let ifLayer = wx.getStorageSync("ftfLayer");
      if (ifLayer){
        let code = "123",
            storeID = wx.getStorageSync("storeId"),
            userId = "cbced730cc43cead0592fbdd5ef10f99",
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
        console.log(layerBollen)
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
