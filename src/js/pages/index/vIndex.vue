<template>
    <div>
        <header class="header">
            <div class="search-container">
                <input type="text" class="search-input">
            </div>
        </header>
        <div class="tab-container">
            <div class="tab-item"></div>
            <div class="tab-item"></div>
            <div class="banner-container">
                <swiper :options="swiperOption" style="width: 363px;">
                    <swiper-slide class="banner-item" style="background: green;">
                        111
                    </swiper-slide>
                    <swiper-slide class="banner-item">
                        222
                    </swiper-slide>
                    <swiper-slide class="banner-item" style="background: blue;">
                        333
                    </swiper-slide>
                </swiper>
            </div>
        </div>
        <section class="section"></section>
    </div>
</template>

<script>
    import { swiper, swiperSlide } from 'vue-awesome-swiper';

    export default {
        data() {
            return {
                swiperOption: {
                    autoplay: true,
                    setWrapperSize :true,
                }
            };
        },
        mounted() {
            
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
        position: relative;
        height: setRem(302);
        background-color: #dd4439;

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
        }
    }
</style>
