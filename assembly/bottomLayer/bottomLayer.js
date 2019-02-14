// assembly/bottomLayer.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    bottomLayer: true
  },

  /**
   * 组件的方法列表
   */
  methods: {
    open(){
      this.setData({
        bottomLayer: false
      })
    },
    close(){
      this.setData({
        bottomLayer: true
      })
    },
    sure(){
      let pages = getCurrentPages();
      let curPage = pages[pages.length - 1];
      if (curPage.sureBottomLayer){
        curPage.sureBottomLayer();
      }
      this.setData({
        bottomLayer: true
      })
    }
  }
})
