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
export function getBaseLayers(type, ol, projection) {
  let BASE_LAYER = null
  let BASE_LABLE_LAYER = null
  if (type === 'normal') {
    BASE_LAYER = getTdtLayer(ol, 'vec_c', 'baseMap', projection)
    BASE_LABLE_LAYER = getTdtLayer(ol, 'cva_c', 'baseMapLable', projection)
  } else if (type === 'earch') {
    BASE_LAYER = getTdtLayer(ol, 'ter_c', 'baseMap', projection)
    BASE_LABLE_LAYER = getTdtLayer(ol, 'cta_c', 'baseMapLable', projection)
  } else {
    BASE_LAYER = getTdtLayer(ol, 'img_c', 'baseMap', projection)
    BASE_LABLE_LAYER = getTdtLayer(ol, 'cia_c', 'baseMapLable', projection)
  }
  return { BASE_LAYER, BASE_LABLE_LAYER }
}
function getTdtLayer(ol, lyr, title, projection) {
  var url = 'http://t0.tianditu.com/DataServer?T=' + lyr + '&X={x}&Y={y}&L={z}'
  var projectionExtent = [-180, -90, 180, 90]
  var maxResolution = (ol.extent.getWidth(projectionExtent) / (256 * 2))
  var resolutions = new Array(16)
  var z
  for (z = 0; z < 16; ++z) {
    resolutions[z] = maxResolution / Math.pow(2, z)
  }
  var tileOrigin = ol.extent.getTopLeft(projectionExtent)
  var layer = new ol.layer.Tile({
    title: title,
    extent: [-180, -90, 180, 90],
    source: new ol.source.TileImage({
      tileUrlFunction: function (tileCoord) {
        var z = tileCoord[0] + 1
        var x = tileCoord[1]
        var y = -tileCoord[2] - 1
        var n = Math.pow(2, z + 1)
        x = x % n
        if (x * n < 0) {
          x = x + n
        }
        return url.replace('{z}', z.toString())
          .replace('{y}', y.toString())
          .replace('{x}', x.toString())
      },
      projection: projection,
      tileGrid: new ol.tilegrid.TileGrid({
        origin: tileOrigin,
        resolutions: resolutions,
        tileSize: 256
      })
    })
  })
  return layer
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
