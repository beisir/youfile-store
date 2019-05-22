import {
  adminGoodsListUrl,
  adminGoodsDeleteUrl,
  adminGoodsUpUrl,
  goodsApiSearchListUrl,
  adminGoodsDownUrl,
  adminShopCateUrl,
  adminGoodsStatusUrl,
  saleBatchNumUrl,
  isFriendUrl,
  newGoodsSearchListUrl,
  cusNewDetailsUrl,
  salebatchamountUrl,
  saleBatchUrl,
  goodsSearchListUrl,
  classListUrl,
  addClassUrl,
  adminGoodsDetailsUrl,
  customCategoryCodeUrl,
  classCodeListUrl,
  goodsDetailsUrl,
  batchNumUrl,
  addressListUrl,
  addressDefaultUrl,
  addressDeleteUrl,
  saveAddressUrl,
  addressInfoUrl,
  editAddressUrl,
  cartListUrl,
  addTemplateUrl,
  templateUrl,
  templateDeleteUrl,
  updateTemplateNameUrl,
  updateSpecNameUrl,
  addCartUrl,
  topGoodsUrl,
  deleteTemplateUrl,
  addTempContUrl,
  deteleCartGoodsUrl,
  deteleCartFaiUrl,
  addMoreCartUrl,
  likeStoreUrl,
  deteleLikeStoreUrl,
  saveSpecTemplateContentUrl,
  shopListUrl,
  indexUrl,
  mewWholesalerUrl,
  setNameUrl,
  addWholesalerUrl,
  passUrl,
  wholesalerAllUrl,
  merchantIndexUrl,
  merchantListUrl,
  newMerchantUrl,
  applyUrl,
  acceptPurchaserUrl,
  userInfoUrl,
  saveDetailsUrl,
  serWholesalerListUrl,
  purchaserListUrl,
  remakInfoUrl,
  acceptmerchantUrl,
  purchaserUserIdUrl,
  configUrl,
  homeIndexUrl,
  storeIdInfoUrl,
  updateCoverUrl,
  apiSetUserUrl,
  apiAddUserUrl,
  adminSetUserUrl,
  adminAddUserUrl,
  dealUserUrl,
  favoriteusersUrl,
  updateMoreCartUrl,
  updateMesUrl,
  uploadLogoImgUrl,
  storeIndexUrl,
  setUserNameUrl,
  getUserDetailUrl,
  userIdentityUrl,
  classListApiUrl,
  quitUrl,
  updataPwdUrl,
  changeIconUrl,
  testGoodCodeUrl,
  addGoodsUrl,
  isFriendStoreUrl,
  uploadPayVoucherUrl,
  resetPasswordUrl,
  phoneMessageUrl,
  registerUrl,
  newUserInforUrl,
  registerPhoneMsgUrl,
  removeDefaultUrl,
  closedOrderUrl,
  cancelOrderUrl,
  miniProgramCodeUrl,
  addDxpressUrl,
  addRemarkUrl,
  updatetotalUrl,
  classCodeParUrl,
  updateGoodsUrl,
  seeVoucherUrl,
  getStoreNameUrl,
  getStoreDetailsUrl,
  userInforUrl,
  supplyOrderUrl,
  receiveOrderUrl,
  showPurchaserUrl,
  showMerchantUrl,
  getPaymentImgUrl,
  putPaymentImgUrl,
  recentGoodsUrl,
  copyGoodsUrl,
  tempSortUrl,
  updateClassUrl,
  threeFloorListUrl,
  orderDetailUrl,
  adminorderDetailUrl,
  ifWholesalerUrl,
  shopkeeperOrderListUrl,
  helpOrderUrl,
  ftfCloseOrderUrl,
  ftfAdminOrderDetailUrl,
  customerOrderListUrl,
  ftfCustomerOrderDetailUrl,
  ftfCaneledOrderUrl,
  ftfDelOrderUrl,
  getUserInfoUrl,
  getStoreNatureUrl,
  getStoreDataUrl,
  ftfGoodsListUrl,
  ftfCreatGoodsUrl,
  ftfDelGoodsUrl,
  ftfEditGoodsUrl,
  ftfGoodsIfExistUrl,
  recentlyFocusUserUrl,
  searchUserInfoByTelUrl,
  unpaidOrderNumUrl,
  ftfRecentOrderUrl,
  getBankcardUrl,
  getTradeUrl,
  getAccountinUrl,
  getAccountDetailUrl,
  getHaveRecordUrl,
  storeOnlinePayUrl,
  deleteUserUrl,
  goodsSkuUrl,
  skuCodeUrl,
  specValCodeUrl,
  updateGooodsSkuUrl,
  searchClassUrl,
  updateUserInfoUrl,
  hasSavedWXmsgUrl,
  saveWXmsgUrl,
  getMyWXPhoneUrl,
  ftfuserSureOrderUrl,
  ftfpreOrderDetailUrl,
  posterModuleListUrl,
  uploadPosterUrl,
  addPosterTagUrl,
  getPosterTagListUrl,
  delPosterTagUrl,
  updatePosterTagNameUrl,
  getPosterTagDetailUrl,
  delPosterArrUrl,
  toOtherPosterTagUrl,
  delAllPosterUrl,
  getPosterTagMsgUrl,
  simpleStoreMsgUrl,
  goodsPosterNumUrl,
  activityListUrl,
  participateUrl,
  activeDetailsUrl,
  releaseGoodsUrl,
  addActiveGoodsUrl,
  addAMoreGoodsUrl,
  releaseMoreGoodsUrl,
  getActiveGoodsDetailUrl,
  editActiveGoodsUrl,
  activityGoodsUrl,
  allGoodsUrl,
  delActGoodsUrl,
  storeActiveGoodsUrl,
  saleActiveListUrl,
  statisticSalesUrl,
  yunStatisticsUrl,
  aAnalysisAGoodsUrl,
  aAnalysisCustomUrl,
  statPurchasersUrl,
  statPurchasersDetailsUrl,
  purchaserTransUrl,
  storeIndexAGoodsUrl,
  editConsigneeUrl,
  editExpressUrl,
  getZoneListUrl, // 分区
  zoneToTopUrl,
  zoneOnOrOffUrl,
  adminShowZoneListUrl,
  apiShowZoneListUrl,
  editZoneUrl,
} from './constUrl.js'

