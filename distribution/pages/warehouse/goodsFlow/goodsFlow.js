// distribution/pages/warehouse/goodsFlow/goodsFlow.js
import Api from '../../../../utils/api.js'
const app = getApp()
import { formatTimeday, formatHour} from '../../../../utils/util.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    flowObj: {}
  },
  getList(re){
    if (re) {
      app.pageRequest.pageData.pageNum = 0;
      this.setData({
        flowObj: {}
      })
    }
    Api.stockCodeGoodsFlow({ stockCode: this.data.code}).then(res=>{
      this.resetList(res.obj.flows.result )
      this.setData({
        goods: res.obj.num,
      })
    })
  },
  resetList(arr){
    let obj = this.data.flowObj
    arr.forEach(el=>{
      let nowDate = new Date(el.time)
      let date = formatTimeday(nowDate)
      el.newTime = formatHour(nowDate)
      if (obj[date]){
        obj[date].list.push(el)
      } else {
        let day = ''
        switch(nowDate.getDay()){
          case 0: day = '日';break;
          case 1: day = '一'; break;
          case 2: day = '二'; break;
          case 3: day = '三'; break;
          case 4: day = '四'; break;
          case 5: day = '五'; break;
          case 6: day = '六'; break;
        }
        obj[date] = {
          date: date + " 星期" + day,
          list: [el]
        }
      }    
    })
    this.setData({
      flowObj: obj
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      code: options.code
    },()=>{
      this.getList(true)
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getList()
  }
})