// pages/sign/luck_draw.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        x: '',
        y: '',
        index: 0,
        is_begin: false,
        timer: 0.2,
        timing: 5, // 抽奖结束时间
        animation: false,
        number: 0, // 中奖号码
        form: {
            name: '',
            tel: ''
        },
        popupVisible: false,
        list: [],
        goodslist: [],
        loading: false,
        luck_info: null,
        result: null,
        need: 0,
        luck_id: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.goods()
        this.getrecode()
        this.need()
    },

    need () {
        app.http('post', {}, '/api/luckdraw/getIntegral').then(res => {
            this.setData({
                need: res.data.intrgral
            })
        }).catch(error => {
            // TODO
        })
    },

    input (e) {
        let key = e.currentTarget.dataset.key
        this.setData({
            [key]: e.detail.value
        })
    },

    getrecode() {
        if (this.data.loading) {
            return
        }
        this.data.loading = true
        app.http('post', {
            page: Math.ceil(this.data.list.length / 10) + 1
        }, '/api/luckdraw/userreward_log').then(res => {
            this.data.loading = false
            wx.stopPullDownRefresh()
            this.setData({
                list: this.data.list.concat(res.data.data.data)
            })
        })
    },

    goods() {
        app.http('post', {}, '/api/luckdraw/goods').then(res => {
            res.data.splice(4, 0, '')
            this.setData({
                goodslist: res.data
            })
        })
    },

    get_luck () {
        if (this.data.form.name == '' && this.data.result.is_info == 2) {
            wx.showToast({
                title: '请输入姓名',
                icon: 'none'
            })
            return
        }
        if (this.data.form.phone == '' && this.data.result.is_info == 2) {
            wx.showToast({
                title: '请输入电话号码',
                icon: 'none'
            })
            return
        }
        let data = { ...this.data.form}
        data.reward_log_id = this.data.luck_id
        app.http('post', data, '/api/luckdraw/receive').then(res => {
            wx.showToast({
                title: res.data,
                icon: 'none'
            })
            this.setData({
                popupVisible: false
            })
            this.setData({
                list: []
            }, () => {
                this.getrecode()
            })
            // todo
            this.cancel()
        }).catch(error => {
            wx.showToast({
                title: error.msg,
                icon: 'none'
            })
        })
    },

    cancel (e) {
        this.setData({
            x: '',
            y: '',
            index: 0,
            is_begin: false,
            timer: 0.2,
            timing: 5, // 抽奖结束时间
            animation: false,
            number: 0, // 中奖号码
            popupVisible: false
        })
        // if (this.data.result.is_info == 1 && e) {
        //     this.get_luck()
        // }
    },

    draw(e) {
        this.data.form = {
            name: '',
            tel: '',
        }
        this.data.luck_id = ''
        let index = e.currentTarget.dataset.index
        if (index == 4) {
            this.setData({
                result: null
            })
            this.setData({
                is_begin: true
            })
            app.http('post', {}, '/api/luckdraw/clickstart').then(res => {
                this.data.animation = true
                this.begin()
                this.setData({
                    result: res.data
                })
                this.data.goodslist.map((item, index) => {
                    if (item.id == res.data.goods_id) {
                        this.setData({
                            number: res.data.goods_id,
                            luck_info: item,
                            luck_id: res.data.reward_log_id
                        })
                        setTimeout(() => {
                            this.end()
                        }, this.data.timing * 1000)
                    }
                })
            }).catch(error => {
                wx.showToast({
                    title: error.msg,
                    icon: 'none'
                })
            })
        }
    },

    end () {
        this.data.animation = false
    },
    
    begin() {
        var self = this
        let arr = [
            { x: '0', y: '0' },
            { x: '100%', y: '0' },
            { x: '200%', y: '0' },
            { x: '200%', y: '100%' },
            { x: '200%', y: '200%' },
            { x: '100%', y: '200%' },
            { x: '0', y: '200%' },
            { x: '0', y: '100%' }
        ]
        this.setData(arr[this.data.index])
        if (this.data.animation) {
            this.setData({
                timer: this.data.timer - 0.015
            })
        } else {
            this.setData({
                timer: this.data.timer + 0.02
            })
            if (this.data.timer >= 0.3) {
                this.setData({
                    timer: 0.3
                })
            }
            // 停止
            var luck_index = 0
            switch (this.data.index) {
                case 0:
                    luck_index = 0
                    break
                case 1:
                    luck_index = 1
                    break
                case 2:
                    luck_index = 2
                    break
                case 3:
                    luck_index = 5
                    break
                case 4:
                    luck_index = 8
                    break
                case 5:
                    luck_index = 7
                    break
                case 6:
                    luck_index = 6
                    break
                case 7:
                    luck_index = 3
                    break
            }
            if (this.data.timer == 0.3 && this.data.goodslist[luck_index].id == this.data.number) {
                // console.log('抽奖结束')
                if (this.data.result.receive) {
                    setTimeout(() => {
                        this.setData({
                            popupVisible: true
                        })
                    }, 500)
                } else {
                    wx.showModal({
                        title: '提示',
                        content: '很遗憾，您没有中奖，谢谢参与！',
                        showCancel: false,
                        success(res) {
                            if (res.confirm) {
                                self.cancel()
                            }
                        }
                    })
                }
                return
            }
        }
        if (this.data.timer < 0.05) {
            this.setData({
                timer: 0.05
            })
        }
        this.data.index++
        if (this.data.index > 7) {
            this.data.index = 0
        }
        var loop = setTimeout(() => {
            this.begin()
        }, this.data.timer * 1000)
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
        this.setData({
            list: []
        }, res => {
            this.getrecode()
        })
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        this.getrecode()
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})