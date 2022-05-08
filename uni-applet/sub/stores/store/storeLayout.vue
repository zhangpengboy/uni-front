<template>
	<view v-if="isloading == 0">
		<view v-if="list.length">
		<view class="store_top">
			<view class="left">
				<image src="/static/img/logo.png" class="storeImg"></image>
				<view class="store_name_favor">
					<view class="store_name">{{ storeInfo.storeName }}</view>
					<view class="store_favor">{{ favorCount > 0 ? favorCount : 0 }}人关注</view>
				</view>
			</view>
			<view class="store_but" :class="{favor1 : isFavor,favor: !isFavor}">
				<image src="../static/img/favor.png" v-if="!isFavor" class="store_favor_icon"></image>
				<text class="favor_txt" v-if="isFavor" @click="delStore">{{ '已关注' }}</text>
				<text class="favor_txt" v-else @click="addStore">{{ '关注' }}</text>
			</view>
		</view>
		<view class="VerticalBox">
			<scroll-view class="VerticalNav nav" scroll-y scroll-with-animation :scroll-top="verticalNavTop"
				style="height:calc(100vh - 304upx)">
				<view class="cu-item" :class="index!=tabCur?'text-topic cur':'clickon'" v-for="(item,index) in list"
					:key="index" @tap="TabSelect" :data-id="index">
					{{item.categoryName}}
				</view>
			</scroll-view>
			<scroll-view class="VerticalMain" scroll-y scroll-with-animation
				style="height:calc(100vh - 304upx);z-index: 99;" :scroll-into-view="'main-'+mainCur"
				@scroll="VerticalMain">
				<view class="" v-for="(item,index) in list" :key="index" :id="'main-'+index">
					<view class="cu-bar solid-bottom bg-white">
						<view class="action">
							<text class=""></text>{{item.categoryName}}
						</view>
					</view>
					<view class="cu-list menu-avatar radius-bottom">
						<view class="cu-item" v-for="(value,key) in item.storeGoodsList" :key="key">
							<view class="cu-avatar radius lg" :style="{'background-image':'url('+value.goodsIcon+')'}"></view>
							<view class="content">
								<view class="text-black"><text class="text-cut text-sm">{{value.goodsName}}</text>
								</view>
								<view class="text-grey text-xs" style="margin-bottom: 30rpx;">库存：{{value.stockQty}}</view>
								<view class="pricesty text-red price text-price">
									<text>{{ value.salePrice }}</text>
									<template v-if="value.integral > 0">
										<text class="text-xs">{{ value.integralType | filterIntegralType }}</text>
										<text>{{ value.integral }}</text>
										<text class="text-xs">{{$queue.getIntegralName()}}</text>
									</template>
									<text
										class="text-sm line-thr text-price text-gray margin-left-xs" v-if="value.salePrice < value.marketPrice">{{ value.marketPrice}}</text>
								</view>
							</view>
							<view class="action">
								<view class="addNumber">
									<button class="cu-btn cuIcon sub subTotal" :data-k="key" :data-i="index"
										@tap="subTotal"
										:style="(value.stockQtysss)==0?'':'opacity:1;right:112rpx;transform: rotate(360deg);transition: 1s all;'">
										<text class="cuIcon-move"></text>
									</button>
									<view class="total text-black"
										:style="(value.stockQtysss)==0?'':'opacity:1;transition: 1.2s all;'">
										{{value.stockQtysss}}
									</view>
									<button class="cu-btn cuIcon add bg-topic-theme addTotal" :data-k="key"
										:data-i="index" @tap="addTotal">
										<text class="cuIcon-add text-xl"></text>
									</button>
								</view>
							</view>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
		<view class="foot">
			<view class="foot-flex">
				<view class="left">
					<view class="img">
						<image src="../static/img/haveGoods.png" @click="showService" v-if="cartList.length" mode="">
						</image>
						<image src="../static/img/noGoods.png.png" v-else mode=""></image>
						<view class="num" v-if="cartList.length">
							{{cartList.length}}
						</view>
					</view>
					<view class="price" v-if="cartList.length" @click="showService">
						<!-- <view class="top">
							<text class="text-price sale">22</text>
							<text class="text-price orig">99</text>
						</view> -->
						<text class="top money text-price text-main">
							<text>{{ sumObj.amount }}</text>
							<template v-if="sumObj.integral > 0">
								<text class="text-xs">{{ sumObj.integral > 0 ? 1 : 0 | filterIntegralType }}</text>
								<text>{{ sumObj.integral }}</text>
								<text class="text-xs">{{ $queue.getIntegralName() }}</text>
							</template>
						</text>
						<view class="bottom">
							免配送费
						</view>
					</view>
				</view>
				<view class="buy" v-if="cartList.length" @click="toSettle">
					去结算
				</view>
				<view class="nogoods" v-else>
					去结算
				</view>
			</view>
		</view>
		<view class="cu-modal bottom-modal" :class="serviceClass">
			<view class="cu-dialog goods-service" style="z-index: 999;">
				<view class="cu-bar bg-white justify-end">
					<view class="action text-xl text-bold text-gray margin-right" @tap.stop="hideService"><text
							class="cuIcon-close"></text></view>
				</view>
				<view class="bg-white goods-service-box">
					<view class="">
						已选商品
					</view>
					<view class="content" style="max-height: 600rpx;overflow-y: scroll;">
						<view class="cu-list menu-avatar radius-bottom">
							<view class="cu-item" v-for="(value,i) in cartList" :key="i">
								<!-- <view class="cu-avatar radius lg"  :style="{'background-image':'url('+value.url+')'}"></view> -->
								<image class="cu-avatar radius" style="width: 144rpx;height: 144rpx;"
									:src="value.goodsIcon" mode=""></image>
								<view class="content" style="left: 180rpx;">
									<view class="text-black"><text class="text-cut text-sm">{{value.goodsName}}</text>
									</view>
									<view class="text-red price text-price flex">
										<text>{{ (value.salePrice * value.stockQtysss).toFixed(2) }}</text>
										<template v-if="value.integral > 0">
											<text class="text-xs">{{ value.integralType | filterIntegralType }}</text>
											<text>{{ value.integral * value.stockQtysss }}</text>
											<text class="text-xs">{{$queue.getIntegralName()}}</text>
										</template>
										<text
											class="text-sm line-thr text-price text-gray margin-left-xs" v-if="value.salePrice < value.marketPrice">{{ value.marketPrice}}</text>
									</view>
								</view>
								<view class="action">
									<view class="addNumber">
										<button class="cu-btn cuIcon sub subTotal" :data-k="value.id"
											@tap.stop="cartsubTotal"
											:style="'opacity:1;right:112rpx;transform: rotate(360deg);transition: 1s all;'">
											<text class="cuIcon-move"></text>
										</button>
										<view class="total text-black" :style="'opacity:1;transition: 1.2s all;'">
											{{value.stockQtysss}}
										</view>
										<button class="cu-btn cuIcon add bg-topic-theme addTotal" :data-k="value.id"
											@tap.stop="cartaddTotal">
											<text class="cuIcon-add text-xl"></text>
										</button>
									</view>
								</view>
							</view>
						</view>
					</view>
					<view class="foot">
						<view class="foot-flex">
							<view class="left">
								<view class="img" @tap.stop="showService">
									<image src="../static/img/haveGoods.png" mode=""></image>
									<view class="num">
										{{cartList.length}}
									</view>
								</view>
								<view class="price" @tap.stop="showService">
									<!-- <view class="top">
										<text class="text-price sale">22</text>
										<text class="text-price orig">99</text>
									</view> -->
									<text class="top money text-price text-main">
										<text>{{ sumObj.amount }}</text>
										<template v-if="sumObj.integral > 0">
											<text class="text-xs">{{ sumObj.integral > 0 ? 1 : 0 | filterIntegralType }}</text>
											<text>{{ sumObj.integral }}</text>
											<text class="text-xs">{{ $queue.getIntegralName() }}</text>
										</template>
									</text>
									<view class="bottom">
										免配送费
									</view>
								</view>
							</view>
							<view class="buy" @tap.stop="toSettle">
								去结算
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		</view>
		<view class="store-image" v-if="list.length == 0">
			<image :src="img" mode=""></image>
			<view class="">
				还没有商品哦~
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				isloading: 1,
				buyTotal: [],
				list: [],
				cartList: [],
				tabCur: 0,
				mainCur: 0,
				verticalNavTop: 0,
				load: true,
				favorCount: '',
				storeName: '',
				img: '',
				// 店铺详情
				storeInfo: {},
				storeId: '',
				// 是否关注该店铺
				isFavor: false,
				queryParams: {
					pageNum: 1,
					pageSize: 10,
					isfinish: false,
					storeId: ""
				},
				serviceClass: 'none',
				sumObj: {
					amount: 0,
					integral: 0
				},
			};
		},
		onLoad(options) {
			uni.showLoading({
				title: '加载中...',
				mask: true
			});
			this.storeId = options.storeId
			this.img = this.Dict.status_img
			// this.storeId = '1404122964571860992'
			this.getStoreInfoAndFavor()
			this.getGoodsList()

		},
		onReady() {
			uni.hideLoading()
		},
		methods: {
			// 总价格， 总积分
			sumAmount() {
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
			// 店铺信息
			getStoreInfoAndFavor() {
				this.$http.getStoreInfoAndFavor({
					storeId: this.storeId
				}).then(res => {
					if (res.code == 200) {
						this.isFavor = res.data.isFavor
						this.favorCount = res.data.favorCount
						this.storeInfo = res.data.storeInfo
					}
				})
			},
			// 店铺商品列表
			getGoodsList() {
				this.queryParams.storeId = this.storeId
				this.$http.storeGoodsList(this.queryParams).then(res => {
					this.isloading = 0
					let that = this
					that.list = res.data ? res.data : []
					that.list.forEach(function(item, index) {
						item.storeGoodsList.forEach(function(v, k) {
							v.stockQtysss = 0
							
						})
					})
				})
			},
			// 关注当前店铺
			addStore() {
				let obj = {}
				obj.storeId = this.storeInfo.id
				obj.storeName = this.storeInfo.storeName
				this.$http.addStore(obj).then(res => {
					if (res.code == 200) {
						this.isFavor = true
						this.favorCount++
					} else {
						uni.showToast({
							title: '操作频繁,稍后再试哦!',
							icon: 'none'
						});
					}
				})
			},
			//取消关注店铺
			delStore() {
				this.$http.delStore({
					storeId: this.storeId
				}).then(res => {
					if (res.code == 200) {
						this.isFavor = false
						this.favorCount--
					} else {
						uni.showToast({
							title: '操作频繁,稍后再试哦!',
							icon: 'none'
						});
					}
				})
			},
			// 去结算
			toSettle() {
				console.log(this.cartList)
				this.$queue.setJson("buy_storeGoods", this.cartList);
				uni.navigateTo({
					url: '/sub/stores/store/orderDetail'
				})
			},
			/* 打开服务弹窗 */
			showService() {
				// this.serviceClass = 'show';
				if (this.serviceClass == 'hide' || this.serviceClass == 'none') {
					this.serviceClass = 'show';
				} else {
					this.serviceClass = 'hide';
				}
			},
			/* 关闭服务弹窗 */
			hideService() {
				this.serviceClass = 'hide';
				setTimeout(() => {
					this.serviceClass = 'none';
				}, 200);
			},
			TabSelect(e) {
				this.tabCur = e.currentTarget.dataset.id;
				this.mainCur = e.currentTarget.dataset.id;
				this.verticalNavTop = (e.currentTarget.dataset.id - 1) * 50
			},
			//fangfa
			mapList(index, key, type) {
				let arr = []
				this.list.map((item, indexs) => {
					if (indexs == index) {
						item.storeGoodsList.map((v, i) => {
							if (key == i) {
								if (type) {
									if (v.stockQty > v.stockQtysss) {
										v.stockQtysss++
									} else {
										uni.showToast({
											title: "库存不够哦",
											icon: "none"
										})
									}
								} else {
									if (v.stockQtysss > 0) {
										v.stockQtysss--
									} else {
										uni.showToast({
											title: "库存不够哦",
											icon: "none"
										})
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
			//添加一个商品数量
			addTotal(e) {
				let index = e.currentTarget.dataset.i;
				let key = e.currentTarget.dataset.k;
				this.cartList = this.mapList(index, key, 1)
				this.sumAmount()
			},
			cartaddTotal(e) {
				let id = e.currentTarget.dataset.k;
				let arr = []
				this.list.map((item, indexs) => {
					// if(indexs == index) {
					item.storeGoodsList.map((v, i) => {
						if (id == v.id) {
							if (v.stockQty > v.stockQtysss) {
								v.stockQtysss++
							} else {
								uni.showToast({
									title: "库存不够哦",
									icon: "none"
								})
							}
						}
					})
					// }
					item.storeGoodsList.map(s => {
						if (s.stockQtysss > 0) {
							arr.push(s)
						}
					})
				})
				this.cartList = JSON.parse(JSON.stringify(arr))
				this.sumAmount()
			},
			cartsubTotal(e) {
				let id = e.currentTarget.dataset.k;
				let arr = []
				this.list.map((item, indexs) => {
					item.storeGoodsList.map((v, i) => {
						if (id == v.id) {
							if (v.stockQtysss > 0) {
								v.stockQtysss--
							} else {
								uni.showToast({
									title: "库存不够哦",
									icon: "none"
								})
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
				if(!this.cartList.length) {
					this.serviceClass = 'hide';
				}
			},
			//移除一个商品数量
			subTotal(e) {
				let index = e.currentTarget.dataset.i;
				let key = e.currentTarget.dataset.k;
				this.cartList = this.mapList(index, key, 0)
				this.sumAmount()
			},
			VerticalMain(e) {
				// #ifdef MP-ALIPAY
				return false //支付宝小程序暂时不支持双向联动 
				// #endif
				let that = this;
				let tabHeight = 0;
				if (this.load) {
					for (let i = 0; i < this.list.length; i++) {
						let view = uni.createSelectorQuery().select("#main-" + i);
						view.fields({
							size: true
						}, data => {
							this.list[i].top = tabHeight;
							tabHeight = tabHeight + data.height;
							this.list[i].bottom = tabHeight;
						}).exec();
					}
					this.load = false
				}
				let scrollTop = e.detail.scrollTop + 10;
				for (let i = 0; i < this.list.length; i++) {
					if (scrollTop > this.list[i].top && scrollTop < this.list[i].bottom) {
						this.verticalNavTop = (i - 1) * 50
						this.tabCur = i
						return false
					}
				}
			},

		},
	}
</script>

<style lang="scss" scoped>
	.store-image {
		margin-top: 160upx;
		text-align: center;
	
		image {
			width: 492upx;
			height: 340upx;
			margin-bottom: 48upx;
		}
	
		view {
			font-size: 32upx;
			font-weight: 300;
			color: #999999;
		}
	}
	.pricesty {
		width: 240upx;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.store_top {
		position: sticky;
		top: 0upx;
		z-index: 99;
		display: flex;
		justify-content: space-between;
		align-items: center;
		background-color: #fff;
		padding-left: 24upx;
		padding-top: 40rpx;
		padding-bottom: 40rpx;
		height: 120upx;

		.left {
			display: flex;
			align-items: center;

			.store_name_favor {
				margin-left: 20upx;

				.store_name {
					width: 400upx;
					height: 44rpx;
					font-size: 32rpx;
					font-weight: 700;
					line-height: 44rpx;
					color: #333333;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
				}

				.store_favor {
					font-size: 24rpx;
					font-weight: 300;
					margin: 8rpx 0;
				}
			}
		}

		.storeImg {
			width: 120rpx;
			height: 120rpx;
			border-radius: 50%;
			// margin-left: 28rpx;
		}

		.store_but {
			width: 136rpx;
			height: 56rpx;
			line-height: 56rpx;
			border-radius: 309px;
			border: 2rpx solid #fff;
			text-align: center;
			font-size: 26rpx;

			.store_favor_icon {
				color: $base;
				width: 24rpx;
				height: 20rpx;
				margin-right: 14rpx;
			}


		}

		.favor {
			margin-right: 28rpx;
			background: linear-gradient(180deg, #F1722C 0%, #EB6133 100%);
			color: #fff;
		}

		.favor1 {
			margin-right: 28rpx;
			background: #F2F2F2;
			color: #666666;
		}
	}

	.addNumber {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		margin-top: 100rpx !important;
		position: relative;
		width: 160rpx;

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
			left: 50%;
			top: 50%;
			opacity: 0;
			transform: translate(-50%, -50%);
		}

		view {
			display: flex;
			align-items: center;
			justify-content: center;
			margin-top: 0 !important;
		}
	}

	.cu-btn.add {
		font-size: 30rpx;
		background-color: #EB6133;
		color: #fff;
	}

	.cu-btn.sub {
		font-size: 30rpx;
		border: 2rpx solid #EB6133;
		background-color: #fff;
		color: #EB6133;
	}

	.cu-dialog {
		background-color: #FFFFFF;

		.padding-xl {
			.cu-form-group .title {
				min-width: calc(4em + 15px);
			}

			.cu-form-group {
				background-color: rgba(0, 0, 0, 0);
			}

			.cu-form-group+.cu-form-group {
				border: none;
			}
		}
	}

	.radius-bottom {
		border-bottom-left-radius: 8rpx;
		border-bottom-right-radius: 8rpx;
	}

	.cu-list.menu-avatar>.cu-item {
		min-height: 208rpx;
		height: uset;
	}

	.cu-list.menu-avatar>.cu-item .action {
		width: 170rpx;
		padding-right: 14rpx;

		view {
			text-align: right;
		}
	}

	.cu-list.menu-avatar>.cu-item>.cu-avatar {
		left: 15rpx;
	}

	.cu-avatar.lg {
		width: 176rpx;
		height: 176rpx;
		border-radius: 16upx;
	}

	.cu-list.menu-avatar>.cu-item .content {
		left: 210rpx;
		// line-height: 1.3em;
		height: 176upx;
	}

	.sub {
		width: 21px;
		height: 21px;
		border-radius: 50%;
		border: 1rpx solid #666;
	}

	.add {
		width: 21px;
		height: 21px;
		border-radius: 50%;
		border: 1rpx solid #F8D347;
	}

	.total {
		min-width: 50rpx;
		max-width: 50rpx;
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
	}

	.VerticalNav.nav {
		width: 200upx;
		white-space: initial;
		transition: 0.4s all;
	}

	.VerticalNav.nav .cu-item {
		width: 100%;
		text-align: left;
		background-color: #fff;
		padding-left: 28upx;
		border: none;
		height: 50px;
		position: relative;
	}

	.VerticalNav.nav .cu-item.cur {
		background-color: #F3F3F3;
		font-size: 26upx;
		color: #333333;
	}

	.VerticalNav.nav .cu-item.clickon {
		font-size: 26upx;
		font-weight: 500;
		color: #EB6133;
	}

	.VerticalNav.nav .cu-item.cur::after {
		content: "";
		width: 8upx;
		height: 30upx;
		border-radius: 10upx 0 0 10upx;
		position: absolute;
		background-color: currentColor;
		top: 0;
		right: 0upx;
		bottom: 0;
		margin: auto;
	}

	.VerticalBox {
		display: flex;
		border-top: 2upx solid #F7F7F7;
	}

	.VerticalMain {
		background-color: #f1f1f1;
		flex: 1;
	}

	.foot {
		height: 100upx;

		.foot-flex {
			display: flex;
			justify-content: space-between;
			align-items: center;

			.left {
				display: flex;
				align-items: center;

				.img {
					margin-left: 28upx;
					position: relative;

					image {
						width: 96upx;
						height: 96upx;
					}

					.num {
						position: absolute;
						top: 6upx;
						right: -8upx;
						width: 24upx;
						height: 24upx;
						background: #F55026;
						border-radius: 50%;
						font-size: 18upx;
						color: #FFFFFF;
						text-align: center;
						line-height: 24upx;
					}
				}

				.price {
					margin-left: 16upx;

					.top {
						.sale {
							font-size: 30upx;
							font-weight: 500;
							color: #333333;
						}

						.orig {
							font-size: 22upx;
							font-weight: 300;
							color: #999999;
						}
					}

					.bottom {
						font-size: 20upx;
						text-align: left;
						font-weight: 300;
						color: #333333;
					}
				}
			}

			.buy {
				margin-right: 28upx;
				width: 220upx;
				height: 76upx;
				background-color: #ed6c2f;
				border-radius: 38upx;
				font-size: 30upx;
				font-weight: 300;
				color: #FFFFFF;
				text-align: center;
				line-height: 76upx;
			}

			.nogoods {
				margin-right: 28upx;
				width: 220upx;
				height: 76upx;
				background-color: #c0c2c1;
				border-radius: 38upx;
				font-size: 30upx;
				font-weight: 300;
				color: #FFFFFF;
				text-align: center;
				line-height: 76upx;
			}
		}
	}
</style>
