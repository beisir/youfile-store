import Api from './api.js'
import HtmlToJson from '../wxParse/html2json.js'
/* 时间格式化 */
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
/* 时间格式化 只有年月日 */
const formatTimeday = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return [year, month, day].map(formatNumber).join('-')
}
/* 时间格式化 只有月日 */
const formatMD = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return [ month, day].map(formatNumber).join('/')
}
/* 时间格式化 只有时间 */
const formatHour = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return [month, day].map(formatNumber).join('/') + ' ' + [hour, minute].map(formatNumber).join(':')
}
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/**倒计时   定义一个总毫秒数，以一分钟为例。TODO，传入一个时间点，转换成总毫秒数**/
/* 毫秒级倒计时 */
function count_down(that,sec) {
  var total_micro_second = sec?sec:0;  
  // 渲染倒计时时钟
  that.setData({
    clock: date_format(total_micro_second)
  });

  if (total_micro_second <= 0) {
    that.setData({
      clock: "已经截止"
    });
    // timeout则跳出递归
    return;
  }
  setTimeout(function () {
    // 放在最后--
    total_micro_second -= 1000;
    count_down(that,total_micro_second);
  }, 1000)
}

// 时间格式化输出，如03:25:19 86。每10ms都会调用一次
function date_format(micro_second) {
  // 秒数
  var second = Math.floor(micro_second / 1000);
  // 小时位
  var hr = Math.floor(second / 3600);
  // 分钟位
  var min = fill_zero_prefix(Math.floor((second - hr * 3600) / 60));
  // 秒位
  var sec = fill_zero_prefix((second - hr * 3600 - min * 60));// equal to => var sec = second % 60;
  // 毫秒位，保留2位
  //var micro_sec = fill_zero_prefix(Math.floor((micro_second % 1000) / 10));

  return hr + ":" + min + ":" + sec ;
}

// 位数不足补零
function fill_zero_prefix(num) {
  return num < 10 ? "0" + num : num
}

// 保存至相册
const saveImgToPhone = imgUrl => {
  wx.showLoading({
    title: "保存中",
  })
    wx.downloadFile({
      url: imgUrl,
      success: function (res) {
        if (res.statusCode === 200) {
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success(res) {
              Api.showToast('保存图片成功！')
            },
            fail: (res) => {
              Api.openSetting()
            },
          })
        }
      },
      complete: function (res) {
        wx.hideLoading()
      }
    })
}
// 获取授权种类
function getUserSetting(){
  return new Promise((resolve,reject)=>{
    wx.getSetting({
      success:(res)=>{
        resolve(res)
      },
      fail:(e)=>{
        reject(e)
      }
    })
    
  })
}

/**
 * 解析商品的描述内容 
 * 返回示例：[{"tag":"img","content":"https://image.youlife.me/goods.jpg"}]
 */
function parseGoodsDescription(htmlContent) {
  if(htmlContent==null||htmlContent==undefined||htmlContent==""){
    return [];
  }
  var htmlJson = [];
  var transData = HtmlToJson.html2json(htmlContent, 'htmlContent');
  for (var i = 0; i < transData.nodes.length; i++) {
    var item = transData.nodes[i];
    var tag = item.tag;
    var content = null;
    if ("img" == tag) {
      content = item.attr.src;
    } else {
      if(item.nodes && item.nodes.length>0){
        content = item.nodes[0].text;
      }
    }
    if (content != null && content != undefined) {
      htmlJson.push({ "tag": tag, "content": content });
    }
  }
  return htmlJson;
}
/**
 *处理价格输入
 */
function newVal(val){
  var val = val.replace(/[^\d.]/g, ""); //清除"数字"和"."以外的字符
  val = val.replace(/^\./g, ""); //验证第一个字符是数字
  val = val.replace(/\.{2,}/g, "."); //只保留第一个, 清除多余的
  val = val.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
  val = val.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); //只能输入两个小数
  return val
}
/**
 *随机三个字母
 */
