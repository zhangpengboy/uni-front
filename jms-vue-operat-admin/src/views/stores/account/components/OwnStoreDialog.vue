<!--
 * @Author       : Lance Yi <latticeyi@gmail.com>
 * @Date         : 2020-11-03 14:20:04
 * @Description  : 店铺-添加、修改弹窗组件
-->
<template>
  <el-dialog :title="title"
             :visible="open"
             :width="width"
             append-to-body
             v-el-dialog-drag
             :close-on-click-modal="false"
             :close-on-press-escape="false"
             @close="cancel">
    <el-form ref="storeForm"
             :model="form"
             label-width="100px"
             label-suffix=":">
      <el-form-item label="登录账号"
                    prop="phone"
                    :rules="[{ required: true, message: '请输入手机号', trigger: 'blur' }]">
        <el-input maxlength="11"
                  v-model.number="form.phone"
                  placeholder="建议已11开头,不使用真实手机号"></el-input>
      </el-form-item>
      <el-form-item label="店铺名称"
                    prop="storeName"
                    :rules="[
          { required: true, message: '请输入店铺名称', trigger: 'blur' },
        ]">
        <el-input v-model="form.storeName"></el-input>
      </el-form-item>
      <el-form-item label="店铺类别"
                    prop="storeCategoryId"
                    :rules="[
          { required: true, message: '请选择店铺类别', trigger: 'blur' },
        ]">
        <el-select v-model="form.storeCategoryId"
                   placeholder="请选店铺类别"
                   clearable
                   filterable
                   class="w-100"
                   @change="filterCateName">
          <el-option v-for="(o, i) in cateList"
                     :key="i"
                     :label="o.title"
                     :value="o.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="店铺区域"
                    prop="area1Id"
                    :rules="[
          {
            required: true,
            message: '请选择店铺所在位置',
            trigger: 'blur',
          },
        ]">
        <el-row>
          <el-col style="margin-bottom: 10px"
                  :xs="24"
                  :sm="12">
            <el-select v-model="form.area1Id"
                       placeholder="请选择省"
                       class="w-95"
                       @change="handleChangeArea1">
              <el-option v-for="(v, i) in areaOption1"
                         :key="i"
                         :label="v.name"
                         :value="v.id">
              </el-option>
            </el-select>
          </el-col>
          <el-col style="margin-bottom: 10px"
                  :xs="24"
                  :sm="12">
            <el-select v-model="form.area2Id"
                       placeholder="请选择市/区/县"
                       class="w-95"
                       @change="handleChangeArea2">
              <el-option v-for="(v, i) in areaOption2"
                         :key="i"
                         :label="v.name"
                         :value="v.id">
              </el-option>
            </el-select>
          </el-col>
          <el-col style="margin-bottom: 10px"
                  :xs="24"
                  :sm="12">
            <el-select v-model="form.area3Id"
                       placeholder="请选择区/街道/镇"
                       class="w-95"
                       @change="handleChangeArea3">
              <el-option v-for="(v, i) in areaOption3"
                         :key="i"
                         :label="v.name"
                         :value="v.id">
              </el-option>
            </el-select>
          </el-col>
          <!-- <el-col style="margin-bottom: 10px" :xs="24" :sm="12">
            <el-select
              v-model="form.area4Id"
              placeholder="请选择县/街道"
              class="w-95"
              @change="handleChangeArea4"
            >
              <el-option
                v-for="(v, i) in areaOption4"
                :key="i"
                :label="v.name"
                :value="v.id"
              >
              </el-option>
            </el-select>
          </el-col> -->
        </el-row>
      </el-form-item>
      <el-form-item label="详情地址"
                    prop="storeAddress"
                    :rules="[
          {
            required: true,
            message: '请输入店铺详情地址',
            trigger: 'blur',
          },
        ]">
        <el-input v-model="form.storeAddress"
                  placeholder="请输入店铺详情地址(精确到门牌号)"></el-input>
      </el-form-item>
      <el-row>
        <el-col :md='12'>
          <el-form-item label="店铺背景图"
                        prop="storeBg"
                        required
                        :rules="[{ required: true, message: '店铺详情背景图不能为空' }]">
            <el-upload class="avatar-uploader"
                       action="#"
                       :show-file-list="false"
                       :before-upload="beforeAvatarUpload"
                       :http-request="uploadImgStoreBg">
              <img v-if="form.storeBg"
                   :src="form.storeBg"
                   class="avatar" />
              <i v-else
                 class="el-icon-plus avatar-uploader-icon"></i>
              <div slot="tip"
                   class="el-upload__tip">
                只能上传jpg/png文件，且不超过10M
              </div>
            </el-upload>
          </el-form-item>
        </el-col>
        <el-col :md='12'>
          <el-form-item label="店铺logo"
                        prop="storeLogo"
                        required
                        :rules="[{ required: true, message: '店铺logo不能为空' }]">

            <el-upload class="avatar-uploader"
                       action="#"
                       :show-file-list="false"
                       :before-upload="beforeAvatarUpload"
                       :http-request="uploadImgStoreLogo">
              <img v-if="form.storeLogo"
                   :src="form.storeLogo"
                   class="avatar" />
              <i v-else
                 class="el-icon-plus avatar-uploader-icon"></i>
              <div slot="tip"
                   class="el-upload__tip">
                只能上传jpg/png文件，且不超过10M
              </div>
            </el-upload>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="商品分类">
        <el-checkbox-group @change="classificationChange"
                           v-model="classificationList">
          <el-checkbox v-for="(item, index) in goodsCateList"
                       :key="index"
                       :label="item.id">{{ item.title }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </el-form>
    <div slot="footer"
         style="text-align: center"
         class="dialog-footer">
      <el-button type="primary"
                 @click="submitForm"
                 size="mini">确 定</el-button>
      <el-button @click="cancel"
                 size="mini">取 消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import {
  getStoreCategeAllList,
  getStoreAreaList,
  addOwnStores,
} from "@/api/stores";
import { getGoodsCateList } from "@/api/goods";
import { uploadImg } from "@/api/upload";
import { toAppBaseFun, compressImage } from "@/utils/index";
export default {
  name: "addOwnStores",
  props: {
    // 是否打开
    open: {
      type: Boolean,
      default: false,
    },
    fullscreen: {
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
    reisterForm: {
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
      default: "600px",
    },
  },
  data () {
    return {
      // 弹窗标题
      title: "",
      // 店铺类型
      cateList: [],
      // 店铺角色
      roleList: [],
      // 省
      areaOption1: [],
      // 市
      areaOption2: [],
      // 区
      areaOption3: [],
      // 县/街道
      areaOption4: [],
      goodsCateList: [],
      classificationList: [],
      disabledIdcard: false,
    };
  },
  created () {
    console.log(this.form);
    // 获取店铺分类
    getStoreCategeAllList().then((res) => {
      this.cateList = res.data;
    });
    /** 获取商品分类列表 */
    getGoodsCateList({ workId: 0 }).then((res) => {
      this.goodsCateList = res.data;
      this.classificationList = res.data.map((v) => v.id);
      let arr = [];
      res.data.map((v) => {
        let obj = {};
        obj.goodsCategoryId = v.id;
        obj.goodsCategoryName = v.title;
        arr.push(obj);
      });
      this.form.goodsCateList = _.cloneDeep(arr);
    });
    // 获取店铺地址
    this.getStoreAreaList();
    if (this.isEdit) {
      this.title = "修改";
      if (this.form.area1Id) {
        this.getStoreAreaList(this.form.area1Id, 2);
      }
      if (this.form.area2Id) {
        this.getStoreAreaList(this.form.area2Id, 3);
      }
      if (this.form.area3Id) {
        this.getStoreAreaList(this.form.area3Id, 4);
      }
    } else {
      this.title = "创建自营店";
    }
  },
  methods: {
    /** 图片上传之前判断 */
    beforeAvatarUpload (file) {
      // console.log(file);
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 10
      if (!isJPG) {
        this.$message.error('上传图片只能是JPG、PNG格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过10MB!')
      }
      return isJPG && isLt2M
    },
    /** 自定义上传图片 */
    uploadImg (e, type) {
      uploadImg(e.file).then(res => {
        if (res.code == 200) {
          if (type == "storeBg") {
            this.$set(this.form, "storeBg", res.data);
          } else if (type == "storeLogo") {
            this.$set(this.form, "storeLogo", res.data);
          }
        } else {
          this.$msgError('上传图片失败,请重新上传!')
        }
      })
    },
    /** 图片上传之前判断 */
    beforeUploadImage (file) {
      console.log(file.content)
      compressImage(file).then(result => {
        console.log('压缩后的结果', result); // result即为压缩后的结果
        console.log('压缩前大小', file.file.size);
        console.log('压缩后大小', result.size);
        if (result.size > file.file.size) {
          console.log('上传原图');
          //压缩后比原来更大，则将原图上传
          // this._uploadFile(file.file, file.file.name);
        } else {
          //压缩后比原来小，上传压缩后的
          console.log('上传压缩图');
          // this._uploadFile(result, file.file.name)
          file = result
        }
      })
      const isJPG = file.type === "image/jpeg" || file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 10;
      if (!isJPG) {
        this.$message.error("上传图片只能是JPG、PNG格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过10MB!");
      }
      return isJPG && isLt2M;
    },
    uploadImgStoreBg (e) {
      this.uploadImg(e, "storeBg");
    },
    uploadImgStoreLogo (e) {
      this.uploadImg(e, "storeLogo");
    },
    /** 自定义上传图片 */
    // uploadImg (e, type) {
    //   this.disabledIdcard = true
    //   this.msg = this.$message({
    //     message: "正在上传,请稍等",
    //     type: "warning",
    //     duration: 0,
    //   });
    //   uploadImg(e.file).then((res) => {
    //     if (res.code == 200) {
    //       if (type == "storeBg") {
    //         this.$set(this.form, "storeBg", res.data);
    //       } else if (type == "storeLogo") {
    //         this.$set(this.form, "storeLogo", res.data);
    //       }
    //       this.msg.close();
    //       this.disabledIdcard = false
    //     } else {
    //       this.$msgError("上传图片失败,请重新上传!");
    //       this.msg.close();
    //       this.disabledIdcard = false
    //     }
    //   }).catch(err => {
    //     this.msg.close();
    //     this.disabledIdcard = false
    //   })
    // },
    // 筛选类别名称
    filterCateName (id) {
      this.form.storeCategoryName = this.cateList
        .filter((v) => v.id == id)
        .map((v) => v.title)
        .toString();
    },
    /** 获取区域列表 */
    getStoreAreaList (workId, level) {
      getStoreAreaList({ workId }).then((res) => {
        if (level == 1) {
          this.areaOption1 = res.data;
        } else if (level == 2) {
          this.areaOption2 = res.data;
        } else if (level == 3) {
          this.areaOption3 = res.data;
        } else if (level == 4) {
          this.areaOption4 = res.data;
        } else {
          this.areaOption1 = res.data;
        }
      });
    },
    /** 省选择 */
    handleChangeArea1 (value) {
      this.$set(this.form, "area1Id", value);
      this.$set(
        this.form,
        "area1Name",
        this.areaOption1
          .filter((v) => v.id == value)
          .map((v) => v.name)
          .toString()
      );
      this.resetAreaSelect(1);
      this.getStoreAreaList(value, 2);
    },
    /** 市选择 */
    handleChangeArea2 (value) {
      this.$set(this.form, "area2Id", value);
      this.$set(
        this.form,
        "area2Name",
        this.areaOption2
          .filter((v) => v.id == value)
          .map((v) => v.name)
          .toString()
      );
      this.resetAreaSelect(2);
      this.getStoreAreaList(value, 3);
    },
    /** 区选择 */
    handleChangeArea3 (value) {
      this.$set(this.form, "area3Id", value);
      this.$set(
        this.form,
        "area3Name",
        this.areaOption3
          .filter((v) => v.id == value)
          .map((v) => v.name)
          .toString()
      );
      // this.resetAreaSelect(3);
      // this.getStoreAreaList(value, 4);
    },
    /** 县/街道选择 */
    handleChangeArea4 (value) {
      this.$set(this.form, "area4Id", value);
      this.$set(
        this.form,
        "area4Name",
        this.areaOption4
          .filter((v) => v.id == value)
          .map((v) => v.name)
          .toString()
      );
    },
    /** 重置数据 */
    resetAreaSelect (level) {
      if (level == 1) {
        this.areaOption2 = [];
        this.form.area2Id = null;
        delete this.form.area2Name
        this.areaOption3 = [];
        this.form.area3Id = null;
        delete this.form.area2Name
      } else if (level == 2) {
        this.areaOption3 = [];
        this.form.area3Id = null;
        delete this.form.area3Name;
      }
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["storeForm"].validate((valid) => {
        if (valid) {
          addOwnStores(this.form).then((res) => {
            this.msgSuccess("新增成功");
            this.$emit("cancel");
            this.$emit("submit");
          });
        }
      });
    },
    // 取消按钮
    cancel () {
      this.$emit("cancel");
    },
    // 店铺分类选择
    classificationChange (e) {
      let arr = [];
      e.map((item) => {
        let obj = {};
        this.goodsCateList.map((v) => {
          if (item == v.id) {
            obj.goodsCategoryId = v.id;
            obj.goodsCategoryName = v.title;
            arr.push(obj);
          }
        });
      });
      this.form.goodsCateList = _.cloneDeep(arr);
    },
  },
};
</script>
<style scoped>
@media only screen and (max-width: 768px) {
  /* 在计算机屏幕中宽度小于等于960px会应用里面的样式 */
  .card-uploader >>> .el-upload {
    width: 250px !important;
  }
}
</style>
