// pages/floor/choseAdmin/choseAdmin.js
import Api from '../../../../utils/api.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    code: "",
    ballList: [
      "#22d8bc",
      "#18c0a5",
      "#2ccddb",
      "#2dbdff",
      "#4e8bfa",
      "#7076fb",
      "#9573fe",
      "#c572ef",
      "#f07edf",
      "#fa69ab",
      "#fd587d",
      "#fb5a55",
      "#ff7747",
      "#ffa515",
      "#ffd334",
      "#9ad85a",
      "#66c160",
      "#39bb5d"
    ],
    background: "#22d8bc",
    whitch: 0,
    inputValue: ""
  },
  chose(e) {
    this.setData({
      background: e.currentTarget.dataset.color,
      whitch: e.currentTarget.dataset.index
    })
  },
  create() {
    if (this.data.inputValue.trim() == "") {
      Api.showToast("请填写库区类型名称")
      return
    }
    Api.createHousePartTag({
      iconColor: this.data.background,
      name: this.data.inputValue
    }).then(res=>{ 
      Api.showToast(res.message)
      setTimeout(()=>{
        wx.navigateBack()
      },800)
    })
    // app.http.postRequest("/admin/floor/malltag/save", {
    //   "mallCode": app.http.mallCode,
    //   "tagColor": this.data.background,
    //   "tagName": this.data.inputValue
    // }).then((res) => {
    //   wx.showToast({
    //     title: res.message,
    //     icon: 'none'
    //   })
    //   setTimeout(() => {
    //     wx.navigateBack()
    //   }, 800)
    // })

  },
  getVal(e) {
    this.setData({
      inputValue: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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



})