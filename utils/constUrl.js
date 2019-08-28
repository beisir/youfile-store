export const adminGoodsListUrl = '/admin/shop/store/{{storeId}}/goods'
export const adminGoodsDeleteUrl = '/admin/shop/goods/{{goodId}}'
export const adminGoodsUpUrl = '/admin/shop/store/{{storeId}}/goods/status/on'
export const adminGoodsDownUrl = '/admin/shop/store/{{storeId}}/goods/status/off'
export const adminShopCateUrl = '/admin/shop/customcategory/store/{{storeId}}'
export const adminGoodsStatusUrl = '/admin/shop/goods/{{storeId}}/goods/status/{{goodsStatus}}'
export const saleBatchNumUrl ='/admin/config/store/salebatchnum'
export const customCategoryCodeUrl='/admin/shop/goods/customcategory/{{customCategoryCode}}/goods'
export const salebatchamountUrl='/admin/config/store/salebatchamount'
export const saleBatchUrl='/admin/config/store/salebatch'
export const addGoodsUrl = '/admin/shop/shop/goods/'
export const getStoreNameUrl='/api/store/{{storeId}}'
export const cusNewDetailsUrl='/admin/shop/storecustomer/{{storeId}}/{{userId}}/count'
export const userInforUrl ='/api/user/byuserid'
export const newUserInforUrl ='/api/user/{{userId}}'
export const getStoreDetailsUrl='/admin/store/{{userId}}/storeId'
export const classCodeParUrl ='/admin/shop/category/sublist/{{parentCategoryCode}}'
export const updateGoodsUrl='/admin/shop/shop/goods/'
export const goodsSearchListUrl = '/admin/shop/store/{{storeId}}/goods'
export const newGoodsSearchListUrl = '/api/shop/store/{{storeId}}/goods'
export const goodsApiSearchListUrl='/api/shop/store/{{storeId}}/user/goods'
export const classListUrl='/admin/shop/customcategory/store/{{storeId}}'
export const classListApiUrl ='/api/shop/customcategory/store/{{storeId}}'
export const addClassUrl='/admin/shop/customcategory/save'
export const classCodeListUrl='/admin/shop/store/{{storeId}}/customcategory/{{customCategoryCode}}/goods'
export const goodsDetailsUrl ='/api/shop/goods/{{goodsId}}'
export const adminGoodsDetailsUrl ='/admin/shop/goods/{{goodsId}}'
export const batchNumUrl='/admin/config/goods/salebatch/{{goodsId}}'
export const addressListUrl ='/api/user/usershopaddress/list'
export const addressDefaultUrl = '/api/user/usershopaddress/default/{{id}}'
export const removeDefaultUrl='/api/user/usershopaddress/cancel/{{id}}'
export const addressDeleteUrl='/api/user/usershopaddress/{{id}}'
export const saveAddressUrl='/api/user/usershopaddress/save'
export const addressInfoUrl ='/api/user/usershopaddress/info/{{id}}'
export const editAddressUrl='/api/user/usershopaddress/update'
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
export const tempSortUrl='/admin/shop/specificationTemplate/templatecontent/{{templateContentId}}/sort'
export const deteleCartGoodsUrl = '/api/shop/shoppingcart/{{goodsId}}'
export const deteleCartFaiUrl='/api/shop/shoppingcart/user/failure'
export const addMoreCartUrl ='/api/shop/shoppingcart/goods/batch'
export const likeStoreUrl = '/api/shop/user/favorite/store'
export const deteleLikeStoreUrl = '/api/shop/user/favorite/store'
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
export const getUserDetailUrl='/api/user/bymobile/{{mobile}}'
export const userIdentityUrl='/api/store/{{storeId}}/user/identity'
export const miniProgramCodeUrl='/api/store/{{storeId}}'
export const recentGoodsUrl='/api/shop/store/{{storeId}}/user/goods/recent'
export const updateClassUrl='/admin/shop/customcategory/update'
export const getStoreDataUrl='/api/store/owner/{{userId}}'
export const getUserInfoUrl = '/api/user/byuserid'
export const getStoreNatureUrl ='/api/store/nature/{{storeId}}'
// 批发商管理信息
export const indexUrl = '/admin/purchasermerchant/index'
export const mewWholesalerUrl ='/admin/bizfriend/merchantapply'
export const setNameUrl ='/admin/purchasermerchant/remark/{{storeId}}/{{remark}}'
export const addWholesalerUrl ='/admin/bizfriend/merchantapply'
export const passUrl='/admin/bizfriend/acceptpurchaser'
export const wholesalerAllUrl = '/admin/purchasermerchant/merchants'
export const serWholesalerListUrl='/admin/purchasermerchant/merchantlist'
export const acceptmerchantUrl='/admin/bizfriend/acceptmerchant'
export const purchaserUserIdUrl='/admin/store/merchantinfo/{{storeId}}/{{purchaserUserId}}'
export const applyinfoUrl='/admin/store/applyinfo/{{storeId}}/{{purchaserUserId}}'
export const isFriendUrl='/admin/merchantpurchaser/{{storeId}}/purchaser/{{userId}}'
// 云分销商
export const merchantIndexUrl ='/admin/merchantpurchaser/{{storeId}}'
export const merchantListUrl ='/admin/merchantpurchaser/{{storeId}}/merchants'
export const newMerchantUrl='/admin/bizfriend/{{storeId}}/purchaserapply'
export const applyUrl='/admin/bizfriend/purchaserapply'
export const acceptPurchaserUrl='/admin/bizfriend/acceptpurchaser'
export const userInfoUrl='/admin/shop/storecustomer/{{storeId}}/{{userId}}'
export const saveDetailsUrl='/admin/shop/storecustomer/save'
export const purchaserListUrl='/admin/merchantpurchaser/purchaserlist'
export const remakInfoUrl ='/admin/merchantpurchaser/{{storeId}}/purchaserinfo/{{purchaserUserId}}'
export const apiSetUserUrl='/api/user/set'
export const apiAddUserUrl='/api/user/set/bfpripermission'
export const adminSetUserUrl ='/admin/merchantset/set'
export const isFriendStoreUrl='/admin/purchasermerchant/{{storeId}}/merchant'
export const adminAddUserUrl = '/admin/merchantset'
// 退出
export const quitUrl = "/oauth/authentication/removetoken"
export const updataPwdUrl = "/oauth/authentication/changepassword"
export const changeIconUrl = "/api/user/headpic"
export const testGoodCodeUrl = "/admin/order/{{orderNumber}}/claim"
export const uploadPayVoucherUrl = "/api/order/orderpayment/{{orderNumber}}/uploadpayvoucher"
export const resetPasswordUrl = "/oauth/user/resetpassword"
export const phoneMessageUrl = "/oauth/code/sms"
export const registerUrl = "/oauth/user/register"
export const registerPhoneMsgUrl = "/api/smsCode"
export const closedOrderUrl = "/admin/order/{{orderNumber}}/closed"
export const cancelOrderUrl = "/api/order/{{orderNumber}}/cancel"
export const addDxpressUrl = "/admin/order/{{orderNumber}}/addexpress"
export const addRemarkUrl = "/admin/order/{{orderNumber}}/addRemark"
export const updatetotalUrl = "/admin/order/{{orderNumber}}/updatetotal"
export const seeVoucherUrl = "/api/order/orderpayment/{{orderNumber}}"
export const supplyOrderUrl = "/api/order/"
export const receiveOrderUrl = "/api/order/{{orderNumber}}/receive"
// 扫一扫
export const showPurchaserUrl='/admin/bizscan/purchaser/{{userId}}'
export const showMerchantUrl='/admin/bizscan/merchant/{{userId}}'
//获取收款码
export const getPaymentImgUrl = "/admin/store/receiptcode/{{storeId}}"
export const putPaymentImgUrl = "/admin/store/{{storeId}}/receiptcode"
// 一键入库
export const copyGoodsUrl='/api/shop/goods/copy/{{originGoodsId}}'
// 楼层三级
export const threeFloorListUrl = "/api/floor/threelevellist/{{mallCode}}"
//订单详情
export const orderDetailUrl = "/api/order/byordernumber/{{orderNumber}}";
//商家订单详情
export const adminorderDetailUrl = '/admin/order/byordernumber/{{orderNumber}}'
// 是否为云分销商
export const ifWholesalerUrl = "/admin/user/profile/{{userId}}"
// 商家门店订单
export const shopkeeperOrderListUrl = "/admin/ftf/order/store/{{storeId}}/orderstatus/{{orderStatus}}"
export const customerOrderListUrl ="/api/ftf/order/user/store/{{storeId}}/orderstatus/{{orderStatus}}"
// 帮他下单
export const helpOrderUrl = "/admin/ftf/order"
//门店订单详情
export const ftfAdminOrderDetailUrl = "/admin/ftf/order/byordernumber/{{orderNumber}}"
export const ftfCustomerOrderDetailUrl = "/api/ftf/order/byordernumber/{{orderNumber}}"
//门店关闭订单
export const ftfCloseOrderUrl = "/admin/ftf/order/{{orderNumber}}/closed"
export const ftfCaneledOrderUrl = "/api/ftf/order/{{orderNumber}}/cancel"
// 删除订单
export const ftfDelOrderUrl = "/api/ftf/order/{{orderNumber}}"
// 线下商品
export const ftfGoodsListUrl = "/admin/shop/offlinegoods/{{storeId}}/list" 
export const ftfCreatGoodsUrl = "/admin/shop/offlinegoods"
export const ftfDelGoodsUrl = "/admin/shop/offlinegoods/{{goodsId}}"
export const ftfEditGoodsUrl = "/admin/shop/offlinegoods/{{goodsId}}/byid"
export const ftfGoodsIfExistUrl = "/admin/shop/offlinegoods/{{storeId}}/exist" 
//最近关注
export const recentlyFocusUserUrl = "/admin/store/{{storeId}}/favoriteusers/recently"
//用户肖像
export const searchUserInfoByTelUrl = "/admin/user/profile/{{mobile}}/mobile"
//用户待付款订单
export const unpaidOrderNumUrl = "/api/all/order/{{storeId}}/unpaid/count/group/category"
//买单首页弹窗
export const ftfRecentOrderUrl = "/api/ftf/order/user/store/{{storeId}}/unpaid/last"
//商家是否支持在线支付
export const storeOnlinePayUrl = "/api/merchant/pay/config/{{storeId}}/pay"

