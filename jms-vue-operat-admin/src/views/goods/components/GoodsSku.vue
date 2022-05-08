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
        @addSku="addSku"
        @delSku="delSku"
        :skuKey="index"
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
            @click="handlerCheckGoods(2)"
            v-loading.fullscreen.lock="fullscreenLoading"
            v-if="goodsBase.status == 0"
            >审核，通过<i class="el-icon-check el-icon--right"></i
          ></el-button>
          <el-button
            type="danger"
            size="default"
            block
            @click="handlerCheckGoods(5)"
            v-loading.fullscreen.lock="fullscreenLoading"
            v-if="goodsBase.status == 0"
            >审核，拒绝<i class="el-icon-close el-icon--right"></i
          ></el-button>
          <el-button
            type="success"
            size="default"
            block
            @click="backGoodsList"
            v-loading.fullscreen.lock="fullscreenLoading"
            v-else
            >{{ isEdit ? '修改' : '返回，商品列表'
            }}<i class="el-icon-arrow-right el-icon--right"></i
          ></el-button>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>
<script>
import SkuFormItem from './SkuFormItem'
import { uploadImg } from '@/api/upload'
import { batchOtGoodsSku, updateGoods } from '@/api/goods'
export default {
  name: 'GoodsInfoForm',
  props: {
    // 是否修改
    isEdit: {
      type: Boolean,
      default: false
    },
    // 商品SKU数组
    value: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 商品基础信息
    goodsBase: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  components: { SkuFormItem },
  data () {
    return {
      // 基础商品表单
      list: _.cloneDeep(this.value),
      // 加载层
      fullscreenLoading: false,
      // 删除skuList
      delList: []
    }
  },
  watch: {
    // 监听异步获取表单信息赋值
    value: function (nVal, oVal) {
      this.list = nVal
    }
  },
  created () {
    // 修改
    if (this.isEdit) {
    }
  },
  methods: {
    /** 审核通过：2 审核拒接：5 */
    handlerCheckGoods (status) {
      let _isFlag = true
      _.forIn(this.$refs, (v, i) => {
        v[0].$refs[i].validate(valid => {
          if (!valid) {
            _isFlag = valid
          }
        })
      })
      if (!_isFlag) {
        this.msgError('套餐信息填写不完整,请检查')
        return false
      }
      let _params = _.assign({}, this.goodsBase)
      _params.status = status
      updateGoods(_params).then(res => {
        this.submitNextForm()
      })
    },
    /** 下一步 */
    submitNextForm () {
      let _data = {
        // 新增skuList
        addList: [],
        // 修改skuList
        updateList: [],
        // 删除skuList
        delList: _.cloneDeep(this.delList)
      }
      _.each(this.list, v => {
        v.checked = false
        v.incomeBsCode = 'BS_C001'
        v.goodsId = this.goodsBase.id
        v.goodsName = this.goodsBase.goodsName
        if (v.id == undefined) {
          // 新增
          _data.addList.push(v)
        } else {
          // 修改
          _data.updateList.push(v)
        }
      })
      this.fullscreenLoading = true
      // 更新sku 结算价信息
      batchOtGoodsSku(_data).then(res => {
        this.fullscreenLoading = false
        this.msgSuccess(res.message)
        this.$emit('reset')
        this.$store.dispatch('tagsView/delView', this.$route)
        this.$router.push({ name: 'GoodsList' })
      })
      setTimeout(() => {
        this.fullscreenLoading = false
      }, 2000)
    },
    /** 返回列表 */
    backGoodsList () {
      if (!this.isEdit) {
        this.$store.dispatch('tagsView/delView', this.$route)
        this.$router.push({ name: 'GoodsList' })
      } else {
        // 修改
        this.submitNextForm()
      }
    },
    /** 上一步 */
    backPrefixForm () {
      this.$emit('steps', 'GOODS_INFO')
    },
    /** 添加套餐 */
    addSku () {
      const _data = _.assign(
        {},
        {
          id: undefined,
          goodsId: this.goodsBase.id,
          goodsName: this.goodsBase.goodsName,
          skuName: undefined,
          amount: 1,
          checked: false,
          salePrice: undefined,
          settlePrice: 0,
          integral: 0,
          integralType: 0,
          skuImg:
            'https://app.static.mall9.co/jms/mall/images/273d17aa45dcf3a22dde36977ef335d0-t7dq6gyq7q.jpg'
        }
      )
      this.list.push(_data)
    },
    /** 删除套餐 */
    delSku (index) {
      const _list = _.cloneDeep(this.list)
      _.remove(_list, (v, i) => {
        if (index == i && v.id) {
          this.delList.push(v)
        }
        return index == i
      })
      this.list = _list
    }
  }
}
</script>
<style lang="scss" scoped></style>
