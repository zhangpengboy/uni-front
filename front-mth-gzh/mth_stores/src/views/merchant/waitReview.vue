<!--
 * @Description : 待审核
-->
<template>
  <div>
    <div style="margin-bottom: 12px;">
      <div class="imageTop">
        <div class="text">待审核店铺</div>
        <div>
          <van-image
            width="68"
            height="68"
            class="imgae"
            :src="require('@/assets/images/pic_transaction_closure@2x.png')"
          />
        </div>
      </div>
    </div>
    <div class="giftMotherEnter">
      <van-form validate-first>
        <van-field
          readonly
          v-model="storeList.storeName"
          input-align="right"
          placeholder="请输入店铺名称"
        >
          <template #label>
            <span class="color-333">店铺名称</span>
          </template>
        </van-field>
        <van-field
          readonly
          v-model="storeList.storeOwnerName"
          input-align="right"
          clearable
          placeholder="请输入店东姓名"
        >
          <template #label>
            <span class="color-333">店东姓名</span>
          </template>
        </van-field>

        <van-field
          readonly
          v-model="storeList.salesmanPhone"
          input-align="right"
          type="tel"
          clearable
        >
          <template #label>
            <span class="color-333">业务员手机号</span>
          </template>
        </van-field>

        <van-field
          input-align="right"
          readonly
          clickable
          v-model="storeList.storeRoleName"
          right-icon="arrow"
          placeholder="请选择店铺角色"
          @click="showPicker = true"
        >
          <template #label>
            <span class="color-333">店铺角色</span>
          </template>
        </van-field>
        <van-field
          v-if="storeList.isCloudStore == 1"
          name="isCloudStore"
          label="数字货架"
        >
          <template #right-icon>
            <van-radio-group
              v-model="storeList.isCloudStore"
              direction="horizontal"
            >
              <van-radio disabled checked-color="#ed6133" :name="1"
                >是</van-radio
              >
              <van-radio disabled checked-color="#ed6133" :name="0"
                >否</van-radio
              >
            </van-radio-group>
          </template>
        </van-field>
        <van-field
          input-align="right"
          readonly
          clickable
          v-model="storeList.storeCategoryName"
          right-icon="arrow"
          placeholder="请选择店铺类别"
          @click="category = true"
        >
          <template #label>
            <span class="color-333">店铺类别</span>
          </template>
        </van-field>
        <van-field
          input-align="right"
          readonly
          clickable
          v-model="this.storeList.storeAddre"
          right-icon="arrow"
          placeholder="请选择店铺区域"
          @click="showArea = true"
        >
          <template #label>
            <span class="color-333">店铺区域</span>
          </template>
        </van-field>
        <van-field
          readonly
          v-model="storeList.storeAddress"
          input-align="right"
          placeholder="请输入店铺详情地址（精确到门牌号）"
        >
          <template #label>
            <span class="color-333">详情地址</span>
          </template>
        </van-field>
        <van-field
          readonly
          v-model="storeList.storeBusiness"
          input-align="right"
          type="tel"
          clearable
        >
          <template #label>
            <span class="color-333">经营范围</span>
          </template>
        </van-field>
        <van-cell title="身份证">
          <template #icon> </template>
          <template #label>
            <div class="d-flex">
              <van-image
                class="uploader-bgImg mr-1"
                width="166"
                height="106"
                fit="cover"
                :src="storeList.idcard1"
              />
              <van-image
                class="uploader-bgImg"
                width="166"
                height="106"
                fit="cover"
                :src="storeList.idcard2"
              />
            </div>
            <p class="fs-13 color-c1">（只能上传jpg/png文件，且不超过10M）</p>
          </template>
        </van-cell>
        <van-cell title="营业执照">
          <template #icon> </template>
          <template #label>
            <div class="d-flex">
              <van-image
                class="uploader-bgImg"
                width="60"
                height="60"
                :src="storeList.licence"
              />
            </div>
            <p class="fs-13 color-c1">（只能上传jpg/png文件，且不超过10M）</p>
          </template>
        </van-cell>
        <van-cell title="门头照" v-if="storeList.storesImg != null">
          <template #icon> </template>
          <template #label>
            <div class="d-flex">
              <van-image
                class="uploader-bgImg"
                width="60"
                height="60"
                :src="storeList.storesImg"
              />
            </div>
            <p class="fs-13 color-c1">（只能上传jpg/png文件，且不超过10M）</p>
          </template>
        </van-cell>
        <br />
      </van-form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      storeList: {},
      storeId: '',
      phone: ''
    }
  },
  created () {
    console.log(1, this.storeId)

    this.storeId = this.$route.query.storeId
    this.phone = this.$route.query.phone
    this.storeinfo()
  },
  methods: {
    // 获取店铺详情
    storeinfo () {
      this.$http.post(
        this.$apiUri.APP_ADD_UPDTA_SROREINFO_DETAIL,
        { storeId: this.storeId },
        res => {
          this.storeList = res.data
          this.storeList.storeAddre =
            res.data.area1Name +
            '-' +
            res.data.area2Name +
            '-' +
            res.data.area3Name
          // this.storeList.storeAddre = res.data.map(item => item.value).join('-')
          // console.log(11, this.storeList.storeAddre)
        }
      )
    }
  }
}
</script>

