<template>
  <div class="list-box">
            <div class="list-item"
              @click="checkMusic(item, index)"
              v-for="(item,index) in $store.state.musicList" :key="index">
              <div class="item-desc c-textFlow little-box">
                <div class="lit-box">
                  <span class="isplay" v-if="item.isPlay">{{index + 1}}. </span>
                  <span class="item-number" v-else>{{index + 1}}. </span>
                  <span class="isplay" v-if="item.isPlay">{{item.str_poem_title}} {{item.str_program_title}}</span>
                  <span class="desc-text" v-else>{{item.str_poem_title}} {{item.str_program_title}}</span>
                </div>
                <div class="img-box">
                  <img src="../assets/images/pause.png" alt="" v-if="item.isPlay">
                  <img src="../assets/images/play.png" alt="" v-else>
                </div>
              </div>
              <!-- <van-icon v-if="item.isPlay" name="pause-circle-o" class="icon" />
              <van-icon   name="play-circle-o" class="icon" /> -->
            </div>
          </div>
</template>

<script>
export default {
  name: "List",
  data(){
    return{
      listData: [], //列表数据
      currentMusic: {}, //当前播放对象
      listParams: {
        page: 1,
        ilmit: 100,
        gatherid: 1,
      }
    }
  },
  created() {
    this.getDataList();
  },
  methods:{
    // 获取列表数据
    getDataList() {
      this.$http.get("musicList", this.listParams).then(
        res => {
          let arr = res.response.data || [];
          // 设置音乐开关  
          arr.map(item => {
            item.isPlay = false;
            // 如果音频正在播放  则设置播放状态
            if ( 
              (item.id == this.$store.state.currentMusicInfo.id) && 
              !this.$store.state.globalMusic.paused 
            ) {
              item.isPlay = true;
            }
          });
          this.$store.commit("setMusicList", arr);
        },  
        err => {
          console.log(err);
        }
      );
    },
    // 点击音乐
    checkMusic(item, index) {
      // 如果与当前音乐一致则直接去详情页    否则切换音乐跳详情页
      if(this.$store.state.currentMusicInfo.id == item.id) {
        this.goDetais(item);
      } else {
        // 先把所有音乐暂停再去播放
        this.listData.map(item => {item.isPlay = false});
        this.$store.commit("setMusicIndex", index);
        this.$store.commit("setMusic", item);
        this.goDetais(item);
      }
    },
    // 去详情
    goDetais(item) {
      this.$router.push({
        name: "MusicDetails",
        query: {
          musicID: item.id
        }
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.list-box{
    background: #fbffff;;
    padding:10px 20px;
    .list-item{
      color:#B6B6B5;
      height:50px;
      // display: flex;
      // align-items: center;
      // justify-content: space-between;
      border-bottom: 1px solid #ADADAD;
      &:last-child{
        border-bottom: none;
      }
      .item-number{
        font-size: 12px;
        color:#89888d;
      }
      .little-box{
        line-height: 50px;
        .lit-box{
          float: left;
        }
        .img-box{
          width: 30px;
          height: 30px;
          float: right;
          img{
            width: 100%;
            height: 100%;
          }
        }
      }
      .desc-text{
        color:#89888d;
        font-size: 14px;
        font-weight:500;
        font-family: PingFangSC-Regular, sans-serif;
      }
      .isplay{
        font-size: 14px;
        color: #12A286;
        font-weight:500;
        font-family: PingFangSC-Regular, sans-serif;
      }
      .icon{
        font-size: 30px;
        color:#12A286;
        
      }
    }
    
    
    .isActive{
      color:#12A286;
      .item-number{
        color:#12A286;
      }
    }
  }
</style>