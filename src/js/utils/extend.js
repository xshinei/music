import Vue from 'vue';
import { baseFontSize } from './init.js';

Vue.prototype.px2Rem = function px2Rem(px) {
    return px / parseInt(baseFontSize()) + 'rem';
}