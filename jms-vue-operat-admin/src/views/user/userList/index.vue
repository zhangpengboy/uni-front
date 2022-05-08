<!--
 * @Author       : Lance Yi <latticeyi@gmail.com>
 * @Date         : 2020-10-30 15:09:54
 * @Description  : 用户列表
-->
<template>
  <div class="app-container">
    <el-row :gutter="10"
            class="mb8">
      <!-- <el-col :span="1.5">
        <el-button type="primary"
                   icon="el-icon-orange"
                   size="mini"
                   @click="dialogVisible1=true">新增用户</el-button>
      </el-col> -->
      <!-- <el-col :span="1.5">
        <el-button
          type="info"
          size="mini"
          icon="el-icon-grape"
          @click="handleArea()"
          >矫正服务区域</el-button
        >
      </el-col> -->
      <!-- <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-watermelon"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          >合伙人分润配置</el-button
        >
      </el-col> -->
      <!-- <el-col :span="1.5">
        <el-button
          type="cyan"
          size="mini"
          icon="el-icon-apple"
          @click="handleUpdateColonel(2)"
          >设置代理</el-button
        >
      </el-col> -->
      <!-- <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-cherry"
          size="mini"
          @click="handleUpdateColonel(1)"
          >矫正团队数量</el-button
        >
      </el-col> -->
      <!-- <el-col :span="1.5">
        <el-button
          type="success"
          size="mini"
          icon="el-icon-pear"
          @click="handleBinding()"
          >更换绑定关系</el-button
        >
      </el-col> -->
    </el-row>

    <el-row :gutter="20"
            class="mb8">
      <el-col :span="1.5">
        <el-button type="primary"
                   icon="el-icon-orange"
                   size="mini"
                   @click="dialogVisible1=true">新增用户</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="cyan"
                   size="mini"
                   icon="el-icon-apple"
                   @click="handleSetAgent()">设置代理</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success"
                   size="mini"
                   icon="el-icon-pear"
                   @click="handleBinding()">关系绑定</el-button>
      </el-col>
      <el-col :span="5"
              class="d-flex-algin-center">
        <el-input v-model="queryParams.phone"
                  placeholder="请输入手机号"
                  clearable
                  size="small"
                  class="mr5"
                  @keyup.enter.native="onSubmit" />
        <!-- <el-select
          v-model="queryParams.userRole"
          clearable
          placeholder="请选择用户角色"
          class="w-100 mr5"
          @change="onSubmit"
        >
          <el-option
            v-for="item in Dict.ROLECODE"
            :key="item.key"
            :label="item.value"
            :value="item.key"
          >
          </el-option>
        </el-select> -->
        <el-button type="cyan"
                   icon="el-icon-search"
                   size="mini"
                   @click="onSubmit">搜索</el-button>
      </el-col>

      <right-toolbar :page="queryParams"
                     @queryTable="getList"
                     :showSearchBar="false"
                     showRefreshBar></right-toolbar>
    </el-row>
    <!-- 查询 -->

    <el-table v-loading="loading"
              :data="list"
              @selection-change="handleSelectionChange"
              border
              :height="tableHeight">
      <el-table-column type="selection"
                       width="50"
                       align="center"
                       fixed="left" />
      <el-table-column label="序号"
                       type="index"
                       width="80"
                       align="center"></el-table-column>
      <el-table-column label="手机号"
                       align="center"
                       prop="phone"
                       header-align="center"
                       :show-overflow-tooltip="true" />
      <el-table-column label="代理等级"
                       align="center"
                       prop="userLevel">
        <template slot-scope="scope">
          {{ filterKeyToValue(scope.row.userLevel, "USER_LEVEL_STATUS") }}
        </template>
      </el-table-column>
      <el-table-column label="VIP会员"
                       align="center"
                       prop="vipStatus"
                       width="135">
        <template slot-scope="scope">
          <el-tag :type="Dict.YES_NO[scope.row.vipStatus * 1].type"
                  size="small">
            {{ Dict.YES_NO[scope.row.vipStatus * 1].value }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="帐号状态"
                       align="center"
                       prop="status">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 1"
                  type="success"
                  size="small">启用</el-tag>
          <el-tag v-if="scope.row.status === 0"
                  size="small"
                  type="danger">禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间"
                       width="180"
                       align="center"
                       prop="createTime">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作"
                       align="center"
                       width="200"
                       fixed="right"
                       class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <!-- <el-dropdown>
            <el-button type="text" icon="el-icon-s-custom">设置角色</el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                icon="el-icon-s-custom"
                :disabled="scope.row.roleCode == 4"
                @click.native="handleSet(scope.row, 4)"
                >设为合伙人</el-dropdown-item
              >
              <el-dropdown-item
                icon="el-icon-s-custom"
                :disabled="scope.row.roleCode > 1"
                @click.native="handleSet(scope.row, 2)"
                >设为业务员</el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown> -->
          <el-button size="mini"
                     type="text"
                     icon="el-icon-s-tools"
                     @click="handleSetIncomeCv(scope.row)">设置提成系数</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :total="total"
                :page.sync="queryParams.pageNum"
                :limit.sync="queryParams.pageSize"
                @pagination="getList" />
    <UserSetDialog :isEdit="isEdit"
                   :open="open"
                   :stateArea="stateArea"
                   :isDifference="isDifference"
                   :form="form"
                   @submit="getList()"
                   @cancel="cancel()"></UserSetDialog>
    <UserColonelDialog :isEdit="isEdit"
                       :colonelopen="colonelopen"
                       :form="form"
                       @submit="getList()"
                       @cancel="cancel()"></UserColonelDialog>
    <UpdateSalesmanIncomeConfigDialog :isEdit="isEdit"
                                      :open="openConfig"
                                      :form="formConfig"
                                      @submit="getList()"
                                      @cancel="cancel()"></UpdateSalesmanIncomeConfigDialog>
    <UserAgentDialog :isEdit="isEdit"
                     :colonelopen="openAgent"
                     :form="form"
                     @submit="getList()"
                     @cancel="cancel()"></UserAgentDialog>

    <!-- 设置提成系数弹框 -->
    <el-dialog title="设置提成系数"
               :visible.sync="dialogVisible"
               width="30%"
               :before-close="handleClose">
      <el-form label-width="100px"
               :model="updateAmountForm"
               class="demo-form-inline">
        <el-form-item label="设置提成系数">
          <el-input type="number"
                    max="1"
                    v-model="updateAmountForm.cv"></el-input>
        </el-form-item>
        <el-form-item>
          <!-- <el-button type="primary" @click="onSubmit">查询</el-button> -->
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="updateUserPageList">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 创建初始系统账号弹框 -->
    <el-dialog title="创建初始系统账号"
               :visible.sync="dialogVisible1"
               width="50%"
               :before-close="handleClose">
      <el-form ref="userForm"
               :model="userForm"
               :rules="rules"
               label-width="80px">
        <el-form-item required
                      :rules="[
            { required: true, message: '用户名不能为空', trigger: 'blur' },
          ]"
                      label="用户名"
                      prop="username">
          <el-input v-model="userForm.username"
                    clearable></el-input>
        </el-form-item>
        <el-form-item required
                      label="手机号"
                      prop="phone">
          <el-input v-model="userForm.phone"
                    placeholder="请输入以11开头的手机号"
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
          <el-input v-model="userForm.password"
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
                     v-model="userForm.bsName"
                     placeholder="请选择业务类型"
                     @change="onChange">
            <el-option v-for="item in appBusinessDictList"
                       :key="item.id"
                       :label="item.bsName"
                       :value="item.bsType">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="dialogVisible1 = false">取 消</el-button>
        <el-button type="primary"
                   @click="onSubmit1">创 建</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getUserPageList,
  updateUserRole,
  userUpdateUserRole,
  getUserIncomeCv,
  updateUserPageList
} from "@/api/user";
import UserSetDialog from "../components/UserSetDialog";
import UserColonelDialog from "../components/UserColonelDialog";
import UpdateSalesmanIncomeConfigDialog from "../components/UpdateSalesmanIncomeConfigDialog";
import UserAgentDialog from "../components/UserAgentDialog";
import { appBusinessDictList } from '@/api/system/superadmin'
import { initUserFeign } from '@/api/user'
export default {
  name: "UserList",
  components: {
    UserSetDialog,
    UserColonelDialog,
    UpdateSalesmanIncomeConfigDialog,
    UserAgentDialog
  },
  data () {
    var validatePhone = (rule, value, callback) => {
      // console.log(value);
      // console.log(value.slice(0, 4));
      if (value === '') {
        callback(new Error('手机号不能为空'));
      }
      // else if (value.slice(0, 5) !== '10000') {
      //   callback(new Error('请输入以10000开头的手机号'));
      // } 
      else if (value.length != 11) {
        callback(new Error('请输入11位手机号'));
      } else {
        callback();
      }
    };
    return {
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 是否显示弹出层
      open: false,
      colonelopen: false,
      openAgent: false,
      // 是否修改
      isEdit: false,
      // 表单参数
      form: {},
      // 数据列表
      list: null,
      // 总条数
      total: 0,
      // 遮罩层
      loading: false,
      // 查询参数
      queryParams: _.cloneDeep(this.Dict.QUERY_PARAMS),
      // 查询参数
      // tableForm: {},
      openConfig: false,
      formConfig: {},
      isDifference: false,
      stateArea: false,
      dialogVisible: false,
      updateAmountForm: {},
      userId: '',
      userForm: {
        username: '',
        phone: '',
        password: ''
      },
      appBusinessDictList: [],
      dialogVisible1: false,
      rules: {
        phone: [
          { validator: validatePhone, trigger: 'blur' }
        ]
      }
    };
  },
  created () {
    this.getList();
    appBusinessDictList().then(res => {
      // console.log(res);
      if (res.code == 200) {
        this.appBusinessDictList = res.data
      }
    })
  },
  methods: {
    onSubmit1 () {
      this.$refs['userForm'].validate((valid) => {
        if (valid) {
          initUserFeign(this.userForm).then(res => {
            if (res.code == 200) {
              this.$message({
                message: "创建成功",
                type: "success",
              });
              this.dialogVisible1 = false
            }
          })
        }
      });

    },
    onChange (val) {
      this.$set(this.userForm, 'bsType', val)
      // console.log(this.appBusinessDictList.filter(item => item.bsType === val));
      this.userForm.bsName = this.appBusinessDictList.filter(item => item.bsType === val)[0].bsName
    },
    // 设置提成系数弹框
    handleSetIncomeCv (row) {
      this.dialogVisible = true;
      // this.updateAmountForm = row;
      // console.log(777, row);
      this.userId = row.id
      this.getUserIncomeCv()
    },
    // 获取用户奖励提成系数
    getUserIncomeCv () {
      getUserIncomeCv({ userId: this.userId }).then((res) => {
        this.updateAmountForm = res.data
      });
    },
    // 确定设置提成系数
    updateUserPageList () {
      updateUserPageList({ userId: this.userId, cv: this.updateAmountForm.cv }).then((res) => {
        if (res.code == 200) {
          this.dialogVisible = false;
          this.$message({
            message: "修改成功",
            type: "success",
          });
          this.getList();
        }
      });
    },
    // 设置提成系数弹框关闭
    handleClose (done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          done();
        })
        .catch((_) => { });
    },
    // 获取列表,,,
    getList () {
      this.loading = true;
      // this.tableForm = _.assign(this.tableForm, this.queryParams);
      getUserPageList(this.queryParams).then((response) => {
        this.list = response.data.list;
        this.total = Number.parseInt(response.data.total);
        this.loading = false;
      });
    },
    // 查询数据
    onSubmit () {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    // 取消按钮
    cancel () {
      this.form = {};
      this.formConfig = {};
      this.open = false;
      this.colonelopen = false;
      this.openConfig = false;
      this.isDifference = false;
      this.openAgent = false;
    },
    // 多选框选中数据
    handleSelectionChange (selection) {
      this.ids = selection;
      const ids = this.ids
        .filter((v) => v.roleCode == 2)
        .map((item) => item.id);
      if (ids.length > 0) {
        this.single = selection.length != 1;
      } else {
        this.single = true;
      }
    },
    // 设置下级
    handleAdd () {
      this.form = {};
      this.open = true;
      this.isEdit = false;
      this.isDifference = false;
      this.stateArea = false;
    },
    // 矫正数量  开通团长
    handleUpdateColonel (v) {
      if (v == 1) {
        this.isEdit = true;
      } else {
        this.isEdit = false;
      }
      this.form = {};
      this.colonelopen = true;
    },
    // 设置代理
    handleSetAgent () {
      this.form = {}
      this.openAgent = true;
    },
    // 绑定上下级
    handleBinding () {
      // console.log(row);
      // this.form.currentId = row.id;
      this.open = true;
      this.stateArea = false;
      this.isEdit = false;
      this.isDifference = true;
    },
    // 矫正服务区域
    handleArea () {
      // console.log(row);
      // this.form.currentId = row.id;
      this.open = true;
      this.isEdit = false;
      this.stateArea = true;
      this.isDifference = false;
    },
    // 修改业务员分润配置
    handleUpdate () {
      // this.formConfig = _.assign({},this.ids[0])
      this.formConfig = {
        id: this.ids[0].id,
      };
      this.openConfig = true;
      this.isEdit = false;
    },
    // 成为合伙人
    handleSet (row, role) {
      console.log(row);
      this.$confirm(
        "是否确认将" +
        row.userName +
        "设置为" +
        (role == 4 ? "合伙人" : "业务员") +
        "?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          userUpdateUserRole({
            userId: row.id,
            roleCode: role,
          }).then((res) => {
            this.$message({
              type: "success",
              message: `${row.userName}设置成功`,
            });
            this.getList();
          });
        })
        .catch((err) => { });
    },
  },
};
</script>
