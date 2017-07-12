<template>
  <div class="tool-bar">
    <location class="tool-item":map="map"></location>
    <search class="tool-item"></search>
    <zoom-in class="tool-item" :map="map"></zoom-in>
    <zoom-out class="tool-item" :map="map"></zoom-out>
    <full-extent :viewParams="viewParams" :map="map" class="tool-item"></full-extent>
    <full-screen class="tool-item"></full-screen>
    <measure-ment class="tool-item"></measure-ment>
    <render-clear class="tool-item" :map="map"></render-clear>
  </div>
</template>
<script>
//  import Location from './toolbar/location'
//  import Search from './toolbar/search'
//  import ZoomIn from './toolbar/zoomIn'
//  import ZoomOut from './toolbar/zoomOut'
//  import FullExtent from './toolbar/fullExtent'
//  import FullScreen from './toolbar/fullScreen'
//  import MeasureMent from './toolbar/measurement'
//  import RenderClear from './toolbar/renderClear'
  export default {
    name: 'toolBar',
    props: {
      map: {
        type: Object
      },
      viewParams: {
        type: Object
      }
    }
  }
</script>
<style lang="scss" scoped>
  .tool-bar {
    font-size: 0;
    .tool-item {
      display: inline-block;
      font-size: 16px;
      vertical-align: top;
    }
  }
</style>
