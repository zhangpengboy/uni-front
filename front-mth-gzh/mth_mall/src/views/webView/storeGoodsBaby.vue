<!-- 店铺商品添加导入 -->
<template>
  <div class='addStoreGoodsBase'>
    <!-- 用户信息 -->
    <div class="user-header">
      <div class="user-header-top">
        <div class="left">
          <div class="avatar">
            <van-image
              class="avatar"
              :src="require('@/assets/images/logo.png')"
            />
          </div>
          <div class="content">
            <div>
              <div class="username">
                <span>{{ storeInfo.storeName }}</span>
              </div>
              <div class="userNub">{{ favorCount }}人关注</div>
            </div>
          </div>
        </div>
        <div class="Ttonsis" :class="[isFavor ? 'yes' : 'no']">
          <div v-if="isFavor" @click="delStore">已关注</div>
          <div v-else @click="addStore">
            <van-image
              width="12"
              height="12"
              :src="require('@/assets/images/store_icon.png')"
            />
            <span> 关注</span>
          </div>
        </div>
      </div>
    </div>
    <div class="d-flex" v-if="dataOK || categoryGoodsList.length > 0">
      <div class="sidebar" ref="leftList">
        <ul>
          <li
            v-for="(item,i) in categoryGoodsList"
            :class="[isActivateSidebar === i ? 'isFixed' : 'isHide']"
            :key="i"
              @click="onChange(i)"
            >
            {{ item.categoryName }}
          </li>
        </ul>
      </div>
      <div class="center" ref="rightList">
        <div id="scrollWapper">
          <div class="scrollText" v-for="(item,key) in categoryGoodsList" :key="key" ref="goodsList">
            <p class="fs-13 color-text mb-2 fw-700 mb-2">{{ item.categoryName }}</p>
              <div
                class="card"
                v-for="(v, index) in item.storeGoodsList"
                :key="index"
              >
                <div @click="toOrderDetails(v)">
                  <div class="d-flex">
                    <img class="goods-thumb" :src="v.goodsIcon" alt="">
                    <div class="goodsInfo">
                      <p class="title">{{ v.goodsName }}</p>
                      <div class="ml-1 price text-xm text-price text-main priceSty">
                        <span>{{ v.salePrice }}</span>
                        <template v-if="v.integral > 0">
                          <span class="text-xs">{{
                            v.integralType | filterIntegralType
                          }}</span>
                          <span>{{ v.integral }}</span>
                          <span class="text-xs">{{
                            $lance.getIntegralName()
                          }}</span>
                        </template>
                        <span class="text-marketPrice" v-if="v.marketPrice > v.salePrice">{{
                          `¥ ${v.marketPrice}`
                        }}</span>
                      </div>
                      <div class="addNumber">
                        <div class="subTotal"
                          @click="subTotal(key, index)"
                          :style="(v.stockQtysss)==0?'':'opacity:1;right:60px;transform: rotate(360deg);transition: 1s all;'">
                            <van-image
                              v-if="v.stockQtysss"
                              width="18"
                              height="18"
                              :src="require('@/assets/images/goodssub.png')"
                            />
                        </div>
                        <div class="total"
                          :style="(v.stockQtysss)==0?'':'opacity:1;transition: 1.6s all;'">
                          {{v.stockQtysss}}
                        </div>
                        <div class="addTotal" @click="addTotal(key, index)">
                          <van-image
                              width="18"
                              height="18"
                              :src="require('@/assets/images/goodsadd.png')"
                            />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
          </div>
        </div>
      </div>
    </div>
    <van-empty
      v-else
      class="custom-image"
      :image="require('@/assets/images/empty/no_goods@2x.png')"
      description="暂无商品"
    />
    <div class="foot">
			<div class="foot-flex">
				<div class="left">
					<div class="img">
            <van-image
              @click="showService"
              v-if="cartList.length"
              width="48"
              height="48"
              :src="require('@/assets/images/haveGoods.png')"
            />
						<!-- <image src="../static/img/haveGoods.png" @click="showService" v-if="cartList.length" mode="">
						</image>
						<image src="../static/img/noGoods.png.png" v-else mode=""></image> -->
            <van-image
              v-else
              width="48"
              height="48"
              :src="require('@/assets/images/noGoods.png')"
            />
						<div class="num" v-if="cartList.length">
							{{cartList.length}}
						</div>
					</div>
          <!-- <div class="ml-1 price text-xm text-price text-main priceSty">
            <span>{{ sumObj.amount }}</span>
            <template v-if="sumObj.integral > 0">
              <span class="text-xs">{{
                sumObj.integral > 0 ? 1 : 0 | filterIntegralType
              }}</span>
              <span>{{ sumObj.integral }}</span>
              <span class="text-xs">{{
                $lance.getIntegralName()
              }}</span>
            </template>
            <span class="text-marketPrice" v-if="v.marketPrice > v.salePrice">{{
              `¥ ${v.marketPrice}`
            }}</span>
          </div> -->
					<div class="price" v-if="cartList.length" @click="showService">
						<span class="top money text-price text-main">
							<span>{{ sumObj.amount }}</span>
							<template>
								<span class="text-xs">{{ sumObj.integral > 0 ? 1 : 0 | filterIntegralType }}</span>
								<span>{{ Math.abs(sumObj.integral) }}</span>
								<span class="text-xs">{{ $lance.getIntegralName() }}</span>
							</template>
						</span>
						<div class="bottom">
							免配送费
						</div>
					</div>
				</div>
				<div class="buy" v-if="cartList.length" @click="toSettle">
					去结算
				</div>
				<div class="nogoods" v-else>
					去结算
				</div>
			</div>
		</div>
    <!-- 购物车弹出框 -->
    <van-popup
        v-model="openScart"
        round
        closeable
        position="bottom"
        style="bottom: 25px;max-height: 400px"
        :close-on-popstate="true"
      >
      <div class="footpopup" style="z-index: 999;">
				<div class="">
					<!-- <div class="selected">
						已选商品
					</div> -->
          <div
            class="foodcard card"
            v-for="(v, index) in cartList"
            :key="index"
          >
            <div @click="toOrderDetails(v)">
              <div class="d-flex">
                <img class="goods-thumb" :src="v.goodsIcon" alt="">
                <div class="goodsInfos">
                  <p class="title">{{ v.goodsName }}</p>
                  <div class="ml-1 price text-xm text-price text-main priceSty">
                    <span>{{ (v.salePrice * v.stockQtysss).toFixed(2) }}</span>
                    <template v-if="v.integral > 0">
                      <span class="text-xs">{{
                        v.integralType | filterIntegralType
                      }}</span>
                      <span>{{ v.integral * v.stockQtysss }}</span>
                      <span class="text-xs">{{
                        $lance.getIntegralName()
                      }}</span>
                    </template>
                    <span class="text-marketPrice" v-if="v.marketPrice > v.salePrice">{{
                      `¥ ${v.marketPrice}`
                    }}</span>
                  </div>
                  <div class="addNumber">
                    <div class="subTotal"
                      @click="cartsubTotal(v.id)"
                      :style="'opacity:1;right:60px;transform: rotate(360deg);transition: 1s all;'">
                        <van-image
                          v-if="v.stockQtysss"
                          width="18"
                          height="18"
                          :src="require('@/assets/images/goodssub.png')"
                        />
                    </div>
                    <div class="total"
                      :style="'opacity:1;transition: 1.6s all; left: 83%'">
                      {{v.stockQtysss}}
                    </div>
                    <div class="addTotal" @click="cartaddTotal(v.id)">
                      <van-image
                          width="18"
                          height="18"
                          :src="require('@/assets/images/goodsadd.png')"
                        />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
				</div>
			</div>
    </van-popup>
    <!-- sku弹框 -->
    <van-popup
        v-model="openSku"
        round
        closeable
        position="bottom"
        style="bottom: 25px"
        :close-on-popstate="true"
      >
        <div class="skuname">
          <img :src="storeGoodsBaseData.goodsIcon" @click="skuImgShowClick" />
          <div class="skutext">
            <p class="fs-14 color-text fw-700">{{ storeGoodsBaseData.goodsName }}</p>
            <div class="price text-price text-main">
              <span>{{ goodsDataSalePrice }}</span>
            </div>
            <div class="skulist">
              已选择&nbsp;<span>{{ goodsDataSkuName }}</span>
            </div>
          </div>
        </div>
        <div class="ml-3">
          <div class="fs-14 color-text">
            选择规格:
          </div>
          <div
            v-for="(v, i) in goodsData"
            :key="i"
            class="vanbut"
            :class="[isActivate === i ? 'activeClass' : 'noActiveClass']"
            @click="cutSKU(i)"
          >
            {{ v.skuName }}
          </div>
        </div>
        <van-button
          color="linear-gradient(180deg, #F1722C 0%, #EB6133 100%)"
          block
          size="small"
          round
          @click="addStoreGoods"
          class="mt-8 mb-6 but"
          >添加</van-button
        >
      </van-popup>
     <!-- 规格图片预览 -->
    <van-image-preview
      v-model="skuImgShow"
      :images="skuImgList"
      @change="onChangeSKUImg"
      closeable
      :loop="false"
      :start-position="index"
      @close="closePreview"
    >
      <template v-slot:index>{{ goodsDataSkuName }}</template>
    </van-image-preview>
  </div>
