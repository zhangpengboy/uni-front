<template>
  <div class="login">
    <el-form
      ref="reisterForm"
      :model="reisterForm"
      :rules="registerRules"
      class="login-form"
    >
      <h2 class="title">欢迎注册商户</h2>
      <el-form-item prop="phone">
        <el-input
          v-model="reisterForm.phone"
          type="text"
          auto-complete="off"
          placeholder="手机号"
          maxlength="11"
        >
          <svg-icon
            slot="prefix"
            icon-class="phone"
            class="el-input__icon input-icon"
          />
        </el-input>
      </el-form-item>
      <el-form-item prop="code">
        <el-input
          v-model="reisterForm.code"
          type="text"
          auto-complete="off"
          style="width: 66%"
          placeholder="验证码"
        >
          <svg-icon
            slot="prefix"
            icon-class="drag"
            class="el-input__icon input-icon"
          />
        </el-input>
        <div class="login-code">
          <el-button
            type="primary"
            size="default"
            @click="sendCodeMsg()"
            :disabled="!isEnable"
            >{{ msgText }}</el-button
          >
        </div>
      </el-form-item>

      <!-- <el-form-item prop="password">
        <el-input
          v-model="reisterForm.password"
          type="password"
          auto-complete="off"
          placeholder="密码"
        >
          <svg-icon
            slot="prefix"
            icon-class="password"
            class="el-input__icon input-icon"
          />
        </el-input>
      </el-form-item> -->

      <!-- <el-form-item prop="rePassword">
        <el-input
          v-model="reisterForm.rePassword"
          type="password"
          auto-complete="off"
          placeholder="确认密码"
        >
          <svg-icon
            slot="prefix"
            icon-class="password"
            class="el-input__icon input-icon"
          />
        </el-input>
      </el-form-item> -->

      <!-- <el-form-item prop="inviteCode">
        <el-input
          v-model="reisterForm.inviteCode"
          auto-complete="off"
          placeholder="邀请码(非必填)"
        >
          <svg-icon
            slot="prefix"
            icon-class="code"
            class="el-input__icon input-icon"
          />
        </el-input>
      </el-form-item>-->

      <el-row style="margin: 0px 0px 25px 0px">
        <el-col :span="12" :offset="12" class="text-right text-success">
          <!-- <router-link to="/login">已有账号，点击登录</router-link> -->
          <el-button @click="toLogin" type="text" size="big"
            >已有账号，点击登录</el-button
          >
        </el-col>
      </el-row>

      <el-form-item style="width: 100%">
        <el-button
          :loading="loading"
          size="default"
          type="primary"
          style="width: 100%"
          @click.native.prevent="handleRegister"
        >
          <span v-if="!loading">下一步</span>
          <span v-else>下 一 步...</span>
        </el-button>
      </el-form-item>
    </el-form>
    <!--  底部  -->
    <div class="el-login-footer">
      <span>Copyright © 2018-2019 Lance.com All Rights Reserved.</span>
    </div>
    <!-- 添加或修改对话框 -->
    <StoreDialog
      :isEdit="isEdit"
      :open="open"
      :form="form"
      :fullscreen="fullscreen"
      :reisterForm="reisterForm"
      @submit="submit()"
      @cancel="cancel()"
      v-if="open"
    ></StoreDialog>
  </div>
</template>

<script>
import StoreDialog from "./mallcenter/components/StoreDialog";

