<template>
	<view class="">
		<!-- 关注公众号 -->
		<official-account class="page-pay"></official-account>
		<view class="page-section">
			<view class="gold_header">
				<image src="/static/img/logo.png"></image>
				<text>{{storeInfo.storeName}}</text>
			</view>
			<view class="gold">
				<view class="weui-cells__title">付款金额</view>
				<view class="weui-cells weui-cells_after-title">
					<view class="weui-cell weui-cell_input">
						<text>￥</text>
						<input class="weui-input" maxlength="8" v-model="inputNum" type="digit"
							@input.stop="gold_number" placeholder="输入付款金额"></input>
					</view>
				</view>
				<view class="money_bottom">赠送 <text style="color:red;text-align: center;">{{certificates}}</text>
					礼券，完成后送至您的个人中心。</view>
			</view>
			<view v-show="isIntegralIsEnough" class="isIntegralIsEnough">
				<view>当前店铺可赠送礼券为0</view>
			</view>
		</view>
		<view class="bonnt">
			<view class="sbumt_bonnt">
				<button type="warn" class="sbumt_n" @click="sbumt_n">确认付款</button>
			</view>
		</view>

		<!--logs.wxml-->
		<!-- <view class="container log-list">
		  <block wx:for="{{logs}}" wx:for-item="log">
		    <text class="log-item">{{index + 1}}. {{log}}</text>
		  </block>
		</view> -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				storesId: "",
				// 输入金额
				inputNum: '',
				// 赠送礼券
				certificates: "0",
				statu: true,
				storeInfo: {},
				isIntegralIsEnough: false
			};
		},
		onLoad(e) {
			console.log("===进入支付页面参数===", e)
			let scene = decodeURIComponent(e.scene);
			if (!scene == "undefined") {
				wx.showModal({
					title: '友情提示',
					content: '商户礼券码识别有误,请重新扫码',
					showCancel: false, //是否显示取消按钮
					confirmText: "确定", //默认是“确定”
					confirmColor: 'black', //确定文字的颜色
					success: function(res) {
						if (res.cancel) {
							//点击取消,默认隐藏弹框
						} else {
							//点击确定
							uni.switchTab({
								url: '/pages/home/home'
							})
						}
					},
					fail: function(res) {}, //接口调用失败的回调函数
					complete: function(res) {}, //接口调用结束的回调函数（调用成功、失败都会执行）
				})
				return false;
			}
			this.storesId = scene
			// 获取店铺信息
			this.getStoreInfoByStoreId(this.storesId)
		},
		onShow() {
			if (!this.hasLogin) {
				console.log("未登录")
				return this.toPageLogin();
			}
			console.log("已登录", this.storesId)
		},
		methods: {
			/* 跳转登陆 */
			toPageLogin() {
				uni.navigateTo({
					url: "/pages/login/login?page=cashier",
				})
			},
			/* 获取店铺信息 */
			async getStoreInfoByStoreId(storeId) {
				const {
					data,
					message
				} = await this.$http.getStoreInfoByStoreId({
					storeId
				})
				if (!data) {
					this.$queue.showToast(message)
				}
				this.storeInfo = data
				this.storesId = data.id
			},
			/* 输入金额格式化 */
			gold_number: _.debounce(function(e){
				const that = this;
				e.detail.value = e.detail.value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
				e.detail.value = e.detail.value.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');
				if (e.detail.value.indexOf(".") < 0 && e.detail.value != "") {
					e.detail.value = parseFloat(e.detail.value);
				} else if (e.detail.value.indexOf(".") == 0) {
					e.detail.value = e.detail.value.replace(/[^$#$]/g, "0.");
					e.detail.value = e.detail.value.replace(/\.{2,}/g, ".");
				}
				that.inputNum = e.detail.value
				that.isIntegralIsEnough = false
				if (that.inputNum != '') {
						that.giveIntegralTotal()
				}
			},500),
			/* 获取礼券付款金额 */
			giveIntegralTotal() {
				let obj = {
					money: this.inputNum,
					storeId: this.storesId
				}
				this.$http.giveIntegralTotal(obj).then(res => {
					this.certificates = res.data.integral;
				})
			},
			/* 提交付款 */
			sbumt_n() {
				uni.showLoading({
					mask: true,
					title: "加载中..."
				})
				this.$http.createOfflineOrder({
					storeId: this.storeInfo.id,
					storeName: this.storeInfo.storeName,
					payAmount: this.inputNum,
					bsType: 'BS_A002'
				}).then(res => {
					if (!res.success) {
						uni.hideLoading();
						return this.$queue.showToast(res.message)
					}
					this.$http.createPayOrder({
						openId: this.$queue.getData("openId"),
						orderNo: res.data,
						payType: '2', 
						bsType: 'BS_A002'
					}).then(backdata => {
						if (!backdata.success) {
							uni.hideLoading();
							return this.$queue.showToast(backdata.message)
						}
						uni.requestPayment({
							provider: 'wxpay',
							appId: backdata.data.appid,
							nonceStr: backdata.data.nonceStr,
							package: backdata.data.package,
							paySign: backdata.data.paySign,
							signType: backdata.data.signType,
							timeStamp: backdata.data.timeStamp,
							success: result => {
								uni.hideLoading();
								uni.showToast({
									title: '支付成功'
								});
								setTimeout(() => {
									uni.switchTab({
										url: '/pages/home/home'
									});
								}, 700);
							},
							fail: err => {
								setTimeout(() => {
									uni.hideLoading();
									uni.showToast({
										title: '支付取消或失败,请重新支付',
										icon: 'none'
									});
								}, 700);
							}
						});
					})
				})
			},
		}
	};
</script>

<style lang="scss">
	page,view {
		background: $uni-bg-color;
	}
	.log-list {
		display: flex;
		flex-direction: column;
		padding: 40rpx;
	}

	.log-item {
		margin: 10rpx;
	}

	/*checkbox 整体大小  */
	/*checkbox 选项框大小  */
	checkbox .wx-checkbox-input {
		width: 40rpx;
		height: 40rpx;
		border-radius: 50%;
		color: #fff;
	}

	checkbox .wx-checkbox-input.wx-checkbox-input-checked {
		color: #fff;
		background: #ff8500;
	}

	.gold_header {
		/* margin-bottom: 10px; */
		text-align: center;
	}

	.gold_header image {
		width: 83rpx;
		height: 83rpx;
		display: block;
		margin: 60rpx auto 20rpx;
		border-radius: 50%;
	}

	.gold_header text {
		font-size: 26rpx;
		color: #1A1A1A;
		font-weight: bold;
	}

	.gold,
	.gold_way,
	.gold_header {
		padding: 0 100rpx 70rpx;
		background-color: #fff;
	}

	.weui-cells__title {
		font-size: 26rpx;
		font-weight: 700;
		color: #1a1a1a;
		text-align: left;
	}

	.weui-cells_after-title {
		line-height: 25rpx;
		padding-bottom: 20rpx;
		border-bottom: 1px solid #ccc;
	}

	.weui-cell_input text {
		height: 1.4rem;
		/* display: inline-block; */
		font-size: 40rpx;
		color: #ccc;
		float: left;
		margin-top: 40rpx;
	}

	.weui-input {
		margin-top: 30rpx;
		font-size: 32rpx;
		display: inline-block;
	}

	.footAll-box {
		margin-top: 30rpx;
		display: flex;
		justify-content: space-between;
		border-bottom: 1px solid #ccc;
		padding-bottom: 20rpx;
		color: #343434;
	}

	.footAll_total image {
		width: 32rpx;
		height: 32rpx;
		margin-right: 20rpx;
	}

	.gold_way {
		border-bottom-left-radius: 50rpx;
		border-bottom-right-radius: 50rpx;
		padding-bottom: 80rpx;
	}

	.page-section {
		padding-bottom: 20rpx;
	}

	.bonnt {
		padding-top: 20rpx;
	}

	.sbumt_bonnt {
		padding-top: 40rpx;
		padding-bottom: 40rpx;
		background-color: #fff;
		border-top-left-radius: 50rpx;
		border-top-right-radius: 50rpx;
	}

	.sbumt_bonnt .sbumt_n {
		margin-top: 20rpx;
		background-color: #FF6232;
		color: #fff;
		width: 60%;
		font-size: 30rpx;
	}

	.money {
		margin-top: 80rpx;
		text-align: center;
	}

	.money_top {
		color: #1A1A1A;
		font-size: 52rpx;
		font-weight: bold;
		margin-bottom: 40rpx;
	}

	.money_bottom {
		color: #666666;
		font-size: 26rpx;
		margin-top: 25rpx;
	}
	.isIntegralIsEnough {
		color: #FF6232;
		text-align: center;
	}
</style>
