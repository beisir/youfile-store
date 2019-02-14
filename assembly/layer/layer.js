// assembly/layer/layer.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: String,
      value: "您好"
    },
    show:{
      type:Boolean,
      value: false
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
    open(){
      this.setData({
        show:true
      })
    },
    close(){
      this.setData({
        show: false
      })
    }
  }
})