import { getUserIsRegister, judgeValidate } from "@/api/system/user";
import { getSignNo, getCodeMsg } from "@/api/stores";
import { register } from "@/api/login";
import { encrypt, decrypt } from "@/utils/jsencrypt";
export default {
  name: "Register",
  components: {
    StoreDialog,
  },
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (
          !/^\S*(?=\S{6,})(?=\S*\d)(?=\S*[A-Za-z!@#$%^&*?])\S*$/.test(value)
        ) {
          callback(
            new Error(
              "至少6位,包括至少1个大写字母或1个小写字母或1个数字或1个特殊符号"
            )
          );
        }
        if (this.reisterForm.rePassword !== "") {
          this.$refs.reisterForm.validateField("rePassword");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.reisterForm.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      msgText: "获取验证码",
      isEnable: true,
      timer: null,
      // 是否显示弹出层
      open: false,
      // 是否是修改弹出层
      isEdit: false,
      // 表单参数
      form: {},
      fullscreen: true,
      reisterForm: {
        phone: "",
        password: "",
        rePassword: "",
        inviteCode: "",
        code: "",
        sourceType: "",
        signNo: "",
      },
      registerRules: {
        phone: [{ required: true, trigger: "blur", message: "手机号不能为空" }],
        // password: [
        //   { required: true, trigger: "blur", message: "密码不能为空" },
        //   { validator: validatePass, trigger: "blur" },
        // ],
        // rePassword: [
        //   { required: true, trigger: "blur", message: "密码不能为空" },
        //   { validator: validatePass2, trigger: "blur" },
        // ],
        code: [{ required: true, trigger: "blur", message: "验证码不能为空" }],
      },
      loading: false,
      storeRoleList: [],
    };
  },
  created() {},
  methods: {
    handleRegister() {
      this.$refs.reisterForm.validate((valid) => {
        if (valid) {
          // 判断验证码是否正确
          judgeValidate({
            code: this.reisterForm.code,
            signNo: this.reisterForm.signNo,
          }).then((res) => {
            console.log(res);
            if (res.code == 200) {
              this.reset();
              this.loading = false;
              // this.form.storeAccountId = res.data;
              // this.form.phone = this.reisterForm.phone;
              this.isEdit = false;
              this.open = true;
            }
          });

          // this.loading = true;
          // register(this.reisterForm)
          //   .then((res) => {
          //     if (res.code == 200) {
          //       this.reset();
          //       this.loading = false;
          //       this.form.storeAccountId = res.data;
          //       this.form.phone = this.reisterForm.phone;
          //       this.isEdit = false;
          //       this.open = true;
          //       console.log(999, res);
          //     }
          //     // this.msgSuccess("店铺注册成功, 客服会在24小时内为您审核通过");
          //     // setTimeout(() => {
          //     //   this.$router.push({ path: "/login" });
          //     // }, 1000);
          //   })
          //   .catch(() => {
          //     this.loading = false;
          //   });
        }
      });
    },
    toLogin() {
      this.$router.push({ path: "/login" });
    },
    // phoneBlur() {
    //   console.log(this.reisterForm);
    //   if (
    //     /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-7|9])|(?:5[0-3|5-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[1|8|9]))\d{8}$/.test(
    //       this.reisterForm.phone
    //     )
    //   ) {
    //     getUserAccountByPhone({ phone: this.reisterForm.phone }).then((res) => {
    //       if (res.code == 200) {
    //         // 未注册
    //         if (res.data == null) {
    //           console.log(1);
    //         } else {
    //           console.log(2);
    //         }
    //       }
    //     });
    //   }
    // },
    submit() {
      this.msgSuccess("注册成功, 客服会在24小时内为您审核店铺", 6000, 90);
      setTimeout(() => {
        this.$router.push({ path: "/login" });
      }, 1000);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        isCloudStore: undefined,
        storeName: undefined,
        storeCategoryId: undefined,
        storeCategoryName: undefined,
        storeBusiness: undefined,
        storeAddress: undefined,
        storeRoleCode: undefined,
        storeRoleName: undefined,
        storeAccountId: undefined,
        phone: undefined,
      };
    },
    // * 发送短信验证码
    sendCodeMsg() {
      if (/^(?:(?:\+|00)86)?1\d{10}$/.test(this.reisterForm.phone)) {
        // 校验是否注册
        getUserIsRegister({ phone: this.reisterForm.phone }).then((res) => {
          if (res.code == 200) {
            // 未注册
            if (!res.data) {
              if (this.isEnable) {
                this.isEnable = false;
                let sendTime = 90;
                getSignNo({
                  mobile: this.reisterForm.phone,
                }).then((res) => {
                  this.reisterForm.signNo = res.data;
                  getCodeMsg({
                    phone: this.reisterForm.phone,
                    signNo: this.reisterForm.signNo,
                  }).then((res) => {
                    this.timer = setInterval(() => {
                      sendTime--;
                      this.msgText = sendTime + "s重新获取";
                      if (sendTime <= 0) {
                        this.msgText = "获取验证码";
                        this.isEnable = true;
                        clearInterval(this.timer);
                      }
                    }, 1000);
                  });
                });
              }
            } else {
              console.log(2);
              this.msgError("用户存在");
            }
          }
        });
        return;
      }
      this.msgError("请填写正确的手机号");
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
  .input-icon {
    height: 39px;
    width: 14px;
    margin-left: 4px;
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
  text-align: right;
}
.el-login-footer {
  height: 40px;
  line-height: 40px;
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: #fff;
  font-family: Arial;
  font-size: 12px;
  letter-spacing: 1px;
}
.login-code-img {
  height: 40px;
}
</style>
