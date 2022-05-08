<template>
	<view class="list">
		<view class="row">
			<view class="title"><text>手机号</text></view>
			<view class="right">
				<view class="rightinp">
					<input v-model="reisterForm.phone" value=""
						placeholder="请输入手机号" />
				</view>
			</view>
		</view>
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
					<input type="password" v-model="reisterForm.password" value=""
						placeholder="请输入新密码" />
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
					phone: '',
					code: '',
					password: '',
					phone: '',
					signNo: '',
				}
			};
		},
		onLoad() {
			// this.reisterForm.phone = this.$queue.getData("phone")
		},
		methods: {
			// * 发送短信验证码
			sendCodeMsg() {
				if (!/^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[189]))\d{8}$/.test(this.reisterForm.phone)) {
					this.$queue.showToast('请填写正确的手机号');
					return
				}
				if (this.isEnable) {
					this.isEnable = false;
					let sendTime = 90;
					this.$http.signNoByType({
						mobile: this.reisterForm.phone,
						type: this.$queue.signNoByType('修改密码')
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
			// 确定
			forgetPwd() {
				if (this.reisterForm.phone == '') {
					this.$queue.showToast('手机号不能为空');
					return
				}
				if (!/^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[189]))\d{8}$/.test(this.reisterForm.phone)) {
					this.$queue.showToast('请填写正确的手机号');
					return
				}
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
				this.$http.updatePassword(this.reisterForm).then(res => {
					if (res.code == 200) {
						this.$queue.showToast('修改成功');
						setTimeout(() => {
							this.reisterForm = {
								phone: '',
								code: '',
								password: '',
								phone: '',
								signNo: '',
							}
							uni.navigateBack({
								delta: 1
							})
						}, 300);
					} else {
						this.$queue.showToast(res.message);
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
