import 'core-js/stable';
import Vue from 'vue';
import App from './App';
import router from './router';
import CoreuiVue from '@coreui/vue';
import { iconsSet as icons } from './assets/icons/icons.js';
import './icons';

// import './pdf';
import store from './store/store';
import * as VueGoogleMaps from 'vue2-google-maps';
import enLocale from './lang/en';
import arLocale from './lang/ar';
import VueI18n from 'vue-i18n';
import vSelect from 'vue-select';
import feather from 'vue-icon';
import Element from 'element-ui';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import am4themes_dark from '@amcharts/amcharts4/themes/dark';
import './mixins/mixins';
import './events/notification';
import { ProgressPlugin } from 'bootstrap-vue';
import "regenerator-runtime";
// import { createApp } from 'vue';
import VueCountdown from '@chenfengyuan/vue-countdown';
export const EventBus = new Vue();
// const app = createApp({});
// app.component(VueCountdown.name, VueCountdown);
import VueExcelEditor from 'vue-excel-editor';

Vue.use(VueExcelEditor);

Vue.component('vue-countdown', VueCountdown);
Vue.use(ProgressPlugin);
Vue.prototype.$am4core = () => {
  return {
    am4core,
    am4charts,
    am4themes_animated,
    am4themes_dark,
  };
};

import locale from 'element-ui/lib/locale/lang/ar';

import './directive/directive';
// console.log("lang mani",i18n.locale);
Vue.use(Element, { locale });
// Vue.use(Element, {
//     i18n: (key, value) => i18n.t(key, value)
//   })
Vue.use(feather, 'v-icon');

Vue.component('v-select', vSelect);

Vue.use(VueI18n);

const messages = {
  en: {
    ...enLocale,
  },
  ar: {
    ...arLocale,
  },
};

const i18n = new VueI18n({
  locale: 'ar',
  fallbackLocale: 'ar',
  messages,
  silentTranslationWarn: process.env.NODE_ENV === 'production',
});

Vue.config.performance = true;
Vue.use(CoreuiVue);

Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyDLfUZRAhGbaI4vnKZmWE9Dz0K-y9-42V8',
    libraries: 'places',
    region: 'EG',
    language: 'en',
  },
});

Vue.prototype.$log = console.log.bind(console);

new Vue({
  el: '#app',
  router,
  store,
  icons,
  i18n,
  template: '<App/>',
  components: {
    App,
  },
});
