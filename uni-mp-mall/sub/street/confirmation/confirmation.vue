<template>
	<view>
		<!-- 提货信息 -->
		<view class="main-wrap margin-top">
			<view class="main-wrap-box addr">
				<view class="right hr" @click.stop="updateUserInfo()">
					<view class="">
						<view class="tel-name">
							<view class="name">提货人：{{ userInfo.name || '' }}</view>
							<view class="tel">{{ userInfo.phone }}</view>
						</view>
					</view>
					<view class="cuIcon-right" style="color: #999;">
					</view>
				</view>
				<view class="right" @click.stop="goStore()">
					<view class="">
						<view class="tel-name">
							<view class="name">自提点：{{ buyGoods.storeName }}</view>
						</view>
						<view class="default-addres">
							<view class="addres">
								{{ buyGoods.address }}
							</view>
						</view>
					</view>
					<view class="cuIcon-right" style="color: #999;">
					</view>
				</view>
			</view>
		</view>
		<!-- 商品信息 -->
		<view class="main-wrap" v-if="buyGoods">
			<view class="main-wrap-box buy-list">
				<view class="row">
					<view class="goods-store">
						<image src="../../../static/img/logo.png" mode=""></image>
						<view class="">
							{{buyGoods.storeName}}
						</view>
					</view>
					<view class="goods-info">
						<view class="img">
							<image :src="buyGoods.goodsIcon"></image>
						</view>
						<view class="info">
							<view class="title">{{ buyGoods.goodsName}}</view>
							<!-- <view class="spec">选择: {{buyGoods.skuName }} 数量:{{ buyGoods.number }}</view> -->
							<view class="price-number">
								<view class="price text-price">
									<text>{{ buyGoods.salePrice }}</text>
									<template v-if="buyGoods.integral > 0">
										<text class="text-xs">{{ buyGoods.integralType | filterIntegralType }}</text>
										<text>{{ buyGoods.integral }}</text>
										<text class="text-xs">{{ $queue.getIntegralName() }}</text>
									</template>
								</view>
							</view>
						</view>
					</view>
					<view class="length">
						<view class="text">数量：<text
								style="color: #999;font-size: 26rpx;">(限购{{buyGoods.stockQty}}件)</text>
						</view>
						<view class="number">
							<view class="sub" @tap.stop="handleSubNumber">
								<text class="cuIcon-move"></text>
							</view>
							<view class="input"><input type="number" v-model="buyGoods.number" /></view>
							<view class="add" @tap.stop="handleAddNumber">
								<text class="cuIcon-add"></text>
							</view>
						</view>
					</view>
					<view class="note">
						<view class="row">
							<view class="left">备注 :</view>
							<view class="right"><input placeholder="给卖家留言" v-model="note" /></view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 明细 -->
		<view class="main-wrap" v-if="buyGoods">
			<view class="main-wrap-box detail">
				<view class="row">
					<view class="nominal">商品总额</view>
					<view style="color: #333;font-size: 28upx;" class="content text-price">
						<text>{{ buyGoods.vipPrice * buyGoods.number }}</text>
					</view>
				</view>
				<view class="row" v-if="buyGoods.integral > 0">
					<view class="nominal">
						{{ buyGoods.integralType == 0 ? '抵扣' : '赠送' }}{{ $queue.getIntegralName() }}
					</view>
					<view class="content"> <text class="text-xs"
							v-if="!buyGoods.integralType">-</text>{{buyGoods.integral * buyGoods.number }}
					</view>
				</view>
				<view class="row" v-if="vipStatus == 1">
						<view class="nominal">会员优惠</view>
						<view class="content" style="color: #EB6133;" v-if="!selectprice">
							已优惠{{preferential}}<text class="cuIcon-right"
								style="color: #999;margin-left: 12rpx;"></text>
						</view>
					</view>
				<!-- <view class="row" v-if="$queue.getData('bsType') == 'BS_A010' && 0">
					<view class="nominal">提货方式</view>
					<view class="content" style="color: #EB6133;">
						<radio-group @change="radioChange" class="radio-group">
							<label class="weui-cell weui-check__label radio-group-label" style="margin-right: 48upx;">
								<view class="weui-cell__hd">
									<radio class="yellow" value="0" checked="true" />
								</view>
								<view class="weui-cell__bd">邮寄</view>
							</label>
							<label class="weui-cell weui-check__label radio-group-label">
								<view class="weui-cell__hd">
									<radio class="yellow" value="1" />
								</view>
								<view class="weui-cell__bd">自提</view>
							</label>
						</radio-group>
					</view>
				</view> -->
				<view class="row">
					<view class="nominal">运费</view>
					<view class="content text-price" v-if="buyGoods.postage != 0">
						{{ buyGoods.postage }}
					</view>
					<view class="content" v-else>
						包邮
					</view>
				</view>
				<view class="row">
					<view class="nominal"></view>
					<view class="content">
						<text class="text-sm margin-right-xs">合计：</text>
						<text class="money text-price text-main">
							<text>{{ buyGoods.vipPrice * buyGoods.number - preferential  }}</text>
							<template v-if="buyGoods.integral > 0">
								<text class="text-xs">{{ buyGoods.integralType | filterIntegralType }}</text>
								<text>{{buyGoods.integral * buyGoods.number }}</text>
								<text class="text-xs">{{ $queue.getIntegralName() }}</text>
							</template>
						</text>
					</view>
				</view>
			</view>
		</view>
		<!-- 套餐信息 -->
		<view class="main-wrap margin-top-sm storeInfo">
			<view class="package-title">套餐详情</view>
			<view v-for="(data, index) in specification" :key="index">

				<view class="package-name">{{ data.name }}</view>
				<view class="package-details" v-for="(v, i) in data.item" :key="i">
					<view class="left">
						<view class="dian"></view>
						<view class="num">{{v.detail}} ({{v.num}}) 份</view>
					</view>
					<view class="price">{{ `¥ ${v.price}` }}</view>
				</view>
			</view>
		</view>
		<!-- 注意事项 -->
		<view class="main-wrap margin-top-sm storeInfo">
			<!-- <view class="package-title">注意事项</view> -->
			<view class="package-name">使用时间</view>
			<view class="package-details">
				<view class="left">
					<view class="dian"></view>
					<view class="p">{{buyGoods.useTime}}</view>
				</view>
			</view>
			<view class="package-name">使用须知</view>
			<view class="package-details">
				<view class="left">
					<view class="dian"></view>
					<view class="p">不提供发票，不支持退款</view>
				</view>
			</view>
			<view class="package-name">其它须知</view>
			<view class="package-details">
				<view class="left">
					<view class="dian"></view>
					<view class="p" v-if="buyGoods.purchaseNotice">{{ buyGoods.purchaseNotice}}</view>
					<view class="p" v-else>无</view>
				</view>
			</view>
		</view>
		<!-- 占位符 -->
		<view class="blck"></view>
		<!-- 底部按钮 -->
		<view class="footer">
			<view class="settlement">
				<view class="sum" v-if="buyGoods">
					<!-- <text class="text-sm margin-right-xs">合计：</text> -->
					<view class="money text-price text-main">
						<text>{{ formatMoney(buyGoods.vipPrice * buyGoods.number - preferential) }}</text>
						<template v-if="buyGoods.integral > 0">
							<text class="text-xs">{{ buyGoods.integralType | filterIntegralType }}</text>
							<text>{{buyGoods.integral * buyGoods.number }}</text>
							<text class="text-xs">{{ $queue.getIntegralName() }}</text>
						</template>
					</view>
				</view>
				<view class="btn" @tap="submitOrder">提交订单</view>
			</view>
		</view>
		<!-- 修改提货人弹框 -->
		<view class="password-wrap" v-if="isUserInfo">
			<view class="bg"></view>
			<view class="content">
				<view class="close" @click="isUserInfo = false">+</view>
				<view class="title">修改提货人信息</view>
				<view class="input">
					<text class="abs">提货人：</text>
					<input type="text" v-model="userInfo.name" placeholder="请输入提货人姓名"
						placeholder-style="color: #C1C1C1" />
				</view>
				<view class="input">
					<text class="abs">提货电话：</text>
					<input type="text" v-model="userInfo.phone" placeholder="请输入提货人电话" maxlength="11"
						placeholder-style="color: #C1C1C1" />
				</view>
				<button class="btn" lang="zh_CN" @tap="isUserInfo = false">保存</button>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		formatMoney
	} from '@/common/utils/MoneyUtils.js';
	export default {
		data() {
			return {
				buylist: [], //订单列表
				goodsPrice: 0.0, //商品合计价格
				sumPrice: 0.0, //用户付款价格
				freight: 5.0, //运费
				note: '', //备注
				int: 0, //抵扣积分
				deduction: 0, //抵扣价格
				recinfo: {}, // 地址
				calcAmount: {}, // 金额计算
				memberReceiveAddressList: [], // 收货地址
				isFromCart: false, // 是否来着购物车
				buyGoods: {
					number: 1
				}, // 购买商品信息
				isFreight: true,
				actCode: '',
				inviteCode: '',
				giftCodes: [],
				selectprice: 0,
				giftNumber: 0,
				receivingWay: 0,
				vipStatus: null,
				cart_goods_statistical: null,
				userInfo: {},
				specification: [],
				isUserInfo: false
			};
		},
		onLoad(e) {
			this.vipStatus = this.$queue.getData("vipStatus");
			// console.log('vipStatus:', this.vipStatus)
			if (e.type == 'carts') {
				this.isFromCart = true;
				this.cart_goods_statistical = this.$queue.getJson("cart_goods_statistical")
			}
			if (e.actCode != 'null') {
				this.actCode = e.actCode
			}

		},
		onShow() {
			this.userInfo.phone = this.$queue.getData("phone");
			this.userInfo.name = this.$queue.getJson("userInfo").nickName;
			if (!this.isFromCart) {
				this.buyGoods = this.$queue.getJson("buy_goods");
				this.buyGoods.number = 1
				this.specification = JSON.parse(this.buyGoods.specification)
			} else {
				this.buylist = this.$queue.getJson("buy_goods");
			}
			// 获取用户收货地址
			// if (this.$queue.getData('selectprice')) {
			// 	this.selectprice = this.$queue.getData('selectprice')
			// } else {
			// 	this.getAddress();
			// }
		},
		onUnload() {
			this.$queue.remove("giftselectList");
			this.$queue.remove("selectprice");
		},
		onBackPress() {
			//页面后退时候，清除订单信息
			this.clearOrder();
		},
		computed: {
			//商品总额计算
			sumSkuAmount: function() {
				if (Object.keys(this.buyGoods).length == 0) return
				if (!this.actCode) return
				// console.log(this.actCode)
				if (this.actCode == 'LZSY_C001') {
					return (this.buyGoods.vipPrice * this.buyGoods.number).toFixed(2)
				} else {
					return ((this.buyGoods.sku.salePrice * this.buyGoods.number) + this.buyGoods.base.postage).toFixed(
						2)
				}
			},
			// 会员优惠
			preferential: function() {
				if (Object.keys(this.buyGoods).length == 0) return
				if (!this.actCode) return
				if (this.actCode != 'LZSY_C001') {
					return ((this.buyGoods.salePrice - this.buyGoods.vipPrice) * this.buyGoods.number).toFixed(
						2)
				} else {
					return 0
				}
			},
		},
		filters: {
			// 转换2位小时
			toFixed: function(x) {
				return parseFloat(x).toFixed(2);
			}
		},
		methods: {
			formatMoney,
			// 修改提货人信息
			updateUserInfo() {
				this.isUserInfo = true
			},
			// 保存提货人
			saveUserInfo() {
				this.isUserInfo = true
			},
			/* 店铺按钮 */
			goStore() {
				if (!this.hasLogin) {
					uni.navigateTo({
						url: "/pages/login/login"
					})
					return
				}
				uni.navigateTo({
					url: "/sub/stores/store/storeDetail?storeId=" + this.buyGoods.storeId + "&actCode=LZSY_C"
				});
			},
			/* 减少数量 */
			handleSubNumber() {
				if (this.buyGoods.number <= 1) {
					return;
				}
				this.buyGoods.number--;
			},
			/* 增加数量 */
			handleAddNumber() {
				console.log(this.buyGoods)
				if (this.buyGoods.number >= this.buyGoods.stockQty) {
					return
				}

				this.buyGoods.number++;
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
				this.$queue.remove("buy_goods")
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
				let result = null
				
				// 判断是否是购物车订单
				// console.log(that.isFromCart)
				if (!that.isFromCart) {
					// 订单信息
					let omsStreetOrder = {
						actCode: that.actCode,
						storeId: that.buyGoods.storeId,
						storeName: that.buyGoods.storeName,
						bsType: "BS_A009",
						userId: that.$queue.getData('userId'),
						userPhone: that.userInfo.phone,
						userName: that.userInfo.name,
						note: that.note,
						receivingWay: 1,
					}
					// 订单商品信息
					let omsStreetOrderDetail = {
						goodsId: that.buyGoods.id,
						goodsName: that.buyGoods.goodsName,
						goodsTitle: that.buyGoods.goodsTitle,
						goodsImg: that.buyGoods.goodsIcon,
						goodsNum: that.buyGoods.number,
						goodsType: 0,
						salePrice: that.buyGoods.salePrice,
						vipPrice: that.buyGoods.vipPrice,
						settlePrice: that.buyGoods.settlePrice,
						marketPrice: that.buyGoods.marketPrice,
						integralType: that.buyGoods.integralType,
						integral: that.buyGoods.integral,
						stockQty: that.buyGoods.stockQty,
						postage: that.buyGoods.postage,
						purchaseNotice: that.buyGoods.purchaseNotice,
						specification: that.buyGoods.specification,
					}
					orderList.push({
						omsStreetOrder,
						omsStreetOrderDetail,
					})
					console.log(orderList)
					that.$queue.showLoading("生成订单中...");
					result = await that.$http.streetOrderAdd(orderList)
					uni.hideLoading();

				}

				if (result.code != 200) {
					return that.$queue.showToast(result.message)
				}
				if (result.data != null) {
					if (that.isFromCart) {
						// 得到下单失败商品
						let failList = [];
						_.map(that.buylist, (v, i) => {
							if (_.find(result.data, res => v.skuId == res.omsOrderDetail.goodsSkuId) ==
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
										that.toPayment(result)
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
							that.toPayment(result)
						}
					} else {
						if (!result.data.length) return that.$queue.showToast('库存不足');
						// 无效订单
						if (result.data[0].omsOrder.status != 5) {
							that.toPayment(result)
							return
						}
						that.$queue.showToast(result.data[0].omsOrder.note);
					}
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
			// 礼券礼包选择 
			selectgift() {
				uni.navigateTo({
					url: '/sub/orders/choosegift/choosegift'
				});
			},
			/* 跳转支付页面 */
			toPayment(result) {
				setTimeout(() => {
					this.$queue.setJson("pay_order", result.data);
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
			//运费输入框失去焦点触发
			blurFreight() {
				this.isFreight = true
				if (!this.freight) {
					this.freight = 5
				}
			}
		}
	};
</script>

<style lang="scss">
	@import '@/static/css/street.scss';

	.addr {

		// display: flex;
		.hr {
			border-bottom: 2upx solid #f7f7f7;
			padding-bottom: 16upx;
			margin-bottom: 28upx;
		}

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
					font-size: 26upx;
					font-weight: 300;
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
					display: flex;
					flex-direction: column;
					justify-content: space-between;
					overflow: hidden;
					margin-left: 28upx;

					.title {
						width: 100%;
						height: 80upx;
						font-size: 28upx;
						color: #333;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 2;
						text-align: justify;
						overflow: hidden;
						line-height: 40upx;
						font-weight: 700;

					}

					.spec {
						display: flex;
						font-size: 22upx;
						background-color: #f3f3f3;
						color: #a7a7a7;
						align-items: center;
						padding: 0 10upx;
						margin-top: 12upx;
						border-radius: 8upx;
						// margin-bottom: 20vw;
					}

					.price-number {
						// position: absolute;
						width: 100%;
						// bottom: 0upx;
						display: flex;
						// justify-content: space-between;
						align-items: flex-end;
						font-size: 28upx;
						height: 40upx;

						.price {
							color: $uni-color-main;
						}

						.number {
							width: 68upx;
							height: 28upx;
							font-size: 20upx;
							color: #FA3B1C;
							border: 1upx solid #FA3B1C;
							opacity: 1;
							border-radius: 4upx;
							line-height: 28upx;
							text-align: center;
							font-weight: 300;
							margin: 4upx 8upx 0;
						}
					}
				}
			}

			.note {
				.row {
					display: flex;
					// margin-top: 56upx;

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
				background: $uni-bg-color-main;
				color: #fff;
				display: flex;
				justify-content: center;
				align-items: center;
				font-size: 30upx;
				border-radius: 40upx;
			}
		}
	}

	.length {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-top: 30upx;
		padding-bottom: 30upx;

		.text {
			font-size: 32upx;
		}

		.number {
			display: flex;
			justify-content: center;
			align-items: center;
			text-align: center;

			.input {
				width: 100upx;
				height: 60upx;
				margin: 0 10upx;
				background-color: #f3f3f3;
				display: flex;
				justify-content: center;
				align-items: center;
				text-align: center;

				input {
					width: 80upx;
					height: 60upx;
					display: flex;
					justify-content: center;
					align-items: center;
					text-align: center;
					font-size: 26upx;
				}
			}

			.sub,
			.add {
				width: 60upx;
				height: 60upx;
				background-color: #f3f3f3;
				border-radius: 8upx;
				display: flex;
				align-items: center;
				justify-content: center;
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
	}
	
	.password-wrap .bg {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		background-color: rgba(17, 16, 30, 0.50);
	}
	
	.password-wrap .content {
		position: absolute;
		top: 51%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 600upx;
		background-color: #fff;
		border-radius: 16upx;
	}
	
	.password-wrap .content .title {
		text-align: center;
		margin: 48upx 0 60upx;
		font-size: 32upx;
		color: #333333;
	}
	
	.password-wrap .content .input {
		display: flex;
		align-items: center;
		border-bottom: 2upx solid #f7f7f7;
		margin: 28upx 40upx;
	
		image {
			width: 40upx;
			height: 40upx;
			margin: 0 24upx 30upx 12upx;
		}
	
		input {
			margin-bottom: 28upx;
		}
		
		.abs {
			margin-bottom: 28upx;
		}
	}
	
	.password-wrap .content .btn {
		width: 524upx;
		height: 76upx;
		line-height: 76upx;
		text-align: center;
		font-size: 32upx;
		color: #FFFFFF;
		margin: 48upx auto 48upx;
		background: #FF5A5A;
		border-radius: 38upx;
		background: $uni-bg-color-main;
	}
	
	
	.password-wrap .close {
		position: absolute;
		top: 20upx;
		right: 30upx;
		font-size: 56upx;
		color: #D8D8D8;
		transform: rotate(45deg);
	}
</style>
