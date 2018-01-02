Page({
  data: {
    grade: [
      false,
      false,
      false,
      false,
      false
    ],
    num:''
  },
  onLoad: function (options) {
      
  },
  grade(e) {
    let info = e.target.dataset.info;
    let reg = /\d+/i;
    if (!(reg.test(info))) {
      return
    }
    let grade = this.data.grade;
    grade.forEach((item, index) => {
      if (index <= info) {
        grade[index] = true
      } else {
        grade[index] = false
      }
    })
    this.setData({
      grade
    })
    this.setData({
      num: info
    })

  },
  formSubmit: function (e) {

    var that = this

    var nickname = wx.getStorageSync('nickname')
    var avatar = wx.getStorageSync('avatar')
    if (!nickname || !avatar) {
      that.shouquan()

    }

    var formdata = e.detail.value;
    formdata.nickname = nickname
    formdata.avatar = avatar
    formdata.num = that.data.num+1
    wx.request({
      url: 'https://xcx.pjrwx.cn/cate/index.php?s=/Home/Api/pingjia',
      data: formdata,
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if (res.data.status == 'y') {
              
          wx.showModal({
            title: '温馨提示',
            content: res.data.msg,
            showCancel: false,
            success: function (res) {
              wx.switchTab({
                url: '../../pages/person/person'
              })
            }
          })
        }
        else {
          wx.showModal({
            title: '温馨提示',
            content: res.data.msg,
            showCancel:false,
            confirmText:'确定'
          })
        }
      }
    })


  },

  shouquan: function () {
    var that = this
    wx.getUserInfo({
      success: function (res) {
        var userInfo = res.userInfo
        var nickname = userInfo.nickName
        var avatar = userInfo.avatarUrl
        that.setData({
          nickname: nickname,
          avatar: avatar
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
                        that.setData({
                          nickname: nickname,
                          avatar: avatar
                        })


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
  },

})