const app = getApp()
/**判断是否为空**/
function isNotEmpty(str) {
  if (str === '' || str == undefined || str == null || str == "undefined") {
    return false
  } else {
    return true
  }
}
/**提示**/
function showToast(message) {
  wx.showToast({
    title: message,
    icon: 'none',
    duration: 3000,
  })
}
// 判断是否存过微信信息
function hasSavedWXmsg(data) {
  return app.http.getRequest(hasSavedWXmsgUrl, data, {}, true)
}

function saveWXmsg(data) {
  return app.http.postRequest(saveWXmsgUrl, data, {}, true)
}
// 获取微信手机
function getMyWXPhone(data) {
  return app.http.getRequest(getMyWXPhoneUrl, data, {
    "platAppId": app.globalData.payAppNum
  }, true)
}
/**
 * 门店订单
 */
// 用户确定订单
function ftfuserSureOrder(data) {
  return app.http.postRequest(ftfuserSureOrderUrl, data, {
    'content-type': 'application/x-www-form-urlencoded'
  })
}
// 商家预订单详情
function ftfpreOrderDetail(data) {
  return app.http.getRequest(ftfpreOrderDetailUrl, data)
}


/**判断楼座是否为空**/
function isFloorInfo(obj) {
  if (isNotEmpty(obj)) {
    var floor = obj
    floor.mallName = floor.mallName == null ? '' : floor.mallName,
      floor.areaName = floor.areaName == null ? '' : floor.areaName,
      floor.balconyName = floor.balconyName == null ? '' : floor.balconyName,
      floor.floorName = floor.floorName == null ? '' : floor.floorName,
      floor.floorDescription = floor.floorDescription == null ? '' : floor.floorDescription,
      floor.storeDoorNum = floor.storeDoorNum == null ? '' : floor.storeDoorNum
    return floor
  } else {
    return null
  }
}
/**用户身份判断**/
function userIdentity(data) {
  data = initStoreId(data);
  return app.http.getRequest(userIdentityUrl, data)
}
/**根据id获取店铺ID**/
function getStoreDetails(data) {
  return app.http.getRequest(getStoreDetailsUrl, data)
}
/**获取店铺的小程序码**/
function miniProgramCode(data) {
  return app.http.getRequest(miniProgramCodeUrl, data)
}
/**获取店铺信息**/
function getStoreInfo() {
  let data = initStoreId({})
  return app.http.getRequest(miniProgramCodeUrl, data)
}
/**云享品管理 列表**/
function adminGoodsList(data) {
  data = initStoreId(data);
  return app.pageRequest.pageGet(adminGoodsListUrl, data)
}
/**首页新品**/
function recentGoods(data) {
  data = initStoreId(data);
  return app.pageRequest.pageGet(recentGoodsUrl, data)
}
/**商品 删除**/
function adminGoodsDelete(data) {
  return app.http.deleteRequest(adminGoodsDeleteUrl, data)
}
/**获取进货商资料**/
function userInfor(data) {
  return app.http.getRequest(userInforUrl, data)
}
/**获取店铺客户关系资料**/
function cusNewDetails(data) {
  data = initStoreId(data);
  return app.http.getRequest(cusNewDetailsUrl, data)
}

/**获取批发商商资料**/
function newUserInfor(data) {
  return app.http.getRequest(newUserInforUrl, data)
}
/**删除商友关系**/
function deleteUser(data) {
  data = initStoreId(data);
  return app.http.deleteRequest(deleteUserUrl, data)
}

