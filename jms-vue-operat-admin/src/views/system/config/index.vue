<!--
 * @Author      : Lance Yi [QQ：342003386]
 * @Date        : 2020-08-27 14:43:47
 * @LastEditors  : Please set LastEditors
 * @LastEditTime : 2020-12-25 14:01:43
 * @FilePath    : \src\views\system\config\index.vue
 * @Description : 系统配置 - 默认参数配置
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
          v-hasPermi="['system:role:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:role:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:role:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="7" class="d-flex-algin-center">
        <el-input
          v-model="queryParams.quickQuery"
          placeholder="请输入名称/Key进行查询"
          clearable
          size="small"
          class="mr5"
          @keyup.enter.native="handleQuery"
        />
        <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
      </el-col>
      <right-toolbar
        :showSearch.sync="showSearch"
        :cols="columns"
        :grid="$route.name"
        :page="queryParams"
        @queryTable="getList"
        @updateCustom="getGridSetup"
        :showSearchBar="false"
        showCustom
        showRefreshBar
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="list"
      @selection-change="handleSelectionChange"
      border
      :height="tableHeight"
      @row-dblclick="handleUpdate"
      @sort-change="HandleSortChange"
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
          sortable="custom"
        >
          <template slot-scope="scope">
            <span v-if="v.prop === 'appDown' || v.prop === 'branchCtl'">
              <i class="iconfont srjtcheckboxoutline fs-20" v-if="!!scope.row[v.prop]"></i>
              <i class="iconfont srjtcheckboxoutlineblank fs-20" v-else></i>
            </span>
            <span v-else>{{scope.row[v.prop]}}</span>
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

    <!-- 添加或修改配置对话框 -->
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
      <el-form ref="ConfigForm" :model="form" label-width="90px" label-suffix=":">
        <el-form-item
          label="名称"
          prop="configName"
          required
          :rules="[{required: true, message: '请输入名称'}]"
        >
          <el-input v-model="form.configName" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item
          label="参数键"
          prop="configKey"
          required
          :rules="[{required: true, message: '请输入参数键'}]"
        >
          <el-input v-model="form.configKey" placeholder="请输入参数键" :disabled="isEdit" />
        </el-form-item>
        <el-form-item
          label="参数值"
          prop="configValue"
        >
          <el-input v-model="form.configValue" placeholder="请输入参数值" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.remarks" type="textarea" placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item label="附加配置" required>
          <el-checkbox v-model="form.appDown" :true-label="1" :false-label="0">是否线下使用</el-checkbox>
          <el-checkbox v-model="form.branchCtl" :true-label="1" :false-label="0">是否控制分店</el-checkbox>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm" size="mini">确 定</el-button>
        <el-button @click="cancel" size="mini">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getConfigList,
  addConfig,
  updateConfig,
  getConfig,
  delConfig,
} from "@/api/system/config";

const defaultFrom = {
  id: undefined,
  appDown: 0,
  branchCtl: 0,
  configKey: undefined,
  configName: undefined,
  configValue: undefined,
  remarks: undefined,
};

const defaultColumns = [
  {
    label: "参数名称",
    show: true,
    prop: "configName",
    align: "left",
    width: 280,
  },
  {
    label: "参数Key",
    show: true,
    prop: "configKey",
    align: "left",
    width: 300,
  },
  {
    label: "参数Value",
    show: true,
    prop: "configValue",
    align: "left",
    width: 150,
  },
  {
    label: "线下使用",
    show: true,
    prop: "appDown",
    align: "center",
    width: 150,
  },
  {
    label: "控制分店",
    show: true,
    prop: "branchCtl",
    align: "center",
    width: 150,
  },
  { label: "备注", show: true, prop: "remarks", align: "left" },
];

export default {
  name: "SystemConfig",
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
      // 弹窗标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 是否是修改弹出层
      isEdit: false,
      // 日期范围
      dateRange: [],
      // 查询参数
      queryParams: {},
      // 表单参数
      form: _.assign({}, defaultFrom),
      // 自定义表单列表
      columns: [],
    };
  },
  created() {
  },
  methods: {
    /** 获取自定义列表 */
    getGridSetup() {
      getGridSetup({ gridType: this.$route.name }).then((res) => {
        if (res.data) {
          let _data = _.cloneDeep(JSON.parse(res.data.gridSetup));
          if (_data.cols) {
            this.columns = _data.cols;
          }
          if (!_.isEmpty(_data.page)) {
            this.queryParams = _data.page;
          }
        } else {
          this.columns = _.cloneDeep(defaultColumns);
          this.queryParams = _.cloneDeep(this.Dict.QUERY_PARAMS);
        }
        this.key = this.key + 1;
        this.getList();
      });
    },
    /** 查询商品品牌列表 */
    getList() {
      this.loading = true;
      getConfigList(this.queryParams).then((response) => {
        this.list = response.data;
        this.total = Number.parseInt(response.total);
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
      this.form = _.assign({}, defaultFrom);
      this.resetForm("ConfigForm");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.resetForm("queryForm");
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
      this.title = "默认参数配置 - 添加";
      this.isEdit = false;
      console.log(this.form);
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids.map((item) => item.id);
      getConfig(id).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "默认参数配置 - 修改";
        this.isEdit = true;
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids.map((item) => item.id);
      const codes = row.brandNo || this.ids.map((item) => item.brandNo);
      this.$confirm(
        '是否确认删除商品品牌编号为"' + codes + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return delConfig({ ids: ids.toString() });
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(function () {});
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["ConfigForm"].validate((valid) => {
        if (valid) {
          if (this.form.id != undefined) {
            updateConfig(this.form.id, this.form).then((response) => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            addConfig(this.form).then((response) => {
              if (response.code === 200) {
                this.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              }
            });
          }
        }
      });
    },
    /** 自定义列排序查询 */
    HandleSortChange(col) {
      this.queryParams.order = col.prop;
      this.queryParams.direction = this.filterKeyToValue(col.order, "ORDER");
      this.handleQuery();
    },
  },
};
</script>