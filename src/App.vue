<template>
  <ol-map @mapReady="mapLoad" :viewParams="view">
    <OverviewMap ref="viewMap" position="right" slot="overviewMap" :map="map" :layers="layers"
                 v-if="map" :viewParams="view"></OverviewMap>
    <tool-bar slot="toolbar" :viewParams="view" :map="map" v-if="map"></tool-bar>
    <map-type slot="mapType" :map="map" v-if="map" @layerChange="layerChange"></map-type>
  </ol-map>
</template>

<script>
  //  import OlMap from './map-module/map/ol-map.vue'
  //  import OverviewMap from './map-module/maptool/overviewMap.vue'
  //  import ToolBar from './map-module/maptool/toolbar'
  import {getBaseLayers} from './map-module/js/util'
  // const VIEW_PARAMS = {
  //   projection: 'EPSG:3857',
  //   center: [11500000, 4000000],
  //   zoom: 6
  // }
  const VIEW_PARAMS = {
    projection: 'EPSG:4326',
    center: [102.67556185326836, 24.891518929141675],
    zoom: 10
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
      let {BASE_LAYER} = getBaseLayers(layerType, this.$ol, VIEW_PARAMS.projection)
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
