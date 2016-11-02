import Vue from 'vue';
import VueRouter from 'vue-router';

import TestRoute from 'app/components/TestRoute/index.vue';

Vue.use(VueRouter);

const Bar = { template: '<div>This is the bar route</div>' };

const routes = [
  { path: '/test', component: TestRoute },
  { path: '/bar', component: Bar },
];

const router = new VueRouter({
  routes,
});

/* eslint-disable no-new, no-unused-vars */
const app = new Vue({
  router,
  el: '#app',
});
