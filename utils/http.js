import AuthHandler from './authHandler.js';
import Uploader from './upload.js';
import {
  baseUrl,
  uploadImg,
  imageUrl
} from './const.js'
/**
 请求
 */
class request {
  constructor() {
    this._baseUrl = baseUrl,
      this.defaultHeader = {
        'content-type': 'application/json;charset=UTF-8'
      },
      this.defaultUploadHeader = {
        'content-type': 'multipart/form-data'
      },
      this.authHandler = new AuthHandler()
  }
  /**
   * PUT类型的网络请求
   */
  putRequest(url, data, header, hideLoading) {
    return this.requestAll(url, data, 'PUT', header, hideLoading)
  }
  /**
   * GET类型的网络请求
   */
  getRequest(url, data, header, hideLoading) {
    return this.requestAll(url, data, 'GET', header, hideLoading)
  }
  /**
   * DELETE类型的网络请求
   */
  deleteRequest(url, data, header, hideLoading) {
    return this.requestAll(url, data, 'DELETE', header, hideLoading)
  }
  /**
   * POST类型的网络请求
   */
  postRequest(url, data, header, hideLoading) {
    return this.requestAll(url, data, 'POST', header, hideLoading)
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
  requestAll(url, data, method, customHeader, hideLoading) {
    wx.showNavigationBarLoading()
    if (!hideLoading) {
      wx.showLoading({
        title: "正在加载",
      })
    }

    return new Promise((resolve, reject) => {
      url = this.analysisUrl(url, data);
      var header = (customHeader === undefined || customHeader == null || customHeader == "") ? this.defaultHeader : customHeader;
      this.authHandler.getTokenOrRefresh().then(token => {
        if (token) {
          header['Authorization'] = token;
        } else {
          delete header['Authorization'];
        }
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
                setTimeout(() => {
                  wx.showToast({
                    title: res.data.message,
                    duration: 4000,
                    icon: 'none'
                  })
                }, 0)
                reject(res);
              } else {
                reject(res);
              }
            } else if (res.statusCode === 401) {
              if (res.data && res.data.error_description &&
                res.data.error_description.indexOf("Access token expired") != -1) {
                this.authHandler.flushTokenInfo();
              } else {
                curPage.loginCom = curPage.selectComponent("#login");
                curPage.loginCom.showPage();
              }
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
            if (!hideLoading) {
              wx.hideLoading()
            }
            wx.hideNavigationBarLoading()
          }
        })
      })
    });
  }
  /**
   * 上传图片
   */
  onlychoseImg(obj) {
    if (!obj) { obj = {} }
    obj.sourceType ? '' : obj.sourceType = ['album', 'camera']
    obj.sizeType ? '' : obj.sizeType = ['original', 'compressed']
    obj.count ? '' : obj.count = 1
    let pages = getCurrentPages(),
      current = pages[pages.length - 1];
    return new Promise((resolve, reject) => {
      if (current.data.choosingImg) {
        reject("重复点击")
        return
      } else {
        current.setData({ choosingImg: true })
      }
      wx.chooseImage({
        count: obj.count,
        sizeType: obj.sizeType, // original 原图，compressed 压缩图，默认二者都有
        sourceType: obj.sourceType, // album 从相册选图，camera 使用相机，默认二者都有
        success: (res) => {
          if (obj.size) {
            let ifsize = true
            res.tempFiles.forEach(el => {
              console.log(el.size / 1024 / 1204 > obj.size)
              if (el.size / 1024 / 1204 > obj.size) {
                ifsize = false
              }
            })
            if (!ifsize) {
              wx.showToast({
                title: '图片大小不能超过' + obj.size + 'M',
                duration: 2000,
                icon: 'none'
              })
              reject('image to large')
              return
            }
          }
          if (obj.upload) {
            this.uploadImgArr(res.tempFilePaths, obj.type, obj.isPrivate).then(res => {
              resolve(res)
            })
          } else {
            resolve(res)
          }
        },
        fail: (e => {
          reject(e)
        }),
        complete: () => {
          current.setData({ choosingImg: false })
        }
      })
    })

  }

  // 多图上传
  uploadImgArr(arr, type = '', isPrivate = false) {
    if (!arr || arr.length == 0) { return }
    let pages = getCurrentPages(),
      current = pages[pages.length - 1];
    return new Promise((resolve, reject) => {
      new Uploader(this, isPrivate).uploadFile(type, { 'tempFilePaths': arr }).then(res => {
        resolve(res)
        current.mulImgUploadSuccess ? current.mulImgUploadSuccess(res, type) : ''
      }).catch(e => {
        current.mulImgUploadFail ? current.mulImgUploadFail(e) : ''
        wx.hideLoading()
      })
    })
  }

  // 选择视频
  chooseVedio(obj) {
    if (!obj) { obj = {} }
    return new Promise((resolve, reject) => {
      wx.chooseVideo({
        sourceType: obj.sourceType ? obj.sourceType : ['album', 'camera'],
        compressed: obj.compressed === false ? false : true, //压缩
        maxDuration: obj.maxDuration ? obj.maxDuration : 30,
        success: (res) => {
          // 大小
          if (obj.size && res.size / 1024 / 1024 > obj.size) {
            wx.showToast({ title: '视频不能超过' + obj.size + 'M', icon: 'none' })
            reject({ errtype: 'size', res: res })
            return
          }
          // 宽高
          if (obj.height && res.height > obj.height) {
            wx.showToast({ title: '视频高度不能超过' + obj.height, icon: 'none' })
            reject({ errtype: 'height', res: res })
            return
          }
          if (obj.width && res.width > obj.width) {
            wx.showToast({ title: '视频宽度不能超过' + obj.width, icon: 'none' })
            reject({ errtype: 'width', res: res })
            return
          }
          if ((obj.duration && res.duration > obj.duration) || (!obj.duration && res.duration > 30)) {
            let time = obj.maxDuration ? obj.maxDuration : 30
            wx.showToast({ title: '视频长度不能超过' + time + 's', icon: 'none' })
            reject({ errtype: 'duration', res: res })
            return
          }
          if (obj.upload) {
            new Uploader(this).uploadFile('', res).then(res => {
              resolve(res)
            }).catch(e => {
              reject(e)
            })
          } else {
            resolve(res)
          }
        },
        fail: (e) => {
          reject(e)
        }
      })
    })
  }
}
export default request