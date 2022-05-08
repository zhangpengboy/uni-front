<!--
 * @Author       : Lance Yi <latticeyi@gmail.com>
 * @Date         : 2020-11-03 14:03:38
 * @Description  : 提现手续费设置
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
            <span v-if="v.prop === 'bitType'">{{
              Dict.BIT_TYPE[scope.row[v.prop]].value
            }}</span>
            <span v-else-if="v.prop === 'feiType'">{{
              Dict.FEI_TYPE_ENUM[scope.row[v.prop] - 1].value
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
        ref="drawFeiForm"
        :model="form"
        label-width="100px"
        label-suffix=":"
      >
        <el-form-item label="手续费类型" required>
          <el-select v-model="form.no" class="w-100">
            <el-option
              v-for="(v, i) in Dict.FEI_NO_ENUM"
              :key="i"
              :label="v.value"
              :value="v.key"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="提现币类型" required>
          <el-select v-model="form.bitType" class="w-100">
            <el-option
              v-for="(v, i) in Dict.BIT_TYPE"
              :key="i"
              :label="v.value"
              :value="v.key"
              v-show="i > 0"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="收费类型" required>
          <el-select v-model="form.feiType" class="w-100">
            <el-option
              v-for="(v, i) in Dict.FEI_TYPE_ENUM"
              :key="i"
              :label="v.value"
              :value="v.key"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="费率" required>
          <el-input v-model="form.fei" placeholder="请输入费率"></el-input>
        </el-form-item>
        <el-form-item label="状态" required>
          <el-radio v-model="form.status" :label="1">启用</el-radio>
          <el-radio v-model="form.status" :label="0">禁用</el-radio>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm" size="mini">
          确定
        </el-button>
        <el-button @click="cancel" size="mini">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getDrawFeiList, addDrawFei, editDrawFei } from "@/api/finance";

const defaultColumns = [
  {
    label: "描述",
    show: true,
    prop: "name",
    align: "center",
  },
  {
    label: "费率",
    show: true,
    prop: "fei",
    align: "center",
  },
  {
    label: "费率类型",
    show: true,
    prop: "feiType",
    align: "center",
  },
  {
    label: "币类型",
    show: true,
    prop: "bitType",
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
  name: "FinanceDrawFei",
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
      // 是否立即结算
      showDig: false,
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询列表 */
    getList() {
      this.loading = true;
      getDrawFeiList(this.queryParams).then((response) => {
        this.list = response.data.list;
        this.total = Number.parseInt(response.data.total);
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
        no: undefined,
        name: undefined,
        fei: undefined,
        feiType: undefined,
        status: 1
      };
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
    /** 提价表单 */
    submitForm() {
      this.$refs["drawFeiForm"].validate((valid) => {
        if (valid) {
          this.form.name = this.Dict.FEI_NO_ENUM.filter(
            (v) => v.key == this.form.no
          )
            .map((v) => v.value)
            .toString();
          if (this.form.id != undefined) {
            this.form.createTime = null;
            editDrawFei(this.form).then((response) => {
              if (response.success) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            addDrawFei(this.form).then((response) => {
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