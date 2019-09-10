var app = getApp();
var txMap = require('../../../txMap/qqmap-wx-jssdk.min.js');
var tx_map = new txMap({ key: 'AN2BZ-5EOKJ-PWYFP-FHWCA-JE63S-7FFMD' });
Page({
	data: {
		lng: '',
		lat: '',
		markers: [],
		keyword: '',
		scale: 16,
	},
	onLoad() {
		this.MapContext = wx.createMapContext('myMap');
		wx.getLocation({
			type: 'gcj02',
			success: res => {
				this.setData({
					lng: res.longitude,
					lat: res.latitude,
				});
				setTimeout(() => { this.location() }, 200);
			},
		});
		this.setData({ 
			markers: [{
				title: "CASA MIA精品超市(深圳龙胜店)",
				address: "广东省深圳市龙华区地铁四号线龙胜站B/C出口港铁TIA颂荟商场L2",
				id: "1209881169606787228",
				latitude: 22.645195,
				longitude: 114.012103,
				iconPath: "/image/marker_red.png",
				width: 20,
				height: 20,
			}],
			scale: 14,
		});
	},
	onShow() {
		this.setData({ keyword: app.globalData.map_keyword });
		tx_map.search({
			keyword: this.data.keyword,
			success: res => {
				res.data.unshift({
					ad_info: {
						adcode: 440309,
						city: "深圳市",
						district: "龙华区",
						province: "广东省",
					},
					address: "广东省深圳市龙华区地铁四号线龙胜站B/C出口港铁TIA颂荟商场L2",
					category: "购物:超市",
					id: "1209881169606787228",
					location: {
						lat: 22.645195,
						lng: 114.012103,
					},
					tel: "",
					title: "CASA MIA精品超市(深圳龙胜店)",
					type: 0,
					_distance: 25596.3
				});
				console.log(res.data)
				var markers = [];
				for (var i = 0; i < res.data.length; i++) {
					markers.push({
						title: res.data[i].title,
						address: res.data[i].address,
						id: res.data[i].id,
						latitude: res.data[i].location.lat,
						longitude: res.data[i].location.lng,
						iconPath: "/image/marker_red.png",
						width: 20,
						height: 20,
					});
				};
				this.setData({ 
					markers: markers,
					scale: 0, 
				});
			},
		});
	},
	onHide() {
		app.globalData.map_keyword = '';
	},
	markertap(e) {
		var markers = this.data.markers;
		for (var i = 0; i < markers.length; i++) {
			if (markers[i].id == e.markerId) {
				wx.openLocation({
					latitude: markers[i].latitude,
					longitude: markers[i].longitude,
					scale: 16,
					name: markers[i].title,
					address: markers[i].address,
				});
			}
		};
	},
	to_search() {
		wx.navigateTo({
			url: '/page/component/map_search/map_search',
		});
	},
	location() {
		this.MapContext.moveToLocation();
	},
});