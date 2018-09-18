import AuthHandler from './authHandler.js';
/**
 请求
 */
wx.setStorage({
  key: 'admin',
  data: 2,//1普通用户 2店主  3
})
wx.setStorage({
  key: 'storeId',
  data: "123",
})
class request {
  constructor() {
      this._baseUrl = 'https://xyk-doctor.com',
      this._headerGet = {
        'content-type': 'application/json'
      },
      this._headerPost = {
        "Content-Type": "application/json;charset=UTF-8"
      },
      this.storeId = 123,
      this.newData = {},
      this.authHandler = new AuthHandler()

  }
  /**
   * PUT类型的网络请求
   */
  putRequest(url, data) {
    return this.requestAll(url, data, 'PUT')
  }
  /**
   * GET类型的网络请求
   */
  getRequest(url, data) {
    return this.requestAll(url, data, 'GET')
  }
  /**
   * DELETE类型的网络请求
   */
  deleteRequest(url, data) {
    return this.requestAll(url, data, 'DELETE')
  }
  /**
   * POST类型的网络请求
   */
  postRequest(url, data) {
    return this.requestAll(url, data, 'POST')
  }
  /**
   * 解析URL
   */
  analysisUrl(url, data) {
    for (var key in data) {
      url = url.replace(new RegExp("\\{\\{" + key + "\\}\\}", "g"), data[key]);
    }
    return url
  }
  /**
   * 网络请求
   */
  requestAll(url, data, method) {
    wx.showNavigationBarLoading()
    wx.showLoading({
      title: "正在加载",
    })
    return new Promise((resolve, reject) => {
      if (url !== "/api/shop/shoppingcart/goods/batch" && url !== '/admin/shop/specificationTemplate/addTemplateAndContent') {
        if (Array.isArray(data) || data == undefined) {
          this.newData.storeId = wx.getStorageSync('storeId')
          url = this.analysisUrl(url, this.newData)
        } else {
          data.storeId = wx.getStorageSync('storeId')
          url = this.analysisUrl(url, data)
        }
      }
      this.authHandler.getTokenOrRefresh().then(token => {
        if (token) {
          this._headerGet['Authorization'] = token;
        } else {
          delete this._headerGet['Authorization'];
        }
        wx.request({
          url: this._baseUrl + url,
          data: data,
          header: this._headerGet,
          method: method,
          success: (res => {
            let pages = getCurrentPages()
            let curPage = pages[pages.length - 1]
            this.__page = curPage
            if (res.statusCode === 200) {
              resolve(res.data)
              // curPage.onShow()
              // curPage.onLoad()
            } else if (res.statusCode === 401) {
              curPage.loginCom = curPage.selectComponent("#login");
              curPage.loginCom.showPage();
            } else {
              //其它错误，提示用户错误信息
              if (this._errorHandler != null) {
                //如果有统一的异常处理，就先调用统一异常处理函数对异常进行处理
                this._errorHandler(res)
              }
              reject(res)
            }
          }),
          fail: (res => {
            if (this._errorHandler != null) {
              this._errorHandler(res)
            }
            reject(res)
          }),
          complete: function () {
            wx.hideLoading()
            wx.hideNavigationBarLoading()
          }
        })
      });
    })
  }
 
}

export default request