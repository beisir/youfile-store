// distribution/assembly/sideMenu/sideMenu.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },
  lifetimes: {
    attached: function (){
      var animation = wx.createAnimation({
        duration: 600,
        timingFunction: 'ease',
      })
      this.animation = animation
    
      
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    animationData: {},
    show: true
  },

  /**
   * 组件的方法列表
   */
  methods: {
    stopScroll() { return },
    show(){
      console.log(1111)
      this.setData({
        show: false,
        animationData: this.animation.right(0).step().export()
      })
    },
    hide(){
      this.setData({
        show: true,
        animationData: this.animation.right('-650rpx').step().export()
      })
    }
  }
})
