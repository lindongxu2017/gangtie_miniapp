var app = getApp()
var list = require('../../../util/list.js')
Page({
	data: {
		position: 'relative',
		navList: [],
		navIndex: 0,

		//只匹配站内
		in_station: 1,

		//选中站点
		siteArr: [],
		siteArrIndex: 0,
		station_id: 'false',
		station_name: '全部站点',

		//品牌列表
		brandList: [{ name: "全部品牌", id: 0 }],
		brandPicker: ["全部品牌"],
		brand_id: 0,
		brand_index: 0,

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
		this.getBrandList()
		this.getMapList()
		this.getListBuffer(false)
	},
	onReachBottom() {
		this.getListBuffer(true)
	},
	onPageScroll(e) {
		// var position = 'relative'
		// if (e.scrollTop >= 170) {
		//   position = "fixed"
		// }
		// this.setData({
		//   position: position
		// })
	},

	//品牌切换
	bindPickerChange2(e) {
		if (e.detail.value != this.data.brand_index) {
			this.setData({
				brand_index: e.detail.value,
				brand_id: this.data.brandList[e.detail.value].id,
			})
			this.getListBuffer(false)
		}
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
		app.ajax(url, "GET", { in_station: 1 }, res => {
			console.log(res)
            // res.data.push({
			// 	url: "/pages/discount/index",
			// 	name: "优惠信息",
			// 	logo: '/icon/suggest.png',
			// 	id: 'discount',
			// })
			this.setData({
				navList: res.data
			})
		})
	},

	//获取品牌列表
	getBrandList() {
		var brandList = this.data.brandList
		var url = app.globalData.servicePath + app.globalData.api.eat.brandList
		var brandPicker = this.data.brandPicker
		app.ajax(url, "GET", {}, res => {
			brandList = brandList.concat(res.data)
			for (var i = 0; i < res.data.length; i++) {
				brandPicker.push(res.data[i].name)
			}
			this.setData({
				brandList: brandList,
				brandPicker: brandPicker
			})
		})
	},

	//获取轮播图列表
	getMapList() {
		var url = app.globalData.servicePath + app.globalData.api.sowingMap.eatIndex
		var data = { type: 1 }
		app.ajax(url, "GET", data, res => {
			this.setData({ mapList: res.data });
		})
	},

	//获取店铺列表
	getListBuffer(isReachBottom) {
		list.getStoreList(this, isReachBottom)
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