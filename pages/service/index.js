// pages/service/index.js
const app = getApp()
Page({

    data: {
        list: [],
        scale: 1,
        currentTarget: null,
        showForm: true,
        start_station_text: '起点',
        start_station_id: '',
        end_station_text: '终点',
        end_station_id: '',
        searchvalue: ''
    },

    onLoad: function (options) {
        this.getline()
        this.nearby_station()
    },

    onShow: function () {
        this.setData({
            start_station_text: '起点',
            start_station_id: '',
            end_station_text: '终点',
            end_station_id: '',
        })
    },

    nearby_station () {
        let fn = () => {
            app.http('post', {}, '/api/station/get_lately_station').then(res => {
                this.setData({
                    searchvalue: res.data.name
                }, () => {
                    this.search_station(1)
                })
            }).catch(error => {
                wx.showToast({
                    title: error.msg,
                    icon: 'none'
                })
            })
        }
        if (wx.getStorageSync('userInfo').lat) {
            fn()
        } else {
            app.get_user_location()
            var timer = setInterval(() => {
                if (wx.getStorageSync('userInfo').lat) {
                    clearInterval(timer)
                    fn()
                }
            }, 500)
        }
    },

    clsoepopup () {
        this.setData({
            showForm: false
        })
    },

    clearstorage () {
        wx.clearStorageSync()
    },

    servise (e) {
        let type = e.currentTarget.dataset.type
        if (type == 0) {
            wx.navigateTo({
                url: '/pages/store/index?id=' + this.data.currentTarget.id,
            })
            return
        }
        wx.navigateTo({
            url: '/page/component/orders/ordersList?index=' + type,
        })
    },

    searchinput (e) {
        this.setData({
            searchvalue: e.detail.value
        })
    },

    search_station (bool) {
        if (this.data.searchvalue == '') {
            return
        }
        app.http('post', { keyword: this.data.searchvalue }, '/api/station/search_station').then(res => {
            this.data.list.map((item, index) => {
                let key = 'list[' + index + '].is_active'
                this.setData({
                    [key]: false
                })
                if (item.id == res.data.id) {
                    this.setData({
                        [key]: true,
                        currentTarget: item
                    })
                }
            })
            if (!this.data.showForm) {
                this.setData({
                    showForm: bool ? false : true
                })
            }
        }).catch(error => {
            wx.showToast({
                title: error.msg,
                icon: 'none'
            })
        })
    },

    godetail (e) {
        let id = this.data.currentTarget.id
        let {api, title} = e.currentTarget.dataset
        app.http('post', { id }, api).then(res => {
            if (res.data) {
                wx.navigateTo({
                    url: '/pages/strategy/index?id=' + id + '&api=' + api + '&title=' + title,
                })
            }
        }).catch(error => {
            wx.showToast({
                title: error.msg,
                icon: 'none'
            })
        })
    },

    getline () {
        // if (wx.getStorageSync('map_point')) {
        //     this.setData({
        //         list: wx.getStorageSync('map_point')
        //     })
        //     return
        // }
        app.http('post', {}, '/api/station/station_list').then(res => {
            res.data.map((item, index) => {
                item.is_active = false
                item.x = parseInt(item.x_axis)
                item.y = parseInt(item.y_axis)
            })
            wx.setStorageSync('map_point', res.data)
            this.setData({
                list: res.data
            })
        })
    },

    goline () {
        wx.navigateTo({
            url: '/page/component/orders/ordersList',
        })
    },

    start_station () {
        this.setData({
            start_station_text: this.data.currentTarget.name || '起点',
            start_station_id: this.data.currentTarget.id
        })
        if (this.data.start_station_text == this.data.end_station_text) {
            this.setData({
                end_station_text: '终点',
                end_station_id: '',
            })
        }
        this.searchline()
    },

    end_station () {
        this.setData({
            end_station_text: this.data.currentTarget.name || '终点',
            end_station_id: this.data.currentTarget.id
        })
        if (this.data.start_station_text == this.data.end_station_text) {
            this.setData({
                start_station_text: '起点',
                start_station_id: ''
            })
        }
        this.searchline()
    },

    searchline () {
        if (this.data.end_station_text && this.data.end_station_text != '终点' && this.data.start_station_text && this.data.start_station_text != '起点') {
            wx.navigateTo({
                url: '/page/component/search/search?start_station_id=' + this.data.start_station_id + '&end_station_id=' + this.data.end_station_id,
            })
        }
    },

    reduce () {
        this.setData({
            scale: this.data.scale - 0.05
        })
        if (this.data.scale <= 0.5) {
            this.setData({
                scale: 0.5
            })
        }
    },

    plus () {
        this.setData({
            scale: this.data.scale + 0.05
        })
        if (this.data.scale >= 1 ) {
            this.setData({
                scale: 1
            })
        }
    },

    select (e) {
        let _index = e.currentTarget.dataset.index
        // this.data.list.map((item, index) => {
        //     let key = 'list[' + index + '].is_active'
        //     this.setData({
        //         [key]: false
        //     })
        //     if (_index == index) {
        //         this.setData({
        //             [key]: true,
        //             currentTarget: item
        //         })
        //     }
        // })
        let key = 'list[' + _index + '].is_active'
        this.setData({
            [key]: true,
            currentTarget: this.data.list[_index]
        })
        if (!this.data.showForm) {
            this.setData({
                showForm: true
            })
        }
    },

    mapmove () {
        // this.setData({
        //     showForm: false
        // })
    },

    onShareAppMessage: function () {

    }
})