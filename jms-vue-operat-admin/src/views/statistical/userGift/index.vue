<!--
 * @Author      : Lance Yi<latticeyi@gmail.com>
 * @Date        : 2021-08-19 13:38:03
 * @Description : 用户礼券列表
-->
<!--
 * @Author       : Lance Yi <latticeyi@gmail.com>
 * @Date         : 2021-05-11 17:45:03
 * @Description  : 统计报表 - 礼券流水
-->
<template>
  <div class="app-container">
    <el-row :gutter="10" class="mb8">
      <el-col :span="4">
        <el-input
          v-model="queryParams.phone"
          placeholder="请输入手机号进行查询"
          clearable
          class="mr5"
          @keyup.enter.native="handleQuery"
        />
      </el-col>
      <el-button
        type="cyan"
        icon="el-icon-search"
        size="mini"
        @click="handleQuery"
        >查询</el-button
      >
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
      border
      :key="key"
      :height="tableHeight + 5"
    >
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
        </el-table-column>
      </template>
      <!-- <el-table-column
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
            icon="el-icon-view"
            @click="lookGiftList(scope.row)"
            >查看</el-button
          >
        </template>
      </el-table-column> -->
    </el-table>
    <pagination
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
    <el-dialog
      title="店铺礼券明细表"
      width="1200px"
      :visible.sync="dialogTableVisible"
    >
      <el-table
        v-loading="loading"
        :data="giftList"
        border
        :key="key"
        :height="500"
      >
        <el-table-column label="序号" type="index" width="60" align="center" />
        <template v-for="(v, index) in integraWater">
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
              <span v-if="v.prop === 'integralType'">{{
                scope.row.integralType == 0 ? '抵扣' : '赠送'
              }}</span>
              <el-tag
                :type="Dict.STORE_ORDER_STATUS[scope.row[v.prop]].type"
                size="small"
                v-else-if="v.prop === 'status'"
                >{{ Dict.STORE_ORDER_STATUS[scope.row[v.prop]].value }}</el-tag
              >
              <span v-else-if="v.prop === 'type'">{{
                scope.row.type == 1 ? '普通订单' : '代卖订单'
              }}</span>
              <span v-else-if="v.prop === 'createTime'">{{
                parseTime(scope.row[v.prop])
              }}</span>
              <span v-else>{{ scope.row[v.prop] }}</span>
            </template>
          </el-table-column>
        </template>
      </el-table>
      <pagination
        :total="integraltotal"
        :page.sync="integralParams.pageNum"
        :limit.sync="integralParams.pageSize"
        @pagination="getIntegralList"
      />
    </el-dialog>
  </div>
</template>

<script>
import { getUserIntegralList, storeOrderIntegralList } from '@/api/statistical'

// 默认表格展示列-礼券排名
const defaultColumns = [
  {
    label: '手机号',
    show: true,
    prop: 'phone',
    align: 'center'
  },
  {
    label: '微信名称',
    show: true,
    prop: 'nickName',
    align: 'center'
  },
  {
    label: '礼券总数',
    show: true,
    prop: 'allAmount',
    align: 'right'
  },
  {
    label: '可用礼券数',
    show: true,
    prop: 'freeAmount',
    align: 'right'
  },
  {
    label: '冻结总数',
    show: true,
    prop: 'frozenAmount',
    align: 'right'
  },
  {
    label: '待释放总数',
    show: true,
    prop: 'lockAmount',
    align: 'right'
  },
  {
    label: '注册时间',
    show: true,
    prop: 'registerTime',
    align: 'center'
  }
]
// 流水表
const integraColumns = [
  // {
  //   label: "订单编号",
  //   show: true,
  //   prop: "orderNo",
  //   align: "center",
  //   width: 190,
  // },
  {
    label: '订单备注',
    show: true,
    prop: 'note',
    align: 'center',
    width: 100
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
    align: 'center'
  },
  {
    label: '实付总金额',
    show: true,
    prop: 'payAmount',
    align: 'center'
  },
  {
    label: '订单总金额',
    show: true,
    prop: 'totalAmount',
    align: 'center'
  },
  {
    label: '订单类型',
    show: true,
    prop: 'type',
    align: 'center'
  },
  {
    label: '结算总金额',
    show: true,
    prop: 'settleAmount',
    align: 'center'
  },
  {
    label: '用户名称',
    show: true,
    prop: 'userName',
    align: 'center',
    width: 120
  },
  {
    label: '状态',
    show: true,
    prop: 'status',
    align: 'center'
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
  name: 'userGiftList',
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
      // 是否修改
      isEdit: false,
      // 日期范围
      dateRange: [],
      // 查询参数
      queryParams: _.cloneDeep(this.Dict.QUERY_PARAMS),
      // 表单参数
      form: {},
      // 表格key
      key: 1,
      // 默认表头
      columns: _.cloneDeep(defaultColumns),
      statsLoading: true,
      dialogTableVisible: false,
      giftList: [],
      integralParams: _.cloneDeep(this.Dict.QUERY_PARAMS),
      integraWater: _.cloneDeep(integraColumns),
      integraltotal: 0
    }
  },
  created () {
    this.getList()
  },
  methods: {
    /** 查询店铺分类列表 */
    getList () {
      this.loading = true
      this.statsLoading = true
      getUserIntegralList(this.queryParams).then(response => {
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
    // 查看流水
    lookGiftList (row) {
      console.log(row)
      this.loading = true
      this.integralParams.storeId = row.storeId
      this.getIntegralList()
    },
    // 获取流水数据
    getIntegralList () {
      this.giftList = []
      storeOrderIntegralList(this.integralParams).then(res => {
        if (res.code == 200) {
          this.loading = false
          this.dialogTableVisible = true
          this.giftList = res.data.list
          this.integraltotal = Number.parseInt(res.data.total)
          this.loading = false
        }
      })
    }
  }
}
</script>
