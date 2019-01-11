import Api from './api.js'
import authHandler from './authHandler.js';
const app = getApp();

class IsStoreOwner {
  /**
   * 判断身份
   */
  enterIdentity(options) {
    return new Promise((resolve, reject) => {
      var data = {}
      // 获取当前页面设置身份
      var pages = getCurrentPages()
      var currentPage = pages[pages.length - 1]
      if (authHandler.isLogin()) {
        Api.userIdentity().then(res => {
          var obj = res.obj
          if (Api.isNotEmpty(obj)) {
            var isStoreOwner = obj.isStoreOwner,
              isPurchaser = obj.isPurchaser
            if (isStoreOwner) {
              // 店主
              wx.setStorageSync("admin", 2)
              currentPage.setData({
                limitShow: 2
              })
              this.setCart()
              data = { isStoreOwner: true}
            } else {
              if (isPurchaser) {
                // 商友
                this.setPurchase()
                currentPage.setData({
                  limitShow: 3
                })
                wx.setStorageSync("admin", 3)
                data = { isStoreOwner: false}
              } else {
                // 普通用户
                this.setCart()
                wx.setStorageSync("admin", 1)
                currentPage.setData({
                  limitShow: 1
                })
                data = { isStoreOwner: false}
              }
            }
          } else {
            this.setCart()
            wx.setStorageSync("admin", 1)
            currentPage.setData({
              limitShow: 1
            })
            data = { isStoreOwner: false}
          }
          resolve(data);
          return;
        }).catch(e => {
          resolve("异常");
          return;
        });
      } else {
        wx.setStorageSync("admin", 1)
        this.setCart()
        currentPage.setData({
          limitShow: 1
        })
        data = { isStoreOwner: false}
        resolve(data);
        return;
      }
    })
  }
  /**
   * 设置底部是进货车还是购物车
   */
  setPurchase() {
    wx.setTabBarItem({
      index: 2,
      text: '进货车',
      iconPath: '/image/22.png',
      selectedIconPath: '/image/21.png'
    })
  }
  setCart() {
    wx.setTabBarItem({
      index: 2,
      text: '购物车',
      iconPath: '/image/22.png',
      selectedIconPath: '/image/21.png'
    })
  }
}

export default IsStoreOwner