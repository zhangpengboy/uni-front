<!--
 * @Author       : Lance Yi <latticeyi@gmail.com>
 * @Date         : 2020-10-30 15:09:54
 * @Description  : 商户入驻列表
-->
<template>
  <div class="app-container">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-s-claim"
          size="mini"
          :disabled="single"
          @click="handleCheckStore"
          >审核店铺</el-button
        >
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-close"
          size="mini"
          :disabled="multiple"
          @click="handleCheckError"
          >审核拒绝</el-button
        >
      </el-col> -->
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-close"
          size="mini"
          :disabled="storesDisabled"
          @click="handleCheckStop"
          >禁用</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-check"
          size="mini"
          :disabled="storesDisabledUp"
          @click="handleCheckUp"
          >启用</el-button
        >
      </el-col>
      <el-col :span="18" class="d-flex-algin-center">
        <el-select
          v-model="queryParams.status"
          clearable
          placeholder="请选择店铺状态"
          class="w-100 mr5"
          @change="handleQuery"
        >
          <el-option
            v-for="item in Dict.STORE_STATUS"
            :key="item.key"
            :label="item.value"
            :value="item.key"
          >
          </el-option>
        </el-select>
        <el-input
          v-model="queryParams.storeName"
          placeholder="请输入店铺名称"
          clearable
          size="small"
          class="mr5"
          @keyup.enter.native="handleQuery"
        />
        <el-input
          v-model="queryParams.phone"
          placeholder="请输入手机号"
          clearable
          size="small"
          class="mr5"
          @keyup.enter.native="handleQuery"
        />
        <el-select
          v-model="queryParams.storeRoleCode"
          clearable
          placeholder="请选择店铺类型"
          class="w-100 mr5"
          @focus="getStoreRoleList"
          @change="handleQuery"
        >
          <el-option
            v-for="(v, i) in storeRoleList"
            :key="i"
            :label="v.name"
            :value="v.code"
          ></el-option>
        </el-select>
        <el-select
          v-model="queryParams.isCloudStore"
          clearable
          placeholder="数字货架开通状态"
          class="w-100 mr5"
          @change="handleQuery"
        >
          <el-option
            v-for="item in Dict.YES_NO"
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
            <span v-if="v.prop === 'createTime'">{{
              parseTime(scope.row[v.prop])
            }}</span>
            <el-tag
              :type="Dict.STORE_STATUS[scope.row[v.prop]].type"
              size="mini"
              v-else-if="v.prop === 'status'"
              >{{ Dict.STORE_STATUS[scope.row[v.prop]].value }}</el-tag
            >
            <el-tag
              :type="Dict.YES_NO[scope.row[v.prop] ? 1 : 0].type"
              size="mini"
              v-else-if="v.prop === 'isBuyCoupons'"
              >{{ Dict.YES_NO[scope.row[v.prop] ? 1 : 0].value }}</el-tag
            >
            <el-tag
              :type="Dict.YES_NO[scope.row[v.prop]].type"
              size="mini"
              v-else-if="v.prop === 'isCloudStore'"
              >{{ Dict.YES_NO[scope.row[v.prop]].value }}</el-tag
            >
            <el-switch
              v-else-if="v.prop === 'enabledThirdPay'"
              v-model="scope.row[v.prop]"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :active-value="1"
              :inactive-value="0"
              @change="handleSetPay(scope.row, scope.row.enabledThirdPay)"
            >
            </el-switch>
            <el-switch
              v-else-if="v.prop === 'enableRealTimePay'"
              v-model="scope.row[v.prop]"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :active-value="1"
              :inactive-value="0"
              @change="
                handleSetRealTimePay(scope.row, scope.row.enableRealTimePay)
              "
            >
            </el-switch>
            <span v-else>{{ scope.row[v.prop] }}</span>
          </template>
        </el-table-column>
      </template>
      <el-table-column
        label="操作"
        align="center"
        width="330"
        fixed="right"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="handleUpdate(scope.row, 0)"
            >查看</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row, 1)"
            >修改</el-button
          >
          <el-button
            type="text"
            icon="el-icon-edit"
            @click="handleEditRole(scope.row)"
            >修改店铺角色</el-button
          >
          <el-button
            :disabled="scope.row.status == 1"
            type="text"
            icon="el-icon-edit"
            @click="handleEdit(scope.row)"
            >修改商品分类</el-button
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

    <!-- 审核弹出框 -->
    <el-dialog
      :title="audit ? '审核店铺商品分类' : '修改店铺商品分类'"
      :visible.sync="open"
      width="70%"
      append-to-body
      :before-close="openclose"
      v-el-dialog-drag
    >
      <el-form :model="form" label-width="100px">
        <el-row :gutter="20">
          <el-col :xs="12">
            <el-form-item label="审核商品分类">
              <!-- <el-select
                v-model="form.goodsCategoryId"
                placeholder="请选择关联的商品分类"
                class="w-100"
              >
                <el-option
                  :label="v.title"
                  :value="v.id"
                  v-for="(v, i) in goodsCateList"
                  :key="i"
                ></el-option>
              </el-select> -->
              <el-checkbox-group
                @change="classificationChange"
                v-model="classificationList"
              >
                <el-checkbox
                  v-for="(item, index) in goodsCateList"
                  :key="index"
                  :label="item.id"
                  >{{ item.title }}</el-checkbox
                >
              </el-checkbox-group>
            </el-form-item>
          </el-col>
          <!-- <el-form-item label="拒绝原因">
            <el-input
              type="textarea"
              v-model="form.remakes"
              autocomplete="off"
            ></el-input>
          </el-form-item> -->
        </el-row>
        <el-row :gutter="20">
          <el-col :xs="12" class="mb8">
            <el-input
              type="textarea"
              :rows="3"
              placeholder="请输入拒绝理由"
              v-model="mark"
            >
            </el-input>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" style="text-align: center" class="dialog-footer">
        <el-button @click="openclose">取 消</el-button>
        <el-button v-if="audit" type="danger" @click="handleCheckError"
          >拒绝</el-button
        >
        <el-button type="success" @click="handleCheckSuccess">{{
          audit ? '通过' : '修改'
        }}</el-button>
      </div>
    </el-dialog>
    <!-- 审核框 -->
    <StoreDialog
      :isEdit="isEdit"
      :storeOpen="storeOpen"
      :form="storeAuditForm"
      @submit="getList()"
      @cancel="cancels()"
      v-if="storeOpen"
    ></StoreDialog>
    <!-- 修改店铺角色弹出框 -->
    <el-dialog
      title="修改店铺角色"
      :visible.sync="storeRoleOpen"
      width="60%"
      append-to-body
      :before-close="openclose"
      v-el-dialog-drag
    >
      <el-form ref="storeForm" :model="storeRoleforms" label-width="100px">
        <el-form-item
          label="店铺角色"
          prop="roleName"
          :rules="[
            { required: true, message: '请选择店铺角色', trigger: 'blur' }
          ]"
        >
          <el-select
            v-model="storeRoleforms.roleName"
            placeholder="请选店铺角色"
            clearable
            class="w-100"
            @change="filterRoleName"
          >
            <el-option
              v-for="(o, i) in storeRoleList"
              :key="i"
              :label="o.name"
              :value="o.code"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="openclose">取 消</el-button>
        <el-button type="success" @click="handleCheckOK">修改</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getStoreInfoList,
  updateStoreInfoStatus,
  bindStoreGoodsCategory,
  getStoreDetailInfo,
  getStoreGoodsCate,
  updateGetcateGory,
  storeRoleList,
  updateStoreRole,
  storeAllRoleList,
  storeEnable,
  switchThirdPay,
  switchRealTimePay
} from '@/api/stores'
import { getGoodsCateList } from '@/api/goods'
import StoreDialog from '../components/StoreDialog'

