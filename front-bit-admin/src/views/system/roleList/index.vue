<!--
 * @Author       : Lance Yi <latticeyi@gmail.com>
 * @Date         : 2020-11-03 14:03:38
 * @Description  : 代理角色配置列表
-->
<template>
  <div class="app-container">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          >新增</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          >修改</el-button
        >
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          >删除</el-button
        >
      </el-col> -->
      <!-- <el-col :span="7" class="d-flex-algin-center">
        <el-input
          v-model="queryParams.roleName"
          placeholder="请输入代理角色名称进行查询"
          clearable
          size="small"
          class="mr5"
          @keyup.enter.native="handleQuery"
        />
        <el-button
          type="cyan"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          >搜索</el-button
        >
      </el-col> -->
      <right-toolbar
        :showSearch.sync="showSearch"
        :cols="columns"
        :grid="$route.name"
        :page="queryParams"
        @queryTable="getList"
        :showSearchBar="false"
        showRefreshBar
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="list"
      @selection-change="handleSelectionChange"
      border
      :key="key"
      :height="tableHeight"
      @row-dblclick="handleUpdate"
    >
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column label="序号" type="index" width="60" align="center" />
      <template v-for="(v, index) in columns">
        <el-table-column
          :label="v.label"
          :width="v.width"
          :prop="v.prop"
          :align="v.align"
          :key="index"
          v-if="v.show"
          header-align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span v-if="v.prop === 'createTime'">
              {{ parseTime(scope.row.createTime) }}
            </span>
            <span v-else>{{ scope.row[v.prop] }}</span>
          </template>
        </el-table-column>
      </template>
    </el-table>

    <pagination
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改对话框 -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="550px"
      append-to-body
      v-el-dialog-drag
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @close="cancel"
    >
      <el-form
        ref="bitTypeForm"
        :model="form"
        :rules="rules"
        label-width="100px"
        label-suffix=":"
      >
        <el-form-item label="角色类型"  prop="role">
          <!-- <el-select v-model="form.role" class="w-100" :disabled="isEdit">
            <el-option
              v-for="(v, i) in Dict.DIG_TYPE_ENUM"
              :key="i"
              :label="v.value"
              :value="v.key"
            >
            </el-option>
          </el-select> -->
          <el-input v-model="form.role" type="number" placeholder="请输入代理的角色类型" :disabled="isEdit"/>
        </el-form-item>
        <el-form-item label="角色名称"  prop="roleName">
          <!-- <el-select
            v-model="form.machineType"
            class="w-100"
            :disabled="isEdit"
          >
            <el-option
              v-for="(v, i) in machineTypeEnum"
              :key="i"
              :label="v.value"
              :value="v.key"
            >
            </el-option>
          </el-select> -->
          <el-input v-model="form.roleName" placeholder="请输入代理的角色名称" :disabled="isEdit"/>
        </el-form-item>

        <el-form-item label="个人条件值" prop="selfValue">
          <el-input v-model="form.selfValue" type="number" placeholder="请输入代理升级的个人条件值" />
        </el-form-item>

        <el-form-item label="团队条件值"  prop="teamValue">
          <el-input v-model="form.teamValue" type="number" placeholder="请输入代理升级的团队条件值" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm" size="mini"
          >确 定</el-button
        >
        <el-button @click="cancel" size="mini">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getBitRewardList, addAndUpdateRole } from "@/api/system";

const defaultColumns = [
  {
    label: "角色类型",
    show: true,
    prop: "role",
    align: "center",
  },
  {
    label: "角色名称",
    show: true,
    prop: "roleName",
    align: "center",
  },
  {
    label: "个人条件值",
    show: true,
    prop: "selfValue",
    align: "center",
  },
  {
    label: "团队条件值",
    show: true,
    prop: "teamValue",
    align: "center",
  },
  {
    label: "创建时间",
    show: true,
    prop: "createTime",
    align: "center",
  },
];

export default {
  name: "SystemRoleList",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 表格数据
      list: [],
      // 添加配置
      title: null,
      // 是否显示弹出层
      open: false,
      // 是否是修改弹出层
      isEdit: false,
      // 日期范围
      dateRange: [],
      // 查询参数
      queryParams: _.cloneDeep(this.Dict.QUERY_PARAMS),
      // 表单参数
      form: {},
      // 表格key
      key: 1,
      // 自定义表格列表
      columns: _.cloneDeep(defaultColumns),
      rules: {
        role: [
          { required: true, message: "角色类型不能为空", trigger: "blur" },
        ],
        roleName: [
          { required: true, message: "角色名称不能为空", trigger: "blur" },
        ],
        selfValue: [
          { required: true, message: "个人条件值不能为空", trigger: "blur" },
        ],
        teamValue: [
          { required: true, message: "团队条件值不能为空", trigger: "blur" },
        ],
      },
    };
  },
  // computed: {
  //   machineTypeEnum: function () {
  //     if(this.form.digType) {
  //       return this.Dict.DIG_TYPE_ENUM.filter((v) => this.form.digType == v.key)[0].list
  //     }
      
  //   }
  // },
  created() {
    this.getList();
  },
  methods: {
    /** 查询店铺列表 */
    getList() {
      this.loading = true;
      getBitRewardList(this.queryParams).then((response) => {
        this.list = response.data;
        this.total = Number.parseInt(response.data.length);
        this.loading = false;
      });
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
        role: undefined,
        roleName: undefined,
        selfValue: undefined,
        teamValue: undefined,
      };
      this.$nextTick( ()=> {
        this.$refs["bitTypeForm"].clearValidate();
      })
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.resetForm("bitTypeForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection;
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.isEdit = false;
      this.title = "添加配置";
      
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.open = true;
      this.isEdit = true;
      this.title = "修改配置";
      this.form = _.assign({}, this.ids[0]);

    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = this.ids.map((item) => item.id);
      const names = row.storeName || this.ids.map((item) => item.storeName);
      this.$confirm('是否确认删除店铺为"' + names + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return deleteStoreInfo({ ids: ids });
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(function () {});
    },
    submitForm() {
      this.$refs["bitTypeForm"].validate((valid) => {
        if (valid) {
          if (this.form.id != undefined) {
            this.form.createTime = null;
            addAndUpdateRole(this.form).then((response) => {
              if (response.success) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            
            addAndUpdateRole(this.form).then((response) => {
              if (response.success) {
                this.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              }
            });
          }
        }
      });
    },
  },
};
</script>