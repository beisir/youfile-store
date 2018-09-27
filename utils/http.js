import AuthHandler from './authHandler.js';
import {
  baseUrl,
  uploadImg
} from './const.js'
/**
 请求
 */
class request {
  constructor() {
      this._baseUrl = baseUrl,
      this.defaultHeader = { 'content-type': 'application/json;charset=UTF-8' },
      this.defaultUploadHeader = { 'content-type': 'multipart/form-data' },
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
  requestAll(url, data, method, customHeader) {
    wx.showNavigationBarLoading()
    wx.showLoading({
      title: "正在加载",
    })
    return new Promise((resolve, reject) => {
      url = this.analysisUrl(url, data);
      var header = (customHeader === undefined || customHeader == null || customHeader == "") ? this.defaultHeader : customHeader;
      this.authHandler.getTokenOrRefresh().then(token => {
        if (token) {
          header['Authorization'] = token;
        } else {
          delete header['Authorization'];
        }
        // wx.clearStorageSync('access_token')
        // this._headerGet['Authorization'] = 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsaWNlbnNlIjoibWFkZSBieSB5b3V3ZSIsIm1lcmNoYW50TnVtYmVyIjoiMDQ5NTg2MTMiLCJ1c2VyX25hbWUiOiIxNjg4ODg4ODg4OCIsInNjb3BlIjpbImFsbCJdLCJleHAiOjE1Mzg0NzI4NTcsInVzZXJJZCI6IjJhOTE1M2JmZmIyYmRjZjVjZWRjOTIwMTlmYmJhNzliIiwiYXV0aG9yaXRpZXMiOlsiUk9MRV9VU0VSIl0sImp0aSI6IjEzMTUwNmE4LTA4NGQtNGViOS04YWE3LWNkNzNiYTk5OWRmNiIsImNsaWVudF9pZCI6IkJlaUppbmdCYWlSb25nU2hpTWFvQ2xpZW50In0.ro5z1rEES2NDOCLYM-ACqLAsMHzxsCLSHe3g-Yf2WVs';
        wx.request({
          url: this._baseUrl + url,
          data: data,
          header: header,
          method: method,
          success: (res => {
            let pages = getCurrentPages()
            let curPage = pages[pages.length - 1]
            this.__page = curPage
            if (res.statusCode === 200) {
              if (res.data.code == 0) {
                resolve(res.data);
              } else if (res.data.code == 1) {
                wx.showToast({
                  title: res.data.message,
                  icon: 'none'
                })
                reject(res);
              } else {
                reject(res);
              }
            } else if (res.statusCode === 401) {
              curPage.loginCom = curPage.selectComponent("#login");
              curPage.loginCom.showPage();
              reject(res)
            } else {
              //其它错误，提示用户错误信息
              if (this._errorHandler != null) {
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
      this.authHandler.getTokenOrRefresh().then(token => {
        var header = this.defaultUploadHeader
        if (token) {
          header['Authorization'] = token;
        } else {
          delete header['Authorization'];
        }
      wx.chooseImage({
        count: 6,
        sizeType: ['compressed'], // original 原图，compressed 压缩图，默认二者都有
        sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
        success: function (res) {
          var imgSrc = res.tempFilePaths;
          var tempFilePaths = res.tempFilePaths
            wx.uploadFile({
              
              url: uploadImg,
              filePath: tempFilePaths[0],
              name: 'file',
              header: header,
              formData: {
                'type': types
              },
              success: (res => {
                if (res.statusCode === 200) {
                  resolve(res.data)
                } else {
                  if (this._errorHandler != null) {
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
    })
  }
}
export default request