<!--
 * @Author       : Lance Yi <latticeyi@gmail.com>
 * @Date         : 2020-11-03 14:03:38
 * @Description  : 商户中心 - 店铺列表
-->
<template>
  <div class="app-container">
    <el-row :gutter="10" :span="24" class="mb8">
      <el-col :span="1.5">
        <el-button
          class="mb8"
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          >新增</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-view"
          size="mini"
          :disabled="single"
          @click="handleLook"
          >查看</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          >修改</el-button
        >
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12" class="d-flex-algin-center mb8">
        <el-input
          v-model="queryParams.goodsName"
          placeholder="请输入商品名称进行查询"
          clearable
          size="small"
          class="mr5"
          @keyup.enter.native="handleQuery"
        />
        <el-input
          v-model="queryParams.goodsNo"
          placeholder="请输入商品编号进行查询"
          clearable
          size="small"
          class="mr5"
          @keyup.enter.native="handleQuery"
        />
        <!-- <el-select
          class="w-100 mr5"
          v-model="queryParams.status"
          clearable
          placeholder="请根据商品状态进行搜索"
          @change="handleQuery"
        >
          <el-option
            v-for="item in Dict.GOODS_STATUS"
            :key="item.key"
            :label="item.value"
            :value="item.key"
          >
          </el-option>
        </el-select> -->
        <el-button
          type="cyan"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          >搜索</el-button
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
      :height="tableHeight - 35"
      @row-dblclick="handleUpdate"
    >
      <el-table-column type="selection" width="50" align="center" fixed />
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
            <el-tag
              :type="Dict.STORE_GOODS_STATUS[scope.row[v.prop]].type"
              size="small"
              v-if="v.prop === 'status'"
              >{{ Dict.STORE_GOODS_STATUS[scope.row[v.prop]].value }}</el-tag
            >
            <el-tag
              v-else-if="v.prop === 'integralType'"
              :type="
                scope.row[v.prop] == null
                  ? ''
                  : Dict.INTEGRAL_TYPE[scope.row[v.prop]].type
              "
              size="small"
              >{{
                scope.row[v.prop] == null
                  ? ""
                  : Dict.INTEGRAL_TYPE[scope.row[v.prop]].value
              }}</el-tag
            >
            <span v-else-if="v.prop === 'createTime'">{{
              parseTime(scope.row[v.prop])
            }}</span>
            <span v-else>{{ scope.row[v.prop] }}</span>
          </template>
        </el-table-column>
      </template>
      <el-table-column
        label="操作"
        align="center"
        width="220"
        fixed="right"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="handleLook(scope.row)"
            >查看</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            >修改</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <pagination
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
  </div>
</template>
<script>
import { storeGoodsBasePageList } from "@/api/goods";
import XLSX from "xlsx";
// 默认表格展示列
const defaultColumns = [
  // {
  //   label: "店铺名称",
  //   show: true,
  //   prop: "storeName",
  //   align: "left",
  //   width: 100,
  // },
  {
    label: "商品名称",
    show: true,
    prop: "goodsName",
    align: "left",
  },
  {
    label: "商品编号",
    show: true,
    prop: "goodsNo",
    align: "center",
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
    label: "销售价",
    show: true,
    prop: "salePrice",
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
  // {
  //   label: "邮费",
  //   show: true,
  //   prop: "postage",
  //   align: "right",
  // },
  {
    label: "商品状态",
    show: true,
    prop: "status",
    align: "center",
    width: 100,
  },
  {
    label: "创建时间",
    show: true,
    prop: "createTime",
    align: "center",
    width: 180,
  },
];

export default {
  name: "GoodsIndex",
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
      // 浏览图
      previewSrcList: [],
    };
  },
  created() {
    this.getList();
  },
  activated() {
    this.getList();
  },
  methods: {
    /** 查询商品列表 */
    getList() {
      this.loading = true;
      storeGoodsBasePageList(this.queryParams).then((response) => {
        this.list = response.data.list;
        this.total = Number.parseInt(response.data.total);
        this.loading = false;
      });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 多选框选中数据 */
    handleSelectionChange(selection) {
      this.ids = selection;
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.$router.push({ name: "StoreGoodsDetail", query: { look: "false" } });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      const goodsId = row.id || this.ids.map((item) => item.id).toString();
      this.$router.push({
        name: "StoreGoodsDetail",
        query: { goodsId: goodsId, look: "false" },
      });
    },
    // 查看
    handleLook(row) {
      const goodsId = row.id || this.ids.map((item) => item.id).toString();
      this.$router.push({
        name: "StoreGoodsDetail",
        query: { goodsId: goodsId, look: "true" },
      });
    },
  },
};
</script>