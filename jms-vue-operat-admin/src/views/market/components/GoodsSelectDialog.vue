<!--
 * @Author       : Lance Yi <latticeyi@gmail.com>
 * @Date         : 2020-12-02 18:41:58
 * @Description  : 营销活动 - 添加活动商品选择弹出框
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
              <el-tag
                v-if="v.prop === 'integralType'"
                :type="scope.row[v.prop] == null ? '' : Dict.INTEGRAL_TYPE[scope.row[v.prop]].type"
                size="small"
                >{{ scope.row[v.prop] == null ? '' : Dict.INTEGRAL_TYPE[scope.row[v.prop]].value }}</el-tag
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
    </div>
  </el-dialog>
</template>

<script>
import { getGoodsPageList } from "@/api/goods";

// 默认表格列
const defaultColumns = [
  {
    label: "商品分类",
    show: true,
    prop: "primaryCategoryName",
    align: "center",
    width: 150,
  },
  {
    label: "商品名称",
    show: true,
    prop: "goodsName",
    align: "left",
    width: 399,
  },
  {
    label: "销售价",
    show: true,
    prop: "salePrice",
    align: "right",
    width: 100,
  },
  {
    label: "市场价",
    show: true,
    prop: "marketPrice",
    align: "right",
    width: 100,
  },
  {
    label: "积分类型",
    show: true,
    prop: "integralType",
    align: "center",
    width: 100,
  },
  {
    label: "积分",
    show: true,
    prop: "integral",
    align: "right",
    width: 100,
  },
];

export default {
  name: "GoodsSelectDialog",
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
    // 商品查询类型 goods(常规商品)
    type: {
      type: String,
      default: "goods",
    },
    // 商品选择类型
    selectType: {
      type: String,
      default: undefined,
    },
    // 商品选择类型
    supplierId: {
      type: String,
      default: undefined,
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
      if (this.type == "goods") {
        // 普通商品
        this.queryParams.isActive = 0; // 未参与活动
      } else if (this.type == "pushGoods") {
        // 供应商商品 赛选上线的商品(数字货架)
        this.queryParams.status = 3;
        this.queryParams.storeId = this.supplierId;
        this.queryParams.actCode = 'MTH_E001'
      } 
      else if (this.type == "pushGiftGoods") {
          // 供应商商品 赛选上线的商品（礼券妈妈）
          this.queryParams.status = 3;
          this.queryParams.storeId = this.supplierId;
          this.queryParams.actCode = 'MTH_E002'
      }
      getGoodsPageList(this.queryParams).then((response) => {
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