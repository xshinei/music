<template>
    <div style="height: 100%;">
        <div class="scroll" style="height: 100%;">
            <div class="content">
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
                        <router-link to="/pickPlaylist" tag="div" class="tag">
                            <span class="text">全部歌单</span>
                            <i class="icon"></i>
                        </router-link>
                        <div class="nav">
                            <a href="#" class="item">华语</a>
                            <span class="gap"></span>
                            <a href="#" class="item">ACG</a>
                            <span class="gap"></span>
                            <a href="#" class="item">影视原声</a>
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
            </div>
        </div>
    </div>
</template>

<script>
    import BScroll from 'better-scroll';
    import { getChoicenessList, getQualityList } from '../../api/playlist';

    export default {
        data() {
            return {
                quality: {},    // 精选歌单列表的第一个
                qualityList: [],    // 精选歌单列表
                choicenessList: [], // 歌单（网友精选碟）
                choicenessLimit: 0  // 一次获取的数目
            };
        },
        created() {
            // 获取精选歌单列表
            getQualityList().then(res => {
                this.quality = res.playlists[0];
                this.qualityList = res.playlists;
            });
            
           
        },
        mounted() {
             // 获取歌单（网友精选碟）
           this._getChoicenessList();
        },
        methods: {
            _getChoicenessList() {
                this.choicenessLimit += 10;

                getChoicenessList({limit: this.choicenessLimit}).then(res => {
                    this.choicenessList = res.playlists;
                    this.$nextTick(() => {
                        // 配置BScroll
                        if (!this.scroll) {
                            this.scroll = new BScroll('.scroll', {
                                click: true
                            });
                            
                            // 监听下拉刷新事件
                            this.scroll.on('touchEnd', (pos) => {
                                
                                // 下拉动作
                                if (Math.abs(pos.y) > 50) {
                                    this._getChoicenessList()
                                }
                            });
                        } else {
                            this.scroll.refresh()
                        }
                    });
                });
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import '../../../css/function.scss';

    .quality-link-container {
        display: flex;
        align-items: center;
        height: setRem(292);
        padding: 0 setRem(20);
        background-color: rgb(43, 43, 43);

        .cover-img {
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
</style>


