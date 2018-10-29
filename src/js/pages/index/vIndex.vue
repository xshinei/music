<template>
    <div>
        <header class="header">
            <div class="search-container">
                <input type="text" class="search-input">
            </div>
        </header>
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
        <div class="recommend-container">
            <div class="recommend-head">
                <span class="title">推荐歌曲</span>
                <i class="more"></i>
            </div>
            <div class="recommend-content">
                <div v-for="item in songList.slice(0, 6)" :key="item.id" class="recommend-item">
                    <img :src="item.picUrl" alt="" class="cover">
                    <span class="abstract">{{ item.name }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { swiper, swiperSlide } from 'vue-awesome-swiper';
    import { getBanner, getRecommendSongList } from '../../api/index.js';

    export default {
        data() {
            return {
                swiperOption: {
                    loop: true,
                    autoplay: true,
                    setWrapperSize :true,
                    speed: 500,
                    pagination: {
                        el: '.banner-pagination',
                        bulletClass: 'banner-pagination-bullet',
                        bulletActiveClass: 'banner-pagination-bullet-active'
                    }
                },
                banners: [],
                songList: []
            };
        },
        created() {
            this._getBanner();
        },
        mounted() {
            this._getRecommendSongList();
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
            }
        },
        components: {
            swiper,
            swiperSlide
        }
    }
</script>

<style lang="scss" scoped>
    @import '../../../css/function.scss';
    // @import '../../../css/swiper.min.scss';
    .header {
        display: flex;
        justify-content: center;
        align-items: center;
        height: setRem(86);
        background-color: #d73e34;

        .search-container {
            .search-input {
                width: setRem(535);
                height: setRem(60);
                border-radius: setRem(30);
                background-color: #e0655d;
            }
        }
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

    .recommend-container {
        padding: 0 setRem(12);

        .recommend-head {
            display: flex;
            align-items: center;
            line-height: setRem(100);
            
            .more {
                display: inline-block;
                width: setRem(32);
                height: setRem(32);
                margin-left: setRem(15);
                background-image: url('./cm2_discover_icn_more@2x.png');
                background-size: contain;
                background-repeat: no-repeat;
            }
        }

        .recommend-content {
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;

            .recommend-item {
                width: setRem(237);
                height: setRem(317);
                margin-bottom: setRem(30);

                .cover {
                    width: setRem(237);
                    height: setRem(237);
                    border-radius: setRem(8);
                }
                
                .abstract {
                    font-size: 12px;
                    color: #213434;            
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: flex; //作为弹性伸缩盒子模型显示。
                    -webkit-box-orient: vertical; //设置伸缩盒子的子元素排列方式--从上到下垂直排列
                    -webkit-line-clamp: 2; //显示的行

                }
            }
        }
    }
</style>
