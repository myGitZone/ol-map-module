<template>
  <div class="full-screen-btn" @click.stop="fullScreenClick">
    <div class="icon"></div>
  </div>
</template>
<script>
  import {getMapVm} from '../../js/util'
  export default {
    name: 'fullScreen',
    data() {
      return {
        isScreen: false
      }
    },
    methods: {
      fullScreenClick() {
        let parentObj = getMapVm(this)
        if (parentObj) {
          this.isScreen = !this.isScreen
          parentObj.setMapScreen(this.isScreen)
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  .full-screen-btn {
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
