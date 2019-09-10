// pages/sign/index.js
const app = getApp()
Page({
    data: {
        is_sign: false,
        signed_day: 0,
        signed_score: 0,
        show_popup: false,
        current_score: 0,
        goodslist: [],
        recode: [],
        rules: ''
    },
    onLoad: function (options) {
        this.is_sign()
        // if (wx.getStorageSync('userdata')) {
        //     this.setData({
        //         current_score: wx.getStorageSync('userdata').integral || 0
        //     })
        // }
        this.goods()
        this.getrecode()
        this.rules()
    },

    luckdraw () {
        wx.navigateTo({
            url: './luck_draw',
        })
    },

    getrecode () {
        
        app.http('post', {}, '/api/user/sign_day_integral').then(res => {
            this.setData({
                recode: res.data
            })
        })
    },

    goods () {
        app.http('post', {}, '/api/luckdraw/goods').then(res => {
            this.setData({
                goodslist: res.data
            })
        })
    },

    rules () {
        app.http('get', {}, '/api/user/integral_rule').then(res => {
            this.setData({
                rules: res.data.rule.replace(/\<img/gi, '<img style="width:100%;height:auto;display: block;" ')
            })
        })
    },

    is_sign () {
        app.http('post', {}, '/api/user/check_user_sign').then(res => {
            this.setData({
                signed_day: res.data.sign_day
            })
        }).catch(res => {
            if (res.code == 99999) {
                app.callback = res => {
                    this.is_sign()
                }
                app.login()
                return
            }
            this.setData({
                is_sign: true,
                signed_day: res.data.sign_day
            })
        })
    },

    sign () {
        if (!this.data.is_sign) {
            app.http('post', {}, '/api/user/sign').then(res => {
                this.setData({
                    is_sign: true,
                    signed_day: res.data.sign_day,
                    signed_score: res.data.integral,
                    show_popup: true,
                    current_score: this.data.current_score + res.data.integral
                })
            }).catch(res => {
                wx.showToast({
                    title: res.msg,
                    icon: 'none'
                })
            })
        }
    },

    closePopup () {
        this.setData({
            show_popup: false
        })
    },

    onShow: function () {
        app.http('get', {}, '/api/user/userinfo').then(res => {
            if (res.data.integral) {
                this.setData({
                    current_score: res.data.integral
                })
            }
        })
    },

    onReachBottom: function () {

    },

    onShareAppMessage: function () {

    }
})