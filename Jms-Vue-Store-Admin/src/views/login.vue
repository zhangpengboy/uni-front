<template>
  <div class="login">
    <el-form ref="loginForm" :model="loginForm" class="login-form">
      <h2 class="title">商户后台管理系统</h2>
      <el-form-item
        prop="phone"
        :rules="[{ required: true, message: '请输入手机号', trigger: 'blur' }]"
      >
        <el-input
          @blur="getStoreList"
          v-model="loginForm.phone"
          type="text"
          auto-complete="off"
          placeholder="手机号"
          maxlength="11"
        >
          <svg-icon
            slot="prefix"
            icon-class="user"
            class="el-input__icon input-icon"
          />
        </el-input>
      </el-form-item>
      <el-form-item
        prop="password"
        :rules="[{ required: true, message: '请输入密码', trigger: 'blur' }]"
      >
        <el-input
          v-model="loginForm.password"
          type="password"
          auto-complete="off"
          placeholder="密码"
          @keyup.enter.native="handleLogin"
        >
          <svg-icon
            slot="prefix"
            icon-class="password"
            class="el-input__icon input-icon"
          />
        </el-input>
      </el-form-item>
      <el-form-item prop="store">
        <!-- :rules="[{ required: true, message: '请选择店铺', trigger: 'blur' }]" -->
        <el-select v-model="store" placeholder="请选择店铺">
          <el-option
            v-for="item in storeList"
            :key="item.id"
            :label="item.storeName"
            :value="item.id"
          >
          </el-option>
          <svg-icon
            slot="prefix"
            icon-class="shop"
            class="el-input__icon input-icon"
          />
        </el-select>
      </el-form-item>
      <el-row style="margin: 0px 0px 25px 0px">
        <el-col :span="12" class="text-success">
          <router-link to="/register">注册</router-link>
        </el-col>
        <!-- <el-col :span="12" class="text-right">
          <a @click="handleForgetPwd">忘记密码?</a>
        </el-col> -->
      </el-row>

      <el-form-item style="width: 100%">
        <el-button
          :loading="loading"
          size="default"
          type="primary"
          style="width: 100%"
          @click.native.prevent="handleLogin"
        >
          <span v-if="!loading">登 录</span>
          <span v-else>登 录 中...</span>
        </el-button>
      </el-form-item>
    </el-form>
    <!--  底部  -->
    <div class="el-login-footer">
      <span
        >Copyright © 2018-{{ new Date().getFullYear() }} Lanceyi.com All Rights
        Reserved.</span
      >
    </div>
  </div>
</template>

<script>
import { encrypt, decrypt } from "@/utils/jsencrypt";
import { storeList } from "@/api/login";
export default {
  name: "Login",
  data() {
    return {
      loginForm: {
        phone: "",
        password: "",
      },
      storeList: [],
      store: "",
      amount: "",
      statu: true,
      loading: false,
      redirect: undefined,
    };
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true,
    },
  },
  created() {},
  methods: {
    // 监听手机号
    listening(e) {
      this.store = "";
      console.log(e);
      this.amount = e;
      //保持this的指向始终指向vue实例
      var that = this;
      if (!that.statu) {
        return;
      }
      that.statu = false;
      setTimeout(function () {
        console.log(new Date());
        that.getStoreList();
        that.statu = true;
      }, 1500);
    },
    // 调用接口获取店铺列表
    getStoreList() {
      let obj = {};
      this.store = "";
      this.storeList = [];
      // obj.phone = this.amount;
      obj.phone = this.loginForm.phone;
      storeList(obj).then((res) => {
        console.log(res);
        if (res.code == 200) {
          this.storeList = res.data.filter(
            (item) => item.storeRoleCode != 1 && item.status == 0
          );
        }
      });
    },
    /** 登录 */
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          // if (this.storeList.length) {
          if (this.store == "") {
            this.$message.error("请选择店铺");
            return;
          }
          // }
          const _data = _.find(this.storeList, (v) => {
            return v.id == this.store;
          });
          // window.localStorage.setItem("SetStore", JSON.stringify(_data));
          // this.$store.dispatch("SetStore", _data);

          this.loading = true;
          this.$store
            .dispatch("Login", this.loginForm)
            .then(() => {
              this.$store.dispatch("SetStore", _data == undefined ? "" : _data);
              this.$router.push({ path: this.redirect || "/" });
            })
            .catch(() => {
              this.loading = false;
            });
        }
      });
    },
    /** 忘记密码 */
    handleForgetPwd() {
      this.msgInfo("请联系管理员找回密码");
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-image: url("../assets/image/login-background.jpg");
  background-size: cover;
}
.title {
  margin: 0px auto 30px auto;
  text-align: center;
  color: #707070;
}

.login-form {
  border-radius: 6px;
  background: #ffffff;
  width: 400px;
  padding: 25px 25px 5px 25px;
  /deep/ .el-input {
    height: 40px;
    input {
      height: 40px;
    }
  }
  /deep/ .el-select {
    height: 40px;
    width: 100%;
  }
  .input-icon {
    height: 40px;
    width: 14px;
    margin-left: 3px;
  }
}
.login-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}
.login-code {
  width: 33%;
  height: 40px;
  float: right;
  img {
    cursor: pointer;
    vertical-align: middle;
  }
}
.el-login-footer {
  height: 40px;
  line-height: 40px;
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: #444;
  font-family: Arial;
  font-size: 12px;
  letter-spacing: 1px;
}
.login-code-img {
  height: 40px;
}
</style>