/**分类列表**/
function classCodePar(data) {
  return app.http.getRequest(classCodeParUrl, data)
}
/**商品 上架**/
function adminGoodsUp(data) {
  data = initStoreId(data);
  return app.http.postRequest(adminGoodsUpUrl, data)
}
/**商品 下架**/
function adminGoodsDown(data) {
  data = initStoreId(data);
  return app.http.postRequest(adminGoodsDownUrl, data)
}
/**本店分类**/
function adminShopCate(data) {
  data = initStoreId(data);
  return app.http.getRequest(adminShopCateUrl, data)
}
/**工作台**/
function storeIndex(data) {
  data = initStoreId(data);
  return app.http.getRequest(storeIndexUrl, data)
}
/**商品状态筛选**/
function adminGoodsStatus(data) {
  data = initStoreId(data);
  return app.pageRequest.pageGet(adminGoodsStatusUrl, data)
}
/**店铺设置起批量**/
function saleBatchNum(data) {
  return app.http.putRequest(saleBatchNumUrl + '?saleBatchNum=' + data)
}
/**添加商品**/
function addGoods(data) {
  data = initStoreId(data);
  return app.http.postRequest(addGoodsUrl, data)
}
/**更新商品**/
function updateGoods(data) {
  return app.http.putRequest(updateGoodsUrl, data)
}
/**编辑商品详情**/
function adminGetDetails(data) {
  return app.http.getRequest(adminGoodsDetailsUrl, data)
}
/**分类**/
function customCategoryCode(data) {
  data = initStoreId(data);
  return app.http.putRequest(customCategoryCodeUrl, data)
}
/**店铺设置起批量**/
function saleBatchAmount(data) {
  return app.http.putRequest(salebatchamountUrl + '?amount=' + data)
}
/**获取店铺起批配置**/
function saleBatch(data) {
  data = initStoreId(data);
  return app.http.getRequest(saleBatchUrl, data)
}
/**商品搜索列表**/
function goodsSearchList(data) {
  data = initStoreId(data);
  return app.pageRequest.pageGet(goodsSearchListUrl, data)
}
/**商品搜索列表**/
function newGoodsSearchList(data) {
  data = initStoreId(data);
  return app.pageRequest.pageGet(newGoodsSearchListUrl, data)
}
/**商品搜索列表**/
function goodsApiSearchList(data) {
  data = initStoreId(data);
  return app.pageRequest.pageGet(goodsApiSearchListUrl, data)
}
/**关注用户列表**/
function favoriteusers(data) {
  data = initStoreId(data);
  return app.pageRequest.pageGet(favoriteusersUrl, data)
}
/**店铺首页**/
function homeIndex(data) {
  data = initStoreId(data);
  return app.pageRequest.pageGet(homeIndexUrl, data)
}
/**获取店内分类列表**/
function classList(data) {
  data = initStoreId(data);
  return app.http.getRequest(classListUrl, data)
}
/**无登录状态获取店内分类列表**/
function classListApi(data) {
  data = initStoreId(data);
  return app.http.getRequest(classListApiUrl, data)
}
/**新建分类**/
function addClass(data) {
  data = initStoreId(data);
  return app.http.postRequest(addClassUrl, data)
}
/**商品置顶**/
function topGoods(data) {
  return app.http.putRequest(topGoodsUrl + "?isTop=true", data)
}
/**取消默认地址**/
function removeDefault(data) {
  return app.http.putRequest(removeDefaultUrl, data)
}
/**修改店内分类**/
function updateClass(data) {
  data = initStoreId(data);
  return app.http.putRequest(updateClassUrl, data)
}
/**商品状态筛选**/
function classCodeList(data) {
  data = initStoreId(data);
  return app.pageRequest.pageGet(classCodeListUrl, data)
}
/**设置用户备注**/
function setUserName(data) {
  data = initStoreId(data);
  return app.http.postRequest(setUserNameUrl, data)
}
/**商品详情**/
function goodsDetails(data) {
  return app.http.getRequest(goodsDetailsUrl, data)
}
/**查询商品的起批设置**/
function batchNum(data) {
  return app.http.getRequest(batchNumUrl, data)
}
/**获取用户地址列表**/
function addressList(data) {
  return app.http.getRequest(addressListUrl, data)
}
/**默认用户地址**/
function addressDefault(data) {
  return app.http.getRequest(addressDefaultUrl, data)
}
/**地址 删除**/
function addressDelete(data) {
  return app.http.deleteRequest(addressDeleteUrl, data)
}
/**地址添加**/
function saveAddress(data) {
  return app.http.postRequest(saveAddressUrl, data)
}
/**地址详情**/
function addressInfo(data) {
  return app.http.getRequest(addressInfoUrl, data)
}
/**编辑地址**/
function editAddress(data) {
  return app.http.putRequest(editAddressUrl, data)
}
/**用户购物车列表**/
function cartList(data) {
  data = initStoreId(data);
  return app.http.getRequest(cartListUrl, data)
}
/**保存模板**/
function addTemplate(data) {
  return app.http.postRequest(addTemplateUrl, data)
}
/**排序模板**/
function tempSort(data) {
  return app.http.postRequest(tempSortUrl + "?sortType=asc", data)
}
/**调换规格位置**/
function saveSpecTemplateContent(data) {
  return app.http.postRequest(saveSpecTemplateContentUrl, data)
}
/**模板列表**/
function template(data) {
  return app.http.getRequest(templateUrl, data)
}
/**模板 删除**/
function templateDelete(data) {
  return app.http.deleteRequest(templateDeleteUrl + '?templateId=' + data)
}
/**更新模板**/
function updateTemplateName(templateId, templateName) {
  return app.http.putRequest(updateTemplateNameUrl + '?templateId=' + templateId + '&templateName=' + templateName)
}
/**更新规格**/
function updateSpecName(templateContentId, specName, data) {
  data = initStoreId(data);
  return app.http.putRequest(updateSpecNameUrl + '?templateContentId=' + templateContentId + '&specName=' + specName)
}
/**添加到购物车**/
function addCart(data) {
  data = initStoreId(data);
  return app.http.postRequest(addCartUrl, data)
}
/**批量添加到购物车**/
function addMoreCart(data) {
  return app.http.postRequest(addMoreCartUrl, data)
}
/**删除购物车商品**/
function deteleCartGoods(data) {
  return app.http.deleteRequest(deteleCartGoodsUrl, data)
}
/**修改购物车**/
function updateMoreCart(data) {
  var goodsId = JSON.parse(data)[0]["goodsId"]
  var url = '/api/shop/shoppingcart/shop/goods/batch/' + goodsId
  return app.http.putRequest(url, data)
}
/**情况购物车失效商品**/
function deteleCartFai(data) {
  data = initStoreId(data);
  return app.http.deleteRequest(deteleCartFaiUrl, data)
}
/**删除规格**/
function deleteTemplate(data) {
  return app.http.deleteRequest(deleteTemplateUrl + '?templateContentId=' + data)
}
/**添加规格**/
function addTempCont(templateContentId, specValueList) {
  return app.http.putRequest(addTempContUrl + '?templateContentId=' + templateContentId + '&specValueList=' + specValueList)
}
/**取消关注**/
function deteleLikeStore(data) {
  return app.http.deleteRequest(deteleLikeStoreUrl + '?storeId=' + wx.getStorageSync('storeId'))
}
/**关注店铺**/
function likeStore(data) {
  return app.http.putRequest(likeStoreUrl + '?storeId=' + wx.getStorageSync('storeId'), {}, {}, true)
}
/**店铺信息**/
function shopList(data) {
  data = initStoreId(data);
  return app.pageRequest.pageGetIndex(shopListUrl, data)
}
/**批发商数据**/
function index(data) {
  data = initStoreId(data);
  return app.http.getRequest(indexUrl, data)
}
/**判断与供应商是否是好友关系**/
function isFriendStore(data) {
  return app.http.getRequest(isFriendStoreUrl, data)
}
/**判断与此进货商是否是好友关系**/
function isFriend(data) {
  data = initStoreId(data);
  return app.http.getRequest(isFriendUrl, data)
}
/**新增批发商列表**/
function mewWholesaler(data) {
  data = initStoreId(data);
  return app.pageRequest.pageGet(mewWholesalerUrl, data)
}
/**设置备注**/
function setName(data) {
  return app.http.postRequest(setNameUrl, data)
}
/**添加批发商**/
function addWholesaler(data) {
  return app.http.postRequest(addWholesalerUrl, data)
}
/**批发商通过验证**/
function pass(data) {
  return app.http.postRequest(passUrl, data)
}
/**进货商通过验证**/
function acceptmerchant(data) {
  return app.http.postRequest(acceptmerchantUrl, data)
}
/**批发商列表**/
function wholesalerAll(data) {
  return app.pageRequest.pageGet(wholesalerAllUrl, data)
}
/**进货商数据**/
function merchantIndex(data) {
  data = initStoreId(data);
  return app.http.getRequest(merchantIndexUrl, data)
}
/**进货商列表**/
function merchantList(data) {
  data = initStoreId(data);
  return app.pageRequest.pageGet(merchantListUrl, data)
}
/**成交信息**/
function dealUser(data) {
  data = initStoreId(data);
  return app.pageRequest.pageGet(dealUserUrl, data)
}
/**新增进货商列表**/
function newMerchant(data) {
  data = initStoreId(data);
  return app.pageRequest.pageGet(newMerchantUrl, data)
}
/**发送商友申请 添加到进货商**/
function apply(data) {
  data = initStoreId(data);
  return app.http.postRequest(applyUrl, data)
}
/**接受申请添加到进货商**/
function acceptPurchaser(data) {
  data = initStoreId(data);
  return app.http.postRequest(acceptPurchaserUrl, data)
}
/**客户信息**/
function userInfo(data) {
  data = initStoreId(data);
  return app.http.getRequest(userInfoUrl, data)
}
/**保存客户信息**/
function saveDetails(data) {
  data = initStoreId(data);
  return app.http.postRequest(saveDetailsUrl, data)
}
/**添加批发商分页查询列表**/
function serWholesalerList(data) {
  return app.pageRequest.pageGet(serWholesalerListUrl, data)
}
/**添加进货商分页查询列表**/
function purchaserList(data) {
  return app.pageRequest.pageGet(purchaserListUrl, data)
}
/**进货商资料**/
function remakInfo(data) {
  data = initStoreId(data);
  return app.http.getRequest(remakInfoUrl, data)
}
/**批发商资料**/
function purchaserUserId(url) {
  return app.http.getRequest(url)
}
/**扫一扫查看批发商**/
function showPurchaser(data) {
  return app.http.getRequest(showPurchaserUrl, data)
}
/**扫一扫查看进货商**/
function showMerchant(data) {
  return app.http.getRequest(showMerchantUrl, data)
}
/**满足起批配置信息**/
function config(goodsId) {
  var storeId = wx.getStorageSync('storeId')
  return app.http.getRequest(configUrl + '?storeId=' + storeId + '&goodsId=' + goodsId)
}
/**店铺详情**/
function storeIdInfo(data) {
  data = initStoreId(data);
  return app.http.getRequest(storeIdInfoUrl, data)
}
/**上传图片**/
function uploadImage(types, ifUploadMore, index) {
  return app.http.chooseImageUpload(types, ifUploadMore, index)
}
/**更换店封面**/
function updateCover(url, data) {
  data = initStoreId(data);
  return app.http.putRequest(updateCoverUrl + '?coverUrl=' + url, data)
}
/**更换店名称**/
function updateMes(data) {
  data = initStoreId(data);
  return app.http.putRequest(updateMesUrl, data)
}
/**更换店logo**/
function uploadLogoImg(url, data) {
  data = initStoreId(data);
  return app.http.putRequest(uploadLogoImgUrl + '?logo=' + url, data)
}
/**获取用户权限设置**/
function apiSetUser(data) {
  return app.http.getRequest(apiSetUserUrl, data)
}

