// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import fastclick from 'fastclick'
import VueLazylLoad from 'vue-lazyload'

import 'common/stylus/index.styl'

import vConsole from 'vconsole'

console.log('test')

fastclick.attach(document.body)//解决移动端点击有300毫秒的延时

Vue.config.productionTip = false

Vue.use(VueLazylLoad,{
	loading:require('common/image/default.png')
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
