import AuthHandler from './authHandler.js';
/**
 请求
 */
class request {
  constructor() {
    this._baseUrl = 'https://mall.youlife.me',
      this._headerGet = {
        'content-type': 'application/json'
      },
      this._headerPost = {
        "Content-Type": "application/json;charset=UTF-8"
      },
      this.newData = {},
      this.arrUrl = ["/api/shop/shoppingcart/goods/batch", "/admin/shop/specificationTemplate/addTemplateAndContent", "/api/shop/shoppingcart/shop/goods/batch/", "/api/user/register", "/api/smsCode", "/api/user/register", "/api/user/resetpassword", "/oauth/code/sms"],
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
      if (this.arrUrl.indexOf(url)==-1) {
        if (Array.isArray(data) || data == undefined) {
          this.newData.storeId = wx.getStorageSync('storeId')
          url = this.analysisUrl(url, this.newData)
        } else {
          data.storeId = wx.getStorageSync('storeId')
          url = this.analysisUrl(url, data)
        }
      }else{
        if (url =='/api/shop/shoppingcart/shop/goods/batch/'){
         var goodsId=JSON.parse(data)[0]["goodsId"]
          url = '/api/shop/shoppingcart/shop/goods/batch/'+goodsId
        }
      }
      this.authHandler.getTokenOrRefresh().then(token => {
        if (token) {
          this._headerGet['Authorization'] = token;
        } else {
          delete this._headerGet['Authorization'];
        }
        // wx.clearStorageSync('access_token')
        // this._headerGet['Authorization'] = 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsaWNlbnNlIjoibWFkZSBieSB5b3V3ZSIsInVzZXJfbmFtZSI6IjEzMzYzNTI3NDI1Iiwic2NvcGUiOlsiYWxsIl0sImV4cCI6MTUzNzc3MDg4NiwidXNlcklkIjoiYzI5ZjRjOWQ2YjQ0NmU5NzdjMTZiYjg3OWE0NjNlOTIiLCJhdXRob3JpdGllcyI6WyJST0xFX1VTRVIiXSwianRpIjoiMWQ4YWI5NWUtNjA0OS00ZmZlLThjYmYtMmFhYWU3Y2VkYmYxIiwiY2xpZW50X2lkIjoiQmVpSmluZ0JhaVJvbmdTaGlNYW9DbGllbnQifQ.H0Bqq3mOhfjH4n_x7ZX_nOH9DItiugKUO6Q0HH5QbZg';
        wx.request({
          url: this._baseUrl + url,
          data: data,
          header: this._headerGet,
          method: method,
          success: (res => {
            if (res.statusCode === 200) {
              resolve(res.data)
            } else if (res.statusCode === 401) {
              let pages = getCurrentPages()
              let curPage = pages[pages.length - 1]
              this.__page = curPage
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
      })
    });
  }
  /**
   * 上传图片
   */
  chooseImageUpload(types) {
    return this.chooseImage(types)
  }
  chooseImage(types) {
    wx.showNavigationBarLoading()
    wx.showLoading({
      title: "正在加载",
    })
    return new Promise((resolve, reject) => {
      wx.chooseImage({
        count: 6,
        sizeType: ['compressed'], // original 原图，compressed 压缩图，默认二者都有
        sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
        success: function (res) {
          var imgSrc = res.tempFilePaths;
          var tempFilePaths = res.tempFilePaths
          wx.uploadFile({
            url: 'https://mall.youlife.me/base/image',
            filePath: tempFilePaths[0],
            // method:"PUT",
            name: 'file',
            header: {
              "Content-Type": "multipart/form-data",
              'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsaWNlbnNlIjoibWFkZSBieSB5b3V3ZSIsInVzZXJfbmFtZSI6IjEzNjgxNTQ3NDQwIiwic2NvcGUiOlsiYWxsIl0sImV4cCI6MTUzNzI1OTQ5NywidXNlcklkIjoiNzlmM2JiZjg2YzA1Y2Q4NTQyNmIxNWQ3YjAwMzY3YWIiLCJhdXRob3JpdGllcyI6WyJST0xFX1VTRVIiXSwianRpIjoiOWQ1MWNmNzgtOTVkNC00YzUyLWI0ODctNzg3MWQ5MTY0NWY0IiwiY2xpZW50X2lkIjoiQmVpSmluZ0JhaVJvbmdTaGlNYW9DbGllbnQifQ.DhSaIP8ew13B3x1BJxAdDEO1oqhDpCOUfWhTMTd-4tw'
            },
            formData: {
              'type': types
            },
            success: (res => {
              console.log(res)
              if (res.statusCode === 200) {
                resolve(res.data)
              } else {
                //其它错误，提示用户错误信息
                if (this._errorHandler != null) {
                  //如果有统一的异常处理，就先调用统一异常处理函数对异常进行处理
                  this._errorHandler(res)
                }
                reject(res)
              }
            }),
          })
        },
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
    })
  }

}

export default request