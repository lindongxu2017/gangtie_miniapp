var app = getApp()
var WxParse = require('../../../wxParse/wxParse.js')
Page({
	data: {
		currentStore: {}
	},
	onLoad(options) {
		var MapConvert = {
			x_pi: 3.14159265358979324 * 3000.0 / 180.0,
			// 中国正常坐标系GCJ02协议的坐标，转到 百度地图对应的 BD09 协议坐标
			//  point 为传入的对象，例如{lat:xxxxx,lng:xxxxx}
			Convert_GCJ02_To_BD09: function (point) {
				var x = point.lng, y = point.lat;
				var z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y *MapConvert.x_pi);
				var theta = Math.atan2(y, x) + 0.000003 * Math.cos(x *MapConvert.x_pi);
				point.lng = z * Math.cos(theta) + 0.0065;
				point.lat = z * Math.sin(theta) + 0.006;
				return point
			},
			// 百度地图对应的 BD09 协议坐标，转到 中国正常坐标系GCJ02协议的坐标
			Convert_BD09_To_GCJ02: function (point) {
				var x = point.lng - 0.0065, y = point.lat - 0.006;
				var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y *MapConvert.x_pi);
				var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x *MapConvert.x_pi);
				point.lng = z * Math.cos(theta);
				point.lat = z * Math.sin(theta);
				return point
			}
		}
		
		var url = app.globalData.servicePath + app.globalData.api.eat.id
		var data = { id: options.id }
		app.ajax(url, "GET", data, res => {
			//富文本
			if (res.data.new_active) WxParse.wxParse('content1', 'html', res.data.new_active, this, 3)
			if (res.data.detail) WxParse.wxParse('content2', 'html', res.data.detail, this, 3)

			var location = MapConvert.Convert_BD09_To_GCJ02({ lat: res.data.lat, lng: res.data.lng })
			res.data.lat = location.lat
			res.data.lng = location.lng
			this.setData({
				currentStore: res.data
			})
		})
	},
	// 拨打客服电话
	callPhone() {
		wx.makePhoneCall({
			phoneNumber: this.data.currentStore.mobile
		})
	},
	//预览图片
	previewImage(e) {
		var images = this.data.currentStore.images
		wx.previewImage({
			current: images[e.currentTarget.id],
			urls: images
		})
	},
	//查看位置
	openLocation() {
		var currentStore = this.data.currentStore
		wx.openLocation({
			latitude: parseFloat(currentStore.lat),
			longitude: parseFloat(currentStore.lng),
			scale: 12,
			address: currentStore.shop_addr
		})
	}
})