const defaultColumns = [
  {
    label: '商户手机号',
    show: true,
    prop: 'phone',
    align: 'center',
    width: 120
  },
  {
    label: '商户名称',
    show: true,
    prop: 'storeName',
    align: 'left'
  },
  {
    label: '店东姓名',
    show: true,
    prop: 'storeOwnerName',
    align: 'left'
  },
  // {
  //   label: "商户类型",
  //   show: true,
  //   prop: "storeRoleName",
  //   align: "left",
  //   width: 150,
  // },
  {
    label: '店铺类型',
    show: true,
    prop: 'storeRoleName',
    align: 'left',
    width: 150
  },
  {
    label: '商户地址',
    show: true,
    prop: 'storeAddress',
    align: 'left'
  },
  {
    label: '是否开通礼券码',
    show: true,
    prop: 'isBuyCoupons',
    align: 'center',
    width: 120
  },
  {
    label: '是否启用第三方支付',
    show: true,
    prop: 'enabledThirdPay',
    align: 'center',
    width: 140
  },
  {
    label: '是否启用时扣',
    show: true,
    prop: 'enableRealTimePay',
    align: 'center',
    width: 140
  },
  {
    label: '是否开通数字货架',
    show: true,
    prop: 'isCloudStore',
    align: 'center',
    width: 130
  },
  { label: '状态', show: true, prop: 'status', align: 'center', width: 120 },
  {
    label: '创建时间',
    show: true,
    prop: 'createTime',
    align: 'center',
    width: 180
  }
]