</template>

<script>
// import BScroll from 'better-scroll'
export default {
  name: 'addStoreGoodsBase',
  data () {
    return {
      storeInfo: {},
      favorCount: '',
      isFavor: false,
      active: 0,
      isActivateSidebar: 0,
      currentIndex: 0,
      sidebarName: '',
      sidebarList: [],
      loading: false,
      finished: false,
      goodsList: [],
      dataOK: true,
      goodsName: '',
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        level1CategoryId: null,
        goodsName: null
      },
      storeGoodsBaseData: {}, // 店铺商品基础数据
      goodsData: [], // 规格
      detailImgList: [],
      goodsDataSkuImg: '',
      goodsDataSalePrice: null,
      goodsDataIntegral: null,
      goodsDataAmount: null,
      goodsDataSkuName: null,
      goodsDataIntegralType: null,
      quota: 1, // 限购数量
      skuColor: '', // #EB6133
      isActivate: 0,
      skuImgList: [], // 规格图片预览图列表
      skuImgShow: false,
      index: 0,
      openSku: false,
      openScart: false,
      categoryGoodsList: [], // 分类商品列表
      heightList: [0], // 存储某个分类下的商品高度列表
      cartList: [],
      sumObj: {
        amount: 0,
        integral: 0
      }
    }
  },
  computed: {},
  watch: {
  },
  created () {
    // this.get()
    this.storeId = this.$route.query.storeId
    this.getStoreInfoAndFavor()
    this.getCategoryGoods()
  },
  mounted () {
    this.$nextTick(() => {
      this.scrollInit()
    })
  },
  destroyed () {
    this.rightBox.removeEventListener('scroll', this.scrollInit)
  },
  updated () {
    this.heightList = [0]
    this.$refs.goodsList.forEach((el, index) => {
      this.heightList.push(el.offsetHeight + this.heightList[index])
    })
  },
  methods: {
    // 是否关注店铺
    getStoreInfoAndFavor () {
      this.$http.post(
        this.$apiUri.APP_FOANDFAVOR,
        { storeId: this.storeId },
        res => {
          this.isFavor = res.data.isFavor
          this.favorCount = res.data.favorCount
          this.storeInfo = res.data.storeInfo
        }
      )
    },
    // 添加收藏
    addStore () {
      let obj = {}
      obj.storeId = this.storeInfo.id
      obj.storeName = this.storeInfo.storeName
      this.$http.post(this.$apiUri.APP_ADDSTORE, obj, res => {
        // console.log(res)
        if (res.success) {
          this.isFavor = true
          this.favorCount++
        }
      })
    },
    // 取消收藏
    delStore () {
      this.$http.post(
        this.$apiUri.APP_DELSTORE,
        { storeId: this.storeId },
        res => {
          console.log(res)
          this.isFavor = false
          this.favorCount--
        }
      )
    },
    // 初始化
    scrollInit () {
      this.rightBox = this.$refs.rightList
      this.rightBox.addEventListener('scroll', () => {
        this.heightList.filter((item, i) => {
          if (this.$refs.rightList.scrollTop >= this.heightList[i] && this.$refs.rightList.scrollTop < this.heightList[i + 1]) {
            this.isActivateSidebar = i
          }
        })
      })
    },
    // 移除一个商品数量
    subTotal (v, i) {
      let index = v
      let key = i
      this.cartList = this.mapList(index, key, 0)
      this.sumAmount()
    },
    // 添加一个商品数量
    addTotal (v, i) {
      console.log(v, i)
      let index = v
      let key = i
      this.cartList = this.mapList(index, key, 1)
      this.sumAmount()
    },
    cartaddTotal (e) {
      let id = e
      let arr = []
      this.categoryGoodsList.map((item, indexs) => {
        item.storeGoodsList.map((v, i) => {
          if (id === v.id) {
            if (v.stockQty > v.stockQtysss) {
              v.stockQtysss++
            } else {
              this.$toast('库存不够哦')
            }
          }
        })
        item.storeGoodsList.map(s => {
          if (s.stockQtysss > 0) {
            arr.push(s)
          }
        })
      })
      this.cartList = JSON.parse(JSON.stringify(arr))
      this.sumAmount()
    },
    cartsubTotal (e) {
      let id = e
      let arr = []
      this.categoryGoodsList.map((item) => {
        item.storeGoodsList.map((v, i) => {
          if (id === v.id) {
            if (v.stockQtysss > 0) {
              v.stockQtysss--
            } else {
              this.$toast('库存不够哦')
            }
          }
        })
        item.storeGoodsList.map(s => {
          if (s.stockQtysss > 0) {
            arr.push(s)
          }
        })
      })
      this.cartList = JSON.parse(JSON.stringify(arr))
      this.sumAmount()
      if (!this.cartList.length) {
        this.openScart = false
      }
    },
    mapList (index, key, type) {
      let arr = []
      this.categoryGoodsList.map((item, indexs) => {
        if (indexs == index) {
          item.storeGoodsList.map((v, i) => {
            if (key == i) {
              if (type) {
                if (v.stockQty > v.stockQtysss) {
                  v.stockQtysss++
                } else {
                  this.$toast('库存不够哦')
                }
              } else {
                if (v.stockQtysss > 0) {
                  v.stockQtysss--
                } else {
                  this.$toast('库存不够哦')
                }
              }
            }
          })
        }
        item.storeGoodsList.map(s => {
          if (s.stockQtysss > 0) {
            arr.push(s)
          }
        })
      })
      return arr
    },
    // 总价格， 总积分
    sumAmount () {
      this.sumObj.integral = 0
      this.sumObj.amount = 0
      this.cartList.map(item => {
        if (item.integralType == 0) {
          this.sumObj.integral -= item.integral * item.stockQtysss
        } else {
          this.sumObj.integral += item.integral * item.stockQtysss
        }
        this.sumObj.amount += item.salePrice * item.stockQtysss
        this.sumObj.amount.toFixed(2)
      })
    },
    // 搜索
    onSearch () {
      this.dataOK = true
      this.categoryGoodsList = []
      this.getCategoryGoods()
    },
    // 取消搜索
    onClear () {
      this.dataOK = true
      this.categoryGoodsList = []
      this.goodsName = null
      this.getCategoryGoods()
    },
    // 切换侧边栏
    onChange (index) {
      this.isActivateSidebar = index
      this.$nextTick(() => {
        this.$refs.rightList.scrollTop = this.heightList[index]
        // this.$refs.rightList.scrollTo(0, this.heightList[index], 600)
      })
    },
    // 打开sku弹框
    onOpenSku (item) {
      this.openSku = true
      this.storeGoodsBaseData = _.assign({}, item)
      // this.$http.post(
      //   this.$apiUri.APP_STORE_GOODS_BASESKU,
      //   { goodsId: item.id },
      //   res => {
      //     this.goodsData = res.data
      //     if (this.goodsData.length > 0) {
      //       this.goodsDataSkuImg = this.goodsData[0].skuImg
      //       this.goodsDataSalePrice = this.goodsData[0].salePrice
      //       this.goodsDataIntegral = this.goodsData[0].integral
      //       this.goodsDataAmount = this.goodsData[0].amount
      //       this.goodsDataSkuName = this.goodsData[0].skuName
      //       this.quota = this.goodsData[0].quota
      //       this.goodsDataIntegralType = this.goodsData[0].integralType
      //       this.isActivate = 0
      //       this.skuImgList = this.goodsData.map(item => item.skuImg)
      //     }
      //   }, err => {
      //     this.$toast(err.message)
      //   }
      // )
    },
    /* 打开购物车弹窗 */
    showService () {
      this.openScart = true
    },
    // 去结算
    toSettle () {
      console.log(this.cartList)
      this.$lance.setJson('buy_storeGoods', this.cartList)
      this.$router.push({
        path: '/confirmOrder'
      })
    },
    // 点击缩略图打开规格预览图
    skuImgShowClick () {
      if (this.skuImgList.length > 0) {
        this.skuImgShow = true
      }
    },
    // 预览规格图片切换
    onChangeSKUImg (index) {
      // console.log(index);
      this.goodsDataSkuName = this.goodsData.map(item => item.skuName)[index]
    },
    // 关闭规格预览图,切换规格数据
    closePreview (i) {
      this.isActivate = i.index
      this.goodsDataSkuImg = this.goodsData[i.index].skuImg
      this.goodsDataSalePrice = this.goodsData[i.index].salePrice
      this.goodsDataIntegral = this.goodsData[i.index].integral
      this.goodsDataIntegralType = this.goodsData[i.index].integralType
      this.goodsDataAmount = this.goodsData[i.index].amount
      this.goodsDataSkuName = this.goodsData[i.index].skuName
      this.quota = this.goodsData[i.index].quota
      this.index = i.index
    },
    // 切换商品规格
    cutSKU (i) {
      this.isActivate = i
      this.goodsDataSkuImg = this.goodsData[i].skuImg
      this.goodsDataSalePrice = this.goodsData[i].salePrice
      this.goodsDataIntegral = this.goodsData[i].integral
      this.goodsDataIntegralType = this.goodsData[i].integralType
      this.goodsDataAmount = this.goodsData[i].amount
      this.goodsDataSkuName = this.goodsData[i].skuName
      this.quota = this.goodsData[i].quota
      this.index = i
    },
    // 获取分类商品列表
    getCategoryGoods () {
      this.$http.post(
        this.$apiUri.APP_STORE_GOODS_LIST,
        { storeId: this.storeId },
        res => {
          let that = this
          this.categoryGoodsList = res.data ? res.data : []
          this.dataOK = false
          that.categoryGoodsList.map(function (item) {
            item.storeGoodsList.map(function (v) {
              v.stockQtysss = 0
            })
          })
          console.log(that.categoryGoodsList)
        }, err => {
          this.dataOK = true
          this.$toast(err.message)
        }
      )
    },
    // 添加店铺商品
    addStoreGoods () {
      let queryParams = { ...this.storeGoodsBaseData }
      queryParams.storeId = this.$lance.getJson('storeInfo').storeId
      queryParams.storeName = this.$lance.getJson('storeInfo').storeName
      queryParams.ids = [this.goodsData[this.isActivate].id]
      this.$http.post(
        this.$apiUri.APP_STORE_GOODSADD,
        queryParams,
        res => {
          this.$toast('添加成功')
          this.openSku = false
        }, err => {
          this.$toast(err.message)
        }
      )
    },
    toOrderDetails (v) {}
  }
}
</script>
<style lang='scss' scoped>
.custom-image {
  margin-top: 166px;
}
// 顶部
.user-header {
  width: 100%;
  background: #fff;
  display: flex;
  flex-direction: column;
  padding: 15px 14px;
  color: #ffffff;
  position: fixed;
  top: 45px;
  z-index: 99;
}

