import Vue from "vue";
import App from "@/App.vue";
import store from "@/store/index.js";
import router from "@/router";
import VueI18n from "vue-i18n";
import { Toast, Button, Icon, Tab, Tabs, Progress,Slider} from "vant"

// 移动端适配
import 'amfe-flexible';
import $urls from './utils/url.js';
import $http from './utils/http.js';
import $public from "@/utils/public.js";
import $filters from "@/utils/filters.js";
import $language from "@/language/index.js";

import "@/assets/css/reset.css";
import "@/assets/css/common.scss";

Vue.config.productionTip = false;
Vue.use(Toast)
  .use(Button)
  .use(Icon)
  .use(Tab)
  .use(Tabs)
  .use(Progress)
  .use(Slider);


Vue.prototype.$urls = $urls;
Vue.prototype.$http = $http;
Vue.prototype.$public = $public;


// 语言
Vue.use(VueI18n)
const i18n = new VueI18n({
  locale: localStorage.lang || 'cn',
  messages: $language
});

// 全局过滤器
Object.keys($filters).forEach(filterName => {
  Vue.filter(filterName, $filters[filterName])
})


new Vue({
  router,
  i18n,
  store,
  render: h => h(App)
}).$mount("#app");
