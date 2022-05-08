/**
 * Lance yi <latticeyi@gmail.com>
 * 2020年12月4日16:25:48
 * 全局filters
 */
module.exports = {
	// 返回全局积分类型 0：抵扣 1:赠送
	filterIntegralType(key) {
		if (key == 0) return "+";
		return "送";
	},
	// 支付状态类型
	filterPayStatus(status) {
		let v;
		switch (status) {
			case 1:
				v = "已完成"
				break;
			case 2:
				v = "已失败"
				break;
			default:
				v = "未支付"
				break;
		}
		return v;
	}
}
