<template>
  <div class="center center-money">
    <div class="center-info">
      <!-- 商户信息 -->
      <div class="d-flex p-4">
        <van-image
          round
          :src="require('@/assets/images/user/head@2x.png')"
          class="headimg"
        />
        <div class="headinfo" v-if="user && hasLogin">
          <div class="nickname">{{ user.userName }}</div>
          <div class="mobile">
            <span class="mr-2">{{ user.mobile }}</span
            ><van-tag type="danger">{{
              $lance.filterUserRole(user.role)
            }}</van-tag>
          </div>
        </div>
        <div class="headinfo" v-else>
          <div class="headlogin" @click="toPage('login')">登录</div>
        </div>
        <div class="settings" @click="toPage('settings')">
          <van-icon name="setting-o" size="24" class="color-light" />
        </div>
      </div>
    </div>
    <div
      class="main-wrap money-assets"
      v-for="(v, i) in list"
      :key="i"
      :class="bitClass[i]"
    >
      <div class="text-center">
        <p class="fs-14 mb-2 d-flex align-items-center justify-content-center">
          <span>{{ $lance.filterBitType(v.bitType) }}总资产&nbsp;&nbsp;</span>
          <template v-if="showMoney">
            <van-icon name="eye-o" size="15" @click.stop="onShowMoney(0)" />
          </template>
          <template v-else>
            <van-icon
              name="closed-eye"
              size="15"
              @click.stop="onShowMoney(1)"
            />
          </template>
          <van-button
            color="linear-gradient(to right, #ff6034, #ee0a24)"
            round
            size="mini"
            :to="{ path: 'withdraw', query: { bitType: v.bitType } }"
            class="but"
            >提现</van-button
          >
        </p>
        <p class="fs-28" v-if="showMoney">{{ v.freeAmount }}</p>
        <p class="fs-28" v-else>····</p>
      </div>
    </div>
  </div>
</template>

<script>
import $http from "@/api/index.js";
import $apiUri from "@/api/config";
import $lance from "@/utils/lance";
import { computed, onMounted, ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
export default {
  setup() {
    const router = useRouter();
    const store = useStore();
    let list = ref([]);
    const bitClass = ref(["cny", "btc", "eth"]);
    let showMoney = ref(true);

    // 跳转页面
    const toPage = (page, bitType) => {
      router.push({
        name: page,
        query: {
          bitType,
        },
      });
    };
    // 获取bit资产
    const getUserBit = () => {
      $http.post($apiUri.APP_AGENTMONEY_INFO, null, (res) => {
        list.value = res.data.slice(0, 3);
      });
    };
    /** 显示隐藏 */
    const onShowMoney = (bl) => {
      $lance.setData("show-money", bl);
      showMoney.value = !!bl;
    };
    // 获取登录信息
    const getUserInfo = () => {
      $http.post($apiUri.APP_USER_INFO, null, (res) => {
        store.dispatch("login", res.data);
        if (store.state.hasLogin) {
          getUserBit();
        }
      });
    };
    onMounted(() => {
      showMoney.value = !!+$lance.getData("show-money");
      getUserInfo();
    });
    return {
      hasLogin: computed(() => store.state.hasLogin),
      toPage,
      user: computed(() => store.state.user),
      list,
      bitClass,
      showMoney,
      onShowMoney,
    };
  },
};
</script>

<style lang="scss">
.text-center {
  margin-top: 12px;
  .but {
    position: absolute;
    width: 70px;
    left: 70%;
  }
}
</style>
