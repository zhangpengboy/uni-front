<template>
	<view v-if="isloading == 0">
		<view class="content">
			<view class="list">
				<block v-for="(row, index) in addressList" :key="index">
					<view class="row" @tap="select(row)" v-if="addressList.length">
						<view class="left">
							<view class="head">{{ row.head }}</view>
						</view>
						<view class="center">
							<view class="name-tel">
								<view class="name">{{ row.userName }}</view>
								<view class="tel">{{ row.phone }}</view>
								<view class="default" v-if="row.status">默认</view>
							</view>
							<view class="address">{{ row.address}}</view>
						</view>
						<view class="right">
							<view class="icon cuIcon-skin" @tap.stop="edit(row)"></view>
						</view>
					</view>
				</block>
			</view>
			<view class="noAddress" v-if="addressList.length == 0">
				<image :src="imgurl"
					mode=""></image>
				<view>您还没有添加地址</view>
			</view>
		</view>
		<view class="add">
			<view class="btn" @tap="add">
				<view class="icon tianjia"></view>
				新增地址
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
				isSelect: false,
				addressList: []
			};
		},
		onShow() {
			this.imgurl = `${this.$queue.publicCdnHost()}/assets/imgs/no_address.png`
			this.getAddressList();
		},
		onPullDownRefresh() {
			this.getAddressList();
			// setTimeout(function() {
			// 	uni.stopPullDownRefresh();
			// }, 1000);
		},
		onLoad(e) {
			if (e.type == 'select') {
				this.isSelect = true;
			}
		},
		methods: {
			// 获取收货地址
			async getAddressList() {
				const {
					data
				} = await this.$http.getAddressList();
				_.map(data, address => {
					address.head = address.userName.substring(0, 1);
				});
				this.isloading = 0
				uni.stopPullDownRefresh();
				this.addressList = data;
			},
			edit(row) {
				uni.navigateTo({
					url: `edit/edit?type=edit&id=${row.id}`
				});
			},
			add() {
				uni.navigateTo({
					url: 'edit/edit?type=add'
				});
			},
			select(row) {
				//是否需要返回地址(从订单确认页跳过来选收货地址)
				if (this.isSelect) {
					this.$queue.setJson("select_address", row);
					uni.navigateBack();
				}
			}
		}
	};
</script>

<style lang="scss">
	view {
		display: flex;
	}

	.add {
		position: fixed;
		bottom: 0;
		width: 100%;
		height: 120upx;
		justify-content: center;
		align-items: center;

		.btn {
			box-shadow: 0upx 5upx 10upx rgba(0, 0, 0, 0.4);
			width: 70%;
			height: 80upx;
			border-radius: 80upx;
			background: $uni-bg-color-main;
			color: #fff;
			justify-content: center;
			align-items: center;

			.icon {
				height: 80upx;
				color: #fff;
				font-size: 30upx;
				justify-content: center;
				align-items: center;
			}

			font-size: 30upx;
		}
	}

	.list {
		flex-wrap: wrap;

		.row {
			width: 96%;
			padding: 20upx 2%;
			display: flex;
			.left {
				width: 90upx;
				flex-shrink: 0;
				align-items: center;

				.head {
					width: 70upx;
					height: 70upx;
					background: linear-gradient(to right, #ccc, #aaa);
					color: #fff;
					justify-content: center;
					align-items: center;
					border-radius: 60upx;
					font-size: 35upx;
				}
			}

			.center {
				width: 540upx;
				flex-wrap: wrap;
				
				.name-tel {
					width: 100%;
					align-items: baseline;
					margin-bottom: 5upx;

					.name {
						font-size: 30upx;
					}

					.tel {
						margin-left: 30upx;
						font-size: 24upx;
						color: #777;
					}

					.default {
						font-size: 22upx;

						background-color: $base;
						color: #fff;
						padding: 0 18upx;
						border-radius: 24upx;
						margin-left: 20upx;
					}
				}

				.address {
					// width: 100%;
					width: 520upx;
					overflow: hidden;
					font-size: 24upx;
					align-items: baseline;
					color: #777;
				}
			}

			.right {
				flex-shrink: 0;
				align-items: center;
				margin-left: 20upx;

				.icon {
					justify-content: center;
					align-items: center;
					width: 80upx;
					height: 60upx;
					border-left: solid 1upx #aaa;
					font-size: 40upx;
					color: #777;
				}
			}
		}


	}

	.noAddress {
		margin: 160upx auto;
		display: flex;
		flex-wrap: wrap;
		justify-content: center;

		image {
			width: 492upx;
			height: 340upx;
			margin-bottom: 48upx;
		}

		view {
			width: 280upx;
			font-size: 32upx;
			font-weight: 300;
			color: #999999;
		}
	}
</style>
