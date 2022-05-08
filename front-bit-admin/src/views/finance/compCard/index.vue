<!--
 * @Author       : Lance Yi <latticeyi@gmail.com>
 * @Date         : 2020-11-03 14:03:38
 * @Description  : 挖矿结算
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
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="single"
          @click="handleDelete"
          >删除</el-button
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
            <span v-if="v.prop === 'digType'">{{
              Dict.DIG_TYPE_ENUM[scope.row[v.prop] - 1].value
            }}</span>
            <span v-else-if="v.prop === 'bitType'">{{
              Dict.BIT_TYPE_ENUM[scope.row[v.prop] - 2].value
            }}</span>
            <el-tag
              v-else-if="v.prop === 'status'"
              :type="Dict.DIG_BIT_STATUS[scope.row[v.prop]].type"
              size="small"
              >{{ Dict.DIG_BIT_STATUS[scope.row[v.prop]].value }}</el-tag
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
        ref="digBitForm"
        :model="form"
        label-width="100px"
        label-suffix=":"
      >
        <el-form-item label="持卡手机号" required>
          <el-input v-model="form.phone" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item label="持卡用户名" required>
          <el-input
            v-model="form.cardName"
            placeholder="请输入持卡用户名"
          ></el-input>
        </el-form-item>
        <el-form-item label="银行卡号" required>
          <el-input
            v-model="form.cardNo"
            placeholder="请输入银行卡号"
          ></el-input>
        </el-form-item>
        <el-form-item label="开户行" required>
          <el-input
            v-model="form.bankName"
            placeholder="请输入开户行"
          ></el-input>
        </el-form-item>
        <el-form-item label="开户行地址" required>
          <el-input
            v-model="form.bankAddress"
            placeholder="请输入开户行地址"
          ></el-input>
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
import {
  getCompCardList,
  addCompCard,
  editCompCard,
  shareDigBit,
  delCompCard,
} from "@/api/finance";

const defaultColumns = [
  {
    label: "持卡手机号",
    show: true,
    prop: "phone",
    align: "center",
  },
  {
    label: "持卡用户名",
    show: true,
    prop: "cardName",
    align: "center",
  },
  {
    label: "银行卡号",
    show: true,
    prop: "cardNo",
    align: "center",
  },
  {
    label: "开户行",
    show: true,
    prop: "bankName",
    align: "center",
  },
  {
    label: "开户行地址",
    show: true,
    prop: "bankAddress",
    align: "center",
  },
];

export default {
  name: "FinanceCompCard",
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
      getCompCardList(this.queryParams).then((response) => {
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
        phone: undefined,
        cardName: undefined,
        cardNo: undefined,
        bankName: undefined,
        bankAddress: undefined,
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
      this.title = "添加公司对公账号";
    },
    /** 删除按钮操作 */
    handleDelete() {
      const ids = this.ids.map((item) => item.id);
      const names = this.ids.map((item) => item.cardNo);
      this.$confirm('是否确认删除对公账号为"' + names + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return delCompCard({ id: ids.toString() });
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(function () {});
    },
    submitForm() {
      this.$refs["digBitForm"].validate((valid) => {
        if (valid) {
          addCompCard(this.form).then((response) => {
            if (response.success) {
              this.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            }
          });
        }
      });
    },
  },
};
</script>