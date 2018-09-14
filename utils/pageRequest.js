import http from './http.js'
class pageRequest extends http {
  constructor() {
    super()
    this.pageData={
      pageNum :0,
      pageSize:20
    }
  }
  pageGet(url, data){
    if (data == undefined) {
      var data = {}
    }
    this.pageData.pageNum++
    return this.getRequest(url, Object.assign(data, this.pageData))
  }
  // 追加数组
  addDataList(data, newArr){
  for (var i = 0; i < newArr.length; i++) {
    data.push(newArr[i]);
  }
  return data
  }
  limitShow() {
    return wx.getStorageSync('admin')
  }
}
export default pageRequest