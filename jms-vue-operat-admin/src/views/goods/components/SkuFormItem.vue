<!--
 * @Author       : Lance Yi <latticeyi@gmail.com>
 * @Date         : 2020-11-09 19:13:25
 * @Description  : SKU 套餐组件
-->
<template>
  <el-form
    class="goods-form form-header"
    :ref="'goodsSkuForm_' + skuKey"
    :model="skuItem"
    label-width="110px"
    size="medium"
    label-suffix=":"
  >
    <el-row :gutter="20">
      <el-col :span="24" :md="8">
        <el-form-item
          label="套餐名称"
          prop="skuName"
          required
          :rules="[{ required: true, message: '套餐名称不能为空' }]"
        >
          <el-input
            v-model="skuItem.skuName"
            placeholder="请输入套餐名称"
          ></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="24" :md="8">
        <el-form-item
          label="库存数量"
          prop="amount"
          required
          :rules="[{ required: true, message: '库存数量不能为空' }]"
        >
          <el-input
            v-model.number="skuItem.amount"
            placeholder="请输入库存数量"
          ></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="24" :md="8">
        <el-form-item
          label="原价(元)"
          prop="marketPrice"
          required
          :rules="[
            { required: true, message: '原价不能为空', trigger: 'blur' }
          ]"
        >
          <el-input
            v-model="skuItem.marketPrice"
            type="number"
            placeholder="请输入商品的原价"
          >
            <!-- <template slot="append">元</template> -->
          </el-input>
        </el-form-item>
      </el-col>

      <!-- <el-col :span="24" :md="24"> -->
      <el-col :span="24" :md="8">
        <el-form-item
          label="销售价(元)"
          prop="salePrice"
          required
          :rules="[
            { required: true, message: '销售价不能为空', trigger: 'blur' }
          ]"
        >
          <el-input
            v-model="skuItem.salePrice"
            type="number"
            placeholder="请输入商品的销售价"
          >
            <!-- <template slot="append">元</template> -->
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="24" :md="8">
        <el-form-item
          label="限购数量"
          prop="quota"
          required
          :rules="[
            { required: true, message: '限购数量不能为空', trigger: 'blur' }
          ]"
        >
          <el-input
            v-model="skuItem.quota"
            type="number"
            placeholder="请输入商品的限购数量"
          >
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="24" :md="8">
        <el-form-item
          label="结算价(元)"
          prop="settlePrice"
          required
          :rules="[
            { required: true, message: '结算价不能为空', trigger: 'blur' }
          ]"
        >
          <el-input
            v-model="skuItem.settlePrice"
            type="number"
            placeholder="请输入商品的结算价"
          >
            <!-- <template slot="append">元</template> -->
          </el-input>
        </el-form-item>
      </el-col>
      <!-- </el-col> -->
      <!-- <el-col :span="24" :md="24"> -->
      <el-col :span="24" :md="8">
        <el-form-item label="分润类型" prop="incomeType">
          <el-select
            class="w-100"
            v-model="skuItem.incomeType"
            placeholder="请选择"
          >
            <el-option label="奖励礼券" :value="0"> </el-option>
            <!-- <el-option label="奖励红包" :value="1"> </el-option> -->
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="24" :md="8">
        <!-- <el-form-item
          required
          :rules="[
            { required: true, message: '业务类型不能为空', trigger: 'blur' },
          ]"
          label="业务类型"
          prop="incomeBsCode"
        >
          <el-select
            class="w-100"
            v-model="skuItem.incomeBsCode"
            placeholder="请选择业务类型"
          >
            <el-option
              v-for="item in appBusinessDictList"
              :key="item.id"
              :label="item.bsName"
              :value="item.bsType"
            >
            </el-option>
          </el-select>
        </el-form-item> -->
      </el-col>
      <el-col :span="24" :md="8">
        <el-form-item
          :label="`分润${skuItem.incomeType === 0 ? '礼券(个)' : '金额(元)'}`"
          prop="incomeAmount"
        >
          <el-input
            v-model="skuItem.incomeAmount"
            onkeyup="if(this.value.length==1){this.value=this.value.replace(/[^0-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"
            clearable
            maxlength="7"
            placeholder="请输入商品的分润礼券"
          >
            <!-- <template slot="append">元</template> -->
          </el-input>
        </el-form-item>
      </el-col>
      <!-- </el-col> -->
      <el-col :span="24" :md="8">
        <el-form-item label="礼券规则" required>
          <el-input
            :placeholder="
              `请输入商品${skuItem.integralType ? '赠送' : '抵扣'}的礼券`
            "
            v-model.number="skuItem.integral"
            type="number"
            class="input-with-select"
          >
            <el-select
              v-model="skuItem.integralType"
              slot="prepend"
              placeholder="请选择礼券方式"
              style="width: 105px"
            >
              <el-option label="抵扣礼券" :value="0"></el-option>
              <el-option label="赠送礼券" :value="1"></el-option>
            </el-select>
            <!-- <el-button slot="append">积分</el-button> -->
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="24" :md="8">
        <el-form-item
          label="佣金(元)"
          prop="rewardPrice"
          required
          :rules="[
            { required: true, message: '佣金不能为空', trigger: 'blur' }
          ]"
        >
          <el-input
            v-model="skuItem.rewardPrice"
            type="number"
            placeholder="请输入商品的佣金"
          >
            <!-- <template slot="append">元</template> -->
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="24" :md="8">
        <el-form-item
          label="vip价(元)"
          prop="vipPrice"
          required
          :rules="[{ required: true, message: '商品vip价不能为空' }]"
        >
          <el-input
            type="number"
            v-model="skuItem.vipPrice"
            placeholder="请输入商品的vip价"
          ></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item
          label="商品缩略图"
          prop="skuImg"
          required
          :rules="[{ required: true, message: '缩略图不能为空' }]"
        >
          <el-upload
            class="avatar-uploader"
            action="#"
            :show-file-list="false"
            :before-upload="beforeAvatarUpload"
            :http-request="uploadImg"
          >
            <img v-if="skuItem.skuImg" :src="skuItem.skuImg" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">
              建议尺寸400*400, 只能上传jpg/png文件，且不超过500kb
            </div>
          </el-upload>
        </el-form-item>
      </el-col>

      <!-- <el-col :span="24" :offset="0">
        <el-form-item>
          <el-button type="success" size="small" block @click="addSku"
            >新增套餐</el-button
          >
          <el-button
            type="danger"
            size="small"
            block
            @click="delSku"
            v-if="skuKey > 0"
            >删除套餐</el-button
          >
        </el-form-item>
      </el-col> -->
    </el-row>
  </el-form>
</template>
<script>
import { uploadImg } from '@/api/commom'
import { appBusinessDictList } from '@/api/system/superadmin'
export default {
  props: {
    // SKU 套餐信息
    skuItem: {
      type: Object,
      default: () => {
        return {}
      }
    },
    // 当前表单Key
    skuKey: Number
  },
  data () {
    return {
      appBusinessDictList: []
    }
  },
  created () {
    appBusinessDictList().then(res => {
      // console.log(res);
      if (res.code == 200) {
        this.appBusinessDictList = res.data
      }
    })
  },
  methods: {
    /** 图片上传之前判断 */
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 1
      if (!isJPG) {
        this.$message.error('上传图片只能是JPG、PNG格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过1MB!')
      }
      return isJPG && isLt2M
    },
    /** 自定义上传图片 */
    uploadImg (e) {
      uploadImg(e.file).then(res => {
        if (res.code == 200) {
          this.$set(this.skuItem, 'skuImg', res.data)
        } else {
          this.$msgError('上传图片失败,请重新上传!')
        }
      })
    },
    /** 添加套餐 */
    addSku () {
      this.$emit('addSku')
    },
    /** 删除套餐 */
    delSku () {
      this.$emit('delSku', this.skuKey)
    }
  }
}
</script>
