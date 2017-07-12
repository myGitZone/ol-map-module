<template>
  <div id="map" :class="[mapScreen?'mapContainer-screen':'mapContainer']">
    <div class="toolbar-wrapper" ref="toolbar" :style="postion">
      <slot name="toolbar"></slot>
      <transition name="fade">
        <div class="toolboard" v-if="currentBoard">
          <component :is="$options.components[currentBoard]" :map="map" v-if="!boardShowPosition">
          </component>
        </div>
      </transition>
    </div>
    <!--<component :style="{height:'500px',width: '200px'}" :is="$options.components[currentBoard]">-->
    <!--</component>-->
    <slot name="overviewMap"></slot>
  </div>
</template>
<script>
  export default {
    name: 'olMap',
    props: {
      viewParams: {
        type: Object
      },
      postion: {
        type: Object,
        default: function () {
          return {
            top: '10px',
            right: '20px'
          }
        }
      },
      toolBarPosition: {}
    },
    data() {
      return {
        mapScreen: false,
        originalSize: [],
        currentBoard: null,
        boardShowPosition: '',
        map: null
      }
    },
    mounted() {
      this.BASE_LAYER = new this.$ol.layer.Tile({
        title: '天地图路网',
        source: new this.$ol.source.XYZ({
          url: 'http://t4.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}'
        })
      })
      this.BASE_LABLE_LAYER = new this.$ol.layer.Tile({
        title: '天地图文字标注',
        source: new this.$ol.source.XYZ({
          url: 'http://t3.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}'
        })
      })
      setTimeout(() => {
        this.map = new this.$ol.Map({
          target: 'map',
          controls: [],
          layers: [this.BASE_LAYER, this.BASE_LABLE_LAYER],
          view: new this.$ol.View(
            this.viewParams
          )
        })
        this.$emit('mapReady', this.map)
        this.originalSize = this.map.getSize()
      }, 20)
    },
    methods: {
      setMapScreen(isScreen) {
        this.mapScreen = isScreen
        this.$nextTick(() => {
          if (isScreen) {
            let height = window.innerHeight
            let width = window.innerWidth
            let size = [width, height]
            this.map.setSize(size)
          } else {
            this.map.setSize(this.originalSize)
          }
        })
      },
      registerComponent(boardVm) {
        this.$options.components[boardVm.name] = boardVm
      },
      showBoard(boardVm) {
        if (boardVm) {
          if (this.currentBoard === boardVm.name) {
            this.currentBoard = ''
          } else {
            this.currentBoard = boardVm.name
          }
        } else {
          this.currentBoard = ''
        }
      }
    }
  }
</script>
<style lang="scss">
  @import "../scss/variable";

  .mapContainer {
    position: absolute;
    top: 0;
    width: 50%;
    height: 100%;
  }

  .mapContainer-screen {
    position: fixed;
    top: 0;
    width: 100%;
    height: 100%;
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s
  }

  .fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */
  {
    opacity: 0
  }

  .toolbar-wrapper {
    position: absolute;
    box-shadow: 0 0 10px $color-tool-bar-shadow;
    background-color: $color-board;
    z-index: 1;
    .toolboard {
      position: absolute;
      background-color: $color-board;
      width: 100%;
      margin-top: 10px;
    }
  }
</style>
