<!-- 创建初始系统账号 -->
<template>
  <div class="userFeign">
    <el-form ref="form"
             :model="form"
             :rules="rules"
             label-width="80px">
      <el-form-item required
                    :rules="[
            { required: true, message: '用户名不能为空', trigger: 'blur' },
          ]"
                    label="用户名"
                    prop="username">
        <el-input v-model="form.username"
                  clearable></el-input>
      </el-form-item>
      <el-form-item required
                    label="手机号"
                    prop="phone">
        <el-input v-model="form.phone"
                  minlength="11"
                  maxlength="11"
                  clearable></el-input>
      </el-form-item>
      <el-form-item required
                    :rules="[
            { required: true, message: '密码不能为空', trigger: 'blur' },
          ]"
                    label="密码"
                    prop="password">
        <el-input v-model="form.password"
                  type="password"
                  clearable
                  auto-complete="off"
                  placeholder="密码">
          <svg-icon slot="prefix"
                    icon-class="password"
                    class="el-input__icon input-icon" />
        </el-input>
      </el-form-item>
      <el-form-item label="业务类型"
                    prop="bsName">
        <el-select class="w-100"
                   v-model="form.bsName"
                   placeholder="请选择业务类型"
                   @change="onChange">
          <el-option v-for="item in appBusinessDictList"
                     :key="item.id"
                     :label="item.bsName"
                     :value="item.bsType">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary"
                   @click="onSubmit">立即创建</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { appBusinessDictList } from '@/api/system/superadmin'
import { initUserFeign } from '@/api/user'
export default {
  data () {
    var validatePhone = (rule, value, callback) => {
      console.log(value);
      console.log(value.slice(0, 4));
      if (value === '') {
        callback(new Error('手机号不能为空'));
      } else if (value.slice(0, 5) !== '10000') {
        callback(new Error('请输入以10000开头的手机号'));
      } else if (value.length != 11) {
        callback(new Error('请输入11位手机号'));
      } else {
        callback();
      }
    };
    return {
      form: {
        username: '',
        phone: '',
        password: ''
      },
      appBusinessDictList: [],
      rules: {
        phone: [
          { validator: validatePhone, trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    appBusinessDictList().then(res => {
      // console.log(res);
      if (res.code == 200) {
        this.appBusinessDictList = res.data
      }
    })
  },
  methods: {
    onSubmit () {
      this.$refs['form'].validate((valid) => {
        if (valid) {

          initUserFeign(this.form).then(res => {
            if (res.code == 200) {
              this.$message({
                message: "创建成功",
                type: "success",
              });

            }
          })
        }
      });

    },
    onChange (val) {
      this.$set(this.form, 'bsType', val)
      this.$set(this.form, 'bsName', this.appBusinessDictList.filter(item => item.bsType === val)[0].bsName)
      // console.log(this.appBusinessDictList.filter(item => item.bsType === val));
      // this.form.bsName = this.appBusinessDictList.filter(item => item.bsType === val)[0].bsName
    }
  }
}
</script>
<style>
.userFeign {
  width: 600px;
  margin: 60px;
}
</style>