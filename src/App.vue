<template>
  <ol-map @mapReady="mapLoad" :viewParams="view">
    <OverviewMap ref="viewMap" position="left" slot="overviewMap" :map="map" :layers="layers"
                 v-if="map"></OverviewMap>
    <tool-bar slot="toolbar" :viewParams="view" :map="map" v-if="map"></tool-bar>
    <map-type slot="mapType" :map="map" v-if="map" @layerChange="layerChange"></map-type>
  </ol-map>
</template>

<script>
  //  import OlMap from './map-module/map/ol-map.vue'
  //  import OverviewMap from './map-module/maptool/overviewMap.vue'
  //  import ToolBar from './map-module/maptool/toolbar'
  import {getBaseLayers} from './map-module/js/util'
  const VIEW_PARAMS = {
    center: [11500000, 4000000],
    zoom: 6
  }
  export default {
    name: 'app',
    data() {
      return {
        layers: [],
        map: null,
        location: {
          top: '10px',
          left: '10px'
        },
        view: VIEW_PARAMS
      }
    },
    mounted() {
      let layerType = 'normal'
      let {BASE_LAYER} = getBaseLayers(layerType, this.$ol)
      this.layers = [BASE_LAYER]
    },
    methods: {
      mapLoad(map) {
        this.map = map
      },
      layerChange(layers) {
        this.$refs.viewMap.setLayers(layers.BASE_LAYER)
      }
    }
  }
</script>

<style>
  body {
    margin: 0px;
  }
</style>
