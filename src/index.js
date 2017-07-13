import ol from 'openlayers'
import OlMap from './map-module/map/ol-map'
import OverviewMap from './map-module/maptool/overviewMap'
import MapType from './map-module/maptool/mapType'
import ToolBar from './map-module/maptool/toolbar'

import Location from './map-module/maptool/toolbar/location'
import Search from './map-module/maptool/toolbar/search'
import ZoomIn from './map-module/maptool/toolbar/zoomIn'
import ZoomOut from './map-module/maptool/toolbar/zoomOut'
import FullExtent from './map-module/maptool/toolbar/fullExtent'
import FullScreen from './map-module/maptool/toolbar/fullScreen'
import MeasureMent from './map-module/maptool/toolbar/measurement'
import RenderClear from './map-module/maptool/toolbar/renderClear'

var components = [
  OlMap,
  OverviewMap,
  MapType,
  ToolBar,
  Location,
  Search,
  ZoomIn,
  ZoomOut,
  FullExtent,
  FullScreen,
  MeasureMent,
  RenderClear
]
const install = function (Vue) {
  Vue.prototype.$ol = ol
  Vue.ol = ol
  components.map((component) => {
    Vue.component(component.name, component)
  })
}

export default {
  OlMap,
  OverviewMap,
  MapType,
  ToolBar,
  Location,
  Search,
  ZoomIn,
  ZoomOut,
  FullExtent,
  FullScreen,
  MeasureMent,
  RenderClear,
  install
}
