// distribution/pages/warehouse/partTags/partTags.js
import Api from '../../../../utils/api.js'
import { tabSelceted } from '../../../static/js/common.js'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tagList: [],
    serText: ''
  },
  //手指触摸动作开始 记录起点X坐标
  touchstart: function (e) {
    //开始触摸时 重置所有删除
    let data = app.touch._touchstart(e, this.data.tagList)
    this.setData({
      tagList: data
    })
  },
  //滑动事件处理
  touchmove: function (e) {
    let data = app.touch._touchmove(e, this.data.tagList)
    this.setData({
      tagList: data
    })
  },
  // 删除标签
  delGoods(e) {
    Api.delHousePartTag({ code: e.currentTarget.dataset.code }).then(res => {
      Api.showToast(res.message, () => {
        this.getList(true)
      })
    })
  },
  checked(e) {
    let choseArr = this.data.selectedTag
    if (this.data.tagList[e.currentTarget.dataset.index].selected) {
      // 选中变为未选中
      choseArr.forEach((el, index) => {
        if (el.code == this.data.tagList[e.currentTarget.dataset.index].code) {
          choseArr.splice(index, 1)
        }
      })
    } else {
      choseArr.push(this.data.tagList[e.currentTarget.dataset.index])
    }

    this.setData({
      ['tagList[' + e.currentTarget.dataset.index + '].selected']: !this.data.tagList[e.currentTarget.dataset.index].selected
    })

    this.setChosedData(choseArr)
  },
  getList(setPage) {
    Api.getHousePartTagList({ keyword: this.data.serText }).then(res => {
      let arr = res.obj ? res.obj : []
      arr.forEach(el => {
        this.data.selectedTag.forEach(chose => {
          if (el.code === chose.code) {
            el.selected = true
          }
        })
      })
      this.setData({
        tagList: arr
      }, () => {
        if (setPage) {
          this.setChosedData()
        }
      })
    })
  },
  setChosedData(arr) {
    let list = this.data.tagList.filter(el => el.selected)
    if (arr) {
      list = arr
    }
    let pages = getCurrentPages();
    let prePage = pages[pages.length - 2];
    if (prePage) {
      prePage.setData({
        selectedTag: list
      })
    }
    this.setData({
      selectedTag: list
    })
  },
  serInput(e) {
    this.setData({
      serText: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let tagarr = []
    if (options.tag) {
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

  }
})