function ramNum(){
  var c = ''
  for (var i = 0; i < 3; i++) {
    var rand = Math.floor(Math.random() * 26);
    c = c + String.fromCharCode("a".charCodeAt(0) + rand);
  }
  return c
}
/**
 *随机三个字母
 */
function ramNum1() {
  var c = ''
  for (var i = 0; i < 3; i++) {
    var rand = Math.floor(Math.random() * 26);
    c = c + String.fromCharCode("a".charCodeAt(0) + rand);
  }
  return c
}
function ramData(){
  return Date.parse(new Date()) + parseInt(89999 * Math.random() + 10000 + 1)
}

function testTel(tel) {
  if(tel){
    let phone = tel.trim();
    if (!phone || phone.trim().length != 11 || !/^1[3|4|5|6|7|8|9]\d{9}$/.test(phone)) {
      return false;
    }
    return true;
  }else{
    return false
  }
}
// 倒计时
function timeStamp(time) {
  var today = new Date(),//当前时间
    h = today.getHours(),
    m = today.getMinutes(),
    s = today.getSeconds(),
    data={}
  var stopTime = new Date(time),//结束时间
    stopH = stopTime.getHours(),
    stopM = stopTime.getMinutes(),
    stopS = stopTime.getSeconds();
  var shenyu = stopTime.getTime() - today.getTime(),//倒计时毫秒数
    shengyuD = parseInt(shenyu / (60 * 60 * 24 * 1000)),//转换为天
    D = parseInt(shenyu) - parseInt(shengyuD * 60 * 60 * 24 * 1000),//除去天的毫秒数
    shengyuH = parseInt(D / (60 * 60 * 1000)),//除去天的毫秒数转换成小时
    H = D - shengyuH * 60 * 60 * 1000,//除去天、小时的毫秒数
    shengyuM = parseInt(H / (60 * 1000)),//除去天的毫秒数转换成分钟
    M = H - shengyuM * 60 * 1000,//除去天、小时、分的毫秒数
    S = parseInt((shenyu - shengyuD * 60 * 60 * 24 * 1000 - shengyuH * 60 * 60 * 1000 - shengyuM * 60 * 1000) / 1000)//除去天、小时、分的毫秒数转化为秒
  if (shengyuD<10){
    shengyuD = '0' + shengyuD
  }
  if (shengyuH < 10) {
    shengyuH = '0' + shengyuH
  }
  if (shengyuM < 10) {
    shengyuM = '0' + shengyuM
  }
  if (S < 10) {
    S = '0' + S
  }
   data = { shengyuD: shengyuD, shengyuH: shengyuH, shengyuM: shengyuM,S:S}
  return data
}

function regTest(obj) {
  if (!obj) return;
  var type = obj.type;
  var str = obj.str;
  switch (type) {
    case "phone":
      return /^((0\d{2,3})?(-)?\d{6,10}|1[35874]\d{9})$/.test(str);
    case "id":
      return /^((\d{15})|(\d{18})|(\d{17}(\d|X|x)))$/.test(str);
    case "telephone":
      return /^1[3456789][0-9]\d{8}$/.test(str);
    case "email":
      return /^[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)+$/.test(str);
    case "sum":
      return /^([1-9]\d*(\.\d+)?|0\.\d*[1-9]\d*|0)%?$/.test(str);
    case "password":
      return /^\w{6,20}$/.test(str);
    case "money":
      return /^([1-9]\d{0,9}(\.\d{1,2})?|0\.\d{1,2}|0)$/.test(str);
    case "empty":
      return isNotEmpty(str);
    default:
      alert("regTest no this type"); break;
  }
}
module.exports = {
  formatTime: formatTime,
  count_down:count_down,
  saveImgToPhone: saveImgToPhone,
  parseGoodsDescription: parseGoodsDescription,
  newVal: newVal,
  ramNum: ramNum,
  ramData: ramData,
  ramNum1: ramNum1,
  testTel: testTel,
  timeStamp: timeStamp,
  formatTimeday: formatTimeday,
  formatMD: formatMD,
  formatHour: formatHour,
  regTest: regTest
}

