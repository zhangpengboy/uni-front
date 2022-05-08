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
          class="mb8"
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          >新增</el-button
        >
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          >修改</el-button
        >
      </el-col> -->
      <el-col :span="1.5">
        <el-button
          class="mb8"
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
          class="mb8"
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
          class="mb8"
          type="danger"
          icon="el-icon-sold-out"
          size="mini"
          :disabled="multiple"
          @click="handleGoodsDown"
          >批量下架</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          class="mb8"
          type="success"
          icon="el-icon-copy-document"
          size="mini"
          :disabled="single"
          @click="copyGoods"
          >商品复制</el-button
        >
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-download"
          size="mini"
          :loading="loadingExportExcel"
          @click="handledownloadExl"
          >导出excel</el-button
        >
      </el-col> -->
    </el-row>
    <el-row :gutter="10" class="mb8">
      <!-- <el-col :span="22" class="d-flex-algin-center">
        <el-form inline :model="queryParams" label-width="80px">
          <el-form-item label="商品名称:">
            <el-input
              v-model="queryParams.goodsName"
              placeholder="请输入商品名称进行查询"
              clearable
              class="mr5"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="商品编号:">
            <el-input
              v-model="queryParams.goodsNo"
              placeholder="请输入商品名称进行查询"
              clearable
              class="mr5"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="商品状态:">
            <el-select
              v-model="queryParams.status"
              placeholder="请根据商品状态进行搜索"
              clearable
            >
              <el-option
                v-for="item in Dict.GOODS_STATUS"
                :key="item.key"
                :label="item.value"
                :value="item.key"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="">
            <el-date-picker
              v-model="dateRange"
              size="small"
              style="width: 240px"
              class="mr5"
              value-format="yyyy-MM-dd"
              type="daterange"
              :picker-options="pickerOptions"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button
              type="cyan"
              icon="el-icon-search"
              size="mini"
              @click="handleQuery"
              >搜索</el-button
            >
          </el-form-item>
        </el-form>
      </el-col> -->
      <el-col :span="22" class="d-flex-algin-center">
        <el-col :span="4">
          <el-input
            v-model="queryParams.goodsName"
            placeholder="请输入商品名称"
            clearable
            size="small"
            class="mr5"
            @keyup.enter.native="handleQuery"
          />
        </el-col>
        <el-col :span="4">
          <el-input
            v-model="queryParams.goodsNo"
            placeholder="请输入商品编号"
            clearable
            size="small"
            class="mr5"
            @keyup.enter.native="handleQuery"
          />
        </el-col>
        <el-col :span="4">
          <el-select
            style="width: 100%"
            v-model="queryParams.status"
            placeholder="请选择商品状态"
            clearable
          >
            <el-option
              v-for="item in Dict.GOODS_STATUS"
              :key="item.key"
              :label="item.value"
              :value="item.key"
            >
            </el-option>
          </el-select>
        </el-col>
        <!-- <el-date-picker
          v-model="dateRange"
          size="small"
          style="width: 240px"
          class="mr5"
          value-format="yyyy-MM-dd"
          type="daterange"
          :picker-options="pickerOptions"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker> -->
        <el-button
          type="cyan"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          >搜索</el-button
        >
        <el-button
          type="success"
          icon="el-icon-download"
          size="mini"
          :loading="loadingExportExcel"
          @click="handledownloadExl"
          >导出excel</el-button
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
      :height="tableHeight - 60"
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
            <!-- <el-tag
              v-else-if="v.prop === 'actGoodsStatus'"
              :type="Dict.ACT_STATUS[scope.row[v.prop]].type"
              size="small"
              >{{ Dict.ACT_STATUS[scope.row[v.prop]].value }}</el-tag
            > -->
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
                  ? ''
                  : Dict.INTEGRAL_TYPE[scope.row[v.prop]].value
              }}</el-tag
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
      <el-table-column
        fixed="right"
        label="操作"
        align="center"
        width="250"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-show="
              scope.row.status == 0 ||
                scope.row.status == 2 ||
                scope.row.status == 4
            "
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="handleLook(scope.row)"
            v-show="scope.row.status == 3"
            >查看</el-button
          >
          <el-button
            type="text"
            icon="el-icon-delete"
            :disabled="scope.row.actived === 1"
            @click="handleDelete(scope.row)"
            >删除</el-button
          >
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
            icon="el-icon-copy-document"
            @click="copyGoods(scope.row)"
            >复制</el-button
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
  getGoodsPageList,
  deleteGoods,
  updateGoodsStatus,
  copyGoods
} from '@/api/goods'
import { downloadGoodsExl } from '@/api/upload'
// 默认表格展示列
const defaultColumns = [
  {
    label: '商品名称',
    show: true,
    prop: 'goodsName',
    align: 'left'
  },
  // {
  //   label: "商品分类",
  //   show: true,
  //   prop: "primaryCategoryName",
  //   align: "center",
  // },
  {
    label: '商品编号',
    show: true,
    prop: 'goodsNo',
    align: 'center'
  },
  {
    label: '市场价',
    show: true,
    prop: 'marketPrice',
    align: 'right'
  },
  {
    label: '销售价',
    show: true,
    prop: 'salePrice',
    align: 'right'
  },
  {
    label: 'vip价',
    show: true,
    prop: 'vipPrice',
    align: 'right'
  },
  {
    label: '积分类型',
    show: true,
    prop: 'integralType',
    align: 'center'
  },
  {
    label: '积分',
    show: true,
    prop: 'integral',
    align: 'right'
  },
  {
    label: '邮费',
    show: true,
    prop: 'postage',
    align: 'right'
  },
  // {
  //   label: '参与活动',
  //   show: true,
  //   prop: 'actName',
  //   align: 'center',
  //   width: 120
  // },
  // {
  //   label: '活动商品状态',
  //   show: true,
  //   prop: 'actGoodsStatus',
  //   align: 'center',
  //   width: 100
  // },
  {
    label: '商品状态',
    show: true,
    prop: 'status',
    align: 'center',
    width: 100
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
      loadingExportExcel: false,
      dateRange: [],
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近三个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      }
    }
  },
  created () {
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
    /** 新增按钮操作 */
    handleAdd () {
      this.$router.push({ name: 'GoodsDetail', query: { look: 'false' } })
    },
    /** 修改按钮操作 */
    handleUpdate (row) {
      const goodsId = row.id || this.ids.map(item => item.id).toString()
      this.$router.push({
        name: 'GoodsDetail',
        query: { goodsId: goodsId, look: 'false' }
      })
    },
    /** 查看按钮操作 */
    handleLook (row) {
      const goodsId = row.id || this.ids.map(item => item.id).toString()
      this.$router.push({
        name: 'GoodsDetail',
        query: { goodsId: goodsId, look: 'true' }
      })
    },
    /** 删除按钮操作 */
    handleDelete (row) {
      let ids
      if (row.id) {
        ids = [row.id]
        if (row.status == 3) return this.msgError('商品上架中,无法删除')
      } else {
        ids = this.ids
          .filter(v => v.status != 3 && v.actived != 1)
          .map(v => v.id)
      }
      if (ids.length <= 0) {
        return this.msgError('选择商品无法删除')
      }
      this.$confirm('是否确认删除商品?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(function () {
          return deleteGoods({ ids: ids })
        })
        .then(() => {
          this.getList()
          this.msgSuccess('删除成功')
        })
        .catch(function () {})
    },
    /** 商品上架 */
    handleGoodsUp (row) {
      let ids
      if (row.id) {
        ids = [row.id]
      } else {
        ids = this.ids
          .filter(v => v.status == 2 || v.status == 4)
          .map(v => v.id)
      }
      if (ids.length <= 0) {
        return this.msgError('选择商品无法上架')
      }
      this.$confirm('是否确认上架商品?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(function () {
          console.log(ids)
          return updateGoodsStatus({ ids: ids, status: 3 })
        })
        .then(() => {
          this.getList()
          this.msgSuccess('上架成功')
        })
        .catch(function () {})
    },
    /** 商品下架 */
    handleGoodsDown (row) {
      let ids
      if (row.id) {
        ids = [row.id]
      } else {
        ids = this.ids.filter(v => v.status == 3).map(v => v.id)
      }
      if (ids.length <= 0) {
        return this.msgError('选择商品无法下架')
      }
      this.$confirm('是否确认下架商品?', '警告', {
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
        .catch(function () {})
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
        .catch(function () {})
    },
    // 导出exl表
    handledownloadExl () {
      this.loadingExportExcel = true
      this.msg = this.$message({
        message: '正在下载,请稍等',
        type: 'warning',
        duration: 0
      })
      downloadGoodsExl(this.addDateRange(this.queryParams, this.dateRange))
        .then(res => {
          this.download('商品列表Excel', res)
          this.msg.close()
          this.loadingExportExcel = false
        })
        .catch(err => {
          this.msg.close()
          this.loadingExportExcel = false
        })
    }
  },
  activated () {
    this.getList()
  }
}
</script>
