<!--
 * @Author       : Lance Yi <latticeyi@gmail.com>
 * @Date         : 2020-12-02 18:41:58
 * @Description  : 数字货架商品选择弹出框
-->
<template>
  <el-dialog
    title="商品选择"
    :visible="open"
    width="1080px"
    append-to-body
    v-el-dialog-drag
    class="goods-dialog"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="handleCancel"
  >
    <div class="app-container">
      <!-- 按钮 -->
      <el-row :gutter="10" class="mb5">
        <el-col :span="16" class="d-flex-algin-center">
          <el-input
            v-model="queryParams.goodsName"
            placeholder="请输入商品关键字进行查询"
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
          <el-button
            type="primary"
            icon="el-icon-circle-plus-outline"
            size="mini"
            @click="handleAddSelections"
            v-if="multiple"
            >添加勾选</el-button
          >
          <el-button
            type="info"
            icon="el-icon-circle-close"
            size="mini"
            @click="handleCancel"
            v-if="multiple"
            >取消</el-button
          >
        </el-col>
      </el-row>
      <el-alert
        title="双击表格行选择商品"
        type="warning"
        class="mb10"
        v-if="!this.multiple"
      />

      <el-table
        v-loading="loading"
        :data="list"
        border
        :height="500"
        :key="key"
        @row-dblclick="handleRowClick"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="50"
          align="center"
          fixed
          v-if="multiple"
        />
        <el-table-column
          label="序号"
          type="index"
          width="60"
          align="center"
        ></el-table-column>
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
              <span size="small" v-if="v.prop === 'cloudStore'">{{
                scope.row.cloudStore.storeName
              }}</span>
              <span size="small" v-else-if="v.prop === 'goods'">{{
                scope.row.goods.goodsName
              }}</span>
              <el-tag
                :type="Dict.CLOUD_STORE_GOODS_STATUS[scope.row[v.prop]].type"
                size="small"
                v-else-if="v.prop === 'status'"
                >{{ Dict.CLOUD_STORE_GOODS_STATUS[scope.row[v.prop]].value }}</el-tag
              >
              <span v-else-if="v.prop === 'createTime'">{{
                parseTime(scope.row[v.prop])
              }}</span>
              <span v-else-if="v.prop === 'endTime'">{{
                parseTime(scope.row[v.prop])
              }}</span>
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
    </div>
  </el-dialog>
</template>

<script>
import { getPushGoodsList } from "@/api/goods";

// 默认表格列
const defaultColumns = [
  {
    label: "店铺名称",
    show: true,
    prop: "cloudStore",
    align: "center",
  },
  {
    label: "商品名称",
    show: true,
    prop: "goods",
    align: "center",
  },
  {
    label: "供应商名称",
    show: true,
    prop: "supplierName",
    align: "center",
  },
  {
    label: "状态",
    show: true,
    prop: "status",
    align: "center",
    width: 100,
  },
  {
    label: "结束时间",
    show: true,
    prop: "endTime",
    align: "center",
    width: 160,
  },
];

export default {
  name: "pushGoodsSelectDialog",
  props: {
    // 是否打开
    open: {
      type: Boolean,
      default: false,
    },
    // 表单数据对象
    value: Object,
    // 是否是修改
    isEdit: {
      type: Boolean,
      default: false,
    },
    // 是否多选
    multiple: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 总条数
      total: 0,
      // 用户表格数据
      list: null,
      // 查询参数
      queryParams: _.assign({}, this.Dict.QUERY_PARAMS),
      // 表格的Key
      key: 1,
      // 默认表头
      columns: defaultColumns,
      // 选中的列
      rowSelections: [],
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询商品列表 */
    getList() {
      this.loading = true;
      // 已推送的数字货架商品
      // this.queryParams.status = 1; //已陈列
      getPushGoodsList(this.queryParams).then((response) => {
        this.list = response.data.list;
        this.total = Number.parseInt(response.data.total);
        this.loading = false;
      });
    },
    /** 关闭弹窗 */
    handleCancel() {
      this.$emit("cancel");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 选择行 */
    handleRowClick(row) {
      if (!this.multiple) {
        this.$emit("submit", row, "single", this.selectType);
      }
    },
    /** 添加勾选数据 */
    handleAddSelections() {
      if (_.size(this.rowSelections) == 0) {
        this.msgInfo("请先勾选商品!");
        return false;
      }
      this.$emit("submit", this.rowSelections, "multiple", this.selectType);
    },
    /** 多选框选中数据 */
    handleSelectionChange(selection) {
      this.rowSelections = selection;
    },
  },
};
</script>