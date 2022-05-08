import { createStore } from "vuex";
import { router } from "../router";
import $lance from "../utils/lance";
import { LOGIN_OUT } from "./mutation-types";

export default createStore({
  state: {
    hasLogin: !!$lance.getJson("token") || false,
    user: $lance.getJson("user") || null,
  },
  mutations: {
    login(state, payload) {
      $lance.setJson("user", payload);
      state.hasLogin = true;
      state.user = payload;
    },
    [LOGIN_OUT](state) {
      $lance.clearStorage("token");
      $lance.clearStorage("user");
      state.hasLogin = false;
      state.user = null;
    },
  },
  actions: {
    // 登录
    login({ commit }, data) {
      commit("login", data);
    },
    loginOut({ commit }) {
      commit(LOGIN_OUT);
      router.push("login");
    },
    clearStoreInfo({ commit }) {
      commit(LOGIN_OUT);
    },
  },
});
