<template>
	<view class="acr">
		123
		<!-- <view class="act-content">
			<view class="like">
				<text class="line">综合</text>
				<text class="guess">销量</text>
				<text class="line">价格</text>
			</view>
			<view class="goods-list">
				<view class="goods-item" v-for="(item,index) in goodsList" :key="index" @tap="toGoods(item)">
					<image :src="item.goodsIcon"></image>
					<view class="name">{{ item.goodsName}}</view>
					<view class="cateName">{{ item.goodsTitle}}</view>
					<view class="info">
						<view class="price text-price">
							<text>{{ item.salePrice }}</text>
							<template v-if="item.integral > 0">
								<text class="text-xs">{{ item.integralType | filterIntegralType }}</text>
								<text>{{ item.integral }}</text>
								<text class="text-xs">{{$queue.getIntegralName()}}</text>
							</template>
							<text
								class="text-sm line-thr text-price text-gray margin-left-xs">{{ item.marketPrice}}</text>
						</view>
					</view>
				</view>
			</view>
		</view> -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				goodsList: [],
				queryParams: {
					pageNum: 1,
					pageSize: 10,
					isfinish: false,
					actCode: ""
				},
			};
		},
		onLoad(options) {
			options = this.$queue.parse(options);
			uni.setNavigationBarTitle({
				title: options.name
			})
			uni.showLoading({
				mask: true,
				title: "加载中..."
			})
			this.queryParams.actCode = options.code
			this.getActGoodsList()
		},
		//下拉刷新，配置开启页面下拉刷新 "enablePullDownRefresh": true
		onPullDownRefresh() {
			this.goodsList = [];
			this.queryParams.isfinish = false;
			this.queryParams.pageNum = 1;
			// 加载兑换中心商品
			this.getActGoodsList();
			setTimeout(function() {
				uni.stopPullDownRefresh();
			});
		},
		//上拉加载，配置"onReachBottomDistance"
		onReachBottom() {
			if (this.totalPage > this.queryParams.pageNum) {
				uni.showLoading({
					mask: true,
					title: "加载中..."
				})
				this.queryParams.pageNum++;
				this.getActGoodsList();
			}
			
		},
		methods: {
			/* 商品跳转 */
			toGoods(e) {
				uni.navigateTo({
					// url: "/sub/goods/detail/detail?" + this.$queue.stringify(e)
					url: "/sub/goods/detail/detail?goodsId=" + e.id
				});
			},
			/* 获取猜你喜欢列表 */
			async getActGoodsList() {
				if (this.queryParams.isfinish) return;
				const res = await this.$http.getActGoodsList(this.queryParams);
				uni.hideLoading()
				uni.stopPullDownRefresh();
				if (res.code == 200) {
					this.goodsList = _.concat(this.goodsList, res.data.list);
					this.goodsList.map((item, index) => {
						if (!item) {
							this.goodsList.splice(index, 1)
						}
					})
					if (res.data.totalPage == this.queryParams.pageNum || _.size(res.data.list) === 0) {
						this.queryParams.isfinish = true;
					}
				} else {
					this.goodsList = []
					this.queryParams.isfinish = true
				}
			},
		}
	};
</script>

<style lang="scss">
	
	.act {
		&-content {
			.like {
				text-align: center;
				margin-bottom: 28upx;
				.line {
					
				}
				.guess {
					font-size: 30upx;
					font-weight: 300;
					color: #EB6132;
				}
			}
			.goods-list {
				padding-left: 24upx;
				padding-right: 24upx;
				display: flex;
				justify-content: space-between;
				flex-wrap: wrap;
			}
			
			.goods-item {
				width: 48.5%;
				border-radius: 20upx;
				background-color: #fff;
				margin: 0 0 25upx 0;
				box-shadow: 0upx 5upx 25upx rgba(0, 0, 0, 0.1);
			
				image {
					height: 350upx;
					width: 100%;
					border-radius: 20upx 20upx 0 0;
				}
			
				.name {
					width: 92%;
					padding: 10upx 4% 0;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
					text-align: justify;
					overflow: hidden;
					font-size: 28upx;
					line-height: 38upx;
					margin-bottom: 10upx;
				}
				.cateName {
					padding: 10upx 4% 0;
					font-size: 24upx;
					font-weight: 300;
					line-height: 34upx;
					color: #999999;
				}
			
				.info {
					display: flex;
					justify-content: space-between;
					align-items: flex-end;
					width: 94%;
					padding: 20upx 3%;
					
					.price {
						color: $uni-color-main;
						font-size: 28upx;
						font-weight: 600;
						white-space: normal;
					}
			
					.slogan {
						color: #807c87;
						font-size: 24upx;
					}
				}
			}
		}
	}
</style>
