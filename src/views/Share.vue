<template>
  <div class="Share">
    <div class="content-box">
      <img src="../assets/images/share.png" alt="" >
      <div class="music-box">
        <img class="music-img" :src="$store.state.currentMusicInfo.str_img_url" alt="">
        <div class="music-info">
          <div class="music-name c-flexFlow">{{$store.state.currentMusicInfo.str_poem_title}}</div>
          <!-- <div class="music-author">{{$store.state.currentMusicInfo.str_program_title}}</div> -->
          <div class="music-titm">
            {{$store.state.playedTime | formatMusicTime}} /
            {{$store.state.musicDuration | formatMusicTime}}
          </div>
        </div>
        <div class="right-control">
          <img src="../assets/images/pause.png" alt="" v-if="$store.state.currentMusicInfo.isPlay" @click="pauseMusic">
          <img src="../assets/images/play.png" alt="" v-else  @click="playMusic">
          <!-- <i class="iconfont icon-pause big-icon" v-if="$store.state.currentMusicInfo.isPlay"  @click="pauseMusic"></i>
          <i class="iconfont icon-play big-icon" v-else  @click="playMusic"></i> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data(){
    return{
      listParams: {
        page: 1,
        ilmit: 10,
        gatherid: 1,
      }
    }
  },
  created() {
    this.currentMucisID = this.$route.query.musicID;
    this.getDataList();
  },
  mounted(){
    getId:{
      var wxMsgUrl = "http://xxmm.momentx.com.cn/hyproject/public/";
      var msg = {
        title: '瞬间MomentX  黄轩的「阅读瞬间」', // 分享标题
        desc: '通过阅读，我们既向内心走，又向世界走。', // 分享描述
        link:'http://xxmm.momentx.com.cn/Share.php/?musicID='+this.$route.query.musicID, // 分享链接
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
    }
  },
  methods: {
    // 获取列表数据
    getDataList() {
      this.$http.get("musicList", this.listParams).then(
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
  }
}
</script>

<style lang="scss" scoped>
.Share{
  height:100%;
  padding:35px 35px;
  background: #CDE8E8;
  box-sizing: border-box;
  .content-box{
    img{
      width: 100%;
      height: 100%;
    }
    .music-box{
      position: relative;
      z-index: 100;
      width:250px;
      height:60px;
      padding:6px;
      display: flex;
      border-radius:10px;
      margin: -215px auto;
      box-sizing: border-box;
      background:rgba(255,255,255,1);
    }
    .music-img{
      width:48px;
      height:48px;
      border-radius:50%;
      margin-right: 8px;
      background:rgba(255,255,255,1);
      border:1px solid rgba(233, 233, 233, 1);
    }
    .music-info{
      flex:1;
      .music-name{
        font-size: 12px;
      }
      .music-author{
        padding-top: 3px;
        font-size: 10px;
        color:#4C4C4C;
      }
      .music-titm{
        padding-left: 5px;
        padding-top: 3px;
        font-size: 10px;
        color:#4C4C4C;
      }
    }
    .right-control{
      width:48px;
      height:48px;
      display: flex;
      border-radius:50%;
      color:#1FA286;
      align-items: center;
      justify-content: center;
      background:rgba(255,255,255,1);
      box-shadow:0px 0px 10px 0px rgba(18,162,134,0.28);
      .iconfont{
        font-size: 28px;
      }
      img{
        width: 30px;
        height: 30px;;
      }
    }
  }
}
</style>