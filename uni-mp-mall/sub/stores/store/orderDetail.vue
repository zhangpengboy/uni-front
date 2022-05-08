<template>
	<view>
		<!-- 收货地址 -->
		<view class="main-wrap margin-top">
			<view class="pickway">
				<view class="distribution" :class="{wayStyle: wayIndex == 0}" @click="storeWay">
					店家配送
				</view>
				<view class="sincelift" :class="{wayStyle: wayIndex == 1}" @click="userWay">
					到店自取
				</view>
			</view>
			<view class="main-wrap-box addr">
				<view class="right" v-if="wayIndex == 0" @click="toSelectAddress">
					<view class="right" v-if="!_.isEmpty(recinfo)">
						<view class="">
							<view class="tel-name">
								<view class="name">{{ recinfo.userName }}</view>
								<view class="tel">{{ recinfo.phone }}</view>
							</view>
							<view class="default-addres">
								<view class="default" v-if="recinfo.status == 1">
									默认
								</view>
								<view class="addres">
									{{ recinfo.address }}
								</view>
							</view>
						</view>
						<view class="cuIcon-right" style="color: #C1C1C1;">
						</view>
					</view>
					<view class="right flex justify-between align-center" style="width: 100%;" v-else>
						<view class="name">请添加收货地址</view>
						<view class="cuIcon-right"></view>
					</view>
				</view>
				<view class="right" v-if="wayIndex == 1" @click="textPaste">
					<view class="">
						<view class="default-addres">
							<view class="addres">
								{{ storeAddress }}
							</view>
						</view>
					</view>
					<view style="color: #C1C1C1;">
					</view>
				</view>
			</view>
			<view class="wayrow" v-if="wayIndex == 0">
				<view class="nominal">立即送出</view>
				<view class="waycintent">
					<text>大约{{ nowTime }}送达</text>
					<view class="cuIcon-right"></view>
				</view>
			</view>
			<!-- <view class="wayrow" v-if="wayIndex == 1">
				<view class="nominal">自取时间</view>
				<view class="waycintent" @click="showService">
					<text>{{timeList[timeIndex]}}</text>
					<view class="cuIcon-right"></view>
				</view>
			</view> -->
			<view class="wayrow" v-if="wayIndex == 1">
				<view class="nominal">预留电话</view>
				<view class="waycintent">
					<input type="text" v-model="phone" />
					<view class="">
						<image style="width: 28rpx;height: 28rpx;" src="../static/img/edit.png" mode=""></image>
					</view>
				</view>
			</view>
			<view class="wayrow">
				<view class="nominal">支付方式</view>
				<view class="waycintent">
					<text>微信支付</text>
					<view class="cuIcon-right"></view>
				</view>
			</view>
		</view>
		<template>
			<!-- 商品信息 -->
			<view class="main-wrap">
				<view class="main-wrap-box buy-list">
					<view class="row">
						<view class="goods-store">
							<image src="../../../static/img/logo.png" mode=""></image>
							<view class="">
								{{buyGoods[0].storeName}}
							</view>
						</view>
						<view class="goods-info" style="margin: 30rpx 0;" v-for="item in buyGoods" :key="item.id">
							<view class="img">
								<image :src="item.goodsIcon"></image>
							</view>
							<view class="info">
								<view class="infoTitle">
									<view class="title">{{ item.goodsName}}</view>
									<view class="price text-price">
										<text>{{ (item.salePrice * item.stockQtysss).toFixed(2) }}</text>
										<!-- <template v-if="item.integral > 0">
											<text
												class="text-xs">{{ item.integralType | filterIntegralType }}</text>
											<text>{{ item.integral }}</text>
											<text class="text-xs">{{ $queue.getIntegralName() }}</text>
										</template> -->
									</view>
								</view>
								<view class="price-number">
									<view class="number"></view>
								</view>
								<view class="spec">× {{ item.stockQtysss }}</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<!-- 明细 -->
			<view class="main-wrap">
				<view class="main-wrap-box detail">
					<view class="row">
						<view class="nominal">备注 :</view>
						<view style="text-align: right;" class="content">
							<input placeholder="给卖家留言" v-model="note" />
						</view>
					</view>
					<view class="row">
						<view class="nominal">商品总额</view>
						<view style="color: #333;font-size: 28upx;" class="content text-price">
							<text>{{ sumObj.amount }}</text>
						</view>
					</view>
					<view class="row">
						<view class="nominal">
							{{ sumObj.integral < 0 ? '抵扣' : '赠送' }}{{ $queue.getIntegralName() }}
						</view>
						<view class="content"> <text class="text-xs"
								v-if="!sumObj.integral < 0">-</text>{{sumObj.integral }}
						</view>
					</view>
					<!-- <view class="row">
						<view class="nominal">运费</view>
						<view class="content text-price" v-if="buyGoods.postage != 0">
							{{ buyGoods.base.postage }}
						</view>
						<view class="content" v-else>
							包邮
						</view>
					</view> -->
					<view class="row">
						<view class="nominal"></view>
						<view class="content">
							<text class="text-sm margin-right-xs">合计：</text>
							<text class="money text-price text-main">
								<text>{{ sumObj.amount }}</text>
								<template v-if="sumObj.integral > 0">
									<text class="text-xs">{{ sumObj.integral > 0 ? 1 : 0 | filterIntegralType }}</text>
									<text>{{ sumObj.integral }}</text>
									<text class="text-xs">{{ $queue.getIntegralName() }}</text>
								</template>
							</text>
						</view>
					</view>
				</view>
			</view>
			<!-- 占位符 -->
			<view class="blck"></view>
			<!-- 底部按钮 -->
			<view class="footer">
				<view class="settlement">
					<view class="sum">
						<view class="money text-price text-main">
							<text>{{ sumObj.amount }}</text>
							<template v-if="sumObj.integral > 0">
								<text class="text-xs">{{ sumObj.integral > 0 ? 1 : 0 | filterIntegralType }}</text>
								<text>{{ sumObj.integral }}</text>
								<text class="text-xs">{{ $queue.getIntegralName() }}</text>
							</template>
							<text v-if="selectprice" class="text-sm" style="margin-left: 8rpx;color: #333;">已优惠<text
									class="text-price text-main">{{selectprice}}</text></text>
						</view>
					</view>
					<view class="btn" @tap="submitOrder">提交订单</view>
				</view>
			</view>
		</template>
		<!-- -时间选择 -->
		<view class="cu-modal bottom-modal" :class="serviceClass">
			<view class="cu-dialog goods-service">
				<view class="cu-bar bg-white justify-end">
					<view class="action text-xl text-bold text-gray margin-right" @tap="hideService"><text
							class="cuIcon-close"></text></view>
				</view>
				<view class="time">
					<view class="left">
						<view class="day">
							今天(周四)
						</view>
					</view>
					<view class="right" v-for="(item,index) in timeList" :key='index' @click="changeTime(item,index)">
						<view class="period" :class="{select: index == timeIndex}">
							{{item}}
						</view>
						<view class="img" v-if="index == timeIndex">
							<image src="../static/img/icon_select.png" mode=""></image>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		parseTime
	} from '@/common/utils/DateUtils.js'
	export default {
		data() {
			return {
				phone: '',
				wayIndex: 0,
				timeIndex: 0,
				nowTime: '',
				timeList: [],
				buylist: [], //订单列表
				freight: 5.0, //运费
				note: '', //备注
				int: 0, //抵扣积分=
				recinfo: {}, // 地址
				memberReceiveAddressList: [], // 收货地址
				isFromCart: false, // 是否来着购物车
				buyGoods: {}, // 购买商品信息
				sumObj: {
					amount: 0,
					integral: 0
				},
				storeAddress: '',
				actCode: '',
				inviteCode: '',
				giftCodes: [],
				selectprice: 0,
				receivingWay: 0,
				serviceClass: 'none'
			};
		},
		filters: {
			parseTime
		},
		onLoad(e) {
			this.phone = this.$queue.getData('phone')
		},
		onShow() {
			// 获取用户收货地址
			// if (!this.isFromCart) {
			this.buyGoods = this.$queue.getJson("buy_storeGoods");
			// } else {
			// 	this.buylist = this.$queue.getJson("buy_storeGoods");
			// }
			this.getAddress();
			this.getDate()
			this.sumAmount()
			this.getstoreinfoDetail()
		},
		onBackPress() {
			//页面后退时候，清除订单信息
			this.clearOrder();
		},
		computed: {
			//单个商品总价计算
			sumSkuAmount: function() {
				if (Object.keys(this.buyGoods).length == 0) return
				return ((this.buyGoods.salePrice * this.buyGoods.stockQtysss)).toFixed(2)
			},
		},
		filters: {
			// 转换2位小时
			toFixed: function(x) {
				return parseFloat(x).toFixed(2);
			}
		},
		methods: {
			parseTime,
			// 切换取货方式
			// 获取店铺详细地址
			getstoreinfoDetail() {
				this.$http.storeinfoDetail({
					storeId: this.buyGoods[0].storeId
				}).then(res => {
					this.storeAddress = res.data.area1Name + ' ' + res.data.area2Name + ' ' + res.data.area3Name +
						' ' + res.data.storeAddress
				})
			},
			textPaste() {
				let that = this
				uni.setClipboardData({
					data: that.storeAddress,
					success: function(res) {
						uni.getClipboardData({
							success: function(res) {
								that.$queue.showToast('复制成功');
							}
						})
					}
				})
			},
			storeWay() {
				this.wayIndex = 0
			},
			userWay() {
				this.wayIndex = 1
			},
			// 总价格， 总积分
			sumAmount() {
				this.buyGoods.map(item => {
					if (item.integralType == 0) {
						this.sumObj.integral -= item.integral * item.stockQtysss
					} else {
						this.sumObj.integral += item.integral * item.stockQtysss
					}
					this.sumObj.amount += item.salePrice * item.stockQtysss
					this.sumObj.amount.toFixed(2)
				})
			},
			// 获取对应时间
			getDate() {
				// let time = this.getNeedDate(60) // 当前时间
				let arr = [60, , 90, 120, 150, 180, 210, 240, 270]
				let arrDate = []
				arr.forEach(item => {
					let strDate = this.getNeedDate(item)
					arrDate.push(strDate)
				})
				this.timeList = arrDate
				// let nowTime = this.parseTime(time).split(' ')[1].split(':')[0]
				// this.nowTime =nowTime+ ":"+ this.parseTime(time).split(' ')[1].split(':')[1]
				this.nowTime = this.getNeedDate(60)
			},
			// 获取时间
			getNeedDate(e) {
				let date = new Date()
				let timestamp = date.getTime() + 1 * 60 * e * 1000
				let nowTime = this.parseTime(timestamp).split(' ')[1].split(':')[0]
				return nowTime + ":" + this.parseTime(timestamp).split(' ')[1].split(':')[1]
			},
			// 选择时间
			changeTime(v, i) {
				this.timeIndex = i
				this.serviceClass = 'hide';
			},
			/* 打开服务弹窗 */
			showService() {
				// this.serviceClass = 'show';
				if (this.serviceClass == 'hide' || this.serviceClass == 'none') {
					this.serviceClass = 'show';
				} else {
					this.serviceClass = 'hide';
				}
			},
			/* 关闭服务弹窗 */
			hideService() {
				this.serviceClass = 'hide';
				setTimeout(() => {
					this.serviceClass = 'none';
				}, 200);
			},
			changeTwoDecimal(param) {
				var value = parseFloat(param);
				var value = Math.round(param * 100) / 100;
				return value;
			},
			/* 获取收货地址 */
			async getAddress() {
				const res = await this.$http.getAddressList();
				if (res.success) {
					this.memberReceiveAddressList = res.data;
					this.getSelectAddress();
				}
			},
			/* 清除订单 */
			clearOrder() {
				this.$queue.remove("buy_storeGoods")
			},
			radioChange(e) {
				console.log(e)
				this.receivingWay = e.detail.value
			},
			/* 提交订单 */
			async submitOrder() {
				const that = this;
				uni.showLoading({
					title: '加载中...'
				});
				// 提交订单数组
				const orderList = [];
				if (this.wayIndex == 0) {
					if (_.isEmpty(that.recinfo)) {
						return that.$queue.showToast("请填写收货地址");
					}
				}
				// 组装数据
				_.map(that.buyGoods, v => {
					let omsStreetOrder = {
						// actCode: that.actCode,
						storeId: v.storeId,
						storeName: v.storeName,
						bsType: "BS_A014",
						integral: v.integral,
						integralType: v.integralType,
						address: that.wayIndex == 0 ? that.recinfo.address : '',
						note: that.note,
						receivingWay: that.wayIndex,
						userPhone: that.$queue.getData('phone'),
					}
					let omsStreetOrderDetail = {
						goodsId: v.id,
						goodsImg: v.goodsIcon,
						goodsName: v.goodsName,
						goodsType: 0,
						integralType: v.integralType,
						integral: v.integral,
						goodsNum: v.stockQtysss,
						marketPrice: v.marketPrice,
						salePrice: v.salePrice,
						settlePrice: v.settlePrice,
						// remark: that.note,
					}
					// const omsOrderAddress = {
					// 	phone: that.recinfo.phone,
					// 	userName: that.recinfo.userName,
					// 	address: that.recinfo.address
					// };
					orderList.push({
						omsStreetOrder,
						omsStreetOrderDetail,
						// omsOrderAddress
					})
				})
				that.$queue.showLoading("生成订单中...");
				let result = await that.$http.streetOrderAdd(orderList)
				uni.hideLoading();
				if (result.code != 200) {
					return that.$queue.showToast(result.message)
				}
				if (result.data != null) {
					// 获取订单详情
					this.$http.getStreetOrderByOrderNo({
						parentNo: result.data[0].omsStreetOrder.orderParent
					}).then(orderRes => {
						// console.log('orderRes',orderRes)
						if (that.isFromCart) {
							// 得到下单失败商品
							let failList = [];
							_.map(that.buylist, (v, i) => {
								if (_.find(result.data, res => v.skuId == res.omsOrderDetail
										.goodsSkuId) ==
									undefined) {
									failList.push(v)
									that.$set(that.buylist[i], 'fail', true)
								}
							})
							// 提示下单失败的商品信息
							if (_.size(failList) > 0) {
								uni.showModal({
									title: "提示",
									content: `部分商品下单失败，商品可能失败原因：1、库存不足；2、商品已下架。是否支付成功下单的商品？`,
									success(rest) {
										if (rest.confirm) {
											console.log('1orderRes',orderRes)
											that.toPayment(orderRes.data)
										} else {
											that.$queue.showToast("页面将在3秒后自动返回购物车")
											setTimeout(() => {
												uni.navigateBack({
													delta: 1
												})
												that.clearOrder();
											}, 3000)
										}
									}
								})
							} else {
								console.log('2orderRes',orderRes)
								that.toPayment(orderRes.data)
							}
						} else {
							if (!result.data.length) return that.$queue.showToast('库存不足');
							// 无效订单
							if (result.data[0].omsStreetOrder.status != 5) {
								console.log('3orderRes',orderRes)
								that.toPayment(orderRes.data)
								return
							}
							that.$queue.showToast(result.data[0].omsStreetOrder.note);
						}
					})
				}
				// }

			},
			/* 选择地址 */
			getSelectAddress() {
				this.recinfo = this.$queue.getJson("select_address");
				if (this.recinfo) {
					return this.$queue.remove("select_address")
				}
				_.map(this.memberReceiveAddressList, address => {
					if (!!address.status) {
						address.head = address.userName.substring(0, 1);
						this.recinfo = address;
					}
				});
			},
			/* 选择收货地址 */
			toSelectAddress() {
				uni.navigateTo({
					url: '/sub/users/address/address?type=select'
				});
			},
			/* 跳转支付页面 */
			toPayment(result) {
				setTimeout(() => {
					this.$queue.setJson("pay_order", result);
					if (this.actCode == this.$stringUtils.giftbagCode()) {
						uni.redirectTo({
							url: '/sub/pays/payment/payment?actCode=' + this.actCode
						});
					} else {
						uni.redirectTo({
							url: '/sub/pays/payment/payment'
						});
					}
					this.clearOrder();
				}, 500);
			},
		}
	};
