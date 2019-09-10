var app = getApp();
var list = require('../../../util/list.js');
Page({
	data: {
		tab_index: 0,

		floor_list: [],
		floor_select_list: [],
		floor_id: 0,
		floor_index: 0,

		list: [],
		page: 1,
		total: -1,

		type_list: [],
		type_id: 0,
		keyword: '',

		surplus: 0,
	},
	onLoad() {
		this.get_type_list();
		this.get_floor_list();
		this.get_list_buffer();
	},

	// 品类业态，楼层图切换
	index_tab(e) {
		this.setData({
			tab_index: e.currentTarget.id,
		});
	},

	// 上拉加载
	scrolltolower() {
		this.get_list_buffer(true);
	},

	// 重置列表
	reset_list() {
		this.setData({
			list: [],
			page: 1,
			total: -1,
		});
	},

	type_tab(e) {
		this.setData({
			type_id: e.currentTarget.id,
		});
		this.get_list_buffer();
	},

	// 品牌搜索关键字输入
	search(e) {
		this.setData({
			keyword: e.detail.value,
		});
	},
	search_del() {
		this.setData({
			keyword: '',
		});
		this.reset_list();
	},
	// 品牌搜索
	confirm() {
		if (this.data.keyword.length > 0) {
			wx.navigateTo({
				url: '/page/component/brand_store/brand_store?keyword=' + this.data.keyword + '&floor_id=' + this.data.floor_id,
			})
		}
	},

	// 获取品牌列表
	get_list_buffer(isReachBottom) {
		var url = app.globalData.servicePath + app.globalData.api.get_store;
		list.getList(this, url, { 
			class_id: this.data.type_id, 
			floor_id: this.data.floor_id,
		}, isReachBottom);
	},

	// 获取品牌类型
	get_type_list() {
		var url = app.globalData.servicePath + app.globalData.api.get_brand_list;
		app.ajax(url, "GET", {}, res => {
			var type_list = [{name: "全部", id: 0}].concat(res.data);
			var surplus = Math.ceil(type_list.length / 4) * 76 + 12;
			this.setData({
				type_list: type_list,
				surplus: surplus,
			});
		});
	},

	// 获取楼层图
	get_floor_image_height(arr, i) {
		var inspect = arr => {
			var flag = true;
			for (var i = 0; i < arr.length; i++) {
				if (!arr[i].image_height) flag = false;
			}
			var data = { floor_list: arr };
			if (flag) {
				data.floor_list = [{
					id: 0,
					name: "全部",
				}].concat(arr);
			}
			this.setData(data);
		};
		wx.getImageInfo({
			src: arr[i].image,
			success: res => {
				arr[i].image_height = 630 / res.width * res.height;
				inspect(arr);
			},
			fail: e => {
				arr[i].image_height = 1;
				inspect(arr);
			},
		});
	},

	// 楼层选择
	floor_select(e) {
		this.setData({
			floor_id: this.data.floor_list[e.detail.value].id,
			floor_index: e.detail.value,
			keyword: '',
		});
		console.log(this.data);
		this.get_list_buffer();
	},

	// 获取楼层列表
	get_floor_list() {
		var url = app.globalData.servicePath + app.globalData.api.get_floor_list;
		app.ajax(url, "GET", {}, res => {
			var floor_select_list = ["全部"];
			for (var i = 0; i < res.data.length; i++) {
				floor_select_list.push(res.data[i].name);
				this.get_floor_image_height(res.data, i);
			}
			this.setData({
				floor_select_list: floor_select_list,
			});
		});
	},

	// 图片预览
	previewImage(e) {
		wx.previewImage({
			urls: [e.currentTarget.id],
		});
	},
});