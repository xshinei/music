<template>
    <div style="height: 100%;">
        <div class="header" :style="`background-image: url('${playlistDetail.coverImgUrl}');`">
            <div class="flex-container">
                <span class="back" @click="handleGoBack">
                    <i class="fa fa-angle-left" aria-hidden="true"></i>
                </span>
                <h3 class="title">歌单</h3>
                <div class="other-operate">
                <span class="more" @click="handleSlideUp">···</span>
                    <i class="local-play fa fa-align-left" aria-hidden="true"></i>
                </div>
            </div>
        </div>
        <scroll :data="playlistDetail.trackIds"
                :probe-type="3" 
                :listen-scroll="true" 
                @scroll="handleOutScroll" ref="outScroll"
                class="out-scroll">
            <div class="description-container" :style="`background-image: url('${playlistDetail.coverImgUrl}');`">
                    <div class="body-container">
                        <div class="cover-img">
                            <img :src="playlistDetail.coverImgUrl" alt="">
                        </div>
                        <div class="relevant-information">
                            <p class="description">{{ playlistDetail.name }}</p>
                            <div class="creator">
                                <img class="avatar" :src="playlistDetail.creator.avatarUrl" alt="">
                                <span class="name">{{ playlistDetail.creator.nickname }}</span>
                                <i class="go-detail fa fa-angle-right" aria-hidden="true"></i>
                            </div>
                        </div>
                    </div>
                    <div class="option-container">
                        <div class="option-item comment">
                            <i class="fa fa-commenting-o" aria-hidden="true"></i>
                            <span class="text">{{ playlistDetail.commentCount }}</span>
                        </div>
                        <div class="option-item share">
                            <i class="fa fa-share-square-o" aria-hidden="true"></i>
                            <span class="text">{{ playlistDetail.shareCount }}</span>
                        </div>
                        <div class="option-item download">
                            <i class="fa fa-download" aria-hidden="true"></i>
                            <span class="text">下载</span>
                        </div>
                        <div class="option-item multiple-choice">
                            <i class="fa fa-check-square-o" aria-hidden="true"></i>
                            <span class="text">多选</span>
                        </div>
                    </div>
            </div>
            
            <div class="playlist-container">
                <ul>
                    <li class="list-item list-head" ref="listHead">
                        <div class="all">
                            <div class="icon-container">
                                <i class="icon-play fa fa-play" aria-hidden="true"></i>
                            </div>
                            播放全部
                            <span class="count">(共{{playlistDetail.trackCount}}首)</span>
                        </div>
                        <a href="" class="collect">
                            <i class="fa fa-plus" aria-hidden="true"></i>
                            收藏({{playlistDetail.subscribedCount}})
                        </a>
                    </li>
                    <scroll :data="playlistDetail.trackIds" 
                            class="in-scroll" 
                            :listen-scroll="true"
                            @scroll="handleInScroll"
                            ref="inScroll">
                        <li class="list-item" 
                            v-for="(item, index) in playlistDetail.tracks" 
                            :key="item.id">
                            <div class="song-message" @click="handleToPlayer(item.id, index)">
                                <div class="index">{{ index }}</div>
                                <div class="song">
                                    <span class="name">{{ item.name }}</span>
                                    <p class="singer">
                                        {{ item.name }} - {{ item.ar[0].name }}
                                    </p>
                                </div>
                            </div>
                            <div class="more">
                                ···
                            </div>
                        </li>
                    </scroll>
                </ul>
            </div>
            
        </scroll>

        <div class="modal" v-show="modalShow" @click="handleSlideDown"></div>
        <transition name="slide">
            <div class="slide-container" v-show="slide">
                
            </div>
        </transition>
    </div>
</template>

<script>
    import { mapMutations } from 'vuex';
    import { getPlaylistDetail } from '../../api/playlist';

    export default {
        data() {
            return {
                playlistDetail: {},
                slide: false,
                modalShow: false,
                showListFixed: false
            };
        },
        created() {
            // 获取歌单详情
            const params = {
                id: this.$route.params.id
            };

            getPlaylistDetail(params).then(res => {
                if (res.code === 200) {
                    this.playlistDetail = res.playlist;

                    // 存入vuex
                    this.setPlayList(res.playlist.tracks);
                }
            });
        },
        methods: {
            handleSlideUp() {
                this.slide = true;
                this.modalShow = true;
            },
            handleSlideDown() {
                this.slide = false;
                this.modalShow = false;
            },
            handleGoBack() {
                this.$router.go(-1);
            },
            handleOutScroll(pos) {  // 监听outScroll滚动
                const outScroll = this.$refs.outScroll.scroll;

                // 判断是从下往上滑 且 滑动距离超过listHead的高度，即playlist滑动到顶端
                if (outScroll.movingDirectionY === 1 && pos.y < -256) {
                    // 关闭outScroll，开启inScroll
                    this.$refs.outScroll.disable();
                    this.$refs.inScroll.enable();

                    let inScroll = this.$refs.inScroll.$refs.scroll;
                    const listHead = this.$refs.listHead;

                    this.inScrollHeight || (this.inScrollHeight = inScroll.scroll.clientHeight);
                    
                    inScroll.style.height = document.documentElement.clientHeight - listHead.clientHeight + 'px';
                    this.$refs.inScroll.refresh();
                }
            },
            handleInScroll(pos) {   // 监听inScroll滚动
                const inScroll = this.$refs.inScroll.scroll;
                
                // 判断是从上往下滑动 且 纵轴坐标大于0，即已经滑到底
                if (inScroll.movingDirectionY === -1 && pos.y >= 0) {
                    this.$refs.inScroll.$refs.scroll.style.height = this.inScrollHeight + 'px';
                    this.$refs.inScroll.refresh();
                    this.$refs.inScroll.disable();

                    this.$refs.outScroll.enable();
                    this.$refs.outScroll.refresh();
                    this.$refs.outScroll.scroll.scrollTo(0, -256);
                }
            },
            handleToPlayer(id, index) {
                this.setCurrentIndex(index);

                this.$router.push({
                    path: `/player/${id}`
                });
            },
            ...mapMutations({
                setPlayList: 'SET_PLAY_LIST',
                setCurrentIndex: 'SET_CURRENT_INDEX'
            })
        }
    }
