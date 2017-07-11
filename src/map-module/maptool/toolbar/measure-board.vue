<template>
  <div class="measure-container" ref="container">
    <div class="icon-container">
      <div class="icon-item" @click="iconClick('Polygon')" :class="{'icon-active':currntTool ==='Polygon'}">
        <img src="../../image/Measure_Area16.png" alt="">
      </div>
      <div class="icon-item" @click="iconClick('LineString')" :class="{'icon-active':currntTool ==='LineString'}">
        <img src="../../image/Measure_Distance16.png" alt="">
      </div>
      <div class="icon-item" @click="iconClick('point')" :class="{'icon-active':currntTool ==='point'}">
        <img src="../../image/Measure_Point16.png" alt="">
      </div>
      <div class="icon-unit">
        |
      </div>
      <div class="icon-unit unit" @click="unitClick">{{unit}}
        <div class="unit-list" v-show="unitListShow">
          <div class="unit-name" @click="selectUnit(index)" v-for="(item, index) in currentUnits">{{item}}</div>
        </div>
      </div>
    </div>
    <p class="result">测量结果</p>
    <p class="result" v-if="currntTool==='Polygon'||currntTool==='LineString'">{{showResult}}</p>
    <div class="result-container" v-if="currntTool==='point'">
      <p class="result"><span class="point-result">经度</span><span class="point-result">纬度</span>
      </p>
      <p class="result"><span class="point-result">{{latResult}}</span><span class="point-result">{{lngResult}}</span>
      </p>
      <p class="result result-icon"><span class="point-result">{{latClickResult}}</span><span class="point-result">{{lngClickResult}}</span>
      </p>
    </div>
  </div>
