<template>
	<view class="list">
		<view class="row">
			<view class="title"><text>验证码</text></view>
			<view class="right">
				<view class="rightinp">
					<input type="text" v-model="reisterForm.code" value="" placeholder="请输入验证码" />
				</view>
			</view>
			<button class="signBtn" :disabled="!isEnable" :class="{active: !isEnable}" @click="sendCodeMsg"
				type="default">{{msg}}</button>
		</view>
		<view class="row">
			<view class="title"><text>新登录密码</text></view>
			<view class="right">
				<view class="rightinp">
					<input type="password" @blur="passvalid" v-model="reisterForm.password" value=""
						placeholder="密码由字母+数字组成，最低6位" />
				</view>
			</view>
		</view>
		<view class="row">
			<view class="title"><text>确认登录密码</text></view>
			<view class="right">
				<view class="rightinp">
					<input type="password" v-model="reisterForm.rePassword" value="" placeholder="请再次输入登录密码" />
				</view>
			</view>
		</view>
		<view class="goout" @click="forgetPwd">
			确定
		</view>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				msg: '短信重置密码',
				mobile: '',
				isEnable: true,
				timer: null,
				reisterForm: {
					code: '',
					password: '',
					rePassword: '',
					phone: '',
					signNo: '',
				}
			};
		},
		onLoad() {
			this.reisterForm.phone = this.$queue.getData("phone")
		},
		methods: {
			// * 发送短信验证码
			sendCodeMsg() {
				if (this.isEnable) {
					this.isEnable = false;
					let sendTime = 90;
					this.$http.forgetPwdSmsSign({
						mobile: this.reisterForm.phone,
					}).then((res) => {
						this.reisterForm.signNo = res.data;
						this.$http.SmsSend({
							mobile: this.reisterForm.phone,
							signNo: this.reisterForm.signNo,
						}).then((res) => {
							this.timer = setInterval(() => {
								sendTime--;
								this.msg = sendTime + "s重新获取";
								if (sendTime <= 0) {
									this.msg = "短信重置密码";
									this.isEnable = true;
									clearInterval(this.timer);
								}
							}, 1000);
						});
					});
				}
			},
			passvalid(value) {
				if (!/^\S*(?=\S{6,})(?=\S*\d)(?=\S*[A-Za-z!@#$%^&*?])\S*$/.test(value.detail.value)) {
					this.$queue.showToast('密码至少6位,包括至少1个大写字母或1个小写字母或1个数字或1个特殊符号');
				}
			},
			// 确定
			forgetPwd() {
				if (this.reisterForm.code == '') {
					this.$queue.showToast('验证码不能为空');
					return
				}
				if (this.reisterForm.password == '') {
					this.$queue.showToast('密码不能为空');
					return
				}
				if (!/^\S*(?=\S{6,})(?=\S*\d)(?=\S*[A-Za-z!@#$%^&*?])\S*$/.test(this.reisterForm.password)) {
					this.$queue.showToast('密码至少6位,包括至少1个大写字母或1个小写字母或1个数字或1个特殊符号');
					return
				}
				if (this.reisterForm.rePassword == '') {
					this.$queue.showToast('请再次输入密码');
					return
				}
				if (this.reisterForm.password != this.reisterForm.rePassword) {
					this.$queue.showToast('两次输入密码不一致');
					return
				}
				this.$http.editforgetPwd(this.reisterForm).then(res => {
					if (res.code == 200) {
						this.$queue.showToast('修改成功');
						setTimeout(() => {
							uni.navigateBack({
								delta: 1
							})
						}, 300);
					}
				})
			}
		}
	};
</script>
<style lang="scss">
	.active {
		background-color: #ccc !important
	}

	.list {
		margin-bottom: 20upx;

		.row {
			box-sizing: border-box;
			background-color: #fff;
			padding-left: 4%;
			width: 100;
			height: 96upx;
			line-height: 96upx;
			display: flex;
			align-items: center;
			// justify-content: space-between;
			border-bottom: solid 1upx #eee;
			position: relative;

			&:last-child {
				border-bottom: none;
			}

			.title {
				width: 236upx;
				height: 96upx;
				font-size: 28upx;

				// display: inline-block;
				// position: relative;
				text {
					// position: absolute;
					// top: 50%;
					// left: 0;
					// transform: translateX(-50%);
					// transform: translateY(-50%);
				}
			}

			.right {
				width: 60%;
				height: 90upx;

				// display: inline-block;
				// text-align: left;
				// vertical-align:middle;
				// box-sizing: border-box;
				.rightinp {
					margin-top: 20upx;
					// height: 90upx;
					// line-height: 90upx;
					box-sizing: border-box;
				}
			}

			.signBtn {
				z-index: 9999;
				position: absolute;
				right: 28upx;
				line-height: 56upx;
				background: linear-gradient(180deg, #F1722C 0%, #EB6133 100%);
				border-radius: 40upx;
				text-align: center;
				font-size: 26upx;
				font-weight: 300;
				color: #FFFFFF;
			}
		}
	}

	.goout {
		width: 524upx;
		height: 76upx;
		background: linear-gradient(180deg, #F1722C 0%, #EB6133 100%);
		border-radius: 40upx;
		font-size: 28upx;
		font-weight: 300;
		color: #FFFFFF;
		text-align: center;
		line-height: 76upx;
		margin: 60upx auto 0upx;
	}
</style>