</script>

<style lang="scss" scoped>
    @import '../../../css/function';

    .header {
        position: fixed;
        z-index: 1;
        top: 0;
        box-sizing: border-box;
        width: 100%;
        padding: setRem(30);

        .flex-container {
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: setRem(52);
            color: #fff;
            background: transparent;

            .title {
                flex: 1 1 auto;
                text-align: center;
            }

            .back {
                flex: 0 0 10%;
                text-align: center;
                // font-size: setRem(44);
                transform: scale(2);
            }

            .other-operate {
                display: flex;
                flex: 0 0 20%;

                .more {
                    margin-right: setRem(46);
                }

                .local-play {
                    transform: rotate(-90deg);
                }
            }
        }
    }

    .out-scroll {
        margin-top: setRem(112);
    }

    .description-container {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        height: setRem(472);
        padding: setRem(30);
        // filter: blur(10px);
        color: #fff;
        background-position: 0 setRem(-112);

        .body-container {
            display: flex;
            align-items: center;
            height: setRem(278);

            .cover-img {
                flex: 0 0 auto;
                width: setRem(278);
                height: 100%;
                margin-right: setRem(30);

                img {
                    width: 100%;
                    height: 100%;
                    border-radius: 4px;
                    background-size: cover;
                }
            }

            .relevant-information {

                .description {
                    margin-bottom: setRem(50);
                    font-weight: 700;
                }

                .creator {
                    display: flex;
                    align-items: center;
                    color: rgb(169, 172, 178);

                    .avatar {
                        width: setRem(60);
                        height: setRem(60);
                        border-radius: 50%;
                    }

                    .name {
                        margin: 0 setRem(22) 0 setRem(12);
                        font-size: setRem(21);
                    }

                    .go-detail {

                    }
                }
            }
        }

        .option-container {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 setRem(50);

            .option-item {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;

                i {
                    font-size: setRem(38);
                }

                .text {
                    margin-top: setRem(16);
                    font-size: setRem(22);
                    color: rgb(169, 172, 178);
                }
            }
        }
    }

    .playlist-container {
        margin-top: -10px;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
        font-size: setRem(32);
        background-color: transparent;

        ul {
            position: relative;
            padding-top: setRem(110);
            border-top-left-radius: inherit;
            border-top-right-radius: inherit;
            background-color: rgb(250, 251, 253);

            .list-head {
                position: absolute;
                z-index: 1;
                top: 0;
                left: 0;
                width: 100%;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-top-left-radius: inherit;
                border-top-right-radius: inherit;
                background-color: rgb(250, 251, 253);

                .all {
                    display: flex;
                    align-items: center;

                    .icon-container {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        width: setRem(34);
                        height: setRem(34);
                        margin: 0 setRem(20);
                        border: setRem(1) solid #000;
                        border-radius: 50%;
                    }

                    .icon-play {
                        transform: scale(0.6);
                        color: #000;
                    }

                    .count {
                        font-size: setRem(26);
                        color: rgb(133, 133, 134);
                    }
                }

                .collect {
                    float: right;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    width: setRem(205);
                    height: 100%;
                    font-size: setRem(26);
                    border-top-right-radius: inherit;
                    color: #fff;
                    background:  linear-gradient(rgb(248, 57, 53), rgb(202, 39, 38));
                }
            }

            .list-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                height: setRem(109);
                border-bottom: setRem(1) solid rgb(219, 220, 222);
                color: rgb(133, 133, 134);

                .song-message {
                    display: flex;
                    
                    .index {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        width: setRem(34);
                        padding: 0 setRem(20);
                    }

                    .song {
                        
                        .name {
                            color: #000;
                        }

                        .singer {
                            font-size: setRem(23);
                        }
                    }
                }

                .more {
                    padding: 0 setRem(28);
                    letter-spacing: 2px;
                }
            }
        }

      
    }

    .modal {
        position: fixed;
        z-index: 1;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background-color: rgba(0, 0, 0, .3);
    }

    .slide-container {
        position: fixed;
        z-index: 2;
        bottom: 0;
        width: 100%;
        height: setRem(390);
        background-color: rgb(250, 251, 253);
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


