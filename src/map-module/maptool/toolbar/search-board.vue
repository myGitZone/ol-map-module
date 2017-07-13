<template>
  <div class="search-board">
    <div class="search-input">
      <input type="text" class="input-keyword" v-model="keywords" ref="input" placeholder="请输入查询地址"
             @keyup.enter="searchHandler">
      <button @click="searchHandler">查询</button>
    </div>
    <div class="list-container">
      <div class="lable" v-if="lable">{{lable}}</div>
      <item @itemClick="searchItemClick" :key="item.uid" v-for="(item, index) in currentDatas" :data="item"><img
        :src="icons[index]"
        alt=""></item>
    </div>
    <div class="page-info" v-if="currentDatas.length">
      <div class="page-control">
        <span class="page-control-item">
          <a class="page-operation" href="javascript:void(0)" @click="goHomePage">首页</a>
        </span>
        <span class="page-control-item">
          <a class="page-operation" href="javascript:void(0)" @click="goPreviousPage">上页</a>
        </span>
        <span class="page-control-item">
          <a class="page-operation" href="javascript:void(0)" @click="goNextPage">下页</a>
        </span>
        <span class="page-control-item">
          <a class="page-operation" href="javascript:void(0)" @click="goLastPage">末页</a>
        </span>
        <span class="page-control-item">
          <div class="currnet-page-info">{{currentPage}}</div>
          <div class="currnet-page-info">/</div>
          <div class="currnet-page-info">{{totalPage}}</div>
        </span>
      </div>
    </div>
    <div id="baidumapcontain">
    </div>
  </div>
