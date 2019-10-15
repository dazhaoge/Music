<template>
  <div class="MusicList">
    <div :class="['banner-box', {'desc-banner': tabActive == 0}]"></div>
    <div class="tab-box">
      <van-tabs 
        v-model="tabActive"
        :line-width="26"
        title-active-color="#12A286"
        title-inactive-color="#888D8D">
        <van-tab title="品牌简介">
          <div class="logo_box">
            <img src="@/assets/images/logo.png" alt="">

          </div>
          <h2 class="title">/专注当下，用心生活/</h2>
          <div class="content">
              <p>“瞬间MomentX”是一个专注于研究、传播和践行“活在当下”的生活方式平台与机构，主张“生活永远是，也仅仅是现在经历的这一刻”。</p><br>
              <p>它由演员黄轩携手「为你读诗」共同创立，致力于通过新媒体传播、公众教育、出版、装置艺术与活动等多种形式，倡导“专注当下，用心生活”的生活方式。</p><br>
              <p>「我的阅读瞬间」是瞬间MomentX内容矩阵里的六大计划之一（另外五个为“专注力训练”“散步集”“生活里的X件小事”“瞬间集”“自然笔记”）。
                “阅读”不仅仅是读书，还是读风、读雨、读自然、读心情、读人生——“阅读”是我们观察世界、生活和自我的一种方式。</p><br>
              <p>如毛姆所说：一个人能观察落叶、羞花，从细微处欣赏一切，生活就不能把我们怎么样。</p>
              <p class="con_footer">There is no better time than the present.</p>
          </div>
        </van-tab>

        <van-tab title="往期节目">
          <div class="list-box">
            <div class="list-item"
              @click="checkMusic(item, index)"
              v-for="(item,index) in $store.state.musicList" :key="index">
              <div class="item-desc  little-box">
                <div class="lit-box">
                  <span class="isplay" v-if="item.isPlay">{{index + 1}}. </span>
                  <span class="item-number" v-else>{{index + 1}}. </span>
                  <span class="isplay" v-if="item.isPlay">{{item.str_poem_title}} </span>
                  <div class="desc-text" v-else>{{item.str_poem_title}} </div>
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
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>


<script>
import axios from "axios"
export default {
  //组件内部数据定义
  data(){ 
    return {
      tabActive:0,
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
    this.$route.query.tabIndex && (this.tabActive = 1)
    this.getDataList();
    this.getDataList(1,30,1,'')
    // console.log(this.listData,222)
  },
  mounted(){
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
    // 获取列表数据
    getDataList(page,ilmit,gatherid) {
      this.$http.post("musicList", ({"page":page ,"ilmit": ilmit,"gatherid": gatherid,'str':''})).then(
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

<style lang="scss">
.logo_box{
  width: 104px;
  height: 35px;
  margin: 0 auto;
  margin-top: 35px;

  img{
    width: 100%;
    height: 100%;
  }

}
.title{
  font-size:13px;
  color:#19A58A;
  line-height:30px;
  text-align: center;
  letter-spacing: 6px;
  margin-top: 16px;
}
.content{
  text-align: left;
  padding:5px 20px;
  line-height: 27px;
  font-size: 14px;
  color: #12A286;
  overflow-x: hidden;
  .con_footer{
    text-align: center;
    font-size: 8px;
    line-height: 46px;
    letter-spacing: 2.5px;
    margin-top: 20px;
  }
}

.MusicList{
  height:100%;
  overflow-x: hidden;
  .banner-box{
    height:193px;
    background: url("~@/assets/images/banner.png") no-repeat center;
    background-size: cover;
  }
  .desc-banner{
    background: url("~@/assets/images/list-desc.png") no-repeat center;
    background-size: cover;
  }
  // tab 部分样式重置
  .tab-box{
    .van-tabs__wrap{
      height:57px;
      border-bottom: 1px solid #C5C5C5;
      .van-tab{
        line-height: 57px;
        font-size: 16px;
      }
    }
    .van-tabs__line{
      background: #12A286;
    }
    .van-tabs__nav{
      background: #fbffff;
    }
  }

  // 列表部分
  .list-box{
    padding:10px 20px;
    .list-item{
      color:#B6B6B5;
      min-height:50px;
      display: flex;
      // align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #ADADAD;
      &:first-child{
        line-height: 75px;
        .desc-text{
          display: inline;
          margin-left: 15px;
          // line-height: 20px;
        }
        .img-box{
          margin-top: 15px; 
        }
      }
      &:last-child{
        border-bottom: none;
      }
      .litem-desc{
        display:flex;  
        align-items:center;
      }
      .item-number{
        font-size: 12px;
        color:#89888d;
      }
      .little-box{
        line-height: 1rem;
        .lit-box{
          float: left;
          width: 350px;
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
        display: inline-block;
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
}
</style>
