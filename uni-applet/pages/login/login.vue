<template>
	<view class="container">
		<view style="text-align: center;">
			<image style="width: 180upx;height: 180upx;margin-top: 140upx;border-radius:20upx"
				src="/static/img/logo.png"></image>
			<view style="font-size: 28upx;margin-top: 32upx;margin-bottom: 32upx;">打造国内优质品牌好货供应平台</view>
			<!-- <button class="confirm-btn-weixin" open-type="getPhoneNumber" withCredentials="true" lang="zh_CN"
				@getphonenumber="handleGetPhoneNumber">授权手机号登录</button> -->
			<button class="confirm-btn-weixin" @tap="getUserProfile">授权登录</button>
			<!-- 底部信息 -->
			<!-- <view class="footer">
				<text>登录即代表同意</text>
				<navigator url="/pages/public/mimi" open-type="navigate">《隐私政策》</navigator>
				和
				<navigator url="/pages/public/xieyi" open-type="navigate">《用户服务协议》</navigator>
			</view> -->
		</view>

		<!-- 授权电话弹窗 -->
		<!-- #ifdef MP-WEIXIN -->
		<!-- <view class="cu-modal bottom-modal" :class="showAuthPhone ? 'show' : 'hide'">
			<view class="cu-dialog">
				<view class="cu-bar bg-wight justify-end">
					<view class="action" @tap.stop="showAuthPhone = !showAuthPhone"><text class="cuIcon-close"></text>
					</view>
				</view>
				<view class="padding-sm text-center">
					<view class="text-xsl">
					</view>
					<view class="text-gray">
						<view class="padding-top-sm">为了提供更好的服务</view>
						<view class="padding-top-sm">申请获取用户信息用于收货联系方式、其他等</view>
					</view>
					<button class="confirm-btn-weixin" hover-class="none" @tap="getUserProfile" lang="zh_CN">授权用户信息</button>
				</view>
			</view>
		</view> -->
		<!-- #endif -->
	</view>
