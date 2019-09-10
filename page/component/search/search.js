var app = getApp()
Page({
	data: {
		info: [],
		arrs: [],

		time: 0,
		price: 0,
		start_station_id: '',
		end_station_id: '',
		typeList: [
			{
				title: '更省时',
				type: 1
			},
			{
				title: '少换乘',
				type: 2
			}
		],
		type: 1,
	},
	onLoad(options) {
		// var multiList = [
		// 	{
		// 		id: '',
		// 		multiValue: '请选择起点站'
		// 	},
		// 	{
		// 		id: '',
		// 		multiValue: '请选择终点站'
		// 	}
		// ];
		// wx.setStorageSync('multiList', multiList);
		this.setData({
			start_station_id: options.start_station_id,
			end_station_id: options.end_station_id,
		})
		this.getLine()
        // this.getstationline()
	},
	typeTab(e) {
		this.setData({
			type: e.currentTarget.id
		})
		this.getLine()
	},
	getLine() {
        var url = app.globalData.servicePathtest + app.globalData.api.searchSite
		var data = {
			start_station_id: this.data.start_station_id,
			end_station_id: this.data.end_station_id,
			type: this.data.type
		}
		app.ajax(url, "POST", data, res => {
			var info = res.data.list
			if (info[1] && info[1].type != 4) info[0].line_id = info[1].line_id;
			var arrs = []
			var arr = {}
			info[0].direction = this.getDirection(info[1].line_id, info[0].name, info[1].name, true)
			arr.line = this.nubToLine(info[0].line_id)
			arr.color = this.getColor(info[0].line_id)
			arr.len = 1
			var lastLine_id = info[0].line_id
			for (var i = 1; i < info.length; i++) {
				if (info[i].line_id == lastLine_id) {
					arr.len++
				} else {
					info[i - 1].direction = this.getDirection(info[i].line_id, info[i - 1].name, info[i].name, false)
					arrs.push(arr)
					lastLine_id = info[i].line_id
					var arr = {}
					arr.len = 1
				}
                arr.line = info[i].line_name // this.nubToLine(info[i].line_id)
                arr.color = info[i].line_color // this.getColor(info[i].line_id)
			}
			arrs.push(arr)
			if (arrs.length == 1) {
				arrs[0].height = -5 + (arrs[0].len - 1) * 30 - 5
				arrs[0].top = 12
			} else {
				for (var j = 0; j < arrs.length; j++) {
					if (j == 0) {
						arrs[j].height = -5 + (arrs[j].len - 2) * 30 + 43
						arrs[j].top = 12
					} else if (j == arrs.length - 1) {
						arrs[j].height = 43 + (arrs[j].len - 1) * 30 - 5
						arrs[j].top = arrs[j - 1].top + arrs[j - 1].height
					} else {
						if (arrs[j].len == 1) {
							arrs[j].height = 43
						} else {
							arrs[j].height = 43 + (arrs[j].len - 2) * 30 + 43
						}
						arrs[j].top = arrs[j - 1].top + arrs[j - 1].height
					}
				}
			}
            console.log(arr)
			console.log(arrs)
			console.log(info)
			this.setData({
				info: info,
				arrs: arrs,
				price: res.data.price,
				time: res.data.time
			})
			wx.pageScrollTo({
				scrollTop: 0,
				duration: 0
			})
		})
	},
	getColor(nub) {
        console.log(nub)
		if (nub == 1) {
			return "#0fb256"
		} else if (nub == 2) {
			return "#b05408"
		} else if (nub == 3) {
			return "#06a4ce"
		} else if (nub == 4) {
			return "#e30502"
		} else if (nub == 5) {
			return "#9d4baa"
		} else if (nub == 6) {
			return "#0c33ab"
		} else if (nub == 7) {
			return "#896b70"
		} else if (nub == 8) {
			return "#6c1b3c"
		}
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
	getDirection(line, current, after, start) {
		var str = '换乘'
		if (start) str = '乘坐'
		// var arr = app.globalData.site.allSite[1][line - 1]
        // console.log(line, current, after, start)
        // console.log(app.globalData.site.lineid)
        // console.log(app.globalData.site.allSite)
        app.globalData.site.lineid.map((item, index) => {
            if (line == item.id) {
                line = item.name
            }
        })
		// var arr = app.globalData.site.allSite[1][line - 1]
        console.log(app.globalData.site.allSite[1], line)
		var arr = app.globalData.site.allSite[1][line]
		for (var i = 0; i < arr.length; i++) {
			if (arr[i] == current) var before = i
			if (arr[i] == after) var after = i
		}
		if (before > after) {
			return "（" + str + this.nubToLine(line) + "号线往" + arr[0].replace("站", "") + "方向）"
		} else {
			return "（" + str + this.nubToLine(line) + "号线往" + arr[arr.length - 1].replace("站", "") + "方向）"
		}
	}
})