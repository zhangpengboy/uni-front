<!--
 * @Author       : Lance Yi <latticeyi@gmail.com>
 * @Date         : 2020-11-03 14:03:38
 * @Description  : 商户中心 - 店铺列表
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
          >{{
            switchValue == "1" ? "批量新增推荐商品" : "批量新增新品商品"
          }}</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          >{{
            switchValue == "1" ? "批量删除推荐商品" : "批量删除新品商品"
          }}</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-select v-model="switchValue" placeholder="请选择" @change="valueChange">
          <el-option label="推荐商品" value="1"> </el-option>
          <el-option label="新品商品" value="2"> </el-option>
        </el-select>
      </el-col>
      <!-- <right-toolbar
        :showSearch.sync="showSearch"
        :cols="columns"
        :grid="$route.name"
        :page="queryParams"
        @queryTable="getList"
        :showSearchBar="false"
        showRefreshBar
      ></right-toolbar> -->
    </el-row>

    <el-table
      v-loading="loading"
      :data="list"
      @selection-change="handleSelectionChange"
      border
      :key="key"
      :height="tableHeight"
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
            <!-- <span v-if="v.prop === 'status'">{{
              filterKeyToValue(scope.row[v.prop], "GOODS_STATUS")
            }}</span> -->
            <el-tag
              v-if="v.prop === 'status'"
              :type="Dict.GOODS_STATUS[scope.row[v.prop]].type"
              size="small"
              >{{ Dict.GOODS_STATUS[scope.row[v.prop]].value }}</el-tag
            >
            <el-tag
              v-else-if="v.prop === 'integralType'"
              :type="scope.row[v.prop] == null  ? '' : Dict.INTEGRAL_TYPE[scope.row[v.prop]].type"
              size="small"
              >{{ scope.row[v.prop] == null  ? '' : Dict.INTEGRAL_TYPE[scope.row[v.prop]].value }}</el-tag
            >
            <!-- <el-image
              v-else-if="v.prop === 'goodsIcon'"
              :src="scope.row[v.prop]"
              fit="fill"
              :lazy="true"
              :preview-src-list="[scope.row[v.prop]]"
            ></el-image> -->
            <!-- <span v-else-if="v.prop === 'createTime'">{{
              parseTime(scope.row[v.prop])
            }}</span> -->
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
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="60%"
      :before-close="handleClose"
    >
      <el-table
        v-loading="loading"
        :data="recommendGoodsPageList"
        @selection-change="recommendChange"
        border
        :key="key"
      >
        <el-table-column type="selection" width="50" align="center" fixed />
        <el-table-column label="序号" type="index" width="60" align="center" />
        <template v-for="(v, index) in optionalList">
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
                :type="scope.row[v.prop] == null  ? '' : Dict.INTEGRAL_TYPE[scope.row[v.prop]].type"
                size="small"
                >{{ scope.row[v.prop] == null  ? '' : Dict.INTEGRAL_TYPE[scope.row[v.prop]].value }}</el-tag
              >
              <span v-else>{{ scope.row[v.prop] }}</span>
            </template>
          </el-table-column>
        </template>
      </el-table>
      <pagination
        :total="recommendTotal"
        :page.sync="recommendForm.pageNum"
        :limit.sync="recommendForm.pageSize"
        layout="total, prev, pager, next, jumper"
        @pagination="getGoodsPageList"
      />
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addGoodsRecommend">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getGoodsByStore,
  getRecommendGoodsPageList,
  addGoodsRecommend,
  delGoodsRecommend,
  getGoodsNewsByStore,
  getGoodsNewsPageList,
  addGoodsNews,
  delGoodsNews
} from "@/api/goods";
// 默认表格展示列
const defaultColumns = [
  {
    label: "店铺名称",
    show: true,
    prop: "storeName",
    align: "left",
    width: 250,

  },
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
    label: "活动栏目",
    show: true,
    prop: "actName",
    align: "center",
    width: 120,
  },
  {
    label: "商品状态",
    show: true,
    prop: "status",
    align: "center",
    width: 100,
  },
];
const defaultOptionalList = [
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
    label: "活动栏目",
    show: true,
    prop: "actName",
    align: "center",
    width: 120,
  },
  {
    label: "商品状态",
    show: true,
    prop: "status",
    align: "center",
    width: 100,
  },
];

