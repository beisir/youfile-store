import {
  adminGoodsListUrl,
  adminGoodsDeleteUrl,
  adminGoodsUpUrl,
  adminGoodsDownUrl,
  adminShopCateUrl,
  adminGoodsStatusUrl,
  saleBatchNumUrl,
  salebatchamountUrl,
  saleBatchUrl,
  goodsSearchListUrl,
  classListUrl,
  addClassUrl,
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
  getUserDetaislUrl,
  userIdentityUrl,
  removeDefaultUrl
} from './constUrl.js'
const app = getApp()
/**判断是否为空**/
function isEmpty(str) {
  if (str == '' || str == undefined || str == null){
    return false
  }else{
    return true
  }
}
/**提示**/
function showToast(message) {
  wx.showToast({
    title: message,
    icon: 'none',
    duration: 2000,
  })
}
/**用户身份判断**/
function userIdentity(data) {
  return app.http.getRequest(userIdentityUrl, data)
}
/**云享品管理 列表**/ 
function adminGoodsList(data){
  return app.pageRequest.pageGet(adminGoodsListUrl, data)
}
/**商品 删除**/
function adminGoodsDelete(data) {
  return app.http.deleteRequest(adminGoodsDeleteUrl, data)
}
/**商品 上架**/
function adminGoodsUp(data) {
  return app.http.postRequest(adminGoodsUpUrl, data)
}
/**商品 下架**/
function adminGoodsDown(data) {
  return app.http.postRequest(adminGoodsDownUrl, data)
}
/**本店分类**/
function adminShopCate(data) {
  return app.http.getRequest(adminShopCateUrl, data)
}
/**工作台**/
function storeIndex(data) {
  return app.http.getRequest(storeIndexUrl, data)
}
/**商品状态筛选**/
function adminGoodsStatus(data) {
  return app.pageRequest.pageGet(adminGoodsStatusUrl, data)
}
/**店铺设置起批量**/
function saleBatchNum(data) {
  return app.http.postRequest(saleBatchNumUrl+'?saleBatchNum='+data)
} 
/**店铺设置起批量**/
function saleBatchAmount(data) {
  return app.http.postRequest(salebatchamountUrl+'?amount='+data)
} 
/**获取店铺起批配置**/
function saleBatch(data) {
  return app.http.getRequest(saleBatchUrl)
}
/**商品搜索列表**/
function goodsSearchList(data) {
  return app.pageRequest.pageGet(goodsSearchListUrl, data)
}
/**关注用户列表**/
function favoriteusers(data) {
  return app.pageRequest.pageGet(favoriteusersUrl, data)
}
/**店铺首页**/
function homeIndex(data) {
  return app.pageRequest.pageGet(homeIndexUrl, data)
}
/**获取店内分类列表**/
function classList(data) {
  return app.http.getRequest(classListUrl)
}
/**新建分类**/
function addClass(data) {
  return app.http.postRequest(addClassUrl, data)
} 
/**商品置顶**/
function topGoods(data) {
  return app.http.putRequest(topGoodsUrl+"?isTop=true", data)
}
/**取消默认地址**/
function removeDefault(data) {
  return app.http.putRequest(removeDefaultUrl, data)
}
/**商品状态筛选**/
function classCodeList(data) {
  return app.pageRequest.pageGet(classCodeListUrl, data)
}
/**设置用户备注**/
function setUserName(data) {
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
  return app.http.getRequest(addressListUrl,data)
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
  return app.http.postRequest(saveAddressUrl,data)
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
  return app.http.getRequest(cartListUrl, data)
}
/**保存模板**/
function addTemplate(data) {
  return app.http.postRequest(addTemplateUrl, data)
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
function updateTemplateName(templateId, templateName ) {
  return app.http.putRequest(updateTemplateNameUrl+'?templateId='+templateId+'&templateName='+templateName )
} 
/**更新规格**/
function updateSpecName(templateContentId,specName) {
  return app.http.putRequest(updateSpecNameUrl+'?templateContentId='+templateContentId+'&specName='+specName)
} 
/**添加到购物车**/
function addCart(data) {
  return app.http.postRequest(addCartUrl, data)
}
/**批量添加到购物车**/
function addMoreCart(data) {
  return app.http.postRequest(addMoreCartUrl, data)
}
/**删除购物车商品**/
function deteleCartGoods(data) {
  return app.http.deleteRequest(deteleCartGoodsUrl,data)
}
/**修改购物车**/
function updateMoreCart(data) {
  return app.http.putRequest(updateMoreCartUrl, data)
}
/**情况购物车失效商品**/
function deteleCartFai() {
  return app.http.deleteRequest(deteleCartFaiUrl)
}
/**删除规格**/
function deleteTemplate(data) {
  return app.http.deleteRequest(deleteTemplateUrl+'?templateContentId='+data)
}
/**添加规格**/
function addTempCont(templateContentId, specValueList) {
  return app.http.putRequest(addTempContUrl+'?templateContentId='+templateContentId+'&specValueList='+specValueList)
}
/**取消关注**/
function deteleLikeStore(data) {
  return app.http.deleteRequest(deteleLikeStoreUrl, data)
}
/**关注店铺**/
function likeStore(data) {
  return app.http.putRequest(likeStoreUrl, data)
}
/**店铺信息**/
function shopList(data) {
  return app.pageRequest.pageGet(shopListUrl, data)
}
/**批发商数据**/
function index(data) {
  return app.http.getRequest(indexUrl, data)
}
/**新增批发商列表**/
function mewWholesaler(data) {
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
  return app.http.getRequest(merchantIndexUrl, data)
}
/**进货商列表**/
function merchantList(data) {
  return app.pageRequest.pageGet(merchantListUrl, data)
}
/**成交信息**/
function dealUser(data) {
  return app.pageRequest.pageGet(dealUserUrl, data)
}
/**新增进货商列表**/
function newMerchant(data) {
  return app.pageRequest.pageGet(newMerchantUrl, data)
}
/**发送商友申请 添加到进货商**/
function apply(data) {
  return app.http.postRequest(applyUrl, data)
}
/**接受申请添加到进货商**/
function acceptPurchaser(data) {
  return app.http.postRequest(acceptPurchaserUrl, data)
}
/**客户信息**/
function userInfo(data) {
  return app.http.getRequest(userInfoUrl, data)
}
/**保存客户信息**/
function saveDetails(data) {
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
  return app.http.getRequest(remakInfoUrl, data)
}
/**批发商资料**/
function purchaserUserId(url) {
  return app.http.getRequest(url)
}
/**满足起批配置信息**/
function config(data) {
  return app.http.getRequest(configUrl, data)
}
/**店铺详情**/
function storeIdInfo(data) {
  return app.http.getRequest(storeIdInfoUrl, data)
}
/**上传图片**/
function uploadImage(types) {
  return app.http.chooseImageUpload(types)
}
/**更换小云店封面**/
function updateCover(data) {
  return app.http.putRequest(updateCoverUrl, data)
}
/**更换小云店名称**/
function updateMes(data) {
  return app.http.putRequest(updateMesUrl, data)
}
/**更换小云店logo**/
function uploadLogoImg(data) {
  return app.http.putRequest(uploadLogoImgUrl, data)
}
/**获取用户权限设置**/
function apiSetUser(data) {
  return app.http.getRequest(apiSetUserUrl, data)
}
function adminSetUser(data) {
  return app.http.getRequest(adminSetUserUrl, data)
}
/**获取用户信息**/
function getUserDetaisl(data) {
  return app.http.getRequest(getUserDetaislUrl, data)
}
/**权限设置**/
function apiAddUser(data) {
  return app.http.putRequest(apiAddUserUrl+"?bfPripermission="+data)
}
function adminAddUser(data) {
  return app.http.putRequest(adminAddUserUrl + "?bfPripermission=" + data)
}
module.exports = {
  isEmpty: isEmpty,
  showToast: showToast,
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
  batchNum:batchNum,
  addressList: addressList,
  addressDefault: addressDefault,
  addressDelete: addressDelete,
  saveAddress: saveAddress,
  addressInfo: addressInfo,
  editAddress: editAddress,
  cartList: cartList,
  removeDefault: removeDefault,
  addTemplate: addTemplate,
  template: template,
  templateDelete: templateDelete,
  updateTemplateName: updateTemplateName,
  updateSpecName: updateSpecName,
  addCart:addCart,
  deleteTemplate: deleteTemplate,
  addTempCont: addTempCont,
  deteleCartGoods: deteleCartGoods,
  deteleCartFai:deteleCartFai,
  addMoreCart: addMoreCart,
  deteleLikeStore: deteleLikeStore,
  likeStore: likeStore,
  saveSpecTemplateContent,
  shopList: shopList,
  index:index,
  mewWholesaler: mewWholesaler,
  setName: setName,
  addWholesaler: addWholesaler,
  pass:pass,
  wholesalerAll:wholesalerAll,
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
  storeIdInfo: storeIdInfo,
  uploadImage: uploadImage,
  updateCover: updateCover,
  apiSetUser: apiSetUser,
  apiAddUser: apiAddUser,
  adminAddUser: adminAddUser,
  adminSetUser: adminSetUser,
  dealUser:dealUser,
  favoriteusers: favoriteusers,
  updateMoreCart: updateMoreCart,
  updateMes: updateMes,
  uploadLogoImg: uploadLogoImg,
  topGoods: topGoods,
  storeIndex: storeIndex,
  setUserName: setUserName,
  getUserDetaisl: getUserDetaisl,
  userIdentity: userIdentity
}
