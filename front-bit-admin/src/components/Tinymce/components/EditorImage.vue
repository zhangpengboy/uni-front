<template>
  <div class="upload-container">
    <el-button
      :style="{ background: color, borderColor: color }"
      icon="el-icon-upload"
      size="mini"
      type="primary"
      @click="dialogVisible = true"
    >
      上传图片
    </el-button>
    <el-dialog :visible.sync="dialogVisible" title="多图上传" width="900px">
      <el-upload
        :multiple="true"
        :file-list="fileList"
        :show-file-list="true"
        :on-remove="handleRemove"
        :on-success="handleSuccess"
        :before-upload="beforeUpload"
        class="editor-slide-upload"
        action="#"
        :http-request="handleHttpRequest"
        list-type="picture-card"
      >
        <el-button size="small" type="primary"> 点击上传 </el-button>
      </el-upload>
      <el-button @click="dialogVisible = false"> 关闭 </el-button>
      <el-button type="primary" @click="handleSubmit"> 确认 </el-button>
    </el-dialog>
  </div>
</template>

<script>
import { uploadImg } from "@/api/upload";
export default {
  name: "EditorSlideUpload",
  props: {
    color: {
      type: String,
      default: "#1890ff",
    },
  },
  data() {
    return {
      dialogVisible: false,
      listObj: {},
      fileList: [],
    };
  },
  methods: {
    checkAllSuccess() {
      return Object.keys(this.listObj).every(
        (item) => this.listObj[item].hasSuccess
      );
    },
    handleHttpRequest(e) {
      const uid = e.file.uid;
      const objKeyArr = Object.keys(this.listObj);
      uploadImg(e.file).then((res) => {
        if (res.code == 200) {
          for (let i = 0, len = objKeyArr.length; i < len; i++) {
            if (this.listObj[objKeyArr[i]].uid === uid) {
              this.listObj[objKeyArr[i]].url = res.data;
              this.listObj[objKeyArr[i]].hasSuccess = true;
              return;
            }
          }
        } else {
          this.$message("上传图片失败,请重新上传!");
        }
      });
    },
    handleSubmit() {
      const arr = Object.keys(this.listObj).map((v) => this.listObj[v]);
      if (!this.checkAllSuccess()) {
        this.$message(
          "请等待所有文件上传成功. 如果有网络问题，请刷新页面并重新上传!"
        );
        return;
      }
      this.$emit("successCBK", arr);
      this.listObj = {};
      this.fileList = [];
      this.dialogVisible = false;
    },
    // 废弃
    handleSuccess(response, file) {
      const uid = file.uid;
      const objKeyArr = Object.keys(this.listObj);
      for (let i = 0, len = objKeyArr.length; i < len; i++) {
        if (this.listObj[objKeyArr[i]].uid === uid) {
          this.listObj[objKeyArr[i]].url = response.files.file;
          this.listObj[objKeyArr[i]].hasSuccess = true;
          return;
        }
      }
    },
    handleRemove(file) {
      const uid = file.uid;
      const objKeyArr = Object.keys(this.listObj);
      for (let i = 0, len = objKeyArr.length; i < len; i++) {
        if (this.listObj[objKeyArr[i]].uid === uid) {
          delete this.listObj[objKeyArr[i]];
          return;
        }
      }
    },
    beforeUpload(file) {
      const _self = this;
      const _URL = window.URL || window.webkitURL;
      const fileName = file.uid;
      this.listObj[fileName] = {};
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = _URL.createObjectURL(file);
        img.onload = function () {
          _self.listObj[fileName] = {
            hasSuccess: false,
            uid: file.uid,
            width: this.width,
            height: this.height,
          };
        };
        resolve(true);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.editor-slide-upload {
  margin-bottom: 20px;
  ::v-deep .el-upload--picture-card {
    width: 100%;
  }
}
</style>
