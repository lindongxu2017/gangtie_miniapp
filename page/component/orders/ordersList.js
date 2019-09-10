var app = getApp()
var bmap = require('../../../libs/bmap-wx.min.js');
Page({
	data: {
		navList: ["乘车", "线路图", "附近站点", "服务时间", "客服电话"],
		// navList: ["服务时间", "客服电话"],
		currentTab: 0,

		//picker
		multiList: [
			{
				id: '',
				// multiArray: [],
				// multiIndex: [-1, -1],
				multiValue: '请选择起点站'
			},
			{
				id: '',
				// multiArray: [],
				// multiIndex: [-1, -1],
				multiValue: '请选择终点站'
			}
		],

		//线路图 服务时间图
		dtimg: 'https://gangtie.qinhantangtop.com/public/images/dt.jpg',
		smimg: 'https://gangtie.qinhantangtop.com/public/images/sm.png',

		//附近站点数组与位置
		markers: [],
		latitude: '',
		longitude: '',

		//客服电话列表
		phoneList: [],


		site_name: '',
		site_station_id: '',
	},
	nubToLine(nub) {
		if (nub == 6) {
			return 7
		} else if (nub == 7) {
			return 9
		} else if (nub == 8) {
			return 11
		} else {
			return nub
		}
	},
	onLoad(options) {
		if (options.index) {
			this.setData({
				currentTab: options.index,
			});
		}
		this.getPhoneList();
		this.getMultiList();
	},
	onShow() {
		if (this.data.currentTab == 2) this.getMarkers()

		var select_site = wx.getStorageSync('select_site');
		var multiList = wx.getStorageSync('multiList');
		if (select_site) {
			var i = 0;
			if (select_site.site_type == 'end') i = 1;
			multiList[i].id = select_site.site_station_id;
			multiList[i].multiValue = this.nubToLine(parseInt(select_site.site_line) + 1) + '号线 ' + select_site.site_name;
			wx.setStorageSync('select_site', false);
		}
		if (multiList){
			wx.setStorageSync('multiList', multiList);
			this.setData({
				multiList: multiList
			});
		}
	},

	//顶部导航切换
	clickTab(e) {
		this.setData({
			currentTab: e.currentTarget.id
		})
		if (e.currentTarget.id == 2) this.getMarkers()
	},
	setIndex(index) {
		if (index == 2) this.getMarkers()
	},

	//获取附近站点数组与位置
	getMarkers() {
		var BMap = new bmap.BMapWX({
			ak: app.globalData.mapInfo.apk
		})
		BMap.search({
			query: '地铁站',
			success: res => {
				if (res.wxMarkerData.length == 0) {
					wx.getLocation({
						success: res => {
							this.setData({
								latitude: res.latitude,
								longitude: res.longitude
							})
						}
					})
				} else {
					res.wxMarkerData[0].iconPath = "/image/marker_yellow.png"

					var MapConvert = {
						x_pi: 3.14159265358979324 * 3000.0 / 180.0,
						// 中国正常坐标系GCJ02协议的坐标，转到 百度地图对应的 BD09 协议坐标
						//  point 为传入的对象，例如{lat:xxxxx,lng:xxxxx}
						Convert_GCJ02_To_BD09: function (point) {
							var x = point.lng, y = point.lat;
							var z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * MapConvert.x_pi);
							var theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * MapConvert.x_pi);
							point.lng = z * Math.cos(theta) + 0.0065;
							point.lat = z * Math.sin(theta) + 0.006;
							return point
						},
						// 百度地图对应的 BD09 协议坐标，转到 中国正常坐标系GCJ02协议的坐标
						Convert_BD09_To_GCJ02: function (point) {
							var x = point.lng - 0.0065, y = point.lat - 0.006;
							var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * MapConvert.x_pi);
							var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * MapConvert.x_pi);
							point.lng = z * Math.cos(theta);
							point.lat = z * Math.sin(theta);
							return point
						}
					}

					var markers = res.wxMarkerData
					// for (var i = 0; i < markers.length; i++) {
					// 	var point = MapConvert.Convert_BD09_To_GCJ02({
					// 		lat: markers[i].latitude,
					// 		lng: markers[i].longitude
					// 	})
					// 	markers[i].latitude = point.lat
					// 	markers[i].longitude = point.lng
					// }
					// console.log(markers)
	
					this.setData({
						markers: markers,
						latitude: res.wxMarkerData[0].latitude,
						longitude: res.wxMarkerData[0].longitude
					})
				}
			},
			fail: e => {
				wx.showModal({
					title: '温馨提示',
					content: '无法获取位置，该功能已受限，是否去设置？',
					success: function (res) {
						if (res.confirm) {
							wx.openSetting()
						}
					}
				})
			},
			iconPath: '/image/marker_red.png'
		})
	},
	//切换选中站点
	makerTap(e) {
		var markers = this.data.markers
		for (var i = 0; i < markers.length; i++) {
			markers[i].iconPath = "/image/marker_red.png"
		}
		markers[e.markerId].iconPath = "/image/marker_yellow.png"
		wx.openLocation({
			latitude: markers[e.markerId].latitude,
			longitude: markers[e.markerId].longitude,
			scale: 16,
			address: markers[e.markerId].address + markers[e.markerId].title
		})
		this.setData({
			markers: markers
		})
	},

	//获取客服电话列表
	getPhoneList() {
    var url = app.globalData.servicePath + app.globalData.api.servicePhone
		app.ajax(url, "GET", {}, res => {
			this.setData({
				phoneList: res.data
			})
		})
	},
	// 拨打客服电话
	callPhone(e) {
		wx.makePhoneCall({
			phoneNumber: this.data.phoneList[e.currentTarget.id].tel
		})
	},

	//预览图片
	previewImage(e) {
		wx.previewImage({
			urls: [e.currentTarget.id]
		})
	},

	//获取站点选择器内容
	getMultiList() {
		var multiList = this.data.multiList
    var site = app.globalData.site
    for (var i = 0; i < multiList.length; i++) {
			var arr = []
			arr.push(site.allSite[0])
			arr.push(site.allSite[1][0])
			multiList[i].multiArray = arr
		}
		this.setData({
			multiList: multiList
		})
	},
	//站点选择器
	bindMultiPickerChange(e) {
		var multiList = this.data.multiList
		var item = multiList[e.currentTarget.id]
		item.multiIndex = e.detail.value
		item.multiValue = item.multiArray[0][e.detail.value[0]] + ' ' + item.multiArray[1][e.detail.value[1]]
		this.setData({
			multiList: multiList
		})
	},
	bindMultiPickerColumnChange(e) {
		var multiList = this.data.multiList
		var item = multiList[e.currentTarget.id]
		item.multiIndex[e.detail.column] = e.detail.value
		if (e.detail.column == 0) {
			item.multiIndex[1] = 0;
      item.multiArray[1] = app.globalData.site.allSite[1][e.detail.value]
			this.setData({
				multiList: multiList
			})
		}
	},
	storage_sync(){
		wx.setStorageSync('multiList', this.data.multiList);
	},
	//路线搜索
	tranfeFun() {
		var multiList = this.data.multiList
		if (multiList[0].multiIndex[0] == -1 || multiList[0].multiIndex[1] == -1 || multiList[1].multiIndex[0] == -1 || multiList[1].multiIndex[1] == -1) {
			wx.showToast({
				title: '请选择起始点!',
			})
		} else if (multiList[0].multiIndex[0] == multiList[1].multiIndex[0] && multiList[0].multiIndex[1] == multiList[1].multiIndex[1]) {
			wx.showToast({
				title: '起始点重复!',
			})
		} else {
      var site = app.globalData.site
      var start_station_id = site.siteIdArr[multiList[0].multiIndex[0]][multiList[0].multiIndex[1]].station_id
      var end_station_id = site.siteIdArr[multiList[1].multiIndex[0]][multiList[1].multiIndex[1]].station_id
			wx.navigateTo({
				url: '../search/search?start_station_id=' + start_station_id + '&end_station_id=' + end_station_id
			})
		}
	}
})