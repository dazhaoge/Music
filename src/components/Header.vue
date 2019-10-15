<template>
  <div class="Header">
    <!-- <div class="content">
      <div class="header-left" @click="$router.go(-1)">
        <van-icon class="left-icon" name="arrow-left" />
        <span>返回</span>
      </div>
      <h3 class="center-title c-textFlow">瞬间MomentX「阅读瞬间」</h3>
      <van-icon name="ellipsis" />
    </div> -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      Toast:""
    }
  },
  //创建
  created() {
  },
}
</script>

<style lang="scss" scoped>
.Header{
  background: #1A191E;
  .content{
    height:64px;
    justify-content: flex-end;
    align-items: flex-end;
    padding:0 10px 10px;
    color:#fff;
    display: flex;
    .header-left{
      display: flex;
      font-size: 14px;
      align-items: center;
      .left-icon{
        font-size: 24px;
      }
    }
    .center-title{
      flex:1;
      padding:0 10px;
      font-size: 18px;
      text-align: center;
    }
  }
}
</style>
