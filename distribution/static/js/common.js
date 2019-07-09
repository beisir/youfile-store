function tabSelceted(thisindex, arr, key, that){
  arr.forEach((el,index)=> {
    el.selected = false
    if (thisindex === index) {
      el.selected = true
    }
  })
  if(key) {
    that.setData({
      [key]: arr
    })
  } else {
    return arr
  }
} 

module.exports = {
  tabSelceted
}