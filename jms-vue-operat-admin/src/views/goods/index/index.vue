<!--
 * @Author       : Lance Yi <latticeyi@gmail.com>
 * @Date         : 2020-11-03 14:03:38
 * @Description  : 商户中心 - 店铺列表
-->
<template>
  <div class="app-container">
    <el-row :gutter="10"
            :span="24"
            class="mb8">
      <el-col :span="1.5">
        <el-button type="primary"
                   icon="el-icon-view"
                   size="mini"
                   :disabled="single"
                   @click="handleVivew">商品查看</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger"
                   icon="el-icon-delete"
                   size="mini"
                   :disabled="multiple"
                   @click="handleDelete">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success"
                   icon="el-icon-sell"
                   size="mini"
                   :disabled="multiple"
                   @click="handleGoodsUp">批量上架</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="info"
                   icon="el-icon-sold-out"
                   size="mini"
                   :disabled="multiple"
                   @click="handleGoodsDown">批量下架</el-button>
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-copy-document"
          size="mini"
          :disabled="single"
          @click="copyGoods"
          >商品复制</el-button
        >
      </el-col> -->
    </el-row>
    <el-row>
      <el-col :span="22"
              class="d-flex-algin-center mb8">
        <el-input v-model="queryParams.storeName"
                  placeholder="请输入店铺名称进行查询"
                  clearable
                  size="small"
                  class="mr5"
                  @keyup.enter.native="handleQuery" />
        <el-input v-model="queryParams.goodsName"
                  placeholder="请输入商品名称进行查询"
                  clearable
                  size="small"
                  class="mr5"
                  @keyup.enter.native="handleQuery" />
        <el-input v-model="queryParams.brandName"
                  placeholder="请输入品牌名称进行查询"
                  clearable
                  size="small"
                  class="mr5"
                  @keyup.enter.native="handleQuery" />
        <el-input v-model="queryParams.goodsNo"
                  placeholder="请输入商品编号进行查询"
                  clearable
                  size="small"
                  class="mr5"
                  @keyup.enter.native="handleQuery" />
        <el-select class="w-100 mr5"
                   v-model="queryParams.status"
                   clearable
                   placeholder="请根据商品状态进行搜索"
                   @change="handleQuery">
          <el-option v-for="item in Dict.GOODS_STATUS"
                     :key="item.key"
                     :label="item.value"
                     :value="item.key">
          </el-option>
        </el-select>
        <el-button type="cyan"
                   icon="el-icon-search"
                   size="mini"
                   @click="handleQuery">搜索</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch"
                     :cols="columns"
                     :grid="$route.name"
                     :page="queryParams"
                     @queryTable="getList"
                     :showSearchBar="false"
                     showRefreshBar></right-toolbar>
    </el-row>

    <el-table v-loading="loading"
              :data="list"
              @selection-change="handleSelectionChange"
              border
              :key="key"
              :height="tableHeight - 35"
              @row-dblclick="handleVivew">
      <el-table-column type="selection"
                       width="50"
                       align="center"
                       fixed />
      <el-table-column label="序号"
                       type="index"
                       width="60"
                       align="center" />
      <template v-for="(v, index) in columns">
        <el-table-column :label="v.label"
                         :width="v.width"
                         :prop="v.prop"
                         :align="v.align"
                         :key="index"
                         v-if="v.show"
                         header-align="center"
                         show-overflow-tooltip>
          <template slot-scope="scope">
            <el-tag :type="Dict.GOODS_STATUS[scope.row[v.prop]].type"
                    size="small"
                    v-if="v.prop === 'status'">{{ Dict.GOODS_STATUS[scope.row[v.prop]].value }}</el-tag>
            <el-tag v-else-if="v.prop === 'integralType'"
                    :type="
                scope.row[v.prop] == null
                  ? ''
                  : Dict.INTEGRAL_TYPE[scope.row[v.prop]].type
              "
                    size="small">{{
                scope.row[v.prop] == null
                  ? ''
                  : Dict.INTEGRAL_TYPE[scope.row[v.prop]].value
              }}</el-tag>
            <span v-else-if="v.prop === 'createTime'">{{
              parseTime(scope.row[v.prop])
            }}</span>
            <span v-else>{{ scope.row[v.prop] }}</span>
          </template>
        </el-table-column>
      </template>
      <el-table-column label="操作"
                       align="center"
                       width="300"
                       fixed="right"
                       class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini"
                     type="text"
                     icon="el-icon-view"
                     @click="handleVivew(scope.row)">查看</el-button>
          <el-button size="mini"
                     type="text"
                     icon="el-icon-edit"
                     @click="handleUpdate(scope.row)">修改</el-button>
          <el-button size="mini"
                     type="text"
                     icon="el-icon-edit"
                     @click="handleUpdateWeight(scope.row)">修改权重</el-button>
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
          <el-button size="mini"
                     type="text"
                     icon="el-icon-sell"
                     @click="handleGoodsUp(scope.row)"
                     v-show="scope.row.status == 2 || scope.row.status == 4">上架</el-button>
          <el-button size="mini"
                     type="text"
                     icon="el-icon-sold-out"
                     @click="handleGoodsDown(scope.row)"
                     v-show="scope.row.status == 3">下架</el-button>
          <el-button type="text"
                     icon="el-icon-delete"
                     :disabled="scope.row.actived === 1"
                     @click="handleDelete(scope.row)">删除</el-button>
          <!-- <el-button
            size="mini"
            type="text"
            icon="el-icon-copy-document"
            @click="copyGoods(scope.row)"
            >复制</el-button
          > -->
        </template>
      </el-table-column>
    </el-table>

    <pagination :total="total"
                :page.sync="queryParams.pageNum"
                :limit.sync="queryParams.pageSize"
                @pagination="getList" />

    <!-- 修改商品权重弹框 -->
    <el-dialog title="修改商品权重"
               :visible.sync="dialogVisible"
               width="30%">
      <el-form label-width="100px"
               :model="form"
               class="demo-form-inline">
        <el-form-item label="商品权重">
          <el-input type="number"
                    v-model="form.weight"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="updateGoodsPageList">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getGoodsPageList,
  updateGoodsStatus,
  updateGoodsPageList,
  deleteStoreInfo,
  copyGoods
} from '@/api/goods'

