<template>
  <div class="zoom-in-btn" @click.stop="zoomInClick">
    <div class="icon"></div>
  </div>
</template>
<script>
  export default {
    name: 'zoomIn',
    props: {
      map: {
        type: Object,
        required: true
      }
    },
    methods: {
      zoomInClick() {
        let zoom = this.map.getView().getZoom()
        zoom++
        if (zoom > 28) {
          return
        }
        this.map.getView().setZoom(zoom)
      }
    }
  }
</script>
<style lang="scss" scoped>
  .zoom-in-btn {
    padding: 10px 5px;
    cursor: pointer;
    .icon {
      width: 20px;
      height: 20px;
      background-size: contain !important;
      background: #0a2f4d url('../../image/map/toolbar/zoomin.png') no-repeat;
      &:hover {
        background: #0a2f4d url('../../image/map/toolbar/zoomin_selected.png') no-repeat;
      }
    }
  }
</style>
