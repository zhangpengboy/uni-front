/**
 * 通用js方法封装处理
 * Copyright (c) 2019 Lance
 */

const baseURL = process.env.VUE_APP_BASE_API

// 日期格式化
export function parseTime(time, pattern) {
	if (arguments.length === 0 || !time) {
		return null
	}
	const format = pattern || '{y}-{m}-{d} {h}:{i}:{s}'
	let date
	if (typeof time === 'object') {
		date = time
	} else {
		if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
			time = parseInt(time)
		} else if (typeof time === 'string') {
			time = time.replace(new RegExp(/-/gm), '/');
		}
		if ((typeof time === 'number') && (time.toString().length === 10)) {
			time = time * 1000
		}
		date = new Date(time)
	}
	const formatObj = {
		y: date.getFullYear(),
		m: date.getMonth() + 1,
		d: date.getDate(),
		h: date.getHours(),
		i: date.getMinutes(),
		s: date.getSeconds(),
		a: date.getDay()
	}
	const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
		let value = formatObj[key]
		// Note: getDay() returns 0 on Sunday
		if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value] }
		if (result.length > 0 && value < 10) {
			value = '0' + value
		}
		return value || 0
	})
	return time_str
}

// 表单重置
export function resetForm(refName) {
	if (this.$refs[refName]) {
		this.$refs[refName].resetFields();
	}
}

// 添加日期范围
export function addDateRange(params, dateRange) {
	const search = _.assign({}, params);
	_.remove(search.queryConditions, o => {
		return o.field == 'gmtCreate'
	})
	if (null != dateRange && '' != dateRange) {
		let SQL_QUERY = this.Dict.SQL_QUERY;
		SQL_QUERY.field = "gmtCreate";
		SQL_QUERY.value = `${this.dateRange[0]} 00:00:00,${this.dateRange[1]} 23:59:59`;
		SQL_QUERY.operator = 'between';
		search.queryConditions.push(SQL_QUERY);
	}
	return search;
}
// export function addDateRange(params, dateRange) {
// 	var search = params;
// 	search.beginTime = "";
// 	search.endTime = "";
// 	if (null != dateRange && '' != dateRange) {
// 		search.beginTime = this.dateRange[0];
// 		search.endTime = this.dateRange[1];
// 	}
// 	return search;
// }

// 回显数据字典
export function selectDictLabel(datas, value) {
	var actions = [];
	Object.keys(datas).some((key) => {
		if (datas[key].dictValue == ('' + value)) {
			actions.push(datas[key].dictLabel);
			return true;
		}
	})
	return actions.join('');
}

// 回显数据字典（字符串数组）
export function selectDictLabels(datas, value, separator) {
	var actions = [];
	var currentSeparator = undefined === separator ? "," : separator;
	var temp = value.split(currentSeparator);
	Object.keys(value.split(currentSeparator)).some((val) => {
		Object.keys(datas).some((key) => {
			if (datas[key].dictValue == ('' + temp[val])) {
				actions.push(datas[key].dictLabel + currentSeparator);
			}
		})
	})
	return actions.join('').substring(0, actions.join('').length - 1);
}

// 通用导出下载方法
export function download(fileName, res) {
	// window.location.href = baseURL + "/common/download?fileName=" + encodeURI(fileName) + "&delete=" + true;
	if ("download" in document.createElement("a")) {
		// 非IE下载
		const blob = new Blob([res], { type: "application/ms-excel" });
		const elink = document.createElement("a");
		elink.download = fileName + '.xls';
		elink.style.display = "none";
		elink.href = URL.createObjectURL(blob);
		document.body.appendChild(elink);
		elink.click();
		URL.revokeObjectURL(elink.href); // 释放URL 对象
		document.body.removeChild(elink);
	}
}

// 字符串格式化(%s )
export function sprintf(str) {
	var args = arguments, flag = true, i = 1;
	str = str.replace(/%s/g, function () {
		var arg = args[i++];
		if (typeof arg === 'undefined') {
			flag = false;
			return '';
		}
		return arg;
	});
	return flag ? str : '';
}

// 转换字符串，undefined,null等转化为""
export function praseStrEmpty(str) {
	if (!str || str == "undefined" || str == "null") {
		return "";
	}
	return str;
}

/**
 * 构造树型结构数据
 * @param {*} data 数据源
 * @param {*} id id字段 默认 'id'
 * @param {*} parentId 父节点字段 默认 'parentId'
 * @param {*} children 孩子节点字段 默认 'children'
 * @param {*} rootId 根Id 默认 0
 */
export function handleTree(data, id, parentId, children, rootId) {
	id = id || 'id'
	parentId = parentId || 'parentId'
	children = children || 'children'
	rootId = rootId || Math.min.apply(Math, data.map(item => { return item[parentId] })) || "0"
	//对源数据深度克隆
	const cloneData = JSON.parse(JSON.stringify(data))
	//循环所有项
	const treeData = cloneData.filter(father => {
		let branchArr = cloneData.filter(child => {
			//返回每一项的子级数组
			return father[id] === child[parentId]
		});
		branchArr.length > 0 ? father.children = branchArr : '';
		//返回第一层
		return father[parentId] === rootId;
	});
	return treeData != '' ? treeData : data;
}


/**
 * @description:  树形结构解析list
 * @param {type} tree
 * @return {type} list
 */
export function treeToList(node) {
	let stack = node
	let data = []
	while (stack.length) {
		let pop = stack.pop();
		data.push(pop)
		let children = pop.children
		if (children) {
			for (let i = children.length - 1; i >= 0; i--) {
				stack.push(children[i])
			}
		}
	}
	return data
}


// 生成UUID
export function getUUID() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
		var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
		return v.toString(16);
	});
}

/**
 * @description: 选择当前选中节点内容
 * @param {type} 
 * @return {type} 
 */
export function focusValue(event) {
	event.currentTarget.select();
}

/**
 * @description: 输入金额格式化
 * @param {type} 
 * @return {type} 
 */
export function formatMoneyValue(value, num = 2) {
	let val = value || "";
	val = val.replace(/[^\d.]/g, ""); //清除"数字"和"."以外的字符

	switch (num) {
		case 0:
			val = val.replace(/\./g, ""); 
			val = (val.match(/^\d*(\.?\d{0,0})/g)[0]) || ''
			break;
		case 4:
			val = val.replace(/\.{4,}/g, "."); //只保留第一个. 清除多余的
			val = val.replace(/^0+\./g, '0.');
			val = val.match(/^0+[1-9]+/) ? val = val.replace(/^0+/g, '') : val
			val = (val.match(/^\d*(\.?\d{0,4})/g)[0]) || ''
			break;
		default:
			val = val.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的
			val = val.replace(/^0+\./g, '0.');
			val = val.match(/^0+[1-9]+/) ? val = val.replace(/^0+/g, '') : val
			val = (val.match(/^\d*(\.?\d{0,2})/g)[0]) || ''
			break;
	}
	return val;
}

