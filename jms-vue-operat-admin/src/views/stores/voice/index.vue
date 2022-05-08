<!--
 * @Author       : Lance Yi <latticeyi@gmail.com>
 * @Date         : 2020-10-30 15:09:54
 * @Description  :
-->
<template>
  <div class="app-container">
    <el-row :gutter="10" class="mb8">
      <el-col :span="20">
        <el-form :inline="true" ref="tableForm" :model="tableForm" class="demo-form-inline">
        <el-button
            type="primary"
            icon="el-icon-plus"
            size="mini"
            @click="handleAdd"
            >新增</el-button
          >
        <el-form-item label="查询" prop="phone" style="margin-left: 18px">
          <el-input v-model="tableForm.phone" placeholder="请输入手机号" clearable @keyup.enter.native="onSubmit"></el-input>
        </el-form-item>
        <el-form-item label="" prop="topicFullName">
          <el-input v-model="tableForm.topicFullName" placeholder="请输入Topic完整名称" clearable @keyup.enter.native="onSubmit"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
          <el-button @click="resetForm('tableForm')">重置</el-button>
        </el-form-item>
      </el-form>
      </el-col>
      <right-toolbar
          :page="queryParams"
          @queryTable="getList"
          :showSearchBar="false"
          showRefreshBar
        ></right-toolbar>
    </el-row>
    <!-- 查询 -->
    
    <el-table
      v-loading="loading"
      :data="list"
      @selection-change="handleSelectionChange"
      border
      :height="tableHeight-10"
    >
      <el-table-column type="selection" width="50" align="center" fixed="left"/>
      <el-table-column
        label="序号"
        type="index"
        width="80"
        align="center"
      ></el-table-column>
      <el-table-column
        label="手机号"
        align="center"
        prop="phone"
        header-align="center"
        :show-overflow-tooltip="true"
        width="130"
      />
      <el-table-column
        label="店铺名称"
        align="center"
        prop="storeName"
      
      >
        <!-- <template slot-scope="scope">
          <div v-if="scope.row.productType === 0">移动网络版</div>
          <div v-if="scope.row.productType === 1">WiFi版</div>
        </template> -->
      </el-table-column>
      <el-table-column
        label="Topic完整名称"
        align="center"
        prop="topicFullName"
        
      ></el-table-column>
      <el-table-column
        label="设备ProductKey"
        align="center"
        prop="productKey"
        width="140"
      ></el-table-column>
      <el-table-column label="设备启用状态" align="center" prop="status" width="100">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 0" type="success" size="small">启用</el-tag>
          <el-tag v-if="scope.row.status === 1" size="small" type="danger">禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="备注"
        align="center"
        prop="mark"
        width="200"
      ></el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="240"
        fixed="right"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleEdit(scope.row)"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-scissors"
            @click="handleUnbundling(scope.row)"
            >解除绑定</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            >删除</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-tickets"
            @click="handleTest(scope.row)"
            >测试</el-button
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
    <StoresVoiceDialog
      :isEdit="isEdit"
      :open="open"
      :form="form"
      @submit="getList()"
      @cancel="cancel()"
    ></StoresVoiceDialog>
  </div>
</template>

<script>
import { storeVoiceListByUser, storeVoiceDeleteById, storeVoiceUnbind, pushMessage } from "@/api/stores";
import StoresVoiceDialog from "../components/storesVoiceDialog";
export default {
  name: "StoresInfo",
  components: {
    StoresVoiceDialog,
  },
  data() {
    return {
      // 是否显示弹出层
      open: false,
      // 是否修改
      isEdit: false,
      // 表单参数
      form: {},
      // 数据列表
      list: null,
      // 总条数
      total: 0,
      // 遮罩层
      loading: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 15,
      },
      // 查询参数
      tableForm: {},
    };
  },
  created() {
    this.getList();
  },
  methods: {
    // 获取列表,,,
    getList() {
      this.tableForm = _.assign(this.tableForm, this.queryParams);
      storeVoiceListByUser(this.tableForm).then((res) => {
        if (res.code == 200) {
          this.total = Number.parseInt(res.data.total);
          this.list = res.data.list;
        }
      });
    },
    // 查询数据
    onSubmit() {
      if(this.tableForm.phone || this.tableForm.topicFullName) {
        this.getList()
      }
    },
    // 重置
    resetForm(tableForm) {
      this.$refs[tableForm].resetFields();
      this.getList()
    },
    // 新增收款音响
    handleAdd() {
      this.form = {
        phone: "",
        productKey: "ghxrQJGZ2lb",
        productType: 0,
        topicFullName: "",
      };
      this.isEdit = false
      this.open = true;
    },
    // 取消按钮
    cancel() {
      this.form = {};
      this.open = false;
    },
    // 测试按钮
    handleTest(row) {
      pushMessage(
        {
          storeId: row.storeId,
          phone: row.phone
        }
        ).then(res => {
        this.msgSuccess(res.data.data)
      }).catch(err => {
        this.msgError(err)
      })
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      console.log(selection);
    },
    // 修改数据
    handleEdit(row) {
      // console.log(row);
      // row.productType = '' + row.productType
      this.open = true;
      this.isEdit = true
      // this.form = {
      //   id: row.id,
      //   storeid: row.storeId,
      //   storename: row.storeName,
      // }
      this.form = _.assign({}, row)
      this.form.topicFullName = row.topicFullName.split('/')[2]
    },
    // 删除数据
    handleDelete(row) {
      console.log(row);
      this.$confirm("确定删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          storeVoiceDeleteById({ workId: row.id }).then((res) => {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            const total = Math.ceil(
              (this.total - 1) / this.queryParams.pageSize
            );
            this.queryParams.pageNum =
              this.queryParams.pageNum > total
                ? total
                : this.queryParams.pageNum;
            this.queryParams.pageNum =
              this.queryParams.pageNum < 1 ? 1 : this.queryParams.pageNum;
            this.getList();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    handleUnbundling(row) {
      console.log(row);
      this.$confirm("确定解除绑定店铺, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          storeVoiceUnbind({ workId: row.id }).then((res) => {
            this.$message({
              type: "success",
              message: "解绑成功!",
            });
            this.getList();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消解绑",
          });
        });
    }
  },
};
</script>
