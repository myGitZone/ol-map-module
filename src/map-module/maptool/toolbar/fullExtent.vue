<template>
  <div class="full-extent-btn" @click.stop="fullExtentClick">
    <div class="icon"></div>
  </div>
</template>
<script>
  export default {
    name: 'fullExtent',
    props: {
      map: {
        type: Object,
        required: true
      },
      viewParams: {
        type: Object
      }
    },
    methods: {
      fullExtentClick() {
        let view = this.map.getView()
        if ('center' in this.viewParams) {
          view.setCenter(this.viewParams.center)
        }
        if ('zoom' in this.viewParams) {
          view.setZoom(this.viewParams.zoom)
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  .full-extent-btn {
    padding: 10px 5px;
    cursor: pointer;
    .icon {
      width: 20px;
      height: 20px;
      background-size: contain !important;
      background: #0a2f4d url('../../image/map/toolbar/home.png') no-repeat;
      &:hover {
        background: #0a2f4d url('../../image/map/toolbar/home_selected.png') no-repeat;
      }
    }
  }
</style>
