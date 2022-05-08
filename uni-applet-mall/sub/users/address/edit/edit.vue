<template>
	<view>
		<view class="cu-form-group">
			<view class="title">收件人</view>
			<input placeholder="请输入收件人姓名" placeholder-style="color: #aaa" type="text" v-model="userName" />
		</view>

		<view class="cu-form-group">
			<view class="title">电话号码</view>
			<input placeholder="请输入收件人电话号码" placeholder-style="color: #aaa" type="text" v-model="phone" />
		</view>

		<view class="cu-form-group">
			<view class="title">所在地区</view>
			<picker mode="region" @change="handleRegionChange" :value="region">
				<view class="picker text-left">
					<text v-if="region.length > 0">
						{{region[0]}} {{region[1]}} {{region[2]}}
					</text>
					<text class="text-gray" v-if="region.length == 0">点击选择省市区</text>
				</view>
			</picker>
		</view>

		<view class="cu-form-group">
			<textarea maxlength="80" :disabled="modalName!=null" v-model="detailed" placeholder="请输入详细地址" placeholder-style="color: #aaa"></textarea>
		</view>

		<view class="cu-form-group">
			<view class="title">设置默认地址</view>
			<switch class="orange" color="#46A454" :checked="isDefault" @change="isDefaultChange" />
		</view>

		<view class="cu-form-group margin-top-sm" v-if="editType == 'edit'" @tap="handleDel">
			<view class="del">删除收货地址</view>
		</view>

		<view class="save" @tap="handleSave">
			<view class="btn">保存地址</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				editType: 'edit',
				id: '',
				userName: '',
				phone: '',
				detailed: '',
				isDefault: false,
				region: []
			};
		},
		methods: {
			/* 地区选择 */
			handleRegionChange(e) {
				this.region = e.detail.value;
			},
			/* 保存地址方法 */
			async saveAddress(address) {
				let result = null;
				if (this.editType == 'edit') {
					// 修改收货地址
					result = await this.$http.updateAddress(address);
				} else {
					// 添加收货地址
					result = await this.$http.addAddress(address);
				}
				uni.hideLoading();
				this.$queue.showToast(result.message);
				if (result.success) {
					setTimeout(() => {
						uni.navigateBack();
					}, 500);
				}
			},
			/* 删除地址方法*/
			async deleteAddress() {
				const result = await this.$http.deleteAddress({
					workId: this.id
				});
				this.$queue.showToast(result.message);
				if (result.success) {
					setTimeout(() => {
						uni.navigateBack();
					}, 500);
				}
			},
			/* 获取地址详情方法 */
			async getAddressInfo(addressId) {
				const result = await this.$http.getAddressInfo({
					workId: addressId
				});
				if (!result.success) {
					return this.$queue.showToast(result.message);
				}
				let addrArr = _.split(result.data.address, "-");
				this.userName = result.data.userName;
				this.phone = result.data.phone;
				this.detailed = addrArr[3];
				this.isDefault = !!result.data.status;
				this.region = [addrArr[0], addrArr[1], addrArr[2]]
			},
			/* 默认收货地址操作 */
			isDefaultChange(e) {
				this.isDefault = e.detail.value;
			},
			/* 删除收货地址操作 */
			handleDel() {
				uni.showModal({
					title: '删除提示',
					content: '您是否要删除该收货地址?',
					success: res => {
						if (res.confirm) {
							this.deleteAddress();
						}
					}
				});
			},
			/* 保存收货地址操作 */
			handleSave() {
				let data = {
					userName: this.userName,
					phone: this.phone,
					address: _.join(this.region, "-") + "-" + this.detailed,
					status: this.isDefault ? 1 : 0
				};
				if (this.editType == 'edit') {
					data.id = this.id;
				}
				if (!data.userName) {
					return this.$queue.showToast("请输入收件人姓名");
				}
				if (!data.phone) {
					return this.$queue.showToast("请输入收件人电话号码");
				}
				if (!this.detailed) {
					return this.$queue.showToast("请输入收件人详细地址");
				}
				if (this.region.length == 0) {
					return this.$queue.showToast("请选择收件地址");
				}
				var reg_tel = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
				if (!reg_tel.test(data.phone)) {
					return this.$queue.showToast("请正确填写您的手机号码！");
				}
				this.$queue.showLoading("提交中...")
				this.saveAddress(data);
			}
		},
		onLoad(e) {
			//获取传递过来的参数
			this.editType = e.type;
			if (e.type == 'edit') {
				this.id = e.id;
				this.getAddressInfo(e.id);
			}
		}
	};
</script>
<style lang="scss" scoped>
	.cu-form-group .title {
		min-width: calc(4em + 15px);
	}

	.cu-form-group .text-left {
		text-align: left;
	}

	.del {
		width: 100%;
		height: 80upx;
		line-height: 80upx;
		text-align: center;
		font-size: 30upx;
		color: $uni-color-main
	}

	.save {
		view {
			display: flex;
		}

		position: fixed;
		bottom: 0;
		width: 100%;
		height: 120upx;
		display: flex;
		justify-content: center;
		align-items: center;

		.btn {
			box-shadow: 0upx 5upx 10upx rgba(0, 0, 0, 0.4);
			width: 70%;
			height: 80upx;
			border-radius: 80upx;
			background: $uni-bg-color-main;
			color: #fff;
			justify-content: center;
			align-items: center;

			.icon {
				height: 80upx;
				color: #fff;
				font-size: 30upx;
				justify-content: center;
				align-items: center;
			}

			font-size: 30upx;
		}
	}
</style>
