var app = getApp()
Page({
	data: {
		//列表，页数，总数
		list: [],
		page: 1,
		total: -1,

		//所有数据
		store: [],
	},
	onLoad() {
		this.getList()
	},
	onReachBottom() {
		this.getList()
	},
	getList() {
		var url = app.globalData.servicePath + app.globalData.api.lost_found.index
		var list = this.data.list
		var store = this.data.store
		var page = this.data.page

		if (page == 1) {
			app.ajax(url, "GET", {}, res => {
				if (res.data.LfList.length == 0) {
					wx.showToast({
						title: '没有更多数据了',
					})
				} else {
					store = res.data.LfList
					for (var i = 0; i < 15; i++) {
						if (store[store.length - (page - 1) * 15 - (i + 1)]) {
							list.push(store[store.length - (page - 1) * 15 - (i + 1)])
						}
					}
					this.setData({
						store: store,
						page: ++page,
						total: store.length,
						list: list
					})
				}
			})
		} else {
			wx.showLoading({
				title: '加载中...',
			})
			if (store.length > (page - 1) * 15) {
				setTimeout(res => {
					for (var i = 0; i < 15; i++) {
						if (store[store.length - (page - 1) * 15 - (i + 1)]) {
							list.push(store[store.length - (page - 1) * 15 - (i + 1)])
						}
					}
					wx.hideLoading()
					this.setData({
						store: store,
						page: ++page,
						total: store.length,
						list: list
					})
				}, 200)
			} else {
				wx.showToast({
					title: '没有更多数据了',
				})
			}
		}
	}
})