// pages/poster/goodsList/goodsList.js
import API from '../../../../utils/api.js'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseUrl: app.globalData.imageUrl,
    checkedLength: 0,
    goods: [],
    searchText: "",
    sureSearchText:''
  },
  searchInput(e){
    let val = e.detail.value
    this.setData({ searchText: val})
  },
  search(){
    this.setData({ sureSearchText: this.data.searchText})
    this.getGoodsList(true)
  },
  clearSearchText(){
    this.setData({ searchText: ''})
  },
  checkedGoods(e) {
    let arr = this.data.goods,
      thisItem = e.currentTarget.dataset.item;
    arr.forEach(el => {
      if (el.id === thisItem.id) {
        if(!el.checked){
          // 未选
          el.checked = true
          el.goodsImageVOList[0].checked = true
          this.setData({
            nowChecked: el
          })
          this.setData({ checkedLength: 1})
        }
      } else {
        el.checked = false
        el.goodsImageVOList.forEach(ii => {
          ii.checked = false
        })
      }
    })

    this.setData({
      goods: arr
    })
  },
  checkedImg(e) {
    let goodsindex = e.currentTarget.dataset.goodsindex,
      imgindex = e.currentTarget.dataset.index,
      item = e.currentTarget.dataset.item;
    let imgarr = this.data.goods[goodsindex].goodsImageVOList;

    const checkedarr = imgarr.filter(el => el.checked)
    if (checkedarr.length == 1 && imgarr[imgindex].checked == true){
      return
    }
    this.setData({
      ['goods[' + goodsindex + '].goodsImageVOList[' + imgindex + '].checked']: !item.checked
    })
    // 选择数
    let newimgarr = this.data.goods[goodsindex].goodsImageVOList;
    this.setData({ checkedLength: newimgarr.filter(el => el.checked).length })

  },
  getGoodsList(re){
    if(re){
      app.pageRequest.pageData.pageNum = 0;
      this.setData({
        goods: []
      })
      this.setData({ checkedLength: 0 })
    }
    API.adminGoodsList({
      storeId: wx.getStorageSync('storeId'),
      keyword: this.data.sureSearchText,
      containsImage: true,
      goodsStatus: '1,3'
    }).then(res=>{
      this.setData({ goods: this.data.goods.concat(res.obj.result)})
    })
  },
  sureGoods(){
    let arr = this.data.goods.filter(el=> el.checked)
    if(arr.length == 0){ API.showToast('请选择商品');return}
    let pages = getCurrentPages()
    let prepage = pages[pages.length-2]
    if (prepage && prepage.choseGoods){
      prepage.choseGoods(arr[0])
      wx.navigateBack()
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.getGoodsList(true)
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    this.getGoodsList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})