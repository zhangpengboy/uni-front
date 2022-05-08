<template>
	<view class="list">
		<view class="row">
			<view class="title"><text>业务员奖励</text></view>
			<view class="right">
				<view class="rightinp">
					<input v-model="incomeConfig.salesmanAmount" value="" placeholder="请输入业务员奖励" />
				</view>
			</view>
		</view>
		<view class="row">
			<view class="title"><text>业务经理奖励</text></view>
			<view class="right">
				<view class="rightinp">
					<input v-model="incomeConfig.leaderAmount" value="" placeholder="请输入业务经理奖励" />
				</view>
			</view>
		</view>
		<view class="goout" @click="forgetPwd">
			确定
		</view>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				incomeConfig: {
					//业务经理
					leaderAmount: 0,
					// 业务员
					salesmanAmount: 0
				},
				Pobj: {
					id: '',
					incomeConfig: {},
					role: '',
					roleType: '',
					topId: ''
				}
			};
		},
		onLoad() {
			uni.showLoading({
				mask: true,
				title: "加载中..."
			})
			this.getPartnerIncomeConfig()
		},
		methods: {
			// 获取合伙人分润配置
			getPartnerIncomeConfig() {
				this.$http.getPartnerIncomeConfig().then(res => {
					uni.hideLoading()
					if (res.code == 200 && res.data) {
						let obj = JSON.parse(res.data.incomeConfig)
						this.incomeConfig.leaderAmount = obj.P.leaderAmount
						this.incomeConfig.salesmanAmount = obj.P.salesmanAmount
						this.Pobj = {
							id: res.data.id,
							incomeConfig: obj,
							role: res.data.role,
							roleType: res.data.roleType,
							topId: res.data.topId
						}
					}
				})
			},
			// 确定
			forgetPwd() {
				if (!(/^(0|\+?[1-9][0-9]*)$/).test(this.incomeConfig.leaderAmount)) {
					this.$queue.showToast('请输入正确的数字');
					return
				}
				if (!(/^(0|\+?[1-9][0-9]*)$/).test(this.incomeConfig.salesmanAmount)) {
					this.$queue.showToast('请输入正确的数字');
					return
				}
				if (+this.incomeConfig.leaderAmount + +this.incomeConfig.salesmanAmount > 230) {
					this.$queue.showToast('奖励总和不能超过230');
					return
				}
				uni.showLoading({
					mask: true,
					title: "加载中..."
				})
				this.Pobj.incomeConfig.P.leaderAmount = this.incomeConfig.leaderAmount
				this.Pobj.incomeConfig.P.salesmanAmount = this.incomeConfig.salesmanAmount
				this.Pobj.incomeConfig = JSON.stringify(this.Pobj.incomeConfig)
				this.$http.updatePartnerIncomeConfig(this.Pobj).then(res => {
					uni.hideLoading()
					if (res.code == 200) {
						this.$queue.showToast('修改成功');
						this.getPartnerIncomeConfig()
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