function adminSetUser(data) {
  return app.http.getRequest(adminSetUserUrl, data)
}
/**获取店铺名称**/
function getStoreName(data) {
  data = initStoreId(data);
  return app.http.getRequest(getStoreNameUrl, data)
}

/**获取用户信息**/
function getUserDetail(data) {
  return app.http.getRequest(getUserDetailUrl, data)
}
/**权限设置**/
function apiAddUser(data) {
  return app.http.putRequest(apiAddUserUrl + "?bfPripermission=" + data)
}

function adminAddUser(data) {
  return app.http.putRequest(adminAddUserUrl, data)
}
// 退出登录
function quit(data) {
  return app.authHandler.postRequest(quitUrl, data, {
    'content-type': 'application/x-www-form-urlencoded'
  })
}
// 修改密码
function updataPwd(data) {
  return app.authHandler.postRequest(updataPwdUrl, data, {
    'content-type': 'application/x-www-form-urlencoded'
  })
}
// 修改头像
function changeIcon(data) {
  return app.http.putRequest(changeIconUrl, data, {
    'content-type': 'application/x-www-form-urlencoded'
  })
}
// 验证取货码
function testGoodCode(data) {
  return app.http.postRequest(testGoodCodeUrl, data, {
    'content-type': 'application/x-www-form-urlencoded'
  })
}
// 上传凭证
function uploadVoucher(data) {
  return app.http.postRequest(uploadPayVoucherUrl, data, {
    'content-type': 'application/x-www-form-urlencoded'
  })
}
/**重置密码**/
function resetPassword(data) {
  return app.authHandler.postRequest(resetPasswordUrl, data, {
    'content-type': 'application/x-www-form-urlencoded'
  })
}
/**短信验证码**/
function phoneMessage(data) {
  return app.authHandler.getRequest(phoneMessageUrl, data)
}
/**注册**/
function register(data) {
  return app.authHandler.postRequest(registerUrl, data, {
    'content-type': 'application/x-www-form-urlencoded'
  })
}
/**注册短信验证码**/
function registerPhoneMsg(data) {
  return app.http.getRequest(registerPhoneMsgUrl, data)
}
// 关闭订单
function closeOrder(data) {
  let url = closedOrderUrl + "?reason=" + encodeURI(data.reason)
  return app.http.postRequest(url, data)
}
// 取消订单
function cancelOrder(data) {
  let url = cancelOrderUrl + "?reason=" + encodeURI(data.reason)
  return app.http.postRequest(url, data)
}
//确认收货
function receiveOrder(data) {
  return app.http.postRequest(receiveOrderUrl, data)
}
// 添加快递
function addExpress(data) {
  let expressCompany = data.expressCompany ? data.expressCompany : "";
  let expressNumber = data.expressNumber ? data.expressNumber : "";
  return app.http.postRequest(addDxpressUrl + "?expressCompany=" + encodeURI(expressCompany) + "&expressNumber=" + encodeURI(expressNumber), data)
}
// 订单填写商家备注
function addRemark(data) {
  return app.http.putRequest(addRemarkUrl + "?remark=" + encodeURI(data.remark), data)
}
//改价
function updatetotal(data) {
  return app.http.postRequest(updatetotalUrl, data)
}
// 查看凭证
function seeVoucher(data) {
  return app.http.getRequest(seeVoucherUrl, data)
}
// 裁剪图片跳转
function toCuttingImg(url, quality, width, height) {
  if (url) {
    let add = '/pages/page/upload/upload?src=' + url;
    quality ? add += "&quality=true" : "";
    add += "&width=";
    width ? add += width : add += "750";
    add += "&height=";
    height ? add += height : add += "750";
    wx.navigateTo({
      url: add,
    })
  }
}
// 提交订单
function supplyOrde(data) {
  data = initStoreId(data);
  return app.http.postRequest(supplyOrderUrl, data);
}
/**更新商品**/
function copyGoods(data) {
  return app.http.putRequest(copyGoodsUrl, data)
}
// 回首页
function toHome() {
  wx.switchTab({
    url: '/pages/page/home/home'
  })
}
// 获取收款二维码
function getPaymentImg(data) {
  data = initStoreId(data);
  return app.http.getRequest(getPaymentImgUrl, data)
}
// 设置收款二维码
function putPaymentImg(data) {
  data = initStoreId(data);
  return app.http.putRequest(putPaymentImgUrl, data, {
    'content-type': 'application/x-www-form-urlencoded'
  })
}
// 楼层三级联动
function threeFloorList(data) {
  return app.http.getRequest(threeFloorListUrl, data)
}
//订单详情
function getOrderDetail(data) {
  return app.http.getRequest(orderDetailUrl, data);
}
// 商家订单详情
function adminGetOrderDetail(data) {
  return app.http.getRequest(adminorderDetailUrl, data); 
}
//是否进货商
function ifWholesaler(data) {
  return app.http.getRequest(ifWholesalerUrl, data);
}
//门店商家列表
function getStoreOrderAdmin(data) {
  data = initStoreId(data);
  return app.pageRequest.pageGet(shopkeeperOrderListUrl, data)
}
// 帮他下单
function helpOrder(data) {
  data = initStoreId(data);
  return app.http.postRequest(helpOrderUrl, data);
}
//关闭订单
function ftfCloseOrder(data) {
  return app.http.postRequest(ftfCloseOrderUrl + "?reason=" + encodeURI(data.reason), data);
}
//取消订单
function ftfCaneledOrder(data) {
  return app.http.postRequest(ftfCaneledOrderUrl + "?reason=" + encodeURI(data.reason), data);
}
//删除订单
function ftfDelOrder(data) {
  return app.http.deleteRequest(ftfDelOrderUrl, data);
}
//商家订单详情
function ftfAdminOrderDetail(data) {
  return app.http.getRequest(ftfAdminOrderDetailUrl, data);
}
// 门店顾客列表
function customerOrderList(data) {
  data = initStoreId(data);
  return app.pageRequest.pageGet(customerOrderListUrl, data)
}
//门店顾客订单详情
function ftfCustomerOrderDetail(data) {
  return app.http.getRequest(ftfCustomerOrderDetailUrl, data);
}
// 门店商品列表
function ftfGoodsList(data) {
  data = initStoreId(data);
  return app.http.getRequest(ftfGoodsListUrl, data);
}
//添加
function ftfCreatGoods(data) {
  data = initStoreId(data);
  return app.http.postRequest(ftfCreatGoodsUrl, data);
}
//删除
function ftfDelGoods(data) {
  return app.http.deleteRequest(ftfDelGoodsUrl, data);
}
//编辑
function ftfEditGoods(data) {
  return app.http.putRequest(ftfEditGoodsUrl, data);
}
//查重
function ftfGoodsIfExist(data) {
  data = initStoreId(data);
  return app.http.getRequest(ftfGoodsIfExistUrl, data);
}

