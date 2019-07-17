// distribution/pages/warehouse/createPart/createPart.js
import Api from '../../../../utils/api.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    formData: {
      defaultFlag: false
    },
    selectedTag:[]
  },
  toTip(){
    let arr = []
    wx.navigateTo({
      url: '../partTags/partTags?tag=' + JSON.stringify(this.data.selectedTag),
    })
  },
  switchChange(e){
    this.setData({
      ['formData.defaultFlag']: e.detail.value
    })
  },
  watchinput(e) {
    let type = e.currentTarget.dataset.type,
      obj = {},
      val = e.detail.value

    this.setData({
      ['formData.' + type]: val
    })
  },
  submit() {
    let data = this.data.formData
    if (!data.name) {
      Api.showToast("请填写库区名称")
      return
    } 
    data.regionTypeCodeSet = []
    this.data.selectedTag.forEach(el=>{
      data.regionTypeCodeSet.push(el.code)
    })
    if(this.data.pageType === 'edit'){
      data.code = this.data.partcode
      Api.updateHousePart(data).then(res=>{
        Api.showToast(res.message, () => {
          wx.navigateBack()
        })
      })
    }else{
      data.warehouseCode = this.data.code
      Api.createHousePart(data).then(res => {
        Api.showToast(res.message, () => {
          wx.navigateBack()
        })
      })
    }
  },
  // 编辑获取分区数据回填
  getPartDetail(){
    Api.getHousePartMsg({ code: this.data.partcode}).then(res=>{
      let obj = res.obj
      let formData = {}
      formData.name = obj.name
      formData.no = obj.no
      formData.defaultFlag = obj.defaultFlag
      formData.remark = obj.remark
      this.setData({
        selectedTag: res.obj.regionTypeList,
        name: obj.warehouse.name,
        code: obj.warehouse.code,
        formData
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if(options.type==='edit'){
      wx.setNavigationBarTitle({
        title: '编辑库区',
      })
      this.setData({
        pageType: 'edit',
        partcode: options.code
      },()=>{
        this.getPartDetail()
      })
    }else{
      wx.setNavigationBarTitle({
        title: '新建库区',
      })
      this.setData({
        name: options.name,
        code: options.code
      })
    }
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

  }
})