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
