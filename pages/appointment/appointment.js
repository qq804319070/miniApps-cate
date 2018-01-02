Page({
    data: {
        appoint: [
            {
                time: "2017-09-30 09:42:27",
                people: 2,
                deposit: 58.00,
                completed: false
            },
            {
                time: "2017-09-30 09:42:27",
                people: 2,
                deposit: 58.00,
                completed: true
            },
            {
                time: "2017-09-30 09:42:27",
                people: 2,
                deposit: 58.00,
                completed: true
            }
        ],
        list:[]
    },
    //页面加载
    onLoad: function (options) {
      var that=this
      var open_id = wx.getStorageSync('sessionId')
      console.log(open_id)
      wx.request({
        url: 'https://xcx.pjrwx.cn/cate/index.php?s=/Home/Api/my_yuyue',
        data: { open_id: open_id},
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          console.log(res)
          that.setData({
            list: res.data
          })
         
        }
      })

    },
    //页面初次渲染完成
    onReady: function () {

    },
    cancle(){
        console.log("取消");
    }
});