//最近关注用户列表
function recentlyFocusUser(data) {
  data = initStoreId(data);
  return app.http.getRequest(recentlyFocusUserUrl, data);
}
//查询用户肖像
function searchUserInfoByTel(data) {
  return app.http.getRequest(searchUserInfoByTelUrl, data);
}
//待付款订单
function unpaidOrderNum(data) {
  data = initStoreId(data);
  return app.http.getRequest(unpaidOrderNumUrl, data);
}
//最近到店订单
function ftfRecentOrder(data) {
  data = initStoreId(data);
  return app.http.getRequest(ftfRecentOrderUrl, data);
}
//商家是否支持在线支付
function storeOnlinePay(data) {
  data = initStoreId(data);
  return app.http.getRequest(storeOnlinePayUrl, data);
}
/**获取搜索分类**/
function searchClass(data) {
  return app.http.getRequest(searchClassUrl, data)
}
/**编辑商品规格**/
function updateGooodsSku(data) {
  return app.http.putRequest(updateGooodsSkuUrl, data)
}
/*Skucode**/
function skuCode(data) {
  return app.http.getRequest(skuCodeUrl, data)
}
/*批量生成规格值编码**/
function specValCode(data) {
  return app.http.getRequest(specValCodeUrl, data)
}
/**模板列表**/
function getGoodsSku(data) {
  return app.http.getRequest(goodsSkuUrl, data)
}
/**
 * 根据userId获取店铺Id
 */
