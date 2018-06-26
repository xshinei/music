import Vue from 'vue';
import router from './js/routes';

import APP from './js/pages/APP.vue';
import './css/reset.scss';

new Vue({
    router,
    render: h => h(APP)
}).$mount('#app');
