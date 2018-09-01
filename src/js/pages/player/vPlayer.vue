<template>
    <div class="wrap" ref="wrap">
        <div class="blur-background">
            <img :src="current_song.al.picUrl" width="100%" height="100%" alt="">
        </div>
        <audio :src="song_url" autoplay ref="audio" @canplay="audioCanplay" @timeupdate="audioTimeupdate">
        </audio>
        <div class="content-container" v-show="false">
            <div class="song-message-container">
                <img class="bg-image" :src="current_song.al.picUrl" alt="">
            </div>

            <div class="option-container">
                <div class="love">
                    <img src="./cm2_play_icn_love@2x.png" width="100%" height="100%" alt="">
                </div>
                <div class="download">
                    <img src="./cm2_list_detail_icn_dld.png" width="100%" height="100%" alt="">
                </div>
                <div class="comment">
                    <img src="./cm2_list_detail_icn_cmt@2x.png" width="100%" height="100%" alt="">
                </div>
                <div class="more">
                    <img src="./cm2_play_icn_more@2x.png" width="100%" height="100%" alt="">
                </div>
            </div>
        </div>

        <div class="lyric-container">
            <scroll ref="scroll">
                <div class="content">
                    <p class="lyric" 
                        v-for="(item, index) in lyricList" 
                        :key="index" 
                        :class="{'current': currentLyricIndex === index}">
                        {{ item.lyric }}
                    </p>
                </div>
            </scroll>
        </div>

        <div class="progress-container">
            <span class="current-time">{{ currentTime }}</span>
            <div class="progress-bar" ref="progressBar" @click="handleClickProgressBar">
                <div class="has-played" ref="progressHasPlayed"></div>
                <button class="btn" ref="progressBtn" @touchstart="handleProgressBtnStart">
                </button>
            </div>
            <span class="total-time">{{ duration }}</span>
        </div>

        <div class="tool-container">
            <div class="play-mode" @click="handleSwitchMode">
                <img v-if="play_mode === 0" src="./cm2_icn_loop@2x.png" width="100%" height="100%" alt="">
                <img v-else-if="play_mode === 1" src="./cm2_icn_one@2x.png" width="100%" height="100%" alt="">
                <img v-else-if="play_mode === 2" src="./cm2_icn_shuffle@2x.png" width="100%" height="100%" alt="">
            </div>
            <div class="backward" @click="handleSwitchSong(-1)">
                <img src="./cm2_play_btn_prev@2x.png" width="100%" height="100%" alt="">
            </div>
            <div class="play-pause" @click="handlePlay">
                <img v-if="togglePlay" src="./cm2_runfm_btn_pause@2x.png" width="100%" height="100%" alt="">
                <img v-else src="./cm2_runfm_btn_play@2x.png" width="100%" height="100%" alt="">
            </div>
            <div class="forward" @click="handleSwitchSong(1)">
                <img src="./cm2_runfm_btn_next@2x.png" width="100%" height="100%" alt="">
            </div>
            <div class="play-list">
                <img src="./cm2_icn_list@2x.png" width="100%" height="100%" alt="">
            </div>
        </div>
    </div>
</template>

