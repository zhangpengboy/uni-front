<!--
 * @Author       : Lance Yi <latticeyi@gmail.com>
 * @Date         : 2020-11-27 14:23:35
 * @Description  : 营销管理 - 模块管理
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
          >修改</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="single"
          @click="handleDelete"
          >删除</el-button
        >
      </el-col>
      <el-col :span="3.5">
        <el-button
          type="warning"
          size="mini"
          @click="handleAsnyc"
          >自营店绑定全部活动</el-button
        >
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="18">
        <el-form
          :inline="true"
          ref="searchParams"
          :model="searchParams"
          class="demo-form-inline"
        >
          <el-form-item label="活动模块" prop="actName">
            <el-input
              v-model="searchParams.actName"
              placeholder="活动模块名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="活动类型" prop="actType">
            <el-select v-model="searchParams.actType" placeholder="活动类型">
              <el-option
                v-for="(v, i) in Dict.ACT_TYPE"
                :key="i"
                :label="v.value"
                :value="v.key"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="searchStoreRoleList"
              >查询</el-button
            >
            <el-button @click="resetForm('searchParams')">重置</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <right-toolbar
        :page="queryParams"
        @queryTable="resetQuery"
        :showSearchBar="false"
        showRefreshBar
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="list"
      @selection-change="handleSelectionChange"
      border
      :height="tableHeight - 35"
    >
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column label="序号" type="index" width="80" align="center" />
      <el-table-column
        label="父级模块"
        align="left"
        prop="pname"
        header-align="center"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="活动模块"
        align="left"
        prop="name"
        header-align="center"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="活动类型"
        align="center"
        prop="actType"
        width="150"
      >
        <template slot-scope="scope">
          {{ filterKeyToValue(scope.row.actType, "ACT_TYPE") }}
        </template>
      </el-table-column>
      <el-table-column label="店铺角色" align="center" prop="role" width="150">
        <template slot-scope="scope">
          {{ filterStoreRole(scope.row.role) }}
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="status" width="120">
        <template slot-scope="scope">
          <el-tag :type="Dict.STATUS[scope.row.status].type" size="small">{{
            Dict.STATUS[scope.row.status].value
          }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column
        label="操作"
        align="center"
        width="180"
        fixed="right"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <template v-if="scope.row.pcode">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-connection"
              @click="handleBindPack(scope.row)"
              >绑定套餐</el-button
            >
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              >删除</el-button
            >
          </template>
          <template v-if="scope.row.pcode == null && scope.row.actType == 1">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdateRole(scope.row)"
              >编辑子级店铺角色</el-button
            >
          </template>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改活动对话框 -->
    <ModuleDialog
      :isEdit="isEdit"
      :open="open"
      :form="form"
      @submit="getList()"
      @cancel="cancel()"
      :roleList="roleList"
      :actTableList="actTableList"
      v-if="open"
    ></ModuleDialog>
    <!-- 修改活动模板子级角色类型 -->
    <ModuleChildrenDialog
      :open="showRole"
      @submit="getList()"
      @cancel="cancel()"
      :roleList="roleList"
      v-if="showRole"
      :actCode="actCode"
    ></ModuleChildrenDialog>

    <!-- 绑定的套餐列表 -->
    <el-dialog
      title="套餐列表"
      :visible.sync="showPack"
      width="600px"
      append-to-body
      v-el-dialog-drag
      @close="showPack = false"
    >
      <div class="small-padding">
        <el-form
          :model="bindForm"
          ref="bindForm"
          label-width="40px"
          :inline="false"
          size="normal"
        >
          <el-form-item label="套餐">
            <el-select
              v-model="bindForm.packCode"
              placeholder="请选择套餐"
              clearable
              filterable
              class="pr-5"
            >
              <el-option
                v-for="item in packOptions"
                :key="item.id"
                :label="item.name"
                :value="item.code"
              >
              </el-option>
            </el-select>
            <el-button type="primary" size="default" @click="submitBindPack"
              >绑定</el-button
            >
          </el-form-item>
        </el-form>
        <el-table :data="packList" border stripe :key="packKey">
          <el-table-column
            label="序号"
            type="index"
            width="80"
            align="center"
          />
          <el-table-column label="套餐编号" prop="packCode" />
          <el-table-column label="套餐名称" prop="packName" />
          <el-table-column
            label="操作"
            align="center"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDeletePack(scope.row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getActCommonList,
  getActCommon,
  delActCommon,
  getActBindPackList,
  getActCommonPackList,
  addActBindPack,
  delActBindPack,
  storeSyncAct
} from "@/api/goods";
import { getUsableActTable, goodsActTableDict } from "@/api/system/dictionary";
import { storeAllRoleList } from "@/api/stores";
import ModuleDialog from "../components/ModuleDialog";
import ModuleChildrenDialog from "../components/ModuleChildrenDialog";
export default {
  name: "MarketModule",
  components: {
    ModuleDialog,
    ModuleChildrenDialog,
  },
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
      // 用户表格数据
      list: null,
      // 总条数
      total: 0,
      // 弹出层标题
      title: "",
      // 类型树选项
      typeOptions: undefined,
      // 是否显示弹出层
      open: false,
      // 是否修改
      isEdit: false,
      // 类型名称
      typeName: undefined,
      // 日期范围
      dateRange: [],
      // 表单参数
      form: {},
      defaultProps: {
        children: "children",
        label: "categoryNameEx",
      },
      // 查询列表ID
      id: 0,
      // 查询参数
      queryParams: _.cloneDeep(this.Dict.QUERY_PARAMS),
      searchParams: {
        actName: "",
        actType: "",
      },
      // 是否显示绑定套餐
      showPack: false,
      // 绑定套餐列表
      packList: [],
      // 表格key
      packKey: 1,
      // 绑定的套餐对象
      bindForm: {},
      // 套餐选项
      packOptions: [],
      // 角色列表
      roleList: [],
      // 字典列表
      actTableList: [],
      // 是否显示修改子活动模块弹窗
      showRole: false,
      actCode: null,
    };
  },
  created() {
    // 获取店铺角色列表
    storeAllRoleList().then((res) => {
      this.roleList = res.data;
      this.getList();
    });
  },
  methods: {
    filterStoreRole(val) {
      return this.roleList
        .filter((v) => v.code == val)
        .map((v) => v.name)
        .toString();
    },
    getUsableActTable() {
      // 获取字典列表
      getUsableActTable().then((res) => {
        this.actTableList = res.data;
        this.getList();
      });
    },
    /** 查询商品分类列表 */
    getList() {
      this.list = [];
      this.loading = true;
      getActCommonList(this.queryParams).then((response) => {
        this.list = response.data.list;
        this.total = Number.parseInt(response.data.total);
        this.loading = false;
      });
    },
    // 查询
    searchStoreRoleList() {
      console.log(this.searchParams);
      this.queryParams.actName = this.searchParams.actName;
      this.queryParams.actType = this.searchParams.actType;
      this.getList();
    },
    // 重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.queryParams.actType = this.searchParams.actType;
      this.getList();
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.showRole = false;
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.id = 0;
      this.getList();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection;
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd(row) {
      this.form = {
        id: undefined,
        actType: "",
        name: undefined,
        status: 0,
        pcode: null,
        pname: null,
      };
      this.open = true;
      this.isEdit = false;
      this.getUsableActTable();
    },
    /** 自营店同步所有活动 */
    handleAsnyc() {
      this.$confirm('是否确定将所有的活动模块，同步到自营店中?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return storeSyncAct();
        })
        .then(() => {
          this.getList();
          this.msgSuccess("操作成功");
        })
        .catch(function () {});
    },
    /** 绑定按钮操作 */
    handleBindPack(row) {
      this.bindForm = {
        actCode: row.code,
        actName: row.name,
        packCode: undefined,
        packName: undefined,
      };
      this.getActBindPackList(row.code);
      getActCommonPackList({ pageNum: 1, pageSize: 1000 }).then((res) => {
        this.packOptions = res.data.list;
        this.showPack = true;
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      console.log(999, row);
      this.actTableList = [];
      const id = row.id || this.ids.map((item) => item.id);
      getActCommon({ workId: id.toString() }).then((response) => {
        if (response.code == 200) {
          this.form = response.data;
          goodsActTableDict({ code: response.data.code }).then((res) => {
            if (res.code == 200) {
              this.open = true;
              this.isEdit = true;
              if (res.data) {
                this.actTableList.push(res.data);
                this.form.dictId = res.data.id;
              }
            }
          });
        }
      });
      // const code = row.code || this.ids.map((item) => item.code);
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      let ids;
      if (row.id) {
        ids = [row.id];
      } else {
        ids = this.ids.map((item) => item.id);
      }
      if (ids.length <= 0) return this.msgError("暂无选择活动栏目");
      const names = row.name || this.ids.map((item) => item.name);
      this.$confirm('是否确认删除模块为"' + names + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return delActCommon({ workId: ids.toString() });
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(function () {});
    },
    /** 提交绑定套餐操作 */
    submitBindPack() {
      const PACK = _.find(
        this.packOptions,
        (v) => v.code == this.bindForm.packCode
      );
      let _params = _.assign({}, this.bindForm);
      _params.packCode = PACK.code;
      _params.packName = PACK.name;
      addActBindPack(_params).then((res) => {
        this.getActBindPackList(_params.actCode);
      });
    },
    /** 删除绑定套餐操作 */
    handleDeletePack(row) {
      delActBindPack({ workId: row.id }).then((res) => {
        this.getActBindPackList(row.actCode);
      });
    },
    // 获取绑定关系列表
    getActBindPackList(actCode) {
      getActBindPackList({ actCode }).then((response) => {
        this.packList = response.data;
        this.packKey++;
      });
    },
    /** 修改子级店铺角色 */
    handleUpdateRole(row) {
      this.actCode = row.code;
      this.showRole = true;
    },
  },
};
</script>