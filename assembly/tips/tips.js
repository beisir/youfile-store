Component({

  /**
   * 组件的属性列表
   */
  properties: {
    //是否显示modal
    show: {
      type: Boolean,
      value: false
    },
    paramAtoB: {
      type: String,//类型
      value: '111'//默认值
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    clickMask() {
      // this.setData({show: false})
    },

    cancel() {
      this.setData({ show: false })
      this.triggerEvent('cancel')
      let pages = getCurrentPages()
      let curPage = pages[pages.length - 1]
      if (curPage.data.showTale){
        curPage.setData({
          showTale: false
        })
      }
    },
    confirm() {
      this.setData({ show: false })
      this.triggerEvent('confirm')
    }
  }
})