// page/component/assistant_2/index.js
const app = getApp()
Page({
    data: {
        value: '',
        list: [],
        current_type: '',
        init_question: [],
        scrollTop: 0
    },

    onLoad: function (options) {
        if (wx.getStorageSync('userInfo').lat) {
            this.get_question()
        } else {
            app.get_user_location()
            var timer = setInterval(() => {
                if (wx.getStorageSync('userInfo').lat) {
                    clearInterval(timer)
                    this.get_question()
                }
            }, 500)
        }
    },

    input (e) {
        this.setData({
            value: e.detail.value
        })
    },

    scrollTolower () {
        this.setData({
            scrollTop: this.data.scrollTop + 1000
        })
    },

    focus () {

    },

    get_question () {
        app.http('post', {}, '/api/getGuide').then(res => {
            let key = 'list[' + this.data.list.length + ']'
            this.setData({
                [key]: {
                    data_type: -1,
                    content: '您好，我是你的智能客服',
                    subtitle: '您需要了解哪些信息呢？',
                    list: res.data
                },
                init_question: res.data
            })
            this.scrollTolower()
        }).catch(error => {
            // todo
        })
    },

    golink (e) {
        let { item } = e.currentTarget.dataset
        if (item.path != '') {
            wx.navigateTo({
                url: item.path,
            })
        }
    },

    replay () {
        app.http('post', {
            content: this.data.value,
            type: this.data.current_type
        }, '/api/auto_response').then(res => {
            let key = 'list[' + this.data.list.length + ']'
            if (res.data.data_type == 2 && res.data.type == 1) { // 线路
                if (JSON.stringify(res.data.data) == '{}') {
                    this.setData({
                        [key]: {
                            content: "您的问题小助手暂时无法识别，小助手正在不断学习中......",
                            path: "",
                            type: 1
                        },
                        value: ''
                    })
                } else {
                    let url = app.globalData.servicePathtest + app.globalData.api.searchSite
                    let postdata = {
                        type: 1,
                        start_station_id: res.data.data.start_station.id,
                        end_station_id: res.data.data.end_station.id,
                    }
                    this.getLine(res.data.data, postdata)
                }
                this.scrollTolower()
                return
            }
            // 普通回复
            this.setData({
                [key]: res.data.data,
                value: ''
            })
            this.scrollTolower()
        }).catch(error => {
            wx.showToast({
                title: error.msg,
                icon: 'none'
            })
            this.setData({
                value: ''
            })
        })
    },

    getLine(info_data, postdata) {
        var url = app.globalData.servicePathtest + app.globalData.api.searchSite
        var data = postdata
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
            let key = 'list[' + this.data.list.length + ']'
            this.setData({
                [key]: {
                    type: 'line',
                    content: '以下是为您找到的地铁出行路线',
                    line: arrs,
                    info: info_data,
                    num: info.length
                },
                value: ''
            })
            this.scrollTolower()
            
        })
    },
    gosearch (e) {
        let item = e.currentTarget.dataset.item
        wx.navigateTo({
            url: '/page/component/search/search?start_station_id=' + item.info.start_station.id + '&end_station_id=' + item.info.end_station.id
        })
    },
    sendOut () {
        let bool = false
        bool = this.data.init_question.some((item, index) => {
            return item.number == this.data.value
        })
        if (bool) {
            this.setData({
                current_type: this.data.value
            })
        }
        let key = 'list['+this.data.list.length+']'
        this.setData({
            [key]: {
                data_type: 2,
                content: this.data.value
            }
        }, () => {
            this.replay()
        })
        this.scrollTolower()
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
        app.globalData.site.lineid.map((item, index) => {
            if (line == item.id) {
                line = item.name
            }
        })
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
    },

    onPullDownRefresh: function () {

    },
    onReachBottom: function () {

    },
    onShareAppMessage: function () {

    }
})