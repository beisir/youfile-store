import API from './api.js'
import EnterStoreHandler from './enterStoreHandler.js';

function handleQRCode(data, entry) {
  var qrUrl = data.result;
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
    switchQRCodeType(obj, entry, qrUrl)
  }
}
// 处理不同type种类的二维码  onload进入
function switchQRCodeType(data, entry, qrUrl) {
  switch (data.type) {
    case 'ftforder':
      ftfOrder(data, entry)
      break;
    case 'user':
      if (entry === 'home') {
        homeBF(qrUrl)
      }

  }
}

function getCurrentpage() {
  let pages = getCurrentPages();
  let curPage = pages[pages.length - 1];
  return curPage
}

// 门店订单
function ftfOrder(urldata, entry) {
  if (!urldata.code) {
    API.toHome()
    return
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
      API.toHome()
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

module.exports = {
  handleQRCode,
  switchQRCodeType
}