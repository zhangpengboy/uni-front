<!--
 * @Author      : Lance Yi [QQ：342003386]
 * @Date        : 2020-08-27 14:43:47
 * @Description : 营销管理 - 活动字典
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
          placeholder="请输入表名进行查询"
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
            <span v-else-if="v.prop === 'status'">
              <el-tag type="danger" v-if="scope.row.status == '0'">未使用</el-tag>
              <el-tag type="success" v-if="scope.row.status == '1'">已使用</el-tag>
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
      <el-form ref="dictForm" :model="form" label-width="90px" label-suffix=":">
        <el-form-item
          label="表名"
          prop="tableName"
          :rules="[{ required: true, message: '请输入表名', trigger: 'blur' }]"
        >
          <el-input
            @input="check_zh"
            :disabled="isEdit"
            v-model="form.tableName"
            placeholder="请输入非中文表名"
          />
        </el-form-item>
        <el-form-item
          label="描述"
          prop="mark"
          :rules="[{ required: true, message: '请输入描述', trigger: 'blur' }]"
        >
          <el-input v-model="form.mark" placeholder="请输入描述" />
        </el-form-item>
        <!-- <el-form-item
          label="价格"
          prop="price"
          :rules="[{ required: true, message: '请输入价格', trigger: 'blur' }]"
        >
          <el-input v-model="form.price" placeholder="请输入价格" />
        </el-form-item> -->
        <!-- <el-form-item
          label="店铺类型"
          prop="storeRole"
          required
          :rules="[{ required: true, message: '请选择类型' }]"
        >
          <el-select
            v-model="form.storeRole"
            clearable
            @change="handleActChange"
            class="w-100"
          >
            <el-option
              v-for="(v, i) in actList"
              :key="v.id"
              :label="v.name"
              :value="v.code"
              v-show="i >= 2"
            >
            </el-option>
          </el-select>
        </el-form-item> -->
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
  dictPageList,
  dictAdd,
  dictDelete,
  dictUpdate,
} from "@/api/system/dictionary";

import { mapGetters } from "vuex";

const defaultFrom = {
  id: undefined,
  actCode: undefined,
  actName: undefined,
  tableName: undefined,
  mark: undefined,
  status: undefined,
};

const defaultColumns = [
  // {
  //   label: "活动编号",
  //   show: true,
  //   prop: "actCode",
  //   align: "left",
  //   width: 200,
  // },
  {
    label: "活动名称",
    show: true,
    prop: "actName",
    align: "left",
  },
  {
    label: "表名",
    show: true,
    prop: "tableName",
    align: "center",
  },
  {
    label: "描述",
    show: true,
    prop: "mark",
    align: "center",
  },
  {
    label: "状态",
    show: true,
    prop: "status",
    align: "center",
    width: 120
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
  name: "MarketDictionary",
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
      // 弹窗标题
      title: "",
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
      actList: [],
    };
  },
  created() {
    this.getList();
  },
  methods: {
    check_zh(obj) {
      this.form.tableName = obj.replace(/[\u4E00-\u9FA5]|[\uFE30-\uFFA0]/g, "");
    },
    /** 查询列表 */
    getList() {
      this.loading = true;
      dictPageList(this.queryParams).then((response) => {
        this.list = response.data.list;
        this.total = Number.parseInt(response.data.total);
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = _.assign({}, defaultFrom);
      this.resetForm("dictForm");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection;
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "活动字典表-添加";
      this.isEdit = false;
    },
    /** 修改按钮操作 */
    handleUpdate() {
      console.log(111, this.ids);
      this.reset();
      this.form = this.ids[0];
      // this.form.storeRole = +this.ids[0].storeRole;
      this.open = true;
      this.title = "活动字典表-修改";
      this.isEdit = true;
    },
    /** 删除按钮操作 */
    handleDelete() {
      const ids = this.ids.map((item) => item.id);
      const actNames = this.ids.map((item) => item.actName);
      this.$confirm('是否确认删除"' + actNames + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return dictDelete({ ids: ids });
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(function () {});
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["dictForm"].validate((valid) => {
        if (valid) {
          if (this.form.id != undefined) {
            delete this.form.createTime;
            dictUpdate(this.form).then((response) => {
              if (response.code == 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            dictAdd(this.form).then((response) => {
              if (response.code == 200) {
                this.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              }
            });
          }
        }
      });
    },
    /** 活动筛选改变 */
    handleActChange(value) {
      // console.log(value);
      // const ACT = _.find(this.actList, (v) => v.code == value);
      // this.form.actName = ACT.name;
    },
  },
};
</script>