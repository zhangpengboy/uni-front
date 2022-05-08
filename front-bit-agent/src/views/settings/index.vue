<!--
 * @Author      : Lance Yi<latticeyi@gmail.com>
 * @Date        : 2021-03-13 15:21:38
 * @Description : 设置
-->
<template>
  <div class="center">
    <van-cell-group class="mb-3" v-if="user">
      <van-cell
        title="头像"
        center
        size="large"
        class="py-2"
        title-class="fw-b"
        is-link
      >
        <template #default>
          <van-image
            round
            :src="require('@/assets/images/user/head@2x.png')"
            width="56"
            height="56"
          />
        </template>
      </van-cell>
      <van-cell
        title="昵称"
        :value="user.userName"
        size="large"
        class="py-3"
        title-class="fw-b"
        value-class=""
        is-link
      />
      <van-cell
        title="登录手机号"
        :value="user.mobile"
        size="large"
        class="py-3"
        title-class="fw-b"
        value-class="color-muted mr-3"
      />
      <van-cell
        title="代理级别"
        :value="$lance.filterUserRole(user.role)"
        size="large"
        class="py-3"
        title-class="fw-b"
        value-class="color-muted mr-3"
      />
    </van-cell-group>

    <!-- <van-cell-group class="mb-3">
      <van-cell
        title="收/付款设置"
        size="large"
        class="py-3"
        is-link
        to="cardList"
        title-class="fw-b"
      />
    </van-cell-group> -->

    <div class="bg-white py-3 text-center" @click="loginOut">
      <span class="color-red fw-b"> 退出当前账户 </span>
    </div>
  </div>
</template>
<script>
import { useStore } from "vuex";
import { computed } from "vue";
export default {
  setup() {
    const store = useStore();
    const loginOut = () => {
      store.dispatch("loginOut");
    };
    return {
      loginOut,
      user: computed(() => store.state.user),
    };
  },
};
</script>
