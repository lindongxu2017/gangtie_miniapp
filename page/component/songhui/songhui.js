Page({
	data: {
		list: [
			{
				url: '/page/component/member/member',
				title: "会员专区",
				icon: '/image/songhui_item_2.png',
				id: 1,
			},
			{
				url: '/page/component/brand_search/brand_search',
				title: "品牌搜索",
				icon: '/image/songhui_item_8.png',
				id: 2,
			},
			{
				url: '/page/component/store_selected/store_selected',
				title: "商家精选",
				icon: '/image/songhui_item_6.png',
				id: 3,
			},
			{
				url: '/page/component/market_activity/market_activity',
				title: "商场活动",
				icon: '/image/songhui_item_3.png',
				id: 4,
			},
			{
				url: '',
				title: "排队订位",
				icon: '/image/songhui_item_5.png',
				id: 5,
			},
			{
				url: '/page/component/WIFI/WIFI',
				title: "WIFI",
				icon: '/image/songhui_item_4.png',
				id: 6,
			},
			{
				url: '/page/component/map/map',
				title: "地图导航",
				icon: '/image/songhui_item_7.png',
				id: 7,
			},
			{
				url: '/page/component/parking/parking',
				title: "停车缴费",
				icon: '/image/songhui_item_9.png',
				id: 8,
			},
			{
				url: '/page/component/project_introduction/project_introduction',
				title: "项目简介",
				icon: '/image/songhui_item_1.png',
				id: 9,
			},
		],
	},
	hint() {
		wx.showToast({
			title: '敬请期待',
			icon: 'none',
		});
	},
});