var app = getApp()
Page({
	data: {
		windowHeight: 0,
		input: "",
		value: '',
		scrollTop: 0,
		keyHeight: 0,
		message: [
			{
				isUser: false,
				url: "/image/gangtie.png",
				content: "您好，出行助手为您服务"
			}
		],
	},
	onLoad() {
		wx.getSystemInfo({
			success: res => {
				this.setData({
					windowHeight: res.windowHeight,
				})
			}
		})
		if (wx.getStorageSync("assistantMessage")) {
			this.setData({
				message: wx.getStorageSync("assistantMessage")
			})
			this.setScrollTop()
		}
	},
    route (e) {
        let item = e.currentTarget.dataset.item
        console.log(item)
        app.http('post', { id: item.id }, '/api/click_response').then(res => {
            // console.log(res)
        }).catch(error => {
            // todo
        })
        wx.navigateTo({
            url: item.path,
        })
    },
	input(e) {
		this.setData({
			input: e.detail.value,
		})
	},
	sendOut() {
		if (this.data.input.length != 0) {
			var message = this.data.message
			var content = this.data.input
			message.push({
				isUser: true,
				url: wx.getStorageSync("userInfo").avatarUrl,
				content: content
			})
			this.setData({
				input: "",
				value: "",
				message: message
			})
			this.setScrollTop()
			//自动回复
			// var url = app.globalData.servicePath + app.globalData.api.message
            var url = app.globalData.servicePathtest + app.globalData.api.message
			var data = { content: content }
			var setLoading = { close: true }
			app.ajax(url, "POST", data, res => {
                // res.data.map((item, index) => {
                //     message.push({
                //         isUser: false,
                //         url: "/image/gangtie.png",
                //         content: item.content,
                //         path: item.path,
                //         type: item.type,
                //         id: item.id
                //     })
                // })
				message.push({
					isUser: false,
					url: "/image/gangtie.png",
					content: res.data.content,
					path: res.data.path,
					type: res.data.type
				})
				this.setData({
					message: message
				})
				this.setScrollTop()
			}, setLoading)
		}
	},
	focus(e) {
		if (e.detail.height) {
			wx.createSelectorQuery().select('#scroll').boundingClientRect(res => {
				var scrollHeight = res.height
				wx.createSelectorQuery().select('#scrollView').boundingClientRect(res => {
					var scrollTop = scrollHeight - res.height + e.detail.height
					if (scrollTop > 0) {
						this.setData({
							keyHeight: e.detail.height,
							scrollTop: scrollTop
						})
						var fn = res => {
							wx.createSelectorQuery().select('#scrollView').boundingClientRect(res => {
								if (this.data.windowHeight - e.detail.height - 50 == res.height) {
									this.setData({
										scrollTop: scrollTop
									})
								} else {
									setTimeout(fn, 15)
								}
							}).exec()
						}
						fn()
					} else {
						this.setData({
							keyHeight: e.detail.height
						})
					}
				}).exec()
			}).exec()
		}
	},
	blur() {
		this.setData({
			keyHeight: 0
		})
	},
	setScrollTop() {
		wx.setStorageSync("assistantMessage", this.data.message)
		wx.createSelectorQuery().select('#scroll').boundingClientRect(res => {
			var scrollHeight = res.height
			wx.createSelectorQuery().select('#scrollView').boundingClientRect(res => {
				var scrollTop = scrollHeight - res.height
				if (scrollTop > 0) {
					this.setData({
						scrollTop: scrollTop
					})
				}
			}).exec()
		}).exec()
	},
	hint(){
		wx.showModal({
			content: '敬请期待',
			showCancel: false
		})
	}
})