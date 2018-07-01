import Vue from 'vue';
import VueRouter from 'vue-router';
import routes from './js/routes/index';

Vue.use(VueRouter);

import APP from './js/pages/APP.vue';
import './js/utils/init';
import './css/reset.scss';
import './font/font-awesome/scss/font-awesome.scss';

const router = new VueRouter({routes});

new Vue({
    router,
    render: h => h(APP)
}).$mount('#app');
