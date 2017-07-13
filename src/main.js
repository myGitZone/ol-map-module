import Vue from 'vue'
import App from './App'
// import OlMap from '../dist/static/js/app.js'
import OlMap from './index.js'
import '../node_modules/openlayers/dist/ol-debug.css'
import '../dist/static/css/app.css'

Vue.config.productionTip = false
Vue.use(OlMap)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  components: {App}
})
