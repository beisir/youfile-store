import Api from '../../../utils/api.js'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    globalData: app.globalData,
    data:[],
    zzshoplist: [{
      name: "食品",
      checked: false,
      color: "#fff",
      colorTrue: "#cde6dc"
    }, {
      name: "粮油调味",
      checked: false,
      color: "#fff",
      colorTrue: "#d6cde6"
    }, {
      name: "酒水饮料",
      checked: false,
      color: "#fff",
      colorTrue: "#cddee6"
    }, {
      name: "食化",
      checked: false,
      color: "#fff",
      colorTrue: "#d4e6cd"
    }, {
      name: "文体玩具",
      checked: false,
      color: "#fff",
      colorTrue: "#cde6dc"
    },
    {
      name: "百货",
      checked: false,
      color: "#fff",
      colorTrue: "#d6cde6"
    },
    {
      name: "母婴",
      checked: false,
      color: "#fff",
      colorTrue: "#cddee6"
    },
    {
      name: "家居家纺",
      checked: false,
      color: "#fff",
      colorTrue: "#d4e6cd"
    },
    {
      name: "箱包",
      checked: false,
      color: "#fff",
      colorTrue: "#cde6dc"
    },
    {
      name: "美妆",
      checked: false,
      color: "#fff",
      colorTrue: "#d6cde6"
    },
    {
      name: "电子产品",
      checked: false,
      color: "#fff",
      colorTrue: "#cddee6"
    },
    {
      name: "节庆礼品",
      checked: false,
      color: "#fff",
      colorTrue: "#d4e6cd"
    }
    ],
    bjshoplist: [{
      name: "服饰内衣",
      checked: false,
      color: "#fff",
      colorTrue: "#cde6dc"
    },
    {
      name: "母婴",
      checked: false,
      color: "#fff",
      colorTrue: "#d6cde6"
    },
    {
      name: "鞋类箱包",
      checked: false,
      color: "#fff",
      colorTrue: "#cddee6"
    },
    {
      name: "运动户外",
      checked: false,
      color: "#fff",
      colorTrue: "#d4e6cd"
    },
    {
      name: "珠宝配饰",
      checked: false,
      color: "#fff",
      colorTrue: "#cde6dc"
    },
    {
      name: "化妆品",
      checked: false,
      color: "#fff",
      colorTrue: "#d6cde6"
    },
    {
      name: "家居家纺",
      checked: false,
      color: "#fff",
      colorTrue: "#cddee6"
    },
    {
      name: "日用百货",
      checked: false,
      color: "#fff",
      colorTrue: "#d4e6cd"
    },
    {
      name: "电子产品",
      checked: false,
      color: "#fff",
      colorTrue: "#cde6dc"
    },
    {
      name: "礼品婚庆",
      checked: false,
      color: "#fff",
      colorTrue: "#d6cde6"
    },
    {
      name: "仿真花艺",
      checked: false,
      color: "#fff",
      colorTrue: "#cddee6"
    },
    ],
    name:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var name =options.name,
        arr=[],
        data=[]
    if (options.mallCode == 2000) {
      data = this.data.zzshoplist
    } else {
      data = this.data.bjshoplist
    }   
        
    arr=name.split(",")
    for(var i=0;i<data.length;i++){
      if(arr.indexOf(data[i].name)!=-1){
        data[i].selected=true
      }
    }
    this.setData({
      data: data
    })
  },
  selectedFun:function(e){
    var data=this.data.data,
        index = e.target.dataset.index

    let selectArr = data.filter(el => el.selected)
    if (selectArr.length >= 2 && !data[index].selected) {
      Api.showToast('最多选择两项主营范围')
      return
    }    
    data[index].selected = !data[index].selected
    this.setData({
      data: data
    })
  },
  goback:function(){
    var name=this.data.name,
        data = this.data.data,
        id = Api.getThisStoreId(),
        businessScope=''
    for (var i = 0; i < data.length;i++){
      if(data[i].selected){
        businessScope += data[i].name+","
      }
    }
    businessScope = businessScope.slice(0, -1)
    Api.updateMes({ businessScope: businessScope,id:id})
      .then(res => {
        wx.showToast({
          title: '修改成功',
          icon: 'none',
          duration: 2000,
          success: function () {
            wx.navigateBack()
          }
        })
      })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

})