<template>
	<view class="">
		<view class="totalof">
			总计
		</view>
		<view class="income_swiper">
			<block v-for="(item,index) in imgs" :key="index">
				<view class="swiper-items">
					<image class="income_header_img" :src="item.img"></image>
					<view class="income_header" style="">
						<view class="view">{{item.poa}}</view>
						<view class="text">{{item.tetle}}</view>
					</view>
				</view>
			</block>
		</view>
		<view class="collection">
			<view class="type">
				<view class="left" :class="{active: typeIndex == 0}" @click="changeTypeStatus(0)">
					商城订单
				</view>
				<!-- <view class="right" :class="{active: typeIndex == 1}" @click="changeTypeStatus(1)">
					便利店订单
				</view> -->
			</view>
			<view class="collection_date">
				<view class="picker_date">
					<!-- <picker mode="multiSelector" :value="date" :end="dataText" @change="bindDateChange">
						<text> {{date}}</text>
					</picker>
					
					<picker mode="multiSelector" fields="day" :value="enddate" :start="startDate" :end="dataText"
						@change="bindDateChangeEnd">
						<text> {{enddate}}</text>
					</picker> -->

					<!-- 测试时分秒代码 -->
					<picker mode="multiSelector" :value="STARTdateTime" @change="STARTchangeDateTime"
						@columnchange="STARTchangeDateTimeColumn" :range="dateTimeArray">
						<text class="otherCheck">{{STARTtimeStr}}</text>
					</picker>
					至
					<picker mode="multiSelector" :value="ENDdateTime" @change="ENDchangeDateTime"
						@columnchange="ENDchangeDateTimeColumn" :range="beforedateTimeArray">
						<text class="otherCheck">{{ENDtimeStr}}</text>
					</picker>
					<!-- 测试时分秒代码 -->
				</view>
				<image src="../../../static/img/riqi.png" @click="getLast3Month"></image>
			</view>
			<view class="collection_text">
				<text>成交: {{total}}笔</text> <text>抵扣礼券: {{discountTotal}}个</text>
			</view>
			<view class="collection_text">
				<text>收入: {{payTotal}}元</text> <text>赠送礼券: {{rewardTotal}}个</text>
			</view>
		</view>
		<view class="income_list">
			<view class="income_text" data-id="" v-for="(item,index) in dataList" :key="index">
				<text class="income_text_l" v-if="item.bsType == 'BS_A001' ">商城订单</text>
				<text class="income_text_l" v-if="item.bsType == 'storeOrder' ">进货订单</text>
				<text class="income_text_l" v-if="item.bsType == 'BS_A002' ">扫码订单</text>
				<view class="income_text_c">
					<view class="income_text_H">{{item.userName}}</view>
					<view class="income_text_D">{{item.createTime}}</view>
				</view>
				<view class="income_text_r">
					<view style="text-align: right;"><text>+</text>{{item.payAmount}}元<text
							style="color: #C0C0C0;">({{'-' + (item.poundageFee == null ? 0 : item.poundageFee)}})</text>
					</view>
					<view class="income_text_r_b">-{{item.integral}}礼券<text
							style="color: #C0C0C0;">({{'-' + (item.integralAmount == null ? 0 : item.integralAmount)}})</text></view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		formatTime,
		getLocalTime,
		parseTime
	} from '@/common/utils/DateUtils.js';
	const {
		dateTimePicker,
		getMonthDay,
		generateTimeStr
	} = require('@/common/utils/dateTimePicker.js');
	export default {
		data() {
			return {
				imgs: [{
						poa: 0,
						tetle: "收款金额  (元)",
						img: "https://lz.static.seprain.com/assets/imgs/paymentAmount.png"
					},
					{
						poa: 0,
						tetle: "交易笔数 (笔)",
						img: "https://lz.static.seprain.com/assets/imgs/numberOfTransactions.png"
					},
					{
						poa: 0,
						tetle: "赠送礼券 (个)",
						img: "https://lz.static.seprain.com/assets/imgs/giftCertificates.png"
					},
					{
						poa: 0,
						tetle: "购买礼券金额 (元)",
						img: "https://lz.static.seprain.com/assets/imgs/buyGiftCertificates.png"
					},
					{
						poa: 0,
						tetle: "剩余礼券 (个)",
						img: "https://lz.static.seprain.com/assets/imgs/remainingCoupon.png"
					},
				],
				img: "http://img.kaiyanapp.com/7ff70fb62f596267ea863e1acb4fa484.jpeg",
				date: '',
				time: '11:00',
				dateTimeArray: null,
				dateTime: null,
				startYear: 1980,
				endYear: 2050,
				beforedateTimeArray: null,
				beforedateTime: null,
				before: true,
				pageNum: 1,
				pageSize: 10,
				totalPage: 1,
				startDate: "",
				discountTotal: 0, //抵扣
				payTotal: 0.00, //收入
				rewardTotal: 0, //礼券
				exchangeShell: 0, //剩余礼券
				total: 0, //笔数
				dataList: [],
				storesName: "",
				storesType: "",
				storeId: '',
				enddate: '',
				page_true: true,
				dataText: "",
				isfinish: false,
				// ********** 测试时分秒代码
				STARTdateTime: null,
				ENDdateTime: null,
				dateTimeArray: null,
				startYear: 2000,
				STARTtimeStr: '',
				ENDtimeStr: '',
				typeIndex: 0,
				// **********
			};
		},
		onLoad(options) {
			this.storeId = options.storeId
			var dayTime = formatTime(new Date());
			let dayTimeG = dayTime.split(" ")[0].split("/");
			let getLast3Month = this.getLast3Month()
			dayTime = dayTimeG.join("-");
			this.date = getLast3Month.last
			this.enddate = getLast3Month.now
			this.STARTtimeStr = getLast3Month.last
			this.ENDtimeStr = getLast3Month.now
			this.dataText = getLast3Month.now
			this.startDate = this.date
			// ********** 测试时分秒代码
			this.initTime()
			// **********
			this.getTransactionTotal()
			this.getCouponDetails()


		},
		// 下拉刷新
		onPullDownRefresh() {
			this.pageNum = 1;
			this.isfinish = false;
			// 加载猜你喜欢推荐商品
			this.date = this.getLast3Month().last
			this.dataList = [];
			this.getCouponDetails();
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 1000);
		},
		onReachBottom() {
			if (this.totalPage > 1) {
				this.pageNum++;
				this.getCouponDetails();
			}
		},
		methods: {

			// ********** 测试时分秒代码
			initTime() {
				let date = new Date();
				let endYear = date.getFullYear();
				// 获取完整的年月日 时分秒，以及默认显示的数组
				let obj = dateTimePicker(this.startYear, endYear);
				// 精确到分的处理，将数组的秒去掉
				this.dateTimeArray = obj.dateTimeArray
				this.beforedateTimeArray = JSON.parse(JSON.stringify(obj.dateTimeArray));
				var monthObj = JSON.parse(JSON.stringify(obj.dateTime));
				// if (monthObj[1] == 1) { //如果是1月份，则取上一年的10月份
				// 	monthObj[1] = 10
				// }
				// if (monthObj[1] == 2) { //如果是2月份，则取上一年的11月份
				// 	monthObj[1] = 11
				// }
				// if (monthObj[1] == 3) { //如果是3月份，则取上一年的12月份
				// 	monthObj[1] = 12
				// }
				// monthObj[1] = monthObj[1] - 3
				this.STARTdateTime = monthObj
				this.ENDdateTime = obj.dateTime
			},
			STARTchangeDateTime(e) {
				this.STARTdateTime = e.detail.value;
				this.STARTtimeStr = generateTimeStr(this.dateTimeArray, this.STARTdateTime);
				//ios时间不能用'-'解析成时间戳
				let startstr = this.STARTtimeStr.replace(/-/g, "/")
				let endstr = this.ENDtimeStr.replace(/-/g, "/")
				if (new Date(startstr).getTime() > new Date(endstr).getTime()) {
					this.STARTtimeStr = this.ENDtimeStr
					let obj = dateTimePicker(this.startYear, new Date().getFullYear());
					this.STARTdateTime = obj.dateTime
				}
				this.isfinish = false
				this.dataList = []
				wx.showLoading({
					title: '加载中...'
				})
				setTimeout(() => {
					wx.hideLoading();
					this.getCouponDetails();
				}, 800);

			},
			/*年,月切换时重新更新计算*/
			STARTchangeDateTimeColumn(e) {
				let {
					column,
					value
				} = e.detail;
				if (column == 0 || column == 1) {
					//直接修改数组下标视图不更新,用深拷贝之后替换数组
					let dateTime = JSON.parse(JSON.stringify(this.STARTdateTime));
					let dateTimeArray = JSON.parse(JSON.stringify(this.dateTimeArray));
					dateTime[column] = value;
					dateTimeArray[2] = getMonthDay(dateTimeArray[0][dateTime[0]], dateTimeArray[1][dateTime[1]]);
					this.STARTdateTime = dateTime;
					this.dateTimeArray = dateTimeArray;
				}
			},
			ENDchangeDateTime(e) {
				this.ENDdateTime = e.detail.value;
				this.ENDtimeStr = generateTimeStr(this.beforedateTimeArray, this.ENDdateTime);
				//ios时间不能用'-'解析成时间戳
				let endstr = this.ENDtimeStr.replace(/-/g, "/")
				let startstr = this.STARTtimeStr.replace(/-/g, "/")
				if (new Date(endstr).getTime() > new Date().getTime()) {
					this.ENDtimeStr = this.getLast3Month().now
					let obj = dateTimePicker(this.startYear, new Date().getFullYear());
					this.ENDdateTime = obj.dateTime
				}
				if (new Date(endstr).getTime() < new Date(startstr).getTime()) {
					this.STARTtimeStr = this.ENDtimeStr
					let obj = dateTimePicker(this.startYear, new Date().getFullYear());
					this.STARTdateTime = obj.dateTime
				}
				let _this = this
				this.isfinish = false
				this.dataList = []
				_this.page_true = true
				this.getCouponDetails();
			},
			/*年,月切换时重新更新计算*/
			ENDchangeDateTimeColumn(e) {
				let {
					column,
					value
				} = e.detail;
				if (column == 0 || column == 1) {
					//直接修改数组下标视图不更新,用深拷贝之后替换数组
					let dateTime = JSON.parse(JSON.stringify(this.ENDdateTime));
					let beforedateTimeArray = JSON.parse(JSON.stringify(this.beforedateTimeArray));
					dateTime[column] = value;
					beforedateTimeArray[2] = getMonthDay(beforedateTimeArray[0][dateTime[0]], beforedateTimeArray[1][
						dateTime[1]
					]);
					this.ENDdateTime = dateTime;
					this.beforedateTimeArray = beforedateTimeArray;
				}
			},
			// **********
			// 切换订单
			changeTypeStatus(v) {
				this.typeIndex = v
				this.isfinish = false;
				this.dataList = []
				this.getCouponDetails()
			},
			// 获取流水列表
			getCouponDetails() {
				if (this.isfinish) return;
				wx.showLoading({
					title: '加载中...'
				})
				let Adate = this.STARTtimeStr
				let Benddate = this.ENDtimeStr
				console.log(Adate)
				console.log(Benddate)
				console.log(startD)
				console.log(endD)
				let startD = new Date(Adate.replace(/-/g, "/")).getTime()
				let endD = new Date(Benddate.replace(/-/g, "/")).getTime()
				let startD1 = parseTime(startD)
				let endD1 = parseTime(endD)
				let data = {
					"bsType": "BS_A002",
					"startTime": startD1 + '',
					"endTime": endD1 + '',
					"pageNum": this.pageNum,
					"pageSize": this.pageSize,
					"storeId": this.storeId,
					"status": 3
				}
				if (!this.typeIndex) {
					// 商城
					data.orderType = 'order'
				} else {
					// 便利店
					data.orderType = 'storeOrder'
				}
				this.$http.getCouponDetails(data).then(res => {
					if (res.code == 200) {
						uni.stopPullDownRefresh();
						uni.hideLoading()
						this.total = res.data.orders ? res.data.orders.total : res.data.streetOrders.total
						this.payTotal = res.data.orderPayAmountTotals.amountTotal
						this.rewardTotal = res.data.orderPayAmountTotals.bonusPointsTotal
						this.totalPage = res.data.orders ? res.data.orders.totalPage : res.data.streetOrders.totalPage
						if (!this.typeIndex) {
							this.dataList = _.concat(this.dataList, res.data.orders.list);
							if (res.data.orders.totalPage == this.pageNum || _.size(res.data.orders.list) === 0) {
								this.isfinish = true;
							}
						} else {
							this.dataList = _.concat(this.dataList, res.data.streetOrders.list);
							if (res.data.streetOrders.totalPage == this.pageNum || _.size(res.data.streetOrders.list) === 0) {
								this.isfinish = true;
							}
						}
						if (this.dataList.length) {
							this.dataList.forEach(item => {
								var dayTime = parseTime(item.createTime)
								item.createTime = dayTime
							})
						}
						// if (res.data.orders.totalPage == this.pageNum || _.size(res.data.orders.list) === 0) {
						// 	this.isfinish = true;
						// }
					}
				})
			},
			getTransactionTotal() {
				wx.showLoading({
					title: '加载中...'
				})
				let data = {
					"bsType": "BS_A002",
					"storeId": this.storeId
				}
				this.$http.transactionTotal(data).then(res => {
					if (res.code == 200) {
						let arr = this.imgs
						this.imgs = []
						arr[0].poa = res.data.amountTotal
						arr[1].poa = res.data.transactionCount
						arr[2].poa = res.data.bonusPointsTotal
						arr[3].poa = res.data.integralAmount
						arr[4].poa = res.data.freeAmount
						this.imgs = arr
					}
					uni.hideLoading()
				})
			},
			getLast3Month() {
				var now = new Date();
				var year = now.getFullYear();
				var month = now.getMonth() + 1; //0-11表示1-12月
				var day = now.getDate();
				var hour = now.getHours()
				var minute = now.getMinutes()
				var second = now.getSeconds()
				var dateObj = {};
				if (parseInt(month) < 10) {
					month = "0" + month;
				}
				if (parseInt(day) < 10) {
					day = "0" + day;
				}
				dateObj.now = year + '-' + month + '-' + day + ' ' + [hour, minute, second].map(this.formatNumber).join(
					':');
				if (parseInt(month)) {
					dateObj.last = (parseInt(year)) + '-' + parseInt(month) + '-' + day + ' ' + '00:00:00'
					return dateObj;
				}
				// if (parseInt(month) == 2) { //如果是2月份，则取上一年的11月份
				// 	dateObj.last = (parseInt(year) - 1) + '-11-' + day + ' ' + [hour, minute, second].map(this
				// 		.formatNumber).join(':');
				// 	return dateObj;
				// }
				// if (parseInt(month) == 3) { //如果是3月份，则取上一年的12月份
				// 	dateObj.last = (parseInt(year) - 1) + '-12-' + day + ' ' + [hour, minute, second].map(this
				// 		.formatNumber).join(':');
				// 	return dateObj;
				// }
				var preSize = new Date(year, parseInt(month), 0).getDate(); //开始时间所在月的总天数
				if (preSize < parseInt(day)) {
					// 开始时间所在月的总天数<本月总天数，比如当前是5月30日，在2月中没有30，则取下个月的第一天(3月1日)为开始时间
					let resultMonth = parseInt(month) - 2 < 10 ? ('0' + parseInt(month) - 2) : (parseInt(month) - 2);
					dateObj.last = year + '-' + resultMonth + '-01' + ' ' + [hour, minute, second].map(this.formatNumber)
						.join(':');
					return dateObj;
				}
				if (parseInt(month) <= 10) {
					dateObj.last = year + '-0' + (parseInt(month) - 3) + '-' + day + ' ' + [hour, minute, second].map(this
						.formatNumber).join(':');
					return dateObj;
				} else {
					dateObj.last = year + '-' + (parseInt(month) - 3) + '-' + day + ' ' + [hour, minute, second].map(this
						.formatNumber).join(':');
					return dateObj;
				}
			},
			formatNumber(n) {
				n = n.toString()
				return n[1] ? n : '0' + n
			},
			turnDate(date) {
				var time = new Date(date)
				return time.getTime()
			},
			// bindDateChange(e) {
			// 	let _this = this
			// 	this.date = e.detail.value
			// 	this.startDate = e.detail.value
			// 	if (this.turnDate(e.detail.value) > this.turnDate(this.enddate)) {
			// 		this.enddate = e.detail.value
			// 	}
			// 	this.isfinish = false
			// 	this.dataList = []
			// 	wx.showLoading({
			// 		title: '加载中...'
			// 	})
			// 	setTimeout(() => {
			// 		wx.hideLoading();
			// 		this.getCouponDetails();
			// 		// this.getCashierList();
			// 		// this.getCashierStats()
			// 	}, 800);
			// },
			// bindDateChangeEnd(e) {
			// 	let _this = this
			// 	this.enddate = e.detail.value
			// 	this.startDate = _this.date
			// 	this.isfinish = false
			// 	this.dataList = []
			// 	_this.page_true = true
			// 	this.getCouponDetails();
			// 	// this.getCashierList()
			// 	// this.getCashierStats()
			// },
		}
	};