// 资金管理
export const getBankcardUrl='/admin/user/profile/bankcard'
export const getTradeUrl ='/admin/store/trade/statistic'
export const getAccountinUrl='/admin/store/trade/accountin'
export const getAccountDetailUrl ='/admin/store/trade/{{paymentNumber}}/account/detail'
export const getHaveRecordUrl ='/admin/store/trade/settle'
// 删除云分销商关系
export const deleteUserUrl='/admin/merchantpurchaser/{{storeId}}/{{purchaserUserId}}'
// 根据商品查SKU
export const goodsSkuUrl = '/admin/shop/goods/specification/sku/{{goodsId}}'
// 查询SKUcode,
export const skuCodeUrl = '/admin/shop/goods/specification/specification/value/codes'
// 批量生成规格值code
export const specValCodeUrl = '/admin/shop/goods/specification/spec/value/codes'
// 修改SKU
export const updateGooodsSkuUrl = '/admin/shop/goods/specification/sku'
// 分类搜索
export const searchClassUrl = '/api/shop/category/search'

// 修改用户信息
export const updateUserInfoUrl = '/api/user/update'
// 微信信息
export const hasSavedWXmsgUrl = '/api/weixin/user/exist'
export const saveWXmsgUrl = '/api/weixin/user/save'
// 解密手机
export const getMyWXPhoneUrl = '/api/weixin/user/decrypt'
// 门店订单 买家
export const ftfuserSureOrderUrl = '/api/ftf/order'
export const ftfpreOrderDetailUrl = '/admin/ftf/order/{{qrCode}}/info'
// 查询店铺信息
export const simpleStoreMsgUrl = '/api/store/simple/{{storeId}}'
/**
 * 海报
 * */
