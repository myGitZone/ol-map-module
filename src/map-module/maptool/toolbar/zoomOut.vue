<template>
  <div class="zoom-out-btn" @click.stop="zoomOutClick">
    <div class="icon"></div>
  </div>
</template>
<script>
  export default {
    name: 'zoomOut',
    props: {
      map: {
        type: Object,
        required: true
      }
    },
    methods: {
      zoomOutClick() {
        let zoom = this.map.getView().getZoom()
        zoom--
        if (zoom < 0) {
          return
        }
        this.map.getView().setZoom(zoom)
      }
    }
  }
</script>
<style lang="scss" scoped>
  .zoom-out-btn {
    padding: 10px 5px;
    cursor: pointer;
    .icon {
      width: 20px;
      height: 20px;
      background-size: contain !important;
      background: #0a2f4d url('../../image/map/toolbar/zoomout.png') no-repeat;
      &:hover {
        background: #0a2f4d url('../../image/map/toolbar/zoomout_selected.png') no-repeat;
      }
    }
  }
</style>
