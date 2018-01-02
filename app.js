//app.js
App({
  onLaunch: function () {

    var that = this
    that.login()

  },


  login: function () {
    var that = this
    wx.login({
      success: function (res) {
        console.log(res)
        if (res.code) {
          //发起网络请求
          wx.request({
            url: 'https://xcx.pjrwx.cn/cate/index.php/Home/Api/login',
            data: {
              code: res.code
            },
            success: function (res) {
             console.log(res)
              var sessionId = res.data.openid
              wx.setStorage({
                key: "sessionId",
                data: sessionId
              })
              that.register()
            }
          })
        } else {
          this.login()
        }
      }
    });

  },
  register: function () {
    var open_id = wx.getStorageSync('sessionId');

    if (open_id) {
      wx.getUserInfo({
        success: function (res) {
          var userInfo = res.userInfo
          var nickname = userInfo.nickName
          var avatar = userInfo.avatarUrl
          var gender = userInfo.gender //性别 0：未知、1：男、2：女
          var province = userInfo.province
          var city = userInfo.city
          var country = userInfo.country
          wx.setStorageSync('nickname', nickname)
          wx.setStorageSync('avatar', avatar)
          console.log(userInfo);
          wx.request({
            url: 'https://xcx.pjrwx.cn/cate/index.php/Home/Api/register',
            data: { open_id: open_id, nickname: nickname, avatar: avatar },
            header: {
              'content-type': 'application/json'
            },
            success: function (res) {
              console.log(res)
            }
          })

        },
        fail: function () {
          // 调用微信弹窗接口
          wx.showModal({
            title: '警告',
            content: '您点击了拒绝授权，点击确定重新授权',
            success: function (res) {
              if (res.confirm) {
                wx.openSetting({
                  success: function (res) {
                    if (!res.authSetting["scope.userInfo"] || !res.authSetting["scope.userLocation"]) {


                      wx.getUserInfo({
                        success: function (res) {
                          var userInfo = res.userInfo
                          var nickname = userInfo.nickName
                          var avatar = userInfo.avatarUrl
                          var gender = userInfo.gender //性别 0：未知、1：男、2：女
                          var province = userInfo.province
                          var city = userInfo.city
                          var country = userInfo.country
                          console.log(userInfo);

                        }
                      })
                    }
                  }
                })
              }
            }
          })
        }
      })
    }
    else {
      this.login()
    }
  },

})
