<template>
  <div class="search-container" @click="searchClick">
    <div class="icon"></div>
    <div id="baidumapcontain"></div>
  </div>
</template>
<script>
  import SearchBoard from './search-board'
  import {getMapVm} from '../../js/util'
  export default {
    name: 'search',
    mounted() {
      this.parentVm = getMapVm(this)
      this.parentVm.registerComponent(SearchBoard)
    },
    methods: {
      searchClick() {
        this.show = !this.show
        this.parentVm.showBoard(SearchBoard)
      }
    }
  }
</script>
<style lang="scss" scoped>
  .search-container {
    padding: 10px 5px;
    cursor: pointer;
    .icon {
      width: 20px;
      height: 20px;
      background-size: contain !important;
      background: #0a2f4d url('../../image/map/toolbar/search.png') no-repeat;
      &:hover {
        background: #0a2f4d url('../../image/map/toolbar/search_selected.png') no-repeat;
      }
    }
  }
</style>
