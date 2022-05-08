<template>
	<view v-if="isloading == 0">
		<view class="" v-if="ishavegift">
			<view class="date">
				<view class="dateHead">
					<view class="selectDate">
						查看签到日期
					</view>
					<!-- <view class="recently">
						最近30天签到<text>{{currentsign.signCount == null ? 0 : currentsign.signCount}}</text>天
					</view> -->
					<view class="recently">
						有效期至{{currentsign.giftValidityEnd}}
					</view>
				</view>
				<view class="dateList">
					<view class='body'>
						<!-- <view class='time'>
							<image class='img rotate'
								src='http://wechat.espot.com.cn/gais/webResource1/staticResource/new/xiangyoujiantou.png?pfdrid_c=true'
								mode='aspectFill' @click='subMonth'></image>
							<view class='text' @click='show'>{{years[value[0]]+'-'+months[value[1]]}}</view>
							<image class='img'
								src='http://wechat.espot.com.cn/gais/webResource1/staticResource/new/xiangyoujiantou.png?pfdrid_c=true'
								mode='aspectFill' @click='addMonth'></image>
						</view> -->

						<view class='month'>
							<view class='week'>
								<block v-for='item in weeks' :key='item'>
									<view class='temp'>{{item}}</view>
								</block>
							</view>
							<scroll-view class="scroll-view_H" scroll-x="true" scroll-with-animation
								@touchstart="touchStart" @touchend="touchEnd">
								<view class='days'>
									<block v-for='(item,index) in daysList' :key='index'>
										<view class='temp day' @click="clicksign(item,index)" :id="item.day">
											<view class='dayOn'
												:class="{othe: !item.start,select: currentsty == index,usersign: item.yes}">
												<view class="monthshow" v-if="index == 0 || item.show">{{item.class}}月
												</view>
												<view class="">
													{{item.day.split('/')[2]}}
												</view>
											</view>
										</view>
									</block>
								</view>
							</scroll-view>
						</view>
					</view>
				</view>
				<view class="numberDays">
					已累计签到<text>{{currentsign.signCount == null ? 0 : currentsign.signCount}}</text>天
				</view>
				<!-- <view class="signBtn" @click="fillsignin">
					补签
				</view> -->
				<view class="signBtn">
					已签到
				</view>
				<view class="opportunity">
					<!-- 还剩<text>{{currentsign.repairCount}}</text>次补签机会 -->
				</view>
			</view>
			<view class="signtext">
				<view class="rules">
					<text></text>
					签到规则
					<text></text>
				</view>
				<view class="rulesItem">
					<view class="">
						1、每日签到一次，30天内签到{{currentsign.config.signDay ? currentsign.config.signDay : 25}}天后自动激活一张礼券福袋
					</view>
					<!-- <view class="">
						2、若签到中断，则可补签（限3次）
					</view>
					<view class="">
						3、补签时限为最近30天
					</view> -->
				</view>
			</view>
		</view>
		<view class="notgiftbag" v-else>
			<image class="notImage" src="../../../static/img/nothavegift.png" mode=""></image>
			<view class="notText">
				还没有礼券福袋~
			</view>
			<view class="notbutton" @click="buggiftbag">
				去购买
			</view>
		</view>
	</view>