function getStoreData(data) {
  return app.http.getRequest(getStoreDataUrl, data);
}
/**
 * 获取用户信息
 */
function getUserInfo(data) {
  return app.http.getRequest(getUserInfoUrl, data);
}
// 更新用户信息
function updateUserInfo(data) {
  return app.http.postRequest(updateUserInfoUrl, data, {
    'content-type': 'application/x-www-form-urlencoded'
  })
}
/**
 * 获取店铺性质
 */
function getStoreNature(data) {
  return app.http.getRequest(getStoreNatureUrl, data);
}
/**
 * 获取用户个人银行卡信息
 */
function getBankcard(data) {
  return app.http.getRequest(getBankcardUrl, data);
}
/**
 *
统计收支
 */
function getTrade(data) {
  return app.http.getRequest(getTradeUrl, data)
}
/**
 *
查询商户收益
 */
function getAccountin(data) {
  return app.pageRequest.pageGet(getAccountinUrl, data)
}
/**
 *
查询商户收益详情
 */
function getAccountDetail(data) {
  return app.http.getRequest(getAccountDetailUrl, data)
}
/**
 *
查询结算记录
 */
function getHaveRecord(data) {
  return app.pageRequest.pageGet(getHaveRecordUrl, data)
}
/**
 * 获取formId
 */
function getFormId(e) {
  var formId = e.detail.formId;
  var content = e.detail.target.dataset.name //记录用户的操作
  wx.setStorageSync("formId", formId)
}
/**
 * 初始化storeId
 */
function initStoreId(data) {
  if (data == null || data == undefined) {
    data = {};
  }
  if (getStoreId()) {
    data.storeId = wx.getStorageSync('storeId');
    return data;
  } else {
    showToast("暂无店铺ID！")
    let pages = getCurrentPages()
    let curPage = pages[pages.length - 1]
    curPage.setData({
      indexEmpty: false
    })
  }
}
/**
 * 获取店铺storeId
 */
function getThisStoreId() {
  if (getStoreId()) {
    return wx.getStorageSync("storeId")
  }
}
/**
 *判断是否有storeId
 */
function getStoreId() {
  if (wx.getStorageSync("storeId") == undefined || wx.getStorageSync("storeId") == '' || wx.getStorageSync("storeId") == null) {
    return false
  } else {
    return true
  }
}


/**
 *海报 
*/
function posterModuleList(data) {
  return app.http.getRequest(posterModuleListUrl, data)
}
function uploadPoster(data) {
  return app.http.putRequest(uploadPosterUrl, data, {}, true)
}
// 专辑
function addPosterTag(data) {  // 添加专辑
  data = initStoreId(data);
  return app.http.putRequest(addPosterTagUrl, data)
}
function getPosterTagList(data) {  // 专辑列表
  return app.http.getRequest(getPosterTagListUrl, data)
}
function delPosterTag(data) {  // 删除
  return app.http.deleteRequest(delPosterTagUrl + "?tagCode=" + data.tagCode, data)
}
function updatePosterTagName(data) { // 更换名字
  return app.http.postRequest(updatePosterTagNameUrl, data, { 'content-type': 'application/x-www-form-urlencoded' })
}
function getPosterTagDetail(data) {  // 详情
  return app.pageRequest.pageGet(getPosterTagDetailUrl, data)
}
function getPosterTagMsg(data) {
  return app.http.getRequest(getPosterTagMsgUrl, data)
}
function delPosterArr(data) {  // 批量删除
  return app.http.deleteRequest(delPosterArrUrl + "?posterIds=" + encodeURI(data.posterIds), data)
}
function toOtherPosterTag(data) {
  return app.http.postRequest(toOtherPosterTagUrl, data, { 'content-type': 'application/x-www-form-urlencoded' })
}
function delAllPoster(data) {  // 全删
  return app.http.deleteRequest(delAllPosterUrl + '?tagCode=' + data.tagCode, data)
}
function goodsPosterNum(data) {
  return app.http.getRequest(goodsPosterNumUrl, data)
}
// 获取店铺信息
function simpleStoreMsg(data) {
  return app.http.getRequest(simpleStoreMsgUrl, data)
}

/**
 *
商贸云活动列表
 */
function activityList(data) {
  return app.pageRequest.pageGet(activityListUrl, data)
}
/**
 *
获取可以添加的活动列表
 */
function allGoods(data) {
  return app.pageRequest.pageGet(allGoodsUrl, data)
}

/**
 *
商贸云活动下的商品列表列表
 */