export const posterModuleListUrl = '/admin/marketing/poster/template/list/onlines'
export const uploadPosterUrl = '/admin/marketing/poster/batch'
// 专辑
export const addPosterTagUrl = '/admin/marketing/poster/tag'
export const getPosterTagListUrl = '/admin/marketing/poster/tag/'
export const delPosterTagUrl = '/admin/marketing/poster/tag/code'
export const updatePosterTagNameUrl = '/admin/marketing/poster/tag/name'
export const getPosterTagMsgUrl = '/admin/marketing/poster/tag/{{code}}/detail'
export const getPosterTagDetailUrl = '/admin/marketing/poster/tag/{{tagCode}}'
export const delPosterArrUrl = '/admin/marketing/poster/batch'
export const toOtherPosterTagUrl = '/admin/marketing/poster/tag'
export const delAllPosterUrl = '/admin/marketing/poster/tag/poster'
export const goodsPosterNumUrl = '/admin/marketing/poster/goods/{{goodsId}}/count'

// 查询店铺有效活动
export const storeActiveGoodsUrl="/api/activity/{{storeId}}/activity/doing/list"
// 活动
export const activityListUrl ='/admin/activity/mall/{{mallCode}}/page'
export const participateUrl ="/admin/activity/{{activityNumber}}/participate/mall/activity"
export const activeDetailsUrl="/admin/activity/{{activityNumber}}"
export const releaseGoodsUrl ="/admin/goods/activity/{{activityNumber}}/goods/{{goodsId}}/release"
export const addActiveGoodsUrl ="/admin/goods/activity"
export const addAMoreGoodsUrl ="/admin/goods/activity/batch"
export const releaseMoreGoodsUrl ="/admin/goods/activity/{{activityNumber}}/goods/release/batch"
export const activityGoodsUrl="/admin/goods/activity/goods/in/{{activityNumber}}/page"
export const allGoodsUrl="/admin/goods/activity/goods/for/{{activityNumber}}/page"
export const delActGoodsUrl="/admin/goods/activity/{{activityNumber}}/goods/{{goodsId}}"
export const getActiveGoodsDetailUrl = '/admin/goods/activity/{{activityNumber}}/goods/{{goodsId}}'
export const editActiveGoodsUrl = '/admin/goods/activity/goods/edit'
export const saleActiveListUrl="/admin/activity/statistic/{{activityNumber}}/store/sales/list"
export const statisticSalesUrl="/admin/activity/statistic/sum/{{activityNumber}}/store/sales/all"
// 统计云分销数据
export const yunStatisticsUrl="/order/statistics/distribution"
export const aAnalysisAGoodsUrl="/admin/activity/statistic/{{activityNumber}}/store/goods/top"
export const aAnalysisCustomUrl="/admin/activity/statistic/{{activityNumber}}/store/custom/top"
// 统计查询云分销商汇总数据列表
export const statPurchasersUrl="/order/statistics/purchasers/trade/data/page"
export const statPurchasersDetailsUrl="/order/statistics/purchaser/{{userId}}/trade/data"
export const purchaserTransUrl="/admin/order/purchaser/{{userId}}/"
export const storeIndexAGoodsUrl ="/api/activity/goods/{{activityNumber}}/store/{{storeId}}/goods/page"
// 修改收货人信息
export const editConsigneeUrl = '/admin/order/{{orderNumber}}/consignee'
// 修改物流
export const editExpressUrl = '/admin/order/{{orderNumber}}/express'
// 商品分区
export const adminShowZoneListUrl = '/admin/goods/zone/list'
export const zoneToTopUrl = '/admin/goods/zone/{{zoneNumber}}/top'
export const zoneOnOrOffUrl = '/admin/goods/zone/{{zoneNumber}}/setting'
export const getShowZoneListUrl = '/admin/goods/zone/on/excludeall/list'
export const getZoneListAdminUrl = '/admin/goods/zone/excludeall/list'
export const apiShowZoneListUrl = '/api/goods/zone/{{storeId}}/on/excludeall/list'
export const editZoneUrl = '/admin/goods/zone/{{zoneNumber}}/update'
export const addGoodsToZoneUrl = '/admin/goods/zone/relation/{{zoneNumber}}/batch/add'
export const delGoodsToZoneUrl = '/admin/goods/zone/relation/{{zoneNumber}}/batch/del'
export const apiShowAllZoneUrl = '/api/goods/zone/{{storeId}}/on/list'
// 商户资质
export const getUserInfoAdminUrl = '/admin/user/byuserid'
export const merchantClassOneUrl = '/admin/industry/top'  // 一级分类
export const merchantClassTwoUrl = '/admin/industry/{{parentCode}}/next'  // 
export const getAddressMesUrl = '/admin/district/parentcode'
export const imagesignUpUrl = '/base/image/sign' // 图片签名
export const bankListUrl = '/admin/headbank/list' //总行
export const subBankListUrl = '/admin/subbank/{{headBankCode}}/list'  //支行
export const merchantBaseMsgUrl = '/admin/merchant'   // 保存基本信息
export const merchantCAMsgUrl = '/admin/merchant/qualification'   // 保存基本信息
export const merchantSettleMsgUrl = '/admin/merchant/settle'   // 保存基本信息
export const merchantDeatailUrl = '/admin/merchant/detail' //获取信息
export const hideMerchantTipUrl = '/admin/merchant/audit/broadcast/close' //隐藏tip
// 店铺活动
export const createACUrl = '/admin/activity' 
export const storeACListUrl = '/admin/activity/store/activity/page'
export const storeTemListUrl = '/admin/activity/poster/temple'
// 储存openid以及formid
export const getOpenidUrl = '/api/weixin/user/obtain/openid'
export const saveFormidUrl = '/api/weixin/user/fromid/collect'
// 仓库
export const handleWarehouseUrl = '/admin/warehouses'
export const handleHousePartUrl = '/admin/warehouses/regions'
export const handleHousePartTagUrl = '/admin/warehouses/regions/types'
// 库存商品
export const wareHouseAllgoodsUrl = '/admin/stores/{{storeId}}/stocks/nums'
export const wareHouseGoodsListUrl = '/admin/stores/{{storeId}}/stocks/goods'
export const wareHouseGoodsFlowUrl = '/admin/stocks/goods/{{goodsId}}/flows'
export const stockCodeGoodsFlowUrl = "/admin/stocks/{{stockCode}}/flows"
export const adjustGoodsStockUrl = '/admin/stocks/adjust'
export const regionGoodsListUrl = '/admin/regions/{{regionCode}}/stocks/goods'
export const delRegionGoodsUrl = '/admin/regions/goods/stocks'

