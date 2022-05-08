<!--
 * @Author       : Lance Yi <latticeyi@gmail.com>
 * @Date         : 2020-11-27 14:23:35
 * @Description  : 营销管理 - 广告图管理
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
          type="success"
          icon="el-icon-sell"
          size="mini"
          :disabled="multiple"
          @click="handleGoodsUp"
          >批量启用</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="info"
          icon="el-icon-sold-out"
          size="mini"
          :disabled="multiple"
          @click="handleGoodsDown"
          >批量禁用</el-button
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
      :height="tableHeight + 10"
    >
      <el-table-column type="selection" width="50" align="center" fixed="left"/>
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
              style="height: 80px"
              v-if="v.prop === 'image'"
              :src="scope.row[v.prop]"
              fit="fill"
              
              :preview-src-list="[scope.row[v.prop]]"
            ></el-image>
            <el-tag
              v-else-if="v.prop === 'status'"
              :type="Dict.STATUS[scope.row[v.prop]].type"
              size="small"
              >{{ Dict.STATUS[scope.row[v.prop]].value }}</el-tag
            >
            <el-tag
              v-else-if="v.prop === 'urlType'"
              :type="Dict.URL_TYPE[scope.row[v.prop] - 1].type"
              size="small"
              >{{ Dict.URL_TYPE[scope.row[v.prop] - 1].value }}</el-tag
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
        width="150"
        fixed="right"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            >修改</el-button
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

    <!-- 添加广告图弹窗 -->
    <ActBannerDialog
      v-if="open"
      :open="open"
      :isEdit="isEdit"
      :form="form"
      @cancel="open = false"
      @submit="handleSubmitBanner"
    />
  </div>
</template>

<script>
import { getActAdvertisePageList, updateActAdvertiseStatus, delActAdvertise } from "@/api/goods";
import ActBannerDialog from "../components/ActBannerDialog";
// 默认表格展示列
const defaultColumns = [
  {
    label: "活动栏目",
    show: true,
    prop: "actName",
    align: "center",
  },
  {
    label: "图片",
    show: true,
    prop: "image",
    align: "center",
    width: 220,
  },
  {
    label: "导航栏颜色值",
    show: true,
    prop: "topBarColor",
    align: "center",
  },
  {
    label: "链接类型",
    show: true,
    prop: "urlType",
    align: "center",
    width: 180,
  },
  {
    label: "商品|店铺|链接|活动板块",
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
];

export default {
  name: "MarketBanner",
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
    };
  },
  components: {
    ActBannerDialog,
  },
  mounted() {
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
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.open = true;
      this.isEdit = false
      this.form = {
        image: null,
        actCode: null,
        actName: null,
        type: null,
        url: null,
        urlType: 1,
        topBarColor: null,
      };
    },
    /** 广告图启用 */
    handleGoodsUp() {
      console.log(this.ids);
      let ids = this.ids.filter((v) => v.status == 1).map((v) => v.id);
      if (ids.length <= 0) {
        return this.msgError("选择暂无可启用广告图");
      }
      updateActAdvertiseStatus({
        ids: ids,
        status: 0,
      }).then((res) => {
        this.getList();
        this.msgSuccess("批量启用成功");
      });
    },
    /** 广告图禁用 */
    handleGoodsDown() {
      let ids = this.ids.filter((v) => v.status == 0).map((v) => v.id);
      if (ids.length <= 0) {
        return this.msgError("选择暂无可禁用广告图");
      }
      updateActAdvertiseStatus({
        ids: ids,
        status: 1,
      }).then((res) => {
        this.getList();
        this.msgSuccess("批量禁用成功");
      });
    },
    /** 添加广告图 */
    handleSubmitBanner() {
      this.open = false;
      this.handleQuery();
    },
    // 修改广告图
    handleUpdate(row) {
      console.log(row);
      this.open = true
      this.isEdit = true
      this.form = _.assign({},row)
    },
    //删除广告图
    handleDelete(row) {
        this.$confirm('是否删除改banner图?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let arr = []
          arr.push(row.id)
          delActAdvertise({ids: arr}).then(res =>{
            if(res.code == 200) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.getList()
            }
          })
          
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    }
  },
};
</script>