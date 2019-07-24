// pages/supplier/createSupplier/createSupplier.js
import Api from '../../../../utils/api.js'
import { regTest } from '../../../../utils/util.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    formData: {},
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

    data.filter(el => el.selected).forEach(el=>{
      namearr.push(el.name)
    })
    this.setData({
      shoplist: data,
      businessScope: namearr.join()
    })
  },
  showBottom(){
    this.selectComponent("#bottom").open()
  },
  hideBottom(){
    this.selectComponent("#bottom").close()
  },
  watchinput(e) {
    let type = e.currentTarget.dataset.type,
      val = e.detail.value
    this.setData({
      ['formData.' + type]: val
    })
  },
  areachange(e) {
    console.log(e.detail.value)
    this.setData({
      showarea: e.detail.value[0] + "," + e.detail.value[1] + "," + e.detail.value[2]
    })
  },

  submit() {
    let data = this.data.formData
    if (!data.name) {
      Api.showToast("请填写供应商名称")
      return
    }
    if (data.principalPhone && !regTest({
      type: 'telephone',
      str: data.principalPhone
    })) {
      Api.showToast("请填写负责人联系人手机号")
      return
    }
    if (data.linkmanPhone && !regTest({
        type: 'telephone',
        str: data.linkmanPhone
      })) {
      Api.showToast("请填写正确的联系人手机号")
      return
    }

    if (data.email && !regTest({
        type: 'email',
        str: data.email
      })) {
      Api.showToast("请填写正确的邮箱")
      return
    }

    if (this.data.showarea) {
      let areaArr = this.data.showarea.split(',')
      data.province = areaArr[0]
      data.city = areaArr[1]
      data.county = areaArr[2]
    }
    if (this.data.businessScope){
      data.businessScope = this.data.businessScope
    }
    if (this.data.pageType === 'edit') {
      data.code = this.data.code
      Api.updateSupplier(data).then(res => {
        Api.showToast(res.message, () => {
          wx.navigateBack()
        })
      })
    } else {
      Api.createSupplier(data).then(res => {
        Api.showToast(res.message)
        setTimeout(() => {
          wx.navigateBack()
        }, 800)
      })
    }

  },
  // 编辑获取详情数据回填
  getDeatail() {
    Api.getSupplierMsg({
      code: this.data.code
    }).then(res => {
      let obj = res.obj,
        formData = {}
      for (let key in obj) {
        if (!obj[key]) {
          obj[key] = ''
        }
      }
      formData.name = obj.name
      formData.no = obj.no
      formData.manager = obj.manager
      formData.phone = obj.phone
      formData.address = obj.address
      formData.email = obj.email
      formData.remark = obj.remark
      this.setData({
        formData
      })
      if (obj.province) {
        this.setData({
          showarea: obj.province + "," + obj.city + "," + obj.county
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})