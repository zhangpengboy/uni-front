<!--
 * @Author       : Lance Yi <latticeyi@gmail.com>
 * @Date         : 2020-12-01 10:47:51
 * @Description  : 营销中心 - 商品管理
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
          >添加商品</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-sell"
          size="mini"
          :disabled="multiple"
          @click="handleGoodsUp"
          >批量上架</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          >批量删除</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-sold-out"
          size="mini"
          :disabled="multiple"
          @click="handleGoodsDown"
          >批量下架</el-button
        >
      </el-col>
      <el-col :span="9" class="d-flex-algin-center">
        <el-input
          v-model="queryParams.goodsName"
          placeholder="请输入商品名称进行查询"
          clearable
          size="small"
          class="mr5"
          @keyup.enter.native="handleQuery"
        />
        <el-select
          style="width:80%;"
          class="mr5"
          clearable
          v-model="queryParams.status"
          placeholder="请选择活动商品状态"
        >
          <el-option
            v-for="item in Dict.ACT_STATUS"
            :key="item.key"
            :label="item.value"
            :value="item.key"
          >
          </el-option>
        </el-select>
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
      <el-table-column type="selection" width="50" align="center" fixed="left" />
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
              v-if="v.prop === 'status'"
              :type="Dict.GOODS_STATUS[scope.row[v.prop]].type"
              size="small"
              >{{ Dict.GOODS_STATUS[scope.row[v.prop]].value }}</el-tag
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
        width="200"
        class-name="small-padding fixed-width"
        fixed="right"
      >
        <template slot-scope="scope">
          <!-- <el-button
            size="mini"
            type="text"
            icon="el-icon-circle-check"
            @click="handleGoodsPass(scope.row)"
            v-show="scope.row.status == 0"
            >通过</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-circle-close"
            @click="handleGoodsReject(scope.row)"
            v-show="scope.row.status == 0"
            >驳回</el-button
          > -->
          <el-button
            size="mini"
            type="text"
            icon="el-icon-sell"
            @click="handleGoodsUp(scope.row)"
            v-show="scope.row.status == 2 || scope.row.status == 4"
            >上架</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-sold-out"
            @click="handleGoodsDown(scope.row)"
            v-show="scope.row.status == 3"
            >下架</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            >删除</el-button
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

    <!-- 选择活动商品弹窗 -->
    <GoodsSelectDialog
      v-if="open"
      :key="'goodsSelect_' + tempRowIndex"
      :open="open"
      type="goods"
      :multiple="isMultiple"
      @cancel="
        open = false;
        tempRowIndex = null;
      "
      @submit="handleGoodsSelect"
    />
  </div>
</template>

<script>
import {
  getActGoodsPageList,
  addActGoods,
  delActGoods,
  updateActGoodsStatus,
} from "@/api/goods";
import GoodsSelectDialog from "../components/GoodsSelectDialog";

// 默认表格展示列
const defaultColumns = [

  {
    label: "商品名称",
    show: true,
    prop: "goodsName",
    align: "left",
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
  {
    label: "邮费",
    show: true,
    prop: "postage",
    align: "right",
    width: 100,
  },
  // {
  //   label: "商品状态",
  //   show: true,
  //   prop: "status",
  //   align: "center",
  //   width: 100,
  // },
  {
    label: "活动商品状态",
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
  name: "MarketGoods",
  components: {
    GoodsSelectDialog,
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
      getActGoodsPageList(this.queryParams).then((response) => {
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
      const upList = selection.filter((v) => v.status == 2 || v.status == 4);
      if (_.size(upList) > 0) this.upMultiple = false;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.open = true;
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      // console.log(777, row);
      let ids;
      if (row.id) {
        ids = [row.id];
      } else {
        ids = this.ids.filter((v) => v.status != 3  ).map((item) => item.id);
      }
      if (ids.length <= 0) {
        return this.msgError("选择商品没有可删除商品");
      }
      const _that = this
      this.$confirm('是否确认删除该商品?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return delActGoods({ ids: ids, actCode: _that.routeQuery.actCode });
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(function () {});
    },
    // /** 商品上架活动 */
    handleGoodsUp(row) {
      let actGoodList = [];
      if(row.id) {
        actGoodList.push(_.assign({},{ id: row.id, status: 3, actCode: this.routeQuery.actCode }));
      }else {
        this.ids
          .filter((v) => v.status == 2 || v.status == 4 || v.status == 0)
          .map((v) => {
            actGoodList.push(
              _.assign(
                {},
                { id: v.id, status: 3, actCode: this.routeQuery.actCode }
              )
            );
          });
      }
      if (actGoodList.length <= 0) {
        return this.msgError("选择商品无法上架");
      }
      updateActGoodsStatus(actGoodList).then((res) => {
        this.upMultiple = true;
        this.getList();
        this.msgSuccess("批量上架成功");
      });
    },
    // /** 商品下架 */
    handleGoodsDown(row) {
      let actGoodList = [];
      if(row.id) {
        actGoodList.push(_.assign({},{ id: row.id, status: 4, actCode: this.routeQuery.actCode }));
      }else {
        this.ids
          .filter((v) => v.status == 3)
          .map((v) => {
            actGoodList.push(
              _.assign(
                {},
                { id: v.id, status: 4, actCode: this.routeQuery.actCode }
              )
            );
          });
      }
      if (actGoodList.length <= 0) {
        return this.msgError("选择商品无法下架");
      }
      updateActGoodsStatus(actGoodList).then((res) => {
        this.upMultiple = true;
        this.getList();
        this.msgSuccess("下架成功");
      });
    },

    /** 选择商品添加活动, rows: 选中的商品对象或数组 type: 标识对象还是数组 single | multiple */
    handleGoodsSelect(rows, type) {
      let gooActList = [];
      _.map(rows, (v) => {
        gooActList.push(
          _.assign(
            {},
            {
              goodsId: v.id,
              goodsName: v.goodsName,
              actBrandCode: v.brandCode,
              actBrandName: v.brandName,
              storeId: v.storeId,
              storeName: v.storeName,
              actCode: this.routeQuery.actCode,
              actName: this.routeQuery.actName,
              storePackId: this.routeQuery.storePackId,
            }
          )
        );
      });
      addActGoods(gooActList).then((res) => {
        this.msgSuccess("添加商品成功");
        this.getList();
        this.open = false;
      });
    },
  },
};
</script>