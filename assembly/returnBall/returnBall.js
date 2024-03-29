// assembly/returnBall/returnBall.js
const app = getApp();
Component({

  /**
   * 页面的初始数据
   */
  data: {
    x: app.globalData.returnBall.x,
    y: app.globalData.returnBall.y,
    movableBlo: app.globalData.returnBall.show,
    animate: false,
    topcount: 0
  },
  methods: {
    change(e) {
      let screenWidth = this.data.screenWidth,
        screenHeight = this.data.screenHeight;
      let x = e.detail.x
      let y = e.detail.y
      if (x > screenWidth - 250 && y > screenHeight - 250) {
        this.setData({
          alreadyClose: true
        })
      } else {
        this.setData({
          alreadyClose: false
        })
      }
    },
    returnMini() {
      app.navigate.returnBack()
    },
    touchStart() {
      this.setData({
        closeArea: true
      })
    },
    end(e) {
      let screenWidth = this.data.screenWidth,
        screenHeight = this.data.screenHeight,
        x = e.changedTouches[0].pageX,
        y = e.changedTouches[0].pageY;
      if (x > screenWidth - 100 && y > screenHeight - 100) {
        app.globalData.returnBall.show = false
        this.setData({
          movableBlo: false
        })
      }
      setTimeout(() => {
        app.globalData.returnBall.x = screenWidth;
        app.globalData.returnBall.y = y;
        this.setData({
          animate: true,
          x: screenWidth,
          y,
          closeArea: false
        })
      }, 300)
    },
    scrollPage(e) {
      let pages = getCurrentPages();
      let curPage = pages[pages.length - 1];
      if (curPage.myPageScroll) {
        curPage.myPageScroll(e)
      }
    },
    toBottom() {
      let pages = getCurrentPages();
      let curPage = pages[pages.length - 1];
      if (curPage.toBottom) {
        curPage.toBottom()
      }
    },
    toTop(){
      this.setData({
        topcount: 1
      })
      let pages = getCurrentPages();
      let curPage = pages[pages.length - 1];
      if (curPage.toPageTop) {
        curPage.toPageTop()
      }
    }
  },
  pageLifetimes: {
    show() {
      this.setData({
        x: app.globalData.returnBall.x,
        y: app.globalData.returnBall.y,
        movableBlo: app.globalData.returnBall.show,
        animate: false
      })
      this.setData({
        screenWidth: wx.getSystemInfoSync().windowWidth,
        screenHeight: wx.getSystemInfoSync().windowHeight
      })
    },
  }
})