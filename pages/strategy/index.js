// pages/strategy/index.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        content: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if (options.id) {
            this.getinfo(options.id, options.api)
            wx.setNavigationBarTitle({
                title: options.title,
            })
        }
    },

    getinfo (id, api) {
        app.http('post', { id }, api).then(res => {
            if (res.data) {
                let str = res.data.data || res.data
                this.setData({
                    content: str.replace(/\<img/gi, '<img style="width:100%;height:auto;display: block;" ')
                })
            }
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