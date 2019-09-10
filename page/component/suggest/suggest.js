var app = getApp()
Page({
	data: {
		nameInput: "",
		nameValue: "",
		phoneInput: "",
		phoneValue: "",
		contentInput: "",
		contentValue: "",
	},
	nameInput(e) {
		this.setData({
			nameInput: e.detail.value
		})
	},
	phoneInput(e) {
		this.setData({
			phoneInput: e.detail.value
		})
	},
	contentInput(e) {
		this.setData({
			contentInput: e.detail.value
		})
	},
	submit() {
		var re = /^[1][3,4,5,6,7,8][0-9]{9}$/
		if (this.data.nameInput != '' && re.test(this.data.phoneInput) && this.data.contentInput.length >= 5) {
      var url = app.globalData.servicePath + app.globalData.api.suggest
			var data = {
				content: this.data.contentInput,
				name: this.data.nameInput,
				mobile: this.data.phoneInput,
			}
			var setLoading = { title: "提交中..." }
			app.ajax(url, "POST", data, res => {
				this.setData({
					nameInput: "",
					nameValue: "",
					phoneInput: "",
					phoneValue: "",
					contentInput: "",
					contentValue: "",
				})
				wx.showToast({
					title: '提交成功',
				})
			}, setLoading)
		} else if (this.data.nameInput == "") {
			wx.showToast({
				title: '请输入您的名字',
			})
		} else if (!re.test(this.data.phoneInput)) {
			wx.showToast({
				title: '手机号码不正确',
			})
		} else if (this.data.contentInput.length < 5) {
			wx.showToast({
				title: '至少5个字哦',
			})
		}
	}
})