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
  addCartUrl
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
  console.log(data)
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
/**模板列表**/
function template(data) {
  return app.http.getRequest(templateUrl, data)
}
/**模板 删除**/
function templateDelete(data) {
  return app.http.deleteRequest(templateDeleteUrl, data)
}
/**更新模板**/
function updateTemplateName(data) {
  return app.http.postRequest(updateTemplateNameUrl, data)
} 
/**更新规格**/
function updateSpecName(data) {
  return app.http.postRequest(updateSpecNameUrl, data)
} 
/**添加到购物车**/
function addCart(data) {
  return app.http.putRequest(addCartUrl, data)
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
  updateSpecName: updateSpecNameUrl,
  addCart:addCart
}
