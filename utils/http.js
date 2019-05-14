import AuthHandler from './authHandler.js';
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
          complete: function() {
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
  chooseImageUpload(types, ifUploadMore, index) {
    return this.chooseImage(types, ifUploadMore, index)
  }

  chooseImage(types, ifUploadMore, index) {
    wx.showNavigationBarLoading()
    wx.showLoading({
      title: "正在加载",
      mask: true
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
          count: ifUploadMore ? 6 : 1,
          sizeType: ['compressed'], // original 原图，compressed 压缩图，默认二者都有
          sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
          success: function(res) {
            var tempFilePaths = res.tempFilePaths;
            for (var v of tempFilePaths) {
              wx.uploadFile({
                url: uploadImg,
                filePath: v,
                name: 'file',
                header: header,
                formData: {
                  'type': types ? types : ""
                },
                success: (res => {
                  if (res.statusCode === 200) {
                    let pages = getCurrentPages()
                    let curPage = pages[pages.length - 1]
                    // 多张
                    if (ifUploadMore){
                      var addGoodsDetails = curPage.data.addGoodsDetails
                      if (index) {
                        addGoodsDetails.splice(index, 0, { "img": imageUrl + JSON.parse(res.data).obj })
                      } else {
                        addGoodsDetails.push({
                          "img": imageUrl + JSON.parse(res.data).obj
                        })
                      }
                      curPage.setData({
                        addGoodsDetails: addGoodsDetails
                      })
                    }else{
                      resolve(res.data)
                    }
                  } else {
                    if (this._errorHandler != null) {
                      this._errorHandler(res)
                    }
                    reject(res)
                  }
                }),

              })
            }
          },
          fail: (res => {
            if (this._errorHandler != null) {
              this._errorHandler(res)
            }
            reject(res)
          }),
          complete: function() {
            wx.hideLoading()
            wx.hideNavigationBarLoading()
          }
        })
      })
    })
  }
  onlychoseImg(type) {
    let pages = getCurrentPages(),
      current = pages[pages.length - 1];
      let oritype = ['album', 'camera']
      if (type) {
        oritype = type
      }
      return new Promise((resolve, reject) => {
        if (current.data.choosingImg) {
          reject("重复点击")
          return
        }else{
          current.setData({ choosingImg: true })
        }
        wx.chooseImage({
          count: 1,
          sizeType: ['compressed'], // original 原图，compressed 压缩图，默认二者都有
          sourceType: oritype, // album 从相册选图，camera 使用相机，默认二者都有
          success: function (res) {
            resolve(res)
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
  
  onlyUploadImg(url, types, noLoading) {
    if (!url) {
      console.warn('no upload url')
      return
    }

    return new Promise((resolve, reject) => {
      this.authHandler.getTokenOrRefresh().then(token => {
        var header = this.defaultUploadHeader
        if (token) {
          header['Authorization'] = token;
        } else {
          delete header['Authorization'];
        }
        if (!noLoading) {
          wx.showLoading({
            title: '上传中',
          })
        }
        wx.uploadFile({
          url: uploadImg,
          filePath: url,
          name: 'file',
          header: header,
          formData: {
            'type': types ? types : ""
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
          complete: (res => {
            if (!noLoading) {
              wx.hideLoading();
            }
          })
        })
      })
    })

  }

  // 多图上传
  uploadImgArr(arr, type = '') {
    if (!arr || arr.length == 0) { return }
    this.getImgArr = [],
      this.nowIndex = 0;
    this.handleImgList(0, arr, type)
    wx.showLoading({
      title: '开始上传',
      mask: true
    })
  }
  handleImgList(index, arr, type) {
    let pages = getCurrentPages(),
      current = pages[pages.length - 1];
    if (!arr[index]) {
      wx.hideLoading()
      return
    }
    this.onlyUploadImg(arr[index], type, true).then(res => {
      this.getImgArr.push(res)
      if (arr[++index]) {
        wx.showLoading({
          title: '正在上传:' + index + '/' + arr.length,
          mask: true
        })
        this.nowIndex = index
        this.handleImgList(index, arr, type)
      } else {
        current.mulImgUploadSuccess ? current.mulImgUploadSuccess(this.getImgArr) : ''
        wx.hideLoading()
      }
    }).catch(e => {
      current.mulImgUploadFail ? current.mulImgUploadFail(e) : ''
      wx.hideLoading()
    })
  }
  
  // 选择视频
  chooseVedio(obj){
    if(!obj){obj = {}}
    return new Promise((resolve,reject)=>{
      wx.chooseVideo({
        sourceType: obj.sourceType ? obj.sourceType:['album', 'camera'],
        compressed: obj.compressed === false ? false:true, //压缩
        maxDuration: obj.maxDuration ? obj.maxDuration : 30,
        success: (res) => {
          // 大小
          if (obj.size && res.size/1024/1024 > obj.size){
            reject({ errtype: 'size', res: res})
            return
          }
          // 宽高
          if (obj.height && res.height > obj.height) {
            reject({ errtype: 'height', res: res })
            return
          }
          if (obj.width && res.width > obj.width) {
            reject({ errtype: 'width', res: res })
            return
          }
          if (obj.duration && res.duration > obj.duration){
            reject({ errtype: 'duration', res: res })
            return
          }
        
          if(obj.upload){
            uploadVedio({
              url: res.tempFilePath,
            }).then(res=>{
              resolve(res)
            }).catch(e=>{
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
  // 上传视频
  uploadVedio(obj){
    return new Promise((resolve,reject)=>{
      if (!obj.noLoading) {
        wx.showLoading({
          title: '上传视频中',
        })
      }
      wx.uploadFile({
        url: uploadImg,
        filePath: obj.url,
        name: 'file',
        formData: {
          'type': types ? types : ""
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
        complete: (res => {
          if (!noLoading) {
            wx.hideLoading();
          }
        })
      })
    })
  }
}
export default request