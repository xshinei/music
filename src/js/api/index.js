import http from '../utils/fetch.js';

// 获取banner
export const getBanner = params => http('/banner', params);

// 推荐歌单
export const getRecommendSongList = params => http('//personalized', params);