const app = getApp();
Page({
  data: {
    history: ["戒指", "项链", "钻戒"],
    hidden: false,
    result: [],
    value: '',
    showResult: false,
    closeCont: false,
  },

  searchInput(e) {
    if (e.detail.value == '') {
      this.setData({
        value: e.detail.value,
        hidden: false,
      })
    } else {
      this.setData({
        value: e.detail.value,
        hidden: true,
      })
    }

  },
  //搜索确定键
  getList:function(){
    var keyword = this.data.value,
      _this = this
    app.pageRequest.pageGet('/admin/shop/store/{{storeId}}/goods',{ keyword: keyword})
      .then(res => {
        var obj = res.obj.result,
          datas = _this.data.result,
          newArr = app.pageRequest.addDataList(datas, obj)
        if (newArr.length > 0) {
          _this.setData({
            showResult: true,
          })
        }
        _this.setData({
          result: newArr,
        })
      })
  },
  searchBtn(e) {
    this.getList()
  },
  // 清空input的内容
  emptyInput(e) {
    this.setData({
      value: '',
      showResult: false,
      hidden: false,
      closeCont: false
    })
  },
  keywordHandle(e) {
    console.log(e.target.dataset)
    const text = e.target.dataset.name;
    this.setData({
      value: text,
      showResult: true
    })
    this.historyHandle(text);
  },
  historyHandle(value) {
    let history = this.data.history;
    const idx = history.indexOf(value);
    if (idx === -1) {
      // 搜索记录只保留8个
      if (history.length > 7) {
        history.pop();
      }
    } else {
      history.splice(idx, 1);
    }
    history.unshift(value);
    wx.setStorageSync('history', JSON.stringify(history));
    this.setData({
      history
    });
  },
  removeAll() {
    this.setData({
      history: []
    });
  },
  onLoad() {
    const history = wx.getStorageSync('history');
    if (history) {
      this.setData({
        history: JSON.parse(history)
      })
      console.log(this.data.history);
    }
    var _this = this
    _this.getList()
    wx.getSystemInfo({
      success: function (res) {
        _this.setData({
          scrollHeight: res.windowHeight
        });
      }
    });
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    app.pageRequest.pageData.pageNum = 0
    this.getList()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
      this.getList()
  }
})