// 默认表格展示列
const defaultColumns = [
  {
    label: '店铺名称',
    show: true,
    prop: 'storeName',
    align: 'left',
    width: 100
  },
  {
    label: '商品名称',
    show: true,
    prop: 'goodsName',
    align: 'left'
  },
  {
    label: '商品编号',
    show: true,
    prop: 'goodsNo',
    align: 'center',
    width: 100
  },
  {
    label: '品牌名称',
    show: true,
    prop: 'brandName',
    align: 'left'
  },
  {
    label: '市场价',
    show: true,
    prop: 'marketPrice',
    align: 'right',
    width: 100
  },
  {
    label: '销售价',
    show: true,
    prop: 'salePrice',
    align: 'right',
    width: 100
  },
  {
    label: 'vip价',
    show: true,
    prop: 'vipPrice',
    align: 'right',
    width: 100
  },
  {
    label: '积分类型',
    show: true,
    prop: 'integralType',
    align: 'center',
    width: 100
  },
  {
    label: '积分',
    show: true,
    prop: 'integral',
    align: 'right',
    width: 100
  },
  {
    label: '邮费',
    show: true,
    prop: 'postage',
    align: 'right'
  },
  {
    label: '商品状态',
    show: true,
    prop: 'status',
    align: 'center',
    width: 100
  },
  {
    label: '权重',
    show: true,
    prop: 'weight',
    align: 'right'
  },
  {
    label: '创建时间',
    show: true,
    prop: 'createTime',
    align: 'center',
    width: 180
  }
]

