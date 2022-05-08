<!--
 * @Author      : Lance Yi<latticeyi@gmail.com>
 * @Date        : 2021-03-06 14:57:05
 * @Description : OTC 转出
-->

<template>
  <div class="center withdraw p-footer">
    <van-nav-bar
      title="提现"
      right-text="提现记录"
      left-arrow
      @click-left="onClickLeft"
      @click-right="onClickRight"
      fixed
      placeholder
    />

    <!-- 提现方式 -->
    <div class="withdraw-way">
      <div
        class="main-wrap mb-2"
        v-if="cardList.length > 0"
        style="box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16)"
      >
        <van-cell clickable :border="false" size="large" @click="show = true">
          <template #title>
            <div class="d-flex align-items-center">
              <van-icon name="card" class="color-primary fs-24 mr-1" />
              <p>提现到银行卡</p>
              <van-icon name="arrow" class="fs-18" />
            </div>
          </template>
        </van-cell>
        <div class="main-wrap-cont pt-0">
          <p class="fs-14 mb-1">
            <span class="color-light">真实姓名：</span>
            <span class="ml-1">{{ card.cardName }}</span>
          </p>
          <p class="fs-14 mb-1">
            <span class="color-light">转账到银行卡：</span>
            <span class="ml-1"
              >{{ card.bankName }}({{ $lance.filterCardNo(card.cardNo) }})</span
            >
          </p>
        </div>
      </div>
      <div class="no-bank" v-else @click="toCardList">
        <h4 class="fs-14 fw-b">添加您的提现方式</h4>
        <p
          class="
            fs-14
            color-light
            mt-4
            d-flex
            align-items-center
            justify-content-center
          "
        >
          <van-icon
            :name="require('@/assets/images/user/icon-add@2x.png')"
            size="14"
          />
          <span class="ml-1">提交本人的银行卡</span>
        </p>
      </div>
    </div>
    <!-- 导航  -->
    <van-tabs v-model:active="active" @click="handlerTabs" color="#1989FA">
      <van-tab title="CNY转出"></van-tab>
      <van-tab title="BTC代提"></van-tab>
      <van-tab title="ETH代提"></van-tab>
    </van-tabs>
    <!-- 提现数量 -->
    <div class="mt-2">
      <h2 class="fw-b fs-15 pl-3 py-2">提现数量</h2>
      <van-field
        v-model="digit"
        type="number"
        :placeholder="`可提现金额 ${ttmCny.freeAmount}`"
      >
        <template #button>
          <span class="color-main" @click="darwAllMoney">全部</span>
          <span class="color-light mx-2">|</span>
          <span>{{ $lance.filterBitType(bitType) }}数量</span>
        </template>
      </van-field>
      <p class="color-main pl-3 fs-12 py-2">
        {{ $lance.filterBitType(bitType) }}实时单价≈<span class="color-main">{{
          drawMin.cnyTrans
        }}</span
        >元
      </p>
    </div>
    <!-- 温馨提示 -->
    <div class="mt-2">
      <div class="color-light px-3 fs-12 py-2">
        <template v-if="active == 0">
          <p class="fs-12 mb-1">温馨提示</p>
          <p class="color-red fs-12 mb-1">
            1.最小提现金额为{{ drawMin.money
            }}{{ $lance.filterBitType(bitType) }}起；
          </p>
        </template>
        <template v-else>
          <p class="fs-12 mb-1">温馨提示(OTC代提为第三方大宗商家承兑)</p>
          <p class="color-red fs-12 mb-1">
            1.最小提OTC代提数量为{{ drawMin.money
            }}{{ $lance.filterBitType(bitType) }}；
          </p>
        </template>
        <p class="fs-12 mb-1">2.本次提现不收取手续费；</p>
        <p class="fs-12 mb-1">
          3.提现审核时间为工作日9:00-18:30，如超过2个工作日未到账请联系客服处理；
        </p>
        <p class="fs-12 mb-1">
          4.因三方支付风险限额，请广大用户在选择提现时，超过10000元以上，采用银行卡方式，避免因第三方支付原因，延迟到账或取消
        </p>
      </div>
    </div>
    <!-- 底部 -->
    <div class="footer-btn">
      <van-button block type="primary" @click="clickTX" :disabled="digit <= 0">
        立即提现
      </van-button>
    </div>
    <!--交易密码 -->
    <van-dialog
      v-model:show="showTrad"
      title="交易密码"
      show-cancel-button
      @confirm="submitWithdraw"
      @cancel="cancelWithdraw"
    >
      <van-field
        :type="showRePwd ? 'text' : 'password'"
        placeholder="请输入交易密码"
        v-model="password"
        class="mt-4 mb-4 pl-8 pr-8"
      >
        <template #right-icon>
          <van-icon
            size="22"
            name="eye-o"
            v-if="showRePwd"
            @click="showRePwd = false"
          />
          <van-icon
            size="22"
            name="closed-eye"
            v-else
            @click="showRePwd = true"
          />
        </template>
      </van-field>
      <div></div>
    </van-dialog>
    <!-- <van-popup
      v-model:show="showTrad"
      close-icon-position="top-left"showTrad = true
      closeable
      round
      safe-area-inset-bottom
      close-on-popstate
      :close-on-click-overlay="false"
      @close="password = null"
    >
      <div class="px-2 pt-8 pb-5 d-flex align-items-center">
        <div class="w-70">
          <h3 class="fw-b mt-3 mb-2 ml-2">请输入交易密码</h3>
          <van-field
            :type="showRePwd ? 'text' : 'password'"
            placeholder="请输入交易密码"
            v-model="password"
            
          >
            <template #right-icon>
              <van-icon
                size="22"
                name="eye-o"
                v-if="showRePwd"
                @click="showRePwd = false"
              />
              <van-icon
                size="22"
                name="closed-eye"
                v-else
                @click="showRePwd = true"
              />
            </template>
          </van-field>
          <div class="forgetPaw pl-3"></div>
        </div>
        <van-button
          class="flex-1"
          block
          type="primary"
          size="small"
          round
          @click="submitWithdraw"
        >
          确定
        </van-button>
      </div>
    </van-popup> -->
    <!-- 添加收款方式 -->
    <van-popup v-model:show="show" closeable position="bottom">
      <h2 class="fw-b fs-15 pl-3 py-4">添加收款方式</h2>
      <van-radio-group v-model="drawWay">
        <van-cell-group>
          <van-cell
            clickable
            @click="(drawWay = i), (show = false)"
            size="large"
            v-for="(v, i) in cardList"
            :key="i"
          >
            <template #title>
              <div class="d-flex">
                <van-icon name="card" class="color-primary fs-24 mr-1" />
                <p>
                  银行卡<span class="fs-12"
                    >({{ $lance.filterCardName(v.cardName) }})</span
                  >
                </p>
              </div>
            </template>
            <template #label>
              <span class="ml-6 fs-13"
                >{{ v.bankName }}({{ $lance.filterCardNo(v.cardNo) }})</span
              >
            </template>
            <template #right-icon>
              <van-radio :name="i" />
            </template>
          </van-cell>
          <!-- <van-cell @click.stop="toCardList">
            <template #title>
              <div class="d-flex align-items-center">
                <van-icon name="plus" class="color-light fs-18 mr-1 fw-b" />
                <p class="color-light fs-14">添加收款方式</p>
              </div>
            </template>
          </van-cell> -->
        </van-cell-group>
      </van-radio-group>
    </van-popup>
  </div>
