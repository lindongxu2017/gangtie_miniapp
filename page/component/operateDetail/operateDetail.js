var app = getApp()
var WxParse = require('../../../wxParse/wxParse.js')
Page({
	data: {
		currentOperate: {},
	},
	onLoad(options) {
    var url = app.globalData.servicePath + app.globalData.api.operate.id;
		var data = { id: options.id }
		app.ajax(url, "GET", data, res => {
			if (res.data.content) WxParse.wxParse('content', 'html', res.data.content, this, 3)
			this.setData({
				currentOperate: res.data
			})
		})
	}
})