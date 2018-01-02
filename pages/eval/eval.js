Page({
    data: {
        header_info: 1,
        pjshow:'',
        num:'',
        grade:''
    },
    onLoad: function (options) {
        var that = this
        wx.request({
            url: 'https://xcx.pjrwx.cn/cate/index.php?s=/Home/Api/pjshow',
            data: {},
            header: {
                'content-type': 'application/json'
            },
            success: function (res) {
                console.log(res)
                that.setData({
                    pjshow: res.data.list,
                    grade:res.data.num,
                    num:res.data.count
                })
            }
        })
        let header_info = options.id;
        header_info = Number(header_info);
        console.log(header_info)
        if (header_info === 1) {
            this.setData({
                header_info
            })
        } else if (header_info === 2) {
            this.setData({
                header_info
            })
        }

    },
    onReady: function () {

    },
    diancai() {
        wx.navigateBack({})
    }
})