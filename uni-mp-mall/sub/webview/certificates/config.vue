<template>
	<view class="">
		<view style="border-bottom: 2rpx solid #EEE;">
			<view class="config">礼券配置</view>
			<button class="add" @click="handlerAddLimit">
				新增
			</button>
		</view>
		<view class="conf-cont-tips">
			<view class="conf_spec"> 配置说明： </view>
			<view class="explain">
				<view>1.支付金额在区间内才会赠送礼券；</view>
				<view>2.比例配制为"0"则表示不赠送礼券;</view>
				<view>3.区间为前闭后开区间(例如100-200区间包含100但不包含200)。</view>
			</view>
		</view>
		<view class="" style="margin-bottom: 160rpx;">
			<view class="table" v-for="(v,i) in confList" :key='i'>
				<view class="interval">
					<view class="qujian">
						区间(元)
					</view>
					<input type="number" v-model.number="v.min" onkeyup="value = value.replace(/[^\d.]/g,'')"
						:disabled="v.minDisabled" :class="{active: v.minDisabled}" />
					<view class="fenge">
						—
					</view>
					<input type="number" v-model.number="v.max" onkeyup="value = value.replace(/[^\d.]/g,'')"
						:disabled="v.maxDisabled" :class="{active: v.maxDisabled}" />
				</view>
				<view class="proportion">
					<view class="bili">
						比例
					</view>
					<input type="digit" onkeyup="value = value.replace(/[^\d.]/g,'')" v-model="v.rate" />
					<view class="delete cuIcon-delete" v-if="i != 0 && i + 1 == confList.length"
						@click="handlerDelLimit(i)"></view>
				</view>
			</view>
		</view>
		<button @click="submit" class="conf-cont-btn" type="info">保存</button>
	</view>
</template>

<script>
	const limitObj = {
		min: null,
		minDisabled: true,
		max: null,
		maxDisabled: false,
		rate: null
	}
	export default {
		data() {
			return {
				storeId: '',
				confList: []
			};
		},
		onLoad(options) {
			this.storeId = options.storeId
			this.getIntegralConfig(this.storeId)
		},
		methods: {
			// 获取店铺礼券比例
			getIntegralConfig(id) {
				uni.showLoading({
					title: '加载中'
				});
				this.$http.getIntegralConfig({
					storeId: id
				}).then(res => {
					uni.hideLoading()
					if (res.code == 200) {
						let list = res.data.rangeList
						if (list) {
							for (let index = 0; index < list.length; index++) {
								const preData = list[index - 1]
								const sufData = list[index]
								let _limit = _.assign({}, limitObj)
								_limit.rate = sufData.rate
								_limit.maxDisabled = true
								// 第一个
								if (!preData) {
									_limit.min = 0
									_limit.max = sufData.limit
								} else {
									// 数组中间
									_limit.min = preData.limit
									_limit.max = sufData.limit
								}
								// 最后一个
								if (index === list.length - 1) {
									_limit.maxDisabled = false
								}
								this.confList.push(_limit)
							}
						} else {
							let _limit = _.assign({}, limitObj)
							_limit.min = 0
							_limit.max = 10
							_limit.rate = 0.25
							this.confList.push(_limit)
						}
					}
				})
			},
			// 保存 更新比例
			submit() {
				let list = _.cloneDeep(this.confList)
				let conf = _.last(list)
				if (conf.min == null || conf.max == null) {
					return this.$queue.showToast('请填写区间值')
				}
				if (conf.min >= conf.max) {
					return this.$queue.showToast('区间最小值不能大于最大值')
				}
				if (conf.rate == null) {
					return this.$queue.showToast('比例不能为空')
				}

				let isSucc = true;
				let discount = []
				_.map(list, (v) => {
					discount.push({
						limit: v.max,
						rate: v.rate,
						// storeMaxMonth: 1000,
						// storeGainCouponsMax: 200,
						// plantCouponsMax: 200,
					})
					if (v.rate > 1) {
						isSucc = false;
					}
				})
				// discount: JSON.stringify(discount),
				// storesId: this.token.stores_id
				if (!isSucc) {
					return this.$queue.showToast('比例不能大于1');
				}
				this.$http.editIntegralConfig({
					rangeList: discount,
					storeId: this.storeId
				}).then(res => {
					if (res.code == 200) {
						uni.showToast({
							title: '配置成功',
						})
						uni.navigateBack({
							delta: 1
						})
					} else {
						uni.showToast({
							title: '配置失败',
						})
					}
				})
			},
			/** 新增按钮操作 */
			handlerAddLimit() {
				let list = _.cloneDeep(this.confList)
				let conf = _.last(list)
				if (conf.min == null || conf.max == null) {
					return this.$queue.showToast('请填写区间值')
				}
				if (conf.min >= conf.max) {
					return this.$queue.showToast('区间最小值不能大于最大值')
				}
				if (conf.rate == null) {
					return this.$queue.showToast('比例不能为空')
				}
				if (conf.rate > 1) {
					return this.$queue.showToast('比例不能大于1')
				}
				conf.minDisabled = conf.maxDisabled = true
				let _limit = _.assign({}, limitObj)
				_limit.min = conf.max
				_limit.minDisabled = true
				list.push(_limit)
				this.$set(this, 'confList', list)
			},
			/** 删除按钮操作 */
			handlerDelLimit(index) {
				let list = _.cloneDeep(this.confList)
				// 删除最后一个元素
				_.remove(list, (v, i) => i === index)
				// 获取移除后的list最后一个元素，修改为可编辑状态
				let limit = _.last(list)
				limit.maxDisabled = false
				this.$set(this, 'confList', list)
			},
		}
	};
