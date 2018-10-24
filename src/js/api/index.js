import http from '../utils/fetch.js';

// 获取banner
export const getBanner = params => http('/banner', params);