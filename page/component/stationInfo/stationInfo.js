var app = getApp()
var WxParse = require('../../../wxParse/wxParse.js')
Page({
	data: {
		navList: ["出口", "卫生间"],
		currentTab: 0
	},
	onLoad(options) {
    var url = app.globalData.servicePath + app.globalData.api.siteDetail
		var data = { id: options.station_id }
		app.ajax(url, "GET", data, res => {
			//富文本
			if (res.data.export_information) WxParse.wxParse('content1', 'html', res.data.export_information, this, 3)
			if (res.data.toilet_content) WxParse.wxParse('content2', 'html', res.data.toilet_content, this, 3)
		})
	},
	clickTab(e) {
		this.setData({
			currentTab: e.currentTarget.id
		})
	},
})