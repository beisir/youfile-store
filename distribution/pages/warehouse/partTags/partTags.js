// distribution/pages/warehouse/partTags/partTags.js
import Api from '../../../../utils/api.js'
import { tabSelceted } from '../../../static/js/common.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tagList: [],
    serText: ''
  },
  checked(e){
    let choseArr = this.data.selectedTag
    if (this.data.tagList[e.currentTarget.dataset.index].selected){
      // 选中变为未选中
      choseArr.forEach((el,index)=>{
        if (el.code == this.data.tagList[e.currentTarget.dataset.index].code){
          choseArr.splice(index,1)
        }
      })
    } else {
      choseArr.push(this.data.tagList[e.currentTarget.dataset.index])
    }

    this.setData({
      ['tagList[' + e.currentTarget.dataset.index + '].selected']: !this.data.tagList[e.currentTarget.dataset.index].selected,
      selectedTag: choseArr
    })

    let pages = getCurrentPages();
    let prePage = pages[pages.length - 2];
    if(prePage){
      prePage.setData({
        selectedTag: choseArr
      })
    }
  },
  getList(){
    Api.getHousePartTagList({ keyword: this.data.serText}).then(res=> {
      let arr = res.obj ? res.obj : []
      arr.forEach(el => {
        this.data.selectedTag.forEach(chose => {
          if(el.code === chose.code){
            el.selected = true
          }
        })
      })
      this.setData({
        tagList: arr
      })
    })
  },
  serInput(e){
    this.setData({
      serText: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let tagarr = []
    if(options.tag){
      tagarr = JSON.parse(options.tag)
    }
    this.setData({
      selectedTag: tagarr
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
    this.getList()
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})