<template>
	<view class="margin-top-xs">
		<view class="content">
			<view class="list">
				<view class="row">
					<view class="title">头像</view>
					<view class="right">
						<view class="tis">
							<!-- <image :src="userInfo.avatarUrl || '/static/img/logo.png'" mode="widthFix"></image> -->
							<view class="avatar">
								<open-data type="userAvatarUrl"></open-data>
							</view>
						</view>
						<view class="icon"></view>
					</view>
				</view>
				<view class="row margin-top-xs">
					<view class="title">用户名</view>
					<view class="right">
						<!-- <view class="tis">{{ userInfo.nickName }}</view> -->
						<open-data type="userNickName"></open-data>
						<view class="icon"></view>
					</view>
				</view>
				<view class="row">
					<view class="title">性别</view>
					<view class="right" v-if="userInfo.gender != 0">
						<!-- <view class="tis">{{ userInfo.gender == 1 ? '男' : '女' }}</view> -->
						<open-data type="userGender" lang="zh_CN"></open-data>
						<view class="icon"></view>
					</view>
					<view class="right" v-else>
						未知
						<view class="icon"></view>
					</view>
				</view>
				<view class="row">
					<view class="title">绑定手机</view>
					<view class="right">
						<!-- <view class="tis" v-if="!$queue.getData('phone')" @getphonenumber="handleGetPhoneNumber">请绑定手机号</view> -->
						<button class="tis btn" v-if="$queue.getData('phone').length > 11" open-type="getPhoneNumber" withCredentials="true" lang="zh_CN"
							@getphonenumber="handleGetPhoneNumber">请绑定手机号</button>
						<view class="tis" v-else>{{ phone || $queue.getData('phone') }}</view>
						<view class="icon"></view>
					</view>
				</view>
				<view class="row">
					<view class="title">绑定微信</view>
					<view class="right">
						<view class="tis">已绑定</view>
						<view class="icon"></view>
					</view>
				</view>
				<!-- <view class="row" @click="goModify">
					<view class="title">修改登录密码</view>
					<view class="right">
						<view class="tis cuIcon-right"></view>
						<view class="icon"></view>
					</view>
				</view> -->
				<view class="row" v-if="ispartner == 4 || ispartner == 3" @click="goSalesmanReward">
				<!-- <view class="row" v-if="ispartner == 4" @click="goSalesmanReward"> -->
					<view class="title">业务员设置</view>
					<view class="right">
						<view class="tis cuIcon-right"></view>
						<view class="icon"></view>
					</view>
				</view>
				<view class="row" v-if="issaleman">
					<view class="title">数字货架设置</view>
					<view class="right">
						<switch class="tis" :checked="isStatus" @change="switch2Change" />
						<view class="icon"></view>
					</view>
				</view>
			</view>
			<view class="goout" @click="goout">
				退出登录
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				isStatus: false,
				issaleman: false,
				ispartner: 0,
				userId: '',
				code: '',
				phone: '',
			};
		},
		onLoad(e) {
			const that = this;
			this.getuserIsOk()
			this.ispartner = e.ispartner
			this.userId = e.id
			// 提前获取code
			uni.login({
				provider: 'weixin',
				success: function(loginRes) {
					console.log("loginRes", loginRes);
					that.code = loginRes.code;
				}
			})
		},
		methods: {
			/* 授权一键登录按钮操作 */
			handleGetPhoneNumber: function(phoneRes) {
				const that = this;
				console.log("phoneRes", phoneRes)
				if (phoneRes.detail.errMsg == "getPhoneNumber:ok") {
					// this.$queue.showLoading('正在登录中...');
					that.$http.bindingPhone({
							encryptedData: phoneRes.detail.encryptedData,
							iv: phoneRes.detail.iv,
							code: that.code,
							inviteCode: that.$queue.getInvitation() || "",
							oldPhone: that.$queue.getData('phone')
						})
						.then(res => {
							uni.hideLoading();
							if (res.success) {
								that.$queue.setData("phone", res.data);
								that.phone = res.data
								that.$queue.setData("hasLogin", true);
			// 					if (!res.data.isEquals) {
			// 						// uni.showToast({
			// 						// 	title: '您已存在平台账号，绑定手机号为：' + res.data.phone + '，将以此账号进行登录！',
			// 						// 	icon: 'none',
			// 						// 	duration: 3000,
			// 						// });
			// 						wx.showModal({
			// 							title: '',
			// 							showCancel: false,
			// 							content: '您已存在平台账号，绑定手机号为：' + res.data.phone + '，将以此账号进行登录！',
			// 							confirmColor: '#ee6e2c',
			// 							success: function(res) {
			// 								if (res.confirm) {
			// 									console.log('确定')
			// 									setTimeout(() => {
			// 										if (that.backPage == 'user') {
			// 											uni.switchTab({
			// 												url: "/pages/user/user"
			// 											})
			// 										} else {
			// 											uni.navigateBack({
			// 												delta: 1
			// 											})
			// 										}
			// 									}, 300);
			// 								} else {
			// 									console.log('取消')
			// 								}
			// 							}
			// 						})
			
			// 					} else {
			// 						uni.showToast({
			// 							title: '登录成功',
			// 							icon: 'success'
			// 						});
			// 						setTimeout(() => {
			// 							if (that.backPage == 'user') {
			// 								uni.switchTab({
			// 									url: "/pages/user/user"
			// 								})
			// 							} else {
			// 								uni.navigateBack({
			// 									delta: 1
			// 								})
			// 							}
			// 						}, 300);
			// 					}
			
							} else {
								that.$queue.showToast(res.message);
							}
						}).catch(err => {
							uni.hideLoading();
							that.$queue.showToast("授权失败, 请重新授权")
						});
				} else {
					uni.hideLoading();
					this.$queue.showToast("授权失败, 请重新授权")
				}
			},
			// 修改登录密码
			goModify() {
				uni.navigateTo({
					url: '../modify/modify'
				})
			},
			// 业务员奖励
			goSalesmanReward(){
				uni.navigateTo({
					url: '../salesmanReward/salesmanSetup?userRole=' + this.ispartner + '&userId=' + this.userId
					// url: '../salesmanReward/salesmanReward'
				})
			},
			// 清空缓存
			goout() {
				console.log('goout')
				this.$queue.logout()
				uni.switchTab({
					url: '/pages/exchange/exchange'
				})
			},
			switch2Change(e) {
				
				this.$queue.showLoading(e.detail.value ? '开启中...' : '关闭中...');
				let status = e.detail.value ? 1 : 0
				this.$http.updateDigitalShelves({
					status
				}).then(res => {
					if (res.code == 200) {
						setTimeout(function() {
							uni.hideLoading()
							this.isStatus = !this.isStatus
						}, 800)
					}
				})
			},
			// 判断是否为业务员 和数字货架状态
			getuserIsOk() {
				this.$http.getDigitalShelves().then(res => {
					uni.hideLoading()
					if (res.code == 200) {
						this.isStatus = res.data.status == 1 ? true : false
						this.issaleman = res.data.salesman
					} else {
						this.$queue.showToast(res.message)
					}
				})
			},
		}
	};
