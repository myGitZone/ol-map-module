<template>
  <div class="location-container">
    <div class="icon">{{locationValue}}</div>
  </div>
</template>
<script>
  import CoorConvertClass from '../../bmap/coordinateConvert'
  const ZOOM_BORDER = {
    country: {
      max: 7,
      min: 1
    },
    province: {
      max: 10,
      min: 8
    },
    city: {
      max: 13,
      min: 10
    }
  }
  export default {
    name: 'location',
    props: {
      map: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        locationValue: '全国'
      }
    },
    mounted() {
      this.projectionCode = this.map.getView().getProjection().getCode()
      this.mouseMove = this.map.on('moveend', (e) => {
        let c = this.map.getView().getCenter()
        let tranMinPoint = this.$ol.proj.transform(c, this.projectionCode, 'EPSG:4326')
        // WGS-84 to GCJ-02
        let gcj = CoorConvertClass.gcj_encrypt(tranMinPoint[0], tranMinPoint[1])
        // GCJ-02 to BD-09
        let bd = CoorConvertClass.bd_encrypt(gcj.lat, gcj.lon)
        // 根据坐标得到地址描述
        var myGeo = new window.BMap.Geocoder()
        myGeo.getLocation(new window.BMap.Point(bd.lat, bd.lon), (result) => {
          if (result) {
            let zoom = this.map.getView().getZoom()
            if (zoom <= ZOOM_BORDER.country.max) {
              this.locationValue = '全国'
            } else if (zoom < ZOOM_BORDER.province.max && zoom >= ZOOM_BORDER.province.min) {
              this.locationValue = result.addressComponents.province
            } else if (zoom >= ZOOM_BORDER.city.min && zoom < ZOOM_BORDER.city.max) {
              this.locationValue = result.addressComponents.city
            } else {
              this.locationValue = result.addressComponents.district
            }
            if (!this.locationValue) {
              this.locationValue = '全国'
            }
          }
        })
      })
    }
  }
</script>
<style lang="scss" scoped>
  @import "../../scss/variable";

  .location-container {
    padding: 10px 5px;
    cursor: pointer;
    text-align: center;
    color: #fff;
    .icon {
      width: 180px;
      height: 20px;
      font-size: 14px;
    }
  }
</style>
