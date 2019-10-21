// assembly/goodsRangeLayer.js
import Api from '../../utils/api.js'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
   
  },

  /**
   * 组件的初始数据
   */
  data: {
    shoplist: [{
      name: "食品",
      color: "#fff",
      colorTrue: "#cde6dc"
    }, {
      name: "粮油调味",
      color: "#fff",
      colorTrue: "#d6cde6"
    }, {
      name: "酒水饮料",
      color: "#fff",
      colorTrue: "#cddee6"
    }, {
      name: "食化",
      color: "#fff",
      colorTrue: "#d4e6cd"
    }, {
      name: "文体玩具",
      color: "#fff",
      colorTrue: "#cde6dc"
    },
    {
      name: "百货",
      color: "#fff",
      colorTrue: "#d6cde6"
    },
    {
      name: "母婴",
      color: "#fff",
      colorTrue: "#cddee6"
    },
    {
      name: "家居家纺",
      color: "#fff",
      colorTrue: "#d4e6cd"
    },
    {
      name: "箱包",
      color: "#fff",
      colorTrue: "#cde6dc"
    },
    {
      name: "美妆",
      color: "#fff",
      colorTrue: "#d6cde6"
    },
    {
      name: "电子产品",
      color: "#fff",
      colorTrue: "#cddee6"
    },
    {
      name: "节庆礼品",
      color: "#fff",
      colorTrue: "#d4e6cd"
    }
    ],
    bjshoplist: [{
      name: "服饰内衣",
      color: "#fff",
      colorTrue: "#cde6dc"
    },
    {
      name: "母婴",
      color: "#fff",
      colorTrue: "#d6cde6"
    },
    {
      name: "鞋类箱包",
      color: "#fff",
      colorTrue: "#cddee6"
    },
    {
      name: "运动户外",
      color: "#fff",
      colorTrue: "#d4e6cd"
    },
    {
      name: "珠宝配饰",
      color: "#fff",
      colorTrue: "#cde6dc"
    },
    {
      name: "化妆品",
      color: "#fff",
      colorTrue: "#d6cde6"
    },
    {
      name: "家居家纺",
      color: "#fff",
      colorTrue: "#cddee6"
    },
    {
      name: "日用百货",
      color: "#fff",
      colorTrue: "#d4e6cd"
    },
    {
      name: "电子产品",
      color: "#fff",
      colorTrue: "#cde6dc"
    },
    {
      name: "礼品婚庆",
      color: "#fff",
      colorTrue: "#d6cde6"
    },
    {
      name: "仿真花艺",
      color: "#fff",
      colorTrue: "#cddee6"
    },
    ],
  },
  /**
   * 组件的方法列表
   */
  methods: {
    showBottom() {
      this.selectComponent("#bottom").open()
    },
    hideBottom() {
      this.selectComponent("#bottom").close()
    },
    setChecked(str){
      console.log(str)
    },
    selectedFun: function (e) {
      var data = this.data.shoplist,
        index = e.target.dataset.index,
        namearr = []

      let selectArr = data.filter(el => el.selected)
      if (selectArr.length >= 2 && !data[index].selected) {
        Api.showToast('最多选择两项主营范围')
        return
      }
      data[index].selected = !data[index].selected

      data.filter(el => el.selected).forEach(el => {
        namearr.push(el.name)
      })
      this.setData({
        shoplist: data,
        businessScope: namearr.join()
      },()=>{
        let pages = getCurrentPages();
        let curPage = pages[pages.length - 1];
        if (curPage.get_GoodsRange) {
          curPage.get_GoodsRange(namearr.join(), data);
        }
      })
    },
  }
})
