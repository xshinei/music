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
        <section class="section"></section>
    </div>
</template>

<script>
    import { swiper, swiperSlide } from 'vue-awesome-swiper';
    import { getBanner } from '../../api/index.js';

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
                banners: []
            };
        },
        created() {
            this._getBanner();
        },
        mounted() {
            
        },
        methods: {
            _getBanner() {
                getBanner().then(res => {
                    if (res.code === 200) {
                        this.banners = res.banners;
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
</style>
