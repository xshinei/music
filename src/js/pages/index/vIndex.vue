<template>
    <div style="height: 100%;">
        <header class="header">
            <div class="search-container">
                <input type="text" class="search-input">
            </div>
        </header>
        <div class="scroll-container">
            <scroll :data="banners" :pullup="true">
                <div>
                    <div class="tab-container">
                        <div class="tab-item active">个性推荐</div>
                        <div class="tab-item">主播电台</div>
                        <!-- <span class="underline"></span> -->
                        <div class="banner-container" v-if="banners.length">
                            <swiper :options="swiperOption" :style="`width: ${px2Rem(363)}; border-radius: 4px;`">
                                <swiper-slide v-for="(item, index) in banners" :key="index" class="banner-item">
                                    <img :src="item.picUrl" width="100%" height="100%" alt="">
                                </swiper-slide>
                                <div class="banner-pagination" slot="pagination"></div>
                            </swiper>
                        </div>
                    </div>
                    <section class="section-container">
                        <div class="section-item">
                            <div class="icon"></div>
                            <span class="text">私人FM</span>
                        </div>
                        <div class="section-item">
                            <div class="icon"></div>
                            <span class="text">每日推荐</span>
                        </div>
                        <div class="section-item">
                            <div class="icon"></div>
                            <span class="text">歌单</span>
                        </div>
                        <div class="section-item">
                            <div class="icon"></div>
                            <span class="text">排行榜</span>
                        </div>
                    </section>
                    <recommend-item title="推荐歌单" :list="songList"></recommend-item>
                    <recommend-item title="最新音乐" :list="newSongs"></recommend-item>
                    <recommend-item title="主播电台" :list="broadcastings"></recommend-item>
                </div>
            </scroll>
        </div>
    </div>
</template>

<script>
    import {
        swiper,
        swiperSlide
    } from 'vue-awesome-swiper';
    import {
        getBanner,
        getRecommendSongList,
        getRecommendNewSongs,
        getRecommendBroadcastings
    } from '../../api/index.js';
    import RecommendItem from '../../components/RecommendItem/vRecommendItem.vue';

    export default {
        data() {
            return {
                swiperOption: {
                    loop: true,
                    autoplay: true,
                    setWrapperSize: true,
                    speed: 500,
                    pagination: {
                        el: '.banner-pagination',
                        bulletClass: 'banner-pagination-bullet',
                        bulletActiveClass: 'banner-pagination-bullet-active'
                    }
                },
                banners: [],
                songList: [],
                newSongs: [],
                broadcastings: []
            };
        },
        created() {
            this._getBanner();
        },
        mounted() {
            this._getRecommendSongList();
            this._getRecommendNewSongs();
            this._getRecommendBroadcastings();
        },
        methods: {
            _getBanner() {
                getBanner().then(res => {
                    if (res.code === 200) {
                        this.banners = res.banners;
                    }
                });
            },
            _getRecommendSongList() {
                getRecommendSongList().then(res => {
                    if (res.code === 200) {
                        this.songList = res.result;
                    }
                });
            },
            _getRecommendNewSongs() {
                getRecommendNewSongs().then(res => {
                    if (res.code === 200) {
                        this.newSongs = res.result;
                    }
                });
            },
            _getRecommendBroadcastings() {
                getRecommendBroadcastings().then(res => {
                    if (res.code === 200) {
                        this.broadcastings = res.result;
                    }
                });
            }
        },
        components: {
            swiper,
            swiperSlide,
            RecommendItem
        }
    }
</script>

<style lang="scss" scoped>
    @import '../../../css/function.scss';

    // @import '../../../css/swiper.min.scss';
    .header {
        position: fixed;
        z-index: 10;
        top: 0;
        left: 0;
        right: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        height: setRem(86);
        background-color: #dd4439;

        .search-container {
            .search-input {
                width: setRem(535);
                height: setRem(60);
                border-radius: setRem(30);
                background-color: #e0655d;
            }
        }
    }

    .scroll-container {
        height: 100%;
        margin-top: setRem(86);
    }

    .tab-container {
        display: flex;
        justify-content: center;
        position: relative;
        height: setRem(302);
        background-color: #dd4439;

        .tab-item {
            margin: setRem(22) setRem(89);
            color: #fff;

            &.active {
                font-weight: 500;
            }
        }

        .underline {
            position: absolute;
            top: setRem(62);
            left: setRem(195);
            width: setRem(62);
            height: setRem(6);
            background-color: #fff;
        }

        .banner-container {
            position: absolute;
            top: setRem(92);
            left: 0;
            right: 0;
            width: setRem(726);
            height: setRem(282);
            margin: 0 auto;

            .banner-item {
                width: setRem(726);
                height: setRem(282);
                background-color: yellow;
            }

            .banner-pagination {
                position: absolute;
                z-index: 10;
                bottom: 0;
                left: 0;
                text-align: center;
            }
        }
    }

    .section-container {
        display: flex;

        height: setRem(277);
        border-bottom: 0.5px solid #dee1e1;

        .section-item {
            margin: setRem(104) setRem(42) 0;
            text-align: center;

            .icon {
                width: setRem(100);
                height: setRem(100);
                border-radius: 50%;
                background-color: #e04941;
            }

            .text {
                font-size: setRem(14);
            }
        }
    }
</style>