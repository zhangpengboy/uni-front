<template>
	<view v-if="hasLogin">
		<view class="editCart">
			<view class="">
				共{{ goodsCombined }}件商品
			</view>
			<view v-if="!managementFlag" class="editor" @click="managementFlag=true">
				管理购物车
			</view>
			<view v-if="managementFlag" class="editor" @click="managementFlag=false">
				完成
			</view>
		</view>
		<!-- 购物车列表 -->
		<view class="cart-list">
			<view class="main-wrap" v-for="(data,i) in cartList" :key="i">
				<view class="main-wrap-box store list">
					<view class="check" @click.stop="handlerSelectList(data, i)">
						<text class="iconfont" :class="data.storeActive ? 'icon-checked' :'icon-check'"></text>
					</view>
					<view @tap.stop="toStore(data.storeId)">
						<text class="storeName">{{ data.storeName }}</text>
						<image src="../../static/img/icon_enter@2x.png" mode=""></image>
					</view>
				</view>
				<view v-for="(item, index) in data.list" :key="index">
					<view class="main-wrap-box list">
						<view class="check height" @click.stop="handlerSelectOne(item, index, i)">
							<text class="iconfont" :class="item.active ? 'icon-checked' :'icon-check'"></text>
						</view>
						<view class="goods">
							<view class="thumb" @click="toGoodsDetail(item.goodsId)">
								<image :src="item.goodsIcon"></image>
							</view>
							<view class="item">
								<view class="title" @click="toGoodsDetail(item.goodsId)">
									<text class="two-omit">{{item.goodsName}}</text>
								</view>
								<view class="attribute" @click="toGoodsDetail(item.goodsId)">
									<view class="attr">
										<text>{{item.skuName}}</text>
									</view>
								</view>
								<view class="price-num text-main">
									<view class="left">
										<view class="text-price">
											<text>{{item.salePrice}}</text>
											<template v-if="item.integral > 0">
												<text
													class="text-xs">{{ item.integralType | filterIntegralType }}</text>
												<text>{{ item.integral }}</text>
												<text class="text-xs">{{$queue.getIntegralName()}}</text>
											</template>
										</view>
										<view class="vipPrice" v-show="item.numFlag">
											<text class="vipPrice-title">会员价</text>
											<view class="text-price">
												<text>{{item.vipPrice}}</text>
												<template v-if="item.integral > 0">
													<text
														class="text-xs">{{ item.integralType | filterIntegralType }}</text>
													<text>{{ item.integral }}</text>
													<text class="text-xs">{{$queue.getIntegralName()}}</text>
												</template>
											</view>
										</view>
									</view>
									<view class="right">
										<view class="x-btn" v-if="item.numFlag" @click.stop="switchNum(item, index, i)">
											<text>x{{item.goodsNum}}</text>
										</view>
										<view class="num" v-else>
											<view class="add" @click.stop="handlerJian(item, index, i)">
												<text class="iconfont icon-jian"></text>
											</view>
											<view class="number">
												<!-- <text>{{item.goodsNum}}</text> -->
												<input type="number" v-model="item.goodsNum"
													@blur.stop="onBlur(item, index, i)" />
											</view>
											<view class="add" @click.stop="handlerJia(item, index, i)">
												<text class="iconfont icon-jia"></text>
											</view>
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<!-- 状态 -->
			<view class="cu-load" :class="queryParams.isfinish ? 'over' : 'loading'"></view>
		</view>
		<!-- 结算 -->
		<view class="close-account">
			<view class="check-total">
				<view class="check" @click="handlerSelectAll">
					<text class="iconfont" :class="isSelectAll ? 'icon-checked': 'icon-check'"></text>
					<text class="all">全选</text>
				</view>
				<view v-if="!managementFlag">
					<view class="total">
						<text>合计：</text>
						<!-- <text class="price text-price">{{sumAmount}}</text> -->
						<view class="price-num text-main">
							<view class="text-price ">
								<text v-if="vipStatus == 1">{{ formatMoney(sumAmount + sumYf)}}</text>
								<text v-else>{{formatMoney(sumSaleAmount + sumYf)}}</text>
								<template v-if="sumIntegral > 0">
									<text class="text-xs">{{ (sumIntegral > 0 ? 0 : 1) | filterIntegralType }}</text>
									<text>{{ sumIntegral }}</text>
									<text class="text-xs">{{$queue.getIntegralName()}}</text>
								</template>
							</view>
						</view>
					</view>
					<view class="preferential" @click.stop="showService()">
						<text>共优惠</text>
						<view class="price-num text-main mr-4">
							<view class="text-price ">
								<text v-if="vipStatus == 1">{{formatMoney(sumPreferential)}}</text>
								<text v-else>0</text>
							</view>
						</view>
						<text class="text-main">金额明细</text>
						<image src="../../static/img/icon_enter_top@2x.png" mode=""></image>
					</view>
				</view>
			</view>
			<view class="account" v-if="!managementFlag">
				<view class="btn-calculate" @click="toOrderConfirm">
					<text>去结算({{activeNumber}})</text>
				</view>
			</view>
			<view class="account" v-else>
				<!-- <view class="move-favorites" @click="moveFavorites">
					<text>移入收藏夹</text>
				</view> -->
				<view class="btn-del" @click="handlerDel">
					<text class="del">删除</text>
				</view>
			</view>
		</view>
		<!-- 优惠-模态层弹窗 -->
		<view class="cu-modal bottom-modal" :class="serviceClass">
			<view class="cu-dialog goods-service top bg-white round-modal">
				<view class="cu-bar bg-white justify-end">
					<view class="action text-xl text-bold text-gray margin-right" @tap="hideService"><text
							class="cuIcon-close"></text></view>
				</view>
				<view class="bg-white goods-service-box">
					<view class="content">
						<view class="modal-title">
							金额明细
						</view>
						<view class="modal-cell">
							<text class="name">商品总价</text>
							<view class="price-num">
								<view class="text-price ">
									<text>{{formatMoney(sumSaleAmount)}}</text>
									<template v-if="sumIntegral > 0">
										<text
											class="text-xs">{{ (sumIntegral > 0 ? 0 : 1) | filterIntegralType }}</text>
										<text>{{ sumIntegral }}</text>
										<text class="text-xs">{{$queue.getIntegralName()}}</text>
									</template>
								</view>
							</view>
						</view>
						<view class="modal-cell" v-if="vipStatus == 1">
							<text class="name">会员优惠</text>
							<view class="price-num price">
								<text>-</text>
								<view class="text-price ">
									<text>{{formatMoney(sumPreferential)}}</text>
								</view>
							</view>
						</view>
						<view class="modal-cell">
							<text class="name">运费</text>
							<view class="price-num price">
								<text>+</text>
								<view class="text-price">
									<text>{{formatMoney(sumYf)}}</text>
								</view>
							</view>
						</view>
						<view class="modal-cell">
							<text class="name fw-700">合计</text>
							<view class="price-num text-r">
								<view class="text-price fw-700">
									<text v-if="vipStatus == 1">{{ formatMoney(sumAmount + sumYf)}}</text>
									<text v-else>{{formatMoney(sumSaleAmount + sumYf)}}</text>
									<template v-if="sumIntegral > 0">
										<text
											class="text-xs">{{ (sumIntegral > 0 ? 0 : 1) | filterIntegralType }}</text>
										<text>{{ sumIntegral }}</text>
										<text class="text-xs">{{$queue.getIntegralName()}}</text>
									</template>
								</view>
								<view class="price-preferential" v-if="vipStatus != 1">
									<text>会员价</text>
									<view class="price-num text-main">
										<view class="text-price ">
											<text>{{formatMoney(sumAmount + sumYf)}}</text>
											<template v-if="sumIntegral > 0">
												<text
													class="text-xs">{{ (sumIntegral > 0 ? 0 : 1) | filterIntegralType }}</text>
												<text>{{ sumIntegral }}</text>
												<text class="text-xs">{{$queue.getIntegralName()}}</text>
											</template>
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
					<view class="bottom">
						<!-- <view class="btn bg-main round" @tap="hideService">完成</view> -->
					</view>
				</view>
			</view>
		</view>
	</view>
	<view class="not-login" v-else>
		<Empty description="购物车 空空如也~"></Empty>
		<view class="flex justify-center">
			<navigator open-type="switchTab" url="/pages/exchange/exchange"
				class="cu-btn round padding-lr-xl line-red margin-lr">去逛逛</navigator>
			<navigator url="/pages/login/login" class="cu-btn padding-lr-xl bg-main margin-lr round">去登录</navigator>
		</view>
	</view>
