var baseUrl = process.env.NODE_ENV == 'production' ? 'http://xxmm.momentx.com.cn' : 'http://xxmm.momentx.com.cn';

let urls = {
  musicList: "/laravel56-music/public/api/getMusicList",
}


for (let item in urls) {
  urls[item] = baseUrl + urls[item];
}

urls.host = baseUrl

export default urls