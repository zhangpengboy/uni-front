<!-- 搜索 -->
<template>
	<view class="search" v-if="isloading == 0">
		<view class="">
			<!-- <view class="search-navigation">
				<view :class="{active: listIndex == index}" v-for="(item,index) in navigation"
					@click="searchGoodsList(item,index)">{{item.name}}</view>
			</view> -->
		<view class="" v-for="(item, i) in goodsList" :key="i" >				
			<view class="act-head" v-if="isshow">
					<view class="act-head-item" @tap="toGoods(item)">
						<view class="image">
							<image :src="item.goodsIcon" mode=""></image>
						</view>
						<view class="text">
							<view class="text-title">
								{{ item.goodsName}}
							</view>
							<!-- <view class="text-instructions">
								{{ goodsInfo.goodsTitle }}
							</view> -->
							<view class="text-prices fw">
								<text class="presents text-price">
									{{ item.salePrice }}
									<template v-if="item.integral > 0">
										<text class="text-xs">{{ item.integralType | filterIntegralType }}</text>
										<text style="font-size: 30rpx;">{{ item.integral }}</text>
										<text class="text-xs">{{$queue.getIntegralName()}}</text>
									</template>
								</text>
								<text class="original">{{'￥' + item.marketPrice}}</text>
							</view>
							<view class="vipPrice">
								<text class="vip">会员价</text>
								<text class="presents text-price vipPriceItem fw" style="font-size: 22rpx;">
									{{ item.vipPrice }}
									<template v-if="item.integral > 0">
										<text class="text-xs">{{ item.integralType | filterIntegralType }}</text>
										<text style="font-size: 22rpx;">{{ item.integral }}</text>
										<text class="text-xs">{{$queue.getIntegralName()}}</text>
									</template>
								</text>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="" v-if="isshow">
				<view class="goods">
					<view class="cu-load" v-if="goodsList.length" :class="queryParams.isfinish ? 'over' : 'loading'">
					</view>

				</view>
			</view>
			<view class="" v-else>
				<view class="store_top" v-for="item in goodsList" :key="item">
					<view class="">
						<image src="/static/img/logo.png" class="storeImg"></image>
						<view class="store_name_favor">
							<!-- <view class="store_name">{{ item.storeName }}</view>
							<view class="store_favor">{{ item.favorCount }}人关注</view> -->
							<view class="store_name">{{item.storeName}}</view>
							<view class="store_favor">. </view>
						</view>
					</view>
					<view class="store_but">
						<!-- <image src="../static/img/favor.png" class="store_favor_icon"></image> -->
						<text class="favor_txt" @click="goStoreDetail(item)">{{ '进店' }}</text>
					</view>
					<view class="store_image">
						<image src="../../../static/img/dingdan.png" mode=""></image>
						<image src="../../../static/img/dingdan.png" mode=""></image>
						<image src="../../../static/img/dingdan.png" mode=""></image>
					</view>
				</view>
			</view>
			<view class="noResults" v-if="goodsList.length == 0">
				<image src="../static/img/078@2x.png" mode=""></image>
				<view>搜索没结果</view>
			</view>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				isloading: 1,
				isshow: true,
				goodsList: [],
				goodsName: '',
				listIndex: 0,
				navigation: [{
						id: 0,
						name: '全部'
					},
					{
						id: 1,
						name: '上新'
					},
					{
						id: 2,
						name: '特卖'
					},
					{
						id: 3,
						name: '店铺'
					}
				],
				queryParams: {
					pageNum: 1,
					pageSize: 10,
					isfinish: false,
					goodsName: "",
					// actCode: ''
				},
			};
		},
		onLoad(options) {
			this.queryParams.goodsName = options.goodsName
			// this.queryParams.actCode = options.actCode
			this.queryParams.actCode = ''
			this.getnameGoodsList()
		},
		//下拉刷新，需要自己在page.json文件中配置开启页面下拉刷新 "enablePullDownRefresh": true
		onPullDownRefresh() {
			this.queryParams.pageNum = 1;
			this.queryParams.isfinish = false;
			// 加载猜你喜欢推荐商品
			this.goodsList = [];
			this.getnameGoodsList();
			// this.getActBannerList();
			// setTimeout(function() {
			// 	uni.stopPullDownRefresh();
			// }, 1000);
		},
		//上拉加载，需要自己在page.json文件中配置"onReachBottomDistance"
		onReachBottom() {
			this.queryParams.pageNum++;
			this.getnameGoodsList();
		},
		methods: {
			async getnameGoodsList() {
				if (this.queryParams.isfinish) return;
				uni.showLoading({
					title: '加载中'
				});
				let res;
				if (this.listIndex == 0) {
					res = await this.$http.nameGoodsList(this.queryParams);
				} else if(this.listIndex == 1) {
					
				} else if(this.listIndex == 2) {
					
				} else if(this.listIndex == 3) {
					res = await this.$http.nameGoodsList(this.queryParams);
				}
				if (res.code == 200) {
					this.isloading = 0
					uni.stopPullDownRefresh();
					uni.hideLoading()
					this.goodsList = _.concat(this.goodsList, res.data.list);
					this.goodsList.map((item, index) => {
						if (!item) {
							this.goodsList.splice(index, 1)
						}
					})
					if (res.data.totalPage == this.queryParams.pageNum || _.size(res.data.list) === 0) {
						this.queryParams.isfinish = true;
					}
				}
			},
			//商品跳转
			toGoods(e) {
				uni.navigateTo({
					// url: "/sub/goods/detail/detail?" + this.$queue.stringify(e)
					url: "/sub/goods/detail/detail?goodsId=" + e.id
				});
			},
			// 搜索商品列表
			searchGoodsList(item, index) {
				this.listIndex = index
				this.goodsList = []
				if (this.listIndex == 0) {
					this.queryParams.goodsName = this.queryParams.goodsName
					this.isshow = true
					this.queryParams.isfinish = false
					this.getnameGoodsList()
				} else if (this.listIndex == 1) {
					this.isshow = true
					return
				} else if (this.listIndex == 2) {
					this.isshow = true
					return
				} else if (this.listIndex == 3) {
					// this.queryParams.goodsName = this.queryParams.goodsName
					// this.isshow = false
					// this.queryParams.isfinish = false
					// this.getnameGoodsList()
					this.isshow = true
					return
				}
				// this.queryParams.actCode = item.code
			},
			// 跳转店铺详情
			goStoreDetail(item){
				uni.navigateTo({
					url: '../../stores/store/storeDetail?storeId=' + item.storeId
				})
			},
		},

	}
