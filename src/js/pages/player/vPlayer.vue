<template>
    <div class="wrap" ref="wrap">
        <div class="blur-background">
            <img :src="current_song.al.picUrl" width="100%" height="100%" alt="">
        </div>
        <audio :src="song_url" 
                autoplay 
                ref="audio" 
                @canplay="audioCanplay" 
                @timeupdate="audioTimeupdate">
        </audio>
        <div class="song-message-container">
            <img  class="bg-image" :src="current_song.al.picUrl" alt="">
        </div>
        <div class="option-container">
            <div class="love">
                <i class="fa fa-heart-o" aria-hidden="true"></i>
            </div>
            <div class="download">
                <i class="fa fa-download" aria-hidden="true"></i>
            </div>
            <div class="comment">
                <i class="fa fa-commenting-o" aria-hidden="true"></i>
            </div>
            <div class="more">
                <i class="fa fa-ellipsis-v" aria-hidden="true"></i>
            </div>
        </div>
        <div class="progress-container">
            <span class="current-time">{{ currentTime }}</span>
            <div class="progress-bar" ref="progressBar" @click="handleClickProgressBar">
                <div class="has-played" ref="progressHasPlayed"></div>
                <button class="btn" 
                        ref="progressBtn" 
                        @touchstart="handleProgressBtnStart">
                </button>
            </div>
            <span class="total-time">{{ duration }}</span>
        </div>
        <div class="tool-container">
            <div class="play-mode" @click="handleSwitchMode">
                <i class="icon fa fa-random" aria-hidden="true"></i>
            </div>
            <div class="backward" @click="handleSwitchSong(-1)">
                <i class="icon fa fa-step-backward" aria-hidden="true"></i>
            </div>
            <div class="play-pause" @click="handlePlay">
                <i v-if="togglePlay" class="icon fa fa-pause" aria-hidden="true"></i>
                <i v-else class="icon fa fa-play" aria-hidden="true"></i>
            </div>
            <div class="forward" @click="handleSwitchSong(1)">
                <i class="icon fa fa-step-forward" aria-hidden="true"></i>
            </div>
            <div class="play-list">
                <i class="icon fa fa-align-justify" aria-hidden="true"></i>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapState, mapMutations } from 'vuex';
    import { getSongUrl, getSongDetail } from '../../api/player.js';

    export default {
        data() {
            return {
                duration: '',   // 歌曲的总时长
                currentTime: '00:00', // 歌曲播放的当前时间
                togglePlay: true,  // true: play   false: pause
                play_list_cache: []
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
            // const params = {
            //     ids: this.$route.params.id
            // };
            // getSongDetail(params).then(res => {
            //     if (res.code === 200) {
                    
            //     }
            // });
            this.play_list_cache = this.play_list;
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
                    this.audio.play();
                }
            });
        },
        methods: {
            handlePlay() {
                this.togglePlay = !this.togglePlay;

                if (this.togglePlay) {
                    this.audio.play();
                }
                else {
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
                }
                else if (type === -1) {
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
                
                const percent = this.audio.currentTime / this.audio.duration;
                this.progressHasPlayed.style.width = percent * 100 + '%';

                const progressBtnWidth = parseInt(this.getCSS(this.progressBtn, 'width'));
                const playedWidth = parseInt(this.getCSS(this.progressHasPlayed, 'width'));
                this.progressBtn.style.left = progressBtnWidth / 2 + playedWidth + 'px';
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
                        const index = Math.floor( Math.random() * sequence_list.length );

                        list.push(this.play_list_cache[index]);
                        sequence_list.splice(index, 1);
                    }
                }

                this.play_list_cache = list;
                this.flag = true;
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
                animation-fill-mode:both;
            }
        }

        .option-container {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 setRem(118);
            font-size: setRem(37);
            color: rgb(217, 217, 218);
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

            .current-time, .total-time {
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

            .play-mode, .play-list {
                font-size: setRem(42);
                color: rgb(231, 231, 231);
            }

            .backward, .forward {
                font-size: setRem(48);
                color: rgb(231, 231, 231);
            }

            .play-pause {
                display: flex;
                justify-content: center;
                align-items: center;
                width: setRem(92);
                height: setRem(92);
                border: 1px solid #fff;
                border-radius: 50%;
                color: #fff;

                .icon {
                    font-size: setRem(39);
                    font-weight: lighter;

                    &.fa-play {
                        margin-left: setRem(12);
                    }
                }
            }
        }
    }
</style>


