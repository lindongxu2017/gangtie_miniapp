var app = getApp();
var list = require('../../../util/list.js');
Page({
	data: {
		list: [],
		page: 1,
		total: -1,
		id: 0,
		keyword: '',
	},
	onLoad(options) {
		var data = {};
		if (options.id) data.id = options.id;
		if (options.keyword) {
			data.keyword = options.keyword;
			if (options.floor_id != 0) data.floor_id = options.floor_id;
		}
		this.setData(data);
		this.get_list_buffer(false);
	},
	scrolltolower() {
		this.get_list_buffer(true);
	},
	get_list_buffer(isReachBottom) {
		var url = app.globalData.servicePath + app.globalData.api.get_store;
		var data = {};
		if (this.data.keyword.length > 0) {
			data.search = this.data.keyword;
			if (this.data.floor_id && this.data.floor_id != 0) data.floor_id = this.data.floor_id;
		} else {
			data.class_id = this.data.id;
		}
		list.getList(this, url, data, isReachBottom);
	},
});