<template>
    <div class="scroll-container" ref="scroll" style="height: 100%;">
        <div class="content">
            <slot></slot>
        </div>
    </div>
</template>

<script>
    import BScroll from 'better-scroll';

    export default {
        props: {
            /**
             * 1 滚动的时候会派发scroll事件，会截流。
             * 2 滚动的时候实时派发scroll事件，不会截流。
             * 3 除了实时派发scroll事件，在swipe的情况下仍然能实时派发scroll事件
             */
            probeType: {
                type: Number,
                default: 1
            },
            click: {    // 点击列表是否派发click事件
                type: Boolean,
                default: true
            },
            scrollX: {
                type: Boolean,
                default: false
            },
            listenScroll: { // 是否派发滚动事件
                type: Boolean,
                default: false
            },
            data: { // 列表的数据
                type: Array,
                default: null
            },
            pullup: {   // 是否派滚动到底部事件，用于上拉加载
                type: Boolean,
                default: false
            },
            pulldown: { // 是否派发顶部下拉事件，用于下拉刷新
                type: Boolean,
                default: false
            },
            beforeScroll: { // 是否派发列表滚动开始事件
                type: Boolean,
                default: false
            },
            refreshDelay: { // 数据更新后，刷新scroll的延时
                type: Number,
                default: 20
            }
        },
        mounted() {
            // 保证在DOM渲染完毕后初始化better-scroll
            setTimeout(() => {
                this._initScroll()
            }, 20);
        },
        methods: {
            _initScroll() {
                if (!this.$refs.scroll) {
                    return;
                }

                // 初始化
                this.scroll = new BScroll(this.$refs.scroll, {
                    probeType: this.probeType,
                    click: this.click,
                    scrollX: this.scrollX
                });
                
                // 是否派发滚动事件
                if (this.listenScroll) {
                    this.scroll.on('scroll', pos => {
                        this.$emit('scroll', pos);
                    });
                }
                
                // 是否派发滚动到底部事件，上拉加载
                if (this.pullup) {
                    this.scroll.on('scrollEnd', () => {
                        // 滚动到底部
                        if (this.scroll.y <= this.scroll.maxScrollY + 50) {
                            this.$emit('scrollToEnd');
                        }
                    });
                }

                // 是否派发顶部下拉事件，下拉刷新
                if (this.pulldown) {
                    this.scroll.on('touchEnd', pos => {
                        if (pos.y > 50) {
                            this.$emit('pulldown');
                        }
                    });
                }

                // 是否派发列表滚动的开始时间
                if (this.beforeScroll) {
                    this.scroll.on('beforeScrollStart', () => {
                        this.$emit('beforeScroll');
                    });
                }
            },
            disable() {
                this.scroll && this.scroll.disable();
            },
            enable() {
                this.scroll && this.scroll.enable();
            },
            refresh() {
                this.scroll && this.scroll.refresh();
            },
            scrollTo() {
                this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments);
            },
            scrollBy() {
                this.scroll && this.scroll.scrollBy.apply(this.scroll, arguments);
            },
            scrollToElement() {
                this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments);
            }
        },
        watch: {
            data(val) {
                setTimeout(() => {
                    this.refresh();
                }, this.refreshDelay);
            }
        }
    }
</script>