</script>

<style lang="scss">
	.config {
		font-size: 32rpx;
		text-align: center;
		margin-top: 16rpx;
		margin-bottom: 36rpx;
	}

	.add {
		font-size: 24rpx;
		color: #eb6132;
		float: right;
		margin: -82rpx 20rpx 0rpx 0rpx;
	}

	.conf-cont-tips {
		font-size: 26rpx;
		color: #eb6132;
		padding-bottom: 16rpx;
		border-bottom: 4rpx solid #EEE;

		.conf_spec {
			margin-left: 24rpx;
		}

		.explain {
			margin-left: 148rpx;
		}
	}

	.table {
		margin-top: 40rpx;
		margin-left: 24rpx;
		border-bottom: 2rpx solid #EEE;

		.interval {
			display: flex;
			flex-wrap: wrap;
			width: 100%;
			height: 52rpx;
			line-height: 52rpx;
			margin-bottom: 30rpx;

			.qujian {
				margin-right: 40rpx;
				text-align: center;
			}

			.active {
				background: #f2f2f2;
			}

			input {
				width: 200rpx;
				height: 64rpx;
				background: #eaeaea;
				color: #333;
				border-radius: 126rpx;
				text-align: center;
				font-size: 28rpx;
				;
			}

			.fenge {
				text-align: center;
				margin: 0 6rpx;
			}
		}

		.proportion {
			display: flex;
			flex-wrap: wrap;
			width: 100%;
			height: 52rpx;
			line-height: 52rpx;
			margin-bottom: 30rpx;

			.bili {
				margin-right: 86rpx;
				text-align: center;
			}

			input {
				width: 200rpx;
				height: 64rpx;
				background: #eaeaea;
				color: #333;
				border-radius: 126rpx;
				text-align: center;
				font-size: 28rpx;
			}

			.delete {
				margin-left: 270rpx;
			}
		}
	}

	.conf-cont-btn {
		position: fixed;
		width: 536rpx;
		bottom: 28rpx;
		left: 50%;
		border-radius: 50rpx;
		color: #FFFFFF;
		background-color: #EB6132;
		transform: translateX(-50%);
	}
</style>
