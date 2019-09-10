var app = getApp()
var list = require('../../../util/list.js')
Page({
	data: {
		navList: [],
		navId: -1,
		navIndex2: 0,

		search: '',
		station_id: 'false',

		//只匹配站外
		in_station: 2,

		//列表，页数，总数
		list: [],
		page: 1,
		total: -1,
	},
	onLoad(options) {
		this.getEatList()
		this.setData({
			navId: options.eatType,
			station_id: options.station_id
		})
		this.getListBuffer(false)
	},
	navTab(e) {
		if (e.currentTarget.id != this.data.navId) {
			this.setData({
				navId: e.currentTarget.id
			})
			this.getListBuffer(false)
		}
	},
	navTab2(e) {
		if (e.currentTarget.id != this.data.navIndex2) {
			this.setData({
				navIndex2: e.currentTarget.id
			})
			this.getListBuffer(false)
		}
	},
	onReachBottom() {
		this.getListBuffer(true)
	},
	input(e) {
		this.setData({
			search: e.detail.value
		})
	},
	search() {
		this.getListBuffer(false)
	},

	//获取分类列表
	getEatList() {
		var url = app.globalData.servicePath + app.globalData.api.eat.typeList
		app.ajax(url, "GET", { is_line: 1 }, res => {
			var navList = [];
			for (var i = 0; i < res.data.length; i++) {
				if (res.data[i].is_line == 1) navList.push(res.data[i]);
			};
			this.setData({
				navList: navList,
			});
		})
	},

	//获取店铺列表
	getListBuffer(isReachBottom) {
		list.getStoreList(this, isReachBottom)
	},
})