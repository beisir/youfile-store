/**
 * 上传文件工具类
 * */
class Uploader {
  //构造函数
  constructor(http, isPrivate) {
    this.signatureUrl = '/base/oss/signature'
    this.defaultUploadHeader = {
      'content-type': 'multipart/form-data'
    }
    this.http = http;
    this.currentSuccessIndex = 0;
    this.tempFilePathArray = [];
    this.resultUrls = [];
    this.isPrivate = isPrivate;
  }

  /**
   * 指定文件路径的文件上传
   */
  uploadFileWithFilePath(storageRule, filePath) {
    wx.showLoading({
      title: '正在上传中',
      mask: true
    })

    return new Promise((resolve, reject) => {

      if (filePath == null || filePath == undefined || filePath == "") {
        reject();
      }
      this.tempFilePathArray.push(filePath);

      this.http.getRequest(this.signatureUrl, { storageRule: storageRule }).then(res => {
        let data = res.obj;

        //未选中文件
        if (this.tempFilePathArray == null || this.tempFilePathArray.length == 0) {
          reject();
        }
        //递归调用
        this.uploadSingleFileRecursion(data, this.tempFilePathArray[this.currentSuccessIndex]).then(res => {
          wx.hideLoading();
          resolve(this.resultUrls[0]);
        }).catch(e => {
          reject();
        });

      });
    })
  }


  /**
   * 上传文件
   * storageRule:上传的文件规则，决定文件存在服务器的位置
   * chooseResult：选择结果
   */
  uploadFile(storageRule, chooseResult) {
    wx.showLoading({
      title: '正在上传中',
      mask: true
    })
    let isMoreUpload = this.checkIsMoreUpload(chooseResult);
    //多个上传
    if (isMoreUpload) {
      this.tempFilePathArray = chooseResult.tempFilePaths;
    } else {
      this.tempFilePathArray.push(chooseResult.tempFilePath);
    }
    return new Promise((resolve, reject) => {

      this.http.getRequest(this.signatureUrl, { storageRule: storageRule }).then(res => {
        let data = res.obj;

        //未选中文件
        if (this.tempFilePathArray == null || this.tempFilePathArray.length == 0) {
          reject();
        }

        //递归调用
        this.uploadSingleFileRecursion(data, this.tempFilePathArray[this.currentSuccessIndex]).then(res => {
          wx.hideLoading();
          resolve(isMoreUpload ? this.resultUrls : this.resultUrls[0]);
        }).catch(e => {
          reject();
        });

      });
    })
  }



  /**
   * 递归调用
   */
  uploadSingleFileRecursion = function (data, tempFilePath) {

    return new Promise((resolve, reject) => {

      this.uploadSingleFile(data, this.tempFilePathArray[this.currentSuccessIndex]).then(res => {

        if (this.currentSuccessIndex < this.tempFilePathArray.length) {
          this.uploadSingleFileRecursion(data, this.tempFilePathArray[this.currentSuccessIndex]).then(res => {
            resolve(this.resultUrls);
          }).catch(e => {
            reject(e);
          });
        }
        if (this.currentSuccessIndex == this.tempFilePathArray.length) {
          resolve();
        }

      }).catch(e => {
        wx.hideLoading()
        reject(e);
      });
    });
  }



  /**
   * 上传单个文件
   */
  uploadSingleFile = function (data, tempFilePath) {

    return new Promise((resolve, reject) => {
      //获取文件后缀
      let array = tempFilePath.split('.')
      let suffix = array[array.length - 1]

      //新的文件名称
      let fileName = data.randomFileName + "_" + this.currentSuccessIndex + "." + suffix


      //需要上传的文件的key （包含路径+名称）
      let key = data.path + fileName

      let host = this.isPrivate ? data.privateHost : data.host

      let uploadTask = wx.uploadFile({
        url: host,
        filePath: tempFilePath,
        name: 'file',
        header: this.defaultUploadHeader,
        formData: {
          name: fileName,
          key: key,
          policy: data.policy,
          OSSAccessKeyId: data.accessKeyId,
          success_action_status: '200',
          signature: data.signature
        },
        success: (res => {
          if (res.statusCode === 200) {
            this.currentSuccessIndex++;
            //设置url
            this.resultUrls.push(key);
            resolve()
          } else {
            reject()
          }
        }),
      });

      //监听上传进度
      uploadTask.onProgressUpdate((res) => {
        let title;
        if (this.tempFilePathArray.length > 1) {
          title = "正在上传：" + this.currentSuccessIndex + "/" + this.tempFilePathArray.length;
        } else {
          title = "正在上传：" + res.progress + '%';
        }
        wx.showLoading({
          title: title,
          mask: true
        })
      });
    });
  }


  /**
   * 检测是单个文件上传还是多个文件上传
   * chooseResult ： 选择结果
   */
  checkIsMoreUpload(chooseResult) {
    let tempFilePaths = chooseResult.tempFilePaths;

    //多选判断
    if (Array.isArray(tempFilePaths)) {
      return true;
    }

    let tempFilePath = chooseResult.tempFilePath;

    //单选判断
    if (tempFilePath != null && tempFilePath != '' && tempFilePath != undefined) {
      return false;
    }

    return false;
  }

}

export default Uploader