export default {
  name: "MarketRecommended",
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
      dialogVisible: false,
      recommendGoodsPageList: [],
      optionalList: _.cloneDeep(defaultOptionalList),
      recommendForm: {
        pageNum: 1,
        pageSize: 10,
        storeId: "",
      },
      recommendTotal: 0,
      addRecommend: [],
      switchValue: "1",
      title: '批量新增推荐商品'
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询商品列表 */
    getList() {
      this.loading = true;
      if (this.switchValue == "1") {
          // 推荐商品
        getGoodsByStore(this.queryParams).then((response) => {
          this.list = response.data.list;
          this.total = Number.parseInt(response.data.total);
          this.loading = false;
        });
      } else {
          // 新品商品
        getGoodsNewsByStore(this.queryParams).then((response) => {
          this.list = response.data.list;
          this.total = Number.parseInt(response.data.total);
          this.loading = false;
        });
      }
    },
    // 获取可批量添加的商品
    getGoodsPageList() {
      this.recommendForm.storeId = this.Dict.QUERY_PARAMS.storeId;
      if (this.switchValue == '1') {
          // 推荐商品
          getRecommendGoodsPageList(this.recommendForm).then((response) => {
            this.recommendGoodsPageList = response.data.list;
            this.recommendTotal = Number.parseInt(response.data.total);
            this.loading = false;
          });
      } else {
          // 新品商品
          getGoodsNewsPageList(this.recommendForm).then((response) => {
            this.recommendGoodsPageList = response.data.list;
            this.recommendTotal = Number.parseInt(response.data.total);
            this.loading = false;
          });
      }
    },
    /** 多选框选中数据 */
    handleSelectionChange(selection) {
      this.ids = selection;
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    // 批量新增选中数据
    recommendChange(val) {
      console.log(val);
      let arr = [];
      val.map((item) => {
        let obj = {
          goodsId: item.id,
          storeId: item.storeId,
          storeName: item.storeName,
        };
        arr.push(obj);
      });
      this.addRecommend = arr;
      console.log(this.addRecommend);
    },
    // 切换活动
    valueChange(e) {
        this.getList()
        if (e == '1') {
            this.title = '批量新增推荐商品'
        } else {
            this.title = '批量新增新品商品'
        }
    },
    // 确定新增
    addGoodsRecommend() {
      if (this.addRecommend.length == 0) return;
      if(this.switchValue == '1') {
          //推荐商品
        addGoodsRecommend(this.addRecommend).then((res) => {
            if (res.code == 200) {
            this.dialogVisible = false;
            this.getList();
            }
        });
      } else {
          // 新品商品
          addGoodsNews(this.addRecommend).then((res) => {
            if (res.code == 200) {
            this.dialogVisible = false;
            this.msgSuccess("新增成功");
            this.getList();
            }
        });
      }
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.dialogVisible = true;
      this.addRecommend = []
      this.recommendGoodsPageList = []
      this.getGoodsPageList();
    },
    // 关闭弹框
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          done();
        })
        .catch((_) => {});
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      let that = this
      let ids = []
      if (row.id) {
        ids = [row.id];
      } else {
        this.ids.map((v)=> {
            let obj = {
                goodsId: v.id,
                storeId: v.storeId
            }
            ids.push(obj)
        })
      }
    //   if (ids.length <= 0) {
    //     return this.msgError("选择商品无法删除");
    //   }
      this.$confirm('是否确认删除商品?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
            if (that.switchValue == '1') {
                // 推荐商品
                return delGoodsRecommend(ids);
            } else {
                // 新品商品
                return delGoodsNews(ids);
            }
        })
        .then(() => {
          this.getList();
          this.ids = []
          this.msgSuccess("删除成功");
        })
        .catch(function () {});
    },
  },
};
</script>