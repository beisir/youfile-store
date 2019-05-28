// pages/merchantCA/formItem/formItem.js
import Api from '../../../utils/api.js'
const app = getApp()
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
    baseUrl: app.globalData.imageUrlSafe
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
    clickEvent(e){
      this.triggerEvent('clickItem', {e,item:this.data.item})
    },
    uploadImg(e){
      Api.uploadImage('MERCHANT_QUALIFICATION').then(res=>{
        var url = JSON.parse(res).obj
        this.triggerEvent('uploadImg', {url:url,index:this.data.index})
        console.log(url)
      })
    }
  }
})
