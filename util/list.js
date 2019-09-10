// 列表js

var app = getApp()

// 米转千米
function mToKm(distance) {
    if (distance >= 1000) return (distance / 1000).toFixed(1) + "k"
    else return distance.toFixed(0)
}

// 获取列表与上拉加载
function getList(that, url, data, isReachBottom) {

    // 不是上拉加载就初始化
    if (!isReachBottom) {
        that.setData({
            total: -1,
            page: 1
        })
    }

    // that必有的三个变量，列表，总数，页数；total初始值为-1以保证第一次请求时不等于list的长度
    var list = that.data.list
    var total = that.data.total
    var page = that.data.page

    if (list.length == total) {

        // 列表长度达到最大长度不再请求
        // wx.showToast({
        // 	title: '没有更多数据了',
        // })

    } else {

        // 默认参数
        data.page = page

        // 发起请求
        app.ajax(url, "GET", data, res => {
            // 判断列表是否存在distance变量，存在则执行mToKm函数
            if (res.data.data[0] && res.data.data[0].distance) {
                for (var i = 0; i < res.data.data.length; i++) {
                    res.data.data[i].distance = mToKm(res.data.data[i].distance)
                }
            }

            // 返回数据为空时
            if (res.data.data.length == 0) {
                // wx.showToast({
                // 	title: '没有更多数据了',
                // })
            }

            // 页数为1时赋值，其他连接
            if (page == 1) {
                list = res.data.data
            } else {
                list = list.concat(res.data.data)
            }

            // 给that赋值
            that.setData({
                list: list,
                page: ++page,
                total: res.data.total
            })

            //如果不是上拉加载，则更新列表后回顶
            if (!isReachBottom) {
                wx.pageScrollTo({
                    scrollTop: 0,
                    duration: 0
                })
            }
        })
    }
}

// 获取商铺列表与上拉加载
function getStoreList(that, isReachBottom, param = {}) {
    // var url = app.globalData.servicePath + app.globalData.api.eat.storeList
    var url = app.globalData.servicePathtest + app.globalData.api.eat.storeList
    var data = param;
    if (that.data.navId) data.cate_id = that.data.navId // 美食、娱乐、购物、银行
    if (that.data.navIndex2 == 0) { // 距离最近
        data.fieldtype = 1
        data.orderby = 'asc'
    }
    if (that.data.navIndex2 == 1 || that.data.is_newshop) data.is_newshop = 1 // 新铺推荐
    if (that.data.navIndex2 == 2) data.is_special_offer = 1 // 优惠活动
    if (that.data.search) data.search = that.data.search // 搜索
    if (that.data.brand_id) data.brand_id = that.data.brand_id // 品牌选择
    if (that.data.station_id != "false") data.station_id = that.data.station_id // 站点选择
    if (that.data.in_station) data.in_station = that.data.in_station // 站内商铺
    that.data.month_new_shop = data.type
    getList(that, url, data, isReachBottom)
}

module.exports = {
    getList: getList, // 获取列表
    getStoreList: getStoreList // 获取商铺列表
}