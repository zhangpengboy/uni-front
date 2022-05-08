<template>
	<view v-if="hasLogin">
		<!-- 购物车列表 -->
		<view class="cart-list">
			<view class="main-wrap" v-for="(item,index) in cartList" :key="index">
				<view class="main-wrap-box list">
					<view class="check" @click.stop="handlerSelectOne(item, index)">
						<text class="iconfont" :class="item.active ? 'icon-checked' :'icon-check'"></text>
					</view>
					<view class="goods" @click="toGoodsDetail(item.goodsId)">
						<view class="thumb">
							<image :src="item.skuIcon"></image>
						</view>
						<view class="item">
							<view class="title">
								<text class="two-omit">{{item.goodsName}}</text>
							</view>
							<view class="attribute">
								<view class="attr">
									<text>{{item.skuName}}</text>
								</view>
							</view>
							<view class="price-num text-main">
								<view class="text-price">
									<text>{{item.salePrice}}</text>
									<template v-if="item.integral > 0">
										<text class="text-xs">{{ item.integralType | filterIntegralType }}</text>
										<text>{{ item.integral }}</text>
										<text class="text-xs">{{$queue.getIntegralName()}}</text>
									</template>
								</view>
								<view class="num">
									<view class="add" @click.stop="handlerJian(item, index)">
										<text class="iconfont icon-jian"></text>
									</view>
									<view class="number">
										<text>{{item.num}}</text>
									</view>
									<view class="add" @click.stop="handlerJia(item, index)">
										<text class="iconfont icon-jia"></text>
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
				<view class="total">
					<text>合计：</text>
					<text class="price text-price">{{sumAmount}}</text>
				</view>
			</view>
			<view class="account">
				<view class="btn-del" @click="handlerDel" v-if="activeNumber > 0">
					<text class="del">删除</text>
				</view>
				<view class="btn-calculate" @click="toOrderConfirm">
					<text>去结算({{activeNumber}})</text>
				</view>
			</view>
		</view>
	</view>
	<view class="not-login" v-else>
		<Empty description="购物车 空空如也~"></Empty>
		<view class="flex justify-center">
			<navigator open-type="switchTab" url="/pages/home/home" class="cu-btn round padding-lr-xl line-red margin-lr">去逛逛</navigator>
			<navigator url="/pages/login/login" class="cu-btn round padding-lr-xl bg-main margin-lr">去登录</navigator>
		</view>
	</view>
</template>

<script>
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
			};
		},
		computed: {
			// 总价格
			sumAmount: function() {
				let amount = 0;
				amount = _.sum(this.cartList.filter(v => v.active).map(v => v.salePrice * v.num));
				return amount;
			},
			// 是否全选
			isSelectAll: function() {
				if (_.size(this.cartList) === 0) return false;
				const NoArray = _.filter(this.cartList, v => !v.active);
				return _.size(NoArray) === 0
			},
			// 选择商品数量
			activeNumber: function() {
				const Sum = _.size(_.filter(this.cartList, v => v.active));
				return Sum < 100 ? Sum : "99+";
			}
		},
		onShow() {
			if (this.hasLogin) {
				this.queryParams.pageNum = 1;
				this.queryParams.isfinish = false;
				this.cartList = [];
				this.getCartList();
			}
		},
		/* 下拉刷新 */
		onPullDownRefresh() {
			this.$queue.showLoading();
			this.queryParams.pageNum = 1;
			this.queryParams.isfinish = false;
			this.cartList = [];
			this.getCartList();
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
			/* 获取购物车列表 */
			async getCartList() {
				if (this.queryParams.isfinish) return;
				const result = await this.$http.getGoodsCartList(this.queryParams);
				uni.hideLoading();
				uni.stopPullDownRefresh();
				if (!result.success) {
					return this.$queue.showToast("网络请求失败")
				}
				this.cartList = []
				result.data.list.map(v => v.active = false)
				this.cartList = _.concat(this.cartList, result.data.list);
				if (result.data.totalPage == this.queryParams.pageNum || _.size(result.data.list) === 0) {
					this.queryParams.isfinish = true;
				}
			},
			/* 单选操作 */
			handlerSelectOne(goods, index) {
				this.$set(this.cartList[index], 'active', !goods.active);
			},
			/* 全选操作 */
			handlerSelectAll() {
				// 判断是否全选
				if (this.isSelectAll) {
					this.cartList.map(v => v.active = false)
				} else {
					this.cartList.map(v => v.active = true)
				}
			},
			/* 数量减操作 */
			handlerJian(goods, index) {
				if (goods.num <= 1) return false
				this.$set(this.cartList[index], 'num', goods.num - 1);
			},
			/* 数量加操作 */
			handlerJia(goods, index) {
				this.$set(this.cartList[index], 'num', goods.num + 1);
			},
			/* 删除操作 */
			handlerDel() {
				const that = this;
				const cartIds = that.cartList.filter(v => v.active).map(v => v.id);
				if (_.size(cartIds) == 0) return;
				uni.showModal({
					content: "您是否确定将商品移除购物车？",
					success(result) {
						console.log(999,result)
						if (result.confirm) {
							that.$http.delGoodsCart({
								cartIds: cartIds.toString()
							}).then(res => {
								console.log('jin')
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
				let goods = _.cloneDeep(this.cartList.filter(v => v.active))
				if(_.size(goods) == 0) return;
				this.$queue.setJson("buy_goods", goods);
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
