<template>
	<view>
		<!-- <view class="tabr" :style="{ top: headerTop }"> -->
			<!-- <view :class="{ on: typeClass == 'goods' }" @tap="switchType('goods')">商品({{ goodsList.length }})</view> -->
			<!-- <view :class="{ on: typeClass == 'shop' }" @tap="switchType('shop')">店铺({{ shopList.length }})</view> -->
			<!-- <view class="border" :class="typeClass"></view> -->
		<!-- </view> -->
		<!-- <view class="place"></view> -->
		<view class="list">
			<!-- 收藏列表 -->
			<view class="sub-list goods" :class="subState">
				<view class="tis" v-if="goodsList.length == 0">没有数据~</view>
				<view class="row" v-for="(row, index) in goodsList" :key="index">
					<!-- 删除按钮 -->
					<view class="menu" @tap.stop="deleteProductCollection(row)"><view class="icon shanchu"></view></view>
					<!-- content -->
					<view
						class="carrier solid-bottom"
						:class="[typeClass == 'goods' ? (theIndex == index ? 'open' : oldIndex == index ? 'close' : '') : '']"
						@touchstart="touchStart(index, $event)"
						@touchmove="touchMove(index, $event)"
						@touchend="touchEnd(index, $event)"
					>
						<view class="goods-info" @tap="toGoods(row)">
							<view class="img"><image :src="row.productPic"></image></view>
							<view class="info">
								<view class="title">{{ row.productName }}</view>
								<view class="price-number">
									<view class="keep-num">{{ row.createTime, '{y}-{m}-{d}' | parseTime }}</view>
									<view class="price">￥{{ row.productPrice }}</view>
								</view>
							</view>
						</view>
					</view>
				</view>
				<view class="text-gray flex-sub justify-center margin-top" v-if="productListQuery.isFinish">——我是有底线的——</view>
			</view>
			<view class="sub-list shop" :class="subState">
				<view class="tis" v-if="shopList.length == 0">没有数据~</view>
				<view class="row" v-for="(row, index) in shopList" :key="index">
					<!-- 删除按钮 -->
					<view class="menu" @tap.stop="deleteProductCollection(row)"><view class="icon shanchu"></view></view>
					<!-- content -->
					<view
						class="carrier"
						:class="[typeClass == 'shop' ? (theIndex == index ? 'open' : oldIndex == index ? 'close' : '') : '']"
						@touchstart="touchStart(index, $event)"
						@touchmove="touchMove(index, $event)"
						@touchend="touchEnd(index, $event)"
					>
						<view class="left"><image :src="row.img"></image></view>
						<view class="right">
							<view class="name">{{ row.name }}</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {mapState} from 'vuex';
	import { parseTime } from '@/common/utils/DateUtils.js'
export default {
	data() {
		return {
			// 商品列表
			goodsList: [],
			// 店铺列表
			shopList: [],
			headerTop: 0,
			//控制滑动效果
			typeClass: 'goods',
			subState: '',
			theIndex: null,
			oldIndex: null,
			isStop: false,
			productListQuery:{
				pageNum: 1,
				pageSize: 10,
				isFinish: false
			}
		};
	},
	onPageScroll(e) {
		this.productListQuery.pageNum++;
		this.getProductCollectionList();
	},
	//下拉刷新，需要自己在page.json文件中配置开启页面下拉刷新 "enablePullDownRefresh": true
	onPullDownRefresh() {
		this.productListQuery.pageNum = 0;
		this.productListQuery.isFinish = false;
		this.getProductCollectionList();
		// setTimeout(function() {
		// 	uni.stopPullDownRefresh();
		// }, 1000);
	},
	onLoad() {
		//兼容H5下排序栏位置
		// #ifdef H5
		//定时器方式循环获取高度为止，这么写的原因是onLoad中head未必已经渲染出来。
		let Timer = setInterval(() => {
			let uniHead = document.getElementsByTagName('uni-page-head');
			if (uniHead.length > 0) {
				this.headerTop = uniHead[0].offsetHeight + 'px';
				clearInterval(Timer); //清除定时器
			}
		}, 1);
		// #endif
		this.getProductCollectionList();
	},
	computed: {
		...mapState(['userInfo'])
	},
	filters: {
		parseTime
	},
	methods: {
		// 获取商品收藏列表
		async getProductCollectionList(){
			if(this.productListQuery.isFinish) {
				return
			}
			const { data } = await this.$http.getProductCollectionList(this.productListQuery);
			uni.stopPullDownRefresh();
			this.goodsList = _.concat(this.goodsList, data.list);
			if(data.totalPage == this.productListQuery.pageNum) {
				this.productListQuery.isFinish = true;
			}
		},
		// 取消商品收藏
		async deleteProductCollection(row){
			const { code } = await this.$http.deleteProductCollection({
				memberId: this.userInfo.memberId,
				productId: row.productId
			})
			if(code == 200) {
				this.getProductCollectionList();
			}
		},
		switchType(type) {
			if (this.typeClass == type) {
				return;
			}
			uni.pageScrollTo({
				scrollTop: 0,
				duration: 0
			});
			this.typeClass = type;
			this.subState = this.typeClass == '' ? '' : 'show' + type;
			setTimeout(() => {
				this.oldIndex = null;
				this.theIndex = null;
				this.subState = this.typeClass == 'goods' ? '' : this.subState;
			}, 200);
		},
		//控制左滑删除效果-begin
		touchStart(index, event) {
			//多点触控不触发
			if (event.touches.length > 1) {
				this.isStop = true;
				return;
			}
			this.oldIndex = this.theIndex;
			this.theIndex = null;
			//初始坐标
			this.initXY = [event.touches[0].pageX, event.touches[0].pageY];
		},
		touchMove(index, event) {
			//多点触控不触发
			if (event.touches.length > 1) {
				this.isStop = true;
				return;
			}
			let moveX = event.touches[0].pageX - this.initXY[0];
			let moveY = event.touches[0].pageY - this.initXY[1];

			if (this.isStop || Math.abs(moveX) < 5) {
				return;
			}
			if (Math.abs(moveY) > Math.abs(moveX)) {
				// 竖向滑动-不触发左滑效果
				this.isStop = true;
				return;
			}

			if (moveX < 0) {
				this.theIndex = index;
				this.isStop = true;
			} else if (moveX > 0) {
				if (this.theIndex != null && this.oldIndex == this.theIndex) {
					this.oldIndex = index;
					this.theIndex = null;
					this.isStop = true;
					setTimeout(() => {
						this.oldIndex = null;
					}, 150);
				}
			}
		},
		touchEnd(index, $event) {
			//解除禁止触发状态
			this.isStop = false;
		},
		// 去商品详情
		toGoods(row){
			uni.navigateTo({
				url: "../../goods/goods?productId=" + row.productId
			})
		},
		discard() {
			//丢弃
		}
	}
};
</script>
<style lang="scss">
view {
	display: flex;
	flex-wrap: wrap;
}
page {
	position: relative;
	background-color: #f5f5f5;
}