</template>
<script>
	const initDate = () => {
		const date = new Date();
		const years = [];
		const months = [];
		const days = [];
		const value = [];
		const daysList = [];

		for (let i = 1990; i <= 2500; i++) {
			years.push(i);
		}

		for (let i = 1; i <= 12; i++) {
			months.push(i);
		}

		days.push(...changeDays(date.getFullYear(), date.getMonth() + 1).days);
		daysList.push(...changeDays(date.getFullYear(), date.getMonth() + 1).daysList);

		value[0] = date.getFullYear() - 1990;
		value[1] = date.getMonth();
		value[2] = date.getDate() - 1;

		return {
			years,
			months,
			days,
			daysList,
			value
		}
	};
	//是否是闰年
	let isleap = (year) => {
		return (year % 100 == 0 ? (year % 400 == 0 ? 1 : 0) : (year % 4 == 0 ? 1 : 0));
	};
	let formatDay = (day, type, year) => { //日期数据的格式化
		// return {
		// 	day: day,
		// 	type: type,
		// 	year: year
		// }
		let MONTHS = type
		if (MONTHS == 0) MONTHS = '十二'
		if (MONTHS == 1) MONTHS = '一'
		if (MONTHS == 2) MONTHS = '二'
		if (MONTHS == 3) MONTHS = '三'
		if (MONTHS == 4) MONTHS = '四'
		if (MONTHS == 5) MONTHS = '五'
		if (MONTHS == 6) MONTHS = '六'
		if (MONTHS == 7) MONTHS = '七'
		if (MONTHS == 8) MONTHS = '八'
		if (MONTHS == 9) MONTHS = '九'
		if (MONTHS == 10) MONTHS = '十'
		if (MONTHS == 11) MONTHS = '十一'
		if (MONTHS == 12) MONTHS = '十二'
		return {
			day: year + '/' + type + '/' + day,
			start: false,
			yes: false,
			class: MONTHS
		}
	};
	const monthDays = (year, month) => {
		let days_count = new Date(year, month, 0).getDate() //月总天数 如:31
		let days = []; //存放月的天数
		for (let i = 1; i <= days_count; i++)
			days.push(i)
		return days;
	};
	/**
	 * 修改天数
	 * @param {Number} month 月份
	 */
	const changeDays = (year, month) => {
		const days = [];
		const daysList = [];
		let leng = 31;
		switch (month) {
			case 1:
			case 3:
			case 5:
			case 7:
			case 8:
			case 10:
			case 12:
				leng = 31;
				break;
			case 4:
			case 6:
			case 9:
			case 11:
				leng = 30;
				break;
			case 2:
				leng = 28 + isleap(year);

				break;
		}
		for (let i = 1; i <= leng; i++) {
			// days.push({day: i,type: month, year});
			let MONTHS = month
			if (MONTHS == 0) MONTHS = '十二'
			if (MONTHS == 1) MONTHS = '一'
			if (MONTHS == 2) MONTHS = '二'
			if (MONTHS == 3) MONTHS = '三'
			if (MONTHS == 4) MONTHS = '四'
			if (MONTHS == 5) MONTHS = '五'
			if (MONTHS == 6) MONTHS = '六'
			if (MONTHS == 7) MONTHS = '七'
			if (MONTHS == 8) MONTHS = '八'
			if (MONTHS == 9) MONTHS = '九'
			if (MONTHS == 10) MONTHS = '十'
			if (MONTHS == 11) MONTHS = '十一'
			if (MONTHS == 12) MONTHS = '十二'
			days.push({
				day: year + '/' + month + '/' + i,
				class: MONTHS,
				start: false,
				yes: false,
				show: i == 1 ? true : false
			});
		}
		let nweek = new Date(year, month - 1, 1).getDay(); //获取当月第一天是星期几
		let currFirstWeek = new Date(year, month - 1, 1).getDay(); //这个月的1号是星期几  -1是因从0开始 
		let lastMonthDays = monthDays(year, month - 1) //上个月
		for (let i = 0; i < nweek; i++) {
			daysList.unshift(formatDay(lastMonthDays.pop(), month - 1, year));
		}
		daysList.push(...days);
		nextMonth(get_last_date_week(new Date(year, month - 1)), daysList, month + 1, year)
		return {
			days,
			daysList
		};
	};
	// 判断最后一天是周几, 后面加几天
	const nextMonth = (nextDays, daysList, month, year) => {
		switch (nextDays) {
			case 0:
				// 周天  + 6天
				for (let i = 0; i < 6; i++) {
					daysList.push(formatDay(i + 1, month, year));
				}
				break;
			case 1:
				// 周一  + 5天
				for (let i = 0; i < 5; i++) {
					daysList.push(formatDay(i + 1, month, year));
				}
				break;
			case 2:
				// 周二  + 4天
				for (let i = 0; i < 4; i++) {
					daysList.push(formatDay(i + 1, month, year));
				}
				break;
			case 3:
				// 周三  + 3天
				for (let i = 0; i < 3; i++) {
					daysList.push(formatDay(i + 1, month, year));
				}
				break;
			case 4:
				// 周四  + 2天
				for (let i = 0; i < 2; i++) {
					daysList.push(formatDay(i + 1, month, year));
				}
				break;
			case 5:
				// 周五  + 1天
				for (let i = 0; i < 1; i++) {
					daysList.push(formatDay(i + 1, month, year));
				}
				break;
			case 6:
				// 周六  + 0天
				break;
		}
	}
	// 返回当前月最后一天是周几
	const get_last_date_week = (oDate) => {
		oDate.setMonth(oDate.getMonth());
		oDate.setMonth(oDate.getMonth() + 1);
		oDate.setDate(1);
		oDate.setMonth(oDate.getMonth());
		oDate.setDate(0);
		return oDate.getDay();
	};
	export default {
		data() {
			return {
				startPageX: 0,
				isloading: 1,
				weeks: ['日', '一', '二', '三', '四', '五', '六'],
				days: initDate().days,
				daysList: initDate().daysList,
				years: initDate().years,
				months: initDate().months,
				value: initDate().value,
				showType: false, //是否显示下面的事件选择器
				currentsign: {},
				// 当前选择的补签时间
				currentTime: '',
				currentsty: null,
				Leakagesigndays: 0,
				ishavegift: false,
			}
		},
		onLoad(options) {
			uni.showLoading({
				mask: true,
				title: "加载中..."
			})
			this.getuserCurrentGift()
			this.getOmitCount()
			// this.initCurrMonthData()
		},
		methods: {
			// 返回当前时间所属的礼包卷
			getuserCurrentGift() {
				// this.currentsign = {}
				this.$http.userCurrentGift().then(res => {
					setTimeout(() => {
						uni.hideLoading()
					})
					if (res.code == 200) {
						this.isloading = 0
						this.ishavegift = true
						this.currentsign = res.data
						this.currentsign.giftValidityEnd = this.format(this.currentsign.giftValidityEnd)
						if (this.currentsign.isActivate == 1) {
							this.$queue.showToast("当前福袋已激活")
						}
						let dateList = this.currentsign.signDate == null ? [] : this.currentsign.signDate.split(
							",")
						let fillsignList = this.currentsign.signDateRepair == null ? [] : this.currentsign
							.signDateRepair.split(
								",")

						this.daysList.map((its, ind) => {
							// 礼包开始签到时间是否小于日历表的时间   2021/6/1 <  2021/6/23  遍历时间不能超过
							if (this.currentsign.giftValidityStart <= new Date(its.day).getTime() &&
								new Date(its
									.day).getTime() < new Date().getTime()) {
								// start 为漏签状态
								its.start = true
							}
							dateList.map(item => {
								if (item != "") {
									if (new Date(item).getTime() == new Date(its.day).getTime()) {
										its.yes = true
									}
								}
							})
							fillsignList.map(item => {
								if (item != "") {
									if (new Date(item).getTime() == new Date(its.day).getTime()) {
										its.yes = true
									}
								}
							})
						})
					} else {
						this.isloading = 0
						this.ishavegift = false
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
			// 跳转购买
			buggiftbag() {
				uni.navigateTo({
					url: '../../giftbag/topup/topup'
				})
			},
			// 点击日期签到
			clicksign(item, index) {
				return
				if (item.start) {
					if (!item.yes) {
						this.currentsty = index
						this.currentTime = new Date(item.day).getTime()
						// return this.$queue.showToast("请选择正确的时间补签")
					} else {
						this.currentsty = null
						this.currentTime = ''
						this.$queue.showToast("当前时间已签到")
					}
				}
			},
			// 获取当天 0 点时间戳
			fun10() {
				let today = new Date();
				return today.getTime() - today.getHours() * 60 * 60 * 1000 - today.getMinutes() * 60 * 1000 - today
					.getSeconds() * 1000 - today.getMilliseconds();
			},
			// 补签按钮
			fillsignin() {
				if (this.currentTime == '') {
					return this.$queue.showToast("请选择补签时间")
				}
				if (this.currentTime == this.fun10()) {
					return this.$queue.showToast("当天时间不可补签")
				}
				this.$http.repairSign({
					repaiTime: this.currentTime
				}).then(res => {
					if (res.code == 200) {
						uni.showToast({
							title: '补签成功',
							icon: 'succes'
						});
						this.currentsty = null
						this.currentTime = ''
						this.getOmitCount()
						this.getuserCurrentGift()
					} else {
						this.currentsty = null
						this.$queue.showToast(res.message)
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
			/**
			 * 滑动更改
			 */
			touchStart(e) {
				this.startPageX = e.changedTouches[0].pageX;
			},
			touchEnd(e) {
				const moveX = e.changedTouches[0].pageX - this.startPageX;
				if (Math.abs(moveX) >= 100) {
					if (moveX > 0) {
						this.subMonth()
					} else {
						this.addMonth()
					}
				}
			},
			bindChange: function(e) {
				const value = e.detail.value;
				const changes = changeDays(this.years[value[0]], this.months[value[1]]);
				this.value = value
				this.days = changes.days
				this.daysList = changes.daysList
			},
			/**
			 * 减月份
			 */
			subMonth: function(e) {
				uni.showLoading({
					mask: true,
					title: "加载中..."
				})
				if (this.months[this.value[1]] == 1) {
					if (this.years[this.value[0]] == 1990) return;
					this.value[0] = this.value[0] - 1;
					this.value[1] = 11;
				} else {
					this.value[1] = this.value[1] - 1;
				}
				const changes = changeDays(this.years[this.value[0]], this.months[this.value[1]]);
				this.value = [this.value[0], this.value[1], this.value[2]]
				this.days = changes.days
				this.daysList = changes.daysList
				this.getuserCurrentGift()
			},
			/**
			 * 加月份
			 */
			addMonth: function(e) {
				uni.showLoading({
					mask: true,
					title: "加载中..."
				})
				if (this.months[this.value[1]] == 12) {
					if (this.years[this.value[0]] == 2500) return;
					this.value[0] = this.value[0] + 1;
					this.value[1] = 0;
				} else {
					this.value[1] = this.value[1] + 1;
				}
				const changes = changeDays(this.years[this.value[0]], this.months[this.value[1]]);
				this.value = [this.value[0], this.value[1], this.value[2]]
				this.days = changes.days
				this.daysList = changes.daysList
				this.getuserCurrentGift()
			},

		}

	}
</script>
<style lang="scss" scoped>
	.calendar {
		margin-top: 10%;
	}

	.month {
		display: flex;
		flex-flow: row wrap;
		font-size: 1.1rem;
	}

	.item {
		width: 14.28%;
		text-align: center;
		line-height: 3rem;
	}

	.othe {
		color: grey
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

	.date {
		background-color: #fff;
		border-top: 2upx solid #f7f7f7;

		.dateHead {
			margin: 0upx 28upx;
			border-bottom: 2upx solid #f7f7f7;
			display: flex;
			justify-content: space-between;

			.selectDate {
				margin: 28upx 0upx 24upx;
				font-size: 28upx;
				font-weight: 300;
				color: #333333;
			}

			.recently {
				margin: 30upx 0upx 26upx;
				font-size: 26upx;
				font-weight: 300;
				color: #333333;
			}
		}

		.dateList {



			.body {
				width: 750rpx;
				display: flex;
				justify-content: center;
				flex-direction: column;
				align-items: center;
			}

			// .body .time {
			// 	width: 650rpx;
			// 	height: 100rpx;
			// 	padding: 35rpx 50rpx;
			// 	background-color: #fff;
			// 	display: flex;
			// 	justify-content: space-between;
			// 	align-items: center;
			// 	border-radius: 10rpx;

			// 	.img {
			// 		width: 16rpx;
			// 		height: 28rpx;
			// 	}

			// 	.rotate {
			// 		transform: rotate(180deg);
			// 	}
			// }

			// .body .img {
			// 	width: 16rpx;
			// 	height: 28rpx;
			// }

			// .body .rotate {
			// 	transform: rotate(180deg);
			// }

			.body .text {
				font-size: 38rpx;
				line-height: 40rpx;
			}

			.month {
				// width: 627rpx;
				margin: 28upx 32rpx 60upx;
			}

			.week {
				width: 100%;
				display: flex;
			}

			.days {
				width: 100%;
				display: flex;
				flex-wrap: wrap;
			}

			.temp {
				font-size: 28upx;
				font-weight: 300;
				color: #666666;

				width: 14.28%;
				// font-size: 34rpx;
				// color: rgba(51, 51, 51, 1);
				// line-height: 36rpx;
				display: flex;
				justify-content: center;
			}

			.days .day {
				margin-top: 16rpx;
			}

			.days {
				position: relative;

				.time {
					position: absolute;
					background-color: #fff;
					border-radius: 10rpx;

					.img {
						top: 280rpx;
						right: -654upx;
						width: 16rpx;
						height: 28rpx;
					}

					.rotate {
						top: 280rpx;
						right: 0upx;
						transform: rotate(180deg);
					}
				}
			}

			.days .dayOn {
				width: 80rpx;
				height: 80rpx;
				color: #333333;
				background-color: #F2F2F2;
				font-size: 30upx;
				display: flex;
				justify-content: center;
				align-items: center;
				border-radius: 50%;
				position: relative;
			}

			.monthshow {
				position: absolute;
				top: 4upx;
				font-size: 16upx;
				font-weight: 300;
				// color: #333333;
			}

			.days .othe {
				width: 80rpx;
				height: 80rpx;
				font-size: 30upx;
				font-weight: 300;
				color: #C1C1C1;
				background-color: #fff;
				// font-size: 34rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				border-radius: 50%;
			}

			.days .usersign {
				width: 80rpx;
				height: 80rpx;
				font-size: 30upx;
				font-weight: 300;
				color: #FFFFFF;
				background-color: #EB6133;
				// font-size: 34rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				border-radius: 50%;
			}

			.days .select {
				width: 80rpx;
				height: 80rpx;
				font-size: 30upx;
				font-weight: 300;
				color: #FFFFFF;
				background-color: #39B54A;
				// font-size: 34rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				border-radius: 50%;
			}

			.picker-father {
				height: 500rpx;
				position: fixed;
				bottom: 0;
				background-color: #fff;
			}

			.picker-father .top {
				width: 750rpx;
				height: 100rpx;
				padding: 0 30rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				border-bottom: 1rpx solid #f4f4f4;
			}

			.picker {
				width: 750rpx;
				height: 400rpx;
			}

			.picker .item {
				display: flex;
				justify-content: center;
				align-items: center;
			}

			.mengban {
				height: 100vh;
				width: 100vw;
				// background-color: #00000024;
				position: fixed;
				top: 0;
			}




		}

		.numberDays {
			text-align: center;
			font-size: 32upx;
			font-weight: 500;
			color: #333333;

			text {
				color: #eb6133;
				padding: 0 10upx;
			}
		}

		.signBtn {
			margin: 24upx auto;
			text-align: center;
			width: 630upx;
			height: 80upx;
			line-height: 80upx;
			// color: #FFFFFF;
			// background: linear-gradient(180deg, #F1722C 0%, #EB6133 100%);
			color: #333333;
			background: #F2F2F2;
			opacity: 1;
			border-radius: 36upx;
			font-size: 30upx;
			font-weight: 300;
		}

		.opportunity {
			text-align: center;
			padding-bottom: 40upx;
			font-size: 26upx;
			font-weight: 300;
			color: #666666;

			text {
				color: #eb6133;
				padding: 0 10upx;
			}
		}
	}

	.signtext {
		.rules {
			margin: 40upx 0upx;
			text-align: center;
			font-size: 32upx;
			font-weight: 300;
			color: #666666;

			text {
				display: inline-block;
				margin: 0upx 20upx;
				margin-bottom: 12upx;
				box-sizing: border-box;
				width: 48upx;
				background: #C1C1C1;
				border-bottom: 2upx solid #C1C1C1;
			}
		}

		.rulesItem {
			margin: 0upx 42upx 0upx 32upx;
			font-size: 26upx;
			font-weight: 300;
			color: #666666;

			view {
				margin: 16upx 0upx;
			}
		}
	}
</style>