</script>

<style lang="scss">
	// page {
	// 	// background-color: #fff;
	// 	background: linear-gradient(180deg, #FFFFFF 0%, #F3F3F3 100%);
	// }

	.active {
		color: #eb6132 !important;
	}
		.act-head {
			margin: 32upx 24upx 28upx;
			background-color: #fff;
			border-radius: 16upx;

			&-item {
				height: 220upx;
				display: flex;
				padding: 24upx;

				.image {
					image {
						width: 220upx;
						height: 220upx;
						border-radius: 8upx;
					}
				}

				.text {
					margin: 8upx 0upx 0upx 32upx;
					// width: 364upx;
					position: relative;

					&-title {
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 2;
						overflow: hidden;
						font-size: 28upx;
						font-weight: 700;
						color: #333333;
					}

					&-instructions {
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 1;
						text-align: justify;
						overflow: hidden;
						font-size: 24upx;
						font-weight: 300;
						margin-top: 16upx;
						color: #999999;
					}

					&-prices {
						// position: absolute;
						// bottom: 0upx;
						margin-top: 56upx;
						font-weight: 700;

						.presents {
							font-size: 30upx;
							font-weight: 300;
							color: #EB6133;
						}

						.original {
							font-size: 22upx;
							font-weight: 300;
							color: #999999;
							margin-left: 16upx;
							text-decoration: line-through;
						}
					}

				}
			}
		}
		.vipPrice {
			height: 32upx;
			color: #FA3B1C;
			border-radius: 8upx;
		
			.vip {
				width: 82upx;
				height: 32upx;
				display: inline-block;
				line-height: 32upx;
				border-top: 1upx solid #FA3B1C;
				border-left: 1upx solid #FA3B1C;
				border-bottom: 1upx solid #FA3B1C;
				font-size: 22upx;
				background: #FFEEEB;
				text-align: center;
				border-radius: 8upx 0 0 8upx;
			}
		
			.vipPriceItem {
				height: 32upx;
				display: inline-block;
				line-height: 32upx;
				border-top: 1upx solid #FA3B1C;
				border-right: 1upx solid #FA3B1C;
				border-bottom: 1upx solid #FA3B1C;
				font-size: 22upx;
				background: #fff;
				text-align: center;
				border-radius: 0 8upx 8upx 0;
				padding: 0 8upx;
				margin-top: 6upx;
			}
		}
	.search {
		$base: #EB6133;

		.store_top {
			// display: flex;
			// justify-content: center;
			// align-items: center;
			height: 380upx;
			border-radius: 16upx;
			background-color: #fff;
			margin: 24rpx;
			padding: 24upx;
			border-bottom: 2upx solid #eee;
			box-sizing: border-box;
			position: relative;

			.store_name_favor {
				margin: 0 30rpx 0 20rpx;
				text-align: left;
				display: inline-block;
				content-visibility: auto;

				.store_name {
					width: 400rpx;
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

			.storeImg {
				display: inline-block;
				width: 96rpx;
				height: 96rpx;
				border-radius: 50%;
				// margin-left: 28rpx;
			}

			.store_but {
				display: inline-block;
				position: absolute;
				right: 28upx;
				top: 40upx;
				width: 104upx;
				height: 52upx;
				border-radius: 309px;
				border: 2rpx solid $base;
				text-align: center;
				margin-right: 10upx;

				.favor_txt {
					color: #fff;
					line-height: 56rpx;
					color: $base;
					font-size: 26rpx;
				}
			}

			.store_image {
				height: 204upx;
				margin-top: 32upx;
				border-radius: 16upx;

				image {
					margin-right: 20upx;
					width: 204upx;
					height: 204upx;
				}

				image:last-child {
					margin-right: 0upx;
				}
			}

			.favor {
				margin-right: 28rpx;
				background: linear-gradient(180deg, #F1722C 0%, #EB6133 100%);
				color: #fff;
			}
		}

		&-navigation {
			display: flex;
			justify-content: space-around;
			border-bottom: 2upx solid #F6F6F6;
			margin: 30upx 0upx 16upx;

			view {
				margin-bottom: 24upx;
				font-size: 30upx;
				font-weight: 300;
				color: #333333;
			}
		}

		&-sort {
			display: flex;
			justify-content: space-around;

			view {
				margin-bottom: 40upx;
				font-size: 30upx;
				font-weight: 300;
				color: #333333;
			}
		}

		.noResults {
			margin-top: 260upx;
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
	}

	// @import "@/static/css/goods.scss";
</style>
