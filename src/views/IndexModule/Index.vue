<template>
  <div class="index">
    <main>
      <span @click="skip" class="countDown-box">跳过{{downTime}}s</span>
    </main>
  </div>
</template>

<script>
export default {
  data(){ 
    return {
      downTimer: "", //计时器
      downTime: 3, //秒数
    }
  },
  
  mounted(){
    this.countDown();
    getId:{
      var wxMsgUrl = "http://xxmm.momentx.com.cn/hyproject/public/";
      var msg = {
        title: '瞬间MomentX  黄轩的「阅读瞬间」', // 分享标题
        desc: '通过阅读，我们既向内心走，又向世界走。', // 分享描述
        link:'http://xxmm.momentx.com.cn/Share.php/?musicID=2156', // 分享链接
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
    // 倒计时
    countDown() {
      let that = this;
      that.downTimer = setInterval(() => {
        if(that.downTime == 0) {
          clearInterval(that.downTimer);
          this.$router.push({
            name: "MusicList"
          }); 
          return
        }
        that.downTime--;
      },1000);
    },
    // 跳过
    skip() {
      clearInterval(this.downTimer);//终止定时器
      this.$router.push({
        name: "MusicList"
      }); 
    }
  }
}
</script>

<style lang="scss" scoped>
.index{
  height:100%;
  width: 100%;
  position:relative;
  main{
    height:100%;
    width: 100%;
    background: url("~@/assets/images/start.png") no-repeat center;
    background-size: 100% 100%;
    .countDown-box{
      position:absolute;
      top:30px;
      right:28px;
      font-size: 14px;
      color:#FFFFFF;
      padding:5px 18px;
      border-radius:14px;
      background:rgba(0,0,0,0.7);
    }
  }
}
</style>