</template>
<script>
import $_ from "lodash";
import $md5 from "md5";
import $apiUri from "@/api/config";
import $http from "@/api/index.js";
import { ref, watch, onMounted } from "vue";
import { useRouter } from "vue-router";
import { Toast } from "vant";
export default {
  setup() {
    const router = useRouter();
    const assets = ref([]);
    const ttmCny = ref({});
    const active = ref(0);
    const bitType = ref(1);
    const digit = ref(null);
    const drawWay = ref(0);
    const cardList = ref([]);
    const card = ref({});
    const show = ref(false);
    const drawMin = ref({});
    const showTrad = ref(false);
    const showRePwd = ref(false);
    const password = ref(null);
    watch([active, drawWay], (newValues) => {
      digit.value = null;
      // console.log(newValues)
      card.value = cardList.value[newValues[1]];
    });
    // nextTick()
    onMounted(() => {
      getBitCardList();
      getUserMoney();
      getWithdrawMin(bitType.value);
    });
    /** 获取资产详情 */
    const getUserMoney = () => {
      $http.post($apiUri.APP_AGENTMONEY_INFO, null, (res) => {
        assets.value = res.data;
        ttmCny.value = $_.find(
          assets.value,
          (v) => v.bitType === bitType.value
        );
      });
    };
    /** 获取用户绑定的银行卡列表 */
    const getBitCardList = () => {
      $http.post($apiUri.APP_BIT_CARD_LIST, null, (res) => {
        cardList.value = res.data;
        if ($_.size(res.data) > 0) card.value = res.data[drawWay.value];
      });
    };
    /** 返回 */
    const onClickLeft = () => router.back();
    /** 交易记录 */
    const onClickRight = () => router.push("withdrawList");
    /** 弹框取消 */
    const cancelWithdraw = () => (password.value = null);
    /** 底部立即提现按钮 点击事件 */
    const clickTX = () => {
      if (!card.value) return Toast("请先选择或绑定银行卡");
      showTrad.value = true;
    };
    /** 确定转出 */
    const submitWithdraw = () => {
      if (password.value == null || password.value === "") {
        return Toast("请输入交易密码");
      }
      $http.post(
        $apiUri.APP_AGENTMONEY_DRAW,
        {
          money: digit.value,
          cardNo: card.value.cardNo,
          bitPrice: 1, // TODO 获取得到
          bitType: bitType.value, // 币的类型
          password: $md5(password.value), // 交易密码
        },
        (res) => {
          if (!res.success) return Toast(res.message);
          showTrad.value = false;
          password.value = null;
          getUserMoney();
          digit.value = null;
          Toast(res.data);
        },
        (err) => {
          showTrad.value = false;
          password.value = null;
          Toast(err.message);
        }
      );
    };
    /** 全部操作 */
    const darwAllMoney = () => {
      digit.value = ttmCny.value.freeAmount || null;
    };
    /** tbas 点击切换 */
    const handlerTabs = () => {
      bitType.value = active.value + 1;
      getUserMoney();
      getWithdrawMin(bitType.value);
    };
    /** 获取当前类型最小提现 */
    const getWithdrawMin = (bitType) => {
      // console.log(bitType)
      $http.post($apiUri.APP_WITHDRAW_MIN, { bitType }, (res) => {
        drawMin.value = res.data;
      });
    };
    return {
      showRePwd,
      show,
      assets,
      ttmCny,
      active,
      bitType,
      digit,
      drawWay,
      drawMin,
      cardList,
      card,
      clickTX,
      showTrad,
      password,
      getBitCardList,
      handlerTabs,
      darwAllMoney,
      submitWithdraw,
      cancelWithdraw,
      onClickRight,
      onClickLeft,
    };
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.bitType = +to.query.bitType || 1;
      vm.active = vm.bitType - 1;
    });
  },
};
</script>
