<!--
 * @Author       : Lance Yi <latticeyi@gmail.com>
 * @Date         : 2020-11-03 14:03:38
 * @Description  : 分润管理 - 分润日志
-->
<template>
  <div class="app-container">
    <el-row :gutter="10" :span="24" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-view"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          >新增</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          >删除</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-sell"
          size="mini"
          :disabled="multiple"
          @click="handleGoodsUp"
          >批量修改</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="info"
          icon="el-icon-sold-out"
          size="mini"
          :disabled="multiple"
          @click="handleGoodsDown"
          >批量删除</el-button
        >
      </el-col>
      <right-toolbar
        :showSearch.sync="showSearch"
        :cols="columns"
        :grid="$route.name"
        :page="queryParams"
        @queryTable="getIncomeTask"
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
              :type="Dict.GOODS_STATUS[scope.row[v.prop]].type"
              size="small"
              v-if="v.prop === 'status'"
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
        width="180"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="handleUpdate(scope.row)"
            >查看</el-button
          >
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
      @pagination="getIncomeTask"
    />
  </div>
</template>

<script>
// import {
//   getGoodsPageList,
//   updateGoodsStatus,
//   deleteStoreInfo,
// } from "@/api/goods";
import { incomeTask } from "@/api/money";
// 默认表格展示列
const defaultColumns = [
  {
    label: "执行时间",
    show: true,
    prop: "execTime",
    align: "center",
    width: 150,
  },
  {
    label: "备注",
    show: true,
    prop: "remark",
    align: "left",
    width: 150,
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
  name: "ProfitsLog",
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
    this.getIncomeTask();
  },
  methods: {
    /** 查询商品列表 */
    getIncomeTask() {
      this.loading = true;
      incomeTask(this.queryParams).then((response) => {
        this.list = response.data.list;
        this.total = Number.parseInt(response.data.total);
        this.loading = false;
      });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getIncomeTask();
    },
    /** 多选框选中数据 */
    handleSelectionChange(selection) {
      this.ids = selection;
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      const goodsId = row.id || this.ids.map((item) => item.id).toString();
      this.$router.push({ name: "GoodsDetail", query: { goodsId: goodsId } });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      console.log(777, row);
      let ids;
      if (row.id) {
        ids = [row.id];
      } else {
        ids = this.ids.filter((v) => v.status != 3).map((item) => item.id);
      }
      if (ids.length <= 0) {
        return this.msgError("选择商品没有可删除商品");
      }
      this.$confirm("是否确认删除该商品?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return deleteStoreInfo({ ids: ids });
        })
        .then(() => {
          this.getIncomeTask();
          this.msgSuccess("删除成功");
        })
        .catch(function () {});
    },
    /** 商品审核通过 */
    handleGoodsPass(row) {
      let ids;
      if (row.id) {
        ids = [row.id];
      } else {
        ids = this.ids.filter((v) => v.status == 0).map((item) => item.id);
      }
      if (ids.length <= 0) {
        return this.msgError("选择商品没有可审核商品");
      }
      this.$confirm("是否确认审核该商品?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return updateGoodsStatus({ ids: ids, status: 2 });
        })
        .then(() => {
          this.getIncomeTask();
          this.msgSuccess("审核成功");
        })
        .catch(function () {});
    },
    /** 商品审核驳回 */
    handleGoodsReject(row) {
      let ids;
      if (row.id) {
        ids = [row.id];
      } else {
        ids = this.ids.filter((v) => v.status == 0).map((item) => item.id);
      }
      if (ids.length <= 0) {
        return this.msgError("选择商品没有可审核商品");
      }
      this.$confirm("是否确认驳回该商品?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return updateGoodsStatus({ ids: ids, status: 5 });
        })
        .then(() => {
          this.getIncomeTask();
          this.msgSuccess("审核成功");
        })
        .catch(function () {});
    },
    /** 商品上架 */
    handleGoodsUp(row) {
      let ids;
      if (row.id) {
        ids = [row.id];
      } else {
        ids = this.ids
          .filter((v) => v.status == 2 || v.status == 4)
          .map((item) => item.id);
      }
      if (ids.length <= 0) {
        return this.msgError("选择商品没有可上架商品");
      }
      this.$confirm("是否确认上架该商品?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return updateGoodsStatus({ ids: ids, status: 3 });
        })
        .then(() => {
          this.getIncomeTask();
          this.msgSuccess("上架成功");
        })
        .catch(function () {});
    },
    /** 商品下架 */
    handleGoodsDown(row) {
      let ids;
      if (row.id) {
        ids = [row.id];
      } else {
        ids = this.ids.filter((v) => v.status == 3).map((item) => item.id);
      }
      if (ids.length <= 0) {
        return this.msgError("选择商品没有可下架商品");
      }
      this.$confirm("是否确认下架该商品?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return updateGoodsStatus({ ids: ids, status: 4 });
        })
        .then(() => {
          this.getIncomeTask();
          this.msgSuccess("下架成功");
        })
        .catch(function () {});
    },
  },
};
</script>