import http from '../utils/fetch.js';

// 获取音乐 url
export const getSongUrl = params => http('/music/url', params);

// 获取歌曲详情
export const getSongDetail = params => http('/song/detail', params);

// 获取歌词
export const getLyric = params => http('/lyric', params);