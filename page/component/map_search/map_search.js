var app = getApp();
var txMap = require('../../../txMap/qqmap-wx-jssdk.min.js');
var tx_map = new txMap({
	key: 'AN2BZ-5EOKJ-PWYFP-FHWCA-JE63S-7FFMD',
});
Page({
	data: {
		keyword: "",
		keyword_hint_list: [],
	},
	keyword(e) {
		this.setData({ keyword: e.detail.value });
		tx_map.getSuggestion({
			keyword: this.data.keyword,
			region: "深圳市",
			success: res => {
				var arr = [];
				for (var i = 0; i < res.data.length; i++) {
					arr.push({
						latitude: res.data[i].location.lat,
						longitude: res.data[i].location.lng,
					});
				}
				this.get_distance(res.data, arr);
			},
		});
	},
	search() {
		app.globalData.map_keyword = this.data.keyword.trim();
		wx.navigateBack();
	},
	search_del() {
		this.setData({ keyword: '' });
	},
	get_distance(arr, data) {
		tx_map.calculateDistance({
			to: data,
			success: res => {
				for (var i = 0; i < arr.length; i++) {
					arr[i].distance = this.distance_handle(res.result.elements[i].distance);
				};
				this.setData({ keyword_hint_list: arr });
			},
			fail: e => {
				this.setData({ keyword_hint_list: arr });
			},
		});
	},
	distance_handle(distance) {
		if (distance < 1000) {
			return distance + 'm';
		} else if (distance < 100000) {
			return (distance / 1000).toFixed(1) + 'km';
		} else {
			return (distance / 1000).toFixed() + "km";
		}
	},
	markertap(e) {
		var keyword_hint_list = this.data.keyword_hint_list;
		var index = e.currentTarget.id;
		wx.openLocation({
			latitude: keyword_hint_list[index].location.lat,
			longitude: keyword_hint_list[index].location.lng,
			scale: 16,
			name: keyword_hint_list[index].title,
			address: keyword_hint_list[index].province + keyword_hint_list[index].city + keyword_hint_list[index].district + keyword_hint_list[index].address,
		});
	},
});