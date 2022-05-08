<template>
	<view>
		<!-- 收货地址 -->
		<view class="main-wrap margin-top" @click="toSelectAddress">
			<view class="main-wrap-box addr">
				<!-- <view class="icon">
					<image src="../static/img/addricon.png"></image>
				</view> -->
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
					<view class="cuIcon-right" style="color: #999;">
					</view>
				</view>
				<view class="right flex justify-between align-center" style="width: 100%;" v-else>
					<view class="name">请添加收货地址</view>
					<view class="cuIcon-right"></view>
				</view>
			</view>
		</view>
		<template v-if="!isFromCart">
			<!-- 商品信息 -->
			<view class="main-wrap" v-if="buyGoods.sku">
				<view class="main-wrap-box buy-list">
					<view class="row">
						<view class="goods-store">
							<image src="../../../static/img/logo.png" mode=""></image>
							<view class="">
								{{buyGoods.base.storeName}}
							</view>
						</view>
						<view class="goods-info">
							<view class="img">
								<image :src="buyGoods.sku.skuImg || buyGoods.base.goodsIcon"></image>
							</view>
							<view class="info">
								<view class="title">{{ buyGoods.base.goodsName}}</view>
								<view class="spec">选择: {{buyGoods.sku.skuName }} 数量:{{ buyGoods.number }}</view>
								<view class="price-number">
									<view class="price text-price">
										<text>{{ buyGoods.sku.salePrice }}</text>
										<template v-if="buyGoods.sku.integral > 0">
											<text
												class="text-xs">{{ buyGoods.sku.integralType | filterIntegralType }}</text>
											<text>{{ buyGoods.sku.integral }}</text>
											<text class="text-xs">{{ $queue.getIntegralName() }}</text>
										</template>
									</view>
									<!-- <view class="number" v-if="vipStatus == 1">会员价</view> -->
								</view>
							</view>
						</view>
						<view class="length">
							<view class="text">数量：<text
									style="color: #999;font-size: 26rpx;">(限购{{buyGoods.sku.quota > buyGoods.sku.amount ? buyGoods.sku.amount : buyGoods.sku.quota}}件)</text>
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
			<!-- 提示-备注 -->
			<!-- <view class="main-wrap">
				<view class="main-wrap-box order">
					<view class="row">
						<view class="left">备注 :</view>
						<view class="right"><input placeholder="选填,备注内容" v-model="note" /></view>
					</view>
				</view>
			</view> -->
			<!-- 明细 -->
			<view class="main-wrap" v-if="buyGoods.sku">
				<view class="main-wrap-box detail">
					<view class="row">
						<view class="nominal">商品总额</view>
						<view style="color: #333;font-size: 28upx;" class="content text-price">
							<text>{{ formatMoney(buyGoods.sku.salePrice * buyGoods.number) }}</text>
						</view>
					</view>
					<view class="row" v-if="buyGoods.sku.integral > 0">
						<view class="nominal">
							{{ buyGoods.sku.integralType == 0 ? '抵扣' : '赠送' }}{{ $queue.getIntegralName() }}
						</view>
						<!-- <view class="content">{{buyGoods.sku.integral * buyGoods.number }}</view> -->
						<view class="content"> <text class="text-xs"
								v-if="!buyGoods.sku.integralType">-</text>{{ formatMoney(buyGoods.sku.integral * buyGoods.number) }}
						</view>
					</view>
					<view class="row" v-if="vipStatus == 1">
						<view class="nominal">会员优惠</view>
						<view class="content" style="color: #EB6133;">
							已优惠{{formatMoney(preferential)}}<text class="cuIcon-right"
								style="color: #999;margin-left: 12rpx;"></text>
						</view>
					</view>
					<view class="row" v-if="buyGoods.base.actCode == $stringUtils.giftbagCode()" @click="selectgift">
						<view class="nominal">礼券福袋</view>
						<view class="content" style="color: #EB6133;" v-if="!selectprice">
							可使用{{giftNumber}}张礼券福袋<text class="cuIcon-right"
								style="color: #999;margin-left: 12rpx;"></text>
						</view>
						<view class="content" style="color: #EB6133;" v-else>
							- <text class="text-price"> </text>{{selectprice}}<text class="cuIcon-right"
								style="color: #999;margin-left: 12rpx;"></text>
						</view>
					</view>
					<view class="row" v-if="$queue.getData('bsType') == 'BS_A010' && 0">
						<view class="nominal">提货方式</view>
						<view class="content" style="color: #EB6133;">
							<radio-group @change="radioChange" class="radio-group">
								<label class="weui-cell weui-check__label radio-group-label"
									style="margin-right: 48upx;">
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
					</view>
					<view class="row">
						<view class="nominal">运费</view>
						<view class="content text-price" v-if="buyGoods.base.postage != 0">
							{{ buyGoods.base.postage }}
						</view>
						<view class="content" v-else>
							包邮
						</view>
						<!-- <view class="content" v-show="!isFreight"><input placeholder="运费默认5元" v-model="freight"
								@blur="blurFreight" /></view> -->
					</view>
					<view class="row">
						<view class="nominal"></view>
						<view class="content">
							<!-- <view class="sum" v-if="buyGoods.sku"> -->
							<text class="text-sm margin-right-xs">合计：</text>
							<text class="money text-price text-main">
								<!-- <text>{{(buyGoods.sku.salePrice + freight) * buyGoods.number }}</text> vipStatus == 1 ? vipPrice :  -->
								<!-- <text>{{ changeTwoDecimal($queue.accAdd(sumSkuAmount, selectprice)) < 0 ? 0 : changeTwoDecimal($queue.accAdd(sumSkuAmount,selectprice)) }}</text> -->
								<text>{{ formatMoney(buyGoods.sku.salePrice * buyGoods.number - preferential)  }}</text>
								<template v-if="buyGoods.sku.integral > 0">
									<text class="text-xs">{{ buyGoods.sku.integralType | filterIntegralType }}</text>
									<text>{{formatMoney(buyGoods.sku.integral * buyGoods.number) }}</text>
									<text class="text-xs">{{ $queue.getIntegralName() }}</text>
								</template>
							</text>
							<!-- </view> -->
						</view>
						<!-- <view class="content" v-show="!isFreight"><input placeholder="运费默认5元" v-model="freight"
								@blur="blurFreight" /></view> -->
					</view>
					<!-- <view class="row">
						<view class="nominal">积分抵扣</view>
						<view class="content">￥-{{ deduction | toFixed }}</view>
					</view> -->
				</view>
			</view>
			<!-- 占位符 -->
			<view class="blck"></view>
			<!-- 底部按钮 -->
			<view class="footer">
				<view class="settlement">
					<view class="sum" v-if="buyGoods.sku">
						<!-- <text class="text-sm margin-right-xs">合计：</text> -->
						<view class="money text-price text-main">
							<!-- <text>{{(buyGoods.sku.salePrice + freight) * buyGoods.number }}</text> -->
							<text>{{ formatMoney(buyGoods.sku.salePrice * buyGoods.number - preferential) }}</text>
							<template v-if="buyGoods.sku.integral > 0">
								<text class="text-xs">{{ buyGoods.sku.integralType | filterIntegralType }}</text>
								<text>{{formatMoney(buyGoods.sku.integral * buyGoods.number) }}</text>
								<text class="text-xs">{{ $queue.getIntegralName() }}</text>
							</template>
							<!-- <text v-if="selectprice" class="text-sm" style="margin-left: 8rpx;color: #333;">已优惠<text
									class="text-price text-main">{{selectprice}}</text></text> -->
						</view>
					</view>
					<view class="btn" @tap="submitOrder">提交订单</view>
				</view>
			</view>
		</template>

		<!-- 购物车订单 -->
		<template v-else>
			<!-- 商品列表 -->
			<view class="main-wrap">
				<view class="main-wrap-box buy-list" v-for="(item, index) in buylist" :key="index">
					<view class="row">
						<view class="goods-info">
							<view class="img">
								<image :src="item.goodsIcon"></image>
							</view>
							<view class="info">
								<view class="title">{{ item.goodsName}}</view>
								<view class="spec">选择: {{item.skuName }} 数量: x{{ item.goodsNum }}</view>
								<view class="price-number">
									<view class="price text-price">
										<text>{{ item.salePrice }}</text>
										<template v-if="item.integral > 0">
											<text class="text-xs">{{ item.integralType | filterIntegralType }}</text>
											<text>{{ item.integral }}</text>
											<text class="text-xs">{{ $queue.getIntegralName() }}</text>
										</template>
									</view>
									
								</view>
							</view>
						</view>
						<view class="number" v-if="item.fail">
							<text class="text-xs text-main">{{item.note}}</text>
						</view>
					</view>
				</view>
			</view>
			<!-- 提示-备注 -->
			<!-- <view class="main-wrap">
				<view class="main-wrap-box order">
					<view class="row">
						<view class="left">备注 :</view>
						<view class="right"><input placeholder="选填,备注内容" v-model="note" /></view>
					</view>
				</view>
			</view> -->
			<!-- 明细 -->
			<view class="main-wrap">
				<view class="main-wrap-box detail">
					<view class="row">
						<view class="nominal">商品总额</view>
						<view style="color: #333;font-size: 28upx;" class="content text-price">
							<text>{{ cart_goods_statistical.sumSaleAmount }}</text>
						</view>
					</view>
					<view class="row">
						<view class="nominal">
							{{ cart_goods_statistical.sumIntegral > 0 ? '抵扣' : '赠送' }}{{ $queue.getIntegralName() }}
						</view>
						<!-- <view class="content">{{buyGoods.sku.integral * buyGoods.number }}</view> -->
						<view class="content"> <text class="text-xs">
							</text>{{ cart_goods_statistical.sumIntegral }}<text
								class="text-xs">{{$queue.getIntegralName()}}</text>
						</view>
					</view>
					<view class="row" v-if="vipStatus == 1">
						<view class="nominal">会员优惠</view>
						<view class="content" style="color: #FA3B1C;">
							已优惠 <text class="text-price">{{cart_goods_statistical.sumPreferential}}</text><text class="cuIcon-right"
								style="color: #999;margin-left: 12rpx;"></text>
						</view>
					</view>
					<view class="row">
						<view class="nominal">运费</view>
						<view class="content text-price" v-if="cart_goods_statistical.sumYf != 0">
							{{ cart_goods_statistical.sumYf }}
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
								<text
									v-if="vipStatus == 1">{{ formatMoney(cart_goods_statistical.sumAmount + cart_goods_statistical.sumYf) }}</text>
								<text
									v-else>{{ formatMoney(cart_goods_statistical.sumSaleAmount + cart_goods_statistical.sumYf)}}</text>
								<template v-if="cart_goods_statistical.sumIntegral > 0">
									<text
										class="text-xs">{{ (cart_goods_statistical.sumIntegral > 0 ? 0 : 1) | filterIntegralType }}</text>
									<text>{{ cart_goods_statistical.sumIntegral }}</text>
									<text class="text-xs">{{$queue.getIntegralName()}}</text>
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
							<text
								v-if="vipStatus == 1">{{ formatMoney(cart_goods_statistical.sumAmount + cart_goods_statistical.sumYf)  }}</text>
							<text
								v-else>{{ formatMoney(cart_goods_statistical.sumSaleAmount + cart_goods_statistical.sumYf)  }}</text>
							<template v-if="cart_goods_statistical.sumIntegral > 0">
								<text
									class="text-xs">{{ (cart_goods_statistical.sumIntegral > 0 ? 0 : 1) | filterIntegralType }}</text>
								<text>{{ cart_goods_statistical.sumIntegral }}</text>
								<text class="text-xs">{{$queue.getIntegralName()}}</text>
							</template>
						</view>
					</view>
					<view class="btn" @tap="submitOrder">提交订单</view>
				</view>
			</view>
		</template>
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
			this.giftNumber = e.giftNumber

		},
		onShow() {
			if (!this.isFromCart) {
				this.buyGoods = this.$queue.getJson("buy_goods");
				this.buyGoods.number = 1
			} else {
				this.buylist = this.$queue.getJson("buy_goods");
			}
			// 获取用户收货地址
			if (this.$queue.getData('selectprice')) {
				this.selectprice = this.$queue.getData('selectprice')
			} else {
				this.getAddress();
			}
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
				if(this.actCode == 'LZSY_C001') {
					return this.buyGoods.vipPrice * this.buyGoods.number
				} else {
					return (this.buyGoods.sku.salePrice * this.buyGoods.number) + this.buyGoods.base.postage
				}
			},
			// 会员优惠
			preferential: function() {
				if (Object.keys(this.buyGoods).length == 0) return
				if (!this.actCode) return
				if(this.actCode != 'LZSY_C001') {
				  return (this.buyGoods.sku.salePrice - this.buyGoods.sku.vipPrice) * this.buyGoods.number
				}else {
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
				if (this.buyGoods.number >= this.buyGoods.sku.quota) {
					return
				}
				if (this.buyGoods.number >= this.buyGoods.sku.amount) {
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
				if (_.isEmpty(that.recinfo)) {
					return that.$queue.showToast("请填写收货地址");
				}
				// 判断是否是购物车订单
				// console.log(that.isFromCart)
				if (!that.isFromCart) {
					// 订单信息
					let omsOrder = {
						// actCode: that.actCode,
						storeId: that.buyGoods.base.storeId,
						storeName: that.buyGoods.base.storeName,
						bsType: "BS_A001",
						userName: that.$queue.getData('phone'),
						note: that.note,
					}

					if (this.$queue.getData('userInvitationCode') != undefined) {
						this.inviteCode = this.$queue.getData('userInvitationCode')
					}

					if (this.$queue.getData('bsType') != undefined) {
						omsOrder.bsType = this.$queue.getData('bsType')
					}
					// 当时数字货架时
					if (this.$queue.getData('bsType') == 'BS_A010') {
						console.log(999999999)
						omsOrder.receivingWay = this.receivingWay
					}
					if (this.$queue.getData('saleStoreId') != undefined) {
						omsOrder.saleStoreId = this.$queue.getData('saleStoreId')
					}
					if (this.$queue.getData('saleStoreName') != undefined) {
						omsOrder.saleStoreName = this.$queue.getData('saleStoreName')
					}
					// 订单商品信息
					let omsOrderDetail = {
						goodsId: that.buyGoods.base.id,
						goodsName: that.buyGoods.base.goodsName,
						goodsTitle: that.buyGoods.base.goodsTitle,
						marketPrice: that.buyGoods.base.marketPrice,
						goodsSkuId: that.buyGoods.sku.id,
						goodsSkuIcon: that.buyGoods.sku.skuImg,
						goodsSkuName: that.buyGoods.sku.skuName,
						salePrice: that.buyGoods.sku.salePrice,
						settlePrice: that.buyGoods.sku.settlePrice,
						integralType: that.buyGoods.sku.integralType,
						integral: that.buyGoods.sku.integral,
						goodsNum: that.buyGoods.number,
					}
					if (this.$queue.getJson('giftselectList') != undefined) {
						this.giftCodes = JSON.parse(this.$queue.getData('giftselectList'))
						let price = this.$queue.getData('selectprice')
						omsOrderDetail.salePrice = that.buyGoods.sku.salePrice - price < 0 ? 0 : that.buyGoods.sku
							.salePrice - price
						omsOrderDetail.settlePrice = that.buyGoods.sku.settlePrice - price < 0 ? 0 : that.buyGoods
							.sku.settlePrice - price
					}
					if (that.actCode == this.$stringUtils.giftbagCode()) {
						omsOrder.bsType = 'BS_A008'
					}
					if (that.buyGoods.sku.integralType == 0 && omsOrder.bsType == "BS_A001") {
						omsOrder.actCode = that.actCode
					}
					// 收货地址信息
					const omsOrderAddress = {
						phone: that.recinfo.phone,
						userName: that.recinfo.userName,
						address: that.recinfo.address
					};
					orderList.push({
						inviteCode: this.inviteCode,
						giftCodes: this.giftCodes,
						omsOrder,
						omsOrderDetail,
						omsOrderAddress
					})
					console.log(orderList)
					that.$queue.showLoading("生成订单中...");
					result = await that.$http.createGoodsOrder(orderList)
					uni.hideLoading();

				} else {
					if (this.$queue.getData('userInvitationCode') != undefined) {
						this.inviteCode = this.$queue.getData('userInvitationCode')
					}

					if (that.$queue.getData('bsType') != undefined) {
						omsOrder.bsType = that.$queue.getData('bsType')
					}
					// 收货地址信息
					const omsOrderAddress = {
						phone: that.recinfo.phone,
						userName: that.recinfo.userName,
						address: that.recinfo.address
					};
					// console.log(that.$queue.getJson('buy_goods_ids'))
					orderList.push({
						giftCodes: [],
						inviteCode: that.$queue.getInvitation(),
						ids: that.$queue.getJson('buy_goods_ids'),
						omsOrderAddress
					})
					that.$queue.showLoading("生成订单中...");
					result = await that.$http.addCartOrder(orderList[0])
					uni.hideLoading();
				}

				if (result.code != 200) {
					return that.$queue.showToast(result.message)
				}
				if (result.data != null) {
					if (that.isFromCart) {
						// 得到下单失败商品
						let failList = [];
						// 得到下单成功的商品
						let successList = [];
						// _.map(that.buylist, (v, i) => {
						// 	if (_.find(result.data, res => v.skuId == res.omsOrderDetail.goodsSkuId) ==
						// 		undefined) {
						// 		failList.push(v)
						// 		that.$set(that.buylist[i], 'fail', true)
						// 	}
						// })
						_.map(result.data, res => {
							if (res.omsOrder.status == 5) {
								failList.push(res)
								_.map(that.buylist, (v, i) => {
									if(v.skuId == res.omsOrderDetail.goodsSkuId) {
										that.$set(that.buylist[i], 'fail', true)
										that.$set(that.buylist[i], 'note', res.omsOrder.note)
									}
								})
							}else {
								successList.push(res)
							}
						})
						// console.log(failList)
						
						
						console.log(successList)
						// 提示下单失败的商品信息
						if (_.size(failList) > 0) {
							uni.showModal({
								title: "提示",
								content: `部分商品下单失败，商品可能失败原因：1、用户礼券不足；2、商品已下架；3、商品已限购。是否支付成功下单的商品？`,
								success(rest) {
									if (rest.confirm) {
										if(_.size(successList) > 0) {
											that.toPayment(successList)
										}else {
											that.$queue.showToast("没有下单成功的商品，页面将在3秒后自动返回购物车")
											setTimeout(() => {
												uni.navigateBack({
													delta: 1
												})
												that.clearOrder();
											}, 3000)
										}
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
							that.toPayment(result.data)
						}
					} else {
						if (!result.data.length) return that.$queue.showToast('库存不足');
						if (result.data[0].omsOrder.status != 5) {
							// 不是无效订单
							that.toPayment(result.data)
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
					background: $base;
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
					overflow: hidden;
					display: flex;
					flex-wrap: wrap;
					position: relative;
					margin-left: 28upx;

					.title {
						width: 100%;
						font-size: 28upx;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 2;
						// text-align: justify;
						overflow: hidden;
					}

					.spec {
						font-size: 22upx;
						background-color: #f3f3f3;
						color: #a7a7a7;
						display: flex;
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
							// width: 68upx;
							// height: 28upx;
							font-size: 20upx;
							color: $base;
							// border: 1upx solid #FA3B1C;
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
							background-image: url(../static/img/checkyes.png);
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
</style>