// 供应商
export const createSupplierUrl = '/admin/supplier'
export const ifExistSupplierUrl = '/admin/supplier/{{name}}/exist'
export const handleSupplierUrl = '/admin/supplier/{{no}}'
export const getSupplierListUrl = '/admin/supplier/page'
export const getSupplierGoodsListUrl = '/admin/supplier/goods/{{supplierNumber}}/page'
export const getGoodswareHouseDetailUrl = '/admin/goods/{{goodsId}}/stocks'
export const getGoodsSupplierUrl = '/admin/supplier/goods/{{goodsId}}/sku/{{skuCode}}/supplier/page'
// 采购
export const createPurchaseOrderUrl = '/admin/purchaseorder'
export const getPurchaseMsgUrl = '/admin/purchaseorder/{{no}}'
export const getPurchaseOrderListUrl = '/admin/purchaseorder/page'
export const getPurchaseOrderPayWayUrl = '/admin/purchaseorder/payway'
export const purchaseStockInUrl = '/admin/purchaseorder/stock'
export const getAllGoodsUrl = '/admin/shop/store/{{storeId}}/goods'
export const orderInDetailUrl = '/admin/purchaseorder/{{no}}/stock/record'
// 订单出库
export const outHouseUrl = '/admin/order/{{orderNumber}}/stock/out/advice'
export const preOutHouseListUrl = '/admin/stocks/outParams'
export const sureOutHouseUrl = '/admin/order/stock/out'
export const editOrderExpressUrl = '/admin/out-details/{{code}}/express-infos'
// 预警
export const warningGoodsListUrl = '/admin/stores/{{storeId}}/warning-stocks'
export const getWarningSettingUrl = '/admin/warehouses/settings/{{storeId}}'
export const updateWarningSettingUrl = '/admin/warehouses/settings'
// 获取商品分类层级
export const getGoodsAllClassUrl = '/admin/shop/category/three/level/name/{{threeCategoryCode}}'