</template>
<script>
	export default {
		data() {
			return {
				mobile: '',
				code: '',
				showAuthPhone: false,
				wxUserInfo: {},
				backPage: null,
				canUseGetUserProfile: false
			};
		},
		onLoad(options) {
			const that = this;
			this.backPage = options.page;
			//判断是否存在getUserProfile方法
			if (uni.getUserProfile) {
				this.canUseGetUserProfile = true
			}
		},
		methods: {
			getUserProfile() {
				const that = this;
				uni.login({
					provider: 'weixin',
					success: function(loginRes) {
						that.code = loginRes.code;
					},
				});
				uni.getUserProfile({
					desc: "用于完善会员资料",
					success: function(infoRes) {
						console.log('infoRes', infoRes);
						// 保存用户的基础信息
						if (infoRes.errMsg == 'getUserProfile:ok') {
							that.$queue.setJson("userInfo", infoRes.userInfo)
							// 更新微信用户信息
							that.$queue.showLoading('正在登录中...');
							that.$http.oauthLogin({
									encryptedData: infoRes.encryptedData,
									iv: infoRes.iv,
									code: that.code,
									inviteCode: that.$queue.getInvitation() || "",
								})
								.then(res => {
									uni.hideLoading();
									if (res.success) {
										that.$queue.setJson("userToken", res.data);
										that.$queue.setData("userId", res.data.userId);
										that.$queue.setData("openId", res.data.openId);
										that.$queue.setData("phone", res.data.phone);
										that.$queue.setJson("sessionKey", res.data.sessionKey);
										that.showAuthPhone = false
										that.$queue.setData("hasLogin", true);
										uni.showToast({
											title: '登录成功',
											icon: 'success'
										});
										setTimeout(() => {
											if (that.backPage == 'user') {
												uni.switchTab({
													url: "/pages/user/user"
												})
											} else {
												uni.navigateBack({
													delta: 1
												})
											}
										}, 300);

									} else {
										that.$queue.showToast(res.message);
									}
								}).catch(err => {
									uni.hideLoading();
									that.$queue.showToast("授权失败, 请重新授权")
								});
						}
					},
					fail: function(err) {
						that.$queue.showToast("授权失败, 请重新授权")
					}
				})

			},
			/* 授权一键登录按钮操作 */
			/* 2021.4.13日微信整改获取用户头像开放接口 */

			/* 授权一键登录按钮操作 */
			handleGetPhoneNumber: function(phoneRes) {
				const that = this;
				console.log("phoneRes", phoneRes)
				if (phoneRes.detail.errMsg == "getPhoneNumber:ok") {
					this.$queue.showLoading('正在登录中...');
					that.$http.oauthLogin({
							encryptedData: phoneRes.detail.encryptedData,
							iv: phoneRes.detail.iv,
							code: that.code,
							inviteCode: that.$queue.getInvitation() || "",
						})
						.then(res => {
							uni.hideLoading();
							if (res.success) {
								that.$queue.setJson("userToken", res.data);
								that.$queue.setData("openId", res.data.openId);
								that.$queue.setData("phone", res.data.phone);
								that.$queue.setJson("sessionKey", res.data.sessionKey);
								that.showAuthPhone = false
								that.$queue.setData("hasLogin", true);
								if (!res.data.isEquals) {
									// uni.showToast({
									// 	title: '您已存在平台账号，绑定手机号为：' + res.data.phone + '，将以此账号进行登录！',
									// 	icon: 'none',
									// 	duration: 3000,
									// });
									wx.showModal({
										title: '',
										showCancel: false,
										content: '您已存在平台账号，绑定手机号为：' + res.data.phone + '，将以此账号进行登录！',
										confirmColor: '#ee6e2c',
										success: function(res) {
											if (res.confirm) {
												console.log('确定')
												setTimeout(() => {
													if (that.backPage == 'user') {
														uni.switchTab({
															url: "/pages/user/user"
														})
													} else {
														uni.navigateBack({
															delta: 1
														})
													}
												}, 300);
											} else {
												console.log('取消')
											}
										}
									})

								} else {
									uni.showToast({
										title: '登录成功',
										icon: 'success'
									});
									setTimeout(() => {
										if (that.backPage == 'user') {
											uni.switchTab({
												url: "/pages/user/user"
											})
										} else {
											uni.navigateBack({
												delta: 1
											})
										}
									}, 300);
								}

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
		}
	};
</script>

<style lang="scss">
	.footer {
		padding-left: 140upx;
		margin-top: 32upx;
		font-size: 24upx;
		color: #666666;
		text-align: center;
		display: flex;
	}

	page {
		background: #fff;
	}

	.send-msg {
		border-radius: 30px;
		color: black;
		background: white;
		height: 30px;
		font-size: 14px;
		line-height: 30px;
	}

	.container {
		top: 0;
		padding-top: 50px;
		position: relative;
		width: 100%;
		height: 100%;
		overflow: hidden;
		background: #fff;
	}

	.wrapper {
		position: relative;
		z-index: 90;
		background: #fff;
		padding-bottom: 20px;
	}

	.back-btn {
		position: absolute;
		left: 20px;
		z-index: 9999;
		padding-top: var(--status-bar-height);
		top: 20px;
		font-size: 20px;
		color: $font-color-dark;
	}

	.left-top-sign {
		font-size: 80px;
		color: $page-color-base;
		position: relative;
	}

	.right-top-sign {
		position: absolute;
		top: 40px;
		right: -15px;
		z-index: 95;

		&:before,
		&:after {
			display: block;
			content: '';
			width: 20px;
			height: 40px;
			background: #EB6132;
		}

		&:before {
			transform: rotate(50deg);
			border-radius: 0 50px 0 0;
		}

		&:after {
			position: absolute;
			right: -198px;
			top: 0;
			transform: rotate(-50deg);
			border-radius: 50px 0 0 0;
			/* background: pink; */
		}
	}

	.left-bottom-sign {
		position: absolute;
		left: -270px;
		bottom: -320px;
		/*border: 100upx solid #d0d1fd;*/
		border-radius: 50%;
		padding: 90px;
	}

	.welcome {
		position: relative;
		left: 30px;
		top: -55px;
		font-size: 28px;
		color: #555;
		text-shadow: 1px 0px 1px rgba(0, 0, 0, 0.3);
	}

	.input-content {
		padding: 0 20px;
	}

	.input-item {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: center;
		padding: 0 30px;
		background: $page-color-light;
		height: 64px;
		border-radius: 4px;
		margin-bottom: 30px;

		&:last-child {
			margin-bottom: 0;
		}

		.tit {
			height: 30px;
			line-height: 28px;
			font-size: $font-sm + 2upx;
			color: $font-color-base;
		}

		input {
			height: 40px;
			font-size: $font-base + 2upx;
			color: $font-color-dark;
			width: 100%;
		}
	}

	.confirm-btn-weixin {
		width: 250px;
		height: 42px;
		line-height: 42px;
		border-radius: 30px;
		margin-top: 60upx;
		background: -moz-linear-gradient(143deg, #F32A2A 0%, #FF6B3A 100%);
		background: -webkit-gradient(linear, left top, left right, color-stop(0, #F32A2A), color-stop(100%, #FF6B3A));
		background: -webkit-linear-gradient(143deg, #F32A2A 0%, #FF6B3A 100%);
		background: -o-linear-gradient(143deg, #F32A2A 0%, #FF6B3A 100%);
		background: -ms-linear-gradient(143deg, #F32A2A 0%, #FF6B3A 100%);
		background: linear-gradient(143deg, #F32A2A 0%, #FF6B3A 100%);
		color: #fff;
		font-size: $font-lg;
		margin-bottom: 50upx;

		&:after {
			border-radius: 60px;
		}
	}

	.confirm-btn {
		width: 200px;
		height: 42px;
		line-height: 42px;
		border-radius: 30px;
		margin-top: 300upx;
		background: -moz-linear-gradient(left, #F37733, #EB6132 100%);
		background: -webkit-gradient(linear, left top, left right, color-stop(0, #F37733), color-stop(100%, #EB6132));
		background: -webkit-linear-gradient(left, #F37733 0, #EB6132 100%);
		background: -o-linear-gradient(left, #F37733 0, #EB6132 100%);
		background: -ms-linear-gradient(left, #F37733 0, #EB6132 100%);
		background: linear-gradient(to left, #F37733 0, #EB6132 100%);
		color: #fff;
		font-size: $font-lg;

		&:after {
			border-radius: 60px;
		}
	}

	.confirm-btn1 {
		width: 300px;
		height: 42px;
		line-height: 42px;
		border-radius: 30px;
		margin-top: 40px;
		background: whitesmoke;
		color: grey;
		font-size: $font-lg;

		&:after {
			border-radius: 60px;
		}
	}

	.forget-section {
		font-size: $font-sm + 2upx;
		color: $font-color-spec;
		text-align: center;
		margin-top: 40px;
	}

	.register-section {
		left: 0;
		margin-top: 30px;
		bottom: 30px;
		width: 100%;
		font-size: $font-sm + 2upx;
		color: $font-color-base;
		text-align: center;

		text {
			color: $font-color-spec;
			margin-left: 10px;
		}
	}

	.avatar {
		width: 116upx;
		height: 116upx;
		color: $font-color-base;
		font-size: 26upx;
		border-radius: 50%;
		overflow: hidden;
		margin: 10rpx auto;

	}
</style>