export default {
  name: 'StoresInfo',
  components: {
    StoreDialog
  },
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
      storesDisabled: true, // 店铺禁用
      storesDisabledUp: true, // 店铺启用
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
      // 商品分类list
      goodsCateList: [],
      // 查看
      storeOpen: false,
      storeAuditForm: {},
      classificationList: [],
      goodsclassificationList: [],
      audit: false,
      storeRoleList: [],
      storeRoleOpen: false, // 是否显示修改店铺角色弹框
      storeRoleforms: {},
      rowData: {}, // 行数据
      // 拒绝备注
      mark: ''
    }
  },
  created () {
    this.getList()
  },
  activated () {
    this.getList()
  },
  methods: {
    // 筛选角色名称
    filterRoleName (code) {
      // console.log(code);
      this.storeRoleforms.roleCode = code
      this.storeRoleforms.roleName = this.storeRoleList
        .filter(v => v.code == code)
        .map(v => v.name)
        .toString()
    },
    // 修改店铺角色
    handleCheckOK () {
      this.$refs['storeForm'].validate(valid => {
        if (valid) {
          if (this.storeRoleforms.roleCode != undefined) {
            updateStoreRole(this.storeRoleforms).then(response => {
              if (response.code == 200) {
                this.getList()
                this.storeRoleOpen = false
                this.msgSuccess('修改成功')
              }
            })
          }
        }
      })
    },
    // 点击修改店铺角色按钮
    handleEditRole (row) {
      this.getStoreRoleList()
      this.storeRoleOpen = true
      // console.log(row);
      // this.storeRoleforms.roleCode = row.storeRoleCode
      // this.storeRoleforms.roleName = row.storeRoleName
      this.$set(this.storeRoleforms, 'roleName', row.storeRoleName)
      this.$set(this.storeRoleforms, 'roleCode', row.storeRoleCode)
      this.storeRoleforms.storeId = row.id
      this.storeRoleforms.storeName = row.storeName
    },
    /** 查询商品单位列表 */
    getList () {
      this.loading = true
      getStoreInfoList(this.queryParams).then(response => {
        this.list = response.data.list
        this.total = Number.parseInt(response.data.total)
        this.loading = false
      })
    },
    // 获取店铺角色列表
    getStoreRoleList () {
      storeAllRoleList().then(response => {
        this.storeRoleList = response.data
      })
    },
    /** 搜索按钮操作 */
    handleQuery () {
      this.queryParams.pageNum = 1
      this.getList()
    },
    // 多选框选中数据
    handleSelectionChange (selection) {
      this.ids = selection
      const ids = this.ids.filter(v => v.status == 1).map(item => item.id)
      if (ids.length > 0) {
        this.single = selection.length != 1
      } else {
        this.single = true
      }
      this.multiple = !selection.length
      const stop = this.ids.filter(v => v.status == 0).map(item => item.id)
      if (stop.length > 0) {
        this.storesDisabled = selection.length != 1
      } else {
        this.storesDisabled = true
      }
      const up = this.ids.filter(v => v.status == 3).map(item => item.id)
      if (up.length > 0) {
        this.storesDisabledUp = selection.length != 1
      } else {
        this.storesDisabledUp = true
      }
    },
    // 店铺分类选择
    classificationChange (e) {
      console.log(987, e)
      console.log(987, this.classificationList)
      let arr = []
      e.map(item => {
        let obj = {}
        this.goodsCateList.map(v => {
          if (item == v.id) {
            obj.goodsCategoryId = v.id
            obj.goodsCategoryName = v.title
            arr.push(obj)
          }
        })
      })
      console.log(789, arr)
      this.goodsclassificationList = _.cloneDeep(arr)
    },
    /** 审核按钮操作 */
    handleCheckStore () {
      this.audit = true
      this.form = _.assign(
        {},
        {
          storeCategoryId: this.ids[0].storeCategoryId,
          storeCategoryName: this.ids[0].storeCategoryName,
          storeName: this.ids[0].storeName,
          storeId: this.ids[0].id
        }
      )
      this.getGoodsCateList()
    },
    // 关闭审核弹框
    openclose () {
      this.open = false
      this.storeRoleOpen = false
      this.mark = ''
      this.rowData = {}
      this.goodsclassificationList = []
      this.classificationList = []
    },
    /** 审核通过按钮操作 */
    handleCheckSuccess () {
      // if (!this.form.goodsCategoryId) {
      //   return this.msgError("请选择店铺经营的商品分类");
      // }
      // const goodsCategoryName = this.goodsCateList
      //   .filter((v) => v.id == this.form.goodsCategoryId)
      //   .map((v) => v.title);

      // const _params = _.assign(this.form, {
      //   goodsCategoryName: goodsCategoryName.toString(),
      // });
      if (this.goodsclassificationList.length == 0) {
        return this.msgError('请选择店铺经营的商品分类')
      }
      this.form.goodsCateList = this.goodsclassificationList
      if (this.audit) {
        bindStoreGoodsCategory(this.form).then(res => {
          const storeId = this.ids.map(v => v.id).toString()
          this.updateStoreInfoStatus(storeId, 0)
        })
      } else {
        updateGetcateGory(this.form).then(res => {
          this.open = false
          this.mark = ''
          this.getList()
          this.msgSuccess('操作成功')
          this.goodsclassificationList = []
          this.classificationList = []
          // const storeId = this.ids.map((v) => v.id).toString();
          // this.updateStoreInfoStatus(storeId, 0);
        })
      }
    },
    /** 审核拒绝按钮操作 */
    handleCheckError () {
      if (this.mark == '') {
        this.msgError('请输入拒绝理由')
        return
      }
      const storeId = this.ids.map(item => item.id).toString()
      this.updateStoreInfoStatus(storeId, 2)
    },
    /** 修改状态 */
    updateStoreInfoStatus (storeId, status) {
      let obj = {
        storeId: storeId,
        status: status
      }
      if (status == 2) {
        obj.mark = this.mark
      }
      updateStoreInfoStatus(obj).then(res => {
        this.open = false
        this.mark = ''
        this.getList()
        this.msgSuccess('操作成功')
        this.goodsclassificationList = []
        this.classificationList = []
      })
    },
    // 取消按钮
    cancels () {
      this.storeOpen = false
    },
    // 查看详情
    handleUpdate (row, isEdit) {
      console.log(row)
      this.$router.push({ name: 'StoreDetail', query: { id: row.id, isEdit } })

      // if (row.status == 1) {
      //   this.isEdit = true;
      // } else {
      //   this.isEdit = false;
      // }
      // getStoreDetailInfo({ storeId: row.id }).then((res) => {
      //   if (res.code == 200) {
      //     this.storeOpen = true;
      //     this.storeAuditForm = _.assign({}, res.data);
      //     // this.isEdit = true;
      //   }
      // });
    },
    // 修改
    handleEdit (row) {
      this.audit = false
      console.log(777, row)
      this.form = _.assign(
        {},
        {
          storeCategoryId: row.storeCategoryId,
          storeCategoryName: row.storeCategoryName,
          storeName: row.storeName,
          storeId: row.id
        }
      )

      this.getGoodsCateList()
      getStoreGoodsCate({ storeId: this.form.storeId }).then(res => {
        console.log(res)
        if (res.code == 200) {
          let arr = []
          res.data.map(item => {
            arr.push(item.goodsCategoryId)
          })
          this.classificationList = arr
        }
      })
    },
    // 是否启用第三方支付
    handleSetPay (row, i) {
      let status = i
      switchThirdPay({ ids: [row.id], status: status }).then(res => {
        this.getList()
        this.msgSuccess('操作成功')
      })
    },
    // 是否启用第三方支付
    handleSetRealTimePay (row, i) {
      let status = i
      switchRealTimePay({ ids: [row.id], status: status }).then(res => {
        this.getList()
        this.msgSuccess('操作成功')
      })
    },
    // 获取商品分类
    getGoodsCateList () {
      getGoodsCateList({ workId: 0 }).then(res => {
        this.goodsCateList = res.data
        this.open = true
      })
    },
    // 禁用
    handleCheckStop () {
      const storeId = this.ids.map(item => item.id).toString()
      this.updateStoreInfoStatus(storeId, 3)
    },
    // 启用
    handleCheckUp () {
      const storeId = this.ids.map(item => item.id).toString()
      // this.updateStoreInfoStatus(storeId, 0);
      this.storeEnable(storeId, 0)
    },
    /** 启用店铺 */
    storeEnable (storeId, status) {
      let obj = {
        storeId: storeId,
        status: status
      }
      if (status == 2) {
        obj.mark = this.mark
      }
      storeEnable(obj).then(res => {
        this.open = false
        this.getList()
        this.msgSuccess('操作成功')
        this.goodsclassificationList = []
        this.classificationList = []
      })
    }
  }
}
</script>
