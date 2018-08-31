import request from './http.js'
class publicMethod {
  constructor() {
    this._baseUrl = 'https://xyk-doctor.com'
    this._defaultHeader = { 'data-t有pe': 'application/json' }
    this._request = new request
    this._request.setErrorHandler(this.errorHander)
  }

  /**
   * 统一的异常处理方法
   */
  errorHander(res) {
    console.error(res)
  }

  /**
   * 查询所有新闻列表
   */
  getNews() {
    return this._request.getRequest(this._baseUrl + '/admin/shop/specificationTemplate/findList', '').then(res => res.data)
  }
  /**
   * 获取所有课程
   */
  getCourseList(page = 1, size = 10, key = null) {
    let data = key != null ? { page: page, size: size, queryValue: key } : { page: page, size: size }
    return this._request.getRequest(this._baseUrl + '/course/mobile', data).then(res => res.data)
  }
}
export default publicMethod
