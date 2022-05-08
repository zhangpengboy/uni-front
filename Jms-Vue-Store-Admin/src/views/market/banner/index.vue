<!--
 * @Author       : Lance Yi <latticeyi@gmail.com>
 * @Date         : 2020-12-01 10:47:51
 * @Description  : 营销中心 - banner管理
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
          >添加广告图</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="delMultiple"
          @click="handleDelete"
          >批量删除</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-sell"
          size="mini"
          :disabled="upMultiple"
          @click="handleGoodsUp"
          >批量上架</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-sold-out"
          size="mini"
          :disabled="downMultiple"
          @click="handleGoodsDown"
          >批量下架</el-button
        >
      </el-col>
      <el-col :span="7" class="d-flex-algin-center">
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
            <el-image
              v-if="v.prop === 'image'"
              :src="scope.row[v.prop]"
              fit="fill"
              :lazy="true"
              :preview-src-list="[scope.row[v.prop]]"
            ></el-image>
            <el-tag
              v-else-if="v.prop === 'status'"
              :type="Dict.GOODS_STATUS[scope.row[v.prop]].type"
              size="small"
              >{{ Dict.GOODS_STATUS[scope.row[v.prop]].value }}</el-tag
            >
            <el-tag
              v-else-if="v.prop === 'urlType'"
              :type="Dict.URL_TYPE[scope.row[v.prop] - 1].type"
              size="small"
              >{{ Dict.URL_TYPE[scope.row[v.prop] - 1].value }}</el-tag
            >
            <span v-else-if="v.prop === 'type'">{{
              filterKeyToValue(scope.row[v.prop], "BANNER_TYPE")
            }}</span>
            <span v-else-if="v.prop === 'createTime' || v.prop === 'endTime'">{{
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

    <!-- 添加广告图弹窗 -->
    <ActBannerDialog
      v-if="open"
      :open="open"
      :form="form"
      @cancel="open = false"
      @submit="handleSubmitBanner"
    />
  </div>
</template>

<script>
import {
  getActAdvertisePageList,
  addActGoods,
  delActAdvertise,
  updateActAdvertiseStatus,
} from "@/api/goods";
import ActBannerDialog from "../components/ActBannerDialog";

// 默认表格展示列
const defaultColumns = [
  {
    label: "图片",
    show: true,
    prop: "image",
    align: "center",
    width: 100,
  },
  {
    label: "店铺名称",
    show: true,
    prop: "storeName",
    align: "center",
    width: 180,
  },
  {
    label: "位置",
    show: true,
    prop: "actName",
    align: "center",
    width: 180,
  },
  {
    label: "类型",
    show: true,
    prop: "urlType",
    align: "center",
    width: 180,
  },
  {
    label: "商品ID|店铺ID|链接|活动栏目",
    show: true,
    prop: "url",
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
    label: "创建时间",
    show: true,
    prop: "createTime",
    align: "center",
    width: 180,
  },
  {
    label: "结束时间",
    show: true,
    prop: "endTime",
    align: "center",
    width: 180,
  },
];

export default {
  name: "MarketBanner",
  components: {
    ActBannerDialog,
  },
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
      // 活动code
      routeQuery: {},
      // 选择的商品的索引
      tempRowIndex: null,
      // 是否多选
      isMultiple: true,
      // 已通过
      upMultiple: true,
      // 删除
      delMultiple: true,
      // 下架
      downMultiple: true,
    };
  },
  mounted() {
    // 设置标题 获取活动code 店铺活动套餐ID
    this.routeQuery = this.$route.query;
    this.$route.meta.title = this.$route.query.actName || "商品列表";
    this.queryParams = _.assign(this.queryParams, {
      actCode: this.routeQuery.actCode,
    });
    this.getList();
  },
  methods: {
    /** 查询商品列表 */
    getList() {
      this.loading = true;
      getActAdvertisePageList(this.queryParams).then((response) => {
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
      this.upMultiple = true;
      this.delMultiple = true;
      this.downMultiple = true;
      const upList = selection.filter((v) => v.status == 2 || v.status == 4);
      if (_.size(upList) > 0) this.upMultiple = false;
      const downList = selection.filter((v) => v.status == 3);
      if (_.size(downList) > 0) this.downMultiple = false;
      const delList = selection.filter((v) => v.status != 3);
      if (_.size(delList) > 0) this.delMultiple = false;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.open = true;
      this.form = {
        storePackId: this.routeQuery.storePackId,
        storeId: null,
        storeName: null,
        image: null,
        actCode: null,
        actName: null,
        url: null,
        urlType: 1,
        topBarColor: null,
      };
    },
    /** 删除按钮操作 */
    handleDelete() {
      const _that = this;
      const ids = this.ids.map((item) => item.id);
      this.$confirm('是否确认删除广告图为"' + ids + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return delActAdvertise({
            ids: ids,
          });
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(function () {});
    },
    /** 商品上架 */
    handleGoodsUp() {
      const ids = this.ids
        .filter((v) => v.status == 2 || v.status == 4)
        .map((v) => v.id);
      updateActAdvertiseStatus({ ids: ids, status: 3 }).then((res) => {
        this.upMultiple = true;
        this.getList();
        this.msgSuccess("批量上架成功");
      });
    },
    /** 商品下架 */
    handleGoodsDown(row) {
      const ids = this.ids.filter((v) => v.status == 3).map((v) => v.id);
      updateActAdvertiseStatus({ ids: ids, status: 4 }).then((res) => {
        this.downMultiple = true;
        this.getList();
        this.msgSuccess("批量下架成功");
      });
    },
    /** 添加广告图 */
    handleSubmitBanner() {
      this.open = false;
      this.handleQuery();
    },
  },
};
</script>