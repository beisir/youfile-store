import {
  navigateToAppID
} from "./const.js"

import AuthHandler from './authHandler.js'

class Navigate {
  //构造函数
  constructor() {
    this.authHandler = new AuthHandler(),
      this.env = 'trial'
  }


  //回到我的店铺
  toMyStore(targetAppId, targetStoreid) {
    this.toProgram(targetAppId, "pages/page/user/user", {
      storeId: targetStoreid,
      type: 'myStore'
    })

  }

  //店铺初始化
  toInit(targetAppId, targetStoreid) {
    this.toProgram(targetAppId, "pages/page/user/user", {
      storeId: targetStoreid,
      type: 'initStore',
      layerText: '请登陆购买账号后，点击我的工作台初始化账户'
    })
  }
  //店铺跳转
  toProgramStore(targetAppId, targetStoreid) {
    this.toProgram(targetAppId, "pages/page/home/home", {
      storeId: targetStoreid,
      type: 'store'
    })
  }

  //去mall
  toMall() {
    this.toProgram(navigateToAppID.platform)
  }

  //返回去逛逛
  returnBack() {
    let fromId = wx.getStorageSync('navigateFromAppId');
    if (fromId && (fromId == navigateToAppID.xpl || fromId == navigateToAppID.xls)) {
      this.toMall()
    } else {
      let loginObj = this.authHandler.getTokenInfo()
      let extraData = {}
      if (loginObj) {
        extraData = {
          loginObj:JSON.stringify(loginObj)
        }
      }
      wx.navigateBackMiniProgram({
        extraData,
        success(res) {

        },
        fail() {
          this.toMall()
        }
      })
    }
  }

  //跳转
  toProgram(targetAppId, targetPath, extraData) {
    if (!extraData) {
      extraData = {}
    }
    extraData.appid = navigateToAppID.me;

    let loginObj = this.authHandler.getTokenInfo()
    if (loginObj) {
      extraData.loginObj = JSON.stringify(loginObj)
    }
    try {
      if (targetPath) {
        if (targetPath.indexOf("?") == -1) {
          targetPath += "?"
        } else {
          targetPath += "&"
        }
        let arr = [];
        for (let key in extraData) {
          arr.push(key + "=" + extraData[key]);
        }
        targetPath = targetPath + arr.join("&");
      }else{
        targetPath = ""
      }
    } catch (e) {}

    return new Promise((resolve, reject) => {
      wx.navigateToMiniProgram({
        appId: targetAppId,
        path: targetPath,
        extraData,
        envVersion: this.env,
        success(res) {
          resolve(res)
        },
        fail(e) {
          reject(e)
        }
      })
    })

  }



  //入口处理跳转参数
  parseExtraDataOnlunch(options) {

  }
  parseExtraDataOnShow(options) {
    if (options.query && options.query.appid) {
      wx.setStorageSync("navigateFromAppId", options.query.appid)
    } else {
      wx.setStorageSync("navigateFromAppId", false)
    }

    //登录信息
    if (!this.authHandler.isLogin() && options.referrerInfo.extraData && options.referrerInfo.extraData.loginObj) {
      this.authHandler.saveTokenInfo(JSON.parse(options.referrerInfo.extraData.loginObj))
    }

  }


}

export default Navigate