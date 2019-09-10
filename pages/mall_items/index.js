// pages/mall-detail/index.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        info: {},
        id: '',
        tabActive: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if (options.id) {
            this.data.id = options.id
            this.getdetail()
        }
    },

    getdetail () {
        app.http('post', { market_id: this.data.id }, '/api/market/market_details').then(res => {
            res.data.info.detail = res.data.info.detail.replace(/\<img/gi, '<img style="width:100%;height:auto;display: block;" ')
            res.data.info.tour = res.data.info.tour.replace(/\<img/gi, '<img style="width:100%;height:auto;display: block;" ')
            this.setData({
                info: res.data.info
            })
        })
    },

    switchTab (e) {
        let index = e.currentTarget.dataset.index
        this.setData({
            tabActive: index
        })
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