.user-header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.left {
  display: flex;
  align-items: center;
  flex: 1;
}
.priceSty {
  width: 120px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.Ttonsis {
  width: 68px;
  height: 28px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  border-radius: 309px;
}
.yes {
  background: #f2f2f2;
  color: #666666;
}
.no {
  background: linear-gradient(180deg, #f1722c 0%, #eb6133 100%);
  color: #fff;
}
.avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  overflow: hidden;
}
.content {
  padding-left: 14px;
  padding-right: 14px;
  display: flex;
}
.userNub {
  font-size: 12px;
  font-weight: 300;
  color: #333333;
}
.username {
  max-width: 180px;
  font-size: 16px;
  color: #333333;
  vertical-align: top;
  font-weight: 700;
  margin-bottom: 8px;
  display: inline-block;
  overflow: hidden; //超出的文本隐藏
  text-overflow: ellipsis; //溢出用省略号显示
  white-space: nowrap; //溢出不换行
}
	.addNumber {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		margin-bottom: 10px !important;
		position: relative;
		// width: 80px;

		.subTotal {
			position: absolute;
			right: 0;
			opacity: 1;
			z-index: 10;
			transform: rotate(0deg);

		}

		.addTotal {
			position: absolute;
			right: 0;
			z-index: 20;
		}

		.total {
			position: absolute;
			left: 73%;
			top: 50%;
			opacity: 0;
			transform: translate(-50%, -50%);
		}

		div {
			display: flex;
			align-items: center;
			justify-content: center;
			margin-top: 0 !important;
		}
	}
  .footpopup {
    margin: 50px 12px;
    position: relative;
    .selected {
      text-align: center;
      margin-bottom: 8px;
    }
    .goodsInfos {
      width: 230px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .foodcard {
      margin-left: 12px;
    }
  }
	.foot {
    width: 100%;
		height: 50px;
    background-color: #fff;
    z-index: 9999;
    position: fixed;
    bottom: 0;
		.foot-flex {
			display: flex;
			justify-content: space-between;
			align-items: center;

			.left {
				display: flex;
				align-items: center;

				.img {
					margin-left: 14px;
					position: relative;

					image {
						width: 48px;
						height: 48px;
					}

					.num {
						position: absolute;
						top: 3px;
						right: -4px;
						width: 12px;
						height: 12px;
						background: #F55026;
						border-radius: 50%;
						font-size: 9px;
						color: #FFFFFF;
						text-align: center;
						line-height: 12px;
					}
				}

				.price {
					margin-left: 8px;

					.top {
						.sale {
							font-size: 15px;
							font-weight: 500;
							color: #333333;
						}

						.orig {
							font-size: 11px;
							font-weight: 300;
							color: #999999;
						}
					}

					.bottom {
						font-size: 10px;
						text-align: left;
						font-weight: 300;
						color: #333333;
					}
				}
			}

			.buy {
				margin-right: 14px;
				width: 110px;
				height: 38px;
				background-color: #ed6c2f;
				border-radius: 19px;
				font-size: 15px;
				font-weight: 300;
				color: #FFFFFF;
				text-align: center;
				line-height: 38px;
			}

			.nogoods {
				margin-right: 14px;
				width: 110px;
				height: 38px;
				background-color: #c0c2c1;
				border-radius: 19px;
				font-size: 15px;
				font-weight: 300;
				color: #FFFFFF;
				text-align: center;
				line-height: 38px;
			}
		}
	}
.core-container {

  .scroll-wrapper {
    width: 100px;
    height: calc(100vh - 46px);
    position: relative;
    overflow: hidden;
    .scroll-item {
      height: 50px;
      line-height: 50px;
      font-size: 24px;
      font-weight: bold;
      text-align: center;
    }
  }
}
// @import url(); 引入公共css类
.addStoreGoodsBase {
  /deep/ .van-nav-bar__title {
    font-weight: 300;
    max-width: 100%;
    .van-search {
      padding: 0;
    }
  }
  /deep/ .van-tabs__wrap {
    height: 100%;
    .van-tabs__nav {
      display: flex;
      flex-direction: column;
      .van-tab {
        width: 100px;
        font-size: 13px;
        font-weight: 700;
        padding: 16px 14px;
      }
    }
  }
  /deep/ .van-sidebar {
    width: 100px;
    .van-sidebar-item__text {
      font-size: 13px;
    }
    .van-sidebar-item--select {
      color: #eb6133;
    }
    .van-sidebar-item {
      padding-right: 0;
    }
  }
  // .list {
  //   height: calc(100vh - 46px);
  //   overflow-y:scroll;
  //   .sidebar {
  //     width: 100px;
  //   }
  // }
  .sidebar {
    width: 100px;
    // height: calc(100vh - 46px);
    overflow-y:scroll;
    position: fixed;
    top: 150px;
    bottom: 50px;
    ul {
      width: 100px;
      li {
        font-size: 13px;
        padding: 15px 12px;
        font-weight: 700;
      }
    }
  }
  .isFixed {
    background: #fff;
    color: #eb6133;
  }
  .isHide {
    background: #f8f8f8;
    color: #333;
  }
  .center {
    padding: 114px 14px 74px 14px;
    background: #FFFFFF;
    margin-left: 100px;
    height: calc(100vh - 46px);
    overflow-y:scroll;
  }
  .scrollText {
    padding: 10px 0 16px;
  }
  .card {
    width: 100%;
    height: 100%;
    padding-bottom: 16px;
    .goods-thumb {
      width: 88px;
      height: 88px;
      border-radius: 4px;
      margin-right: 12px;
    }
    .goodsInfo {
      width: 158px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .title {
      font-size: 14px;
      color: #333;
      font-weight: 700;
      display: -webkit-box;
      overflow: hidden;
      text-overflow: ellipsis;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
    .guige {
      width: 56px;
      height: 20px;
      font-size: 11px;
      background: linear-gradient(180deg, #F1722C 0%, #EB6133 100%);
      border-radius: 19px;
      line-height: 20px;
      color: #fff;
      text-align: right;

    }
  }
    .skutext {
    margin-top: 18px;
    margin-left: 12px;
  }

  .skulist {
    margin-top: 12px;
    font-size: 14px;
    color: #999999;
  }
  .skuname {
    display: flex;
    margin: 60px 14px 14px 14px;

    img {
      width: 100px;
      height: 100px;
      border-radius: 4px;
    }
  }
  .vanbut {
    max-width: 140px;
    height: 32px;
    font-size: 13px;
    margin: 12px 20px 0 0;
    border-radius: 30px;
    text-align: center;
    line-height: 32px;
    padding: 0 12px;
    display: inline-block;
    overflow: hidden; //超出的文本隐藏
    text-overflow: ellipsis; //溢出用省略号显示
    white-space: nowrap; //溢出不换行
  }

  .activeClass {
    border: 1px solid #eb6133;
    background: #ffebe4;
    color: #eb6133;
  }

  .noActiveClass {
    background: #f2f2f2;
    color: #666;
  }
}
</style>
