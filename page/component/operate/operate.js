var app = getApp()
var list = require('../../../util/list.js')
Page({
	data: {
		//列表，页数，总数
		list: [],
		page: 1,
		total: -1,

		//用onShow模拟onLoad
		onLoad: true
	},
	onShow() {
		if (this.data.onLoad) {
			this.getListBuffer(false)
		} else {
			this.setData({
				onLoad: true
			})
		}
	},
	onReachBottom() {
		this.getListBuffer(true)
	},
	getListBuffer(isReachBottom) {
		var url = app.globalData.servicePath + app.globalData.api.operate.index
		list.getList(this, url, {}, isReachBottom)
	},
	setOnLoad() {
		this.setData({
			onLoad: false
		})
	}
})