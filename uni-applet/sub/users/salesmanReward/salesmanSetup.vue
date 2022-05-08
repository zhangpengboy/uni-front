<template>
	<view class="">
		<view class="setup" v-if="isPartner">
			<view>
				业务员设置
			</view>
			<image @click="goSalesmanReward" src="../../../static/img/setup.png" mode=""></image>
		</view>
		<view class="business" v-if="isloading == 0">
			<view class="item" v-for="item in  userList">
				<view class="itemimg">
					<image :src="item.headerImg != '' ? item.headerImg : headerImg" mode=""></image>
				</view>
				<view class="itemdetail">
					<view class="nickname">
						昵称: {{item.nickname}}
					</view>
					<view class="phone">
						手机号: {{item.phone}}
					</view>
				</view>
				<view class="itemlevel">
					<view class="level" v-if="item.roleCode == 3">
						业务经理
					</view>
					<view class="level" v-else-if="item.roleCode == 2">
						业务员
					</view>
					<view class="level" v-else>
						消费者
					</view>
				</view>
			</view>
			<view class="notuserList" v-if="userList.length == 0">
				<image src="https://lz.static.seprain.com/assets/imgs/no_data.png"
					mode=""></image>
				<view class="">
					还没有数据
				</view>
			</view>
		</view>
		<view class="add">
			<view class="addsaleman" @click="addC">
				添加业务员
			</view>
			<view class="addsaleman" @click="addL" v-if="isPartner">
				添加业务经理
			</view>
		</view>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				headerImg: '../../../static/img/logo.png',
				isloading: 1,
				userList: [],
				totalPage: 0,
				partnerId: '',
				queryParams: {
					pageNum: 1,
					pageSize: 10,
					isfinish: false,
					userRole: ''
				},
				isPartner: false
			}
		},
		onLoad(options) {
			this.partnerId = options.userId
			this.queryParams.userRole = options.userRole
			if (options.userRole == 4) {
				this.isPartner = true
			}
		},
		onShow() {
			this.isloading = 1
			this.queryParams.pageNum = 1;
			this.queryParams.isfinish = false;
			this.userList = []
			this.getstoreTreeList()
		},
		//下拉刷新，需要自己在page.json文件中配置开启页面下拉刷新 "enablePullDownRefresh": true
		onPullDownRefresh() {
			this.isloading = 1
			this.queryParams.pageNum = 1;
			this.queryParams.isfinish = false;
			this.userList = []
			this.getstoreTreeList()
		},
		//上拉加载，需要自己在page.json文件中配置"onReachBottomDistance"
		onReachBottom() {
			if (this.totalPage > this.queryParams.pageNum) {
				uni.showLoading({
					mask: true,
					title: "加载中..."
				})
				this.queryParams.pageNum++;
				this.getstoreTreeList()
			}

		},
		methods: {
			// 获取合伙人,业务经理列表
			getstoreTreeList() {
				this.$http.getpageListByUser(this.queryParams).then(res => {
					if (res.code == 200) {
						uni.stopPullDownRefresh()
						uni.hideLoading()
						this.isloading = 0
						this.totalPage = res.data.totalPage
						this.userList = _.concat(this.userList, res.data.list);
						if (res.data.totalPage == this.queryParams.pageNum || _.size(res.data.list) === 0) {
							this.queryParams.isfinish = true;
						}
					} else {
						this.userList = []
						this.queryParams.isfinish = true
					}
				})
			},
			goSalesmanReward() {
				uni.navigateTo({
					url: '../salesmanReward/salesmanReward'
				})
			},
			addC() {
				uni.navigateTo({
					url: './addSalesman?partnerId=' + this.partnerId
				})
			},
			addL() {
				uni.navigateTo({
					url: './addBusinessManager?partnerId=' + this.partnerId
				})
			}
		},
	}
</script>
<style lang="scss">
	page {
		background-color: #fff;
	}

	.setup {
		width: 100%;
		height: 100upx;
		padding: 0 28upx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		position: sticky;
		box-sizing: border-box;
		top: 0upx;
		background-color: #fff;
		z-index: 999;

		view {}

		image {
			width: 32upx;
			height: 32upx;
		}
	}

	.business {
		border-top: 2upx solid #F6F6F6;
		padding-bottom: 158upx;

		.item {
			padding: 32upx 0;
			margin: 0 28upx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			border-bottom: 2upx solid #F6F6F6;

			.itemimg {
				margin-right: 24upx;
				border-radius: 50%;

				image {
					border-radius: 50%;
					width: 88upx;
					height: 88upx;
				}
			}

			.itemdetail {
				width: 450upx;
				font-size: 28upx;
				font-weight: 300;
				color: #333333;

				.nickname {
					margin-bottom: 16upx;
				}

				.phone {}
			}

			.itemlevel {
				width: 112upx;
				height: 40upx;
				line-height: 40upx;

				.level {
					background: #EB6132;
					border: 2upx solid #EB6132;
					border-radius: 32upx;
					font-size: 24upx;
					font-weight: 300;
					text-align: center;
					// padding: 4upx 20upx;
					color: #FFFFFF;
				}
			}
		}

		.notuserList {
			margin-top: 160upx;
			text-align: center;

			image {
				margin: 48upx 0;
				width: 412upx;
				height: 284upx;
			}

			view {
				font-size: 32upx;
				font-weight: 300;
				color: #999999;
			}
		}
	}

	.add {
		background-color: #fff;
		z-index: 222;
		width: 100%;
		// margin-bottom: 20upx;
		height: 140upx;
		position: fixed;
		bottom: 0upx;
		display: flex;
		align-items: center;
		// padding-left: 48upx;
		justify-content: center;

		.addsaleman {
			margin: 0 32upx;
			flex: 1;
			height: 76upx;
			background: linear-gradient(180deg, #F1722C 0%, #EB6133 100%);
			opacity: 1;
			border-radius: 41upx;
			font-size: 28upx;
			font-weight: 300;
			color: #FFFFFF;
			text-align: center;
			line-height: 76upx;
		}
	}
</style>