function activityGoods(data) {
  return app.pageRequest.pageGet(activityGoodsUrl, data)
}
// 参加活动
function participate(data) {
  return app.http.postRequest(participateUrl, data, {
    'content-type': 'application/x-www-form-urlencoded'
  })
}
/**
 *
活动详情
 */
function activeDetails(data) {
  return app.http.getRequest(activeDetailsUrl, data)
}
/**
 *
发布活动商品
 */
function releaseGoods(data) {
  return app.http.postRequest(releaseGoodsUrl, data)
}
//添加商品
function addActiveGoods(data) {
  return app.http.postRequest(addActiveGoodsUrl, data, {
    'content-type': 'application/x-www-form-urlencoded'
  })
}
// 批量添加商品
function addAMoreGoods(data) {
  return app.http.postRequest(addAMoreGoodsUrl, data, {
    'content-type': 'application/x-www-form-urlencoded'
  })
}
// 批量发布商品
function releaseMoreGoods(data) {
  return app.http.postRequest(releaseMoreGoodsUrl, data, {
    'content-type': 'application/x-www-form-urlencoded'
  })
}
// 活动商品详情
function getActiveGoodsDetail(data) {
  return app.http.getRequest(getActiveGoodsDetailUrl, data)
}
// 编辑活动商品
function editActiveGoods(data){
  return app.http.postRequest(editActiveGoodsUrl, data)
}
// 删除活动商品详情
function delActGoods(data) {
  return app.http.deleteRequest(delActGoodsUrl, data)
}
// 店铺活动商品列表
function storeActiveGoods() {
  var data={}
  data = initStoreId(data);
  return app.http.getRequest(storeActiveGoodsUrl, data)
}
// 统计店铺销售量总额
function saleActiveList(data) {
  return app.http.getRequest(saleActiveListUrl, data)
}
// 统计店铺销售量总额
function statisticSales(data) {
  return app.http.getRequest(statisticSalesUrl, data)
}
// 统计云分销数据
function yunStatistics() {
  return app.http.getRequest(yunStatisticsUrl )
}
// 统计活动商品销量排行榜
function aAnalysisAGoods(data) {
  return app.http.getRequest(aAnalysisAGoodsUrl,data)
}
// 统计活动消费排行榜
function aAnalysisCustom(data) {
  return app.http.getRequest(aAnalysisCustomUrl, data)
}
/**统计查询进货商汇总数据列表**/
function statPurchasers(data) {
  return app.pageRequest.pageGet(statPurchasersUrl, data)
}
// 统计查询进货商信息
function statPurchasersDetails(data) {
  return app.http.getRequest(statPurchasersDetailsUrl, data)
}
//进货商交易数据列表
function purchaserTrans(data) {
  return app.pageRequest.pageGet(purchaserTransUrl, data)
}
//店铺首页接口
function storeIndexAGoods(data) {
  data = initStoreId(data);
  return app.pageRequest.pageGetActive(storeIndexAGoodsUrl, data)
}
// 打开设置页
function openSetting(data){
  data?'':data={};
  wx.showModal({
    title: data.title ? data.title:'您未授权相册权限',
    content: data.des ? data.des:'点击确定跳转至设置，授权后即可保存',
    success(res) {
      if (res.confirm) {
        wx.openSetting({
          success(res) {
            
          }
        })
      } else if (res.cancel) {
      }
    }
  })
}
// 编辑收货人信息
function editConsignee(data){
  return app.http.postRequest(editConsigneeUrl, data)
}
// 编辑物流
function editExpress(data){
  return app.http.postRequest(editExpressUrl, data, {
    'content-type': 'application/x-www-form-urlencoded'
  })
}
/**分区**/
// 显示隐藏
function zoneOnOrOff(data) {
  return app.http.putRequest(zoneOnOrOffUrl, data, {
    'content-type': 'application/x-www-form-urlencoded'
  })
}
// 置顶分区
function zoneToTop(data) {
  return app.http.putRequest(zoneToTopUrl, data)
}
// 所有分区列表
function getZoneList(data) {
  return app.http.getRequest(getZoneListUrl, data)
}
// 除去所有商品的显示分区列表
function adminShowZoneList(data) {
  return app.http.getRequest(adminShowZoneListUrl, data)
}
function apiShowZoneList(data) {
  return app.http.getRequest(apiShowZoneListUrl, data)
}
// 编辑分区
function editZone(data){
  return app.http.putRequest(editZoneUrl, data, {
    'content-type': 'application/x-www-form-urlencoded'
  })
}

