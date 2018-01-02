Page({
    data: {
      nickname: '',
      avatar: ''
    },
    //页面加载
    onLoad: function (options) {
      var nickname = wx.getStorageSync('nickname')
      var avatar = wx.getStorageSync('avatar')
      this.setData({
        nickname: nickname,
        avatar: avatar
      })
    },
    //页面初次渲染完成
    onReady: function () {

    },
    oms(){
        wx.navigateTo({
          url: '/pages/oms/oms'
        })
    },
    take(){
      wx.navigateTo({
        url: '/pages/oms/oms?id=waimai',
      })
    },
    appointment(){
        wx.navigateTo({
          url: '/pages/appointment/appointment'
        })
    }
});