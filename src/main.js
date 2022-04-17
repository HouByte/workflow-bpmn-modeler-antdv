
import Vue from 'vue'
import App from './Demo.vue'
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';

Vue.config.productionTip = false

Vue.use(Antd);

new Vue({
  render: h => h(App)
}).$mount('#app')
