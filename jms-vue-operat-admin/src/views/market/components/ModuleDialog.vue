<!--
 * @Author      : Lance Yi [QQ：342003386]
 * @Date        : 2020-08-29 08:55:14
 * @LastEditors : Please set LastEditors
 * @LastEditTime: 2021-04-20 20:32:30
 * @FilePath    : \src\views\components\UnitDialog\index.vue
 * @Description : 活动 - 添加、修改弹窗组件
-->
<template>
  <el-dialog
    :title="title"
    :visible="open"
    :width="width"
    append-to-body
    v-el-dialog-drag
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="cancel"
  >
    <el-form
      ref="MarketModuleForm"
      :model="form"
      :rules="rules"
      label-width="90px"
      label-suffix=":"
    >
      <el-form-item label="活动类型" prop="actType">
        <el-select v-model="form.actType" class="w-100" @change="handleChangeActType">
          <el-option
            v-for="(v, i) in Dict.ACT_TYPE"
            :key="i"
            :label="v.value"
            :value="v.key"
          >
          </el-option>
        </el-select>
        <!-- 
        <el-radio-group v-model="form.actType">
          <el-radio :label="0">活动栏目</el-radio>
          <el-radio :label="1">广告图</el-radio>
        </el-radio-group> -->
      </el-form-item>
      <el-form-item
        label="父级类型"
        prop="pcode"
        v-if="form.actType != 0 && form.actType != 1"
        required
      >
        <el-select
          v-model="form.pcode"
          :disabled="isEdit"
          @change="handleChangeCode"
          class="w-100"
        >
          <el-option
            v-for="(v, i) in actList"
            :key="i"
            :label="v.actName"
            :value="v.actCode"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <el-select
          v-if="form.actType != 0 && form.actType != 1"
          v-model="form.name"
          :disabled="isEdit"
          @change="handleChangePCode"
          class="w-100"
        >
          <el-option
            v-for="(v, i) in actChildList"
            :key="i"
            :label="v.actName"
            :value="v.actCode"
          >
          </el-option>
        </el-select>
        <el-select
          v-else
          v-model="form.name"
          :disabled="isEdit"
          @change="handleChangeCode"
          class="w-100"
        >
          <el-option
            v-for="(v, i) in actList"
            :key="i"
            :label="v.actName"
            :value="v.actCode"
          >
          </el-option>
        </el-select>
        <!-- <el-input
          v-else
          v-model="form.name"
          placeholder="请输入名称"
          :disabled="isEdit"
        /> -->
      </el-form-item>
      <el-form-item
        label="字典表单"
        prop="dictId"
        v-if="form.actType != 0 && form.actType != 1"
      >
        <el-select
          v-model="form.dictId"
          @change="handleActChange"
          class="w-100"
          :disabled="isEdit"
        >
          <el-option
            v-for="(v, i) in actTableList"
            :key="i"
            :label="v.tableName"
            :value="v.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
       <el-form-item
        label="权重"
        prop="weight"
        v-if="form.actType != 0 && form.actType != 1"
      >
        <el-input
          onkeyup="this.value = this.value.replace(/[^\d.]/g,'');"
          maxlength="6"
          v-model="form.weight"
          placeholder="请添加权重"
        />
      </el-form-item>
      <el-form-item
        label="标签说明"
        v-if="form.actType == 3"
      >
        <el-input
          v-model="form.label"
          placeholder="请输入标签说明"
        />
      </el-form-item>
      <el-form-item
        label="标签说明"
        prop="label"
        v-if="form.actType == 4"
      >
        <el-input
          v-model="form.label"
          placeholder="请输入标签说明"
        />
      </el-form-item>
      <el-form-item
        label="类型展示"
        prop="style"
        v-if="form.actType == 3"
      >
        <el-select
          v-model="form.style"
          class="w-100"
        >
          <el-option
            v-for="(v, i) in Dict.ACTShow_Style"
            :key="i"
            :label="v.value"
            :value="v.key"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="店铺角色"
        prop="roles"
        v-if="form.actType != 0 && form.actType != 1"
      >
        <el-select
          v-model="form.roles"
          multiple
          placeholder="请选择可参与活动的店铺角色"
          class="w-100"
          :disabled="isEdit"
        >
          <el-option
            v-for="item in roleList"
            :key="item.code"
            :label="item.name"
            :value="item.code"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="栏目图标"
        prop="icon"
        required
        v-if="form.actType == 2"
      >
        <el-upload
          class="avatar-uploader"
          action="#"
          :show-file-list="false"
          :before-upload="beforeAvatarUpload"
          :http-request="uploadImg"
        >
          <img v-if="form.icon" :src="form.icon" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          <div slot="tip" class="el-upload__tip">
            建议尺寸100*100, 只能上传jpg/png文件，且不超过500kb
          </div>
        </el-upload>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-radio-group v-model="form.status">
          <el-radio :label="0">启用</el-radio>
          <el-radio :label="1">禁用</el-radio>
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
</template>
<script>
import {
  addActCommon,
  updateActCommon,
  getActCommonAllList,
  addAppAct,
  getAppActChildList
} from "@/api/goods";
import { uploadImg } from "@/api/upload";
export default {
  name: "MarketModuleDialog",
  props: {
    // 是否打开
    open: {
      type: Boolean,
      default: false,
    },
    // 绑定的表单对象
    form: {
      type: Object,
      default: function () {
        return {};
      },
    },
    // 是否是修改
    isEdit: {
      type: Boolean,
      default: false,
    },
    // 弹窗宽度
    width: {
      type: String,
      default: "500px",
    },
    roleList: {
      type: Array,
      default: function () {
        return [];
      },
    },
    actTableList: {
      type: Array,
      default: function () {
        return [];
      },
    },
  },
  data() {
    return {
      // 弹窗标题
      title: "",
      // 表单校验
      rules: {
        // name: [
        //   { required: true, message: "活动名称不能为空", trigger: "blur" },
        // ],
        dictId: [
          { required: true, message: "活动字典不能为空", trigger: "blur" },
        ],
        roles: [
          { required: true, message: "店铺角色不能为空", trigger: "blur" },
        ],
        actType: [
          { required: true, message: "活动类型不能为空", trigger: "blur" },
        ],
        style: [
          { required: true, message: "类型展示不能为空", trigger: "blur" },
        ],
        label: [
          { required: true, message: "标签说明不能为空", trigger: "blur" },
        ],
        weight: [
          { required: true, message: "权重不能为空", trigger: "blur" },
        ],
      },
      // 活动模板列表
      actList: [],
      // 下级活动列表
      actChildList: []
    };
  },
  created() {
    console.log(123, this.roleList);
    if (this.isEdit) {
      let arr = [];
      this.roleList.map((item) => {
        if (item.code == this.form.role) {
          arr.push(item.code);
        }
      });
      this.form.roles = JSON.parse(JSON.stringify(arr));
    }
    if (this.isEdit) {
      this.title = "活动模块 - 修改";
    } else {
      this.title = "活动模块 - 添加";
    }
    // 获取顶部栏目区列表
    // getActCommonAllList({ actType: 1 }).then((res) => {
    //   this.actList = res.data;
    //   console.log(res);
    //   console.log(123, this.actList);
    // });
    this.getAppActChildList()
    
  },
  methods: {
    /** 图片上传之前判断 */
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg" || file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 1;
      if (!isJPG) {
        this.$message.error("上传图片只能是JPG、PNG格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过1MB!");
      }
      return isJPG && isLt2M;
    },
    /** 自定义上传图片 */
    uploadImg(e) {
      uploadImg(e.file).then((res) => {
        if (res.code == 200) {
          this.$set(this.form, "icon", res.data);
        } else {
          this.$msgError("上传图片失败,请重新上传!");
        }
      });
    },
    // 获取活动
    getAppActChildList () {
      getAppActChildList({}).then((res) => {
        this.actList = res.data;
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      console.log(88888, this.form);
      this.$refs["MarketModuleForm"].validate((valid) => {
        console.log(777,valid);
        if (valid) {
          var patt = /^ [\s]*$/
          // this.form.name = this.name
          if (patt.test(this.form.name)) {
            // console.log('空');
            this.msgError('名称不能为空')
          }
          const _params = _.assign({}, this.form);
          if (_params.roles) {
            _params.role = _params.roles.toString();
          }
          if (_params.id != undefined) {
            updateActCommon(_params).then((response) => {
              this.msgSuccess("修改成功");
              this.$emit("cancel");
              this.$emit("submit");
            });
          } else {
            addActCommon(_params).then((response) => {
              this.msgSuccess("新增成功");
              this.$emit("cancel");
              this.$emit("submit");
            });
          }
        }
      });
    },
    // 取消按钮
    cancel() {
      this.$emit("cancel");
    },
    /** 父级栏目选择 */
    handleChangeCode(val) {
      this.form.name = null
      this.form.code = null
      if(this.form.actType != 0 && this.form.actType != 1) {
        this.$set(
          this.form,
          "pname",
          this.actList
            .filter((v) => v.actCode == val)
            .map((v) => v.actName)
            .toString()
        );
        this.$set(this.form,'pcode',val)
        getAppActChildList({ code: this.form.pcode }).then((res) => {
          this.actChildList = res.data;
        });
      }else {
        this.$set(this.form,'code',val)
        this.$set(
          this.form,
          "name",
          this.actList
            .filter((v) => v.actCode == val)
            .map((v) => v.actName)
            .toString()
        );
      }
    },
    /** 下级选择 */
    handleChangePCode(val) {
      // console.log(val);
      if(!this.form.pcode) return this.msgError('请先选择父级类型')
      this.$set(this.form,'code',val)
      this.$set(
        this.form,
        "name",
        this.actChildList
          .filter((v) => v.actCode == val)
          .map((v) => v.actName)
          .toString()
      );
    },
    // 
    handleChangeActType() {
      this.form.name = null
      this.form.code = null
      this.form.pname = null
      this.form.pcode = null
    },
    //获取字典表单
    handleActChange(value) {
      // console.log(value);
      this.form.dictId = value;
      // this.$set(
      //   this.form,
      //   "tableName",
      //   this.actTableList.filter((v) => v.id == value).map((v) => v.tableName).toString()
      // );
    },
  },
};
</script>