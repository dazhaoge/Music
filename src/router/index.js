import Vue from "vue";
import Router from "vue-router";
import $public from "@/utils/public.js"
Vue.use(Router);


let router = new Router({
  // mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "index",
      component: () => import(/* webpackChunkName: "index" */ "@/views/IndexModule/Index.vue"),
      meta: {
        title: "首页",
        auth: false,
        keepAlive: false
      }
    },
    {
      path: "/musicList",
      name: "MusicList",
      component: () => import( "@/views/MusicList.vue"),
      meta: {
        title: "音乐列表",
        auth: false,
        keepAlive: false
      }
    },
    {
      path: "/MusicDetails",
      name: "MusicDetails",
      component: () => import( "@/views/MusicDetails.vue"),
      meta: {
        title: "音乐详情",
        auth: false,
        keepAlive: false
      }
    },
    {
      path: "/Share",
      name: "Share",
      component: () => import( "@/views/Share.vue"),
      meta: {
        title: "音乐分享",
        auth: false,
        keepAlive: false
      }
    },
    {
      path: "/list",
      name: "List",
      component: () => import( "@/views/List.vue"),
      meta: {
        title: "音乐列表",
        auth: false,
        keepAlive: false
      }
    },
    
    
  ]
});

// 公共导航守卫
router.beforeEach((to, from, next) => {
  // 路由发生改变修改页面的title
  if (to.meta.title) {
    document.title = to.meta.title;
  }

  // 保存当前页面 url，用于后续跳转
  if (["/login", "/register"].indexOf(to.path) === -1) {
    $public.setSession("backUrl", to.fullPath);
  }


  next();

  // 登录校验
  // if (to.meta.auth) {
  //   // 需要登录
  //   if (isToken) {
  //     next();
  //   } else {
  //     let path = "/login";
  //     let query = to.query;
  //     next({ path, query });
  //   }
  // } else {
  //   next();
  // }

});


export default router