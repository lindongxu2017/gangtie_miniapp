// pages/store/index.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        list: [],
        loading: false,
        type: 1
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if (options.type == 2) {
            this.data.type = 2
        }
        this.getlist()
    },

    golink (e) {
        wx.navigateTo({
            url: '/pages/mall_items/index?id=' + e.currentTarget.dataset.id,
        })
    },

    getlist () {
        if (this.data.loading) return
        this.data.loading = true
        let api = '/api/market/market_list'
        if (this.data.type == 2) {
            api = '/api/strategy/index'
        }
        app.http('post', {
            page: Math.ceil(this.data.list.length / 15) + 1,
        }, api).then(res => {
            this.data.loading = false
            wx.stopPullDownRefresh()
            if (this.data.type == 2) {
                res.data.data.map((item, index) => {
                    item.intro = item.intro.replace(/\<img/gi, '<img style="width:100%;height:auto;display: block;" ')
                })
            } else {
                res.data.map((item, index) => {
                    item.intro = item.intro.replace(/\<img/gi, '<img style="width:100%;height:auto;display: block;" ')
                    console.log(item.intro)
                })
            }
            let arr = this.data.list.concat(this.data.type == 2 ? res.data.data : res.data)
            this.setData({
                list: arr
            })
        }).catch(res => {
            this.data.loading = false
            wx.stopPullDownRefresh()
        })
    },

    godetail (e) {
        let item = e.currentTarget.dataset.item
        if (this.data.type == 2) {
            wx.navigateTo({
                url: '/pages/mall_items/index?id=' + item.id,
            })
            return
        }
        wx.navigateTo({
            url: '/pages/mall_detail/index?id=' + item.market_id,
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