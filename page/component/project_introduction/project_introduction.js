var app = getApp();
var WxParse = require('../../../wxParse/wxParse.js');
Page({
	onLoad() {
		var url = app.globalData.servicePath + app.globalData.api.get_serviceInfo;
		app.ajax(url, "GET", {}, res => {
			if (res.data.project_brief) WxParse.wxParse('content', 'html', res.data.project_brief, this, 3);
		});
	},
});