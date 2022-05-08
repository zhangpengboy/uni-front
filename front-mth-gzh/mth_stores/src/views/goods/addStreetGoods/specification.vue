<!-- 套餐  -->
<template>
  <div class="specification">
    <van-form validate-first
              class="bg-white py-2"
              :ref="'goodsSpecificationForm_' + specificationKey">
      <van-row type="flex">
        <van-col span="22">
          <van-field v-model="specification.name"
                     clickable
                     placeholder="请输入套餐名称"
                     class="cell" />
        </van-col>
        <van-col span="2">
          <van-icon name="add-o"
                    v-show="specification.addIconShow"
                    size="28"
                    @click="addSpecification" />
          <van-icon name="close"
                    v-show="specification.delIconShow"
                    size="28"
                    @click="delSpecification" />
        </van-col>
      </van-row>
      <specification-item v-for="(item, index) in itemList"
                          :specificationItem="item"
                          :key="index"
                          @addSpecificationItem="addSpecificationItem"
                          @delSpecificationItem="delSpecificationItem"
                          @specificationItemChange="specificationItemChange"
                          :specificationItemKey="index"
                          :ref="'goodsSpecificationItemForm_' + index" />
    </van-form>

  </div>
</template>

<script>
import specificationItem from './specificationItem.vue'
export default {
  components: {
    specificationItem
  },
  props: {
    specification: {
      type: Object,
      default: function () {
        return {}
      }
    },
    specificationKey: Number
  },
  data () {
    return {
      itemList: [{
        detail: null,
        num: null,
        price: null,
        addIconShow: true,
        delIconShow: false
      }],
      delItemList: []
    }
  },
  // watch: {
  //   itemList (newVal, oldVal) {
  //     // do something
  //     if(newVal.length > 1) {

  //     }
  //   }
  // },
  created () {
    this.itemList = this.specification.item
  },
  methods: {
    addSpecificationItem () {
      const _data = _.assign(
        {},
        {
          detail: null,
          num: null,
          price: null,
          addIconShow: false,
          delIconShow: true
        }
      )
      this.itemList.push(_data)
      this.$set(this.specification, 'item', this.itemList)
    },
    /** 删除明细 */
    delSpecificationItem (index) {
      const _list = _.cloneDeep(this.itemList)
      _.remove(_list, (v, i) => {
        if (index === i && v.id) {
          this.delItemList.push(v)
        }
        return index === i
      })
      this.itemList = _list
      this.$set(this.specification, 'item', this.itemList)
    },
    specificationItemChange () {
      // console.log(this.itemList)
      this.$set(this.specification, 'item', this.itemList)
    },
    addSpecification () {
      if (!this.specification.name) return this.$toast('套餐名称不能为空')
      this.$set(this.specification, 'item', this.itemList)
      if (!this.itemList[0].detail) return this.$toast('套餐明细不能为空!')
      if (!this.itemList[0].num) return this.$toast('套餐数量不能为空!')
      if (!this.itemList[0].price) return this.$toast('套餐价格不能为空!')
      this.$emit('addSpecification')
    },
    delSpecification () {
      this.$emit('delSpecification', this.specificationKey)
    }

  }
}
</script>

<style lang="scss" scoped>
.specification {
  .van-row--flex {
    align-items: center;
  }
  .van-icon {
    padding-left: 5px;
  }
  .cell {
    border: 1px solid #f2f2f2;
    border-radius: 8px;
  }
}
</style>
