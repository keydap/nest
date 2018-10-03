// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
/* eslint-disable */
import Vue from 'vue'
import Vuex, { mapState } from 'vuex'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en'
import { Notification } from 'element-ui';
import {DataTables} from 'vue-data-tables'
import * as sp from './lib/sparrow'

Vue.config.productionTip = false
Vue.use(Vuex)
Vue.use(ElementUI, { locale })
Vue.use(DataTables)

Vue.config.errorHandler = function (err, vm, info) {
  // handle error
  // `info` is a Vue-specific error info, e.g. which lifecycle hook
  // the error was found in. Only available in 2.2.0+
  console.log(err)
  //Notification.error({message: err, duration: 10000})
}

const store = new Vuex.Store({
  state: {
    domainconf: {oauth: {}, ppolicy: {}, resources: [], rfc2307bis: {}, ldapTemplates: {}},
  },
  getters: {
    donf: state => state.domainconf,
},
mutations: {
  updateconf (state, payload) {
    state.domainconf = {...state.domainconf, ...payload.dconf}
  }
}
})
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
  components: { App },
  template: '<App/>',
  created: function() {
    sp.loadResTypes()
  }
})