<style lang="less" scoped>
.require {
  margin-top: 10px;
  margin-right: 8px;
}
.shookimg {
  display: flex;
  width: 100%;
  height: 48px;
  line-height: 48px;
  padding-left: 14px;
  background-color: #fff;
  font-size: 14px;
  font-weight: 300;
  color: #333333;
}
.remarks {
  width: 100%;
  height: 48px;
  line-height: 48px;
  padding-left: 14px;
  background-color: #fff;
  font-size: 14px;
  font-weight: 300;
  color: #333333;
}
.primarybuy {
  height: 28px;
  border: 1px solid #ed6133;
  opacity: 1;
  margin-right: 14px;
  margin-left: 12px;
  color: #ed6133;
}
.primary {
  height: 28px;
  border: 1px solid #c1c1c1;
  opacity: 1;
  margin-right: 14px;
  // margin-left: 12px;
  color: #666666;
}
.bottomBase {
  display: flex;
  width: 375px;
  height: 49px;
  position: fixed;
  align-items: center;
  justify-content: flex-end;
  bottom: 0px;
  z-index: 1;
  background: #fff;
  opacity: 1;
}
.imgae {
  margin-right: 36px;
}
.text {
  margin-left: 14px;
  font-weight: 300;
  font-size: 16px;
  color: #fff;
}
.imageTop {
  width: 100%;
  height: 72px;
  background: linear-gradient(180deg, #f1722c 0%, #eb6133 100%);

  display: flex;
  align-items: center;
  justify-content: space-between;
}
/deep/.van-picker__confirm {
  color: #eb6133;
}
.buttom {
  text-align: center;
  margin: 0 auto;
  width: 262px;
  height: 38px;
  background: linear-gradient(180deg, #f1722c 0%, #eb6133 100%);
  opacity: 1;
  border-radius: 41px;
}
.previewSize {
  width: 166px;
  height: 106px;
}
.giftMotherEnter {
  min-height: calc(100vh - 46px);
  background: #ffffff;
  padding-bottom: 35px;
  .card {
    width: 100%;
    height: 100%;
    background: #ffffff;
    opacity: 1;
    border-radius: 8px;
    padding: 4px 0;
  }
  .checked {
    margin: 12px 0 32px 15px;
  }
  .uploader-bgImg {
    width: 166px;
    height: 106px;
  }
  .butgroup {
    display: flex;
    flex-flow: row wrap;
    .type {
      width: 105px;
      height: 32px;
      font-size: 14px;
      border: 1px solid #f2f2f2;
      border-radius: 28px;
      color: #666;
      line-height: 32px;
      text-align: center;
      margin-right: 14px;
      margin-bottom: 20px;
    }
    .activeClass {
      border: 1px solid #eb6133;
      background: #eb6133;
      color: #fff;
    }
  }
}
</style>
