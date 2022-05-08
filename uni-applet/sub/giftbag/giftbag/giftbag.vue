<template>
	<view v-if="isloading == 0">
		<view class="fixed">
			<view class="signin" @click="clicksignin">
				<view class="">
					<image v-if="isUserSign" src="../../../static/img/signin.png" mode=""></image>
					<image v-if="!isUserSign" src="../../../static/img/didnotsignin.png" mode=""></image>
					<text :class="{noactive: !isUserSign}" class="sign">签到</text>
				</view>
				<view class="right">
					<!-- 一次都没签到显示 -->
					<text class="cumulative"
						v-if="isfirstsign">累计签到{{currentsign.config.signDay ? currentsign.config.signDay : 25}}天激活一张礼券福袋</text>
					<!-- 没签到显示 -->
					<text class="cumulative" v-if="!isfirstsign">已签到<text
							style="color: #EB6133;padding: 0 6rpx;">{{currentsign.signCount}}</text>天,还剩<text
							style="color: #EB6133;padding: 0 6rpx;">{{currentsign.config.signDay - currentsign.signCount < 0 ? 0 : currentsign.config.signDay - currentsign.signCount }}</text>天可激活礼券福袋</text>
					<text class="icon cuIcon-right"></text>
				</view>
			</view>
			<view class="operation">
				<view class="operItem" :class="{active: indexs == index}" @click="operationClick(index)"
					v-for="(item,index) in operationList" :key="item.id">
					<view class="text">{{item.name}}</view>
					<view class="line" v-show="indexs == index"></view>
				</view>
			</view>
			<!-- <view class="time">
			<view class="overdue">
				过期时间
				<text class="cuIcon-order"></text>
			</view>
			<view class="effect">
				生效时间
				<text class="cuIcon-order"></text>
			</view>
		</view> -->
		</view>
		<view style="height: 24upx;background-color: #f7f7f7;"></view>
		<view class="giftbag" v-if="indexs == 0 && listShow">
			<block v-for="item in giftbagList" :key="item.id">
				<view class="giftItem" :style="{backgroundImage: 'url(' +  backUrl[item.isActivate] + ')'}"
					@click="gogiftcolumn(item)">
					<view class="packagedescription"
						:style="{backgroundColor: item.isActivate == 1? '#FFDCCF' : '#DDDDDD',color: item.isActivate == 1? '#B83E15' : '#fff'}">
						<text>礼券福袋</text>
					</view>
					<text class="price text-price" :style="{color: item.isActivate == 1? '#EB6133' : '#fff'}">
						{{item.giftAmount}}
					</text>
					<text class="dottedline">
					</text>
					<text class="thezone" :style="{color: item.isActivate == 1? '#EB6133' : '#666'}">
						<text class="">
							限福袋专区
						</text>
						<text class="" v-if="item.isActivate"
							style="margin-top: 14rpx;display: block;font-size: 24rpx;font-weight:300">
							有效期至{{item.giftValidityEnd}}之前
						</text>
						<text class="" v-else style="margin-top: 14rpx;display: block;font-size: 24rpx;font-weight:300">
							签到截止时间{{item.giftValidityEnd}}之前
						</text>
					</text>
					<text class="gouse">
						{{item.isActivate == 1 ? '去使用' : '未激活'}}
					</text>
				</view>
			</block>
		</view>
		<view class="giftbag" v-if="indexs != 0 && listShow">
			<block v-for="(item,index) in giftbagList" :key="index">
				<view class="giftItem" :style="{backgroundImage: 'url(' +  backUrl[indexs + 1] + ')'}">
					<text class="useprice text-price">
						{{item.giftAmount}}
					</text>
					<text class="usebag">礼券福袋</text>
					<text class="thezone">
						<text class="" style="color: #666;">
							限福袋专区
						</text>
						<text class=""
							style="margin-top: 14rpx;display: block;font-size: 24rpx;font-weight:300;color: #999;">
							{{item.giftValidityStart}}至{{item.giftValidityEnd}}之前
						</text>
					</text>
					<image v-if="indexs == 1" class="image" src="../../../static/img/use.png" mode=""></image>
					<image v-if="indexs == 2" class="image" src="../../../static/img/overdue.png" mode=""></image>
				</view>
			</block>
		</view>
		<view class="notgiftbag" v-if="giftbagList.length == 0 && listShow">
			<image class="notImage" src="../../../static/img/nothavegift.png" mode=""></image>
			<view class="notText">
				还没有礼券福袋~
			</view>
			<!-- <view class="notbutton" v-if="indexs == 0" @click="buggiftbag">
				去购买
			</view> -->
		</view>
		<view class="password-wrap" v-if="wrapper == 1">
			<view class="bg"></view>
			<view class="content">
				<view class="sginbounced">
					<image src="../../../static/img/sginpic.png" mode=""></image>
					<view class="sginday">已签到<text
							style="color: #EB6133;padding: 0upx 10upx;">{{currentsign.signCount}}</text>天
					</view>
					<view class="fillsgin" style="background-color: #ee6a2e;color: #fff;" v-if="Leakagesigndays <= 0"
						@click="gotoRetroactive(1)">签到</view>
					<view class="fillsgin" v-else @click="gotoRetroactive(2)">查看</view>
					<view class="ins">累计签到{{currentsign.config.signDay}}天激活一张礼券福袋</view>
				</view>
			</view>
			<view class="cloesicon">
				<image @click="wrapper = 0" src="../../../static/img/closeicon.png" mode=""></image>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				isloading: 1,
				listShow: false,
				wrapper: 0,
				operationList: [{
						id: 0,
						name: '未使用'
					},
					{
						id: 1,
						name: '使用记录'
					},
					{
						id: 2,
						name: '已过期'
					}
				],
				indexs: 0,
				giftbagList: [],
				backUrl: [
					// 'https://app-static.meitianhui.com/images/560d8705f37ffc2e250b719f403f3da7-2as2f72cj3.png',
					// 'https://app-static.meitianhui.com/images/5164406bf508fea1c227e9551bedd610-qxwmh4x0d4.png',
					// 'https://app-static.meitianhui.com/images/c6e7b92406fe0983e18d2339bd4eb0a6-ulfx6898tc.png',
					// 'https://app-static.meitianhui.com/images/a38898c1187e0f5fcc71e827dad8a7ea-pp687qfb1u.png'
				],
				notusegiftbag: [],
				// 当前签到的礼包详情
				currentsign: {},
				// 是否第一个次签到
				isfirstsign: false,
				isUserSign: true,
				// 漏签天数
				Leakagesigndays: 0,
				// 有没有这个礼包
				ishavegift: true,
			}
		},
		onLoad() {
			uni.showLoading({
				mask: true,
				title: "加载中..."
			})
			this.isloading = 1
		},
		onShow() {
			this.listShow = false
			if (this.indexs > 0) {
				this.getGiftUse(this.indexs)
			} else {
				this.getGiftUse(0)
			}
			this.getOmitCount()
			this.getIsFirstTimeSign()
			this.getisUserSign()
			this.getuserCurrentGift()
			this.wrapper = 0
		},
		methods: {
			// 判断是否第一次签到
			getIsFirstTimeSign() {
				this.$http.IsFirstTimeSign().then(res => {
					if (res.code == 200) {
						this.isfirstsign = res.data
					} else {
						this.isfirstsign = true
					}
				})
			},
			// 判断当前用户是否签到
			getisUserSign() {
				this.$http.isUserSign().then(res => {
					if (res.code == 200) {
						//没签到
						this.ishavegift = true
						this.isUserSign = res.data
					} else if (res.code == 500) {
						this.ishavegift = false
					}
				})
			},
			// 签到
			getusersign() {
				// 为  false 已经签到  Leakagesigndays <= 0  没有漏签
				// if (!this.isUserSign && this.Leakagesigndays <= 0) return uni.navigateTo({
				// 	url: '../retroactive/retroactive'
				// })
				// if (!this.isUserSign && this.Leakagesigndays > 0) return uni.navigateTo({
				// 	url: '../retroactive/retroactive'
				// })
				if (!this.isUserSign) return uni.navigateTo({
					url: '../retroactive/retroactive'
				})
				var repaiTime = new Date().getTime()
				this.$http.userGiftSign({
					repaiTime: repaiTime
				}).then(res => {
					this.wrapper = 1
					this.isUserSign = false
					this.isfirstsign = false
					this.getuserCurrentGift()
				})
			},
			// 跳转礼包商城
			gogiftcolumn(v) {
				if (v.isActivate == 0) return
				uni.navigateTo({
					url: '../../activity/activity/activity?name=' + '福袋' + '&code=' +
						this.$stringUtils.giftbagCode()
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
						this.listShow = true
						this.giftbagList = res.data.list
						this.giftbagList.map(item => {
							item.giftValidityStart = this.format(item.giftValidityStart)
							item.giftValidityEnd = this.format(item.giftValidityEnd)
						})
					}
				})
			},
			format(shijianchuo) {
				var time = new Date(shijianchuo);
				var y = time.getFullYear();
				var m = time.getMonth() + 1;
				var d = time.getDate();
				return y + '-' + this.add0(m) + '-' + this.add0(d) + ' ';
			},
			add0(m) {
				return m < 10 ? '0' + m : m
			},
			// 操作
			operationClick(index) {
				if (this.indexs == index) return
				this.indexs = index
				this.listShow = false
				this.getGiftUse(index)
			},
			// 签到弹框
			clicksignin() {
				// 是否开通礼券
				if (!this.ishavegift) return
				this.getusersign()
			},
			// 跳转补签页面
			gotoRetroactive(v) {
				// 确定按钮, 直接关闭功能
				// if (v == 1) {
				// 	this.wrapper = 0
				// 	this.getOmitCount()
				// } else {
				uni.navigateTo({
					url: '../retroactive/retroactive'
				})
				// }
			},
			// 返回当前时间所属的礼包卷
			getuserCurrentGift() {
				// this.currentsign = {}
				this.$http.userCurrentGift().then(res => {
					uni.hideLoading()
					if (res.code == 200) {
						this.currentsign = res.data
						if (this.currentsign.signCount == null) {
							this.currentsign.signCount = null
						}
					} else {
						this.currentsign.signCount = 0
					}
				})
			},
			// 返回漏签的天数
			getOmitCount() {
				this.$http.getOmitCount().then(res => {
					if (res.code == 200) {
						this.Leakagesigndays = res.data
					} else {
						this.Leakagesigndays = 0
					}
				})
			},
			// 跳转购买
			buggiftbag() {
				uni.navigateTo({
					url: '../topup/topup'
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #fff;
	}

	.active {
		color: #EB6133 !important;
	}
	.fixed {
		position: sticky;
		top: 0rpx;
		height: 198upx;
		overflow: hidden;
		background-color: #fff;
		z-index: 999;
	}
	.signin {
		width: 694upx;
		height: 84upx;
		background: #FFEEE8;
		border-radius: 16upx;
		margin: 20upx auto 0;
		line-height: 84upx;

		view {
			float: left;
		}

		// display: flex;
		// flex-wrap: wrap;
		// align-items: center;
		image {
			width: 44upx;
			height: 44upx;
			margin-left: 28upx;
			margin-right: 16upx;
			// vertical-align: middle;
			margin-bottom: -8upx;
		}

		.sign {
			font-size: 28upx;
			font-weight: 300;
			color: #EB6133;
		}

		.noactive {
			color: #999999;
		}

		.right {
			float: right;
			margin-right: 28upx;

			.cumulative {
				margin-right: 20upx;
				margin-left: 28upx;
				font-size: 26upx;
				font-weight: 300;
				color: #999999;
			}

			.icon {
				color: #999999;
			}
		}
	}

	.operation {
		width: 100%;
		border-bottom: 2upx solid #f7f7f7;
		display: flex;
		justify-content: space-around;

		.operItem {
			margin-top: 24upx;
			font-size: 32upx;
			font-weight: 300;
			color: #333333;

			.line {
				margin: 0 auto;
				margin-top: 16upx;
				width: 64upx;
				height: 8upx;
				background: #EB6133;
			}
		}
	}

	.time {
		display: flex;
		justify-content: space-around;
		font-size: 28upx;
		font-weight: 300;
		color: #333333;
		margin-top: 16upx;
		margin-bottom: 16upx;

		text {
			font-size: 24upx;
		}
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
		.giftItem {
			margin: 32upx auto;
			width: 694upx;
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

	.password-wrap {
		width: 100%;
		height: 100%;
		position: fixed;
		top: 0;
		left: 0;
		z-index: 9999;

		.bg {
			position: absolute;
			width: 100%;
			height: 100%;
			top: 0;
			left: 0;
			background: #000000;
			opacity: 0.5;
		}

		.cloesicon {
			position: absolute;
			top: 82%;
			left: 50%;
			transform: translate(-50%, -50%);

			image {
				width: 48upx;
				height: 48upx;
			}
		}

		.content {
			position: absolute;
			top: 48.5%;
			left: 50%;
			transform: translate(-50%, -50%);
			width: 600upx;
			background-color: #fff;
			border-radius: 16upx;
			// height: 324px;

			.sginbounced {
				text-align: center;
				margin: 48upx 0upx 40upx;

				image {
					width: 328upx;
					height: 328upx;
				}

				.sginday {
					font-size: 32upx;
					font-weight: 500;
					color: #333333;
					margin: 24upx 0upx;
				}

				.fillsgin {
					width: 496upx;
					height: 80upx;
					border: 2upx solid #EB6133;
					border-radius: 36upx;
					margin: 0upx auto 24upx;
					line-height: 80upx;
					font-size: 30upx;
					font-weight: 500;
					color: #EB6133;
				}

				.ins {
					font-size: 26upx;
					font-weight: 300;
					color: #666666;
				}
			}
		}
	}
</style>
