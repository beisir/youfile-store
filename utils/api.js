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
  wholesalerAllUrl
} from './constUrl.js'
const app = getApp()
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
/**获取店内分类列表**/
function classList(data) {
  return app.http.getRequest(classListUrl)
}
/**新建分类**/
function addClass(data) {
  return app.http.postRequest(addClassUrl, data)
} 
/**商品状态筛选**/
function classCodeList(data) {
  return app.pageRequest.pageGet(classCodeListUrl, data)
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
/**批发商列表**/
function wholesalerAll(data) {
  return app.pageRequest.pageGet(wholesalerAllUrl, data)
}

module.exports = {
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
  wholesalerAll:wholesalerAll
}