</script>

<style lang="scss">
	page {
		background-color: #f7f7f7;
	}

	.icon {
		font-size: 30upx;
	}

	.content {
		padding-bottom: 20upx;

		.list {
			margin-bottom: 20upx;

			.row {
				box-sizing: border-box;
				background-color: #fff;
				padding-left: 4%;
				width: 100;
				min-height: 90upx;
				display: flex;
				align-items: center;
				justify-content: space-between;
				border-bottom: solid 1upx #eee;

				&:last-child {
					border-bottom: none;
				}

				.title {
					font-size: 32upx;
					color: #333;
				}

				.right {
					display: flex;
					align-items: center;
					color: #999;

					.tis {
						font-size: 26upx;
						margin-right: 5upx;
						max-height: 120upx;

						// image {
						// 	width: 100upx;
						// 	height: 100upx;
						// 	border-radius: 100%;
						// 	margin: 10upx 0;
						// }
						.avatar {
							width: 76upx;
							height: 76upx;
							border-radius: 50%;
							overflow: hidden;
						}
					}
					.btn {
						background-color: #fff;
						color: #999;
						padding: 0;
					}
					.btn::after {
						border: 0;
					}
					.icon {
						width: 40upx;
						color: #cecece;
					}
				}
			}
		}

		.goout {
			width: 524upx;
			height: 76upx;
			background: $uni-bg-color-main;
			border-radius: 40upx;
			font-size: 28upx;
			font-weight: 300;
			color: #FFFFFF;
			text-align: center;
			line-height: 76upx;
			margin: 60upx auto 0upx;
		}
	}
</style>