module.exports = {
  editZone,
  getZoneList,
  zoneToTop,
  zoneOnOrOff,
  adminShowZoneList,
  apiShowZoneList,
  editExpress,
  editConsignee,
  openSetting,
  editActiveGoods,
  getActiveGoodsDetail,
  goodsPosterNum,
  simpleStoreMsg,
  getPosterTagMsg,
  uploadPoster,
  getPosterTagDetail,
  delPosterArr,
  toOtherPosterTag,
  delAllPoster,
  addPosterTag,
  getPosterTagList,
  delPosterTag,
  updatePosterTagName,
  posterModuleList,
  ftfpreOrderDetail,
  ftfuserSureOrder,
  getMyWXPhone,
  saveWXmsg,
  hasSavedWXmsg,
  updateUserInfo,
  storeOnlinePay,
  ftfRecentOrder,
  unpaidOrderNum,
  searchUserInfoByTel,
  recentlyFocusUser,
  ftfGoodsList,
  ftfCreatGoods,
  ftfDelGoods,
  ftfEditGoods,
  ftfGoodsIfExist,
  ftfDelOrder,
  ftfCaneledOrder,
  customerOrderList,
  ftfCustomerOrderDetail,
  ftfAdminOrderDetail: ftfAdminOrderDetail,
  ftfCloseOrder: ftfCloseOrder,
  helpOrder: helpOrder,
  getStoreOrderAdmin: getStoreOrderAdmin,
  ifWholesaler: ifWholesaler,
  getStoreNature: getStoreNature,
  getStoreData: getStoreData,
  getUserInfo: getUserInfo,
  getOrderDetail: getOrderDetail,
  adminGetOrderDetail,
  threeFloorList: threeFloorList,
  copyGoods: copyGoods,
  getFormId: getFormId,
  tempSort: tempSort,
  isFloorInfo: isFloorInfo,
  putPaymentImg: putPaymentImg,
  getPaymentImg: getPaymentImg,
  getStoreId: getStoreId,
  getThisStoreId: getThisStoreId,
  toHome: toHome,
  getStoreInfo: getStoreInfo,
  supplyOrde: supplyOrde,
  toCuttingImg: toCuttingImg,
  seeVoucher: seeVoucher,
  updatetotal: updatetotal,
  addRemark: addRemark,
  addExpress: addExpress,
  receiveOrder: receiveOrder,
  cancelOrder: cancelOrder,
  closeOrder: closeOrder,
  resetPassword: resetPassword,
  phoneMessage: phoneMessage,
  register: register,
  registerPhoneMsg: registerPhoneMsg,
  uploadVoucher: uploadVoucher,
  testGoodCode: testGoodCode,
  isNotEmpty: isNotEmpty,
  showToast: showToast,
  classListApi: classListApi,
  adminGoodsList: adminGoodsList,
  adminGoodsDelete: adminGoodsDelete,
  adminGoodsUp: adminGoodsUp,
  adminGoodsDown: adminGoodsDown,
  adminShopCate: adminShopCate,
  adminGoodsStatus: adminGoodsStatus,
  saleBatchNum: saleBatchNum,
  saleBatchAmount: saleBatchAmount,
  saleBatch: saleBatch,
  goodsSearchList: goodsSearchList,
  classList: classList,
  addClass: addClass,
  classCodeList: classCodeList,
  goodsDetails: goodsDetails,
  batchNum: batchNum,
  addressList: addressList,
  isFriend: isFriend,
  isFriendStore: isFriendStore,
  addressDefault: addressDefault,
  addressDelete: addressDelete,
  saveAddress: saveAddress,
  addressInfo: addressInfo,
  editAddress: editAddress,
  getStoreDetails: getStoreDetails,
  cartList: cartList,
  newUserInfor: newUserInfor,
  removeDefault: removeDefault,
  addTemplate: addTemplate,
  template: template,
  templateDelete: templateDelete,
  updateTemplateName: updateTemplateName,
  updateSpecName: updateSpecName,
  addCart: addCart,
  deleteTemplate: deleteTemplate,
  addTempCont: addTempCont,
  deteleCartGoods: deteleCartGoods,
  deteleCartFai: deteleCartFai,
  addMoreCart: addMoreCart,
  deteleLikeStore: deteleLikeStore,
  likeStore: likeStore,
  saveSpecTemplateContent,
  shopList: shopList,
  index: index,
  mewWholesaler: mewWholesaler,
  setName: setName,
  addWholesaler: addWholesaler,
  pass: pass,
  updateGoods: updateGoods,
  wholesalerAll: wholesalerAll,
  merchantIndex: merchantIndex,
  merchantList: merchantList,
  newMerchant: newMerchant,
  apply: apply,
  acceptPurchaser: acceptPurchaser,
  userInfo: userInfo,
  saveDetails: saveDetails,
  serWholesalerList: serWholesalerList,
  purchaserList: purchaserList,
  remakInfo: remakInfo,
  acceptmerchant: acceptmerchant,
  purchaserUserId: purchaserUserId,
  config: config,
  homeIndex: homeIndex,
  getStoreName: getStoreName,
  storeIdInfo: storeIdInfo,
  uploadImage: uploadImage,
  updateCover: updateCover,
  apiSetUser: apiSetUser,
  apiAddUser: apiAddUser,
  cusNewDetails: cusNewDetails,
  adminAddUser: adminAddUser,
  adminSetUser: adminSetUser,
  dealUser: dealUser,
  favoriteusers: favoriteusers,
  updateMoreCart: updateMoreCart,
  updateMes: updateMes,
  uploadLogoImg: uploadLogoImg,
  topGoods: topGoods,
  updateClass: updateClass,
  adminGetDetails: adminGetDetails,
  storeIndex: storeIndex,
  setUserName: setUserName,
  getUserDetail: getUserDetail,
  userIdentity: userIdentity,
  customCategoryCode: customCategoryCode,
  quit: quit,
  miniProgramCode: miniProgramCode,
  userInfor: userInfor,
  classCodePar: classCodePar,
  addGoods: addGoods,
  newGoodsSearchList: newGoodsSearchList,
  classListApi: classListApi,
  goodsApiSearchList: goodsApiSearchList,
  updataPwd: updataPwd,
  changeIcon: changeIcon,
  showPurchaser: showPurchaser,
  showMerchant: showMerchant,
  recentGoods: recentGoods,
  getBankcard: getBankcard,
  getTrade,
  getAccountin,
  getAccountDetail,
  getHaveRecord,
  deleteUser,
  getGoodsSku,
  skuCode,
  specValCode,
  updateGooodsSku,
  searchClass,
  activityList,
  participate,
  activeDetails,
  releaseGoods,
  addActiveGoods,
  addAMoreGoods,
  releaseMoreGoods,
  activityGoods,
  allGoods,
  delActGoods,
  storeActiveGoods,
  saleActiveList,
  statisticSales,
  yunStatistics,
  aAnalysisAGoods,
  aAnalysisCustom,
  statPurchasers,
  statPurchasersDetails,
  purchaserTrans,
  storeIndexAGoods
}