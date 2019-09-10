// pages/mall_detail/index.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        info: {},
        list: [],
        id: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if (options.id) {
            this.data.id = options.id
            this.getlist()
        }
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

    getlist () {
        app.http('post', {
            market_id: this.data.id
        }, '/api/market/market_details').then(res => {
            if (JSON.stringify(this.data.info) == '{}') {
                res.data.info.intro = res.data.info.intro.replace(/\<img/gi, '<img style="width:100%;height:auto;display: block;" ')
                this.setData({
                    info: res.data.info
                })
            }
            this.setData({
                list: res.data.list
            })
        }).catch(res => {
            // todo
        })
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
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})