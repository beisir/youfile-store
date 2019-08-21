const loginApp = getApp();
import API from '../../../utils/api.js';
Component({
  properties: {
    innerText: {
      type: String
    }
  },
  data: {
    globalData: loginApp.globalData,
  },
  methods: {
    returnMall() {
      loginApp.navigate.toMall()
    }
  }
})
