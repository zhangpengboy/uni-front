<template>
  <div class="app-container">
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="44%"
      :before-close="handleClose"
    >
      <el-form
        :model="appForm"
        :rules="rules"
        ref="appForm"
        label-width="120px"
      >
        <el-form-item label="手机类型" prop="platformType">
          <el-radio-group v-model="appForm.platformType">
            <el-radio :label="1">IOS</el-radio>
            <el-radio :label="2">Android</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="更新类型" prop="updateType">
          <el-radio-group v-model="appForm.updateType">
            <el-radio :label="1">普通更新</el-radio>
            <el-radio :label="2">强制更新</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="更新状态" prop="updateStatus">
          <el-radio-group v-model="appForm.updateStatus">
            <el-radio :label="1">开启</el-radio>
            <el-radio :label="2">关闭</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="版本名称" prop="versionName">
          <el-input
            v-model="appForm.versionName"
            placeholder="请输入版本名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="版本号" prop="versionNo">
          <el-input
            v-model="appForm.versionNo"
            placeholder="请输入版本号"
          ></el-input>
        </el-form-item>
        <el-form-item label="版本值" prop="versionValue">
          <el-input
            placeholder="请输入版本值"
            v-model.number="appForm.versionValue"
          ></el-input>
        </el-form-item>

        <el-form-item label="更新说明" prop="updateContent">
          <el-input
            type="textarea"
            v-model="appForm.updateContent"
            placeholder="请输入更新说明"
          ></el-input>
        </el-form-item>

        <el-form-item
          label="Android Apk"
          prop="downloadPath"
          v-if="appForm.platformType == 2"
        >
          <el-upload
            class="upload-demo"
            action="#"
            drag
            multiple
            :show-file-list="false"
            :before-upload="beforeAvatarUpload"
            :http-request="uploadFile"
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              将文件拖到此处，或
              <em>点击上传</em>
            </div>
          </el-upload>
        </el-form-item>
        <el-form-item
          label="APP下载路径"
          prop="downloadPath"
          v-if="appForm.platformType == 2"
        >
          <el-input
            type="textarea"
            v-model="appForm.downloadPath"
            :autosize="{ minRows: 2, maxRows: 4 }"
            :disabled="appForm.platformType == 2"
          ></el-input>
        </el-form-item>
        <el-form-item label="APP下载路径" v-if="appForm.platformType != 2">
          <el-input
            type="textarea"
            v-model="appForm.downloadPath"
            :autosize="{ minRows: 2, maxRows: 4 }"
            :disabled="appForm.platformType == 2"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <!-- <el-button type="primary" @click="submitForm('appForm')"
            >submit</el-button
          > -->
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetForm('appForm')">取 消</el-button>
        <el-button type="primary" @click="submitForm('appForm')"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="dialogVisible = true"
          >新增</el-button
        >
      </el-col>
    </el-row>
    <el-table
      :data="list"
      border
      style="width: 100%"
      :height="tableHeight + 10"
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
          <template slot-scope="scope">
            <span v-if="v.prop === 'createTime'">
              {{ parseTime(scope.row.createTime) }}
            </span>
            <span v-else-if="v.prop === 'updateStatus'">
              <el-tag v-if="scope.row.updateStatus == '1'">开启</el-tag>
              <el-tag type="danger" v-if="scope.row.updateStatus == '2'"
                >关闭</el-tag
              >
            </span>
            <span v-else-if="v.prop === 'appPackageType'">
              <span v-if="scope.row.appPackageType == '1'">客户端 </span>
              <span v-if="scope.row.appPackageType == '2'">商户端</span>
            </span>
            <span v-else-if="v.prop === 'platformType'">
              {{ scope.row.platformType == 1 ? "IOS" : "android" }}
            </span>
            <span v-else-if="v.prop === 'updateType'">
              {{ scope.row.updateType == 1 ? "普通更新" : "强制更新" }}
            </span>
            <span v-else>{{ scope.row[v.prop] }}</span>
          </template>
        </el-table-column>
      </template>
      <el-table-column
        label="操作"
        align="center"
        fixed="right"
        class-name="small-padding fixed-width"
        width="180"
      >
        <template slot-scope="scope">
          <el-button
            @click="handleCopy(scope.row)"
            icon="el-icon-document-copy"
            type="text"
            v-clipboard:copy="scope.row.downloadPath"
            v-clipboard:success="spanPaste"
            >复制路径</el-button
          >
          <el-button
            @click="handleClick(scope.row)"
            v-if="scope.row.updateStatus == '1'"
            icon="el-icon-close"
            type="text"
            >关闭</el-button
          >
          <el-button
            @click="handleClick(scope.row)"
            v-if="scope.row.updateStatus == '2'"
            icon="el-icon-open"
            type="text"
            >开启</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <pagination
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getAppList"
    />
  </div>
