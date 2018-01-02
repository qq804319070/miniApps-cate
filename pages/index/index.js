Page({
    data: {

      imgUrls: [],
      shop: '',
      group: ''
    },
    //页面加载
    onShow: function () {
      var that = this;
      wx.request({
        url: 'https://xcx.pjrwx.cn/cate/index.php?s=/Home/Api/banner',
        data: { type_id: '1' },
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          console.log(res)
          that.setData({
            imgUrls: res.data
          })
          wx.hideToast()
        }
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
            shop: res.data
          })
          wx.setStorage({
            key: "tels",
            data: res.data.shop_tel
          })
          wx.setStorage({
            key: "shop_name",
            data: res.data.shop_name
          })
          wx.hideToast()
        }
      })
    },
    //页面初次渲染完成
    onReady: function () {

    },
    order(e) {
        let info = e.target.dataset.info;
        info = parseInt(info);
        switch (info) {
            case 1:
                wx.navigateTo({
                    url: '/pages/order/order?id=1'
                });
                break;
            case 2:
                wx.navigateTo({
                    url: '/pages/reserve/reserve'
                });
                break;
            case 3:
                wx.navigateTo({
                    url: '/pages/order/order?id=2'
                });
                break;
            case 4:
                break;
        }
    },
    fanda: function (e) {
      var aa = e.currentTarget.id
      var bb = aa.split()
      wx.previewImage({
        current: aa, // 当前显示图片的http链接
        urls: this.data.shop.album// 需要预览的图片http链接列表
      })
    },
    //导航
    get_location_bind: function () {
      wx.showToast({
        title: '地图加载中',
        icon: 'loading',
        duration: 10000,
        mask: true
      });
      var that = this;
      var loc_lat = parseFloat(that.data.shop.lat);
      var loc_lng = parseFloat(that.data.shop.lng);
      wx.openLocation({
        latitude: loc_lat,
        longitude: loc_lng,
        scale: 28,
        address: that.data.shop.shop_address

      })

    },
    phone: function () {
      var that = this;
      wx.makePhoneCall({
        phoneNumber: that.data.shop.shop_tel
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
    
});