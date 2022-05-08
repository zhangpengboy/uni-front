<!--
 * @Author       : Lance Yi <latticeyi@gmail.com>
 * @Date         : 2020-11-03 14:20:04
 * @Description  : 店铺-添加、修改弹窗组件
-->
<template>
  <!-- <el-dialog
    :title="title"
    :visible="storeOpen"
    :width="width"
    append-to-body
    v-el-dialog-drag
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="cancel"
  > -->
  <div class="mt20 m20 mr20">
    <el-form ref="storeForm" :model="form" label-width="100px" label-suffix=":">
      <el-row :gutter="20">
        <el-col :span="24" :xs="24" :sm="12" :md="12" :lg="12" :xl="24">
          <el-form-item
            label="店铺名称"
            prop="storeName"
            :rules="[
              { required: true, message: '请输入店铺名称', trigger: 'blur' },
            ]"
          >
            <el-input v-model="form.storeName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24" :xs="24" :sm="12" :md="12" :lg="12" :xl="24">
          <el-form-item
            label="店东姓名"
            prop="storeOwnerName"
            :rules="[
              { required: true, message: '请输入店东姓名', trigger: 'blur' },
            ]"
          >
            <el-input v-model="form.storeOwnerName" ></el-input>
          </el-form-item>
        </el-col>
        <el-col
          :xs="24"
          :sm="12"
          
        >
          <el-form-item
            label="店铺角色"
            prop="storeRoleCode"
            :rules="[
              { required: true, message: '请选择店铺角色', trigger: 'blur' },
            ]"
          >
            <el-select
              v-model="form.storeRoleCode"
              placeholder="请选店铺角色"
              clearable
              filterable
              class="w-100"
               
              @change="filterRoleName"
            >
              <el-option
                v-for="(o, i) in roleList"
                :key="i"
                :label="o.name"
                :value="o.code"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <!-- <el-col
          :xs="24"
          :sm="12"
          :md="6"
          :lg="6"
          :xl="6"
          v-if="form.storeRoleCode == 3 || form.storeRoleCode == 5"
        >
          <el-form-item
            label="数字货架"
          >
            <el-radio-group v-model="form.isCloudStore" >
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col> -->
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item
            label="店铺类别"
            prop="storeCategoryId"
            :rules="[
              { required: true, message: '请选择店铺类别', trigger: 'blur' },
            ]"
          >
            <el-select
              v-model="form.storeCategoryId"
              placeholder="请选店铺类别"
              clearable
              filterable
              class="w-100"
               
              @change="filterCateName"
            >
              <el-option
                v-for="(o, i) in cateList"
                :key="i"
                :label="o.title"
                :value="o.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item
            label="店铺区域"
            prop="area1Id"
            :rules="[
              {
                required: true,
                message: '请选择店铺所在位置',
                trigger: 'blur',
              },
            ]"
          >
            <el-row>
              <el-col
                :span="8"
                
              >
                <el-select
                  v-model="form.area1Id"
                  placeholder="请选择省"
                  class="w-95"
                   
                  @change="handleChangeArea1"
                >
                  <el-option
                    v-for="(v, i) in areaOption1"
                    :key="i"
                    :label="v.name"
                    :value="v.id"
                  >
                  </el-option>
                </el-select>
              </el-col>
              <el-col
                :span="8"
                
              >
                <el-select
                  v-model="form.area2Id"
                  placeholder="请选择市"
                  class="w-95"
                   
                  @change="handleChangeArea2"
                >
                  <el-option
                    v-for="(v, i) in areaOption2"
                    :key="i"
                    :label="v.name"
                    :value="v.id"
                  >
                  </el-option>
                </el-select>
              </el-col>
              <el-col
                :span="8"
              >
                <el-select
                  v-model="form.area3Id"
                  placeholder="请选择区"
                  class="w-95"
                   
                  @change="handleChangeArea3"
                >
                  <el-option
                    v-for="(v, i) in areaOption3"
                    :key="i"
                    :label="v.name"
                    :value="v.id"
                  >
                  </el-option>
                </el-select>
              </el-col>
              <!-- <el-col
                style="margin-bottom: 10px"
                :span="6"
                :xs="24"
                :sm="6"
                :md="6"
                :lg="6"
                :xl="6"
              >
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
        </el-col>

        <el-col :span="24" :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
          <el-form-item
            label="详情地址"
            prop="storeAddress"
            :rules="[
              {
                required: true,
                message: '请输入店铺详情地址',
                trigger: 'blur',
              },
            ]"
          >
            <el-input
             
              v-model="form.storeAddress"
              placeholder="请输入店铺详情地址(精确到门牌号)"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24" :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
          <el-form-item label="经营范围" prop="storeBusiness">
            <el-input type="textarea" v-model="form.storeBusiness" ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" :xs="20" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item
            label="身份证正面"
            prop="idcard1"
            required
            :rules="[{ required: true, message: '身份证正面不能为空' }]"
          >
            <el-upload
              v-if="isEdits"
              class="card-uploader"
              action="#"
              :show-file-list="false"
              :before-upload="beforeUploadImage"
              :http-request="uploadImgCard1"
            >
              <img
                style="width: 100%"
                v-if="form.idcard1"
                :src="form.idcard1"
                class="image"
              />
              <i v-else class="el-icon-plus card-uploader-icon"></i>
              <div slot="tip" class="el-upload__tip">
                只能上传jpg/png文件，且不超过1M
              </div>
            </el-upload>
            <el-image 
              v-if="!isEdits"
                class="image"
                style="width: 400px; height: 200px;"
                :src="form.idcard1" 
                :preview-src-list="[form.idcard1]">
            </el-image>
          </el-form-item>
        </el-col>
        <el-col :span="12" :xs="20" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item
            label="身份证反面"
            prop="idcard2"
            required
            :rules="[{ required: true, message: '身份证反面不能为空' }]"
          >
            <el-upload
              v-if="isEdits"
              class="card-uploader"
              action="#"
              :show-file-list="false"
              :before-upload="beforeUploadImage"
              :http-request="uploadImgCard2"
            >
              <img
                style="width: 100%"
                v-if="form.idcard2"
                :src="form.idcard2"
                class="image"
              />
              <i v-else class="el-icon-plus card-uploader-icon"></i>
              <div slot="tip" class="el-upload__tip">
                只能上传jpg/png文件，且不超过1M
              </div>
            </el-upload>
            <el-image
              v-if="!isEdits"
                class="image"
                style="width: 400px; height: 200px;"
                :src="form.idcard2" 
                :preview-src-list="[form.idcard2]">
            </el-image>
          </el-form-item>
        </el-col>
        <el-col :span="12" :xs="20" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item
            label="营业执照"
            prop="licence"
            required
            :rules="[{ required: true, message: '营业执照不能为空' }]"
          >
            <el-upload
              v-if="isEdits"
              class="avatar-uploader"
              action="#"
              :show-file-list="false"
              :before-upload="beforeUploadImage"
              :http-request="uploadImgLicence"
            >
              <img v-if="form.licence" :src="form.licence" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              <div slot="tip" class="el-upload__tip">
                只能上传jpg/png文件，且不超过1M
              </div>
            </el-upload>
              <el-image
              v-if="!isEdits"
                class="avatar"
                :src="form.licence" 
                :preview-src-list="[form.licence]">
            </el-image>
          </el-form-item>
        </el-col>
        <el-col v-if="form.isCloudStore == '1'" :span="12" :xs="20" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item
            label="店铺门头照"
            prop="storesImg"
            required
            :rules="[{ required: true, message: '店铺门头照不能为空' }]"
          >
            <el-upload
              v-if="isEdits"
              class="avatar-uploader"
              action="#"
              :show-file-list="false"
              :before-upload="beforeUploadImage"
              :http-request="uploadImgStoresImg"
            >
              <img v-if="form.storesImg" :src="form.storesImg" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              <div slot="tip" class="el-upload__tip">
                只能上传jpg/png文件，且不超过1M
              </div>
            </el-upload>
            <el-image
                v-if="!isEdits"
                class="avatar"
                :src="form.storesImg" 
                :preview-src-list="[form.storesImg]">
            </el-image>
          </el-form-item>
        </el-col>
        <el-col
          :span="12"
          :xs="20"
          :sm="12"
          :md="12"
          :lg="12"
          :xl="12"
        >
          <el-form-item
            label="店铺背景图"
            prop="storeBg"
            required
            :rules="[{ required: true, message: '店铺详情背景图不能为空' }]"
          >
            <el-upload
              class="avatar-uploader"
              action="#"
              :show-file-list="false"
              :before-upload="beforeUploadImage"
              :http-request="uploadImgStoreBg"
              :disabled="disabledIdcard"
            >
              <img v-if="form.storeBg" :src="form.storeBg" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              <div slot="tip" class="el-upload__tip">
                只能上传jpg/png文件，且不超过10M
              </div>
            </el-upload>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer" v-if="isEdits">
      <el-button type="primary" @click="submitForm" size="mini"
        >修 改</el-button
      >
      <!-- <el-button @click="cancel" size="mini">取 消</el-button> -->
    </div>
    <!-- 审核弹出框 -->
    <el-dialog
      title="审核店铺"
      :visible.sync="open"
      width="70%"
      append-to-body
      v-el-dialog-drag
    >
      <el-form :model="storeforms" label-width="100px">
        <el-form-item label="商品分类">
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
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="openclose">取 消</el-button>
        <el-button type="danger" @click="handleCheckError">拒绝</el-button>
        <el-button type="success" @click="handleCheckSuccess">通过</el-button>
      </div>
    </el-dialog>
  </div>
  <!-- </el-dialog> -->
