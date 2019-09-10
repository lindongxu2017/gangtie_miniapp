var app = getApp();
var list = require('../../../util/list.js');
Page({
	data: {
		//轮播图
		mapList: [],

		brand_list: [],
		brand_list_max: -1,

		list: [],
		page: 1,
		total: -1,
	},
	onLoad() {
		this.getMapList();
		this.get_list_buffer(false);
		this.get_store();
	},

	//获取轮播图列表
	getMapList() {
		var url = app.globalData.servicePath + app.globalData.api.sowingMap.eatIndex;
		app.ajax(url, "GET", { type: 4 }, res => {
			this.setData({ mapList: res.data });
		});
	},

	//获取活动精选
	get_list_buffer(isReachBottom) {
		var url = app.globalData.servicePath + app.globalData.api.get_activity;
		list.getList(this, url, { type: 2 }, isReachBottom);
	},
	scrolltolower() {
		this.get_list_buffer(true);
	},

	//获取商家精选
	get_store() {
		if (this.data.brand_list.length >= this.data.brand_list_max && this.data.brand_list_max != -1) return;
		var url = app.globalData.servicePath + app.globalData.api.get_store;
		app.ajax(url, "GET", { 
			is_selection: 1,
			page: Math.ceil(this.data.brand_list.length / 10) + 1,
		}, res => {
			this.data.brand_list = this.data.brand_list.concat(res.data.data);
			this.setData({ 
				brand_list: this.data.brand_list,
				brand_list_max: res.data.total
			});
		});
	},
	bindscrolltolower() {
		this.get_store();
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
});