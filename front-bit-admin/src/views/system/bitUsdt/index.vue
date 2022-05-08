<!--
 * @Author       : Lance Yi <latticeyi@gmail.com>
 * @Date         : 2020-11-03 14:03:38
 * @Description  : 系统管理 - 
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
          v-model="queryParams.quickQuery"
          placeholder="请输入名称/手机号等进行查询"
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
            <span v-if="v.prop === 'machineType'">{{
              Dict.MACHINE_TYPE_ENUM[scope.row[v.prop] - 1].value
            }}</span>
            <span v-else-if="v.prop === 'bitType'">{{
              Dict.BIT_TYPE_ENUM[scope.row[v.prop] - 2].value
            }}</span>
            <el-tag
              v-else-if="v.prop === 'status'"
              :type="Dict.STATUS[scope.row[v.prop]].type"
              size="small"
              >{{ Dict.STATUS[scope.row[v.prop]].value }}</el-tag
            >
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
        <el-form-item label="挖币类型" required prop="bitType">
          <el-select v-model="form.bitType" class="w-100" :disabled="isEdit">
            <el-option
              v-for="(v, i) in Dict.BIT_TYPE_ENUM"
              :key="i"
              :label="v.value"
              :value="v.key"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="算力单位" required prop="unit">
          <el-input
            v-model="form.unit"
            placeholder="请输入挖矿算力单位(TH/s)"
          ></el-input>
        </el-form-item>
        <el-form-item label="日理论收益" required prop="num">
          <el-input
            v-model="form.num"
            placeholder="请输入日理论收益"
          ></el-input>
        </el-form-item>
        <el-form-item label="理论日收益" required prop="usdt">
          <el-input v-model="form.usdt" placeholder="请输入理论日收益(USDT)">
            <template slot="append">USDT</template>
          </el-input>
        </el-form-item>
        <el-form-item label="理论日收益" required prop="cny">
          <el-input v-model="form.cny" placeholder="请输入理论日收益(CNY)">
            <template slot="append">CNY</template>
          </el-input>
        </el-form-item>
        <el-form-item label="电费单价" required prop="powerPrice">
          <el-input v-model="form.powerPrice" placeholder="请输入电费单价">
            <template slot="append">CNY/度</template>
          </el-input>
        </el-form-item>
        <el-form-item label="状态" required>
          <el-radio v-model="form.status" :label="1">启用</el-radio>
          <el-radio v-model="form.status" :label="0">禁用</el-radio>
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
import { getBitUsdtList, addBitUsdt, editBitUsdt } from "@/api/system";

const defaultColumns = [
  {
    label: "产出类型",
    show: true,
    prop: "bitType",
    align: "center",
  },
  {
    label: "算力",
    show: true,
    prop: "hash",
    align: "center",
  },
  {
    label: "单位",
    show: true,
    prop: "unit",
    align: "center",
  },
  {
    label: "日理论收益",
    show: true,
    prop: "num",
    align: "center",
  },
  {
    label: "日理论收益(USDT)",
    show: true,
    prop: "usdt",
    align: "center",
  },
  {
    label: "日理论收益(CNY)",
    show: true,
    prop: "cny",
    align: "center",
  },
  {
    label: "电费单价(CNY/度)",
    show: true,
    prop: "powerPrice",
    align: "center",
  },
  {
    label: "状态",
    show: true,
    prop: "status",
    align: "center",
  },
];

export default {
  name: "SystemBitType",
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
        bitType: [
          { required: true, message: "挖币类型不能为空", trigger: "blur" },
        ],
        unit: [
          { required: true, message: "算力单位不能为空", trigger: "blur" },
        ],
        num: [
          { required: true, message: "日理论收益不能为空", trigger: "blur" },
        ],
        usdt: [
          { required: true, message: "理论日收益(USDT)不能为空", trigger: "blur" },
        ],
        cny: [
          { required: true, message: "理论日收益(CNY)不能为空", trigger: "blur" },
        ],
        powerPrice: [
          { required: true, message: "电费单价不能为空", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询店铺列表 */
    getList() {
      this.loading = true;
      getBitUsdtList(this.queryParams).then((response) => {
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
        bitType: undefined,
        hash: 1,
        unit: undefined,
        num: undefined,
        usdt: undefined,
        status: 0,
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
      this.form = _.assign({}, row.id ? row : this.ids[0]);
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
            editBitUsdt(this.form).then((response) => {
              if (response.success) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            addBitUsdt(this.form).then((response) => {
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