</template>
<script>
import {
  getStoreCategeAllList,
  storeRoleList,
  getStoreAreaList,
  addStoreInfo,
  updateStoreInfo,
  updateStoreInfoStatus,
  bindStoreGoodsCategory,
  getStoreDetailInfo
} from "@/api/stores";
import { uploadImg } from "@/api/upload";
import { getGoodsCateList } from "@/api/goods";
export default {
  name: "StoreDialog",
  props: {
    // 是否打开
    storeOpen: {
      type: Boolean,
      default: false,
    },
    // 绑定的表单对象
    // form: {
    //   type: Object,
    //   default: function () {
    //     return {};
    //   },
    // },
    // 是否是修改
    isEdit: {
      type: Boolean,
      default: false,
    },
    // 弹窗宽度
    width: {
      type: String,
      default: "1200px",
    },
  },
  data() {
    return {
      open: false,
      storeforms: {
        storeCategoryId: "",
        storeCategoryName: "",
      },
      goodsCateList: [],
      classificationList: [],
      goodsclassificationList: [],
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
      form: {},
      isEdits: false,
      storeId: '',
    };
  },
  created() {
      this.storeId = this.$route.query.id
      if (this.$route.query.isEdit == 1) {
        this.isEdits = true
      } else {
        this.isEdits = false
      }
      this.getStoreDetailInfo()
    /** 获取商品分类列表 */
    getGoodsCateList({ workId: 0 }).then((res) => {
      this.goodsCateList = res.data;
    });
    // 获取店铺分类
    getStoreCategeAllList().then((res) => {
      this.cateList = res.data;
    });
    // 获取店铺角色
    storeRoleList().then((res) => {
      this.roleList = res.data;
    });
    // 获取店铺地址
    this.getStoreAreaList();
    this.title = "店铺 - 审核";
  },
  methods: {
      getStoreDetailInfo() {
        //   console.log(this.$route.params.id)
          
        getStoreDetailInfo({ storeId: this.storeId }).then((res) => {
            if (res.code == 200) {
            //   this.storeOpen = true;
              this.form = _.assign({}, res.data);
              // this.isEdit = true;
              if (this.form.area1Id) {
                this.getStoreAreaList(this.form.area1Id, 2);
              }
              if (this.form.area2Id) {
                this.getStoreAreaList(this.form.area2Id, 3);
              }
              if (this.form.area3Id) {
                this.getStoreAreaList(this.form.area3Id, 4);
              }
            }
          });
          
      },
    // 筛选类别名称
    filterCateName(id) {
      this.form.storeCategoryName = this.cateList
        .filter((v) => v.id == id)
        .map((v) => v.title)
        .toString();
    },
    // 筛选角色名称
    filterRoleName(code) {
      this.form.storeRoleName = this.roleList
        .filter((v) => v.code == code)
        .map((v) => v.name)
        .toString();
    },
    /** 获取区域列表 */
    getStoreAreaList(workId, level) {
      getStoreAreaList({ workId }).then((res) => {
        console.log(res)
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
    handleChangeArea1(value) {
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
    handleChangeArea2(value) {
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
    handleChangeArea3(value) {
      this.$set(this.form, "area3Id", value);
      this.$set(
        this.form,
        "area3Name",
        this.areaOption3
          .filter((v) => v.id == value)
          .map((v) => v.name)
          .toString()
      );
      this.resetAreaSelect(3);
      this.getStoreAreaList(value, 4);
    },
    /** 县/街道选择 */
    handleChangeArea4(value) {
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
    resetAreaSelect(level) {
      if (level == 1) {
        this.areaOption2 = [];
        this.form.area2Id = null;
        this.areaOption3 = [];
        this.form.area3Id = null;
        this.areaOption4 = [];
        this.form.area4Id = null;
      } else if (level == 2) {
        this.areaOption3 = [];
        this.form.area3Id = null;
        this.areaOption4 = [];
        this.form.area4Id = null;
      } else if (level == 3) {
        this.areaOption4 = [];
        this.form.area4Id = null;
      }
    },
    /** 图片上传之前判断 */
    beforeUploadImage(file) {
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
    uploadImgCard1(e) {
      this.uploadImg(e, "idcard1");
    },
    uploadImgCard2(e) {
      this.uploadImg(e, "idcard2");
    },
    uploadImgLicence(e) {
      this.uploadImg(e, "licence");
    },
    uploadImgStoresImg(e) {
      this.uploadImg(e, "storesImg");
    },
    uploadImgStoreBg(e) {
      this.uploadImg(e, "storeBg");
    },
    /** 自定义上传图片 */
    uploadImg(e, type) {
      uploadImg(e.file).then((res) => {
        if (res.code == 200) {
          if (type == "idcard1") {
            this.$set(this.form, "idcard1", res.data);
          } else if (type == "idcard2") {
            this.$set(this.form, "idcard2", res.data);
          } else if (type == "licence") {
            this.$set(this.form, "licence", res.data);
          } else if (type == "storesImg") {
            this.$set(this.form, "storesImg", res.data);
          } else if (type == "storeBg") {
            this.$set(this.form, "storeBg", res.data);
          }
        } else {
          this.$msgError("上传图片失败,请重新上传!");
        }
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      console.log(999, this.form);
      console.log(999, this.storeforms);

      this.$refs["storeForm"].validate((valid) => {
        if (valid) {
          if (this.form.storeId != undefined) {
            updateStoreInfo(this.form).then((response) => {
              if (response.code == 200) {
                this.storeforms.storeCategoryId = this.form.storeCategoryId;
                this.storeforms.storeCategoryName = this.form.storeCategoryName;
                this.storeforms.storeName = this.form.storeName;
                this.storeforms.storeId = this.form.storeId;
                // this.open = true;
                this.msgSuccess("修改成功");
                //   this.$emit("cancel");
                //   this.$emit("submit");
              }
            });
          }
        }
      });
    },
    // 取消按钮
    cancel() {
      this.$emit("cancel");
    },
    // 店铺分类选择
    classificationChange(e) {
      console.log(987, e);
      console.log(987, this.classificationList);
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
      console.log(789, arr);
      this.goodsclassificationList = _.cloneDeep(arr);
    },
    // 关闭审核弹框
    openclose() {
      this.open = false;
      this.goodsclassificationList = [];
      this.classificationList = [];
    },
    /** 审核拒绝按钮操作 */
    handleCheckError() {
      //   const storeId = this.ids.map((item) => item.id);
      const storeId = this.form.storeId;
      this.updateStoreInfoStatus(storeId, 2);
    },
    /** 审核通过按钮操作 */
    handleCheckSuccess() {
      // if (!this.storeforms.goodsCategoryId) {
      //   return this.msgError("请选择店铺经营的商品分类");
      // }
      // const goodsCategoryName = this.goodsCateList
      //   .filter((v) => v.id == this.storeforms.goodsCategoryId)
      //   .map((v) => v.title);
      // const _params = _.assign(this.storeforms, {
      //   goodsCategoryName: goodsCategoryName.toString(),
      // });
      if (this.goodsclassificationList.length == 0) {
        return this.msgError("请选择店铺经营的商品分类");
      }
      this.storeforms.goodsCateList = this.goodsclassificationList;
      bindStoreGoodsCategory(this.storeforms).then((res) => {
        const storeId = this.form.storeId;
        this.updateStoreInfoStatus(storeId, 0);
      });
    },
    /** 修改状态 */
    updateStoreInfoStatus(storeId, status) {
      updateStoreInfoStatus({
        storeId: storeId,
        status: status,
      }).then((res) => {
        this.open = false;
        this.$emit("cancel");
        this.$emit("submit");
        this.msgSuccess("操作成功");
      });
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