</script>

<style lang="scss">
	.pickway {
		display: flex;

		.distribution {
			width: 350upx;
			height: 96upx;
			font-size: 28upx;
			line-height: 96upx;
			text-align: center;
			background: #fff;
			color: #666666;
			border-radius: 16upx 0px 16upx 0px;
		}

		.sincelift {
			width: 350upx;
			height: 96upx;
			font-size: 28upx;
			line-height: 96upx;
			text-align: center;
			background: #fff;
			color: #666666;
			border-radius: 16upx 0px 16upx 0px;
		}

		.wayStyle {
			background: #FFEEE8;
			font-size: 32upx;
			font-weight: 500;
			color: #EB6133;
		}
	}

	.wayrow {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin: 32upx 24upx;

		.nominal {
			font-size: 26upx;
			font-weight: 500;
			color: #333333;
		}

		.waycintent {
			display: flex;
			align-items: center;
			font-size: 26upx;
			font-weight: 500;
			color: #EB6133;

			text {
				margin-right: 24upx;
			}

			input {
				margin-right: 24upx;
				text-align: right;
			}

			view {
				color: #c1c1c1;
			}
		}
	}

	.time {
		.left {
			float: left;
			background-color: #fff;
			width: 200upx;
			height: 92upx;
			line-height: 92upx;

			.day {}
		}

		.right {
			float: right;
			width: 550upx;
			height: 92upx;
			text-align: left;
			background-color: #fff;
			// line-height: 92upx;
			border-bottom: 2upx solid #F7F7F7;
			display: flex;
			justify-content: space-between;
			align-items: center;

			.period {
				// margin-left: 32upx;
				margin: 0 32upx;
				font-size: 26upx;
				font-weight: 500;
				color: #333333;
			}

			.select {
				color: #EB6133;
			}

			.img {
				margin: 0 32upx;

				image {
					width: 32upx;
					height: 32upx;
				}
			}
		}
	}

	.addr {
		display: flex;

		.icon {
			width: 80upx;
			height: 80upx;
			display: flex;
			align-items: center;

			image {
				width: 60upx;
				height: 60upx;
			}
		}

		.right {
			width: 100%;
			display: flex;
			justify-content: space-between;
			align-items: center;

			.tel-name {
				width: 100%;
				display: flex;
				align-items: center;
				font-size: 28upx;
				padding-bottom: 12upx;
				color: #999999;

				.tel {
					margin-left: 40upx;
				}
			}

			.default-addres {
				display: flex;

				.default {
					display: flex;
					justify-content: center;
					align-items: center;
					width: 56upx;
					height: 36upx;
					background: #EB6133;
					border-radius: 4upx;
					font-size: 20upx;
					font-weight: 300;
					color: #FFFFFF;
					margin-right: 20upx;
				}

				.addres {
					width: 100%;
					font-size: 32upx;
					font-weight: 500;
					color: #333333;
					opacity: 1;
				}
			}
		}


	}

	.buy-list {
		.row {
			.goods-store {
				display: flex;
				text-align: center;
				margin-bottom: 32upx;

				image {
					width: 42upx;
					height: 42upx;
					border-radius: 50%;
					margin-right: 16upx;
				}

				view {
					font-size: 28upx;
					font-weight: 300;
					color: #333333;
				}
			}

			.goods-info {
				width: 100%;
				display: flex;

				.img {
					width: 22vw;
					height: 22vw;
					border-radius: 10upx;
					overflow: hidden;
					flex-shrink: 0;
					margin-right: 10upx;

					image {
						width: 22vw;
						height: 22vw;
					}
				}

				.info {
					width: 100%;
					// height: 22vw;
					overflow: hidden;
					display: flex;
					flex-wrap: wrap;
					position: relative;
					margin-left: 28upx;

					.title {
						width: 70%;
						font-size: 28upx;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 2;
						// text-align: justify;
						white-space: nowrap;
						text-overflow: ellipsis;
						overflow: hidden;
						word-break: break-all;
					}

					.spec {
						font-size: 22upx;
						// background-color: #f3f3f3;
						color: #a7a7a7;
						display: flex;
						align-items: center;
						padding: 0 10upx;
						margin-top: 12upx;
						border-radius: 8upx;
						// margin-bottom: 20vw;
					}

					.infoTitle {
						width: 100%;
						display: flex;

						.price {
							width: 30%;
							text-align: right;
							color: $uni-color-main;
						}
					}

					.price-number {
						// position: absolute;
						width: 100%;
						// bottom: 0upx;
						display: flex;
						justify-content: space-between;
						align-items: flex-end;
						font-size: 28upx;
						height: 40upx;

						.price {
							color: $uni-color-main;
						}

						.number {
							display: flex;
							justify-content: center;
							align-items: center;
						}
					}
				}
			}

			.note {
				.row {
					display: flex;
					margin-top: 56upx;

					.left {
						width: 14%;
					}

					.right {
						width: 80%;
					}

					input {
						width: 100%;
					}
				}
			}
		}
	}

	.order {
		.row {
			height: 40upx;
			margin-bottom: 20upx;

			&:last-child {
				margin-bottom: 0;
			}

			display: flex;
			align-items: center;

			.left {
				font-size: 28upx;
			}

			.right {
				margin-left: 40upx;
				font-size: 26upx;
				color: #999;

				input {
					font-size: 26upx;
					color: #999;
				}
			}
		}
	}

	.detail {
		.row {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding-top: 28upx;
			padding-bottom: 28upx;

			&:first-child {
				padding-top: 6upx;
			}

			&:last-child {
				padding-bottom: 0;
				border-bottom: none;
			}

			.nominal {
				font-size: 28upx;
				font-weight: 300;
				color: #333333;
			}

			.content {
				font-size: 28upx;
				color: #333;
				// color: $uni-color-main;

				.radio-group {
					display: flex;
					align-items: center;

					.radio-group-label {
						display: flex;
						align-items: center;

						//
						radio .wx-radio-input {
							width: 36rpx;
							height: 36rpx;
						}

						radio::before {
							font-family: "cuIcon";
							content: "";
							position: absolute;
							color: #ffffff !important;
							top: 50%;
							margin-top: -16rpx;
							right: 4rpx;
							font-size: 32upx;
							line-height: 32upx;
							pointer-events: none;
							transform: scale(1, 1);
							transition: all 0.3s ease-in-out 0s;
							z-index: 9;
						}

						radio .wx-radio-input.wx-radio-input-checked {
							// background-image: url(../static/img/checkyes.png);
							background-size: cover;
							background-repeat: inherit;
						}

						.weui-cell__bd {
							font-size: 28upx;
							font-weight: 300;
							color: #333333;
							margin-right: 0rpx
						}

						view {
							margin-right: 20upx;
						}
					}
				}

			}
		}
	}

	.blck {
		width: 100%;
		height: 100upx;
	}

	.footer {
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
			justify-content: space-between;
			align-items: center;

			.sum {
				font-size: 36upx;
				margin-right: 10upx;
				display: flex;
				justify-content: flex-end;
				align-items: center;
				margin-right: 30upx;

				.money {
					font-weight: 600;
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
