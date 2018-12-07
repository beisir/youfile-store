Component({
  properties: {
    // 这里定义了innerText属性，属性值可以在组件使用时指定
    innerText: {
      type: String,
      value: 'default value',
    }
  },
  data: {
    modal: false
  },
  methods: {
    close() {
      this.setData({
        modal: false
      })
    },
    open(obj){
      console.log(obj)
      this.setData({
        modal: true
      })
    }
  }
})
