<!--
 * @Author      : Lance Yi<latticeyi@gmail.com>
 * @Date        : 2021-03-10 11:33:52
 * @Description : 商户登录
-->
<template>
  <div class="container">
    <div class="welcome">
      <div>你好,</div>
      <div>欢迎使用！</div>
    </div>
    <div class="logintype">
      <div class="form">
        <!-- 手机号 + 密码 -->
        <div class="form-item van-hairline--bottom">
          <div class="form-item-label"><span>手机号</span></div>
          <van-field
            type="tel"
            placeholder="请输入您的手机号"
            v-model="form.phone"
            maxlength="11"
          />
        </div>
        <div class="form-item van-hairline--bottom">
          <div class="form-item-label"><span>密码</span></div>
          <van-field
            :type="showPwd ? 'text' : 'password'"
            placeholder="请输入您的密码"
            v-model="form.password"
          >
            <template #right-icon>
              <van-icon
                size="22"
                name="eye-o"
                v-if="showPwd"
                @click="showPwd = false"
              />
              <van-icon
                size="22"
                name="closed-eye"
                v-else
                @click="showPwd = true"
              />
            </template>
          </van-field>
        </div>

        <!-- 提交按钮 -->
        <div class="mx-6 py-8">
          <van-button
            block
            round
            type="primary"
            @click="submitForm()"
            class="mb-4"
            >登录</van-button
          >
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// import _ from "lodash";
import $lance from "@/utils/lance";
import $md5 from "md5";
import $apiUri from "@/api/config";
import $http from "@/api/index.js";
import { Toast } from "vant";
import { ref, reactive, toRefs } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
// import { router } from "../../router";

export default {
  setup() {
    const showPwd = ref(false);
    const regPhone = ref(/^1([3456789][0-9])\d{8}$/);
    const regPassword = ref(/^[a-zA-Z][a-zA-Z0-9_]{5,17}$/);
    const second = ref(90);
    let form = reactive({
      username: null,
      authCode: null,
      phone: null,
      password: null,
    });
    const isBack = ref(true);
    const router = useRouter();
    const store = useStore();
    let { phone, password } = toRefs(form);
    // * 提交表单
    const submitForm = () => {
      const _reqUrl = $apiUri.APP_LOGIN;
      // console.log(form)
      let _params = {
        phone: phone.value,
        password: $md5(password.value),
        loginType: "agent",
      };
      $http.post(
        _reqUrl,
        _params,
        (res) => {
          Toast("登录成功!");
          phone.value = null;
          password.value = null;
          $lance.setJson("token", res.data);
          store.dispatch("login");
          // getGroup();
          router.push("/home");
        },
        (err) => {
          Toast(err.message);
        }
      );
    };

    return {
      showPwd,
      regPhone, // 手机号码验证
      regPassword, // 密码验证
      second,
      form,
      isBack,
      submitForm,
    };
  },
  //   beforeRouteEnter (to, from, next) {
  //     console.log("ssss")
  //     console.log(from)
  //   if (from.name === 'register' || from.name === 'login' || from.path === '/') {
  //     console.log("aaaaaa")
  //     next((vm) => {
  //       vm.isBack = false
  //     })
  //   }
  //   next()
  // }
};
</script>
<style lang="scss" scoped>
@import "./login";
</style>
