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
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          >修改</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-s-finance"
          size="mini"
          :disabled="single"
          @click="handleShare"
          >结算</el-button
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
        <el-form-item label="挖矿类型" required>
          <el-select v-model="form.digType" class="w-100" :disabled="isEdit">
            <el-option
              v-for="(v, i) in Dict.DIG_TYPE_ENUM"
              :key="i"
              :label="v.value"
              :value="v.key"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="产币类型" required>
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
        <el-form-item label="结算时间" required>
          <el-date-picker
            v-model="form.date"
            type="date"
            value-format="timestamp"
            format="yyyy 年 MM 月 dd 日"
            placeholder="选择收益日(当前日期之前)"
            class="w-100"
            :disabled="isEdit"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结算币价" required v-if="!showDig">
          <el-input
            v-model="form.bit"
            placeholder="请输入日结算币价（日理论币价>=日结算币价）"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          @click="submitForm"
          size="mini"
          v-show="!showDig"
        >
          确定
        </el-button>
        <el-button
          type="success"
          @click="submitForm"
          size="mini"
          v-show="showDig"
        >
          开始结算
        </el-button>
        <el-button @click="cancel" size="mini">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getDigBitList,
  addDigBit,
  editDigBit,
  shareDigBit,
} from "@/api/finance";

const defaultColumns = [
  {
    label: "订单号",
    show: true,
    prop: "orderNo",
    align: "center",
  },
  {
    label: "挖矿类型",
    show: true,
    prop: "digType",
    align: "center",
  },
  {
    label: "产币类型",
    show: true,
    prop: "bitType",
    align: "center",
  },
  {
    label: "挖矿收益日",
    show: true,
    prop: "dayStr",
    align: "center",
  },
  {
    label: "昨日总算力",
    show: true,
    prop: "hash",
    align: "center",
  },
  {
    label: "昨日挖矿数量",
    show: true,
    prop: "bitAll",
    align: "center",
  },
  {
    label: "结算币价",
    show: true,
    prop: "minBit",
    align: "center",
  },
  {
    label: "所有手续费",
    show: true,
    prop: "feiAll",
    align: "center",
  },
  {
    label: "说明",
    show: true,
    prop: "mark",
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
  name: "FinanceDigBit",
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
      getDigBitList(this.queryParams).then((response) => {
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
        digType: undefined,
        bitType: undefined,
        date: undefined,
        bit: undefined,
      };
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
      this.isEdit = false;
      this.showDig = false;
      this.title = "添加配置";
    },

    /** 结算按钮操作 */
    handleShare() {
      // this.reset();
      // this.open = true;
      // this.isEdit = false;
      // this.showDig = true;
      // this.title = "创建结算任务";
      this.$confirm('是否结算任务?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'success'
      }).then(() => {
        // 立即结算
        console.log(this.ids)
        shareDigBit({
          orderNo: this.ids[0].orderNo
        }).then((res) => {
          if (res.success) {
            this.msgInfo(`成功分发${res.data}个币`);
            this.open = false;
            this.showDig = false;
            this.getList();
          }
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        });          
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.open = true;
      this.isEdit = true;
      this.showDig = false;
      this.title = "修改配置";
      this.form = _.assign({}, row.id ? row : this.ids[0]);
      this.$set(this.form, "bit", this.form.minBit);
      this.$set(this.form, "date", new Date(this.form.dayStr));
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
      this.$refs["digBitForm"].validate((valid) => {
        if (valid) {
          if (!this.showDig) {
            // 保存、编辑
            if (this.form.id != undefined) {
              this.form.createTime = null;
              this.$set(this.form, "minBit", this.form.bit);
              editDigBit(this.form).then((response) => {
                if (response.success) {
                  this.msgSuccess("修改成功");
                  this.open = false;
                  this.getList();
                }
              });
            } else {
              addDigBit(this.form).then((response) => {
                if (response.success) {
                  this.msgSuccess("新增成功");
                  this.open = false;
                  this.getList();
                }
              });
            }
          } else {
            // 立即结算
            shareDigBit(this.form).then((res) => {
              if (res.success) {
                this.msgInfo(`成功分发${res.data}个币`);
                this.open = false;
                this.showDig = false;
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