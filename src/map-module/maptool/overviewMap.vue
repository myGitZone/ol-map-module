<template>
  <div :style="location" id="overview-container"></div>
</template>
<script>
  import {LOCATION_LEFT, LOCATION_RIGHT} from '../enum/enum'
  export default {
    name: 'OverviewMap',
    props: {
      layers: {
        type: Array,
        default: []
      },
      map: {
        type: Object,
        required: true
      },
      position: {
        type: String,
        default: 'left'
      },
      location: {
        type: Object,
        default: function () {
          return {
            right: '10px',
            bottom: '10px'
          }
        }
      }
    },
    mounted() {
      this.init(this.map, this.layers)
    },
    methods: {
      /**
       * 初始化组件
       * */
      init(map, layers) {
        let className
        let collapseLabel
        let label
        // 判断组件的位置，来决定收缩的方向
        if (this.position === LOCATION_LEFT) {
          className = 'ol-overviewmap ol-custom-overviewmap ol-custom-overviewmap-left'
          collapseLabel = '\u00AB'
          label = '\u00BB'
        } else if (this.position === LOCATION_RIGHT) {
          className = 'ol-overviewmap ol-custom-overviewmap ol-custom-overviewmap-right'
          collapseLabel = '\u00BB'
          label = '\u00AB'
        }
        this.overviewMapControl = new this.$ol.control.OverviewMap({
          className: className,
          layers: layers,
          collapseLabel: collapseLabel,
          label: label,
          collapsed: false,
          target: 'overview-container'
        })
        map.addControl(this.overviewMapControl)
      },
      // 外部调用，来修改鹰眼的图层
      setLayers(layers) {
        let map = this.overviewMapControl.getOverviewMap()
        let currentLayers = map.getLayers()
        currentLayers.getArray().forEach((val, index) => {
          map.removeLayer(val)
        })
        let type = this.getType(layers)
        if (type === '[object Object]') {
          map.addLayer(layers)
        } else if (type === '[object Array]') {
          layers.forEach((val, index) => {
            map.addLayer(val)
          })
        }
      },
      // 获取类型
      getType(layers) {
        return Object.prototype.toString.call(layers)
      }
    }
  }
</script>
<style lang="scss">
  @import "../scss/variable.scss";

  #overview-container {
    position: absolute;
    width: 300px;
    height: 150px;
    z-index: 9999;
  }

  /*//鹰眼样式  */

  .ol-custom-overviewmap-left,
  .ol-custom-overviewmap-left.ol-uncollapsible {
    bottom: 0;
    right: auto;
    left: 0;
    top: auto;
  }

  .ol-custom-overviewmap-left:not(.ol-collapsed) button {
    bottom: auto;
    left: auto;
    right: 1px;
    top: 1px;
  }

  /*//鹰眼样式  */

  .ol-custom-overviewmap-right,
  .ol-custom-overviewmap-right.ol-uncollapsible {
    bottom: 0;
    left: auto;
    right: 0;
    top: auto;
  }

  .ol-custom-overviewmap-right:not(.ol-collapsed) button {
    bottom: auto;
    right: auto;
    left: 1px;
    top: 1px;
  }

  /*//鹰眼控件展开时控件外框的样式  */

  .ol-custom-overviewmap:not(.ol-collapsed) {
    border: 1px solid black;
  }

  /*//鹰眼控件中地图容器的样式  */

  .ol-custom-overviewmap .ol-overviewmap-map {
    border: none;
    width: 300px;
  }

  /*//鹰眼控件中显示当前窗口中主区域的边框  */

  .ol-custom-overviewmap .ol-overviewmap-box {
    border: 2px solid red;
  }

  /*//鹰眼控件展开时其控件的按钮图标  */


</style>
