var app = getApp()
var list = require('../../../util/list.js')
Page({
	data: {
		navList: [],
		navIndex: 0,

		is_newshop: false,

		//只匹配站外
		in_station: 2,

		//选中站点
		siteArr: [],
		siteArrIndex: 0,
		station_id: 'false',
		station_name: '全部站点',

		//轮播图
		mapList: [],

		//列表，页数，总数
		list: [],
		page: 1,
		total: -1,
	},
	onLoad() {
		this.setData({
			siteArr: app.globalData.site.shopSite
		})
		this.getEatList()
		this.getMapList()
		this.getListBuffer(false)
	},
	onReachBottom() {
		this.getListBuffer(true)
	},

	newShopTab() {
		this.setData({
			is_newshop: !this.data.is_newshop
		})
		this.getListBuffer(false)
	},

	//切换站点
	bindPickerChange(e) {
		if (e.detail.value != this.data.siteArrIndex) {
			var station_name = this.data.siteArr[e.detail.value]
			if (station_name != '全部站点') station_name = station_name.substring(0, station_name.length - 1)
			this.setData({
				siteArrIndex: e.detail.value,
				station_id: app.globalData.site.shopSiteIdArr[e.detail.value].station_id,
				station_name: station_name,
				is_newshop: false
			})
			this.getListBuffer(false)
		}
	},

	//获取分类列表
	getEatList() {
		var url = app.globalData.servicePath + app.globalData.api.eat.typeList
		app.ajax(url, "GET", { is_line: 1 }, res => {
			var navList = [];
			for(var i=0;i<res.data.length;i++){
				if (res.data[i].is_line == 1) navList.push(res.data[i]);
			};
			this.setData({
				navList: navList,
			});
		})
	},

	//获取轮播图列表
	getMapList() {
		var url = app.globalData.servicePath + app.globalData.api.sowingMap.eatIndex
		var data = { type: 3 }
		app.ajax(url, "GET", data, res => {
			this.setData({ mapList: res.data });
		})
	},

	//获取店铺列表
	getListBuffer(isReachBottom) {
    	list.getStoreList(this, isReachBottom, { in_station: 2})
	},

	//预览图片
	previewImage(e) {
		var images = []
		for (var i = 0; i < this.data.mapList.length; i++) {
			images[i] = this.data.mapList[i].image
		}
		wx.previewImage({
			current: images[e.currentTarget.id],
			urls: images
		})
	},
})