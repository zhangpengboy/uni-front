<template>
	<view v-if="isloading == 0">
		<!-- 顶部导航 -->
		<view class="topTabBar" :style="{ position: headerPosition, top: headerTop }">
			<!-- <view class="tabitem">
				<view class="grid" v-for="(grid, tbIndex) in tabType" :key="tbIndex" @tap="handleTabType(tbIndex)">
					<view class="text" :class="[tbIndex == tabTypeIndex ? 'on' : '']">{{ grid }}</view>
				</view>
			</view> -->
			<view class="orderitem">
				<view class="grid" v-for="(grid, tbIndex) in orderType" :key="tbIndex" @tap="handleTabNav(tbIndex)">
					<view class="text" :class="[tbIndex == tabbarIndex ? 'on' : '']">{{ grid }}</view>
				</view>
			</view>
		</view>
		<!-- 考虑非APP端长列表和复杂的DOM使用scroll-view会卡顿，所以漂浮顶部选项卡使用page本身的滑动 -->
		<view class="order-list">
			<view class="onorder" v-if="list.length == 0">
				<image :src="imgurl">
				</image>
				<view class="text">没有相关订单</view>
			</view>
			<view class="list" v-else>
				<!-- list  box-mt  -->
				<view class="main-wrap" v-for="(row, index) in list" :key="index" @click="toOrderDetail(row)">
					<view class="main-wrap-box">
						<view class="order-list-title">
							<view class="store">
								<image class="store-img" src="/static/img/logo.png"></image>
								<view class="store-name">
									{{row.saleStoreName == null ? row.storeName : row.saleStoreName}}
								</view>
							</view>
							<view class="status">{{statusMap[row.status]}}</view>
						</view>

						<view class="order-list-content">
							<view class="goods-img">
								<image class="image"
									:src="tabTypeIndex == 0 ? row.goodsSkuIcon : row.omsStreetOrderDetails[0].goodsImg">
								</image>
							</view>
							<view class="goods-detail">
								<view class="name">
									{{row.goodsName ? row.goodsName : row.omsStreetOrderDetails[0].goodsName}}
								</view>
								<view><text class="spec" v-if="!tabTypeIndex">规格：{{row.goodsSkuName}}</text></view>
								<view class="num num_right">数量： <text class="text-xs">x</text>
									{{row.goodsNum ? row.goodsNum : row.omsStreetOrderDetails[0].goodsNum}}
								</view>
								<view class="num">单价： <text class="text-xs">¥</text>
									{{row.salePrice ? row.salePrice : row.omsStreetOrderDetails[0].salePrice}}
								</view>
								<view class="num" v-if="!tabTypeIndex && row.integral > 0">
									<text>{{ row.integralType === 1 ? '赠送' : '抵扣' }}</text> ：{{row.integral}}
									<text class="text-xs">{{ $queue.getIntegralName() }}</text>
								</view>
								<view class="num" v-if="tabTypeIndex && row.omsStreetOrderDetails[0].integral > 0">
									<text>{{ row.omsStreetOrderDetails[0].integralType === 1 ? '赠送' : '抵扣' }}</text>
									：{{row.omsStreetOrderDetails[0].integral}}
									<text class="text-xs">{{ $queue.getIntegralName() }}</text>
								</view>
								<view class="num">运费： <text class="text-xs">¥</text> {{row.postage ? row.postage : 0 }}
								</view>
								<!-- <view class="price text-price text-main">
									<text>{{ row.salePrice }}</text>
									<template v-if="row.integral > 0">
										<text class="text-xs">{{ row.integralType | filterIntegralType }}</text>
										<text>{{ row.integral }}</text>
										<text class="text-xs">{{ $queue.getIntegralName() }}</text>
									</template>
								</view> -->
								<view class="price_total_r">
									<text class="totalAmount_l">{{ row.status == 0 || row.status == 4 ? '应付款' : '已付款' }}
									</text>
									<view class="price text-price text-main">
										<!-- <text class="text-b"> {{ row.totalAmount + row.postage }}</text> -->
										<text class="text-b"> {{ row.payAmount }}</text>
										<template v-if="!tabTypeIndex && row.integral > 0 && row.integralType === 0">
											<text class="text-xs">{{ row.integralType | filterIntegralType }}</text>
											<text>{{ row.integral * row.goodsNum }}</text>
											<text class="text-xs">{{ $queue.getIntegralName() }}</text>
										</template>
									</view>
								</view>
							</view>
						</view>

						<view class="order-list-btns">
							<template v-if="row.status == 0">
								<text class="btn" @click.stop="cancelOrder(row)">取消订单</text>
								<text class="btn main" @click.stop="toPayment(row)">立即付款</text>
							</template>
							<template v-if="row.status == 1">
								<!-- <text class="btn" @click.stop="toOrderDetail(row)">申请退款</text> -->
								<!-- <text class="btn main" @click.stop="remindDeliver(row)">提醒发货</text> -->
							</template>
							<template v-if="row.status == 2">
								<!-- <text class="btn">查看物流</text> -->
								<text class="btn main" @click.stop="confirmOrder(row)">确认收货</text>
							</template>
							<template v-if="row.status == 3">
								<!-- <text class="btn main" @click.stop="toOrderDetail(row)">申请退款</text> -->
								<!-- <text class="btn">评价</text> -->
								<!-- <text class="btn main">再次购买</text> -->
							</template>
						</view>

					</view>
				</view>
				<!-- 状态 -->
				<view class="cu-load" :class="listQuery.isfinish ? 'over' : 'loading'"></view>
			</view>
		</view>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				imgurl: '',
				isloading: 1,
				headerPosition: 'fixed',
				headerTop: '0px',
				statusMap: {
					0: '待付款',
					1: '待发货',
					2: '待收货',
					3: '已完成',
					4: '已关闭',
					5: '无效订单',
					6: '已退款',
					7: '退款中'
				},
				tabType: ['精品订单', '街市订单'],
				orderType: ['全部', '待付款', '待发货', '待收货', '已完成', '退换货'],
				list: [],
				tabTypeIndex: 0, // 默认精品订单
				tabbarIndex: 0,
				// 查询条件
				listQuery: {
					statusList: [], // 订单状态 0->待付款；1->待发货；2->已发货；3->已完成；4->已关闭；5->无效订单；6->已退款
					pageNum: 1,
					pageSize: 10,
					isfinish: false,
					// bsType: 'userOrder'
				}
			};
		},
		onLoad(option) {
			//option为object类型，会序列化上个页面传递的参数
			// console.log(option.tab)
			this.tabbarIndex = option.tab || 0;
			if (option.tab == 5) {
				this.listQuery.statusList = [6, 7];
			} else if (option.tab == undefined) {
				this.listQuery.statusList = [0,1,2,3,4,5,6,7]
			}else {
				this.listQuery.statusList = [option.tab - 1];
			}
			// this.getGoodsOrderList();
			//兼容H5下排序栏位置
			// #ifdef H5
			let Timer = setInterval(() => {
				let uniHead = document.getElementsByTagName('uni-page-head');
				if (uniHead.length > 0) {
					this.headerTop = uniHead[0].offsetHeight + 'px';
					clearInterval(Timer); //清除定时器
				}
			}, 1);
			// #endif
		},
		onShow() {
			this.imgurl = `${this.$queue.publicCdnHost()}/assets/imgs/no_order.png`
			this.listQuery.pageNum = 1;
			this.listQuery.isfinish = false;
			this.list = [];
			this.getGoodsOrderList();
		},
		onPageScroll(e) {
			return;
			//兼容iOS端下拉时顶部漂移
			this.headerPosition = e.scrollTop >= 0 ? 'fixed' : 'absolute';
		},
		//下拉刷新，需要自己在page.json文件中配置开启页面下拉刷新 "enablePullDownRefresh": true
		onPullDownRefresh() {
			this.listQuery.pageNum = 1;
			this.listQuery.isfinish = false;
			this.list = [];
			this.getGoodsOrderList();
			// setTimeout(function() {
			// 	uni.stopPullDownRefresh();
			// }, 1000);
		},
		//上拉加载，需要自己在page.json文件中配置"onReachBottomDistance"
		onReachBottom() {
			this.listQuery.pageNum++;
			this.getGoodsOrderList();
		},
		methods: {
			/* 获取订单列表 */
			async getGoodsOrderList() {
				if (this.listQuery.isfinish) return;
				this.$queue.showLoading("加载中...")
				let result = null;
				if (this.tabTypeIndex == 0) {
					result = await this.$http.getGoodsOrderList(this.listQuery);
				} else {
					result = await this.$http.pageListByUser(this.listQuery);
				}
				uni.hideLoading();
				uni.stopPullDownRefresh();
				this.isloading = 0
				if (!result.success) {
					return this.$queue.showToast(result.message);
				}
				this.list = _.concat(this.list, result.data.list);
				if (result.data.pageNum == result.data.totalPage || _.size(result.data.list) == 0) {
					this.listQuery.isfinish = true;
				}
			},
			/* 获取订单详情 */
			async getGoodsOrderDetail(orderNo) {
				let result = null;
				if (!this.tabTypeIndex) {
					result = await this.$http.getGoodsOrderDetail({
						orderNo
					});
					if (!result.success) {
						return this.$queue.showToast("获取订单信息失败");
					}
					this.$queue.setJson("pay_order", [result.data]);
					uni.redirectTo({
						url: '/sub/pays/payment/payment?pageType=1'
					});
				} else {
					result = await this.$http.getStreetOrderByOrderNo({
						parentNo: orderNo
					});
					if (!result.success) {
						return this.$queue.showToast("获取订单信息失败");
					}
					this.$queue.setJson("pay_order", result.data);
					uni.redirectTo({
						url: '/sub/pays/payment/payment'
					});
				}

			},
			/* 切换订单操作 */
			handleTabType(tbIndex) {
				console.log(tbIndex)
				this.tabTypeIndex = tbIndex
				this.tabbarIndex = 0;
				this.list = [];
				this.listQuery.pageNum = 1;
				this.listQuery.isfinish = false;
				this.listQuery.statusList = [];
				this.getGoodsOrderList();
			},
			/* 点击顶部导航栏操作 */
			handleTabNav(tbIndex) {
				this.tabbarIndex = tbIndex;
				this.list = [];
				this.listQuery.pageNum = 1;
				this.listQuery.isfinish = false;
				if (tbIndex == 0) {
					this.listQuery.statusList = [0,1,2,3,4,5,6,7]
				} else if (tbIndex == 5) {
					this.listQuery.statusList = [6, 7];
				} else {
					this.listQuery.statusList = [tbIndex - 1];
				}
				this.getGoodsOrderList();
			},
			/* 提醒商家发货 */
			remindDeliver(row) {
				this.$queue.showLoading("加载中...");
				setTimeout(() => {
					// this.$queue.showToast("已提醒商家发货");
					wx.showToast({
						title: '已提醒商家发货',
						icon: 'none',
						duration: 2000
					})
					uni.hideLoading();
				}, 1000);
			},
			/* 取消订单 */
			cancelOrder(row) {
				uni.showModal({
					title: '取消订单',
					content: '确定取消此订单？',
					success: res => {
						if (res.confirm && this.tabTypeIndex == 0) {
							this.$http.concelGoodsOrder({
								orderNo: row.orderNo
							}).then(result => {
								if (!result.success) {
									return this.$queue.showToast(result.message);
								}
								this.$queue.showToast("取消成功");
								this.listQuery.pageNum = 1;
								this.listQuery.isfinish = false;
								this.list = [];
								this.getGoodsOrderList();
							})
						} else if (res.confirm && this.tabTypeIndex) {
							this.$http.streetOrderCancel({
								parentNo: row.orderParent
							}).then(result => {
								if (!result.success) {
									return this.$queue.showToast(result.message);
								}
								this.$queue.showToast("取消成功");
								this.listQuery.pageNum = 1;
								this.listQuery.isfinish = false;
								this.list = [];
								this.getGoodsOrderList();
							})
						}
					}
				});
			},
			/* 确认收货 */
			confirmOrder(row) {
				uni.showModal({
					title: '确认收货',
					content: '是否确定收货？',
					success: res => {
						if (res.confirm && !this.tabTypeIndex) {
							this.$http.confirmGoodsOrder({
								orderNo: row.orderNo
							}).then(result => {
								if (!result.success) {
									return this.$queue.showToast(result.message);
								}
								this.$queue.showToast("确认成功");
								this.listQuery.pageNum = 1;
								this.listQuery.isfinish = false;
								this.list = [];
								this.getGoodsOrderList();
							})
						} else if (res.confirm && this.tabTypeIndex) {
							this.$http.streetOrderConfirm({
								parentNo: row.orderParent
							}).then(result => {
								if (!result.success) {
									return this.$queue.showToast(result.message);
								}
								this.$queue.showToast("确认成功");
								this.listQuery.pageNum = 1;
								this.listQuery.isfinish = false;
								this.list = [];
								this.getGoodsOrderList();
							})
						}
					}
				});
			},
			/* 去支付 */
			toPayment(row) {
				console.log('row:', row)
				let orderNo = ''
				// if (row.orderNo) {
				// 	orderNo = row.orderNo
				// } else {
				// 	orderNo = row.orderParent
				// }
				orderNo = row.orderNo
				this.getGoodsOrderDetail(orderNo);
			},
			/* 去订单详情 */
			toOrderDetail(row) {
				if (!this.tabTypeIndex) {
					uni.navigateTo({
						url: '/sub/orders/orderDetail/orderDetail?orderNo=' + row.orderNo + '&orderParent=' + row.orderParent
					});
				} else {
					uni.navigateTo({
						url: '/sub/orders/orderDetail/orderDetail?orderParent=' + row.orderParent
					});
				}
			}
		}
	};
</script>

<style lang="scss" scoped>
	@import "../static/css/order-list.scss";
	
 .box-mt {
	 margin-top: 100upx;
 }
</style>
