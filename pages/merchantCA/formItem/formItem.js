// pages/merchantCA/formItem/formItem.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    item: {
      type:Object,
      value: {}
    },
    index: {
      type: String,
      value: ''
    },
    noborder:{
      type: Boolean,
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
    pickerChange(e) {
      this.triggerEvent('pickerChange', e)
    },
    watchInput(e) {
      this.triggerEvent('watchInput', e)
    },
  }
})
