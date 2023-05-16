<template>
  <canvas
    v-if="canvasId"
    :type="forceUseOldCanvas ? '' : '2d'"
    class="ec-canvas"
    :id="canvasId"
    :canvasId="canvasId"
    @touchstart="touchStart"
    @touchmove="touchMove"
    @touchend="touchEnd"
  >
  </canvas>
</template>
 
<script>
import WxCanvas2 from './wx-canvas2'
import WxCanvas from './wx-canvas'
import * as echarts from "../../../utils/echarts.min.js";  //这里根据自己存放的路径修改

// import * as echarts from './echarts.min.js'
function compareVersion (v1s, v2s) {
  const v1 = v1s.split('.')
  const v2 = v2s.split('.')
  const len = Math.max(v1.length, v2.length)
 
  while (v1.length < len) {
    v1.push('0')
  }
  while (v2.length < len) {
    v2.push('0')
  }
 
  for (let i = 0; i < len; i += 1) {
    const num1 = parseInt(v1[i])
    const num2 = parseInt(v2[i])
 
    if (num1 > num2) {
      return 1
    } else if (num1 < num2) {
      return -1
    }
  }
  return 0
}
export default {
  props: {
    // echarts: {
    //   required: true,
    //   type: Object,
    //   default () {
    //     return null
    //   }
    // },
    forceUseOldCanvas: {
      type: Boolean,
      default: false
    },
    canvasId: {
      type: String,
      default: 'ec-canvas'
    },
    onInit: {
      type: Function,
      default: null
    },
    lazyLoad: {
      type: Boolean,
      default: false
    },
    disableTouch: {
      type: Boolean,
      default: false
    },
    throttleTouch: {
      type: Boolean,
      default: false
    }
  },
 
  // onReady () {
  //   if (!echarts) {
  //     console.warn('组件需echarts 变量')
  //     return
  //   }
 
  //   if (!this.lazyLoad) {
  //     this.init()
  //   }
  // },
  // #ifdef H5
  mounted () {
    if (!this.lazyLoad) this.init()
  },
  // #endif
  // #ifndef H5
  onReady () {
    if (!this.lazyLoad) this.init()
  },
  // #endif
  methods: {
    init (callback) {
      const version = wx.getSystemInfoSync().SDKVersion
 
      const canUseNewCanvas = compareVersion(version, '2.9.0') >= 0
      this.isUseNewCanvas = canUseNewCanvas && !this.forceUseOldCanvas
 
      if (this.forceUseOldCanvas && canUseNewCanvas) {
        console.warn('开发者强制使用旧canvas,建议关闭')
      }
 
      if (this.isUseNewCanvas) {
        this.initByNewWay(callback)
      } else {
        const isValid = compareVersion(version, '1.9.91') >= 0
        if (!isValid) {
          console.error(
            '微信基础库版本过低，需大于等于 1.9.91。' +
              '参见：https://github.com/ecomfe/echarts-for-weixin' +
              '#%E5%BE%AE%E4%BF%A1%E7%89%88%E6%9C%AC%E8%A6%81%E6%B1%82'
          )
        } else {
          console.warn(
            '建议将微信基础库调整大于等于2.9.0版本。升级后绘图将有更好性能'
          )
          this.initByOldWay(callback)
        }
      }
    },
    setChart (chart) {
      this.chart = chart
    },
    initByNewWay (callback) {

      // version >= 2.9.0：使用新的方式初始化
      const { canvasId } = this
      const query = wx.createSelectorQuery().in(this)
      query
        .select(`#${canvasId}`)
        .fields({ node: true, size: true })
        .exec(res => {
          if (!res) {
            setTimeout(() => this.init(), 50)
            return
          }
          const canvasNode = res[0].node
          this.canvasNode = canvasNode
 
          const canvasDpr = wx.getSystemInfoSync().pixelRatio
          // const canvasWidth = res[0].width
          // const canvasHeight = res[0].height
 
          const ctx = canvasNode.getContext('2d')
 
          this.canvas = new WxCanvas2(ctx, canvasId, true, canvasNode)
          echarts.setCanvasCreator(() => this.canvas)
          setTimeout(() => {
            this.$emit('onInit', {
              canvas:this.canvas,
              width: res[0].width,
              height: res[0].height,
              canvasDpr
            })
          }, 50)
          // if (typeof callback === 'function') {
          //   this.chart = callback(canvas, canvasWidth, canvasHeight, canvasDpr)
          // } else if (typeof this.onInit === 'function') {
          //   this.chart = this.onInit(
          //     canvas,
          //     canvasWidth,
          //     canvasHeight,
          //     canvasDpr
          //   )
          // } else {
          //   this.triggerEvent('init', {
          //     canvas,
          //     width: canvasWidth,
          //     height: canvasHeight,
          //     dpr: canvasDpr
          //   })
          // }
        })
    },
    initByOldWay (callback) {
      const { canvasId } = this
      this.ctx = wx.createCanvasContext(canvasId, this)
      this.canvas = new WxCanvas(this.ctx, canvasId)
      const query = wx.createSelectorQuery().in(this)
      query
        .select(`#${canvasId}`)
        .boundingClientRect(res => {
          if (!res) {
            setTimeout(() => this.init(), 50)
            return
          }
          this.$emit('onInit', {
            width: res.width,
            height: res.height
          })
        })
        .exec()
    },
    touchStart (e) {
      const { disableTouch, chart } = this
      if (disableTouch || !chart || !e.mp.touches.length) return
      const touch = e.mp.touches[0]
      chart._zr.handler.dispatch('mousedown', {
        zrX: touch.x,
        zrY: touch.y
      })
      chart._zr.handler.dispatch('mousemove', {
        zrX: touch.x,
        zrY: touch.y
      })
    },
    touchMove (e) {
      const { disableTouch, throttleTouch, chart, lastMoveTime } = this
      if (disableTouch || !chart || !e.mp.touches.length) return
      if (throttleTouch) {
        const currMoveTime = Date.now()
        if (currMoveTime - lastMoveTime < 240) return
        this.lastMoveTime = currMoveTime
      }
      const touch = e.mp.touches[0]
      chart._zr.handler.dispatch('mousemove', {
        zrX: touch.x,
        zrY: touch.y
      })
    },
    touchEnd (e) {
      const { disableTouch, chart } = this
      if (disableTouch || !chart) return
      const touch = e.mp.changedTouches ? e.mp.changedTouches[0] : {}
      chart._zr.handler.dispatch('mouseup', {
        zrX: touch.x,
        zrY: touch.y
      })
      chart._zr.handler.dispatch('click', {
        zrX: touch.x,
        zrY: touch.y
      })
    }
  }
}
</script>
 
<style scoped>
.ec-canvas {
  width: 100%;
  height: 100%;
}
</style>