<script>
    import {
        mapState,
        mapMutations
    } from 'vuex';
    import {
        getSongUrl,
        getSongDetail,
        getLyric
    } from '../../api/player.js';

    export default {
        data() {
            return {
                duration: '', // 歌曲的总时长
                currentTime: '00:00', // 歌曲播放的当前时间
                togglePlay: true, // true: play   false: pause
                play_list_cache: [],
                lyricList: [],  // 
                currentLyricIndex: 0,   // mark the position of lyric    
            };
        },
        computed: {
            current_song() {
                return this.play_list[this.current_index];
            },
            ...mapState([
                'play_list',
                'current_index',
                'play_mode'
            ]),
            song_url() {
                const URL_TPL = 'http://music.163.com/song/media/outer/url?id=id.mp3';

                return URL_TPL.replace(/id(?=\.mp3)/, this.current_song.id);
            },
        },
        created() {
            this.play_list_cache = this.play_list;

            const params = {
                id: this.current_song.id
            };

            getLyric(params).then(res => {
                if (res.code === 200) {
                    this.lyricList = this.transformLyric(res.lrc.lyric).filter(item => item);
                }
            });
        },
        mounted() {
            this.wrap = this.$refs.wrap;
            this.audio = this.$refs.audio;
            this.progressBar = this.$refs.progressBar;
            this.progressHasPlayed = this.$refs.progressHasPlayed;
            this.progressBtn = this.$refs.progressBtn;
            /**
             *  wrap touchmove事件
             */
            this.wrap.addEventListener('touchmove', (event) => {
                if (this.start) {
                    const barMarginLeft = parseInt(this.getCSS(this.progressBar, 'marginLeft'));
                    const barOffsetleft = this.progressBar.offsetLeft;
                    const offset = event.touches[0].clientX - barOffsetleft;

                    this.moveProgressBtn(offset);
                    this.moveProgressHasPlayed(offset);
                }
            });

            /**
             *  wrap touchend事件
             */
            this.wrap.addEventListener('touchend', (event) => {
                if (this.start) {
                    this.start = false;
                    this.setAudioTime();
                    this.setLyricPosition();
                    this.audio.play();
                }
            });
        },
        methods: {
            /**
             *  click event handler
             *  switch song play or pause
             */
            handlePlay() {
                this.togglePlay = !this.togglePlay;

                if (this.togglePlay) {
                    this.audio.play();
                } else {
                    this.audio.pause();
                }
            },
            /**
             *  click event
             *  type = 1: next song  type = -1: prev song
             */
            handleSwitchSong(type) {
                let index = this.current_index;
                const len = this.play_list.length;

                if (type === 1) {
                    index === len - 1 ? index = 0 : index++;
                } else if (type === -1) {
                    index === 0 ? index = len - 1 : index--;
                }

                this.setCurrentIndex(index);
            },
            /**
             *  click event
             *  0: sequence    1: single    2: random
             */
            handleSwitchMode() {
                const mode_list = [0, 1, 2];
                const len = mode_list.length;
                let mode = this.play_mode + 1;

                mode = mode_list[mode % len];

                mode === 2 && this.randomPlayList();

                this.setPlayMode(mode);
            },
            /**
             *  progress-bar点击事件
             *  调整歌曲进度到点击位置
             */
            handleClickProgressBar(event) {
                const offsetLeft = this.progressBar.offsetLeft;
                const width = parseInt(this.getCSS(this.progressBar, 'width'));
                const offset = event.clientX - offsetLeft;

                this.moveProgressHasPlayed(offset);
                this.moveProgressBtn(offset);
                this.setAudioTime();
                this.setLyricPosition();
                this.audio.play();
            },
            /**
             *  progress-btn touchstart事件
             *  暂停歌曲
             */
            handleProgressBtnStart(event) {
                this.start = true;
                this.audio.pause();
            },
            /**
             *  audio canplay事件
             *  音频可以播放时，获取音频的总时长
             */
            audioCanplay() {
                this.duration = this.format(this.audio.duration);
            },
            /**
             *  auto timeupdate事件
             *  歌曲进度改变时触发
             *  根据歌曲进度，调整进度条与按钮的位置
             */
            audioTimeupdate() {
                this.getCurrentTime();

                // progress
                const percent = this.audio.currentTime / this.audio.duration;
                this.progressHasPlayed.style.width = percent * 100 + '%';

                // button
                const progressBtnWidth = parseInt(this.getCSS(this.progressBtn, 'width'));
                const playedWidth = parseInt(this.getCSS(this.progressHasPlayed, 'width'));
                this.progressBtn.style.left = progressBtnWidth / 2 + playedWidth + 'px';

                // lyric
                const index = this.currentLyricIndex + 1;
                const next = this.lyricList[index];
                
                if (next && this.audio.currentTime >= next.sequence) {
                    const el = document.getElementsByClassName('lyric');
                    next.lyric && this.$refs.scroll.scrollToElement(el[index], 300, false, true);
                    this.currentLyricIndex = index;
                }
            },
            /**
             *  accroding to audio.currentTime
             *  find the index of lyric and scroll to
             */
            setLyricPosition() {
                const lyricList = this.lyricList;
                const len = lyricList.length;

                for (let i = 0; i < len; i++) {
                    if (lyricList[i].sequence >= this.audio.currentTime) {
                        const el = document.getElementsByClassName('lyric');
                        this.$refs.scroll.scrollToElement(el[i-1], 300, false, true);
                        this.currentLyricIndex = i;

                        break;
                    }
                }
            },
            /**
             *  根据进度条位置，调整歌曲进度
             */
            setAudioTime() {
                const hasPlayedWidth = parseInt(this.progressHasPlayed.style.width);
                const barWidth = parseInt(this.getCSS(this.progressBar, 'width'));

                const percent = hasPlayedWidth / barWidth;
                const totalTime = this.audio.duration;

                this.audio.currentTime = totalTime * percent;
            },
            /**
             *  根据 distance 在合适范围内调整进度条位置
             */
            moveProgressHasPlayed(distance) {
                const barWidth = parseInt(this.getCSS(this.progressBar, 'width'));

                if (distance >= 0 && distance <= barWidth) {
                    this.progressHasPlayed.style.width = distance + 'px';
                }
            },
            /**
             *  根据 distance 在合适范围内调整按钮位置
             */
            moveProgressBtn(distance) {
                const btnLeft = parseInt(this.getCSS(this.progressBtn, 'left'));
                const btnWidth = parseInt(this.getCSS(this.progressBtn, 'width'));
                const barWidth = parseInt(this.getCSS(this.progressBar, 'width'));

                if (distance >= 0 && distance <= barWidth) {
                    this.progressBtn.style.left = distance + btnWidth / 2 + 'px';
                }
            },
            /**
             *  获取mm:ss格式的歌曲进度时间
             */
            getCurrentTime() {
                this.currentTime = this.format(this.audio.currentTime);
            },
            /**
             *  时间格式转换
             *  以秒记录的number类型 -> mm:ss
             */
            format(val) { // number -> mm:ss
                val = Math.ceil(val);
                let minute = Math.floor(val / 60);
                let second = val % 60;

                minute = minute > 9 ? minute : `0${minute}`;
                second = second > 9 ? second : `0${second}`;

                return `${minute}:${second}`;
            },
            /**
             *  mm:ss -> number
             */
            reformat(val) {
                const arr = val.split(':');
                const minute = parseFloat(arr[0]);
                const second = parseFloat(arr[1]);

                return minute * 60 + second;
            },
            /**
             *  获取计算后的css属性值
             */
            getCSS(ele, attr) {
                return window.getComputedStyle(ele)[attr];
            },
            /**
             *  if calling first or component refresh or play_list change
             */
            randomPlayList() {
                const list = [];

                if (!this.flag) {
                    const play_list_len = this.play_list_cache.length;
                    const sequence_list = [];

                    for (let i = 0; i < play_list_len; i++) {
                        sequence_list.push(i);
                    }

                    while (sequence_list.length) {
                        const index = Math.floor(Math.random() * sequence_list.length);

                        list.push(this.play_list_cache[index]);
                        sequence_list.splice(index, 1);
                    }
                }

                this.play_list_cache = list;
                this.flag = true;
            },
            transformLyric(lyricStr) {
                return lyricStr.split('\n').map(item => {
                    if (item && item.match(/\[[0-9\.:]{5,}\]/)) {
                        const sequence = item.match(/\[[0-9\.:]{5,}\]/)[0];
                        const lyric = item.slice(item.lastIndexOf(']') + 1);

                        return {
                            sequence: this.reformat(sequence.slice(1, -1)),
                            lyric
                        }
                    }
                });
            },
            ...mapMutations({
                setPlayList: 'SET_PLAY_LIST',
                setCurrentIndex: 'SET_CURRENT_INDEX',
                setPlayMode: 'SET_PLAY_MODE'
            })
        },
        watch: {
            play_list(val) {
                this.play_list_cache = val;
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import '../../../css/function.scss';

    @keyframes rotate {
        from {
            transform: rotate(0deg);
        }

        to {
            transform: rotate(360deg);
        }
    }

    .wrap {
        position: relative;
        height: 100%;

        .blur-background {
            content: '';
            position: absolute;
            z-index: -1;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            filter: blur(20px);
            background-color: #000;
        }

        .song-message-container {
            display: flex;
            justify-content: center;
            align-items: center;

            .bg-image {
                display: block;
                width: setRem(608);
                height: setRem(608);
                border-radius: 50%;
                animation: rotate 30s linear infinite;
                animation-fill-mode: both;
            }
        }

        .option-container {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 setRem(118);

            div {
                width: setRem(80);
                height: setRem(80);
            }
        }

        .lyric-container {
            height: setRem(900);
            overflow: hidden;

            .content {
                display: flex;
                flex-direction: column;
                align-items: center;
                padding: setRem(450) 0;

                .lyric {
                    width: 60%;
                    padding: setRem(20) 0;
                    text-align: center;
                    font-size: setRem(28);
                    color: #e8e8e8;

                    &.current {
                        color: #fff;
                    }
                }
            }
        }

        .progress-container {
            display: flex;
            justify-content: center;
            align-items: center;
            margin: setRem(20) 0;

            .progress-bar {
                position: relative;
                width: setRem(536);
                height: setRem(4);
                margin: 0 setRem(29);
                background-color: rgb(165, 165, 166);

                .has-played {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 0;
                    height: 100%;
                    background-color: rgb(198, 37, 38);
                }

                .btn {
                    position: absolute;
                    z-index: 2;
                    top: 50%;
                    left: 0;
                    transform: translate(-50%, -50%);
                    width: setRem(32);
                    height: setRem(32);
                    border: setRem(12) solid #fff;
                    border-radius: 50%;
                    background-color: rgb(198, 37, 38);
                }
            }

            .current-time,
            .total-time {
                width: setRem(64);
                font-size: setRem(16);
                // color: rgb(230, 230, 230);
            }
        }

        .song-message-container {
            height: setRem(878);
        }

        .tool-container {
            display: flex;
            justify-content: space-around;
            align-items: center;
            height: setRem(170);

            .play-mode,
            .backward,
            .play-pause,
            .forward,
            .play-list {
                width: setRem(94);
                height: setRem(94);
            }

            .play-pause {
                width: setRem(144);
                height: setRem(144);
            }
        }
    }
</style>