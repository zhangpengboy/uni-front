<!--
 * @Author       : Lance Yi <latticeyi@gmail.com>
 * @Date         : 2020-12-01 11:19:53
 * @Description  : 营销中心 - 活动列表信息
-->

<template>
  <div class="app-container">
    <el-card shadow="never" class="box-card mb10" v-if="onToActList.length">
      <div slot="header" class="clearfix">
        <span>已报名活动</span>
        <el-menu
          :default-active="activeIndex"
          class="el-menu-demo"
          mode="horizontal"
          @select="handleSelect"
        >
          <el-menu-item
            v-for="(item, i) in haveToSignList"
            :key="i"
            :index="i.toString()"
            >{{ item[0].pname }}</el-menu-item
          >
        </el-menu>
      </div>
      <el-row :gutter="20">
        <el-col
          :span="12"
          :xl="4"
          :lg="6"
          :sm="8"
          :offset="0"
          v-for="(v, i) in onToActList"
          :key="i"
        >
          <div class="box-card-item on" @click="toMarketGoods(v)">
            <div>{{ v.actName }}</div>
            <div style="fontsize: 12px; margintop: 6px">{{ v.pname }}</div>
            <div class="clearfix">
              <el-button type="text" class="fr btn">立即前往</el-button>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-card>

    <el-card shadow="never" class="box-card" v-if="notToActList.length">
      <div slot="header" class="clearfix">
        <span>可参与活动</span>
        <el-menu
          :default-active="canParticipateIndex"
          class="el-menu-demo"
          mode="horizontal"
          @select="handleCanParticipateList"
        >
          <el-menu-item
            v-for="(item, i) in canParticipateList"
            :key="i"
            :index="i.toString()"
            >{{ item[0].pname }}</el-menu-item
          >
        </el-menu>
      </div>
      <el-row :gutter="20">
        <el-col
          :span="12"
          :xl="4"
          :lg="6"
          :sm="8"
          :offset="0"
          v-for="(v, i) in notToActList"
          :key="i"
        >
          <div class="box-card-item" @click="handleSignUp(v)">
            <div>{{ v.name }}</div>
            <div style="fontsize: 12px; margintop: 6px">{{ v.pname }}</div>
            <div class="clearfix">
              <el-button type="text" class="fr btn">参加活动</el-button>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-card>

    <!-- 参加活动弹窗 -->
    <ActPackDialog
      v-if="open"
      :open="open"
      :form="form"
      @submit="submit"
      @cancel="cancel"
    />

    <!-- 支付二维码弹窗 -->
    <PayDialog
      v-if="showPay"
      :show="showPay"
      :url="payImg"
      @submit="getData"
      @cancel="showPay = false"
    />
  </div>
</template>
<script>
import { getActCommonAllList, getActStorePackList } from "@/api/goods";
import { getMiniCodePic } from "@/api/orders";
import { mapGetters } from "vuex";
import ActPackDialog from "./components/ActPackDialog";
import PayDialog from "./components/PayDialog";
export default {
  name: "MarketIndex",
  components: {
    ActPackDialog,
    PayDialog,
  },
  data() {
    return {
      // 可参与的活动
      notToActList: [],
      // 已参与的活动
      onToActList: [],
      // 是否打开弹窗
      open: false,
      // 表单
      form: {},
      // 是否显示支付弹窗
      showPay: false,
      // 支付图片地址
      payImg: null,
      // 已报名导航
      activeIndex: "0",
      // 已报名导航菜单
      haveToSignList: [],
      // 可以参与导航
      canParticipateIndex: "0",
      // 可以参与导航菜单
      canParticipateList: [],
      // 可参与
      joinNum: 0,
      // 已参与
      beenJoinNum: 0
    };
  },
  computed: {
    ...mapGetters(["store"]),
  },
  mounted() {
    this.getData();
  },
  methods: {
    // 导航切换
    handleSelect(key, keyPath) {
      this.beenJoinNum = key
      this.onToActList = this.haveToSignList[key];
    },
    handleCanParticipateList(key, keyPath) {
      this.joinNum = key
      this.notToActList = this.canParticipateList[key];
    },
    /** 进入页面获取的数据 */
    getData() {
      this.getActCommonAllList();
      this.getActStorePackList();
    },
    /** 获取可参数活动列表 */
    getActCommonAllList() {
      getActCommonAllList({
        role: this.store.storeRoleCode,
      }).then((res) => {
        this.canParticipateList = this.classification(res.data);
        if (this.canParticipateList.length) {
          this.notToActList = this.canParticipateList[this.joinNum];
        }
      });
    },
    // 数组找相同项分类函数
    classification(arr) {
      let newData = {};
      arr.forEach((e) => {
        //新建属性名
        if (Object.keys(newData).indexOf("" + e.pcode) === -1) {
          newData[e.pcode] = [];
        }
        //对应插入属性值
        newData[e.pcode].push(e);
      });
      let arrs = Object.keys(newData).map(function (i) {
        return newData[i];
      });
      return arrs;
    },
    /** 获取店铺已经参与的活动列表 */
    getActStorePackList() {
      getActStorePackList({
        storeId: this.store.id,
        role: this.store.storeRoleCode,
      }).then((res) => {
        this.haveToSignList = this.classification(res.data);
        console.log(this.haveToSignList);
        if (this.haveToSignList.length) {
          this.onToActList = this.haveToSignList[this.beenJoinNum];
        }
      });
    },
    /** 报名参加活动 */
    handleSignUp(item) {
      this.open = true;
      console.log(998, item);
      this.form = {
        actCode: item.code,
        actName: item.name,
      };
    },
    /** 查看商品列表 */
    toMarketGoods(item) {
      // 判断活动类型 跳转不通页面
      if (item.actCode == "JMS_ACT_ADV") {
        // 广告图
        this.$router.push({
          name: "MarketBanner",
          query: {
            storePackId: item.id,
            actCode: item.actCode,
            actName: item.actName,
          },
        });
      } else if (item.actCode == "JMS_ACT_PUSH") {
        // 广告图
        this.$router.push({
          name: "MarketPushGoods",
          query: {
            storePackId: item.id,
            actCode: item.actCode,
            actName: item.actName,
          },
        });
      } else {
        this.$router.push({
          name: "MarketGoods",
          query: {
            storePackId: item.id,
            actCode: item.actCode,
            actName: item.actName,
          },
        });
      }
    },
    /** 确认按钮 */
    submit(orderNo) {
      this.open = false;
      if (orderNo) {
        // 获取支付二维码
        this.getMiniCodePic(orderNo);
      } else {
        this.getData();
      }
    },
    /** 取消按钮 */
    cancel() {
      this.open = false;
    },
    /** 获取小程序付款码 */
    getMiniCodePic(scene) {
      // TODO 这里需要修改小程序的路径、参数根据后端接口决定
      getMiniCodePic({
        scene: scene,
        path: "pages/tabBar/home/home",
        width: "430",
      }).then((res) => {
        this.payImg =
          "data:image/png;base64," + res.data.replace(/[\r\n]/g, "");
        this.showPay = true;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.box-card {
  &-item {
    border: 1px solid #e5e5e5;
    padding: 14px;
    border-radius: 4px;
    background: linear-gradient(45deg, #0081ff, #1cbbb4);
    box-shadow: 1px 2px 5px #e5e5e5;
    color: #fff;
    cursor: pointer;
    margin-bottom: 10px;
    &.on {
      background: linear-gradient(45deg, #ff9700, #ed1c24);
    }
    .btn {
      color: #fff;
      font-size: 15px;
    }
  }
}
</style>