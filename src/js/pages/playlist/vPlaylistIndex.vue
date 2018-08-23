<template>
    <scroll :data="choicenessList" 
            :pullup="true" 
            @scrollToEnd="_getChoicenessList">
        <div class="quality-link-container">
            <div class="cover-img">
                <img :src="quality.coverImgUrl" alt="">
            </div>
            <div class="cover-message">
                <a href="" class="quality-link">
                    <i class="tag fa fa-star-o" aria-hidden="true"></i>
                    <span class="text">精品歌单</span>
                    <i class="arrow fa fa-angle-right" aria-hidden="true"></i>
                </a>
                <h2 class="title">{{ quality.name }}</h2>
                <span class="writer">{{ quality.copywriter }}</span>
            </div>
        </div>
        <div class="choiceness-list-container">
            <div class="choiceness-list-header">
                <div class="tag" @click="handleShowPickPlaylist">
                    <span class="text">{{ tag }}</span>
                    <i class="icon"></i>
                 </div>
                <div class="nav">
                    <div v-for="(item, index) in hotCatList" 
                        :key="item.id" 
                        class="item" @click="handleChangeTag(item.name)">
                        <a href="javascript: void(0);" class="text">{{ item.name }}</a>
                        <span v-if="index < 2" class="gap"></span>
                    </div>
                </div>
            </div>
            <div class="choiceness-list-body">
                <router-link v-for="item in choicenessList" 
                            :key="item.id" 
                            :to="`/playlistContent/${item.id}`"
                            tag="div"
                            class="choiceness-item">
                    <div class="bg" :style="`background-image: url('${item.coverImgUrl}')`">
                        <div class="creator">
                            <i class="fa fa-user-o" aria-hidden="true"></i>
                            <span class="name">{{ item.creator.nickname }}</span>
                        </div>
                        <div class="listen">
                            <i class="fa fa-headphones" aria-hidden="true"></i>
                            <span class="count">{{ item.playCount }}</span>
                        </div>
                    </div>
                    <div class="description">
                        <span class="text"> {{ item.name }} </span>
                    </div>
                </router-link>
            </div>
        </div>

        <transition name="slide">
            <pick-playlist v-show="showPickPlaylist" 
                            :show.sync="showPickPlaylist" 
                            :tag.sync="tag">
            </pick-playlist>
        </transition>
    </scroll>
</template>

<script>
    import { getChoicenessList, getQualityList, getHotCatList } from '../../api/playlist';
    import PickPlaylist from './vPickPlaylist.vue';

    export default {
        data() {
            return {
                quality: {},    // 精选歌单列表的第一个
                qualityList: [],    // 精选歌单列表
                choicenessList: [], // 歌单（网友精选碟）
                choicenessLimit: 0,  // 一次获取的数目
                showPickPlaylist: false,    // 是否显示歌单分类列表
                tag: '全部', // 歌单分类标签
                hotCatList: []
            };
        },
        created() {
            // 获取精选歌单列表
            getQualityList().then(res => {
                console.log(res);
                this.quality = res.playlists[0];
                this.qualityList = res.playlists;
            });

            // 获取热门分类标签
            getHotCatList().then(res => {
                if (res.code === 200) {
                    this.hotCatList = res.tags.slice(0, 3);
                }
            });
        },
        mounted() {
             // 获取歌单（网友精选碟）
           this._getChoicenessList();
        },
        methods: {
            handleShowPickPlaylist() {  // 显示歌单分类标签列表
                this.showPickPlaylist = true;
            },
            handleChangeTag(val) {  // 切换歌单分类标签
                this.tag = val;
            },
            _getChoicenessList() {  
                this.choicenessLimit += 10;

                const params = {
                    limit: this.choicenessLimit,
                    cat: this.tag
                };

                getChoicenessList(params).then(res => {
                    this.choicenessList = res.playlists;
                });
            }
        },
        watch: {
            tag() { // 监听标签变化，重新加载数据
                this.choicenessLimit = 0;
                this._getChoicenessList();
            }
        },
        components: {
            PickPlaylist
        }
    }
</script>

<style lang="scss" scoped>
    @import '../../../css/function.scss';

    .scroll-container {
        position: relative;
    }

    .quality-link-container {
        display: flex;
        align-items: center;
        height: setRem(292);
        padding: 0 setRem(20);
        background-color: rgb(43, 43, 43);

        .cover-img {
            flex: 0 0 auto;
            width: setRem(200);
            height: setRem(200);

            img {
                width: 100%;
                height: 100%;
                border-radius: 4px;
            }
        }

        .cover-message {
            height: setRem(200);
            margin-left: setRem(20);
            
            .quality-link {
                display: flex;
                justify-content: flex-start;
                align-items: center;
                line-height: setRem(64);
                vertical-align: top;
                
                .tag {
                    border: 1px solid rgb(224, 154, 72);
                    border-radius: 50%;
                    font-size: setRem(42);
                    color: rgb(224, 154, 72);
                }

                .text {
                    margin: 0 setRem(12);
                    font-size: setRem(38);
                    color: #fff;
                }

                .arrow {
                    font-size: setRem(32);
                    color: rgb(129, 129, 129);
                }
            }

            .title {
                margin-top: setRem(18);
                line-height: setRem(52);
                font-size: setRem(32);
                color: #fff;
            }

            .writer {
                line-height: setRem(42);
                font-size: setRem(22);
                color: rgb(129, 129, 129);
            }
        }
    }

    .choiceness-list-container {
        padding: 0 setRem(12);

        .choiceness-list-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: setRem(40) 0;

            .tag {
                display: flex;
                justify-content: center;
                width: setRem(150);
                line-height: setRem(56);
                border: setRem(2) solid rgb(189, 190, 190);
                margin-left: setRem(8);
                border-radius: setRem(84);
                font-size: setRem(28);
                text-align: center;

                .text {
                    
                }
            }

            .nav {
                display: flex;
                align-items: center;

                .item {
                    display: flex;

                    .text {
                        font-size: setRem(26);
                        color: rgb(81, 82, 83);
                    }

                    .gap {
                        height: setRem(28);
                        margin: 0 setRem(20);
                        padding: 0 setRem(1);
                        background-color: rgb(219, 220, 222);
                    }
                }
            }
        }

        .choiceness-list-body {
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;

            .choiceness-item {
                width: setRem(360);
                height: setRem(476);

                .bg {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    width: setRem(360);
                    height: setRem(360);
                    font-size: setRem(22);
                    background-repeat: no-repeat;
                    background-size: contain;
                    color: #fff;
                    border-radius: 4px;

                    .listen, .creator {
                        margin: 0 setRem(12);
                    }

                    .creator {
                        align-self: flex-end;
                        margin-bottom: setRem(13);
                    }

                    .listen {
                        margin-top: setRem(8);
                    }
                }

                .description {
                    width: setRem(312);
                    line-height: setRem(33);
                    font-size: setRem(26);
                    color: rgb(124, 124, 126);
                    padding: setRem(13.5) setRem(35) 0 setRem(13);
                    letter-spacing: setRem(2);
                }
            }
        }
    }

    .slide-enter, .slide-leave-to {
        transform: translateY(100%);
    }

    .slide-enter-to, .slide-leave {
        transform: translateY(0);
    }

    .slide-enter-active, .slide-leave-active {
        transition: transform .5s;
    }
</style>


