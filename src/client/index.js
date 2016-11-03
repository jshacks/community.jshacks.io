import Vue from 'vue';
import VueRouter from 'vue-router';

import mainTemplate from 'html!./app/main.html';
console.log(mainTemplate)

Vue.use(VueRouter);

const Bar = { template: '<div>This is the bar route</div>' };

import routes from 'app/routes/routes.js';

const router = new VueRouter({
  routes,
});

const app = new Vue({
  router,
  template: mainTemplate,
  el: '#app',
});
