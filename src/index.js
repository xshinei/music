import Vue from 'vue';
import VueRouter from 'vue-router';
import routes from './js/routes/index';

Vue.use(VueRouter);

import APP from './js/pages/APP.vue';
import './css/reset.scss';

const router = new VueRouter({routes});

new Vue({
    router,
    render: h => h(APP)
}).$mount('#app');
