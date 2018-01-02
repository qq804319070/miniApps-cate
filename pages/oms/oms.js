let orders = [];
var md5 = require('../../utils/md5.js')
Page({
    data: {
        header_selected: 1,
        orders: []
    },
    onLoad: function (options) {

        var that = this
        var open_id = wx.getStorageSync('sessionId');
        wx.request({
            url: 'https://xcx.pjrwx.cn/cate/index.php?s=/Home/Api/orderlist',
            data: { open_id: open_id },
            header: {
                'content-type': 'application/json'
            },
            success: function (res) {
                orders = res.data;
                console.log(res);
                that.setData({
                    orders: res.data
                });
                let header_selected = options.id;

                header_selected = Number(header_selected);
                if (!header_selected || header_selected == 1) {
                    return
                }
                that.setData({
                    header_selected
                });
                that.data.orders = orders.filter((item) => {
                    return item.id == header_selected
                });
                that.setData({
                    orders: that.data.orders
                })

            }
        })
    },
    onReady: function () {

    },
    onShow: function () {

    },
    header_selected(e) {
        let header_selected = e.target.dataset.info;
        header_selected = Number(header_selected);
        this.setData({
            header_selected
        });

        if (header_selected == 1) {
            this.setData({
                orders
            });
            return
        }

        this.data.orders = orders.filter((item) => {
            return item.id == header_selected
        });

        this.setData({
            orders: this.data.orders
        })
    },
    skip(e) {
        let info = e.target.dataset.info
        let order_id = e.currentTarget.id

        info = Number(info);
        if (info == 2) {
            let call = e.target.dataset.call;
            if (call) {
                console.log("取消订单")
                //start
                var that = this
                var arr = []
                arr.order_id = e.currentTarget.id
                wx.request({
                    url: 'https://xcx.pjrwx.cn/cate/index.php/Home/Api/cancel', //仅为示例，并非真实的接口地址
                    data: arr,
                    header: {
                        'content-type': 'application/json'
                    },
                    success: function (res) {
                        that.onLoad()
                    }
                })

                //end
            } else {

                //start
                var that = this
                var arr = []
                arr.open_id = wx.getStorageSync('sessionId')
                arr.order_id = e.currentTarget.id
                wx.request({
                    url: 'https://xcx.pjrwx.cn/cate/index.php/Home/Api/payss', //仅为示例，并非真实的接口地址
                    data: arr,
                    header: {
                        'content-type': 'application/json'
                    },
                    success: function (response) {
                        console.log(response.data)

                        // 发起支付
                        var appId = response.data.appid;
                        var timeStamp = (Date.parse(new Date()) / 1000).toString();
                        var pkg = 'prepay_id=' + response.data.prepay_id;
                        var nonceStr = response.data.nonce_str;
                        var paySign = md5.hex_md5('appId=' + appId + '&nonceStr=' + nonceStr + '&package=' + pkg + '&signType=MD5&timeStamp=' + timeStamp + "&key=wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww").toUpperCase();
                        console.log(paySign);
                        console.log(appId);
                        wx.requestPayment({
                            'timeStamp': timeStamp,
                            'nonceStr': nonceStr,
                            'package': pkg,
                            'signType': 'MD5',
                            'paySign': paySign,
                            'success': function (res) {

                                console.log(res)
                                wx.navigateTo({
                                  url: '../../pages/oms/oms?id=3'
                                })
                            },
                            'fail': function (res) {
                                console.log(res)
                                wx.navigateTo({
                                  url: '../../pages/oms/oms?id=2'
                                })
                            }
                        });

                    }
                })

                //end
            }
        } else if (info == 3) {
            var tel = wx.getStorageSync('tels');
            wx.makePhoneCall({
                phoneNumber: tel
            })
        } else if (info == 4) {
            console.log("评价")
            wx.navigateTo({
                url: '/pages/pj/pj?id=xxx'
            })
        }
    }

});