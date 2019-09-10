// pages/suggest/index.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        tab_active: 0,
        type: [],
        type_column: [],
        type_multiIndex:[0, 0],
        type_active: 0,
        form: {
            content: '',
            name: '',
            contact: '',
            station: ''
        },
        multiArray: [],
        multiIndex: [0, 0],
        date: '',
        
        preViewList: [],
        imgArr: []

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getcategory()
        this.getline()
        var date = new Date()
        this.setData({
            date: date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
        })
    },
    
    uploadImg() {
        const self = this
        wx.chooseImage({
            count: 9,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success(res) {
                // tempFilePath可以作为img标签的src属性显示图片
                const tempFilePaths = res.tempFilePaths
                let arr = self.data.preViewList.concat(tempFilePaths)
                self.setData({ preViewList: arr })
                self.upload(tempFilePaths)
            }
        })
    },

    upload(arr) {
        const self = this
        wx.uploadFile({
            url: app.globalData.servicePathtest + 'feedback/uploadFild', // 仅为示例，非真实的接口地址
            filePath: arr[0],
            name: 'upload_img',
            header: {
                'content-type': 'application/json' // 默认值
            },
            success(res) {
                const data = JSON.parse(res.data)
                let imgArr = [].concat(self.data.imgArr)
                imgArr.push(data.data.baseurl)
                self.setData({
                    imgArr
                })
                arr.shift()
                if (arr.length > 0) {
                    self.upload(arr)
                }
            }
        })
    },

    preview(e) {
        const self = this
        let index = e.currentTarget.dataset.index
        wx.previewImage({
            current: self.data.preViewList[index], // 当前显示图片的http链接
            urls: self.data.preViewList // 需要预览的图片http链接列表
        })
    },

    del(e) {
        let index = e.currentTarget.dataset.index
        let arr = [].concat(this.data.preViewList)
        let imgArr = [].concat(this.data.imgArr)
        arr.splice(index, 1)
        imgArr.splice(index, 1)
        this.setData({
            preViewList: arr,
            imgArr
        })
    },

    submit () {
        let title = ''
        if (this.data.form.contact == '') title = '请输入联系方式'
        // if (this.data.date == 0) title = '请选择时间'
        // if (this.data.imgArr.length == 0) title = '请上传图片'
        if (this.data.form.name == '') title = '请输入姓名'
        // if (this.tab_active == 1 && this.data.form.staff_name == '') '请输入站务员名称'
        // if (this.data.form.content == '') title = '请输入评价内容'
        if (title) {
            wx.showToast({
                title: title,
                icon: 'none'
            })
            return
        }
        var postdata = {
            type: Number(this.data.tab_active) + 1,
            feedback_type_id: this.data.type[this.data.type_active].id,
            name: this.data.form.name,
            content: this.data.form.content,
            tel: this.data.form.contact,
            station_id: this.data.multiArray[1][this.data.multiIndex[1]].id,
            images: this.data.imgArr.join(','),
            datetime: this.data.date
        }
        if (this.data.tab_active == 1) {
            postdata.feedback_type_id = this.data.type_column[0][this.data.type_multiIndex[0]].id
            postdata.child_type_id = this.data.type_column[1][this.data.type_multiIndex[1]].id
        }
        if (this.data.tab_active == 0) {
            postdata.staff_name = this.data.form.staff_name
        }
        app.http('post', postdata, '/api/feedback/save_feed_back').then(res => {
            if (res.code == 200) {
                wx.showToast({
                    title: res.data,
                    icon: 'none'
                })
                setTimeout(() => {
                    wx.navigateBack()
                }, 1500)
            }
        })
    },

    bindDateChange (e) {
        this.setData({
            date: e.detail.value
        })
    },

    onHide () {
        wx.hideToast()
    },

    getline () {
        app.http('post', {}, '/api/feedback/line').then(res => {
            this.setData({
                'multiArray[0]': res.data
            }, () => {
                this.getstations()
            })
        })
    },

    getstations () {
        app.http('post', {
            id: this.data.multiArray[0][this.data.multiIndex[0]].id
        }, '/api/feedback/station').then(res => {
            this.setData({
                'multiArray[1]': res.data
            })
        })
    },

    bindMultiPickerChange: function (e) {
        this.setData({
            multiIndex: e.detail.value
        })
    },

    bindMultiPickerColumnChange: function (e) {
        if (e.detail.column == 0) {
            this.setData({
                'multiIndex[0]': e.detail.value
            }, () => {
                this.getstations()
            })
        }
    },

    inputvalue (e) {
        let key = e.currentTarget.dataset.key
        this.setData({
            [key]: e.detail.value
        })
    },

    getcategory() {
        app.http('post', { type: Number(this.data.tab_active) + 1 }, '/api/feedback/gettype').then(res => {
            if (this.data.tab_active == 1) {
                this.setData({
                    'type_column[0]': res.data
                }, () => {
                    this.get_child_category()
                })
            } else {
                this.setData({
                    type: res.data
                })
            }
        })
    },

    get_child_category () {
        app.http('post', {
            id: this.data.type_column[0][this.data.type_multiIndex[0]].id
        }, '/api/feedback/getchildtype').then(res => {
            this.setData({
                'type_column[1]': res.data
            })
            console.log(this.data.type_column)
        })
    },

    type_change (e) {
        this.setData({
            type_multiIndex: e.detail.value
        })
    },

    type_column_change (e) {
        if (e.detail.column == 0) {
            this.setData({
                'type_multiIndex[0]': e.detail.value
            }, () => {
                this.get_child_category()
            })
        }
    },

    switchType (e) {
        let type = e.currentTarget.dataset.type
        this.setData({
            tab_active: type
        })
        this.getcategory()
    },

    changType (e) {
        let index = e.detail.value
        this.setData({
            type_active: index
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