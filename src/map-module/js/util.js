export function getMapVm(vm) {
  let parentObj = vm.$parent

  while (parentObj.$options.name !== 'olMap' && parentObj.$parent) {
    parentObj = parentObj.$parent
  }
  if (parentObj.$options.name === 'olMap') {
    return parentObj
  }
  return null
}
/**
 * normal 矢量
 * earch 地形
 * terrain 影像
 * */
export function getBaseLayers(type, ol) {
  let BASE_LAYER = null
  let BASE_LABLE_LAYER = null
  if (type === 'normal') {
    BASE_LAYER = new ol.layer.Tile({
      title: 'baseMap',
      source: new ol.source.XYZ({
        url: 'http://t4.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}'
      })
    })
    BASE_LABLE_LAYER = new ol.layer.Tile({
      title: 'baseMapLable',
      source: new ol.source.XYZ({
        url: 'http://t3.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}'
      })
    })
  } else if (type === 'earch') {
    BASE_LAYER = new ol.layer.Tile({
      title: 'baseMap',
      source: new ol.source.XYZ({
        url: 'http://t4.tianditu.com/DataServer?T=ter_w&x={x}&y={y}&l={z}'
      })
    })
    BASE_LABLE_LAYER = new ol.layer.Tile({
      title: 'baseMapLable',
      source: new ol.source.XYZ({
        url: 'http://t3.tianditu.com/DataServer?T=cta_w&x={x}&y={y}&l={z}'
      })
    })
  } else {
    BASE_LAYER = new ol.layer.Tile({
      title: 'baseMap',
      source: new ol.source.XYZ({
        url: 'http://t4.tianditu.com/DataServer?T=img_w&x={x}&y={y}&l={z}'
      })
    })
    BASE_LABLE_LAYER = new ol.layer.Tile({
      title: 'baseMapLable',
      source: new ol.source.XYZ({
        url: 'http://t3.tianditu.com/DataServer?T=cia_w&x={x}&y={y}&l={z}'
      })
    })
  }
  return {BASE_LAYER, BASE_LABLE_LAYER}
}
/**
 * Format length output.
 * @param {ol.geom.LineString} line The line.
 * @return {string} The formatted length.
 */
export function formatLength(line, map, ol) {
  let wgs84Sphere = new ol.Sphere(6378137)
  var length

  var coordinates = line.getCoordinates()
  length = 0
  var sourceProj = map.getView().getProjection()
  for (var i = 0, ii = coordinates.length - 1; i < ii; ++i) {
    var c1 = ol.proj.transform(coordinates[i], sourceProj, 'EPSG:4326')
    var c2 = ol.proj.transform(coordinates[i + 1], sourceProj, 'EPSG:4326')
    length += wgs84Sphere.haversineDistance(c1, c2)
  }
  return length
}

/**
 * Format area output.
 * @param {ol.geom.Polygon} polygon The polygon.
 * @return {string} Formatted area.
 */
export function formatArea(polygon, map, ol) {
  let wgs84Sphere = new ol.Sphere(6378137)
  var area
  var sourceProj = map.getView().getProjection()
  var geom = (polygon.clone().transform(sourceProj, 'EPSG:4326'))
  var coordinates = geom.getLinearRing(0).getCoordinates()
  area = Math.abs(wgs84Sphere.geodesicArea(coordinates))
  return area
}
