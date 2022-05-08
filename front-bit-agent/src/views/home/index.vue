<template>
  <div class="goods">
    <van-tabs v-model:active="active" swipeable sticky color="#1989FA">
      <van-tab title="直邀">
        <van-pull-refresh
          v-model="stateStraight.refreshing"
          @refresh="onRefreshStraight"
        >
          <van-list
            v-model:loading="stateStraight.loading"
            :finished="stateStraight.finished"
            finished-text="没有更多了"
            @load="onLoadStraight"
          >
            <van-cell v-for="(item, i) in stateStraight.list" :key="i">
              <template #title>
                <span class="custom-title">{{ item.mobile }}&nbsp;</span>
                <van-tag type="danger">{{
                  $lance.filterUserRole(item.role)
                }}</van-tag>
              </template>
              <template #right-icon>
                <van-button
                  v-if="!item.groupId"
                  type="primary"
                  round
                  size="mini"
                  @click="assaginGroup(item)"
                  >&nbsp;指定团长&nbsp;</van-button
                >
                <van-button v-else type="success" round size="mini"
                  >&nbsp;已绑定&nbsp;</van-button
                >
              </template>
            </van-cell>
          </van-list>
        </van-pull-refresh>
      </van-tab>
      <van-tab title="团队">
        <template v-if="active === 1">
          <van-pull-refresh
            v-model="stateTeam.refreshing"
            @refresh="onRefreshTeam"
          >
            <van-list
              v-model:loading="stateTeam.loading"
              :finished="stateTeam.finished"
              finished-text="没有更多了"
              @load="onLoadTeam"
            >
              <van-cell v-for="(item, i) in stateTeam.list" :key="i" center>
                <template #title>
                  <span class="custom-title mr-2">{{ item.mobile }}</span>
                  <van-tag type="danger">{{
                    $lance.filterUserRole(item.role)
                  }}</van-tag>
                </template>
              </van-cell>
            </van-list>
          </van-pull-refresh>
        </template>
      </van-tab>
    </van-tabs>
    <!-- 指定团队长弹框 -->
    <van-popup
      v-model:show="showTrad"
      close-icon-position="top-left"
      closeable
      round
      safe-area-inset-bottom
      close-on-popstate
      :close-on-click-overlay="false"
      position="bottom"
      @close="mobile = null"
    >
      <div class="px-2 pt-8 pb-5 d-flex align-items-center">
        <div class="w-70">
          <h3 class="fw-b mt-3 mb-2 ml-2">指定团队长</h3>
          <van-field
            type="tel"
            maxlength="11"
            clearable
            placeholder="请输入团队长手机号"
            v-model="mobile"
          >
          </van-field>
          <div></div>
        </div>
        <van-button
          class="flex-1"
          block
          type="primary"
          size="small"
          round
          @click="assignTeam"
        >
          确定
        </van-button>
      </div>
    </van-popup>
  </div>
</template>
<script>
import $apiUri from "@/api/config";
import $http from "@/api/index.js";
import { reactive, ref } from "vue";
import { Toast } from "vant";
export default {
  setup() {
    const active = ref(0);
    const showTrad = ref(false);
    const mobile = ref(null);
    const userId = ref(null);
    const groupId = ref(null);
    // const pattern = /^1([3456789][0-9])\d{8}$/;
    const queryParamsTeam = reactive({
      pageNum: 1,
      pageSize: 10,
    });
    const queryParamsStraight = reactive({
      pageNum: 1,
      pageSize: 10,
    });
    const stateStraight = reactive({
      list: [],
      loading: false,
      finished: false,
      refreshing: false,
    });
    const stateTeam = reactive({
      list: [],
      loading: false,
      finished: false,
      refreshing: false,
    });

    // 获取直邀人员
    const onLoadStraight = () => {
      if (stateStraight.refreshing) {
        stateStraight.list = [];
        stateStraight.refreshing = false;
      }
      $http.post(
        $apiUri.APP_RELATION_LIST,
        queryParamsStraight,
        (res) => {
          if (stateStraight.finished) return;
          stateStraight.list = _.concat(stateStraight.list, res.data.list);
          stateStraight.loading = false;
          if (
            res.data.totalPage === 0 ||
            res.data.totalPage === queryParamsStraight.pageNum
          ) {
            stateStraight.finished = true;
            return;
          }
          queryParamsStraight.pageNum++;
        },
        (err) => {
          stateStraight.loading = false;
          stateStraight.finished = true;
          Toast(err.message);
        }
      );
    };

    // 获取团队人员
    const onLoadTeam = () => {
      if (stateTeam.refreshing) {
        stateTeam.list = [];
        stateTeam.refreshing = false;
      }
      $http.post(
        $apiUri.APP_RELATION_USERLIST,
        queryParamsTeam,
        (res) => {
          if (stateTeam.finished) return;
          stateTeam.list = _.concat(stateTeam.list, res.data.list);
          stateTeam.loading = false;
          if (
            res.data.totalPage === 0 ||
            res.data.totalPage === queryParamsTeam.pageNum
          ) {
            stateTeam.finished = true;
            return;
          }
          queryParamsTeam.pageNum++;
        },
        (err) => {
          stateTeam.loading = false;
          stateTeam.finished = true;
          Toast(err.message);
        }
      );
    };
    // 刷新直邀人员
    const onRefreshStraight = () => {
      stateStraight.finished = false;
      stateStraight.loading = true;
      onLoadStraight();
    };
    // 刷新团队人员
    const onRefreshTeam = () => {
      stateTeam.finished = false;
      stateTeam.loading = true;
      onLoadTeam();
    };
    // 打开弹框
    const assaginGroup = (item) => {
      userId.value = item.userId;
      showTrad.value = true;
    };
    // 查询团队长信息
    const getGroup = async () => {
      return new Promise((resolve) => {
        $http.post(
          $apiUri.APP_RELATION_GETGROUP,
          {
            mobile: mobile.value,
            userId: userId.value,
          },
          (res) => resolve(res.data.id),
          (err) => Toast(err.message)
        );
      });
    };
    // 指定团队
    const assignTeam = async () => {
      groupId.value = await getGroup();
      let queryParams = {
        groupId: groupId.value,
        userId: userId.value,
      };
      $http.post(
        $apiUri.APP_RELATION_BINDGROUP,
        queryParams,
        (res) => {
          showTrad.value = false;
          Toast(res.message);
          stateStraight.refreshing = true;
          onRefreshStraight();
        },
        (err) => Toast(err.message)
      );
    };
    return {
      active,
      showTrad,
      mobile,
      // pattern,
      assaginGroup,
      stateStraight,
      onLoadStraight,
      onRefreshStraight,
      stateTeam,
      onRefreshTeam,
      onLoadTeam,
      assignTeam,
    };
  },
};
</script>
<style lang="scss">
.goods {
  padding-bottom: 50px;

  &-swipe {
    img {
      width: 100%;
      display: block;
    }
  }

  &-title {
    font-size: 16px;
  }

  &-price {
    color: #f44;
  }

  &-express {
    color: #999;
    font-size: 12px;
    padding: 5px 15px;
  }

  &-cell-group {
    margin: 15px 0;

    .van-cell__value {
      color: #999;
    }
  }

  &-tag {
    margin-left: 5px;
  }
}
</style>
