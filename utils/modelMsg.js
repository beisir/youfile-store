import Api from '../utils/api.js'

function getOpenid(){
  return new Promise((resolve, reject)=> {
    let openid = wx.getStorageSync('openid')
    if (openid){
      resolve(openid)
    } else {
      wx.login({
        success(res) {
          if (res.code) {
            Api.getOpenid({ jsCode: res.code}).then(result=>{
              wx.setStorageSync('openid', result.obj.openid)
              resolve(result.obj.openid)
            })
          } else {
            reject()
          }
        },
        fail() {
          reject()
        }
      })
    }
  })
}

function saveFormID(e){
  if (!wx.getStorageSync('access_token')){return}
  if (e && e.detail && e.detail.formId){
    let formId = e.detail.formId
    // if (formId === 'the formId is a mock one'){return}
    getOpenid().then(openId=> {
      Api.saveFormid({ openId, formId}).then(res=> {
      })
    })
  }
}

module.exports={
  getOpenid,
  saveFormID
}