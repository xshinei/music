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
            <div class="swiper-container">
                <div class="swiper-wrapper">
                    <div class="swiper-slide">Slide 1</div>
                    <div class="swiper-slide">Slide 2</div>
                    <div class="swiper-slide">Slide 3</div>
                </div>
            </div>
        </div>
        <section class="section"></section>
    </div>
</template>

<script>
    import Swiper from 'swiper';
    import 'swiper/dist/css/swiper.min.css';

    export default {
        mounted() {
            const swiper = new Swiper('swiper-container');
        }
    }
</script>

<style lang="scss" scoped>
    @import '../../../css/function.scss';

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

        .swiper-container {
            position: absolute;
            top: setRem(92);
            left: 0;
            right: 0;
            margin: 0 auto;

            .swiper-slide {
                width: setRem(726);
                height: setRem(282);
                background-color: yellow;
            }
        }
    }
</style>
