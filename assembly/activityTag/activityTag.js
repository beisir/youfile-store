const app = getApp(app)
Component({

  /**
   * 组件的属性列表
   */
  properties: {
    extInfo: {
      type: JSON, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: '123', // 属性初始值（可选），如果未指定则会根据类型选择一个
      observer: function (newVal, oldVal, changedPath) {
        // var promotionShowLogo = newVal.promotionShowLogo
        // newVal = app.globalData.imageUrl + promotionShowLogo
        // console.log(newVal)
        // 属性被改变时执行的函数（可选），也可以写成在methods段中定义的方法名字符串, 如：'_propertyChange'
        // 通常 newVal 就是新设置的数据， oldVal 是旧数据
      }
    },
    left: {
      type: Number,
      value: 20
    },
    top: {
      type: Number,
      value: 0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    baseUrl:app.globalData.imageUrl
  },

  /**
   * 组件的方法列表
   */
  methods: {
   
  }
})