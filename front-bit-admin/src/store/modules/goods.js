/*
 * @Author      : Lance Yi [QQ：342003386]
 * @Date        : 2020-08-31 10:25:21
 * @LastEditors : Lance Yi
 * @LastEditTime: 2020-08-31 14:31:33
 * @FilePath    : \src\store\modules\goods.js
 * @Description : 商品档案 - 状态管理
 */


const state = {
  // 一品多码
  codeList: [],
  // 分级分割 显示
  segmentation: false,
  // 包装信息 显示
  packinfo: false,
  // 捆绑商品
  bundle: false,
}

const mutations = {
  SET_CODE: (state, codeList) => {
    state.codeList = codeList
  },
  SET_SEGMENTATION: (state, bl) => {
    state.segmentation = bl
  },
  SET_PACKINFO: (state, bl) => {
    state.packinfo = bl
  },
  SET_BUNDLE: (state, bl) => {
    state.bundle = bl
  },
}

const actions = {
  // 设置一品多码数据
  SetCodeList({ commit }, codeList) {
    commit('SET_CODE', codeList);
  },
  // 设置分级分割 - 显示隐藏
  SetSegmentation({ commit }, bl) {
    commit('SET_SEGMENTATION', bl);
  },
  // 设置包装信息 - 显示隐藏
  SetPackinfo({ commit }, bl) {
    commit('SET_PACKINFO', bl);
  },
  // 设置捆绑信息 - 显示隐藏
  SetBundle({ commit }, bl) {
    commit('SET_BUNDLE', bl);
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

