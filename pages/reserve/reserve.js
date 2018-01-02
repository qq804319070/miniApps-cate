var md5 = require('../../utils/md5.js')
var app = getApp()
Page({
    data: {
        date: '2016-09-01',
        time: '12:01',
        dj:''
    },
    onLoad: function () {
        var that = this
        var dates = new Date();
        var year = dates.getFullYear()
        var month = dates.getMonth() + 1
        var day = dates.getDate()
        var hour = dates.getHours()
        var minute = dates.getMinutes()
        var second = dates.getSeconds()

        var ymd = year + '-' + month + '-' + day
        var hm = hour + ':' + minute
        that.setData({
            date: ymd,
            time: hm
        })

        wx.request({
          url: 'https://xcx.pjrwx.cn/cate/index.php?s=/Home/Api/shop',
          data: {},
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            console.log(res)
            that.setData({
              dj: res.data.dj
            })
      
          }
        })

    },

    bindDateChange: function (e) {
        this.setData({
            date: e.detail.value
        })
    },
    bindTimeChange: function (e) {
        this.setData({
            time: e.detail.value
        })
    },
    formSubmit: function (e) {

        var open_id = wx.getStorageSync('sessionId');
        var riqi = this.data.date
        var shijian = this.data.time
        var formdata = e.detail.value;
        formdata.time = riqi + ',' + shijian
        formdata.open_id = wx.getStorageSync('sessionId');
        formdata.money=this.data.dj
        console.log(formdata)
        if (!formdata.name) {
          return wx.showModal({
            title: '提示',
            content: '请填写姓名',
            showCancel: false,
            success: function (res) {

            }
          })
        }
        if (!formdata.tel) {
          return wx.showModal({
            title: '提示',
            content: '请填写手机号码',
            showCancel: false,
            success: function (res) {

            }
          })
        }
      

        wx.request({
          url: 'https://xcx.pjrwx.cn/cate/index.php/Home/Api/bespeak', //仅为示例，并非真实的接口地址
          data: formdata,
          header: {
            'content-type': 'application/json'
          },
          success: function (response) {
            console.log(response.data)
           if(response.data.status=='y')
           {
             wx.navigateTo({
               url: '../../pages/appointment/appointment'
             })
           }else
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
                  wx.navigateTo({
                    url: '../../pages/appointment/appointment'
                  })

                },
                'fail': function (res) {
                  console.log(res)
              
                }
              });
            
          }
          }
        })


    },
    onShareAppMessage: function (res) {
      if (res.from === 'button') {
        // 来自页面内转发按钮
        console.log(res.target)
      }
      return {
        title: '平江生态美食',
        path: '/pages/index/index',
        success: function (res) {
          // 转发成功
        },
        fail: function (res) {
          // 转发失败
        }
      }
    }
})
