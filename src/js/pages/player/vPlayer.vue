<template>
    <div class="wrap" ref="wrap">
        <audio :src="songUrl" 
                autoplay 
                ref="audio" 
                @canplay="audioCanplay" 
                @timeupdate="audioTimeupdate">
        </audio>
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
    </div>
</template>

<script>
    import { getSongUrl } from '../../api/player.js';

    export default {
        data() {
            return {
                duration: '',   // 歌曲的总时长
                currentTime: '' // 歌曲播放的当前时间
            };
        },
        computed: {
            
        },
        created() {
            // 由于直接访问歌曲详情链接会403
            const urlTpl = 'http://music.163.com/song/media/outer/url?id=id.mp3';
            this.songUrl = urlTpl.replace(/id(?=\.mp3)/, this.$route.params.id);
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
                const barMarginLeft = parseInt(this.getCSS(this.progressBar, 'marginLeft'));
                const barOffsetleft = this.progressBar.offsetLeft;
                const offset = event.touches[0].clientX - barOffsetleft;

                this.moveProgressBtn(offset);
                this.moveProgressHasPlayed(offset);
            });

            /**
             *  wrap touchend事件
             */
            this.wrap.addEventListener('touchend', (event) => {
                this.setAudioTime();
                this.audio.play();
            });
        },
        methods: {
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
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import '../../../css/function.scss';

    .wrap {
        position: relative;
        height: 100%;

        &::before {
            content: '';
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            filter: blur(100px);
            background-color: rgb(163, 163, 163);
        }

        .progress-container {
            display: flex;
            justify-content: center;
            align-items: center;

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
    }
</style>


