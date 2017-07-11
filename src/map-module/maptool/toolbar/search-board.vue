<template>
  <div class="search-board">
    <div class="search-input">
      <input type="text" class="input-keyword" v-model="keywords" ref="input" placeholder="请输入查询地址"
             @keyup.enter="searchHandler">
      <button @click="searchHandler">查询</button>
    </div>
    <div id="baidumapcontain"></div>
  </div>
</template>
<script>
  import ol from 'openlayers'
  import '../../bmap/bmapLoader'

  const MAX_COUNT = 10
  export default {
    name: 'searchBoard',
    props: {
      map: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        keywords: ''
      }
    },
    mounted() {
      this.bmap = new window.BMap.Map('baidumapcontain')
      this.localSearch = new window.BMap.LocalSearch(this.bmap)
      this.localSearch.setSearchCompleteCallback(this.searchRsultCallBack)
    },
    methods: {
      searchHandler() {
        let extent = this.map.getView().calculateExtent(this.map.getSize())
        let projectionCode = this.map.getView().getProjection().getCode()
        let minPoint = [extent[0], extent[1]]
        let maxPoint = [extent[2], extent[3]]
        let tranMinPoint = ol.proj.transform(minPoint, projectionCode, 'EPSG:4326')
        let tranMaxPoint = ol.proj.transform(maxPoint, projectionCode, 'EPSG:4326')
        debugger
        var b = new window.BMap.Bounds(new window.BMap.Point(tranMinPoint[0], tranMinPoint[1]), new window.BMap.Point(tranMaxPoint[0], tranMaxPoint[1]))
        this.localSearch.searchInBounds(this.keywords, b)
      },
      searchRsultCallBack(searchResult) {
        if (!('getNumPois' in searchResult)) {
          alert(123)
          return
        }
        this.searchResult = searchResult
        let everyPageCount = this.searchResult.getNumPois() < MAX_COUNT ? this.searchResult.getNumPois() : MAX_COUNT
        this.getCurrentShowList(0, everyPageCount)
      },
      getCurrentShowList(startIndex, endIndex) {
        for (let i = startIndex; i < endIndex; i++) {
          console.log(this.searchResult.getPoi(i))
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import "../../scss/variable";

  .search-board {
    max-height: 600px;
    width: 100%;
    background-color: $color-board;
    .search-input {
      text-align: center;
      .input-keyword {
        width: 140px;
        margin: 5px 0;
        line-height: 25px;
      }
    }
  }
</style>
