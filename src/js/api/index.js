import http from '../utils/fetch.js';

// 获取banner
export const getBanner = params => http('/banner', params);

// 推荐歌单
export const getRecommendSongList = params => http('/personalized', params);

// 最新音乐
export const getRecommendNewSongs = params => http('/personalized/newsong', params);

// 主播电台
export const getRecommendBroadcastings = params => http('/personalized/djprogram', params);
