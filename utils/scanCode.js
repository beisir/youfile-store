import API from './api.js'
import EnterStoreHandler from './enterStoreHandler.js';
const app = getApp()
// qrUrl二维码链接   entry入口分为middle为扫码进入小程序，其他写页面名称  baseOptions原始onload参数
function handleQRCode(qrUrl, entry, baseOptions) {
  // 不包含type字段不做处理
  if (qrUrl.indexOf('type=') == -1) {
    // API.showToast("未获取信息！")
    return
  } else {
    // 处理传参
    let data = qrUrl.split("?")[1],
      arr = data.split("&"),
      obj = {};
    arr.forEach(el => {
      obj[el.split("=")[0]] = el.split("=")[1]
    })
    switchQRCodeType(obj, entry, qrUrl, baseOptions)
  }
}

// 处理不同type种类的二维码  onload进入
function switchQRCodeType(data, entry, qrUrl, baseOptions) {
  switch (data.type) {
    case 'ftforder':
      ftfOrder(data, entry)
      break;
    case 'user':
      if (entry === 'home') {
        homeBF(qrUrl)
      } else if (entry === 'middle'){
        middleBF(baseOptions)
      }

  }
}
//  obj转url参数
function handleObject(obj) {
  try{
    let arr = []
    for (let key in obj) {
      if(key == 'q'){
        arr.push(key + "=" + encodeURIComponent(obj[key]))
        continue
      }
      arr.push(key + "=" + obj[key])
    }
    return arr.join("&")
  }catch(e){
    return ""
  }
}
// 获取当前页面
function getCurrentpage() {
  let pages = getCurrentPages();
  let curPage = pages[pages.length - 1];
  return curPage
}

// 门店订单
function ftfOrder(urldata, entry) {
  console.log(urldata)
  if (!urldata.code) {
    API.toHome()
    return
  }
  if (urldata.storeId && !wx.getStorageSync('storeId')){
    wx.setStorageSync("storeId", urldata.storeId)
    app.globalData.switchStore = true;
  }
  API.ftfuserSureOrder({ qrCode: urldata.code, payType: 'online' }).then(res => {
    if (entry === 'middle') {
      wx.redirectTo({
        url: '/pages/faceToFaceOrder/customerSureOrder/customerSureOrder?code=' + res.obj.orderNumber,
      })
    } else {
      wx.navigateTo({
        url: '/pages/faceToFaceOrder/customerSureOrder/customerSureOrder?code=' + res.obj.orderNumber,
      })
    }
  }).catch(e => {
    if (e.data.code === '1') {
      setTimeout(()=> {
        API.toHome()
      },1000)
    }
  })
}
// 首页商友
function homeBF(qrUrl) {
  let _this = getCurrentpage()
  let options = {
    getUserIdFromQrCode: qrUrl
  }
  let enEnterStoreHandler = new EnterStoreHandler("1");
  enEnterStoreHandler.enterStore(options).then(store => {
    if (store.storeNature == "1") {
      var userId = store.userId
      var storeId = store.storeId
      _this.getUserInfor(userId, storeId)
    }
  }).catch(store => {
    let userId = store.userId
    _this.getFriendMes(userId)

  });
}

function middleBF(baseOptions){
  console.log(baseOptions, handleObject(baseOptions))
  wx.reLaunch({
    url: '/pages/page/home/home?' + handleObject(baseOptions)
  })
}

function toHome(){
  let str = handleData()
  wx.switchTab({
    url: '/pages/page/home/home'
  })
}

module.exports = {
  handleQRCode,
  switchQRCodeType
}