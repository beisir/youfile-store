// pages/poster/goodsList/goodsList.js
import API from '../../../../utils/api.js'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    checkedLength: 0,
    goods: [{
        name: '周大福 赵丽颖赵丽颖陪伴款颖火虫赵丽颖陪伴款颖火虫陪伴款颖火虫',
        checked: false,
        img: [{
          checked: false
        }, {
          checked: false
        }, {
          checked: false
        }, {
          checked: false
        }, {
          checked: false
        }, {
          checked: false
        }],
        id: 1
      },
      {
        name: '周大福 赵丽颖赵丽颖陪伴款颖火虫赵丽颖陪伴款颖火虫陪伴款颖火虫',
        checked: false,
        img: [{
          checked: false
        }, {
          checked: false
        }, {
          checked: false
        }],
        id: 2
      }
    ],
    searchText: ""
  },
  searchInput(e){
    let val = e.detail.value
    this.setData({ searchText: val})
  },
  search(){
    
  },
  checkedGoods(e) {
    let arr = this.data.goods,
      thisItem = e.currentTarget.dataset.item;
    arr.forEach(el => {
      if (el.id === thisItem.id) {
        if(!el.checked){
          // 未选
          el.checked = true
          // el.img[0].checked = true
          this.setData({
            nowChecked: el
          })
          this.setData({ checkedLength: 1})
        }
      } else {
        el.checked = false
        // el.img.forEach(ii => {
        //   ii.checked = false
        // })
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
    let imgarr = this.data.goods[goodsindex].img;

    const checkedarr = imgarr.filter(el => el.checked)
    if (checkedarr.length == 1 && imgarr[imgindex].checked == true){
      return
    }
    this.setData({
      ['goods[' + goodsindex + '].img[' + imgindex + '].checked']: !item.checked
    })
    // 选择数
    let newimgarr = this.data.goods[goodsindex].img;
    this.setData({ checkedLength: newimgarr.filter(el => el.checked).length })

  },
  getGoodsList(){
    API.shopList({
      keyword: '',
      sortType: 'multiple'
    }).then(res=>{
      this.setData({ goods: res.obj.result})
    })
  },
  sureGoods(){
    let arr = this.data.goods.filter(el=> el.checked)
    if(arr.length == 0){ API.showToast('请选择商品');return}
    let pages = getCurrentPages()
    let prepage = pages[pages.length-2]
    prepage && prepage.choseGoods ? prepage.choseGoods(arr[0]):''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    app.pageRequest.pageDataIndex.pageNum =0
    this.getGoodsList()
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})