export const adminGoodsListUrl = '/admin/shop/store/{{storeId}}/goods'
export const adminGoodsDeleteUrl = '/admin/shop/goods/{{goodId}}'
export const adminGoodsUpUrl = '/admin/shop/store/{{storeId}}/goods/status/on'
export const adminGoodsDownUrl = '/admin/shop/store/{{storeId}}/goods/status/off'
export const adminShopCateUrl = '/admin/shop/customcategory/store/{{storeId}}'
export const adminGoodsStatusUrl = '/admin/shop/goods/{{storeId}}/goods/status/{{goodsStatus}}'
export const saleBatchNumUrl ='/admin/config/store/salebatchnum'
export const salebatchamountUrl='/admin/config/store/salebatchamount'
export const saleBatchUrl='/admin/config/store/salebatch'
export const goodsSearchListUrl='/admin/shop/store/{{storeId}}/goods'
export const classListUrl='/admin/shop/customcategory/store/{{storeId}}'
export const addClassUrl='/admin/shop/customcategory/save'
export const classCodeListUrl='/admin/shop/store/{{storeId}}/customcategory/{{customCategoryCode}}/goods'
export const goodsDetailsUrl ='/api/shop/goods/{{goodsId}}'
export const batchNumUrl='/admin/config/goods/salebatch/{{goodsId}}'
export const addressListUrl ='/admin/user/usershopaddress/list'
export const addressDefaultUrl='/admin/user/usershopaddress/default/{{id}}/{{userId}}'
export const addressDeleteUrl='/admin/user/usershopaddress/{{id}}'
export const saveAddressUrl='/admin/user/usershopaddress/save'
export const addressInfoUrl ='/admin/user/usershopaddress/info/{{id}}'
export const editAddressUrl='/admin/user/usershopaddress/update'
export const cartListUrl='/api/shop/shoppingcart/user'
export const addTemplateUrl='/admin/shop/specificationTemplate/addTemplateAndContent'
export const templateUrl='/admin/shop/specificationTemplate/findList'
export const templateDeleteUrl='/admin/shop/specificationTemplate/deleteTemplateById'
export const updateTemplateNameUrl='/admin/shop/specificationTemplate/updateTemplateName'
export const updateSpecNameUrl='/admin/shop/specificationTemplate/updateSpecNameByTemplateContentId'
export const addCartUrl='/api/shop/shoppingcart/goods'
export const deleteTemplateUrl='/admin/shop/specificationTemplate/deleteTemplateContentByTemplateContentId'
export const addTempContUrl='/admin/shop/specificationTemplate/updateTemplateContentSpecValue'
export const saveSpecTemplateContentUrl='/admin/shop/specificationTemplate/saveSpecTemplateContent'
export const deteleCartGoodsUrl = '/api/shop/shoppingcart/{{goodsId}}'
export const deteleCartFaiUrl='/api/shop/shoppingcart/user/{{storeId}}/failure'
export const addMoreCartUrl ='/api/shop/shoppingcart/goods/batch'
export const likeStoreUrl = '/api/shop/user/favorite/store?storeId=' + wx.getStorageSync('storeId')
export const deteleLikeStoreUrl = '/api/shop/user/favorite/store?storeId=' + wx.getStorageSync('storeId')
export const shopListUrl='/api/shop/store/{{storeId}}/user/goods/'
export const configUrl ='/api/config/goods/salebatch/'
export const homeIndexUrl='/api/store/index/{{storeId}}'
export const storeIdInfoUrl='/api/{{storeId}}/info'
export const updateCoverUrl='/admin/store/{{storeId}}/coverUrl'
export const dealUserUrl='/order/statistics/{{storeId}}/{{orderCategory}}/tradeusers'
export const favoriteusersUrl='/admin/store/{{storeId}}/favoriteusers'
export const updateMoreCartUrl ='/api/shop/shoppingcart/shop/goods/batch/'
export const updateMesUrl='/admin/store/update'
export const uploadLogoImgUrl='/admin/store/{{storeId}}/logo'
export const topGoodsUrl='/admin/shop/goods/top/{{goodsId}}'
export const storeIndexUrl='/admin/store/{{storeId}}/index'
export const setUserNameUrl='/admin/shop/storecustomer/remark/{{storeId}}/{{userId}}/{{remark}}'
export const getUserDetaislUrl='/api/user/bymobile/{{mobile}}'
export const userIdentityUrl='/api/store/{{storeId}}/user/identity'
// 批发商管理信息
export const indexUrl = '/admin/purchasermerchant/index'
export const mewWholesalerUrl ='/admin/bizfriend/{{storeId}}/merchantapply'
export const setNameUrl ='/admin/purchasermerchant/remark/{{storeId}}/{{remark}}'
export const addWholesalerUrl ='/admin/bizfriend/merchantapply'
export const passUrl='/admin/bizfriend/acceptpurchaser'
export const wholesalerAllUrl = '/admin/purchasermerchant/merchants'
export const serWholesalerListUrl='/admin/purchasermerchant/merchantlist'
export const acceptmerchantUrl='/admin/bizfriend/acceptmerchant'
export const purchaserUserIdUrl='/admin/store/merchantinfo/{{storeId}}/{{purchaserUserId}}'
export const applyinfoUrl='/admin/store/applyinfo/{{storeId}}/{{purchaserUserId}}'
// 进货商
export const merchantIndexUrl ='/admin/merchantpurchaser/{{storeId}}'
export const merchantListUrl ='/admin/merchantpurchaser/{{storeId}}/merchants'
export const newMerchantUrl='/admin/bizfriend/{{storeId}}/purchaserapply'
export const applyUrl='/admin/bizfriend/purchaserapply'
export const acceptPurchaserUrl='/admin/bizfriend/acceptpurchaser'
export const userInfoUrl='/admin/shop/storecustomer/{{storeId}}/{{userId}}'
export const saveDetailsUrl='/admin/shop/storecustomer/save'
export const purchaserListUrl='/admin/merchantpurchaser/purchaserlist'
export const remakInfoUrl ='/admin/bizfriend/user/{{storeId}}/purchaser/{{userId}}/remakinfo'
export const apiSetUserUrl='/api/user/set'
export const apiAddUserUrl='/api/user/set/bfpripermission'
export const adminSetUserUrl='/admin/user/set'
export const adminAddUserUrl = '/admin/user/set/bfpripermission'
