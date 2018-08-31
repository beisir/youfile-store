let timeId = null;
Page({
  data: {
    history: ["戒指","项链","钻戒"],
    hidden: false,
    result: [
      {
        id: 1,
        thumb: '/image/s5.png',
        title: '周大福 艳丽动人 18K金镶坦桑石 V103235',
        price: 0.01
      },
      {
        id: 2,
        thumb: '/image/s5.png',
        title: '周大福 艳丽动人 18K金镶坦桑石 V103235',
        price: 0.02
      },
      {
        
        id: 1,
        thumb: '/image/s5.png',
        title: '周大福 艳丽动人 18K金镶坦桑石 V103235',
        price: 0.01
      },
      {
        id: 2,
        thumb: '/image/s5.png',
        title: '周大福 艳丽动人 18K金镶坦桑石 V103235',
        price: 0.02
      }
    ],
    value: '',
    showResult: false,
    closeCont:false,
  },
  
  searchInput(e) {
    if (e.detail.value==''){
      this.setData({
        value: e.detail.value,
        hidden: false,
      })
    }else{
      this.setData({
        value: e.detail.value,
        hidden: true,
      })
    }
      
  },
  //搜索确定键
  searchBtn(e) {
    if(this.data.value!=""){
      this.setData({
        closeCont: true
      })
    }
    this.setData({
      showResult: true,
    })
  },
  // 清空input的内容
  emptyInput(e){
    this.setData({
      value:'',
      showResult: false,
      hidden: false,
      closeCont: false
    })
  },
  keywordHandle(e) {
    const text = e.target.dataset.text;
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
  removeAll(){
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
  }
})