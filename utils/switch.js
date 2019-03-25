import API from './api.js'
// 进入小程序参数集中处理
function switchOptionsType(options) {
  let obj = {}
  // 小程序二维码进入
  if (options.scene) {
    obj = parseMinicode(options)
  }
  // 普通二维码
  else if (options.q) {
    obj = parseQRcode(options)
  }
  // 跳转进入
  else if (!options.scene && !options.q) {
    obj = parseNormal(options)
  }
  navigateToPage(obj)
}


function parseMinicode(options) {
  // "G_" + storeId + "_" + goodsId  商品小程序码 "S_" + storeId 店铺小程序码
  let scene = decodeURIComponent(options.scene);
  let dataarr = scene.split("_");
  switch (dataarr[0]) {
    case 'G':
      if (dataarr[2]) {
        return {
          path: '/pages/page/goodsDetails/goodsDetails',
          data: { goodsId: dataarr[2]}
        }
      } else {
        API.showToast("缺少商品~~无法识别小程序码")
      }
      break;
    case 'S':
      if (dataarr[1] === wx.getStorageSync('storeId')) {
        return {
          path: '/pages/page/home/home',
          data: {}
        }
      } else {
        API.showToast("进入店铺失败~~请稍后再试")
      }
      break;
  }
}

function parseQRcode(options) {
  let qrUrl = decodeURIComponent(options.q)
  // 不包含type字段不做处理
  if (qrUrl.indexOf('type=') == -1) {
    // API.showToast("未获取信息！")
    return
  } else {
    let obj = parseUrlToObj(qrUrl)
    switch (obj.type) {
      case 'ftforder':
        return {
          path: '/pages/faceToFaceOrder/customerSureOrder/customerSureOrder',
          data: { qrCode: obj.code}
        }
        break;
      case 'user':
        return {
          path: '/pages/page/home/home',
          data: options
        }
        break;
    }
  }
}

function parseNormal(options){
  switch (options.type){
    case 'workIndex':
      return {
        path: '/pages/page/workIndex/workIndex',
        data: options
      }
    break;
    case 'goodsDetail':
      return {
        path: '/pages/page/goodsDetails/goodsDetails',
        data: options
      }
      break;
    case 'storeIcon':
      return {
        path: '/pages/page/storeIcon/storeIcon',
        data: options
      }
      break;  
    case 'user':
      return {
        path: '/pages/page/user/user',
        data: options
      }
      break; 
    case 'supplier' :
      return {
        path: '/pages/businessFriend/information/information',
        data: options
      }
      break;
    case 'home':
      return {
        path: '/pages/page/home/home',
        data: options
      }
      break;
  }
}

function navigateToPage(obj){
  if(obj && obj.path){
    wx.reLaunch({
      url: obj.path + '?' + handleObject(obj.data)
    })
  }else{
    API.showToast('数据出错拉~~')
  }
}

function parseUrlToObj(qrUrl){
  // 处理传参
  let data = qrUrl.split("?")[1],
    arr = data.split("&"),
    obj = {};
  arr.forEach(el => {
    obj[el.split("=")[0]] = el.split("=")[1]
  })
  return obj
}

//  obj转url参数
function handleObject(obj) {
  try {
    let arr = []
    for (let key in obj) {
      if (key == 'q') {
        arr.push(key + "=" + encodeURIComponent(obj[key]))
        continue
      }
      arr.push(key + "=" + obj[key])
    }
    return arr.join("&")
  } catch (e) {
    return ""
  }
}

module.exports = {
  switchOptionsType
}