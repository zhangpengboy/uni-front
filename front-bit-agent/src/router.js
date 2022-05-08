import { createRouter, createWebHistory } from "vue-router";
import store from "./store";

const routes = [
  {
    name: "notFound",
    path: "/",
    redirect: {
      name: "home",
    },
  },
  {
    name: "home",
    path: "/home",
    component: () => import("./views/home"),
    meta: {
      title: "团队管理",
    },
  },
  {
    name: "commission",
    path: "/commission",
    component: () => import("./views/commission"),
    meta: {
      title: "佣金管理",
    },
  },
  {
    name: "user",
    path: "/user",
    component: () => import("./views/user"),
    meta: {
      title: "我的",
    },
  },
  {
    name: "login",
    path: "/login",
    meta: { title: "登录", noAuth: true },
    component: () => import("@/views/login"),
  },
  {
    name: "settings",
    path: "/settings",
    meta: { title: "设置" },
    component: () => import("@/views/settings"),
  },
  {
    name: "cardList",
    path: "/cardList",
    meta: { title: "收/付款设置" },
    component: () => import("@/views/settings/list"),
  },
  {
    name: "withdraw",
    path: "/withdraw",
    meta: { title: "提现" },
    component: () => import("@/views/user/withdraw"),
  },
  {
    name: "withdrawList",
    path: "/withdrawList",
    meta: { title: "提现记录" },
    component: () => import("@/views/user/withdrawList"),
  },
  {
    name: "withdrawStatus",
    path: "/withdrawStatus",
    meta: { title: "提现状态" },
    component: () => import("@/views/user/withdrawStatus"),
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFount",
    meta: {
      title: "404 Not Fount",
      noAuth: true,
    },
    component: () => import("@/views/404"),
  },
];

const router = createRouter({
  routes,
  history: createWebHistory(process.env.BASE_URL),
});

router.beforeEach((to, from, next) => {
  const title = to.meta && to.meta.title;
  if (title) {
    document.title = title;
  }
  if (to.meta.noAuth) {
    next();
  } else {
    if (!store.state.hasLogin) {
      next("/login");
      return false;
    }
    next();
  }
});

export { router };
