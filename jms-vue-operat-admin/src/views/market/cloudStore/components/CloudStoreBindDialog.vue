<!--
 * @Author      : Lance Yi [QQ：342003386]
 * @Date        : 2020-08-29 08:55:14
 * @LastEditors : Please set LastEditors
 * @LastEditTime: 2021-04-20 21:47:25
 * @Description : 货架列表 - 添加、修改弹窗组件      
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
      ref="cloudModuleForm"
      :model="form"
      :rules="rules"
      label-width="100px"
      label-suffix=":"
    >
      <el-form-item
        label="选择店铺"
        prop="storeName"
      >
        <el-input
          v-model="form.storeName"
          
          @focus.stop="openStore = true"
        ></el-input>
      </el-form-item>
      <el-col :span="24">
        <el-form-item
          label="店铺类别"
          prop="storeCategoryId"
        >
          <el-select
            v-model="form.storeCategoryId"
            placeholder="请选店铺类别"
            clearable
            filterable
            class="w-100"
            :disabled="disabled"
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
          label="店东姓名"
          prop="storeOwnerName"
        >
          <el-input
            v-model="form.storeOwnerName"
            :disabled="disabled"
            placeholder="请输入店东姓名"
          ></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item
          label="商户手机号"
          prop="storePhone"
        >
          <el-input
            v-model="form.storePhone"
            :disabled="disabled"
            placeholder="请输入商户手机号"
          ></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item
          label="店铺区域"
        >
          <el-row>
            <el-col :span="6">
              <el-select
                v-model="form.area1Id"
                placeholder="请选择省"
                class="w-95"
                :disabled="disabled"
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
            <el-col :span="6">
              <el-select
                v-model="form.area2Id"
                placeholder="请选择市"
                class="w-95"
                :disabled="disabled"
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
            <el-col :span="6">
              <el-select
                v-model="form.area3Id"
                placeholder="请选择区"
                class="w-95"
                :disabled="disabled"
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
            <!-- <el-col :span="6">
              <el-select
                v-model="form.area4Id"
                placeholder="请选择县/街道"
                class="w-95"
                :disabled="disabled"
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

      <el-col :span="24">
        <el-form-item
          label="详情地址"
          prop="storeAddress"
        >
          <el-input
            :disabled="disabled"
            v-model="form.storeAddress"
            placeholder="请输入店铺详情地址(精确到门牌号)"
          ></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="账号状态">
        <el-radio v-model="form.status" :label="1" :disabled="disabled">启用</el-radio>
        <el-radio v-model="form.status" :label="0" :disabled="disabled">禁用</el-radio>
      </el-form-item>
      </el-col>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm" size="mini"
        >确 定</el-button
      >
      <el-button @click="cancel" size="mini">取 消</el-button>
    </div>
    <!-- 选择活动店铺弹窗 -->
    <StoreSelectDialog
      v-if="openStore"
      :key="'stroeSelect_' + tempRowIndex"
      :open="openStore"
      type="cloudStore"
      :multiple="false"
      @cancel="
        openStore = false;
        tempRowIndex = null;
      "
      @submit="handleStoreSelect"
    />
  </el-dialog>
