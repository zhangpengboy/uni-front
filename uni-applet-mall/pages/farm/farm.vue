<template>
	<view class="farm">
		<!-- 阳光 -->
		<view class="farm-sum"></view>
		<!-- 白云1-->
		<view class="farm-cloud1"></view>
		<!-- 白云2 -->
		<view class="farm-cloud2"></view>

		<!-- 左边护栏+牛 -->
		<view class="farm-rail"></view>
		<view class="farm-cow" :animation="animationData"></view>

		<!-- 右边导航 -->
		<view class="farm-right">
			<!-- 我的资产 -->
			<view class="assets">
				<view class="avatar">
					<open-data type="userAvatarUrl"></open-data>
				</view>
				<view class="">
					<text class="text-xxl">{{gralAmount.freeAmount || 0}}</text>
					<text>颗玉米</text>
				</view>
			</view>
			<!-- 市场 -->
			<view class="market" @tap="jumpPage('/sub/farm/market/market')">
				<view class="icon"></view>
				<view class="comtext">市场</view>
			</view>
			<!-- 好友 -->
			<view class="friend" @tap="jumpPage('/sub/farm/friends/friends')">
				<view class="icon"></view>
				<view class="comtext">好友</view>
			</view>
			<!-- 签到 -->
			<view class="sign" @tap="showSign=true">
				<view class="icon"></view>
				<view class="comtext">签到</view>
			</view>
		</view>

		<!-- 玉米树容器 -->
		<view class="vatree" v-if="cornData">
			<!-- 成熟玉米 -->
			<view class="vatree-corn" v-show="cornData.status == 4" @tap="pickCorn()">
				<view class="hand"></view>
				<view class="number">可收取{{cornData.remainAmount}}颗</view>
			</view>
			<!-- 树 -->
			<view class="vatree-body"
				:style="{ 'background-image': `url(${$queue.publicCdnHost()}/assets/game/tree-${cornData.status || 0}.png)`}">
			</view>
			<!-- 按钮和进度条  -->
			<view class="vatree-footer">
				<!-- 幼苗、发芽、开发、结果 -->
				<block v-if="cornData.status < 4">
					<!-- 进度条 -->
					<view class="progress cu-progress round striped">
						<view class="bging" :style="{width: cornData.cornProgress +'%'}"></view>
					</view>
					<!-- 文字提示 -->
					<view class="tips">
						玉米再浇水{{cornData.needWater}}g就{{cornData.status+1 | filterCornStatus }}啦
					</view>
				</block>
				<!-- 成熟 -->
				<block v-else-if="cornData.status == 4">
					<view class="tips margin-top">玉米成熟啦，赶紧收获吧~</view>
				</block>
				<!-- 完成 -->
				<block v-else-if="cornData.status == 5">
					<view class="tips padding-top-xs">
						<view class="padding-bottom-sm">玉米收获满满,再种植一株吧</view>
						<view class="cu-btn round sm tips-btn" @tap="createPlantCorn()">确定</view>
					</view>
				</block>
				<!-- 枯死 -->
				<block v-else-if="cornData.status == 6">
					<view class="tips padding-top-xs">
						<view class="padding-bottom-sm">玉米枯死了，请重新栽种吧~</view>
						<view class="cu-btn round sm tips-btn" @tap="createPlantCorn()">确定</view>
					</view>
				</block>
			</view>

		</view>

		<!-- 水壶浇水动画 -->
		<view class="vatree-kettle" :animation="kettleAni"></view>
		<!-- 水滴动画 -->
		<view class="vatree-water" :animation="waterAni"></view>

		<!-- 浇水 -->
		<view class="water" @tap="cornWaterEnergy()">
			<view class="tips">浇水{{waterCount>999 ? '999': waterCount}}次</view>
			<view class="icon"></view>
			<view class="comtext">{{myEnergy}}g</view>
		</view>


		<!-- 签到 -->
		<view class="sign-model cu-modal bottom-modal" :class="showSign?'show':''">
			<view class="cu-dialog">
				<view class="cu-bar bg-white">
					<view class="action text-bold">签到</view>
					<view class="action" @tap="showSign=false"><text class="cuIcon-roundclose text-gray"></text></view>
				</view>
				<view class="padding flex justify-between align-center">
					<view class="flex flex-sub align-center">
						<image class="waterimg" lazy-load="true" :src="cdnHost + '/assets/game/water.png'"></image>
						<view class="padding-sm">
							<view class="padding-bottom-sm" v-for="(item,index) in signArr" :key="index">
								每日{{item.startTime}}-{{item.endTime}}可领取{{item.energy}}g</view>
						</view>
					</view>
					<view class="cu-btn round signbtn" @tap="cornSign()">签到</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 显示签到
				showSign: false,
				// 牛动画数据
				animationData: {},
				// 动画对象
				animation: {},
				// 动画定时器
				timer: null,
				// 签到json
				signArr: [],
				// 我的能量
				myEnergy: 0,
				// 玉米树信息
				cornData: {},
				// 玉米资产
				gralAmount: {},
				// 定义每次浇水量g
				water: 20,
				// 可以浇水次数
				waterCount: 0,
				// 浇水动画
				kettleAni: {},
				// 浇水动画实例
				ketAnimation: null,
				// 水滴动画
				waterAni: {},
				// 水滴落下动画实例
				waterAnimation: null,
				// 动画是否执行完
				aniFlag: true
			};
		},
		onUnload() {
			this.animationData = {}
		},
		onLoad() {
			// 创建动画实例
			this.animation = uni.createAnimation();
		},
		computed: {
			/* CDN域名 */
			cdnHost() {
				return this.$queue.publicCdnHost();
			},
		},
		onShow() {
			// 创建动画实例
			this.ketAnimation = uni.createAnimation();
			this.waterAnimation = uni.createAnimation();
			// 判断是否登录
			if (!this.hasLogin) {
				uni.navigateTo({
					url: "/pages/login/login"
				})
			}
			// 执行牛运动
			// this.cowRuning()
			// 获取当前能量值
			this.getCornEnergy();
			// 获取玉米树
			this.getCornPlant();
			// 获取玉米资产
			this.getIntegralAmount();
		},
		methods: {
			/* 跳转页面 */
			jumpPage(uri) {
				uni.navigateTo({
					url: uri
				})
			},
			/* 牛动画 */
			cowRuning() {
				this.animation
					.translateX(-60).step({
						duration: 30000
					})
					.rotateY(180).step({
						duration: 1000
					})
					.translateX(60).step({
						duration: 30000
					})
				this.animationData = this.animation.export();

				setTimeout(() => {
					this.animation.rotateY(360).step()
						.translateX(0).step({
							duration: 30000
						})
					this.animationData = this.animation.export();
				}, 61000)

				this.timer = setInterval(() => {
					this.cowRuning();
					clearInterval(this.timer);
				}, 91000)

			},
			/* 浇水动画 */
			kettleRuning() {
				this.aniFlag = false
				this.ketAnimation.opacity(1).rotate(-60).step({
					duration: 1000
				});
				this.kettleAni = this.ketAnimation.export();
				this.waterAnimation.opacity(1).translateY(50).step({
					duration: 1500
				}).opacity(0).step();
				this.waterAni = this.waterAnimation.export()

				// 重置动画
				setTimeout(function() {
					this.ketAnimation.opacity(0).rotate(0).step();
					this.kettleAni = this.ketAnimation.export();

					this.waterAnimation.translateY(-50).step();
					this.waterAni = this.waterAnimation.export();
					this.aniFlag = true;
				}.bind(this), 2000)
			},
			/* 获取我的能量值 */
			async getCornEnergy() {
				const res = await this.$http.getCornEnergy({
					userId: this.userId
				});
				this.myEnergy = res.data.allAmount;
			},
			/* 获取种植的玉米树信息 */
			async getCornPlant() {
				const that = this;
				const res = await that.$http.getCornPlant({
					userId: that.userId
				})
				// res.data==null 未种植
				if (res.data == null) {
					uni.showModal({
						title: '提示',
						content: '当前暂无您的种植记录，现免费赠送您一颗幼苗，是否进行种植？',
						showCancel: false,
						confirmText: '立即种植',
						success(res) {
							if (res.confirm) {
								that.createPlantCorn();
							}
						},
					});
					return;
				}
				this.calcNowGrow(res.data)
			},
			/* 计算当前玉米种植信息 */
			calcNowGrow(corn) {
				this.signArr = JSON.parse(corn.config.energyJson)
				let cornGrow = JSON.parse(corn.config.cornGrow);
				// 获取当前周期
				const _nowGrow = _.find(cornGrow, v => v.status == corn.status);
				// 返回当前玉米需要的信息
				_.assign(corn, {
					// 浇水多少成长下一阶段
					needWater: _nowGrow.maxGrow - corn.cornEffect,
					// 当前玉米树进度条
					cornProgress: (corn.cornEffect / _nowGrow.maxGrow) * 100,
				})
				this.cornData = corn;
				// 浇水次数
				this.waterCount = Number.parseInt(this.myEnergy / corn.config.cornEnergy);
			},
			/* 种植玉米树 */
			async createPlantCorn() {
				const res = await this.$http.createPlantCorn({
					userId: this.userId
				});
				if (res.success) {
					uni.showToast({
						title: '种植成功!'
					});
					this.getCornPlant();
					this.getIntegralAmount();
				}
			},
			/* 获取玉米资产 */
			async getIntegralAmount() {
				const res = await this.$http.getUserGral();
				this.gralAmount = res.data;
			},
			/* 浇能量 */
			async cornWaterEnergy() {
				if (!this.aniFlag) {
					return;
				}
				const res = await this.$http.cornWaterEnergy({
					userId: this.userId,
					energy: this.water,
					bsType: "BS_1003"
				});
				if (!res.success) {
					return uni.showToast({
						title: res.message,
						icon: "none"
					});
				}
				this.kettleRuning();
				this.getCornEnergy();
				setTimeout(() => {
					this.getCornPlant();
				}, 1000)
			},
			/* 签到 */
			async cornSign() {
				const res = await this.$http.cornSign({
					userId: this.userId
				})
				if (res.success && !!res.data) {
					uni.showToast({
						title: '签到成功!',
						icon: "none"
					});
					this.showSign = false;
					return this.getCornEnergy();
				}
				uni.showToast({
					title: res.message,
					icon: "none"
				});
			},
			/* 摘玉米 */
			async pickCorn() {
				const res = await this.$http.pickCorn({
					userId: this.userId,
					pickType: 0, // 0:自己1:好友
					cornId: this.cornData.id
				});
				if (!res.success) {
					return uni.showToast({
						title: res.message,
						icon: "none"
					});
				}

				uni.showToast({
					title: "摘取成功!",
					icon: "none"
				});
				
				this.getCornPlant();
			}
		}
	}
</script>

<style lang="scss">
	@import '@/static/css/farm.scss';
</style>
