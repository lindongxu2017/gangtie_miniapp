var list = require('../../../util/list.js')
var app = getApp()
Page({
	data: {
		navList: [],
		navId: -1,
		navIndex: -1,


		navList2: ['距离最近', '新铺推荐', '优惠活动'],
		navIndex2: 0,

		search: '',
		station_id: 'false',

		//品牌id
		brand_id: 0,

		//只匹配站内
		in_station: 1,

		//列表，页数，总数
		list: [],
		page: 1,
		total: -1,
        type: 0
	},
	onLoad(options) {
		this.setData({
			navId: options.eatType,
			station_id: options.station_id,
			brand_id: options.brand_id
		})
		this.getEatList()
		this.getListBuffer(false)
	},
	navTab(e) {
		var arr = e.currentTarget.id.split(',');
		if (arr[0] != this.data.navId) {
			this.setData({
				navId: arr[0],
				navIndex: arr[1],
			})
			this.getListBuffer(false);
		}
	},
	navTab2(e) {
		if (e.currentTarget.id != this.data.navIndex2) {
            let id = e.currentTarget.id
			this.setData({
				navIndex2: id,
                type: id == 1 ? 1 : 0
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
        app.ajax(url, "GET", {in_station: 1}, res => {
			console.log(res, 11111111);
			var navIndex;
			for (var i = 0; i < res.data.length; i++) {
				if (res.data[i].id == this.data.navId) navIndex = i;
			}
			this.setData({
				navList: res.data,
				navIndex: navIndex,
			});
		});
	},

	//获取店铺列表
	getListBuffer(isReachBottom) {
        list.getStoreList(this, isReachBottom, { month_new_shop: this.data.type})
	},
})