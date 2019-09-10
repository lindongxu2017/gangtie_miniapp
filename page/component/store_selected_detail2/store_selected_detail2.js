var app = getApp();
var WxParse = require('../../../wxParse/wxParse.js');
Page({
	data: {
		detail: {},
	},
	onLoad(options) {
		var url = app.globalData.servicePath + app.globalData.api.get_store_detail;
		var data = { id: options.id };
		var setLoading = { close: true }
		app.ajax(url, "GET", data, res => {
			if (res.data.detail) WxParse.wxParse('content', 'html', res.data.detail, this, 3);
			this.setData({ detail: res.data });
		}, setLoading);
	},
});