</template>
<script>
import { addBindStore, updateBindStore } from "@/api/goods";
import { getStoreAreaList, getStoreDetailInfo, getStoreCategeAllList } from "@/api/stores";
// import StoreSelectDialog from "../../market/components/StoreSelectDialog";
import StoreSelectDialog from "../../components/StoreSelectDialog.vue";
export default {
  name: "CloudStoreBindDialog",
  components: {
    StoreSelectDialog,
  },
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
      default: "780px",
    },
  },
  data() {
    return {
      // 弹窗标题
      title: "",
      // 表单校验
      openStore: false, // 是否显示店铺弹框
      cateList: [],
      // 省
      areaOption1: [],
      // 市
      areaOption2: [],
      // 区
      areaOption3: [],
      // 县/街道
      areaOption4: [],
      tempRowIndex: false,
      disabled: false,
      rules: {
        storeName: [
          { required: true, message: "请选择店铺", trigger: "change" },
        ],
        // storeCategoryId: [
        //   { required: true, message: "请选择店铺类别", trigger: "blur" },
        // ],
        // storeOwnerName: [
        //   { required: true, message: "店东姓名不能为空", trigger: "blur" },
        // ],
        // storePhone: [
        //   { required: true, message: "商户手机号不能为空", trigger: "blur" },
        // ],
        // storeAddress: [
        //   { required: true, message: "店铺详情地址不能为空", trigger: "blur" },
        // ],
      },
    };
  },

  created() {
    // 获取店铺分类
    getStoreCategeAllList().then((res) => {
      this.cateList = res.data;
    });
    if (this.isEdit) {
      this.disabled = true
      this.title = "货架信息 - 修改";
    } else {
      this.disabled = true
      this.title = "货架信息 - 添加";
    }
    // 获取店铺地址
    this.getStoreAreaList();
    if (this.form.area1Id) {
      this.getStoreAreaList(this.form.area1Id, 2);
    }
    if (this.form.area2Id) {
      this.getStoreAreaList(this.form.area2Id, 3);
    }
    if (this.form.area3Id) {
      this.getStoreAreaList(this.form.area3Id, 4);
    }
  },
  methods: {
    /** 店铺选择 */
    handleStoreSelect(row) {
      getStoreDetailInfo({storeId: row.id}).then(res => {
        // this.form = _.assign({},res.data)
        this.form.area1Id = res.data.area1Id
        this.form.area1Name = res.data.area1Name
        this.form.area2Id = res.data.area2Id
        this.form.area2Name = res.data.area2Name
        this.form.area3Id = res.data.area3Id
        this.form.area3Name = res.data.area3Name
        this.form.area4Id = res.data.area4Id
        this.form.area4Name = res.data.area4Name
        this.form.latitude = res.data.latitude
        this.form.longitude = res.data.longitude
        this.form.storePhone = res.data.phone
        this.form.storeCategoryId = res.data.storeCategoryId
        this.form.storeCategoryName = res.data.storeCategoryName
        this.form.storeId = res.data.storeId
        // this.form.storeName = res.data.storeName
        this.$set(this.form, "storeName", res.data.storeName);
        this.form.storeOwnerName = res.data.storeOwnerName
        this.form.storeAddress = res.data.storeAddress
        this.form.storesImg = res.data.storesImg
        this.filterCateName(this.form.storeCategoryId)
        if (this.form.area1Id) {
          this.getStoreAreaList(this.form.area1Id, 2);
        }
        if (this.form.area2Id) {
          this.getStoreAreaList(this.form.area2Id, 3);
        }
        if (this.form.area3Id) {
          this.getStoreAreaList(this.form.area3Id, 4);
        } 
        this.openStore = false;
        this.$nextTick(()=>this.$refs["cloudModuleForm"].clearValidate())
      })
    },
    
    // 筛选类别名称
    filterCateName(id) {
      this.form.storeCategoryName = this.cateList
        .filter((v) => v.id == id)
        .map((v) => v.title)
        .toString();
    },
    /** 获取区域列表 */
    getStoreAreaList(workId, level) {
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
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["cloudModuleForm"].validate((valid) => {
        if (valid) {
          let arry = []
          const _params = _.assign({}, this.form);
          arry.push(_params)
          if (_params.id != undefined) {
            updateBindStore(_params).then((response) => {
              this.msgSuccess("修改成功");
              this.$emit("cancel");
              this.$emit("submit");
            });
          } else {
            addBindStore(arry).then((response) => {
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
      this.$refs["cloudModuleForm"].clearValidate();
      this.$emit("cancel");
    },
  },
};
</script>