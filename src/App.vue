<template>
  <ol-map @mapReady="mapLoad" :viewParams="view">
    <OverviewMap ref="viewMap" position="left" slot="overviewMap" :map="map" :layers="layers"
                 v-if="map" ></OverviewMap>
    <tool-bar slot="toolbar" :viewParams="view" :map="map" v-if="map"></tool-bar>
  </ol-map>
</template>

<script>
  import OlMap from './map-module/map/ol-map.vue'
  import OverviewMap from './map-module/maptool/overviewMap.vue'
  import ToolBar from './map-module/maptool/toolbar'
  import ol from 'openlayers'
  const BASE_LAYER = new ol.layer.Tile({
    title: '天地图路网',
    source: new ol.source.XYZ({
      url: 'http://t4.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}'
    })
  })
  const VIEW_PARAMS = {
    center: [11500000, 4000000],
    zoom: 6
  }
  export default {
    name: 'app',
    data() {
      return {
        layers: [
          BASE_LAYER
        ],
        map: null,
        location: {
          top: '10px',
          left: '10px'
        },
        view: VIEW_PARAMS
      }
    },
    mounted() {
    },
    methods: {
      mapLoad(map) {
        this.map = map
      }
    },
    components: {
      OlMap,
      OverviewMap,
      ToolBar
    }
  }
</script>

<style>
  body {
    margin: 0px;
  }
</style>
