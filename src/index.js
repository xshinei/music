import Vue from 'vue';
import VueRouter from 'vue-router';
import routes from './js/routes/index';
import store from './js/store/index';

import APP from './js/pages/APP.vue';
import './js/utils/init';
import './js/utils/extend';
import './css/reset.scss';
import './font/font-awesome/scss/font-awesome.scss';
import BScroll from './js/components/vScroll.vue';
import VueAwesomeSwiper from 'vue-awesome-swiper';
import './css/swiper.min.scss';

Vue.use(VueRouter);
Vue.use(VueAwesomeSwiper);
Vue.component('scroll', BScroll);

const router = new VueRouter({routes});

new Vue({
    router,
    store,
    render: h => h(APP)
}).$mount('#app');
