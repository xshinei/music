<template>
    <div class="tab-bar-container">
        <div class="tab-bar-item find">
            <i class="icon"></i>
            <span class="text">发现</span>
        </div>
        <div class="tab-bar-item video">
            <i class="icon"></i>
            <span class="text">视频</span>
        </div>
        <div class="tab-bar-item mine">
            <i class="icon"></i>
            <span class="text">我的</span>
        </div>
        <div class="tab-bar-item friend">
            <i class="icon"></i>
            <span class="text">朋友</span>
        </div>
        <div class="tab-bar-item account">
            <i class="icon"></i>
            <span class="text">账号</span>
        </div>
    </div>
</template>

<script>
    export default {

    }
</script>

<style lang="scss" scoped>
    @import '../../../css/function.scss';

    .tab-bar-container {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 10;
        display: flex;
        justify-content: space-around;
        align-items: center;
        height: setRem(97);
        font-size: 12px;
        background-color: #f5f5f6;

        .tab-bar-item {
            display: flex;
            flex-direction: column;

            .icon {
                width: setRem(45);
                height: setRem(45);
                background-image: url('./cm4_btm_icn_music_prs@2x.png');
                background-size: 100%;
            }
        }
    }
</style>
