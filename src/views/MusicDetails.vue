<template>
  <div class="MusicDetails">
    <div class="lyric-box">
      <h3 class="music-name">{{$store.state.currentMusicInfo.str_poem_title}}</h3>
      <div v-html="$store.state.currentMusicInfo.str_content_info" class="music-info"></div>
    </div>
    <div class="bottom-control">

      <!-- 进度条 -->
      <div class="progress-box">
        <span class="progress-time">{{$store.state.playedTime | formatMusicTime}}</span>
        <div class="progress-slider-box">
          <van-slider
            class="progress-slider"
            active-color="#fff"
            @change="slideChange"
            @drag-start="pauseMusic"
            @drag-end="playMusic"
            v-model="$store.state.playingTime"
          >
            <div slot="button" class="custom-button">
              <div class="little-circle"></div>
            </div>
          </van-slider>
        </div>
        <span class="progress-time">{{$store.state.musicDuration | formatMusicTime}}</span>
      </div>

      <!-- 切换控制 -->
      <div class="button-box">
        <!-- 模式按钮 -->
        <div class="mode-box">
          <i
            @click="changePlayMode('oneLoop')"
            v-if="$store.state.playType == 'listLoop' "
            class="little-icon iconfont icon-listLoop"
          ></i>
          <i
            @click="changePlayMode('random')"
            v-if="$store.state.playType == 'oneLoop' "
            class="little-icon iconfont icon-oneLoop"
          ></i>
          <i
            @click="changePlayMode('listLoop')"
            v-if="$store.state.playType == 'random' "
            class="little-icon iconfont icon-random"
          ></i>
        </div>

        <i class="iconfont icon-prev big-icon"  @click="prevMusic" ></i>
        <i class="iconfont icon-pause big-icon" v-if="$store.state.currentMusicInfo.isPlay"  @click="pauseMusic"></i>
        <i class="iconfont icon-play big-icon" v-else  @click="playMusic"></i>
        <i class="iconfont icon-next big-icon"  @click="nextMusic" ></i>
        <i class="iconfont icon-liebiao little-icon" @click="backList()"></i>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data(){
    return {
      isPlay: true, //播放状态
      musicInfo: {}, //当前播放信息
      musicList: [], //音乐列表
      currentMucisID: "", //当前播放ID
      currentPlayIndex: "", //当前播放对象下标
      currentTime: 0, //当前播放进度
      listParams: {
        page: 1,
        ilmit: 100,
        gatherid: 1,
      }
    }
  },
  //路由钩子
  created() {
    this.currentMucisID = this.$route.query.musicID;
    // 如果刷新了页面
    if(!this.$store.state.currentMusicInfo.id) {
      this.getDataList();
    }
  },
  mounted(){
    this.setShare();
  },
  methods: {
    //设置分享内容
    setShare(){
      let that = this;
      var wxMsgUrl = "http://xxmm.momentx.com.cn/hyproject/public/";
      var msg = {
        title: '瞬间MomentX  黄轩的「阅读瞬间」', // 分享标题
        desc: '通过阅读，我们既向内心走，又向世界走。', // 分享描述
        link:'http://xxmm.momentx.com.cn/Share.php/?musicID=' + this.currentMucisID, // 分享链接
        imgUrl: 'http://music.momentx.com.cn/sjlogo.png', // 分享图标
        type: 'link', // 分享类型,music、video或link，不填默认为link
        dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
        success: function () {
            // 用户确认分享后执行的回调函数
            //  alert("分享成功")
        },
        cancel: function () {

        }
      };
      // 使用接口调用微信token
      $.ajax({
        type: "POST",
        url: wxMsgUrl+"getJsSign",
        data: { "returnurl": window.location.href },
        dataType: "json",
        async: true,
        success: function(data){
            // console.log(data)
          if( data.code == 1 ){
            wx.config({
              debug: false,
              appId: data.response.appid,
              timestamp: data.response.timestamp,
              nonceStr: data.response.noncestr,
              signature: data.response.signature,
              jsApiList: [
                  // 所有要调用的 API 都要加到这个列表中
                  'onMenuShareTimeline',
                  'onMenuShareAppMessage',
                  'stopRecord',
                  'onVoiceRecordEnd',
                  'playVoice',
                  'uploadVoice',
                  'translateVoice',
                  'hideMenuItems'
              ]
            });

            wx.ready(function () {
              // 在这里调用 API
              wx.onMenuShareTimeline(msg);
              wx.onMenuShareAppMessage(msg);
              wx.hideMenuItems({
                menuList: ['menuItem:copyUrl','menuItem:editTag','menuItem:delete','menuItem:originPage','menuItem:readMode', 'menuItem:openWithQQBrowser', 'menuItem:openWithSafari','menuItem:share:email','menuItem:share:brand','menuItem:share:qq','menuItem:share:QZone'] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮
              });
              // wxAudio.audioPlay();
              // wxAudio.audioPause();
            });
          }
        }
      });
    },
    // 获取列表数据
    getDataList() {
      this.$http.post("musicList", this.listParams).then(
        res => {
          let arr = res.response.data || [];
          // 设置音乐开关
          arr.map(item => {
            item.isPlay = false;
            // 查询当前播放音乐
            if (item.id == this.currentMucisID) {
              item.playLock = true; //添加播放锁
              this.$store.commit("setMusic", item);
            }
          });
          this.$store.commit("setMusicList", arr);
        },
        err => {
          console.log(err);
        }
      );
    },
    // 暂停音乐
    pauseMusic() {
      this.$store.commit("pauseMusic");
    },
    // 播放音乐
    playMusic() {
      this.$store.commit("playMusic");
    },
    // 下一曲
    nextMusic() {
      this.$store.commit("nextMusic");
      let musicID = this.$store.state.currentMusicInfo.id;
      this.currentMucisID = musicID;
      this.$router.push({
        query:{ musicID: musicID}
      });
      this.setShare()
      console.log(this.currentMucisID,111)
    },
    // 上一曲
    prevMusic() {
      this.isPlay = true;
      this.$store.commit("prevMusic");
      let musicID = this.$store.state.currentMusicInfo.id;
      this.currentMucisID = musicID;
      this.$router.push({
        query:{ musicID: musicID}
      });
      this.setShare()
    },
    // 滑动进度条
    slideChange(value) {
      this.$store.commit("setMusicProcess",value);
    },
    // 切换播放模式
    changePlayMode(status) {
      //  listLoop: 列表循环  oneLoop单曲循环  random随机播放
      switch (status) {
        case "listLoop": this.$toast({message: "列表循环", position:"bottom"}); break;
        case "oneLoop": this.$toast({message: "单曲循环", position:"bottom"}); break;
        case "random": this.$toast({message: "随机播放", position:"bottom"}); break;
      }
      this.$store.commit("changePlayMode", status);
    },
    backList(){
      this.$router.push({
        name:'List'
      })
    }
  }
}
</script>


