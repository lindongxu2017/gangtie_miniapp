var app = getApp();
var list = require('../../../util/list.js');
Page({
	data: {
		list: [],
		page: 1,
		total: -1,
        mapList: []
	},
	onLoad() {
		this.get_list_buffer(false);
        this.getMapList()
	},
    //获取轮播图列表
    getMapList() {
        var url = app.globalData.servicePath + app.globalData.api.sowingMap.eatIndex;
        app.ajax(url, "GET", { type: 5 }, res => {
            this.setData({ mapList: res.data });
        });
    },
	scrolltolower() {
		this.get_list_buffer(true);
	},
	get_list_buffer(isReachBottom) {
		var url = app.globalData.servicePath + app.globalData.api.get_activity;
		list.getList(this, url, { type: 1 }, isReachBottom);
	},
});