<!--
 * @Author       : Lance Yi <latticeyi@gmail.com>
 * @Date         : 2020-11-05 16:16:26
 * @Description  : 商品详情信息
-->
<template>
  <div class="goods">
    <el-card class="box-card">
      <div slot="header">
        <span>商品SKU</span>
      </div>

      <!-- SKU 套餐信息 -->
      <SkuFormItem
        v-for="(item, index) in list"
        :skuItem="item"
        :key="index"
        :look="look"
        @addSku="addSku"
        @delSku="delSku"
        @skuChange="skuChange"
        :skuKey="index"
        :disabled="item.disabled"
        :ref="'goodsSkuForm_' + index"
      ></SkuFormItem>

      <el-row :gutter="20">
        <el-col :span="22" :offset="2">
          <el-button
            type="info"
            size="default"
            block
            @click="backPrefixForm"
            icon="el-icon-arrow-left el-icon--left"
            >返回，上一步</el-button
          >
          <el-button
            type="primary"
            size="default"
            block
            v-if="look"
            @click="lookNextForm"
            v-loading.fullscreen.lock="fullscreenLoading"
            >关闭, 返回列表<i class="el-icon-arrow-right el-icon--right"></i
          ></el-button>
          <el-button
            type="primary"
            size="default"
            block
            v-if="!look"
            @click="submitNextForm"
            v-loading.fullscreen.lock="fullscreenLoading"
            >保存，提交审核<i class="el-icon-arrow-right el-icon--right"></i
          ></el-button>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>
<script>
import SkuFormItem from "./SkuFormItem";
import { uploadImg } from "@/api/upload";
import { batchOtGoodsSku } from "@/api/goods";
export default {
  name: "GoodsInfoForm",
  props: {
    // 是否修改
    isEdit: {
      type: Boolean,
      default: false,
    },
    look: {
      type: Boolean,
      default: false,
    },
    // 商品SKU数组
    value: {
      type: Array,
      default: () => {
        return [];
      },
    },
    // 商品基础信息
    goodsBase: {
      type: Object,
      default: () => {
        return {
          skuIndex: ''
        };
      },
    },
  },
  components: { SkuFormItem },
  data() {
    return {
      // 基础商品表单
      list: _.cloneDeep(this.value),
      // 加载层
      fullscreenLoading: false,
      // 删除skuList
      delList: [],
    };
  },
  watch: {
    // 监听异步获取表单信息赋值
    value: function (nVal, oVal) {
      this.list = nVal;
    },
  },
  created() {
    // 修改
    if (this.isEdit) {
    }
  },
  methods: {
    /** 下一步 */
    submitNextForm() {
      let _data = {
        // 新增skuList
        addList: [],
        // 修改skuList
        updateList: [],
        // 删除skuList
        delList: _.cloneDeep(this.delList),
      };
      _.each(this.list, (v) => {
        v.goodsId = this.goodsBase.id;
        v.goodsName = this.goodsBase.goodsName;
        if (v.id == undefined) {
          // 新增
          _data.addList.push(v);
        } else {
          // 修改
          _data.updateList.push(v);
        }
      });
      let _isFlag = true;
      console.log(7878, this.$refs);
      _.forIn(this.$refs, (v, i) => {
        if (v.length != 0) {
          v[0].$refs[i].validate((valid) => {
            if (!valid) {
              _isFlag = valid;
            }
          });
        }
      });
      if (!_isFlag) {
        this.msgError("套餐信息填写不完整,请检查");
        return false;
      }
      let num = 0
      let addListNum =  0
      let allList = [..._data.addList, ..._data.updateList]
      // if(_data.addList.length == 0) {
        addListNum =  allList.length
        allList.map(item => {
        if(!item.checked) {
          num += 1
        }
      })
      // } else {
      //   addListNum =  _data.addList.length
      //   _data.addList.map(item => {
      //   if(!item.checked) {
      //     num += 1
      //   }
      // })
      // }
      if(addListNum == num ) {
        this.msgError("请选择sku套餐");
        return
      }
      this.fullscreenLoading = true;
      batchOtGoodsSku(_data).then((res) => {
        this.fullscreenLoading = false;
        this.msgSuccess(res.message);
        this.$emit("reset");
        this.$store.dispatch("tagsView/delView", this.$route);
        this.$router.push({ name: "GoodsIndex" });
      });
      setTimeout(() => {
        this.fullscreenLoading = false;
      }, 2000);
    },
    // 查看 下一步
    lookNextForm() {
      this.$router.push({ name: "GoodsIndex" });
    },
    /** 上一步 */
    backPrefixForm() {
      this.$emit("steps", "GOODS_INFO");
    },
    /** 添加套餐 */
    addSku() {
      const _data = _.assign(
        {},
        {
          id: undefined,
          goodsId: this.goodsBase.id,
          goodsName: this.goodsBase.goodsName,
          skuName: undefined,
          checked: false,
          disabled: false,
          amount: 1,
          salePrice: undefined,
          integral: 0,
          integralType: 0,
          skuImg: "",
        }
      );
      this.list.push(_data);
    },
    skuChange(i,state) {
      console.log('子传值',i,state);
      this.skuIndex = i
      const _list = _.cloneDeep(this.list);
      // 下标,状态
      _list.map((item,index) => {
        if(state) {
          if(i == index) {
            item.checked = true
            item.disabled = false
          } else {
            item.checked = false
            item.disabled = true
          }
        } else {
          item.checked = false
          item.disabled = false
        }
      })
      this.list = _list;
      console.log(this.list);
    },
    /** 删除套餐 */
    delSku(index) {
      const _list = _.cloneDeep(this.list);
      _.remove(_list, (v, i) => {
        if (index == i && v.id) {
          this.delList.push(v);
        }
        this.skuIndex = i
        return index == i;
      });
      _list.map((item,index) => {
        if(this.skuIndex - 1 == index) {
          item.checked = false
        }
          item.disabled = false
      })
      this.list = _list;
    },
  },
};
</script>
<style lang="scss" scoped>
</style>