</template>
<script>
  //  lat-纬度,lng-经度
  import ol from 'openlayers'
  import {formatLength, formatArea} from '../../js/util'
  import icon from '../../image/position.png'
  const FIXED = 6
  const UNITS = {
    Polygon: ['平方米', '平方千米'],
    LineString: ['米', '千米'],
    point: ['度']
  }
  const TARGET_PROJECT_CODE = 'EPSG:4326'
  export default {
    name: 'measureBoard',
    data() {
      return {
        currntTool: '',
        unitListShow: false,
        features: new ol.Collection(),
        sphere: new ol.Sphere(6378137),
        result: '',
        currentUnits: [],
        currentUnitIndex: 0,
        output: 0,
        clickOutput: ''
      }
    },
    props: {
      map: {
        type: Object,
        required: true
      }
    },
    computed: {
      unit() {
        return this.currentUnits[this.currentUnitIndex]
      },
      showResult() {
        let value = 0
        switch (this.unit) {
          case '平方米':
            value = `${(Math.round(this.output * 100) / 100)} 平方米`
            break
          case '平方千米':
            value = `${(Math.round(this.output / 1000000 * 100) / 100)} 平方千米`
            break
          case '米':
            value = `${(Math.round(this.output * 100) / 100)} 米`
            break
          case '千米':
            value = `${(Math.round(this.output / 1000 * 100) / 100)} 千米`
            break
          default:
            value = this.output
            break
        }
        return value
      },
      latResult() {
        if (Object.prototype.toString.call(this.output) !== '[object Array]') {
          return
        }
        let coordinates = this.getCoordinate(this.output, TARGET_PROJECT_CODE)
        return coordinates[0].toFixed(FIXED)
      },
      lngResult() {
        if (Object.prototype.toString.call(this.output) !== '[object Array]') {
          return
        }
        let coordinates = this.getCoordinate(this.output, TARGET_PROJECT_CODE)
        return coordinates[1].toFixed(FIXED)
      },
      latClickResult() {
        if (Object.prototype.toString.call(this.clickOutput) !== '[object Array]') {
          return '---'
        }
        let coordinates = this.getCoordinate(this.clickOutput, TARGET_PROJECT_CODE)
        return coordinates[0].toFixed(FIXED)
      },
      lngClickResult() {
        if (Object.prototype.toString.call(this.clickOutput) !== '[object Array]') {
          return '---'
        }
        let coordinates = this.getCoordinate(this.clickOutput, TARGET_PROJECT_CODE)
        return coordinates[1].toFixed(FIXED)
      }
    },
    mounted() {
      this.initTempLayer()
    },
    methods: {
      initTempLayer() {
        this.featureOverlay = new ol.layer.Vector({
          source: new ol.source.Vector({features: this.features}),
          style: new ol.style.Style({
            fill: new ol.style.Fill({
              color: 'rgba(255, 255, 255, 0.2)'
            }),
            stroke: new ol.style.Stroke({
              color: '#ffcc33',
              width: 2
            }),
            image: new ol.style.Circle({
              radius: 7,
              fill: new ol.style.Fill({
                color: '#ffcc33'
              })
            })
          })
        })
        this.map.addLayer(this.featureOverlay)
      },
      iconClick(val) {
        this.map.removeOverlay(this.overlay)
        this.currntTool = this.currntTool === val ? '' : val
        this.removeMousePositionListen()
        this.clickOutput = ''
        this.output = 0
        if (this.draw) {
          this.featureOverlay.getSource().clear()
          this.map.removeInteraction(this.draw)
          this.draw = null
        }
        if (this.currntTool === 'Polygon' || this.currntTool === 'LineString') {
          this.currentUnitIndex = 0
          this.$refs.container.style.height = '100px'
          this.changeTool(this.currntTool)
          this.currentUnits = UNITS[this.currntTool]
        }
        if (this.currntTool === 'point') {
          this.overlay = this.getOverlay()
          this.map.addOverlay(this.overlay)
          this.$refs.container.style.height = '150px'
          this.mousePositionChange()
        }
      },
      getOverlay() {
        const iconPic = document.createElement('img')
        iconPic.src = icon
        const overlay = new ol.Overlay({
          id: 'point-position-overlay',
          element: iconPic,
          offset: [0, -15],
          positioning: 'bottom-center'
        })
        return overlay
      },
      unitClick() {
        this.unitListShow = !this.unitListShow
      },
      removeMousePositionListen() {
        ol.Observable.unByKey(this.mapClick)
        ol.Observable.unByKey(this.mouseMove)
      },
      mousePositionChange() {
        this.mapClick = this.map.on('click', (e) => {
          this.clickOutput = e.coordinate
          this.overlay.setPosition(e.coordinate)
        })
        this.mouseMove = this.map.on('pointermove', (e) => {
          this.output = e.coordinate
        })
      },
      getCoordinate(coordinate, targetProjectCode) {
        let output
        let projectionCode = this.map.getView().getProjection().getCode()
        if (projectionCode !== targetProjectCode) {
          output = ol.proj.transform(coordinate, projectionCode, targetProjectCode)
        } else {
          output = coordinate
        }
        return output
      },
      changeTool(type) {
        this.draw = new ol.interaction.Draw({
          features: this.features,
          type: type
        })
        this.map.addInteraction(this.draw)
        this.draw.on('drawstart', (evt) => {
          this.featureOverlay.getSource().clear()
          this.sketch = evt.feature
          this.listener = this.sketch.getGeometry().on('change', (evt) => {
            let geom = evt.target
            if (geom instanceof ol.geom.Polygon) {
              this.output = formatArea(geom, this.map)
            } else if (geom instanceof ol.geom.LineString) {
              this.output = formatLength(geom, this.map)
            }
            console.log(this.output)
          })
        })
        this.draw.on('drawend', () => {
          this.sketch = null
          ol.Observable.unByKey(this.listener)
        })
      },
      selectUnit(val) {
        this.currentUnitIndex = val
      }
    },
    destroyed() {
      this.map.removeOverlay(this.overlay)
      this.map.removeInteraction(this.draw)
      this.map.removeLayer(this.featureOverlay)
    }
  }
</script>
<style lang="scss" scoped>
  @import "../../scss/variable";

  .measure-container {
    height: 100px;
    width: 100%;
    background-color: $color-board;
    .icon-container {
      font-size: 0;
      text-align: center;
      .icon-item {
        display: inline-block;
        padding: 8px;
        cursor: pointer;
        &:hover {
          background: #ededed url(../../image/button-active.png) bottom repeat-x;
        }
      }
      .icon-active {
        background: #ededed url(../../image/button-active.png) bottom repeat-x;
      }
      .icon-unit {
        display: inline-block;
        margin-left: 10px;
        font-size: 16px;
        color: white;
        vertical-align: text-bottom;
      }
      .unit {
        cursor: pointer;
        .unit-list {
          position: absolute;
          margin-top: 5px;
          max-height: 150px;
          width: 100px;
          background: $color-unit-background;
          color: $color-unit-font;
          .unit-name {
            padding: 2px;
            text-align: left;
            &:hover {

            }
          }
        }
      }
    }
    .result {
      margin: 5px 0 5px;
      text-align: center;
      color: $color-unit-background;
    }
    .result-container {
      margin-left: 30px;
      .point-result {
        display: inline-block;
        width: 50%;
        text-align: right;
      }
      .result-icon {
        &:before {
          position: absolute;
          content: '';
          width: 16px;
          height: 26px;
          left: 10px;
          background-image: url("../../image/position.png");
        }
      }
    }
  }
</style>
