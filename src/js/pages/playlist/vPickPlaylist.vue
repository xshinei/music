<template>
    <div class="wrapper" style="height: 100%;">
        <header class="header">
            <router-link to="/" class="back">取消</router-link>
            <h3 class="title">筛选歌单</h3>
        </header>
        
        <scroll :data="categories">
            <div class="pick-playlist-header">
                    <h2 class="all-playlist">{{ all.name }}</h2>
            </div>
            <div class="pick-playlist-body">
                    <ul v-for="(category, index) in categories" :key="index" class="tag-container">
                        <div class="super_tag_container">
                            <li class="super-tag">{{ category.super }}</li>
                        </div>
                        <div class="sub_right_tag_container">
                            <li v-for="item in category.sub_right" :key="item.name" class="sub-tag">
                                <p v-if="item.hot" class="hot"><span class="text">HOT</span></p>
                                {{ item.name }}
                            </li>
                        </div>
                        <div v-if="category.sub_bottom.length" class="sub_bottom_tag_container">
                            <li v-for="item in category.sub_bottom" :key="item.name" class="sub-tag">
                                <p v-if="item.hot" class="hot"><span class="text">HOT</span></p>
                                {{ item.name }}
                            </li>
                        </div>
                    </ul>
            </div>
        </scroll>
    </div>
</template>

<script>
    import { getCatlist } from '../../api/playlist';

    export default {
        data() {
            return {  
                categories: [],
                all: {}
             };
        },
        created() {
            // 歌单分类
            getCatlist().then(res => {
                if (res.code === 200) {
                    this.all = res.all;
                    this.initData(res);
                }
            });
        },
        methods: {
            initData(data) {
                const SUB_RIGHT_MAX_COUNT = 6;  // 主标签右边的最大子标签数
                const SUB_BOTTOM_ROW = 4;   // 标签一行所占的数目

                Object.keys(data.categories).forEach(key => {
                    let obj = {
                        super: data.categories[key],    // 主标签
                        sub_right: [],
                        sub_bottom: []
                    };

                    for(let item of data.sub) {
                        if (item.category === +key) {
                            if (obj.sub_right.length < SUB_RIGHT_MAX_COUNT) {
                                obj.sub_right.push(item);
                            }
                            else {
                                obj.sub_bottom.push(item);
                            }
                        }
                    }

                    // 若不能占满整行，剩余的用空对象填充
                    if (obj.sub_bottom.length % SUB_BOTTOM_ROW !== 0) {
                        const count = SUB_BOTTOM_ROW - obj.sub_bottom.length % SUB_BOTTOM_ROW;
                        for (let i = 0; i < count; i++) {
                            obj.sub_bottom.push({});
                        }
                    }

                    this.categories.push(obj);
                });
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import '../../../css/function.scss';

    .header {
        position: fixed;
        z-index: 1;
        top: 0;
        left: 0;
        right: 0;
        line-height: setRem(68);
        font-size: setRem(34);
        color: #fff;
        background-color: rgb(203, 41, 41);

        .back {
            position: absolute;
            left: setRem(32);
            color: #fff;
        }

        .title {
            text-align: center;
            font-size: setRem(34);
        }
    }

    .scroll-container {
        margin-top: setRem(68);
    }

    .pick-playlist-header {
        // height: setRem(120);
        padding: setRem(12);

        .all-playlist {
            display: flex;
            justify-content: center;
            align-items: center;
            height: setRem(120);
            border: setRem(2) solid rgb(198, 37, 38);
            font-size: setRem(34);
        }
    }

    .pick-playlist-body {

        .tag-container {
            display: flex;
            // flex-direction: column;
            flex-wrap: wrap;
            justify-content: space-between;
            // align-content: flex-start;
            padding-top: setRem(20);
            background-color: rgb(234, 235, 236);

            .sub_right_tag_container,
            .sub_bottom_tag_container {
                display: flex;
                flex-wrap: wrap;
                justify-content: space-between;
            }

            .sub_right_tag_container {
                width: setRem(563);
            }

            .sub_bottom_tag_container {
                li:nth-last-of-type(1) {
                    border-bottom: none;
                }

                li:nth-last-of-type(2) {
                    border-bottom: none;
                }

                li:nth-last-of-type(3) {
                    border-bottom: none;
                }

                li:nth-last-of-type(4) {
                    border-bottom: none;
                }
            }

            li {
                display: flex;
                justify-content: center;
                align-items: center;
                position: relative;
                width: setRem(186);
                border-bottom: setRem(1) solid rgb(223, 223, 223);
                background-color: #fff;
                overflow: hidden;

                .hot {
                    position: absolute;
                    top: 0.08rem;
                    left: -0.2rem;
                    width: setRem(100);
                    line-height: setRem(20);
                    background-color: rgb(198, 37, 38);
                    color: #fff;
                    text-align: center;
                    transform: rotate(-45deg);

                    .text {
                        font-size: setRem(16);
                        transform: scale(1.2);
                    }
                }
            }

            .super-tag {
                height: setRem(191);
                color: rgb(106, 107, 108);
            }

            .sub-tag {
                height: setRem(95);
            }
        }
    }
</style>

