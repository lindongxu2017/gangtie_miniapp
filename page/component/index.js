var bmap = require('../../libs/bmap-wx.min.js')
var app = getApp()
Page({
	data: {
		miconFlex: [
			{
				url: '',
				title: "乘车码",
				icon: '/image/catCode.png',
				id: 1,
			},
			{
				// url: "/page/component/orders/ordersList",
				url: "/pages/service/index",
				title: "4号线GO",
				icon: '/image/ordersList.png',
				id: 2,
			},
			{
				url: "/page/component/shops/shops",
				title: "MTRshops",
				icon: '/image/shop.png',
				id: 8,
			},
			{
				url: "/pages/suggest/index",
				title: "乘客意见表",
                icon: '/image/suggest.png',
                id: 'login',
			},
			{
				url: "/page/component/eat/eat",
				title: "沿线吃喝玩乐",
				icon: '/image/eat.png',
				id: 3,
			},
			{
				// url: "/page/component/assistant/assistant",
				url: "/page/component/assistant_2/index",
				title: "出行助手",
				icon: '/image/assistant.png',
				id: 5,
			},
			{
				url: "/page/component/share/share",
				title: "友你会",
				icon: '/image/share.png',
				id: 6,
			},
			{
				url: "/page/component/lostAndFound/lostAndFound",
				title: "失物招领",
				icon: '/image/lostAndFound.png',
				id: 4,
			},
			// {
			// 	url: "",
			// 	title: "WIFI",
			// 	icon: '/image/WIFI.png',
			// 	id: 7,
			// },
			// {
			// 	url: "/page/component/suggest/suggest",
			// 	title: "投诉建议",
			// 	icon: '/image/suggest.png',
			// 	id: 9,
			// },
			{
				url: "/pages/mall/index?type=1",
				title: "MTRmalls",
				icon: '/icon/mtrmalls.png',
				id: 4,
			},
			{
				url: "/page/component/songhui/songhui",
				title: "颂荟商场",
				icon: '/image/songhui.png',
				id: 10,
			},
			// {
			// 	url: "/pages/mall_news/index",
			// 	title: "店铺上新",
			// 	icon: '/image/shop.png',
			// 	id: 4,
			// },
			// {
			// 	url: "/pages/discount/index",
			// 	title: "优惠信息",
			// 	icon: '/icon/suggest.png',
			// 	id: 4,
			// },
			// {
			// 	url: "/pages/sign/index",
			// 	title: "签到",
			// 	icon: '/icon/sign.png',
			// 	id: 'login',
			// },
            // {
            //     url: "/pages/mall/index?type=2",
			// 	title: "旅游攻略",
			// 	icon: '/image/shop.png',
			// 	id: 4,
			// },
		],
		// 天气
		weather: null,

		// 公告与动画
		notice: [],
		noticeAnimation: false,
		noticeWidth: 'auto',
		noticeTime: 0,

		//getWeather执行次数
		time: 0,
	},
	onShow() {
		this.getNotice()
		if (this.data.time != 0 && !this.data.weather) {
			wx.getLocation({
				success: res => {
					this.getWeather()
				}
			})
		}
	},
	onLoad(options) {
		var scene = decodeURIComponent(options.scene);
		if (scene.length != 0 && scene != 'undefined') {
			app.ajax(app.globalData.servicePath + app.globalData.api.channel_bind, "POST", {
				sessionKey: "",
				channel_id: scene,
			}, res => {});
		}

		this.getWeather()
		setInterval(this.getWeather, 15 * 60 * 1000)
		if (options && options.special) {
			this.special(options.special)
		}
	},

	//获取天气
	getWeather() {
		var BMap = new bmap.BMapWX({
			ak: app.globalData.mapInfo.apk,
		});
		BMap.weather({
			success: res => {
				var weather = res.currentWeather[0];
				var arr = weather.temperature.match(/\d+/g);
				weather.temperature = arr[1] + " ~ " + arr[0] + "℃";
				console.log(weather);
				if (weather.currentCity.indexOf('市') != -1) weather.currentCity = weather.currentCity.split('市').join('');
				this.setData({
					weather: weather,
					time: ++this.data.time,
				});
			},
			fail: e => {
				console.log(e);
				this.setData({
					time: ++this.data.time,
				});
			},
		});
	},

	//获取公告
	getNotice() {
		var identical = true
		var oldNotice = this.data.notice
		var url = app.globalData.servicePath + app.globalData.api.notice
		app.ajax(url, "GET", {}, res => {
			var notice = []
			if (oldNotice.length != res.data.length) identical = false
			for (var i = 0; i < res.data.length; i++) {
				notice[i] = res.data[i].title
				if (oldNotice[i] != res.data[i].title) identical = false
			}
			if (!identical) {
				this.setData({
					noticeWidth: 'auto',
					noticeAnimation: false,
					notice: notice
				})
				setTimeout(res => {
					var query = wx.createSelectorQuery();
					query.select('#notice').boundingClientRect()
					query.exec(res => {
						this.setData({
							noticeWidth: res[0].width + 'px',
							noticeTime: res[0].width / 100,
							noticeAnimation: true
						})
					})
				}, 500)
			}
		})
	},

    wxlogin(e) {
        console.log(e)
        let path = e.currentTarget.dataset.url
        if (e.detail.errMsg == 'getUserInfo:ok') {
            let userInfo = e.detail.userInfo
            wx.setStorageSync("userInfo", userInfo)
            let iv = e.detail.iv
            let encryptedData = e.detail.encryptedData
            wx.login({
                success(res) {
                    let code = res.code
                    app.http('post', {
                        code, iv, encryptedData
                    }, '/api/wx_login').then(res => {
                        wx.setStorageSync('sessionKey', res.data.sessionKey)
                        wx.setStorageSync('userdata', res.data)
                        wx.navigateTo({
                            url: path,
                        })
                    }).catch(res => {
                        // todo
                    })
                }
            })
        }
    },

	//用户授权
	getUserInfo(e) {
		if (e.detail.userInfo) {
			var userInfo = e.detail.userInfo
			var _userInfo = {}
			if (wx.getStorageSync("userInfo")) _userInfo = wx.getStorageSync("userInfo")
			if (_userInfo.lat && _userInfo.lng) {
				userInfo.lat = _userInfo.lat
				userInfo.lng = _userInfo.lng
			}
			wx.setStorageSync("userInfo", userInfo)
			wx.navigateTo({
				url: '/page/component/assistant_2/index',
			})
		} else {
            // TODO
			// wx.showModal({
			// 	title: '温馨提示',
			// 	content: '授权失败，该功能将受限，去更改？',
			// 	success: res => {
			// 		if (res.confirm) {
			// 			wx.openSetting({
			// 				success: res => {
			// 					wx.getUserInfo({
			// 						success: e => {
			// 							app.globalData.userInfo = e.userInfo
			// 							wx.navigateTo({
			// 								url: 'assistant/assistant',
			// 							})
			// 						}
			// 					})
			// 				}
			// 			})
			// 		}
			// 	}
			// })
		}
	},

	special(e) {
		if (e.currentTarget.id == 1) {
			//乘车码
			wx.navigateToMiniProgram({
				appId: app.globalData.scan.appid,
				path: app.globalData.scan.path
			});
		} else if (e.currentTarget.id == 7) {
			//WIFI
			wx.navigateToMiniProgram({
				appId: 'wxa374a37ed199bea5',
				path: '/pages/index/index'
			});
		}
	},
})