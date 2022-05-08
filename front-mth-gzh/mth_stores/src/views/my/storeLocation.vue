<!-- 店铺地址 -->
<template>
  <div class=''>
    <van-form validate-first>
      <van-field input-align="right"
                 readonly
                 clickable
                 v-model="storeAddre"
                 right-icon="arrow"
                 placeholder="请选择地区"
                 label="所在地区"
                 @click="showArea = true">
      </van-field>
      <van-field v-model="form.storeAddress"
                 input-align="right"
                 maxlength="100"
                 label="详细地址"
                 placeholder="街道、楼道号等">
      </van-field>
    </van-form>
    <van-button color="linear-gradient(180deg, #F1722C 0%, #EB6133 100%)"
                block
                size="small"
                round
                @click="save"
                class="mt-8 but footer">保存</van-button>
    <!-- 地址 -->
    <van-popup v-model="showArea"
               position="bottom">
      <van-cascader v-model="cascaderValue"
                    title="请选择所在地区"
                    :options="options"
                    @close="showArea = false"
                    @finish="onFinish"
                    :field-names="fieldNames" />
    </van-popup>
  </div>
</template>

<script>
import city from '@/utils/city.json'
export default {
  name: 'storeLocation',
  data () {
    return {
      regionList: [],
      storeAddre: '',
      showArea: false,
      form: {},
      fieldNames: {
        text: 'value',
        value: 'id',
        children: 'children'
      },
      cascaderValue: '',
      options: null,
      regStr: /^[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\\A9|\\AE]\u3030|\uA9|\uAE|\u3030$/
    }
  },
  computed: {},
  watch: {},
  created () {
    this.options = city
    const parameters = this.$lance.getJson('storeInfo')
    this.regionList = [
      { id: parameters.area1Id, value: parameters.area1Name },
      { id: parameters.area2Id, value: parameters.area2Name },
      { id: parameters.area3Id, value: parameters.area3Name },
      { id: parameters.area4Id, value: parameters.area4Name }
    ]
    this.storeAddre = parameters.area1Name + parameters.area2Name + parameters.area3Name + parameters.area4Name
    this.form.storeAddress = parameters.storeAddress
  },
  methods: {
    // 地区
    onFinish ({ selectedOptions }) {
      this.showArea = false
      this.regionList = selectedOptions
      this.storeAddre = selectedOptions
        .map((item) => item.value)
        .join('-')
    },
    // 保存
    save () {
      if (this.regStr.test(this.form.storeAddress)) return this.$toast('详细地址不能输入表情字符')
      const parameters = this.$lance.getJson('storeInfo')
      parameters.storeAddress = this.form.storeAddress
      parameters.area1Id = this.regionList[0].id
      parameters.area1Name = this.regionList[0].value
      parameters.area2Id = this.regionList[1].id
      parameters.area2Name = this.regionList[1].value
      parameters.area3Id = this.regionList[2].id
      parameters.area3Name = this.regionList[2].value
      parameters.area4Id = this.regionList[3].id
      parameters.area4Name = this.regionList[3].value
      this.$http.post(
        this.$apiUri.APP_STORE_INFO_UPDATE,
        parameters,
        res => {
          this.$lance.setJson('storeInfo', parameters)
          this.$toast('店铺地址修改成功')
          this.$baseUtils.goBack(-1)
        }, err => {
          this.$toast(err.message)
        }
      )
    }
  }
}
</script>
<style lang='scss' scoped>
// @import url(); 引入公共css类
</style>
