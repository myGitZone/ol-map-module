<template>
  <div class="measurement-container" @click="measurementClick">
    <div class="icon"></div>
  </div>
</template>
<script>
  import MeasureBoard from './measure-board'
  import {getMapVm} from '../../js/util'
  export default {
    name: 'measureMent',
    mounted() {
      let parentVm = getMapVm(this)
      parentVm.registerComponent(MeasureBoard)
    },
    methods: {
      measurementClick() {
        this.show = !this.show
        let parentVm = getMapVm(this)
        parentVm.showBoard(MeasureBoard)
      }
    }
  }
</script>
<style lang="scss" scoped>
  .measurement-container {
    padding: 10px 5px;
    cursor: pointer;
    .icon {
      width: 20px;
      height: 20px;
      background-size: contain !important;
      background: #0a2f4d url('../../image/map/toolbar/measure.png') no-repeat;
      &:hover {
        background: #0a2f4d url('../../image/map/toolbar/measure_selected.png') no-repeat;
      }
    }
  }
</style>
