import $public from "@/utils/public.js"

let mutations = {
  //loading操作
  showLoading(state) {
    state.globalLoading += 1;
  },
  hideLoading(state) {
    state.globalLoading -= 1;
  },
  resetLoading(state) {
    state.globalLoading = 0;
  },

  // 设置全局音乐
  setMusic(state, music) {
    // 是否为同一音乐
    let isEqual = (state.currentMusicInfo.id == music.id);

    // 如果不等则播放
    if (!isEqual) {
      state.currentMusicInfo = music; //设置为全局
      state.playingTime = 0; //重置当前播放进度
      state.playedTime = 0; //重置已播放进度
      state.globalMusic.currentTime = 0; //重置时间
      state.globalMusic.src = music.str_music_url; //替换路径
      state.globalMusic.load(); //重载音频
      
      // 监听音频加载完毕
      state.globalMusic.oncanplay = () => {
         //音频总时长
        state.musicDuration = state.globalMusic.duration;
        //如果没有设置播放锁则播放
        if(!music.playLock) {
          state.globalMusic.play(); //播放
          state.currentMusicInfo.isPlay = true; //播放图标显示
        }
      }
      
      // 放入已播放列表 
      let playedIndex = state.playedList.indexOf(state.musicIndex);
      if (playedIndex >= 0) {
        state.playedList.splice(playedIndex, 1);
        state.playedList.push(state.musicIndex);
      } else {
        state.playedList.push(state.musicIndex);
      }

      console.log("正在播放音乐：" + state.musicIndex);

      // 添加音乐监听事件 (避免重复监听)
      if(!state.isPlayed) {
        state.isPlayed = true;
        this.commit("monitorPlaying"); //播放监听
        this.commit("monitorEnd"); //结束监听
      }

    } else if (isEqual && state.globalMusic.paused) {
      //如果为同一音频 且处于暂停状态 则播放
      music.isPlay = true;
      state.globalMusic.play();
    } else {
      // 暂停音频
      music.isPlay = false;
      state.globalMusic.pause();
    }
  },
  // 暂停音乐
  pauseMusic(state) {
    state.currentMusicInfo.isPlay = false
    state.globalMusic.pause();
  },
  // 播放音乐
  playMusic(state) {
    state.currentMusicInfo.isPlay = true;
    state.globalMusic.play();
  },
  // 设置音乐列表
  setMusicList(state, arr) {
    state.musicList = arr;
  },
  // 设置音乐进度
  setMusicProcess(state, value) {
    // 音频时长分成一百份   获取每份的单位值
    // 滑动值 = 传入的比例 * 单位
    let oneUnit = state.musicDuration/100;
    let time = oneUnit*value;

    // 当前播放进度 // 例： 189(秒)
    state.globalMusic.currentTime = time; 
  },
  // 设置当前音乐下标
  setMusicIndex(state, index) {
    state.musicIndex = index;
  },
  // 下一曲
  nextMusic(state, status) {

    // 如果为随机播放模式
    if (state.playType == "random") {
      state.musicIndex = $public.randomNumber(0, state.musicList.length - 1, state.musicIndex);
    } else {
      // 正常播放
      (state.musicList.length - 1 ==  state.musicIndex) ? state.musicIndex = 0 : state.musicIndex++;
    }

    let music = state.musicList[state.musicIndex]; 
    this.commit("setMusic", music); //更新音乐

  },
  // 上一曲
  prevMusic(state) {

    (state.musicIndex ==  0) ? state.musicIndex = (state.musicList.length - 1) : state.musicIndex--;

    // 更新当前音乐下标
    let music = state.musicList[state.musicIndex];
    this.commit("setMusic", music); //更新音乐
  },
  // 切换播放模式
  changePlayMode(state, status) {
    switch (status) {
      case "listLoop": state.playType = "listLoop"; break;
      case "oneLoop": state.playType = "oneLoop"; break;
      case "random": state.playType = "random"; break;
    }
  },
  // 监听音乐结束
  monitorEnd(state) {

    let that = this;
    state.globalMusic.addEventListener("ended" , function() {

      console.log("播放结束, 即将播放下一曲"); 
      switch(state.playType){
        case "listLoop": //列表循环
          that.commit("nextMusic", "next"); 
          break;
        case "oneLoop": //单曲循环
          state.globalMusic.currentTime = 0; //重置时间
          state.globalMusic.play(); //播放
          break;
        case "random":  //随机播放
          // 范围内生成随机下标 
          state.musicIndex = $public.randomNumber(0, state.musicList.length - 1, state.musicIndex);
          let music = state.musicList[state.musicIndex]; 
          that.commit("setMusic", music); //更新音乐
          break;
      }
    });
  },
  // 监听音乐播放
  monitorPlaying(state) {
    let that = this;
    state.globalMusic.addEventListener("timeupdate", function() {
      // 更新进度条  拿视频总长/当前时间*100% = 百分比
      // 后期可优化 节流
      let time = state.globalMusic.currentTime;
      state.playingTime = parseInt(time/state.musicDuration * 100);

      // 更新已播放时间
      state.playedTime = time;
    });
  },
};


export default mutations;
  