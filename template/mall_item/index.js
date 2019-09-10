// template/mall_item/index.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        info: {
            type: Object,
            value: {}
        }
    },

    /**
     * 组件的初始数据
     */
    data: {

    },

    /**
     * 组件的方法列表
     */
    methods: {
        godetail() {
            wx.navigateTo({
                url: '/pages/mall_news_detail/index?id=' + this.data.info.id,
            })
        }
    }
})
