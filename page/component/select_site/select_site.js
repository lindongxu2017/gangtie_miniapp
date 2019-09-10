var app = getApp();
Page({
	data: {
		windowHeight: 0,
		search: '',
		search_list: [],
		line_list: [
			// {
			// 	color: '#0fb256',
			// 	title: '1号线'
			// },
			// {
			// 	color: '#b05408',
			// 	title: '2号线'
			// },
			// {
			// 	color: '#06a4ce',
			// 	title: '3号线'
			// },
			// {
			// 	color: '#e30502',
			// 	title: '4号线'
			// },
			// {
			// 	color: '#9d4baa',
			// 	title: '5号线'
			// },
			// {
			// 	color: '#0c33ab',
			// 	title: '7号线'
			// },
			// {
			// 	color: '#896b70',
			// 	title: '9号线'
			// },
			// {
			// 	color: '#6c1b3c',
			// 	title: '11号线'
			// },
		],
		line_list_index: 0,
		site_list: [],
		site_type: 'start',
	},
	onLoad(options) {
		wx.getSystemInfo({
			success: res => {
				this.setData({
					windowHeight: res.windowHeight,
					site_type: options.site_type,
					site_id_arr: app.globalData.site.siteIdArr2,
					site_list: app.globalData.site.siteIdArr2[1],
				});
			},
		});
        this.setData({
            line_list: app.globalData.line
        })
	},
	getColor(nub) {
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
	search_site(search_list, key_word_arr, nub) {
		var site_info = app.globalData.site.siteIdArr2;
		var key_word = key_word_arr[nub];
		if (key_word != '站' && key_word != ""){
			for (var i = 1; i < site_info.length; i++) {
				for (var j = 0; j < site_info[i].length; j++) {
					if (site_info[i][j].name.indexOf(key_word) != -1) {
						var identical = false;
						var _k = 0;
						for (var k = 0; k < search_list.length; k++) {
							if (site_info[i][j].name == search_list[k].name) {
								identical = true;
								_k = k;
							}
						};
						if (!identical){
							site_info[i][j]['lines'] = [{
								title: this.nubToLine(i) + '号线',
								color: this.getColor(i),
								nub: i,
							}];
							search_list.push(site_info[i][j]);
						}else{
							var identical = false;
							for (var l = 0; l < search_list[_k].lines.length;l++){
								if (search_list[_k].lines[l].nub == i) identical= true;
							}
							if (!identical){
								search_list[_k].lines.push({
									title: this.nubToLine(i) + '号线',
									color: this.getColor(i),
									nub: i,
								})
							}
						}
					}
				};
			};
		}
		if (nub == key_word_arr.length - 1){
			this.setData({
				search_list: search_list,
			});
		}
	},
	search_site_buffer(){
		var search_list = [];
		var key_word_arr = this.data.search.split(" ");
		for (var i = 0; i < key_word_arr.length; i++) {
			this.search_site(search_list, key_word_arr, i);
		};
	},
	search(e) {
		this.setData({
			search: e.detail.value,
		});
		this.search_site_buffer();
	},
	search_close(e) {
		this.setData({
			search: '',
		});
		this.search_site_buffer();
	},
	line_list_index_tab(e) {
		this.setData({
			line_list_index: e.currentTarget.id,
			site_list: app.globalData.site.siteIdArr2[parseInt(e.currentTarget.id) + 1],
		});
	},
	select_site_close(e){
		var arr = e.currentTarget.id.split(',');
		var data = {
			site_type: arr[0],
			site_line: arr[1],
			site_name: arr[2],
			site_station_id: arr[3],
		};
		wx.setStorageSync('select_site', data);
		wx.navigateBack();
	},
});