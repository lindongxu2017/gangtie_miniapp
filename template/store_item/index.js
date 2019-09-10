const app = getApp()
Component({
    properties: {
        info: {
            type: Object,
            value: {},
            obverse: function (newVal, oldVal, changePath) {
                console.log(newVal)
            }
        },
    },

    data: {}, // 私有数据，可用于模板渲染

    lifetimes: {
        // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
        attached: function () { },
        moved: function () { },
        detached: function () { },
    },

    methods: {
        godetail () {
            wx.navigateTo({
                url: '/pages/mall_news_detail/index?id=' + this.data.info.id,
            })
        }
    }

})