export default {
  name: 'GoodsIndex',
  data () {
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
      dialogVisible: false
    }
  },
  created () {
    this.getList()
  },
  activated () {
    this.getList()
  },
  methods: {
    /** 查询商品列表 */
    getList () {
      this.loading = true
      getGoodsPageList(this.queryParams).then(response => {
        this.list = response.data.list
        this.total = Number.parseInt(response.data.total)
        this.loading = false
      })
    },
    /** 搜索按钮操作 */
    handleQuery () {
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 多选框选中数据 */
    handleSelectionChange (selection) {
      this.ids = selection
      this.single = selection.length != 1
      this.multiple = !selection.length
    },
    /** 查看按钮操作 */
    handleVivew (row) {
      const goodsId = row.id || this.ids.map(item => item.id).toString()
      this.$router.push({ name: 'GoodsDetail', query: { goodsId: goodsId } })
    },
    /** 修改按钮操作 */
    handleUpdate (row) {
      const goodsId = row.id || this.ids.map(item => item.id).toString()
      this.$router.push({
        name: 'GoodsDetail',
        query: { goodsId: goodsId, isEdit: 'edit' }
      })
    },
    /** 修改权重按钮操作 */
    handleUpdateWeight (row) {
      this.dialogVisible = true;
      this.form = row;
    },
    // 确定设置商品权重
    updateGoodsPageList () {
      updateGoodsPageList({ goodsId: this.form.id, weight: this.form.weight }).then((res) => {
        if (res.code == 200) {
          this.dialogVisible = false;
          this.$message({
            message: "修改成功",
            type: "success",
          });
          this.getList();
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete (row) {
      console.log(777, row)
      if (row.actived === 1) {
        return this.msgError('该商品已参与活动，无法删除')
      }
      let ids
      if (row.id) {
        ids = [row.id]
      } else {
        ids = this.ids.filter(v => v.status != 3).map(item => item.id)
      }
      if (ids.length <= 0) {
        return this.msgError('选择商品没有可删除商品')
      }
      this.$confirm('是否确认删除该商品?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(function () {
          return deleteStoreInfo({ ids: ids })
        })
        .then(() => {
          this.getList()
          this.msgSuccess('删除成功')
        })
        .catch(function () { })
    },
    /** 商品审核通过 */
    handleGoodsPass (row) {
      let ids
      if (row.id) {
        ids = [row.id]
      } else {
        ids = this.ids.filter(v => v.status == 0).map(item => item.id)
      }
      if (ids.length <= 0) {
        return this.msgError('选择商品没有可审核商品')
      }
      this.$confirm('是否确认审核该商品?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(function () {
          return updateGoodsStatus({ ids: ids, status: 2 })
        })
        .then(() => {
          this.getList()
          this.msgSuccess('审核成功')
        })
        .catch(function () { })
    },
    /** 商品审核驳回 */
    handleGoodsReject (row) {
      let ids
      if (row.id) {
        ids = [row.id]
      } else {
        ids = this.ids.filter(v => v.status == 0).map(item => item.id)
      }
      if (ids.length <= 0) {
        return this.msgError('选择商品没有可审核商品')
      }
      this.$confirm('是否确认驳回该商品?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(function () {
          return updateGoodsStatus({ ids: ids, status: 5 })
        })
        .then(() => {
          this.getList()
          this.msgSuccess('审核成功')
        })
        .catch(function () { })
    },
    /** 商品上架 */
    handleGoodsUp (row) {
      let ids
      if (row.id) {
        ids = [row.id]
      } else {
        ids = this.ids
          .filter(v => v.status == 2 || v.status == 4)
          .map(item => item.id)
      }
      if (ids.length <= 0) {
        return this.msgError('选择商品没有可上架商品')
      }
      this.$confirm('是否确认上架该商品?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(function () {
          return updateGoodsStatus({ ids: ids, status: 3 })
        })
        .then(() => {
          this.getList()
          this.msgSuccess('上架成功')
        })
        .catch(function () { })
    },
    /** 商品下架 */
    handleGoodsDown (row) {
      let ids
      if (row.id) {
        ids = [row.id]
      } else {
        ids = this.ids.filter(v => v.status == 3).map(item => item.id)
      }
      if (ids.length <= 0) {
        return this.msgError('选择商品没有可下架商品')
      }
      this.$confirm('是否确认下架该商品?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(function () {
          return updateGoodsStatus({ ids: ids, status: 4 })
        })
        .then(() => {
          this.getList()
          this.msgSuccess('下架成功')
        })
        .catch(function () { })
    },
    // 商品复制
    copyGoods (row) {
      let ids
      if (row.id) {
        ids = [row.id]
      } else {
        ids = this.ids.map(v => v.id)
      }
      this.$confirm('是否确认复制改商品?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(function () {
          return copyGoods({ goodsId: ids[0] })
        })
        .then(() => {
          this.getList()
          this.msgSuccess('复制成功')
        })
        .catch(function () { })
    }
  }
}
</script>