<style lang="scss" scoped>
.MusicDetails{
  height:100%;
  display: flex;
  flex-direction: column;
  background: url("~@/assets/images/bg.png") no-repeat center;
  background-size: cover;
  .lyric-box{
    flex:1;
    color:#fff;
    overflow-x: hidden;
    padding: 30px 40px;
    .music-name{
      padding-bottom: 20px;
    }
  }

  .music-info{
    font-size: 15px;
    line-height: 24px;
    color:#B3B3B3;
    font-weight: normal;
  }

  // 底部切换控制部分
  .bottom-control{
    height:170px;
    padding:30px 16px 0;

    // 进度条部分
    .progress-box{
      display: flex;
      align-items: center;
      .progress-time{
        font-size: 12px;
        color:#FEFEFE;
      }
      .progress-slider-box{
        flex:1;
        padding:0 15px;
        .progress-slider{
          width:100%;
        }
      }

      // 自定义进度按钮
      .custom-button{
        width:18px;
        height:18px;
        display: flex;
        border-radius:50%;
        align-items: center;
        justify-content: center;
        background:rgba(31,162,134,0.5);
        .little-circle{
          width:12px;
          height:12px;
          background:rgba(31,162,134,1);
          border-radius:50%;
        }
      }
    }


    .button-box{
      color:#fff;
      padding: 45px 20px 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .little-icon{
        font-size: 18px;
      }
      .big-icon{
        font-size: 32px;
      }
      .icon-pause,.icon-play{
        font-size: 40px;
      }
      .icon-next,.icon-prev{
         font-size: 26px;
      }
    }

    .mode-box{
      width:25px;
      height:25px;
      display: flex;
      align-items: center;
      justify-content: center;
      >.iconfont{
        font-size: 22px;
      }
    }
  }

}
</style>
