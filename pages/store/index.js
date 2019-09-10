// pages/store/index.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        list: [],
        loading: false,
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

    getlist () {
        if (this.data.loading) {
            return
        }
        this.data.loading = true
        app.http('post', {
            id: this.data.id,
            page: Math.ceil(this.data.list.length / 10) + 1
        }, '/api/station/servier_facilities').then(res => {
            this.setData({
                loading: false,
                list: this.data.list.concat(res.data.data)
            })
        }).catch(error => {
            this.data.loading = false
        })
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
        })
        this.getlist()
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        this.getlist()
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})