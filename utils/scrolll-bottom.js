
/**
 * @author huanghuaqin
 * 用于滚动到底触发加载
 */
export const options = {
  mounted: function (el, { value }) {
    let callBack = typeof value === 'function' ? value : value.callBack
    if( typeof callBack !== 'function'){
      console.warn('This directive needs a callback function')
      return 
    }

    let element = (typeof value === 'object' && value.el) || el
    if(!(element instanceof HTMLElement)){
      element = el.querySelector(element)
    }
    // 阈值
    let threshold = (typeof value === 'object' && value.threshold) || 150
    
    let scrollCallBack = (function () {
      let isLoading = false
      return function (e) {
        let { scrollHeight, clientHeight, scrollTop } = e.target

        if(isLoading || scrollHeight===clientHeight || scrollHeight - (clientHeight + scrollTop) > threshold ){
          return 
        }
        isLoading = true
        callBack(() => isLoading = false )
      }
    })()
    element.addEventListener('scroll', scrollCallBack)
    el.__VueScrollCallBack = scrollCallBack
  },
  unmounted(el, {value}){
    let element = (typeof value === 'object' && value.el) || el
    if(!(element instanceof HTMLElement)){
      element = el.querySelector(element)
    }
    element.removeEventListener('scroll', el.__VueScrollCallBack)
    
  }
 
}
// 兼容vue2
options.inserted=options.mounted
options.unbind=options.unmounted
export default {
  install:function (Vue) {
    Vue.directive('scroll-bottom', options) 
  }
}