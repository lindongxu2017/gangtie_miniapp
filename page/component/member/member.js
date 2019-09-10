Page({
	data: {
		src: 'https://gangtie.qinhantangtop.com/public/images/qrcode.jpg'
	},
	//预览图片
	previewImage(e) {
		wx.previewImage({
			current: this.data.src,
			urls: [this.data.src],
		});
	},
})