<!--
 * @Author       : Lance Yi <latticeyi@gmail.com>
 * @Date         : 2021-01-21 17:41:59
 * @Description  : 详情
-->
<template>
  <div class="earningsDetails">
    <div class="bisc">
      <div class="counter" v-for="(item, i) in list" :key="i">
        <div class="left">
          <p class="fs-14 color-333 fw-700">
            {{
              item.planNumber == -1
                ? "24小时內到账奖励"
                : `第${item.planNumber}期奖励`
            }}
          </p>
          <p class="fs-13 color-muted time">
            {{ `收益时间：${item.planTime}` }}
          </p>
        </div>
        <div class="right">
          <p
            class="fs-13"
            :class="[item.execStatus === 2 ? 'color-red' : 'color-light']"
          >
            {{ filerStatus(item.execStatus) }}
          </p>
          <p class="fs-14 my-1 color-main fw-700">
            {{ `￥${item.moneyRelUser}` }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      title: '',
      list: [],
      dataOK: true,
      detail: {}
    }
  },
  mounted () {
    this.detail = this.$lance.getJson('myRaword')

    if (this.detail.planType === 1) {
      this.list = JSON.parse(this.detail.plan)
    } else {
      this.list = [JSON.parse(this.detail.plan)]
    }
    console.log(this.list)
  },
  methods: {
    filerStatus (i) {
      return ['待执行', '执行中', '已成功', '失败'][i]
    }
  }
}
</script>
<style lang="scss" scoped>
.earningsDetails {
  background: #fff;
  .bisc {
    padding: 0 14px;
    .counter {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #dfdfdf;
      padding: 14px 0 16px;
      .time {
        margin-top: 8px;
      }
    }
  }
  .content {
    padding: 14px;
    .tab {
      width: 100%;
      height: 100%;
      background: #fff;
      border-radius: 8px;
      padding: 14px;
      .name {
        width: 85px;
        height: 50px;
        line-height: 50px;
        color: #999;
      }
      .right {
        width: 240px;
        border-bottom: 1px solid #dfdfdf;
        padding: 14px 14px 14px 24px;
        .vlaue {
          height: 20px;
          line-height: 20px;
          color: #333;
          font-weight: 700;
        }
        img {
          width: 44px;
          height: 44px;
          border-radius: 4px;
        }
      }
    }
  }
}
</style>
