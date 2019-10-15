let state = {
  languageType: "cn",
  globalLoading: 0,

  isPlayed: false, //是否已播放过音乐
  playType: "listLoop", //播放模式  listLoop: 列表循环  oneLoop单曲循环  random随机播放
  musicList: [], //播放列表
  playedList: [], //上一曲列表
  playingTime: 0, //当前播放进度(控制条 单位%)
  playedTime: 0, //已播放进度(单位秒)
  musicDuration: 1, //音频总时长
  musicIndex: 0, //当前音乐下标
  currentMusicInfo: {}, //当前音频信息
  globalMusic: new Audio(), //当前播放音频

};

export default state;
  