import Vue from 'vue'
import App from './App.vue'
import VueResource from 'vue-resource'
import VueRouter from 'vue-router'
import Routes from './routes'
import {store} from './store/store'
import Header from './components/Header.vue'


Vue.use(VueResource);
Vue.use(VueRouter);

Vue.component('app-header', Header)

Vue.config.productionTip = false

const router = new VueRouter({
  routes: Routes,
  mode: 'history'

});

Vue.component('')

new Vue({
  store: store,
  render: h => h(App),
  router: router,

}).$mount('#app')

