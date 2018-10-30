<template>
    <div style="height: 100%;">
        <transition :name="transitionName">
            <router-view></router-view>
        </transition>
        <v-tab-bar></v-tab-bar>
    </div>
</template>

<script>
    import VTabBar from '../components/tabBar/vTabBar.vue';

    export default {
        data(){
            return {
                transitionName:''
            }
        },
        watch: {//使用watch 监听$router的变化
            $route(to, from) {
                //如果to索引大于from索引,判断为前进状态,反之则为后退状态
                if (to.meta.index > from.meta.index) {
                    //设置动画名称
                    this.transitionName = 'slide-left';
                } else{
                    this.transitionName = 'slide-right';
                }
            }
        },
        components: {
            VTabBar
        }
    };
</script>

<style lang="scss" scoped>
    .slide-right-enter-active,
    .slide-right-leave-active,
    .slide-left-enter-active,
    .slide-left-leave-active {
    // will-change: transform;
    transition: all 500ms;
    position: absolute;
    }
    .slide-right-enter {
    opacity: 0;
    transform: translate3d(-100%, 0, 0);
    }
    .slide-right-leave-active {
    opacity: 0;
    transform: translate3d(100%, 0, 0);
    }
    .slide-left-enter {
    opacity: 0;
    transform: translate3d(100%, 0, 0);
    }
    .slide-left-leave-active {
    opacity: 0;
    transform: translate3d(-100%, 0, 0);
    }
</style>


