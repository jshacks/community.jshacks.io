import Vue from 'vue';
import VueRouter from 'vue-router';

import TestRoute from 'app/components/TestRoute/index.vue';
import Header from 'app/components/Header/index.vue';

import mainTemplate from 'app/main.html';
console.log(mainTemplate)

Vue.use(VueRouter);

const Bar = { template: '<div>This is the bar route</div>' };


const routes = [
  { path: '/', 
    components: {
      header: Header
      }
  },
  { path: '/test', 
    components: {
      default: TestRoute,
      header: Header
      }
  },
  { path: '/bar', 
    components: {
      default: Bar,
      header: Header
      }
  }
];

const router = new VueRouter({
  routes,
});

/* eslint-disable no-new, no-unused-vars */
const app = new Vue({
  router,
  template: mainTemplate,
  el: '#app',
});
