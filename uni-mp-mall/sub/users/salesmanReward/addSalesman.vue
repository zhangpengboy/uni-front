<template>
	<view class="list">
		<view class="row">
			<view class="title"><text>业务经理手机号</text></view>
			<view class="right">
				<view class="rightinp">
					<input v-model="incomeConfig.leaderPhone" value="" placeholder="请输入业务经理手机号"
						placeholder-style="color: #C1C1C1;" />
				</view>
			</view>
		</view>
		<view class="row">
			<view class="title"><text style="color: #F53232; margin: 0rpx 8upx 0rpx 0;">*</text><text>业务员手机号</text></view>
			<view class="right">
				<view class="rightinp">
					<input v-model="incomeConfig.salesmanPhone" value="" placeholder="请输业务员手机号"
						placeholder-style="color: #C1C1C1;" />
				</view>
			</view>
		</view>
		<view class="goout" @click="forgetPwd">
			提交
		</view>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				incomeConfig: {
					//业务经理
					leaderPhone: '',
					// 业务员
					salesmanPhone: ''
				},
			};
		},
		onLoad(e) {
			uni.showLoading({
				mask: true,
				title: "加载中..."
			})
			this.incomeConfig.partnerId = e.partnerId
			uni.hideLoading()
		},
		methods: {
			// 确定
			forgetPwd() {
				if (this.incomeConfig.leaderPhone != '') {
					if (!(
							/^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[189]))\d{8}$/)
						.test(this.incomeConfig.leaderPhone)) {
						this.$queue.showToast('请输入正确的手机号');
						return
					}
				}
				if (!(
						/^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[189]))\d{8}$/)
					.test(this.incomeConfig.salesmanPhone)) {
					this.$queue.showToast('请输入正确的手机号');
					return
				}
				uni.showLoading({
					mask: true,
					title: "加载中..."
				})
				this.$http.bindRelationByPhone(this.incomeConfig).then(res => {
					uni.hideLoading()
					if (res.code == 200) {
						this.$queue.showToast('添加成功');
						uni.navigateBack({
							delta: 1
						})
					} else {
						this.$queue.showToast(res.message);
					}
				})
			}
		}
	};
</script>
<style lang="scss">
	.active {
		background-color: #ccc !important
	}

	.list {
		margin-bottom: 20upx;

		.row {
			box-sizing: border-box;
			background-color: #fff;
			padding-left: 4%;
			width: 100;
			height: 96upx;
			line-height: 96upx;
			display: flex;
			align-items: center;
			// justify-content: space-between;
			border-bottom: solid 1upx #eee;
			position: relative;

			&:last-child {
				border-bottom: none;
			}

			.title {
				width: 236upx;
				height: 96upx;
				font-size: 28upx;

				// display: inline-block;
				// position: relative;
				text {
					// position: absolute;
					// top: 50%;
					// left: 0;
					// transform: translateX(-50%);
					// transform: translateY(-50%);
				}
			}

			.right {
				width: 60%;
				height: 90upx;

				// display: inline-block;
				// text-align: left;
				// vertical-align:middle;
				// box-sizing: border-box;
				.rightinp {
					margin-top: 20upx;
					// height: 90upx;
					// line-height: 90upx;
					box-sizing: border-box;
				}
			}

			.signBtn {
				z-index: 9999;
				position: absolute;
				right: 28upx;
				line-height: 56upx;
				background: linear-gradient(180deg, #F1722C 0%, #EB6133 100%);
				border-radius: 40upx;
				text-align: center;
				font-size: 26upx;
				font-weight: 300;
				color: #FFFFFF;
			}
		}
	}

	.goout {
		width: 524upx;
		height: 76upx;
		background: linear-gradient(180deg, #F1722C 0%, #EB6133 100%);
		border-radius: 40upx;
		font-size: 28upx;
		font-weight: 300;
		color: #FFFFFF;
		text-align: center;
		line-height: 76upx;
		margin: 60upx auto 0upx;
	}
</style>