.hidden {
	display: none !important;
}
.place {
	width: 100%;
	height: 95upx;
}
.tabr {
	background-color: #fff;
	width: 94%;
	height: 95upx;
	padding: 0 3%;
	border-bottom: solid 1upx #dedede;
	position: fixed;
	top: 0;
	z-index: 10;
	view {
		width: 50%;
		height: 90upx;
		justify-content: center;
		align-items: center;
		font-size: 32upx;
		color: #999;
	}
	.on {
		color: #f06c7a;
	}
	.border {
		height: 4upx;
		background-color: #f06c7a;
		transition: all 0.3s ease-out;
		&.shop {
			transform: translate3d(100%, 0, 0);
		}
	}
}
.list {
	width: 100%;
	display: block;
	position: relative;
}
@keyframes showGoods {
	0% {
		transform: translateX(-100%);
	}
	100% {
		transform: translateX(0);
	}
}
@keyframes showShop {
	0% {
		transform: translateX(0);
	}
	100% {
		transform: translateX(-100%);
	}
}
.sub-list {
	&.shop {
		position: absolute;
		top: 0;
		left: 100%;
		display: none;
	}
	&.showgoods {
		display: flex;
		animation: showGoods 0.2s linear both;
	}
	&.showshop {
		display: flex;
		animation: showShop 0.2s linear both;
	}
	width: 100%;
	padding: 20upx 0 40upx 0;
	.tis {
		width: 100%;
		height: 60upx;
		justify-content: center;
		align-items: center;
		font-size: 32upx;
	}
	&.shop {
		.row {
			height: 20vw;
			.left {
				width: 20vw;
				height: 20vw;
				padding-left: 20upx;
				align-items: center;
				image {
					width: 18vw;
					height: 18vw;
					border-radius: 100%;
				}
			}
			.right {
				height: 20vw;
				align-items: center;
				font-size: 32upx;
			}
		}
	}
	.row {
		width: 100%;
		height: 30vw;
		align-items: center;
		position: relative;
		overflow: hidden;
		border-bottom: solid 1upx #dedede;
		.menu {
			.icon {
				color: #fff;
				font-size: 50upx;
			}
			position: absolute;
			width: 28%;
			height: 100%;
			right: 0;
			justify-content: center;
			align-items: center;
			background-color: red;
			color: #fff;
			z-index: 2;
		}

		.carrier {
			@keyframes showMenu {
				0% {
					transform: translateX(0);
				}
				100% {
					transform: translateX(-28%);
				}
			}
			@keyframes closeMenu {
				0% {
					transform: translateX(-28%);
				}
				100% {
					transform: translateX(0);
				}
			}
			&.open {
				animation: showMenu 0.25s linear both;
			}
			&.close {
				animation: closeMenu 0.15s linear both;
			}
			background-color: #fff;

			position: absolute;
			width: 100%;
			padding: 0 0;
			height: 100%;
			z-index: 3;
			flex-wrap: nowrap;
			.goods-info {
				width: calc(100% - 40upx);
				padding: 20upx;
				flex-wrap: nowrap;
				.img {
					width: calc(30vw - 40upx);
					height: calc(30vw - 40upx);
					border-radius: 10upx;
					overflow: hidden;
					flex-shrink: 0;
					margin-right: 20upx;
					image {
						width: calc(30vw - 40upx);
						height: calc(30vw - 40upx);
					}
				}
				.info {
					width: 100%;
					height: calc(30vw - 40upx);
					overflow: hidden;
					flex-wrap: wrap;
					align-content: space-between;
					position: relative;
					.title {
						width: 100%;
						font-size: 28upx;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 2;
						overflow: hidden;
					}

					.price-number {
						width: 100%;
						justify-content: space-between;
						align-items: baseline;

						.keep-num {
							font-size: 26upx;
							color: #999;
						}
						.price {
							font-size: 30upx;
							color: #f06c7a;
						}
					}
				}
			}
		}
	}
}
</style>
