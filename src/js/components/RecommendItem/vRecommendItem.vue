<template>
  <div class="recommend-container" v-show="innerList.length">
    <div class="recommend-head">
      <span class="title">{{ title }}</span>
      <i class="more"></i>
    </div>
    <div class="recommend-content">
      <div v-for="item in innerList.slice(0, 6)" :key="item.id" class="recommend-item">
        <img :src="item.picUrl" alt="" class="cover">
        <span class="abstract">{{ item.name }}</span>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      title: {
        type: String,
        required: true
      },
      list: {
        type: Array,
        required: true
      }
    },
    data() {
      return {
          innerList: []
      };
    },
    watch: {
      list(val) {
        this.innerList = val;
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../../css/function.scss';

  .recommend-container {
    padding: 0 setRem(12);

    .recommend-head {
      display: flex;
      align-items: center;
      line-height: setRem(100);

      .more {
        display: inline-block;
        width: setRem(32);
        height: setRem(32);
        margin-left: setRem(15);
        background-image: url('./cm2_discover_icn_more@2x.png');
        background-size: contain;
        background-repeat: no-repeat;
      }
    }

    .recommend-content {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;

      .recommend-item {
        width: setRem(237);
        height: setRem(317);
        margin-bottom: setRem(30);

        .cover {
          width: setRem(237);
          height: setRem(237);
          border-radius: setRem(8);
        }

        .abstract {
          font-size: 12px;
          color: #213434;
          overflow: hidden;
          text-overflow: ellipsis;
          display: flex; //作为弹性伸缩盒子模型显示。
          -webkit-box-orient: vertical; //设置伸缩盒子的子元素排列方式--从上到下垂直排列
          -webkit-line-clamp: 2; //显示的行

        }
      }
    }
  }
</style>