import http from '../utils/fetch';

// 歌单 (网友精选碟)
export const getChoicenessList = params => http('/top/playlist', params);

// 获取精品歌单
export const getQualityList = params => http('/top/playlist/highquality', params);

// 歌单分类
export const getCatList = params => http('/playlist/catlist', params);

// 热门歌单分类
export const getHotCatList = params => http('/playlist/hot', params);

// 获取歌单详情
export const getPlaylistDetail = params => http('/playlist/detail', params);