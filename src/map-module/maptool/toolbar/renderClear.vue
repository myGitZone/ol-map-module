<template>
  <div class="clear-container" @click="clearClick">
    <div class="icon"></div>
  </div>
</template>
<script>
  export default {
    name: 'renderClear',
    props: {
      map: {
        map: {
          type: Object,
          required: true
        }
      }
    },
    methods: {
      clearClick() {
        let overLays = this.map.getOverlays()
        overLays.forEach((item) => {
          if (item.getId() !== 'point-position-overlay') {
            this.map.removeOverlay(item)
          }
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .clear-container {
    padding: 10px 5px;
    cursor: pointer;
    .icon {
      width: 20px;
      height: 20px;
      background-size: contain !important;
      background: #0a2f4d url('../../image/map/toolbar/clear.png') no-repeat;
      &:hover {
        background: #0a2f4d url('../../image/map/toolbar/clear_selected.png') no-repeat;
      }
    }
  }
</style>
