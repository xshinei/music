<template>
    <div class="tab-bar-container">
        <div class="tab-bar-item find" :class="{'active': current}">
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
        data() {
            return {
                
            };
        },
        computed: {
            current() {
                return true;
            }
        }
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
        // align-items: center;
        height: setRem(97);
        font-size: 12px;
        background-color: #f5f5f6;

        .tab-bar-item {
            display: flex;
            flex-direction: column;

            .icon {
                width: setRem(45);
                height: setRem(45);
                margin-top: setRem(12);
                margin-bottom: setRem(6);
                background-size: 100%;
            }

            .text {
                margin-bottom: setRem(2);
            }

            &.active {
                color: #d33a31;
            }
        }

        .find {
            .icon {
                background-image: url('./cm4_btm_icn_discovery@2x.png');
            }

            &.active {
                .icon {
                    background-image: url('./cm4_btm_icn_discovery_prs@2x.png');
                }
            }
        }

        .video {
            .icon {
                background-image: url('./cm4_btm_icn_video@2x.png');
            }

            &.active {
                .icon {
                    background-image: url('./cm4_btm_icn_video_prs@2x.png');
                }
            }
        }

        .mine {
            .icon {
                background-image: url('./cm4_btm_icn_music@2x.png');
            }

            &.active {
                .icon {
                    background-image: url('./cm4_btm_icn_music_prs@2x.png');
                }
            }
        }

        .friend {
            .icon {
                background-image: url('./cm4_btm_icn_friend@2x.png');
            }

            &.active {
                .icon {
                    background-image: url('./cm4_btm_icn_friend_prs@2x.png');
                }
            }
        }

        .account {
            .icon {
                background-image: url('./cm4_btm_icn_account@2x.png');
            }

            &.active {
                .icon {
                    background-image: url('./cm4_btm_icn_account_prs@2x.png');
                }
            }
        }
    }
</style>
