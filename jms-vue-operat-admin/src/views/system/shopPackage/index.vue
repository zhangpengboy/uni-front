<!--
 * @Author      : Lance Yi [QQ：342003386]
 * @Date        : 2020-08-27 14:43:47
 * @Description : 系统配置 - 收款码套餐
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
          v-hasPermi="['system:role:add']"
          >新增</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:role:edit']"
          >修改</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:role:remove']"
          >删除</el-button
        >
      </el-col>
      <el-col :span="7" class="d-flex-algin-center">
        <el-input
          v-model="queryParams.keyword"
          placeholder="请输入名称/Key进行查询"
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
      :height="tableHeight + 10"
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
            <span v-if="v.prop === 'createTime'">
              {{ parseTime(scope.row.createTime) }}
            </span>
            <span v-else-if="v.prop === 'firstRechargeSwitch'">
              <el-tag v-if="scope.row.firstRechargeSwitch === 1">开启</el-tag>
              <el-tag type="danger" v-if="scope.row.firstRechargeSwitch === 0"
                >关闭</el-tag
              >
            </span>
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

    <!-- 添加或修改配置对话框 -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="550px"
      append-to-body
      v-el-dialog-drag
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @close="cancel"
    >
      <el-form
        ref="storePackForm"
        :model="form"
        label-width="90px"
        label-suffix=":"
      >
        <el-form-item
          label="名称"
          prop="name"
          :rules="[{ required: true, message: '请输入名称', trigger: 'blur' }]"
        >
          <el-input v-model="form.name" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item
          label="编号"
          prop="code"
          :rules="[{ required: true, message: '请输入编号', trigger: 'blur' }]"
          v-if="isEdit"
        >
          <el-input v-model="form.code" readonly placeholder="请输入编号" />
        </el-form-item>
        <el-form-item
          label="价格"
          prop="price"
          :rules="[{ required: true, message: '请输入价格', trigger: 'blur' }]"
        >
          <el-input
            v-model="form.price"
            placeholder="请输入价格"
            type="number"
          />
        </el-form-item>
        <el-form-item
          label="有效天数"
          prop="validityTime"
          :rules="[
            { required: true, message: '请输入有效天数', trigger: 'blur' }
          ]"
        >
          <el-input
            v-model="form.validityTime"
            placeholder="请输入有效天数"
            onkeyup="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"
            clearable
            maxlength="4"
          />
        </el-form-item>
        <el-form-item label="首充金额" v-if="form.firstRechargeSwitch == 1">
          <el-input
            v-model="form.firstRechargeAmount"
            placeholder="请输入首充金额"
            type="number"
          />
        </el-form-item>
        <el-form-item label="折扣">
          <el-input v-model="form.rate" placeholder="请输入折扣" />
        </el-form-item>
        <el-form-item label="首充开关">
          <el-radio-group v-model="form.firstRechargeSwitch">
            <el-radio :label="0">关闭</el-radio>
            <el-radio :label="1">开启</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm" size="mini"
          >确 定</el-button
        >
        <el-button @click="cancel" size="mini">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  integralsListPack,
  storeRoleList,
  integralsAddPack,
  integralsDelPack,
  integralsEditPack
} from '@/api/stores'

import { mapGetters } from 'vuex'

const defaultFrom = {
  id: undefined,
  code: undefined,
  name: undefined,
  price: undefined,
  storeRole: undefined,
  validityTime: undefined
}

const defaultColumns = [
  // {
  //   label: "编号",
  //   show: true,
  //   prop: "code",
  //   align: "left",
  //   width: 280,
  // },
  {
    label: '名称',
    show: true,
    prop: 'name',
    align: 'left'
  },
  {
    label: '价格(元)',
    show: true,
    prop: 'price',
    align: 'center'
  },
  {
    label: '折扣',
    show: true,
    prop: 'rate',
    align: 'center'
  },
  {
    label: '有效天数',
    show: true,
    prop: 'validityTime',
    align: 'center'
  },
  {
    label: '首充开关',
    show: true,
    prop: 'firstRechargeSwitch',
    align: 'center'
  },
  {
    label: '首充金额',
    show: true,
    prop: 'firstRechargeAmount',
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
  name: 'SystemShopPackage',
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
      // 弹窗标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 是否是修改弹出层
      isEdit: false,
      // 日期范围
      dateRange: [],
      // 查询参数
      queryParams: _.cloneDeep(this.Dict.QUERY_PARAMS),
      // 表单参数
      form: _.assign({}, defaultFrom),
      // 自定义表单列表
      columns: _.cloneDeep(defaultColumns),
      // 活动列表
      actList: []
    }
  },
  created () {
    // 获取活动列表
    storeRoleList().then(res => {
      this.actList = res.data
      this.getList()
    })
  },
  methods: {
    /** 查询列表 */
    getList () {
      this.loading = true
      integralsListPack(this.queryParams).then(response => {
        this.list = response.data.list
        this.total = Number.parseInt(response.data.total)
        this.loading = false
      })
    },
    // 取消按钮
    cancel () {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset () {
      this.form = _.assign({}, defaultFrom)
      this.resetForm('storePackForm')
    },
    /** 搜索按钮操作 */
    handleQuery () {
      this.queryParams.pageNum = 1
      this.getList()
    },
    // 多选框选中数据
    handleSelectionChange (selection) {
      this.ids = selection
      this.single = selection.length != 1
      this.multiple = !selection.length
    },
    // 过滤店铺角色列表
    filterStoreRole (e) {
      return this.actList.filter(item => e == item.code)[0].name
    },
    // 过滤首充开关
    filterRechargeSwitch (e) {
      console.log(e)
      return ['关闭', '开启'][e]
    },
    /** 新增按钮操作 */
    handleAdd () {
      this.reset()
      this.open = true
      this.title = '收款码套餐-添加'
      this.isEdit = false
    },
    /** 修改按钮操作 */
    handleUpdate () {
      this.reset()
      this.form = this.ids[0]
      this.open = true
      this.title = '收款码套餐-修改'
      this.isEdit = true
    },
    /** 删除按钮操作 */
    handleDelete () {
      const ids = this.ids.map(item => item.id)
      const codes = this.ids.map(item => item.code)
      this.$confirm('是否确认删该数据?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(function () {
          return integralsDelPack({ ids: ids })
        })
        .then(() => {
          this.getList()
          this.msgSuccess('删除成功')
        })
        .catch(function () {})
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs['storePackForm'].validate(valid => {
        if (valid) {
          if (!/(^[1-9]\d*$)/.test(this.form.validityTime)) {
            return this.msgError('请输入正确的有效天数')
          }
          if (this.form.id != undefined) {
            delete this.form.createTime
            integralsEditPack(this.form).then(response => {
              if (response.code == 200) {
                this.msgSuccess('修改成功')
                this.open = false
                this.getList()
              }
            })
          } else {
            integralsAddPack(this.form).then(response => {
              if (response.code == 200) {
                this.msgSuccess('新增成功')
                this.open = false
                this.getList()
              }
            })
          }
        }
      })
    },
    /** 活动筛选改变 */
    handleActChange (value) {
      // console.log(value);
      // const ACT = _.find(this.actList, (v) => v.code == value);
      // this.form.actName = ACT.name;
    }
  }
}
</script>
