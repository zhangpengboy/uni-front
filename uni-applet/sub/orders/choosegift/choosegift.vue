<template>
	<view v-if="isloading == 0">
		<view class="giftbag" v-if="giftbagList.length">
			<checkbox-group class="chgroup" @change="checkboxChange">
				<block v-for="(item,index) in giftbagList" :key="item">
					<view class="checkbtn">
						<label>
							<checkbox class='' :disabled="!item.isActivate" :value="item.giftCode"
								:checked="item.checked">
							</checkbox>
						</label>
					</view>
					<view class="giftItem" :style="{backgroundImage: 'url(' +  backUrl[item.isActivate] + ')'}">
						<text class="useprice text-price">
							{{item.giftAmount}}
						</text>
						<text class="usebag" v-if="item.isActivate">礼券福袋</text>
						<text class="usebag" v-else>未激活福袋</text>
						<text class="thezone">
							<text class="" style="color: #666;">
								限福袋专区
							</text>
							<text class=""
								style="margin-top: 14rpx;display: block;font-size: 24rpx;font-weight:300;color: #999;">
								{{item.giftValidityStart}}至 {{item.giftValidityEnd}}
							</text>
						</text>
					</view>
				</block>
			</checkbox-group>
		</view>
		<view class="notgiftbag" v-else>
			<image class="notImage" src="../../../static/img/nothavegift.png" mode=""></image>
			<view class="notText">
				还没有礼券福袋~
			</view>
			<!-- <view class="notbutton" @click="buggiftbag">
				去购买
			</view> -->
		</view>
		<template>
			<!-- 占位符 -->
			<view class="blck"></view>
			<!-- 底部按钮 -->
			<view class="footer">
				<view class="settlement">
					<view class="sum">
						<view class="text-sm margin-right-xs">
							<text>已选{{selectnum}}张, 可减</text>
							<text class="text-price text-main" style="margin-left: 6upx;"></text>
							<text class="text-main money">{{selectprice}}</text>
						</view>
					</view>
					<view class="btn" @tap="submitOrder">确定</view>
				</view>
			</view>
		</template>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				isloading: 1,
				giftbagList: [],
				giftselectList: [],
				chenked: false,
				selectnum: 0,
				selectprice: 0,
				backUrl: [
					// 'https://app-static.meitianhui.com/images/a38898c1187e0f5fcc71e827dad8a7ea-pp687qfb1u.png',
					// 'https://app-static.meitianhui.com/images/c6e7b92406fe0983e18d2339bd4eb0a6-ulfx6898tc.png',
				],
				checkUrl: [
					'../static/img/checkno.png',
					'../static/img/checkyes.png',
				],
			};
		},
		onLoad(e) {
			uni.showLoading({
				mask: true,
				title: "加载中..."
			})
			this.getGiftUse(0)
		},
		onShow() {},
		methods: {
			checkboxChange(e) {
				this.selectnum = e.detail.value.length
				let arr = e.detail.value
				let giftarr = []
				let price = 0
				this.giftbagList.map((item, index) => {
					arr.map(its => {
						if (item.giftCode == its) {
							giftarr.push(item.giftCode)
							price += item.giftAmount
						}
					})
				})
				this.giftselectList = giftarr
				this.selectprice = price
			},
			// 跳转购买
			buggiftbag() {
				uni.navigateTo({
					url: '../../giftbag/topup/topup'
				})
			},
			// 确定 
			submitOrder() {
				if (this.selectnum == 0) return
				this.$queue.setJson('giftselectList', this.giftselectList)
				this.$queue.setData('selectprice', this.selectprice)
				uni.navigateBack({
					delta: 1
				})
			},
			// 获取所有礼包
			getGiftUse(index) {
				this.giftbagList = []
				this.$http.getGiftUse({
					type: index
				}).then(res => {
					if (res.code == 200) {
						uni.hideLoading()
						this.isloading = 0
						this.giftbagList = res.data.list
						this.giftbagList.map(item => {
							item.checked = false
							item.giftValidityStart = this.format(item.giftValidityStart)
							item.giftValidityEnd = this.format(item.giftValidityEnd)
						})
					}
				})
			},
			format(shijianchuo) {
				//shijianchuo是整数，否则要parseInt转换
				var time = new Date(shijianchuo);
				var y = time.getFullYear();
				var m = time.getMonth() + 1;
				var d = time.getDate();
				return y + '-' + this.add0(m) + '-' + this.add0(d) + ' ';
			},
			add0(m) {
				return m < 10 ? '0' + m : m
			},
		}
	};
</script>

