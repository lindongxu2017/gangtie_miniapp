var app = getApp()
var list = require('../../../util/list.js')
Page({
	data: {
		//轮播图
		mapList: [],

		//列表，页数，总数
		list: [],
		page: 1,
		total: -1,

		//用onShow模拟onLoad
		onLoad: true,
	},
	onShow() {
		if (this.data.onLoad) {
			this.getMapList()
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
		var url = app.globalData.servicePath + app.globalData.api.activity.index
		list.getList(this, url, {}, isReachBottom)
	},

	//获取轮播图列表
	getMapList() {
		var url = app.globalData.servicePath + app.globalData.api.sowingMap.eatIndex
		app.ajax(url, "GET", { type: 2 }, res => {
			this.setData({ mapList: res.data });
		})
	},

	//预览图片
	previewImage(e) {
		this.setOnLoad()
		var images = []
		for (var i = 0; i < this.data.mapList.length; i++) {
			images[i] = this.data.mapList[i].image
		}
		wx.previewImage({
			current: images[e.currentTarget.id],
			urls: images
		})
	},

	setOnLoad() {
		this.setData({
			onLoad: false
		})
	}
})