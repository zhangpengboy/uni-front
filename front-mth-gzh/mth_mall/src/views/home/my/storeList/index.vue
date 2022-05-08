<template>
  <div>
    <van-list
      v-if="dataOK || list.length > 0"
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      :immediate-check="false"
      @load="pageListStore"
    >
      <van-cell-group>
        <van-cell v-for="(v, i) in list" :key="i" center is-link>
          <template #title>
            <div class="favor" @click="goStore(v.storeId)">
              <van-image
                round
                width="1.08108rem"
                height="1.08108rem"
                :src="require('@/assets/images/logo.png')"
              />
              <div class="favor-left">
                <p class="favor-name">{{ v.storeName }}</p>
                <p class="favor-count">{{ v.favorCount }}人关注</p>
              </div>
            </div>
          </template>
          <template #right-icon>
            <van-button
              round
              hairline
              color="#F2F2F2"
              size="small"
              @click="delStore(v.storeId)"
              style="width:2.16rem"
              >已关注</van-button
            >
          </template>
        </van-cell>
      </van-cell-group>
    </van-list>
    <van-empty
      v-else
      class="custom-image"
      :image="require('@/assets/images/empty/no_concern@2x.png')"
      description="还没有关注的店铺哦~"
    />
  </div>
</template>

<script>
export default {
  data () {
    return {
      loading: false,
      finished: false,
      list: [],
      queryParams: {
        pageNum: 1,
        pageSize: 10
      },
      storeId: '',
      dataOK: true
    }
  },
  created () {
    this.pageListStore()
  },
  activated () {
    this.pageListStore()
  },
  methods: {
    pageListStore () {
      this.loading = true
      this.$http.post(
        this.$apiUri.APP_USERFAVORSTORE_GET,
        this.queryParams,
        res => {
          if (this.finished) return
          this.dataOK = false
          this.list = _.concat(this.list, res.data.list)
          this.loading = false
          if (
            res.data.totalPage === 0 ||
            res.data.totalPage === this.queryParams.pageNum
          ) {
            this.finished = true
            return
          }
          this.queryParams.pageNum++
        },
        err => {
          this.loading = false
          this.dataOK = true
          this.$toast(err.message)
        }
      )
    },
    // 跳转店铺
    goStore (id) {
      console.log(1, id)
      this.$router.push({
        path: '/storeData',
        query: {
          storeId: id
        }
      })
    },
    // 取消关注的店铺
    delStore (id) {
      // console.log(id)
      this.$http.post(
        this.$apiUri.APP_DELSTORE,
        { storeId: id },
        res => {
          this.$toast('已取消关注')
          this.queryParams.pageNum = 1
          this.finished = false
          this.dataOK = true
          this.list = []
          this.pageListStore()
        },
        err => {
          this.$toast(err.message)
        }
      )
    }
  }
}
</script>

<style lang="scss" scoped>
.van-button__text {
  font-size: 13px;
  color: #666;
}
.favor {
  display: flex;
  &-left {
    margin-left: 9px;
  }
  &-name {
    width: 160px;
    height: 22px;
    font-size: 16px;
    font-weight: 700;
    line-height: 22px;
    color: #333333;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  &-count {
    height: 18px;
    line-height: 18px;
    font-size: 12px;
    margin: 2px 0;
    color: #666;
  }
}
</style>
