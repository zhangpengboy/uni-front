<template>
	<view>
		<view class="information">
			<view class="avatar">
				<open-data type="userAvatarUrl"></open-data>
			</view>
			<view class="phone">
				<view class="tis">{{ phone }}
				</view>
			</view>
		</view>
		<view class="giftbag">
			<view class="bagnum">
				福袋数量
			</view>
			<view class="num">
				<text class="text-price">{{giftConfig.giftAmount}}</text><text
					style="font-size: 24upx;">×{{giftConfig.giftNumAll}}</text>
			</view>
		</view>
		<view class="instructions">
			<view class="time">
				<text class="label-item">服务地区：</text>
				<picker :disabled="userLevel" style="width: 75%;text-align: right;" mode="multiSelector" :range="cityArray"
					:value="multiIndex" @columnchange="changeCity" @change="chooseCity" v-if="isloading == 0">
					<template v-if="selCity == 1">
						<view class="">
							{{cityList[multiIndex[0]].name}}-{{areaList[multiIndex[1]].name}}-{{campusList[multiIndex[2]].name}}
						</view>
					</template>
					<template v-if="selCity == 0">
						<view v-if="locationCityArr.length <= 0" style="color: #c0c0c0;">请选择地区<text
								style="color: #c0c0c0;" class="cuIcon-right"></text>
						</view>
						<view class="" v-else>
							{{locationCityArr[0].name}}-{{locationCityArr[1].name}}-{{locationCityArr[2].name}}
						</view>
					</template>
				</picker>
			</view>
			<view class="time">
				<text>购买时长</text>
				<!-- <view>{{Math.round(giftConfig.giftValidity / 30)}}个月</view> -->
				<view>{{giftConfig.giftValidity}}天</view>
			</view>
			<view class="amount">
				<text>应付金额</text>
				<view class="text-price">{{giftConfig.payAmount}}</view>
			</view>
		</view>
		<view class="payway">
			<view class="way">
				选择支付方式
			</view>
			<view class="pic">
				<image class="image" src="../../../static/img/wxicon.png" mode=""></image>
				<text>微信</text>
				<view class="rotating">
				</view>
				<image class="ofcourse" src="../../../static/img/ofcourse.png" mode=""></image>
			</view>
			<view class="btnpay" @click="buyNow">
				立即支付
			</view>
		</view>
	</view>
