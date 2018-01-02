var app = getApp()
var md5 = require('../../utils/md5.js')
Page({
    data: {
        wx_address_info:'',
        order: '',
        total:'',
        freight:'',
        cart_type:'',
        liuyan:'',
        shop_name:'',
        zh:'',
        price:'',
        agio:'',
        off:'',
    },
    onLoad: function (options) {
        var cart_type = options.cart_type
        console.log(cart_type)
        var open_id = wx.getStorageSync('sessionId');
        var that=this
        that.setData({
            cart_type: cart_type,
            shop_name: wx.getStorageSync('shop_name')
        })
        wx.request({
          url: 'https://xcx.pjrwx.cn/cate/index.php?s=/Home/Api/cartlist',
            data: { cart_type: cart_type, open_id: open_id},
            header: {
                'content-type': 'application/json'
            },
            success: function (res) {
                console.log(res)
                that.setData({
                    order: res.data.list,
                    total: res.data.total,
                    freight: res.data.freight,
                    price:res.data.price,
                    agio: res.data.agio,
                    off:res.data.off
                })

            }
        })

    },

    onShow: function () {

    },
    //选择收货地址
    select_address_bind: function () {
        var that = this;
        if (!wx.chooseAddress) {
            wx.showModal({
                title: '提示',
                content: "您当前微信版本不支持该功能，请先进行升级",
            })
        }
        wx.chooseAddress({
            success: function (res) {
                that.setData({ wx_address_info: res, ordertype: 2 });
            }, fail: function () {
                //弹出系统设置
                wx.openSetting({
                    success: (res) => {
                        if (res.authSetting['scope.address'] == false) {
                            wx.showModal({
                                title: '提示',
                                content: "请允许通讯地址授权",
                                showCancel: false,
                                success: function () {
                                    that.select_address_bind();
                                }
                            });
                        } else {
                            that.select_address_bind();
                        }
                    }
                });
                return false;
            }
        })
    },
    bindKeyInput: function (e) {
        this.setData({
            liuyan: e.detail.value
        })
    },
    bindKeyInputss: function (e) {

        this.setData({
            zh: e.detail.value
        })

    },
    pays: function () {

        var that = this
        var cart_type = that.data.cart_type
        if (cart_type!=2)
        {
            var open_id = wx.getStorageSync('sessionId')
            if (!open_id) {
                app.login()
            }
            if (!that.data.wx_address_info) {
                wx.showModal({
                    title: '温馨提示',
                    content: '请选择收货地址',
                    success: function (res) {
                        if (res.confirm) {
                            console.log('用户点击确定')
                        }
                    }
                })
            }
            else {
                var arr = []
                arr.open_id = open_id
                arr.user = that.data.wx_address_info.userName
                arr.tel = that.data.wx_address_info.telNumber
                arr.address = that.data.wx_address_info.provinceName + ',' + that.data.wx_address_info.cityName + ',' + that.data.wx_address_info.countyName + ',' + that.data.wx_address_info.detailInfo
                arr.goods_amount = that.data.price
                arr.liuyan = that.data.liuyan
                arr.lx = that.data.cart_type
                arr.freight = that.data.freight
                wx.request({
                  url: 'https://xcx.pjrwx.cn/cate/index.php/Home/Api/weachatpay', //仅为示例，并非真实的接口地址
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
                                if (that.data.cart_type == 1) {
                                    wx.navigateTo({
                                        url: '../../pages/group/group'
                                    })
                                }
                                else {
                                    wx.navigateTo({
                                        url: '../../pages/oms/oms?id=3'
                                    })
                                }
                            },
                            'fail': function (res) {
                                if (that.data.cart_type == 1) {
                                    wx.navigateTo({
                                        url: '../../pages/group/group'
                                    })
                                }
                                else {
                                    wx.navigateTo({
                                        url: '../../pages/oms/oms?id=2'
                                    })
                                }
                            }
                        });

                    }
                })
            }
        }
        else
        {
            var open_id = wx.getStorageSync('sessionId')
            if (!open_id) {
                app.login()
            }
            var arr = []
            arr.open_id = open_id
            // arr.user = that.data.wx_address_info.userName
            // arr.tel = that.data.wx_address_info.telNumber
            // arr.address = that.data.wx_address_info.provinceName + ',' + that.data.wx_address_info.cityName + ',' + that.data.wx_address_info.countyName + ',' + that.data.wx_address_info.detailInfo
            arr.goods_amount = that.data.price
            arr.liuyan = that.data.liuyan
            arr.zh = that.data.zh
            arr.lx = that.data.cart_type
            wx.request({
                url: 'https://xcx.pjrwx.cn/cate/index.php/Home/Api/weachatpay', //仅为示例，并非真实的接口地址
                data: arr,
                header: {
                    'content-type': 'application/json'
                },
                success: function (response) {
                    console.log(response.data)
                    if (response.data.status=='n')
                    {
                        wx.showModal({
                            title: '温馨提示',
                            content: response.data.msg,
                            showCancel: false,
                            confirmText: '确定'
                        })
                    }
                    else
                    {
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
                                if (that.data.cart_type==1)
                                {
                                    wx.navigateTo({
                                        url: '../../pages/group/group'
                                    })
                                }
                                else
                                {
                                    wx.navigateTo({
                                        url: '../../pages/oms/oms?id=3'
                                    })
                                }

                            },
                            'fail': function (res) {
                                console.log(res)
                                if (that.data.cart_type == 1) {
                                  wx.navigateTo({
                                    url: '../../pages/group/group'
                                  })
                                }
                                else {
                                  wx.navigateTo({
                                    url: '../../pages/oms/oms?id=2'
                                  })
                                }
                            }
                        });
                    }
                }
            })

        }

    },
    yuyue:function()
    {
      var that=this
      var open_id = wx.getStorageSync('sessionId')
      if (!open_id) {
        app.login()
      }
      var arr = []
      arr.open_id = open_id
      arr.goods_amount = that.data.price
      arr.liuyan = that.data.liuyan
      arr.zh = that.data.zh
      arr.lx = 5
      wx.request({
        url: 'https://xcx.pjrwx.cn/cate/index.php?s=/Home/Api/houf',
        data: arr,
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          console.log(res)
          if (res.data.status == 'n') {
            wx.showModal({
              title: '温馨提示',
              content: res.data.msg,
              showCancel: false,
              confirmText: '确定'
            })
          }
          else
          {
            wx.navigateTo({
              url: '../../pages/oms/oms?id=1'
            })
          }

        }
      })
    }
});