<style lang="scss">
	page {
		background-color: #fff;
	}

	.notgiftbag {
		margin-top: 160upx;
		text-align: center;

		.notImage {
			margin: 48upx 0;
			width: 412upx;
			height: 284upx;
		}

		.notbutton {
			width: 192upx;
			height: 64upx;
			text-align: center;
			line-height: 64upx;
			margin: 36upx auto;
			background: linear-gradient(180deg, #F1722C 0%, #EB6133 100%);
			border-radius: 48upx;
			font-size: 28upx;
			font-weight: 300;
			color: #FFFFFF;
		}

		.notText {
			font-size: 32upx;
			font-weight: 300;
			color: #999999;
		}
	}

	.giftbag {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		padding-bottom: 100upx;

		.chgroup {
			display: flex;
			flex-wrap: wrap;
			align-items: center;
		}

		.checkbtn {
			width: 36upx;
			height: 36upx;
			margin-right: 28upx;

			checkbox {
				margin-left: 28upx;
				width: 36upx;
				height: 36upx;
			}

			checkbox::before {
				font-family: "cuIcon";
				content: "";
				position: absolute;
				color: #ffffff !important;
				top: 50%;
				margin-top: -8px;
				right: 5px;
				font-size: 32upx;
				line-height: 16px;
				pointer-events: none;
				transform: scale(1, 1);
				transition: all 0.3s ease-in-out 0s;
				z-index: 9;
			}

			/*checkbox 选项框大小  */
			checkbox .wx-checkbox-input {
				width: 36upx;
				height: 36upx;
				border-radius: 50%;
				background-image: url(../static/img/checkno.png);
				background-size: cover;
				background-repeat: inherit;
			}

			checkbox .wx-checkbox-input.wx-checkbox-input-checked {
				background-image: url(../static/img/checkyes.png);
				background-size: cover;
				background-repeat: inherit;
			}

			checkbox[checked] .wx-checkbox-input {
				background-color: #eb6132 !important;
				border-color: #eb6132 !important;
				color: #eb6132 !important;
				border-color: #eb6132 !important;
			}

			checkbox .wx-checkbox-input.wx-checkbox-input-checked::before {
				width: 36upx;
				height: 36upx;
				line-height: 36upx;
				text-align: center;
				color: #E10A07;
			}

		}

		.giftItem {
			margin: 16upx 28upx;
			width: 630upx;
			height: 236upx;
			border-radius: 16upx;
			background-size: cover;
			background-repeat: inherit;
			position: relative;
			color: #666;

			.packagedescription {
				position: absolute;
				top: 0upx;
				left: 0upx;
				// width: 172upx;
				height: 38upx;
				font-size: 24upx;
				color: #fff;
				background: #DDDDDD;
				border-radius: 16upx 0upx 0upx 0upx;

				text {
					padding: 2upx 38upx;
				}
			}

			.price {
				line-height: 236upx;
				font-size: 80upx;
				font-weight: 500;
				color: #fff;
				padding: 82upx 0upx 0upx 30upx;
			}

			.useprice {
				line-height: 206upx;
				font-size: 80upx;
				font-weight: 500;
				color: #fff;
				padding: 82upx 0upx 0upx 30upx;
			}

			.usebag {
				position: absolute;
				bottom: 42upx;
				left: 64upx;
				color: #FFFFFF;
				font-size: 28upx;
			}

			.dottedline {
				height: 100%;
				border-right: 4upx dashed #ddd;
				box-sizing: border-box;
				padding: 94upx 18upx 66upx;
			}

			.thezone {
				position: absolute;
				top: 72upx;
				left: 300upx;
				font-size: 32upx;
				font-weight: bold;
				// color: #EB6133;
			}

			.gouse {
				position: absolute;
				top: 56upx;
				right: 22upx;
				width: 32upx;
				height: 124upx;
				font-size: 32upx;
				font-weight: 300;
				color: #FFFFFF;
			}

			.image {
				position: absolute;
				right: 28upx;
				top: 38upx;
				width: 160upx;
				height: 160upx;
			}
		}
	}

	.footer {
		border-top: 2upx solid #E8E8E8;
		box-sizing: border-box;
		width: 100%;
		padding: 15upx 30upx;
		background-color: $uni-bg-color;
		display: flex;
		justify-content: flex-end;
		align-items: center;
		font-size: 28upx;
		position: fixed;
		bottom: 0;
		z-index: 50;

		.settlement {
			width: 100%;
			display: flex;
			justify-content: flex-end;
			align-items: center;
			.sum {
				font-size: 36upx;
				margin-right: 10upx;
				display: flex;
				justify-content: flex-end;
				align-items: center;
				.money {
					font-weight: 600;
					font-size: 36upx;
				}
			}
			.btn {
				padding: 4upx 50upx;
				
				height: 60upx;
				background-color: $uni-color-main;
				color: #fff;
				display: flex;
				justify-content: center;
				align-items: center;
				font-size: 30upx;
				border-radius: 40upx;
			}
		}
	}
</style>