</template>

<script>
	import {
		formatMoney
	} from '@/common/utils/MoneyUtils.js';
	import Empty from '@/components/empty'
	export default {
		components: {
			Empty
		},
		data() {
			return {
				queryParams: {
					pageNum: 1,
					pageSize: 10,
					isfinish: false
				},
				cartList: [], // 购物车列表
				activeList: [], // 已选购物商品列表
				serviceClass: '',
				managementFlag: false,
				goodsNum: null,
				vipStatus: null,
				goodsCombined: 0
			};
		},
		computed: {
			// 总vip价格
			sumAmount: function() {
				let amount = 0;
				let list = this.cartList.map(v => v.list.filter(e => e.active))
				list.map(v => {
					if (v.length > 0) {
						v.map(e => {
							amount += (e.vipPrice * e.goodsNum)
						})
					}
				})
				return amount;
			},
			// 总salePrice价格
			sumSaleAmount: function() {
				let amount = 0;
				let list = this.cartList.map(v => v.list.filter(e => e.active))
				list.map(v => {
					if (v.length > 0) {
						v.map(e => {
							amount += (e.salePrice * e.goodsNum)
						})
					}
				})
				return amount;
			},
			// 运费
			sumYf: function() {
				let amount = 0;
				let list = this.cartList.map(v => v.list.filter(e => e.active))
				list.map(v => {
					if (v.length > 0) {
						v.map(e => {
							amount += e.postage
						})
					}
				})
				return amount;
			},
			// 总优惠
			sumPreferential: function() {
				let amount = 0;
				let list = this.cartList.map(v => v.list.filter(e => e.active))
				list.map(v => {
					if (v.length > 0) {
						v.map(e => {
							amount += (e.salePrice * e.goodsNum)
						})
					}
				})
				return amount - this.sumAmount;
			},
			//总礼券
			sumIntegral: function() {
				let amount = 0;
				let list = this.cartList.map(v => v.list.filter(e => e.active))
				list.map(v => {
					if (v.length > 0) {
						v.map(e => {
							if (e.integralType == 0) {
								amount += (e.integral * e.goodsNum)
							} else {
								amount -= (e.integral * e.goodsNum)
							}
						})
					}
				})
				// console.log(amount)
				return amount;
			},
			// 是否全选
			isSelectAll: function() {
				if (_.size(this.cartList) === 0) return false;
				let list = this.cartList.map(v => v.list.filter(e => !e.active))
				const NoArray = []
				list.map(v => {
					if (_.size(v) > 0) {
						v.map(e => {
							if (!e.active) {
								NoArray.push(e)
							}
						})
					}
				})
				return _.size(NoArray) === 0
			},
			// 选择商品数量
			activeNumber: function() {
				const num = this.cartList.map(v => v.list.filter(e => e.active)).filter(v => _.size(v) > 0)
				let Sum = 0
				num.map(v => {
					Sum += v.length
				})
				return Sum < 100 ? Sum : "99+";
			}
		},
		onShow() {
			if (this.hasLogin) {
				
				this.vipStatus = this.$queue.getData("vipStatus");
				this.queryParams.pageNum = 1;
				this.queryParams.isfinish = false;
				this.cartList = [];
				this.getCartList();
				this.getShoppingCartList()
			}
		},
		/* 下拉刷新 */
		onPullDownRefresh() {
			this.$queue.showLoading();
			this.queryParams.pageNum = 1;
			this.queryParams.isfinish = false;
			this.cartList = [];
			this.getCartList();
			this.getShoppingCartList()
			// setTimeout(function() {
			// 	uni.hideLoading();
			// 	uni.stopPullDownRefresh();
			// }, 1000);
		},
		/* 加载更多 */
		onReachBottom() {
			this.queryParams.pageNum++;
			this.getCartList();
		},
		methods: {
			formatMoney,
			/* 获取购物车列表 */
			async getShoppingCartList() {
				if (this.hasLogin) {
					const result = await this.$http.getShoppingCartList();
					if (result.success) {
						this.goodsCombined = result.data.total;
					}
				}
			},
			/* 打开优惠弹窗 */
			showService() {
				this.serviceClass = 'show';
			},
			/* 关闭优惠弹窗 */
			hideService() {
				this.serviceClass = 'hide';
				setTimeout(() => {
					this.serviceClass = 'none';
				}, 200);
			},
			/* 获取购物车列表 */
			async getCartList() {
				if (this.queryParams.isfinish) return;
				const result = await this.$http.getStoreShoppingCartList(this.queryParams);
				uni.hideLoading();
				uni.stopPullDownRefresh();
				if (!result.success) {
					return this.$queue.showToast("网络请求失败")
				}
				
				let goodsCartList = []
				Object.keys(result.data).forEach(function(key) {
					result.data[key].map(v => {
						v.active = false
						v.numFlag = true
					})
					goodsCartList.push({
						storeId: key.split('-')[0],
						storeName: key.split('-')[1],
						list: result.data[key],
						storeActive: false
					})
				});
				this.cartList = _.concat(this.cartList, goodsCartList);
				// console.log(this.cartList)
				if (result.data.totalPage == this.queryParams.pageNum || _.size(result.data.list) === 0) {
					this.queryParams.isfinish = true;
				}
			},
			// 跳转店铺
			toStore(storeId) {
				uni.navigateTo({
					url: "/sub/stores/store/storeDetail?storeId=" + storeId
				});
			},
			// 切换 数量加减组件
			switchNum(item, index, i) {
				// this.$set(this.cartList[i].list[index], 'numFlag', false)
				this.cartList.map(v => {
					v.list.map((e, n) => {
						if (n == index) {
							this.$set(this.cartList[i].list[index], 'numFlag', false)
						} else {
							this.$set(v.list[n], 'numFlag', true)
						}
					})
				})
			},

			/* 店铺单选操作 */
			handlerSelectList(goods, index) {
				const that = this
				that.$set(that.cartList[index], 'storeActive', !goods.storeActive);
				goods.list.map((v, i) => {
					that.$set(goods.list[i], 'active', goods.storeActive)
				})

			},
			/* 商品单选操作 */
			handlerSelectOne(goods, index, i) {
				this.$set(this.cartList[i].list[index], 'active', !goods.active);
				const len = this.cartList[i].list.filter(v => v.active).length
				if (len < this.cartList[i].list.length) {
					this.$set(this.cartList[i], 'storeActive', false)
				} else {
					this.$set(this.cartList[i], 'storeActive', true)
				}
				// console.log(this.cartList[i].list.filter(v => v.active))
			},
			/* 全选操作 */
			handlerSelectAll() {
				// 判断是否全选
				if (this.isSelectAll) {
					this.cartList.map(v => {
						v.storeActive = false
						v.list.map(e => e.active = false)
					})
				} else {
					this.cartList.map(v => {
						v.storeActive = true
						v.list.map(e => e.active = true)
					})
				}
			},
			/* 数量减操作 */
			handlerJian(goods, index, i) {
				if (goods.goodsNum <= 1) return this.$queue.showToast("商品数量不能减为0")
				const query = _.assign({}, goods)
				query.ids = [goods.id]
				query.operNum = -1
				// console.log(query)
				this.$http.addAndSubCartNum(query).then(res => {
					if (res.success) {
						this.$queue.showToast("商品数量-1")
						this.$set(this.cartList[i].list[index], 'goodsNum', goods.goodsNum - 1);
					} else {
						this.$queue.showToast(res.message)
					}
				}).catch(err => {
					this.$queue.showToast(err.message)
				})
			},
			/* 数量加操作 */
			handlerJia(goods, index, i) {
				if (goods.goodsNum > goods.stock && goods.goodsNum > goods.quota) {
					return this.$queue.showToast("添加数量超过库存或超过限购数量")
				}
				const query = _.assign({}, goods)
				query.ids = [goods.id]
				query.operNum = 1
				// console.log(query)
				this.$http.addAndSubCartNum(query).then(res => {
					if (res.success) {
						this.$queue.showToast("商品数量+1")
						this.$set(this.cartList[i].list[index], 'goodsNum', goods.goodsNum + 1);
					} else {
						this.$queue.showToast(res.message)
					}
				}).catch(err => {
					this.$queue.showToast(err.message)
				})
			},
			// 数量输入框操作
			onBlur(item, index, i) {
				// console.log(this.cartList[i].list[index].goodsNum)
				// console.log(this.goodsNum)
				if (item.goodsNum == 0) return this.$queue.showToast("输入数量不能为0");
				if (item.goodsNum > item.stock && item.goodsNum > item.quota) {
					this.$set(this.cartList[i].list[index], 'goodsNum', 1);
					return this.$queue.showToast("输入数量超过库存或超过限购数量")
				}
				const query = _.assign({}, item)
				query.ids = [item.id]
				query.goodsNum = item.goodsNum
				this.$http.addAndSubCartNum(query).then(res => {
					if (res.success) {
						this.$queue.showToast("商品数量添加成功")
						this.$set(this.cartList[i].list[index], 'goodsNum', item.goodsNum);
					} else {
						this.$set(this.cartList[i].list[index], 'goodsNum', 1);
						this.$queue.showToast(res.message)
					}
				}).catch(err => {
					this.$queue.showToast(err.message)
				})
			},
			// 移入收藏夹操作
			moveFavorites() {
				if (this.activeNumber == 0) {
					return this.$queue.showToast("请勾选商品~");
				}
				const that = this;
				let data = this.cartList.map(v => v.list.filter(e => e.active)).filter(v => _.size(v) > 0)
				// console.log(data)
				let cartIds = []
				data.map(v => v.map(e => cartIds.push(e.id)));
				// console.log(cartIds)
				this.$http.addGoodsFavorBatch({
					ids: cartIds,
				}).then(res => {
					this.$queue.showToast("移入收藏夹成功")
				})
			},
			/* 删除操作 */
			handlerDel() {
				if (this.activeNumber == 0) {
					return this.$queue.showToast("请勾选商品~");
				}
				const that = this;
				let data = this.cartList.map(v => v.list.filter(e => e.active)).filter(v => _.size(v) > 0)
				// console.log(data)
				let cartIds = []
				data.map(v => v.map(e => cartIds.push(e.id)));
				// console.log(cartIds)
				if (_.size(cartIds) == 0) return;
				uni.showModal({
					content: "您是否确定将商品移除购物车？",
					success(result) {
						// console.log(999,result)
						if (result.confirm) {
							that.$http.delShoppingCart({
								ids: cartIds
							}).then(res => {
								// console.log('jin')
								that.goodsCombined = 0
								that.cartList = [];
								that.queryParams.pageNum = 1;
								that.queryParams.isfinish = false;
								that.getCartList();
							})
						}
					}
				})
			},
			/* 跳转结算页面 */
			toOrderConfirm() {
				if (this.activeNumber == 0) {
					return this.$queue.showToast("请勾选商品~");
				}
				const that = this;
				let data = this.cartList.map(v => v.list.filter(e => e.active)).filter(v => _.size(v) > 0)
				let cartGoods = []
				data.map(v => v.map(e => cartGoods.push(e)));
				if (_.size(cartGoods) == 0) return;
				this.$queue.setJson("buy_goods", cartGoods);
				let cartIds = []
				data.map(v => v.map(e => cartIds.push(e.id)));
				if (_.size(cartIds) == 0) return;
				this.$queue.setJson("buy_goods_ids", cartIds);
				const statistical = {
					sumAmount: this.sumAmount,
					sumSaleAmount: this.sumSaleAmount,
					sumYf: this.sumYf,
					sumPreferential: this.sumPreferential,
					sumIntegral: this.sumIntegral,
				}
				this.$queue.setJson("cart_goods_statistical", statistical);
				uni.navigateTo({
					url: '/sub/orders/confirmation/confirmation?type=carts'
				});
			},
			/* 跳转商品详情 */
			toGoodsDetail(goodsId) {
				this.$http.getGoodsBase({
					goodsId
				}).then(res => {
					if (res.success) {
						uni.navigateTo({
							// url: "/sub/goods/detail/detail?" + this.$queue.stringify(res.data)
							url: "/sub/goods/detail/detail?goodsId=" + res.data.id
						});
					}
				})
			},
		},
	}
</script>

<style scoped lang="scss">
	@import 'cart.scss';
</style>