</template>
<script>
	import bmap from '@/common/SDK/bmap-wx.js';
	export default {
		data() {
			return {
				isloading: 1,
				phone: '',
				giftConfig: {},
				userLevel: false,
				//城市筛选
				cityArray: [
					[],
					[],
					[]
				],
				multiIndex: [0, 0, 0], //筛选的省市区各下标（用于获取value）
				cityList: [],
				cityList1: [],
				areaList: [],
				areaList1: [],
				campusList: [],
				campusList1: [],
				selCity: 0,
				page: '',
				locatingCity: '',
				locationCityArr: [],
				mark: ''
			}
		},
		onLoad(e) {
			this.page = e.page
			this.$queue.showLoading("加载中...");
			this.getGiftConfig()
			this.getTopUser()
			// this.getProvinces()
			
		},
		onShow() {
			if (this.hasLogin) {
				this.phone = this.$queue.getData("phone").replace(this.$queue.getData("phone").substring(3, 7), "****")
				return
			}
			uni.redirectTo({
				url: "/pages/login/login?page=topup"
			})
		},
		methods: {
			//获取定位
			getcheckstoreArea() {
				this.$http.getcheckstoreArea({
					code: this.locatingCity
				}).then(res => {
					if (res.code == 200) {
						this.locationCityArr = _.values(res.data)
						this.selCity = 1
						this.getProvinces()
					}
				})
			},
			// 判断用户级别
			getTopUser() {
				this.$http.getTopUser().then(res => {
					if (res.code == 200) {
						const that = this
						// this.userLevel = res.data.userLevel
						if(res.data.agentArea) {
							this.mark = res.data.agentArea
							this.userLevel = true
							let Arr = res.data.agentArea.split(",")
							let arrObj = []
							Arr.map(item => {
								let obj = {}
								obj.id = item
								arrObj.push(obj)
							})
							this.locationCityArr = arrObj
							this.selCity = 1
							this.getProvinces()
						} else {
							this.userLevel = false
							// // 定位
							const Bmap = new bmap.BMapWX({
								ak: 'leuSffRhfn9ysUifXtnNAqzkYOsBG5by'
							});
							uni.getLocation({
								type: 'gcj02',
								success: r => {
									Bmap.regeocoding({
										location: r.latitude + ',' + r.longitude,
										success: data => {
											this.locatingCity = data.originalData.result.addressComponent.town_code
											this.getcheckstoreArea()
										}
									});
								},
								fail() {
									that.getProvinces()
								}
							});
						}
					}
				})
			},
			// 获取礼包金额配置
			getGiftConfig() {
				this.$http.getGiftConfig().then(res => {
					uni.hideLoading()
					if (res.code == 200) {
						this.giftConfig = res.data.list[0]
					}
				})
			},
			// 获取市
			getcity(workId) {
				this.$http.getstoreAreaList({
					workId
				}).then(res => {
					this.areaList = res.data
					this.areaList1 = this.areaList.map(e => e.name);
					this.cityArray = [this.cityList1, this.areaList1,
						[]
					]
					if (this.locationCityArr.length) {
						this.locationCityArr.map((v, i) => {
							this.areaList.map((item, index) => {
								if (item.id == v.id) {
									this.multiIndex[1] = index
									this.getarea(item.id)
								}
							})
						})
					} else {
						this.getarea(this.areaList[0].id)
					}
				})
			},
			// 获取区
			getarea(workId) {
				this.$http.getstoreAreaList({
					workId
				}).then(res => {
					this.isloading = 0
					this.campusList = res.data
					this.campusList1 = this.campusList.map(e => e.name);
					this.cityArray = [this.cityList1, this.areaList1,
						this.campusList1
					]
					if (this.locationCityArr.length) {
						this.locationCityArr.map((v, i) => {
							this.campusList.map((item, index) => {
								if (item.id == v.id) {
									this.multiIndex[2] = index
								}
							})
						})
					}
				})
			},
			// 省市区获取
			getProvinces(workId, level) {
				this.$http.getstoreAreaList({
					workId
				}).then(res => {
					if (res.code == 200) {
						if (level == 0) {
							this.areaList = res.data
							this.areaList1 = this.areaList.map(e => e.name);
							this.cityArray = [this.cityList1, this.areaList1,
								[]
							]
							this.getarea(this.areaList[0].id)
						} else if (level == 1) {
							this.campusList = res.data
							this.campusList1 = this.campusList.map(e => e.name);
							this.cityArray = [this.cityList1, this.areaList1,
								this.campusList1
							]
						} else {
							this.cityList = res.data
							this.cityList1 = this.cityList.map(e => e.name);
							this.cityArray = [this.cityList1, [],
								[]
							]
							if (this.locationCityArr.length) {
								this.locationCityArr.map((v, i) => {
									this.cityList.map((item, index) => {
										if (item.id == v.id) {
											this.multiIndex[0] = index
											this.getcity(item.id)
										}
									})
								})
							} else {
								this.getcity(this.cityList[0].id)
							}
						}

					}
				})
			},
			// 城市三级联动
			changeCity(e) {
				this.selCity = 0
				switch (e.detail.column) {
					case 0:
						this.cityList.map((item, index) => {
							if (index == e.detail.value) {
								this.getProvinces(item.id, e.detail.column)
							}
						})
						this.multiIndex = [e.detail.value, 0, 0]
						break;
					case 1:
						this.areaList.map((item, index) => {
							if (index == e.detail.value) {
								this.getProvinces(item.id, e.detail.column)
							}
						})
						var i = this.multiIndex[0];
						this.multiIndex = [i, e.detail.value, 0]
						break;
					case 2:
						var i = this.multiIndex[0];
						var j = this.multiIndex[1];
						this.multiIndex = [i, j, e.detail.value];
				}
			},
			chooseCity(e) {
				this.selCity = 1
			},
			// 购买礼包
			buyNow() {
				
				let str = ''
				if (this.selCity == 0) {
					uni.showModal({
						showCancel: false,
						title: "提示",
						content: "请选择所在地区",
						confirmText: "关闭",
						confirmColor: "#FF5A5A"
					})
					return
				} else if (this.selCity == 1) {
					str = this.cityList[this.multiIndex[0]].id + ',' + this.areaList[this.multiIndex[1]].id + ',' + this
						.campusList[this.multiIndex[2]].id
				}
				uni.showLoading({
					mask: true,
					title: "加载中..."
				})
				let obj = {
					mark: this.mark != '' ? this.mark : str,
					payType: 2,
					amount: this.giftConfig.giftAmount,
					bsType: 'BS_A007'
				}
				this.$http.getdepositOrder(obj).then(resPay => {
					if (!resPay.success) {
						uni.hideLoading();
						return this.$queue.showToast(resPay.message);
					}
					let dataObj = {
						openId: this.$queue.getData("openId"),
						orderNo: resPay.data,
						payType: '2',
						bsType: 'BS_A007'
					}
					this.$http.createPayOrder(dataObj).then(resPay => {
						if (!resPay.success) {
							uni.hideLoading();
							return this.$queue.showToast(resPay.message);
						}
						this.$queue.showLoading("支付中...");
						uni.requestPayment({
							provider: 'wxpay',
							appId: resPay.data.appid,
							nonceStr: resPay.data.nonceStr,
							package: resPay.data.package,
							paySign: resPay.data.paySign,
							signType: resPay.data.signType,
							timeStamp: resPay.data.timeStamp,
							success: result => {
								uni.hideLoading();
								uni.showToast({
									title: '支付成功'
								});
								if (this.page == 'detail') {
									setTimeout(() => {
										uni.navigateBack({
											delta: 1,
										})
									}, 700);
								} else {
									setTimeout(() => {
										uni.redirectTo({
											url: '../../activity/activity/activity?name=' +
												'福袋' + '&code=' +
												this.$stringUtils.giftbagCode()
										});
									}, 700);
								}
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
			}
		},
	}
</script>
<style lang="scss">
	page {
		background-color: #fff;
	}

	.information {
		height: 136upx;
		display: flex;
		align-items: center;
		border-top: 2upx solid #f7f7f7;

		.avatar {
			width: 80upx;
			height: 80upx;
			border-radius: 50%;
			overflow: hidden;
			margin: 28upx;
		}

		.phone {
			font-size: 30upx;
			font-weight: 300;
			color: #666666;
		}
	}

	.giftbag {
		height: 96upx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin: 0 28upx;
		border-top: 2upx solid #f7f7f7;

		.bagnum {
			font-size: 28upx;
			font-weight: 300;
			color: #666666;
		}

		.num {
			width: 156upx;
			height: 76upx;
			text-align: center;
			line-height: 76upx;
			color: #8A6824;
			background-image: url(../../../static/img/365bgc.png);
			background-size: cover;
			background-repeat: inherit;
			font-size: 32upx;
		}
	}

	.instructions {
		background-color: #f7f7f7;
		box-sizing: border-box;
		padding: 24upx 0;

		.time {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 0 28upx;
			height: 96upx;
			background-color: #fff;
			color: #666666;
			font-size: 28upx;

			text {
				width: 24%;
				font-weight: 300;
			}
		}

		.amount {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 0 28upx;
			height: 100upx;
			background-color: #fff;
			font-weight: bold;
			font-size: 32upx;

			text {
				color: #666666;
			}
		}
	}

	.payway {
		.way {
			margin: 28upx;
			font-size: 28upx;
			font-weight: 300;
			color: #666666;
		}

		.pic {
			width: 264upx;
			height: 128upx;
			line-height: 128upx;
			border: 2upx solid #EB6132;
			border-radius: 16upx;
			margin: 0 0 92upx 52upx;
			position: relative;
			overflow: hidden;

			.image {
				vertical-align: middle;
				margin: 0upx 20upx 0upx 48upx;
				width: 64upx;
				height: 52upx;
			}

			text {
				font-size: 28upx;
				font-weight: 300;
				color: #666666;
			}

			.rotating {
				width: 56upx;
				height: 66upx;
				position: absolute;
				bottom: -32upx;
				right: -26upx;
				background: #ee6a2f;
				border: 2upx solid #EB6132;
				transform: rotate(45deg);

			}

			.ofcourse {
				position: absolute;
				bottom: 4upx;
				right: 4upx;
				z-index: 777;
				width: 28upx;
				height: 20upx;
			}
		}

		.btnpay {
			width: 524upx;
			height: 76upx;
			background: linear-gradient(180deg, #F1722C 0%, #EB6133 100%);
			border-radius: 40upx;
			margin: 0 auto;
			text-align: center;
			line-height: 76upx;
			font-size: 28upx;
			font-weight: 300;
			color: #FFFFFF;
		}
	}
</style>
