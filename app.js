// 新开发的一些页面没有在手机上测试，scroll-view需要测试



//缓存

//用户信息
//wx.getStorageSync("userInfo")

//用户身份令牌
//wx.getStorageSync("sessionKey")

//出行助手消息
//wx.getStorageSync("assistantMessage")
App({
	globalData: {
		//服务器
		servicePath: "https://gangtie.qinhantangtop.com/public/api/",
		servicePathtest: "http://gangtietest.qinhantangtop.com/public/api/",
		baseUrl: "http://gangtietest.qinhantangtop.com/public/",
		// servicePath: "http://192.168.1.168:9100/public/api/",
		// servicePath: "https://www.szkingkey.cn/public/api/",

		//乘车码
		scan: {
			appid: 'wxbb58374cdce267a6',
			path: '/pages/qrcode/index?ykt_id=10000087&attach=07551.02.02.00008'
		},

		//百度地图
		mapInfo: {
			apk: '6RyTMUrsb94M06G83oHEDCrNLDjGRjin'
		},

		//api
		api: {
			login: 'wx_login',    //获取用户身份令牌
			lost_found: {
				index: 'lost_found/getList'   //失物招领列表
			},
			operate: {
				index: 'operating_information/index', //运营信息列表
				id: 'operating_information/detail'     //运营信息详情
			},
			activity: {
				index: 'active/index',           //活动列表
				id: 'active/detail'                 //活动详情
			},
			eat: {
				typeList: 'shop/cates',                   //吃喝玩乐分类列表
				storeList: 'shop/index',               	  //吃喝玩乐商家列表
				brandList: 'shop/brands',                //吃喝玩乐品牌列表
				id: 'shop/detail'                        //商家详情
			},
			sowingMap: {
				eatIndex: 'shop/banners'          //吃喝玩乐首页轮播图
			},
			servicePhone: 'service_tel/index',      //服务电话
			notice: 'announcement/index',                 //首页公告
			allSite: 'line/line_station_list',          //所有站点列表
			message: 'auto_response',             //自动回复
			suggest: 'complain/add',              //投诉建议
			searchSite: "station/peer_to_peer",  //查询线路
			siteDetail: "station/detail",             //站点详情
			nearby: "station/nearby_staiton_info", //最近的站点
			get_serviceInfo: "setting/serviceInfo", //获取项目简介
			get_activity: "market_active/index",  //获取活动列表
			get_activity_detail: "market_active/detail",  //获取活动详情
			get_store: "market_store/index", //获取商家列表
			get_store_detail: "market_store/detail", //获取商家详情
			get_floor_list: "market_store/floor_list", //获取楼层列表
			get_brand_list: "market_store/class_list", //获取品牌列表
			channel_bind: "channel/channel_bind",
		},

		//正在网络请求的数量
		requestNumber: 0,

		//站点信息
		site: {
			allSiteData: {},    //未处理过的站点列表
			shopSiteIdArr: [],  //shop站点id列表
			shopSite: [],      //shop站点列表
			siteIdArr: [],      //站点id列表
			allSite: [[], []],  //所有站点列表
			siteIdArr2: [[{ name: "全部", station_id: 'false' }]], //站点id列表2
			allSite2: [["全部"], [["全部"]]],  //所有站点列表2
            lineid: []
		},

		//监视用户身份令牌是否在请求中，防止多次同时请求（同步锁）
		sessionKeyRequest: false,

		// 地图搜索关键字
		map_keyword: '',
	},
	onLaunch() {
		//获取所有站点信息
		this.getAllSite()
        this.get_user_location()
	},

    get_user_location () {
        //获取用户位置
        var userInfo = {}
        if (wx.getStorageSync("userInfo")) userInfo = wx.getStorageSync("userInfo")
        wx.getLocation({
            success: res => {
                userInfo.lat = res.latitude
                userInfo.lng = res.longitude
                wx.setStorageSync("userInfo", userInfo)
            },
            fail: e => {
                console.log(e)
                wx.showModal({
                    title: '温馨提示',
                    content: "无法获取位置，部分功能将受限，是否去更改？",
                    success: res => {
                        if (res.confirm) {
                            //打开设置
                            wx.openSetting({
                                success: res => {
                                    //再次获取
                                    wx.getLocation({
                                        success: res => {
                                            userInfo.lat = res.latitude
                                            userInfo.lng = res.longitude
                                            wx.setStorageSync("userInfo", userInfo)
                                        }
                                    })
                                }
                            })
                        }
                    }
                })
            }
        })
    },

	//建立连接并发起网络请求
	ajax(url, method, data, successFn, setLoading, errFn, header) {
		// var fn = res => {
		// 	if (!this.globalData.sessionKeyRequest) {
		// 		this.globalData.sessionKeyRequest = true
		// 		//用户身份令牌不存在时
		// 		if (!wx.getStorageSync("sessionKey")) {
		// 			wx.login({
		// 				success: res => {
		// 					//拿到微信code与后台建立连接
		// 					if (res.code) {
		// 						wx.request({
		// 							url: this.globalData.servicePath + this.globalData.api.login,
		// 							data: { code: res.code },
		// 							header: { 'content-type': 'application/json' },
		// 							method: 'POST',
		// 							success: res => {
		// 								if (res.data.code == 200) {
		// 									//缓存用户身份令牌并发起网络请求
		// 									wx.setStorageSync("sessionKey", res.data.data.sessionKey)
		// 									this.request(url, method, data, successFn, setLoading, errFn, header)

		// 									this.globalData.sessionKeyRequest = false
		// 								} else {
		// 									wx.showToast({
		// 										title: '连接失败！' + res.data.msg
		// 									})
		// 									this.globalData.sessionKeyRequest = false
		// 								}
		// 							},
		// 							fail: e => {
		// 								wx.showToast({
		// 									title: '网络异常！'
		// 								})
		// 								this.globalData.sessionKeyRequest = false
		// 							}
		// 						})
		// 					} else {
		// 						wx.showToast({
		// 							title: '登录失败！' + res.errMsg
		// 						})
		// 						this.globalData.sessionKeyRequest = false
		// 					}
		// 				}
		// 			})
		// 		} else {
		// 			this.request(url, method, data, successFn, setLoading, errFn, header)
		// 			this.globalData.sessionKeyRequest = false
		// 		}
		// 	} else {
		// 		setTimeout(fn, 15)
		// 	}
		// }
		// fn()
		this.request(url, method, data, successFn, setLoading, errFn, header)
	},

	//网络请求
	request(url, method, data, successFn, setLoading, errFn, header) {
		//默认头部
		if (!header) {
			header = {
                'content-type': 'application/x-www-form-urlencoded'
            }
		}

		//默认参数
		data.sessionKey = wx.getStorageSync("sessionKey")
		var userInfo = {}
		if (wx.getStorageSync("userInfo")) userInfo = wx.getStorageSync("userInfo")
		if (userInfo.lat && userInfo.lng) {
			data.lat = userInfo.lat
			data.lng = userInfo.lng
		}

		//发起请求显示loading
		this.globalData.requestNumber++
		if (this.globalData.requestNumber == 1) {
			var title = "加载中..."
			if (setLoading && setLoading.title) title = setLoading.title
			if (!setLoading || (setLoading && !setLoading.close)) {
				wx.showLoading({
					title: title
				})
			}
		}
		wx.request({
			url: url,
			data: data,
			method: method,
			header: header,
			success: res => {
				//请求结束隐藏loading
				this.globalData.requestNumber--
				if (this.globalData.requestNumber == 0) wx.hideLoading()

				if (res.data.code == 99999) {
					//用户身份令牌过期时，清除用户身份令牌缓存重新建立连接
					wx.setStorageSync("sessionKey", false)
					this.ajax(url, method, data, successFn, setLoading, errFn, header)

				} else if (res.data.code != 200) {
					wx.showToast({
						title: res.data.msg,
					})
				} else if (successFn) {
					successFn(res.data)
				}
			},
			fail: e => {
				//请求结束隐藏loading
				this.globalData.requestNumber--
				if (this.globalData.requestNumber == 0) wx.hideLoading()

				if (errFn) {
					errFn(e)
				} else {
					wx.showToast({
						title: '网络异常！'
					})
				}
			}
		})
	},

    login () {
        const self = this
        wx.login({
            success (e) {
                let code = e.code
                wx.getUserInfo({
                    success (res) {
                        let { iv, encryptedData} = res
                        self.http('get', {
                            code, iv, encryptedData
                        }, '/api/wx_login').then(res => {
                            wx.setStorageSync('sessionKey', res.data.sessionKey)
                            wx.setStorageSync('userdata', res.data)
                            if (self.callback) {
                                self.callback()
                            }
                        }).catch(res => {
                            // todo
                        })
                    }
                })
            }
        })
    },

    http (method, data, url) {
        var self = this
        var userInfo = {}
        method = method == 'get' ? 'GET' : 'POST'
        data.sessionKey = wx.getStorageSync("sessionKey")
        if (wx.getStorageSync("userInfo")) userInfo = wx.getStorageSync("userInfo")
        if (userInfo.lat && userInfo.lng) {
            data.lat = userInfo.lat
            data.lng = userInfo.lng
        }
        return new Promise((resolve, reject) => {
            wx.request({
                url: self.globalData.baseUrl + url, //仅为示例，并非真实的接口地址
                data, method,
                header: {
                    'content-type': 'application/x-www-form-urlencoded' // 默认值
                    // 'content-type': 'application/json' // 默认值
                },
                success(res) {
                    if (res.data.code == 200) {
                        resolve(res.data)
                    } else {
                        reject(res.data)
                    }
                },
                fail (res) {
                    reject(res.data)
                }
            })
        })
    },

	//获取所有站点列表
	getAllSite() {
		var site = this.globalData.site
		// var url = this.globalData.servicePath + this.globalData.api.allSite
        var url = this.globalData.servicePathtest + this.globalData.api.allSite
        var line = []
		this.ajax(url, "GET", {}, res => {
			site.allSiteData = res.data
			var i = 0
			for (var index in res.data) {

                this.globalData.site.lineid.push({
                    id: res.data[index][0].line_id,
                    name: index
                })

                let line_point = {
                    title: index,
                    id: res.data
                }
                line.push({
                    title: index,
                    // color: rgb()
                })
                
				site.allSite[0][i] = index
				site.allSite2[0][i + 1] = index
				var arr = []
				var arrId = []
				for (var j = 0; j < res.data[index].length; j++) {
					arr[j] = res.data[index][j].name
					arrId[j] = res.data[index][j]
				}
				// site.allSite[1][i] = arr
                site.allSite[1][index] = arr
				site.allSite2[1][i + 1] = arr
                if (index == '4号线') {
					site.shopSite = ["全部站点"].concat(arr)
					site.shopSiteIdArr = [{ station_id: 'false', name: '全部站点' }].concat(arrId)
				}
				site.siteIdArr[i] = arrId
				site.siteIdArr2[i + 1] = arrId
				i++
			}
            this.globalData.line = line
		})
		//未处理过的站点列表
		// console.log(site.allSiteData)

		//shop站点id列表
		// console.log(site.shopSiteIdArr)

		//shop站点列表
		// console.log(site.shopSite)

		//站点id列表
		// console.log(site.siteIdArr)

		//所有站点列表
		// console.log(site.allSite)

		//站点id列表2
		// console.log(site.siteIdArr2)

		//所有站点列表2
		// console.log(site.allSite2)
	}
})