</template>
<script>
import { appPageList, addApp, updateApp } from "@/api/system/superadmin";
import { uploadFile } from "@/api/upload";
const defaultColumns = [
  {
    label: "版本名称",
    show: true,
    prop: "versionName",
    align: "center",
  },
  {
    label: "版本号",
    show: true,
    prop: "versionNo",
    align: "center",
  },
  {
    label: "APP包类型",
    show: true,
    prop: "appPackageType",
    align: "center",
  },
  {
    label: "APP下载路径",
    show: true,
    prop: "downloadPath",
    align: "left",
  },
  {
    label: "手机类型",
    show: true,
    prop: "platformType",
    align: "center",
  },
  {
    label: "更新内容说明",
    show: true,
    prop: "updateContent",
    align: "left",
  },
  {
    label: "更新状态",
    show: true,
    prop: "updateStatus",
    align: "center",
    width: 80,
  },
  {
    label: "更新类型",
    show: true,
    prop: "updateType",
    align: "center",
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
  name: "SystemAPPupDate",
  data() {
    return {
      dialogVisible: false,
      columns: _.cloneDeep(defaultColumns),
      //   config,
      appForm: {
        versionName: "", //版本名称
        versionNo: "", //版本号
        versionValue: "", // 版本值
        appPackageType: "1", //APP包类型：1->客户端 2->商户端
        platformType: "", //手机类型，1:IOS,2:android
        updateContent: "", //更新内容说明
        updateStatus: "", //更新状态，1开启，2关闭
        updateType: "", //更新类型，1普通更新，2强制更新
        downloadPath: "", //APP下载路径
      },
      fileList: [],
      list: [],
      rules: {
        versionName: [
          { required: true, message: "请输入版本名称", trigger: "blur" },
        ],
        versionNo: [
          { required: true, message: "请输入版本号", trigger: "blur" },
        ],
        versionValue: [
          { required: true, message: "请输入版本值", trigger: "blur" },
          { type: "number", message: "请输入数字", trigger: "blur" },
        ],
        platformType: [
          { required: true, message: "请选择手机类型", trigger: "change" },
        ],
        updateType: [
          { required: true, message: "请选择更新类型", trigger: "change" },
        ],
        updateStatus: [
          { required: true, message: "请选择更新状态", trigger: "change" },
        ],
        updateContent: [
          { required: true, message: "请填写版本说明", trigger: "blur" },
        ],
        downloadPath: [
          { required: true, message: "请上传APP路径", trigger: "blur" },
        ],
      },
      queryParams: _.cloneDeep(this.Dict.QUERY_PARAMS),
      total: 0,
    };
  },
  methods: {
    /** 图片上传之前判断 */
    beforeAvatarUpload(file) {
      //附件上传前的方法
      var filetype = file.name.substring(file.name.lastIndexOf(".") + 1);
      var isPdf = filetype === "apk";
      if (!isPdf) {
        this.$message.error("上传文件仅支持 apk 格式!");
      }
      return isPdf;
    },
    uploadFile(e) {
      this.msg = this.$message({
        message: "正在上传,请稍等",
        type: "warning",
        duration: 0,
      });
      uploadFile(e.file).then((res) => {
        if (res.code == 200) {
          this.msg.close();
          this.$message({
            message: "上传成功!",
            type: "success",
          });
          this.appForm.downloadPath = res.data;
        } else {
          this.$msgError("上传图片失败,请重新上传!");
        }
      });
    },
    // 复制下载路径
    spanPaste() {
      this.msgSuccess(`APP下载地址已复制到剪切板`);
    },
    submitForm(formName) {
      var that = this;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let _data = that.appForm;
          addApp(_data)
            .then((res) => {
              if (res.code == 200) {
                that.list = [];
                that.getAppList();
                this.$message({
                  message: "添加成功",
                  type: "success",
                });
                this.dialogVisible = false;
                this.appForm.downloadPath = "";
                that.$refs["appForm"].resetFields();
              }
            })
            .catch((err) => {
              this.$message.error(err.message);
            });
        } else {
          this.$message.error("请填写完整表单");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.dialogVisible = false;
      this.appForm.downloadPath = "";
      this.appForm.versionValue = "";
      this.$refs[formName].resetFields();
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          this.resetForm("appForm");
        })
        .catch((_) => {});
    },
    getAppList() {
      var that = this;
      appPageList(this.queryParams)
        .then((res) => {
          if (res.code == 200) {
            that.list = res.data.list;
            that.total = +res.data.total;
          }
        })
        .catch((err) => {
          that.$message.error(err.message);
        });
    },
    platformTypeChange(val) {
      console.log(val);
    },
    handleClick(row) {
      console.log(999, row);
      updateApp({
        id: row.id,
        updateStatus: +row.updateStatus == 1 ? 2 : 1,
      })
        .then((res) => {
          if (res.code == 200) {
            this.getAppList();
            this.$message({
              message: "更新成功",
              type: "success",
            });
          }
        })
        .catch((err) => {
          this.$message.error("更新失败");
        });
    },
    changeClickPage(value) {
      this.pageNum = value;
      this.getAppList();
    },
  },
  created() {
    this.getAppList();
  },
};
</script>
<style lang="scss">
html,
body {
  background: #f8f8f8;
}
.home {
  &-col {
    padding-bottom: 10px;
  }
}
@media only screen and (max-width: 767px) {
  .home .el-upload-dragger {
    width: 220px;
    height: 150px;
    .el-icon-upload {
      font-size: 55px;
      margin-top: 16px;
    }
  }
}
</style>