</template>
<script>
  import CoorConvertClass from '../../bmap/coordinateConvert'
  import Item from '../../../components/search-item'
  import '../../bmap/bmapLoader'
  import icon1 from '../../image/map/search/red_1.png'
  import icon2 from '../../image/map/search/red_2.png'
  import icon3 from '../../image/map/search/red_3.png'
  import icon4 from '../../image/map/search/red_4.png'
  import icon5 from '../../image/map/search/red_5.png'
  import icon6 from '../../image/map/search/red_6.png'
  import icon7 from '../../image/map/search/red_7.png'
  import icon8 from '../../image/map/search/red_8.png'
  import icon9 from '../../image/map/search/red_9.png'
  import icon10 from '../../image/map/search/red_10.png'
  const ICONS = [icon1, icon2, icon3, icon4, icon5, icon6, icon7, icon8, icon9, icon10]
  const ZOOM_INDEX = 18
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
        keywords: '',
        currentDatas: [],
        currentPage: 1,
        totalPage: 0,
        icons: ICONS,
        features: [],
        lable: null
      }
    },
    watch: {
      currentPage() {
        this.searchResult = this.localSearch.gotoPage(this.currentPage - 1)
        this.getCurrentShowList()
      },
      keywords(value) {
        if (!value) {
          this.localSearch.clearResults()
          this.searchResult = null
          this.currentDatas = []
          this.currentPage = 1
          this.totalPage = 0
          this.lable = null
          this.source.clear()
        }
      }
    },
    created() {
      this.initPicMark()
    },
    mounted() {
      this.projectionCode = this.map.getView().getProjection().getCode()
      this.bmap = new window.BMap.Map('baidumapcontain')
      this.localSearch = new window.BMap.LocalSearch(this.bmap)
      this.localSearch.setSearchCompleteCallback(this.searchRsultCallBack)
      this.initLayer()
    },
    methods: {
      initPicMark() {
        this.PIC_MARK = []
        for (let i = 1; i <= 10; i++) {
          let icon = new this.$ol.style.Icon({
            offset: [0, 0],
            opacity: 1.0,
            rotateWithView: true,
            rotation: 0.0,
            scale: 1.0,
            size: [21, 31],
            crossOrigin: 'anonymous',
            src: ICONS[i - 1]
          })
          this.PIC_MARK.push(icon)
        }
      },
      initLayer() {
        this.source = new this.$ol.source.Vector({
          features: this.features
        })
        var vector = new this.$ol.layer.Vector({
          source: this.source
        })
        this.map.addLayer(vector)
      },
      searchHandler() {
        let extent = this.map.getView().calculateExtent(this.map.getSize())
        let minPoint = [extent[0], extent[1]]
        let maxPoint = [extent[2], extent[3]]
        let tranMinPoint = this.$ol.proj.transform(minPoint, this.projectionCode, 'EPSG:4326')
        let tranMaxPoint = this.$ol.proj.transform(maxPoint, this.projectionCode, 'EPSG:4326')
        var b = new window.BMap.Bounds(new window.BMap.Point(tranMinPoint[0], tranMinPoint[1]), new window.BMap.Point(tranMaxPoint[0], tranMaxPoint[1]))
        this.localSearch.searchInBounds(this.keywords, b)
      },
      searchRsultCallBack(searchResult) {
        this.currentDatas = []
        this.source.clear()
        this.lable = null
        if (!searchResult || searchResult.getNumPois == null || searchResult.getCurrentNumPois() === 0) {
          this.lable = '搜索范围过大或未查到相关数据'
          return
        }
        this.totalPage = searchResult.getNumPages()
        this.searchResult = searchResult
        this.getCurrentShowList()
      },
      getCurrentShowList() {
        this.currentDatas = []
        this.source.clear()
        for (let i = 0; i < this.searchResult.getCurrentNumPois(); i++) {
          this.currentDatas.push(this.searchResult.getPoi(i))
          this.drawMarkToMap(this.searchResult.getPoi(i), i)
          console.log(this.searchResult.getPoi(i))
        }
      },
      drawMarkToMap(item, index) {
        let tdPoi = this.coorConvert(item)
        let geometry = new this.$ol.geom.Point(this.$ol.proj.transform([tdPoi.lon, tdPoi.lat],
          'EPSG:4326', this.projectionCode))
        let feature = new this.$ol.Feature(geometry)
        feature.setStyle(
          new this.$ol.style.Style({
            image: this.PIC_MARK[index]
          })
        )
        this.source.addFeature(feature)
      },
      searchItemClick(item) {
        let tdPoi = this.coorConvert(item)
        let point = this.$ol.proj.transform([tdPoi.lon, tdPoi.lat], 'EPSG:4326', this.projectionCode)
        let view = this.map.getView()
        view.setCenter(point)
        view.setZoom(ZOOM_INDEX)
      },
      coorConvert(bPoi) {
        var bdtogcjPoint = CoorConvertClass.bd_decrypt(bPoi.point.lat, bPoi.point.lng)
        var gcjtowgsPoint = CoorConvertClass.gcj_decrypt_exact(bdtogcjPoint.lat, bdtogcjPoint.lon)
        return gcjtowgsPoint
      },
      goHomePage() {
        this.currentPage = 1
      },
      goPreviousPage() {
        if (this.currentPage === 1 || this.currentPage === 0) {
          return
        }
        this.currentPage--
      },
      goNextPage() {
        if (this.currentPage === this.totalPage) {
          return
        }
        this.currentPage++
      },
      goLastPage() {
        this.currentPage = this.totalPage
      }
    },
    components: {
      Item
    }
  }
</script>
<style lang="scss" scoped>
  @import "../../scss/variable";

  .search-board {
    max-height: 700px;
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
    .list-container {
      max-height: 600px;
      overflow: auto;
      .lable {
        height: 40px;
        line-height: 40px;
        text-align: center;
        color: #fff;
      }
    }
    .page-info {
      position: relative;
      width: 100%;
      margin: 12px 0;
      font-size: 0;
      color: #ddd;
      box-sizing: border-box;
      text-align: center;
      .result-count {
        display: inline-block;
        font-size: 12px;
      }
      .page-control {
        font-size: 12px;
        .page-control-item {
          margin-left: 8px;
          .page-operation {
            color: #ddd;
            text-decoration: none;
            &:focus {
              text-decoration: underline;
            }
          }
          .currnet-page-info {
            display: inline-block;
          }
        }
      }
    }
  }
</style>