</script>

<style lang="scss">
	page {
		background-color: #fff;
	}

	swiper {
		position: absolute;
		height: 140rpx;
		width: 100%;
	}

	.totalof {
		margin: 32upx 24upx 0upx;
		font-size: 32upx;
		font-weight: 500;
		color: #333333;
	}

	.income_swiper {
		/* height: 140rpx; */
		overflow: hidden;
		margin-top: 10rpx;
		display: flex;
		flex-wrap: wrap;
		padding: 2rpx;
	}

	.swiper-items {
		height: 140rpx;
		// width: 232upx;
		margin-top: 10rpx;

		.income_header_img {
			margin-left: 12upx;
			height: 140rpx;
			width: 232upx;
		}
	}

	.income_header {
		height: 100rpx;
		width: 95%;
		opacity: 0.9;
		background-repeat: no-repeat;
		background-size: cover;
		position: relative;
		top: -116rpx;
		left: 40rpx;
		z-index: 100;

		.view {
			margin-bottom: 10rpx;
			font-size: 36upx;
			font-weight: 600;
			color: #FFFFFF;
		}

		.text {
			font-size: 26upx;
			font-weight: 300;
			color: #FFFFFF;
			margin-bottom: 24rpx;
		}
	}



	.collection {
		padding: 20rpx 30rpx;
		margin: 10rpx 0px 20rpx;

		// background: #f9f9f9;
		.type {
			display: flex;
			justify-content: space-around;
			align-items: center;
			font-size: 32upx;
			font-weight: 500;
			color: #333333;
			margin: 24upx 0;
		}

		.active {
			color: #EB6133;
		}
	}

	.collection_date {
		display: flex;
		justify-content: space-between;
		font-size: 24rpx;
		color: #666666;
		margin-top: 10rpx;
		margin-bottom: 20rpx;
	}

	.collection_text {
		display: flex;
		justify-content: space-between;
		font-size: 24rpx;
		margin-top: 15rpx;
		color: #9A9A9A;
	}

	.collection_date text {
		background: #eeeeee;
		border-radius: 20rpx;
		padding: 6rpx 18rpx
	}

	.collection_date image {
		width: 40rpx;
		height: 40rpx;
	}

	.income_text {
		display: flex;
		justify-content: left;
		align-items: center;
		padding: 0 30rpx;
		padding-bottom: 40rpx;
		padding-top: 40rpx;
		border-bottom: 2rpx solid #f7f7f7;
	}

	.income_text_r {
		margin-left: auto;
		color: #343434;
		font-size: 26rpx;
	}

	.income_text_l {
		font-size: 22rpx;
		line-height: 32rpx;
		color: #fff;
		background: #FF6232;
		padding: 4rpx 10rpx;
		margin-right: 20rpx;
		border-radius: 8rpx;
	}

	.income_text_H {
		font-size: 26rpx;
		color: #343434;
		font-weight: bold;
		margin-bottom: 16rpx;
	}

	.income_text_D {
		font-size: 24rpx;
		color: #9A9A9A;
	}

	.picker_date {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.income_header_img {
		width: 96%;
		height: 100%;
	}

	.swiper-item {
		position: absolute;
	}

	.income_text_r_b {
		font-size: 22rpx;
		color: #FF6132;
		text-align: right;
		margin-top: 2px;
	}
</style>
