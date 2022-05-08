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
          icon="el-icon-check"
          size="mini"
          :disabled="toAuditMultiple"
          @click="handleGoodsPass"
          >批量通过</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-close"
          size="mini"
          :disabled="toAuditMultiple"
          @click="handleGoodsReject"
          >批量拒绝</el-button
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
          type="info"
          icon="el-icon-sold-out"
          size="mini"
          :disabled="downMultiple"
          @click="handleGoodsDown"
          >批量下架</el-button
        >
      </el-col>
      <el-col :span="3">
        <el-select
          clearable
          v-model="queryParams.actCode"
          @change="handleActCodeChange"
          placeholder="请选择活动"
          class="w-100"
        >
          <el-option
            v-for="v in actOptions"
            :key="v.id"
            :label="v.name"
            :value="v.code"
          >
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="3">
        <el-select
          clearable
          v-model="queryParams.status"
          @change="handleStatusChange"
          placeholder="请选择活动商品状态"
          class="w-100"
        >
          <el-option
            v-for="v in Dict.ACT_STATUS"
            :key="v.key"
            :label="v.value"
            :value="v.key"
          >
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="3" class="d-flex-algin-center">
        <el-input
          v-model="queryParams.goodsName"
          placeholder="请输入商品名称"
          clearable
          size="small"
          class="mr5"
          @keyup.enter.native="handleQuery"
        />
      </el-col>
      <el-col :span="5" class="d-flex-algin-center">
        <el-input
          v-model="queryParams.storeName"
          placeholder="请输入店铺名称"
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
      :height="tableHeight + 10"
    >
      <el-table-column
        type="selection"
        width="50"
        align="center"
        fixed="left"
      />
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
        width="120"
        fixed="right"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-setting"
            @click="handleGoodsWeight(scope.row)"
            >商品权重设置</el-button
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
import {
  getActCommonAllList,
  getActGoodsPageList,
  addActGoods,
  updateGoodsWeight,
  delActGoods,
  updateActGoodsStatus,
} from "@/api/goods";

// 默认表格展示列
const defaultColumns = [
  {
    label: "店铺名称",
    show: true,
    prop: "storeName",
    align: "center",
  },
  {
    label: "商品分类",
    show: true,
    prop: "primaryCategoryName",
    align: "center",
  },
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
    label: "礼券类型",
    show: true,
    prop: "integralType",
    align: "center",
    width: 100,
  },
  {
    label: "礼券数量",
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
  },
  {
    label: "活动商品状态",
    show: true,
    prop: "status",
    align: "center",
    width: 100,
  },

  // {
  //   label: "商品状态",
  //   show: true,
  //   prop: "status",
  //   align: "center",
  // },
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
      // 活动code
      routeQuery: {},
      // 活动模块列表
      actOptions: [],
      // 待审核
      toAuditMultiple: true,
      // 待上架
      upMultiple: true,
      // 待下架
      downMultiple: true,
    };
  },
  mounted() {
    // 获取活动列表
    this.queryParams.actived = 1;
    getActCommonAllList(this.queryParams).then((res) => {
      this.actOptions = res.data;
      if (_.size(res.data) > 0) {
        this.queryParams = _.assign(this.queryParams, {
          actCode: res.data[0].code,
        });
        this.getList();
      }
    });
  },
  methods: {
    /** 查询商品列表 */
    getList() {
      this.loading = true;
      getActGoodsPageList(this.queryParams)
        .then((response) => {
          this.list = response.data.list;
          this.total = Number.parseInt(response.data.total);
          this.loading = false;
        })
        .catch((err) => {
          this.list = [];
          this.total = 0;
          this.loading = false;
        });
    },
    /** 商品权重设置 */
    handleGoodsWeight(row) {
      this.$prompt("请输入权重,数字越大越靠前!", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputValue: row.weight || 1,
      })
        .then(({ value }) => {
          updateGoodsWeight({
            actCode: this.queryParams.actCode,
            weight: value,
            goodsId: row.id,
          }).then((res) => {
            this.msgSuccess(res.success);
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 多选框选中数据 */
    handleSelectionChange(selection) {
      console.log(456, selection);
      this.ids = selection;
      this.single = selection.length != 1;
      this.toAuditMultiple = true;
      this.upMultiple = true;
      this.downMultiple = true;
      // this.multiple = !selection.length;
      const toAuditList = selection.filter((v) => v.status == 0);
      console.log(555, toAuditList);
      if (_.size(toAuditList) > 0) this.toAuditMultiple = false;
      const upList = selection.filter((v) => v.status == 2 || v.status == 4);
      if (_.size(upList) > 0) this.upMultiple = false;
      const downList = selection.filter((v) => v.status == 3);
      if (_.size(downList) > 0) this.downMultiple = false;
    },
    /** 商品审核通过操作 */
    handleGoodsPass() {
      let actGoodList = [];
      this.ids
        .filter((v) => v.status == 0)
        .map((v) => {
          actGoodList.push(
            _.assign(
              {},
              {
                id: v.id,
                status: 2,
                actCode: this.queryParams.actCode,
                goodsId: v.id,
              }
            )
          );
        });
      console.log(actGoodList);
      updateActGoodsStatus(actGoodList).then((res) => {
        this.toAuditMultiple = true;
        this.getList();
        this.msgSuccess("批量审核成功");
      });
    },
    /** 商品审核不通过操作 */
    handleGoodsReject() {
      let actGoodList = [];
      this.ids
        .filter((v) => v.status == 0)
        .map((v) => {
          actGoodList.push(
            _.assign(
              {},
              {
                id: v.id,
                status: 5,
                actCode: this.queryParams.actCode,
                goodsId: v.id,
              }
            )
          );
        });
      updateActGoodsStatus(actGoodList).then((res) => {
        this.toAuditMultiple = true;
        this.getList();
        this.msgSuccess("批量审核不通过成功");
      });
    },
    /** 商品上架 */
    handleGoodsUp() {
      let actGoodList = [];
      this.ids
        .filter((v) => v.status == 2 || v.status == 4)
        .map((v) => {
          actGoodList.push(
            _.assign(
              {},
              {
                id: v.id,
                status: 3,
                actCode: this.queryParams.actCode,
                goodsId: v.id,
              }
            )
          );
        });
      updateActGoodsStatus(actGoodList).then((res) => {
        this.upMultiple = true;
        this.getList();
        this.msgSuccess("批量上架成功");
      });
    },
    /** 商品下架 */
    handleGoodsDown() {
      let actGoodList = [];
      this.ids
        .filter((v) => v.status == 3)
        .map((v) => {
          actGoodList.push(
            _.assign(
              {},
              {
                id: v.id,
                status: 4,
                actCode: this.queryParams.actCode,
                goodsId: v.id,
              }
            )
          );
        });
      updateActGoodsStatus(actGoodList).then((res) => {
        this.downMultiple = true;
        this.getList();
        this.msgSuccess("批量下架成功");
      });
    },
    /** 选择不同活动 */
    handleActCodeChange(value) {
      console.log(value);
      // this.queryParams = _.assign({}, this.Dict.QUERY_PARAMS, {
      //   actCode: value,
      // });
      this.getList();
    },
    /** 选择不同状态 */
    handleStatusChange(value) {
      // this.queryParams.status = value
      this.getList();
    },
  },
};
</script>