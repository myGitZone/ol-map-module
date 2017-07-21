<template>
  <div class="maptype-container" :style="position">
    <ul>
      <li class="mapTypeCard active" :class="firstType.class" @click="changeMapType(0)">
        <span>{{firstType.name}}</span>
      </li>
      <li class="mapTypeCard" :class="secondType.class" @click="changeMapType(1)">
        <span>{{secondType.name}}</span>
      </li>
      <li class="mapTypeCard" :class="thirdType.class" @click="changeMapType(2)">
        <span>{{thirdType.name}}</span>
      </li>
    </ul>
  </div>
</template>
<script>
  import {getBaseLayers} from '../js/util'
  export default {
    name: 'mapType',
    data() {
      return {
        firstType: {
          class: 'normal',
          name: '矢量'
        },
        secondType: {
          class: 'earch',
          name: '地形'
        },
        thirdType: {
          class: 'terrain',
          name: '影像'
        }
      }
    },
    props: {
      map: {
        type: Object,
        required: true
      },
      position: {
        type: Object,
        default: function () {
          return {
            left: '10px',
            top: '30px'
          }
        }
      }
    },
    methods: {
      changeMapType(index) {
        // 记录当前选中的类型
        let currentTypeName = null
        let tempObj = null
        switch (index) {
          case 0:
            return
          case 1:
            currentTypeName = this.secondType.class
            tempObj = this.firstType
            this.firstType = this.secondType
            this.secondType = tempObj
            break
          case 2:
            currentTypeName = this.thirdType.class
            tempObj = this.firstType
            this.firstType = this.thirdType
            this.thirdType = tempObj
            break
          default:
            return
        }
        let layers = this.map.getLayers().getArray()
        for (let i = 0; i < layers.length; i++) {
          let layer = layers[i]
          let params = layer.getProperties()
          if (params.title != null) {
            if (params.title === 'baseMap' || params.title === 'baseMapLable') {
              this.map.removeLayer(layer)
            }
          }
        }
        let {BASE_LAYER, BASE_LABLE_LAYER} = getBaseLayers(currentTypeName, this.$ol, this.map.getView().getProjection())
        this.map.addLayer(BASE_LAYER)
        this.map.addLayer(BASE_LABLE_LAYER)
        this.$emit('layerChange', {BASE_LAYER, BASE_LABLE_LAYER})
      }
    }
  }
</script>
<style lang="scss" scoped>
  .maptype-container {
    position: absolute;
    box-shadow: 0 0 10px #666;
    z-index: 1;
    ul {
      position: relative;
      overflow: auto;
      padding: 5px;
      margin: 0;
      background-color: rgba(140, 140, 140, 0.3);
      &:hover {
        .mapTypeCard {
          width: 80px;
          margin-right: 10px;
          background-size: 100% 100%;
          span {
            display: inline
          }
        }
      }
      .mapTypeCard {
        position: relative;
        height: 60px;
        width: 10px;
        float: left;
        background-size: 100% 100% !important;
        cursor: pointer;
        transition: width 0.2s ease-out;
        list-style-type: none;
        text-align: right;
        span {
          background-color: #3385FF;
          display: none;
        }
      }
      .active {
        width: 80px;
        span {
          display: inline;
        }
      }
      .normal {
        background: #999 url('../image/map/maptype/shiliang.png') no-repeat;
      }
      .earch {
        background: #999 url('../image/map/maptype/dixing.png') no-repeat;
      }
      .terrain {
        background: #999 url('../image/map/maptype/yingxiang.png') no-repeat;
      }
    }
  }
</style>
