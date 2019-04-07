import Api from '../../../utils/api.js'
class GetTempList {
  getTempCont() {
    return new Promise((resolve, reject) => {
      Api.template()
        .then(res => {
          const obj = res.obj
          resolve(obj)
          return
        })
    })
  }
}
export default GetTempList