var app = getApp();
var md5 = require('../../utils/md5.js');
Page({
    data: {
        dian_cai: 1,
        diancai_detail: '',
        classfity: '',
        select_left: 1,
        location: "a1",
        scrollTop: [],
        buy_car: {
            price: false,
            num: 0
        },
        sendData: [],
        show_cart: false
    },
    onLoad: function (options) {
        if (options.id == 1) {
            this.setData({
                dian_cai: 1
            })
        } else if (options.id == 2) {
            this.setData({
                dian_cai: 2
            })
        }

        var yt = options.id;
        yt = 1;
        var that = this;
        wx.request({
            url: 'https://xcx.pjrwx.cn/cate/index.php?s=/Home/Api/goods',
            data: {yt: yt},
            header: {
                'content-type': 'application/json'
            },
            success: function (res) {
                console.log(res);
                var value = wx.getStorageSync('shoppingCart') || [];

                var buy_car = that.data.buy_car;
                if (value.length > 0) {
                    var allPrice = 0,
                        num = 0;
                    for (var i = 0; i < res.data.diancai_detail.length; i++) {
                        var curClass = res.data.diancai_detail[i];
                        for (var j = 0; j < curClass.list.length; j++) {
                            var obj = curClass.list[j];
                            for (var k = 0; k < value.length; k++) {
                                var cart = value[k];
                                value[k].price = Number(value[k].price);
                                if (cart.id == obj.id) {
                                    obj.num = cart.num;
                                    num += cart.num;
                                    allPrice += Number(obj.goods_price) * cart.num;
                                }
                            }
                        }
                    }
                    buy_car.price = allPrice;
                    buy_car.num = num;
                }
                that.setData({
                    diancai_detail: res.data.diancai_detail,
                    classfity: res.data.lx,
                    sendData: value,
                    buy_car
                })
            }
        });

        var open_id = wx.getStorageSync('sessionId');
        if (!open_id) {
            app.login()
        }

    },

    onReady: function () {

    },

    onShow: function () {
        wx.createSelectorQuery().selectAll(".diancan4").boundingClientRect(rect => {
            let ary = [],
                num = 0;
            for (let i = 0; i < rect.length; i++) {
                if (i === 0) {
                    ary.push(rect[i].height);
                    continue;
                }
                num = 0;
                for (let k = 0; k <= i; k++) {
                    num += rect[k].height
                }
                ary.push(num);
            }
            this.setData({
                scrollTop: ary
            })
        }).exec();
    },
    onHide: function () {
        //执行了卸载函数就不会执行隐藏函数
        var sendData = this.data.sendData;
        wx.setStorageSync("shoppingCart", sendData);
    },
    onUnload: function () {
        var sendData = this.data.sendData;
        wx.setStorageSync("shoppingCart", sendData);
    },
    //左栏选项卡
    changeLeft(e) {
        let data = e.target.dataset.left;
        if (!data) {
            return
        }
        data = Number(data);
        this.setData({
            select_left: data,
            location: "a" + data
        })
    },
    //左栏点击定位
    changeLocation(e) {
        let scroll = e.detail.scrollTop;
        if (scroll < 5) {
            this.setData({
                select_left: 1
            });
            return
        }
        for (let i = 0; i < this.data.scrollTop.length; i++) {
            if (scroll <= this.data.scrollTop[i] + 10 && scroll >= this.data.scrollTop[i] - 10) {
                this.setData({
                    select_left: i + 2
                })
            }
        }
    },
    //加入购物车
    join_cart(e) {
        let val = e.target.dataset.count,
            sup = e.target.dataset.sup,
            sub = e.target.dataset.sub,
            id = e.target.dataset.key,
            unit = e.target.dataset.unit,
            name = e.target.dataset.name;
        e.target.dataset.id = Number(id);
        id = Number(id);
        if (sup === undefined || sub === undefined || val === undefined) {
            return
        }
        let num = (this.data.diancai_detail[sup].list)[sub].num,
            allNum = 0,
            allPrice = 0;

        if (val === "min") {
            if (num === 0) {
                return;
            }
            (this.data.diancai_detail[sup].list)[sub].num = num - 1;
            e.target.dataset.option = "miu";
            this.cancle(e);
            this.setData({
                diancai_detail: this.data.diancai_detail,
                sendData: this.data.sendData
            })

        } else if (val === "add") {
            let data = this.data.sendData;
            let objOrder = data.find((item) => {
                return item.id === id
            });
            //objOrder为点击目标,操作引用地址原数据也会改变
            if (objOrder) {
                objOrder.num++;
                objOrder.price = Number((objOrder.unit * objOrder.num).toFixed(2));
            } else {
                data.push({
                    id,
                    num: 1,
                    unit: Number(unit),
                    price: Number(unit),
                    name: name
                })
            }
            (this.data.diancai_detail[sup].list)[sub].num = num + 1;
            this.setData({
                diancai_detail: this.data.diancai_detail
            })
        }
        /*  for (let i = 0; i < this.data.diancai_detail.length; i++) {
              let item = this.data.diancai_detail[i].list;
              for (let k = 0; k < item.length; k++) {
                  allNum += item[k].num;
                  if (item[k].num !== 0) {
                      allPrice += Number(item[k].price) * item[k].num
                  }
              }
          }
          if (allPrice === 0) {
              allPrice = false
          }*/
        this.total();
        /* this.setData({
             buy_car: {
                 num: allNum,
                 price: allPrice
             }
         });*/
        this.setData({
            sendData: this.data.sendData
        });
    },
    bindToOrder() {
        var that = this;
        var lx = that.data.dian_cai;
        var cart = JSON.stringify(that.data.sendData);
        var open_id = wx.getStorageSync('sessionId');
        wx.request({
            url: 'https://xcx.pjrwx.cn/cate/index.php?s=/Home/Api/food_cart',
            data: {lx: lx, cart: cart, open_id: open_id},
            header: {
                'content-type': 'application/json'
            },
            success: function (res) {
                if (res.data.status == 'n') {
                    wx.showModal({
                        title: '提示',
                        showCancel: 'false',
                        content: res.data.msg,
                        success: function (res) {
                            if (res.confirm) {
                                console.log('用户点击确定')
                            } else if (res.cancel) {
                                console.log('用户点击取消')
                            }
                        }
                    })
                }
                else {
                    if (that.data.dian_cai == 1) {
                        wx.redirectTo({
                            url: '../../pages/sureOrder/sureOrder?cart_type=2'
                        })
                    }
                    else {
                        wx.redirectTo({
                            url: '../../pages/sureOrder/sureOrder?cart_type=3'
                        })
                    }
                }
            }
        })
    },
    bindToEval() {
        wx.navigateTo({
            url: '/pages/eval/eval?id=' + this.data.dian_cai
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
    },
    stop() {
        return
    },
    cancle(e) {
        var stop = e.target.dataset.stop,
            clear = e.target.dataset.clear,
            option = e.target.dataset.option,
            id = e.target.dataset.id,
            data = this.data.sendData;
        console.log(data, id);
        if (option === "miu") {
            let targetObj = data.find((i, d) => {
                return i.id === id
            });
            targetObj.num--;
            targetObj.price -= Number(targetObj.unit);
            if (targetObj.num <= 0) {
                data = data.filter((i, d) => {
                    return i.id !== id
                })
            }
            this.count(id, targetObj.num);//计算总列表数
            this.setData({
                sendData: data
            });
            this.total();//计算购物车数量
            return;
            this.total();
        } else if (option === "add") {
            let targetObj = data.find((i, d) => {
                return i.id === id
            });
            targetObj.num++;
            targetObj.price += Number(targetObj.unit);
            this.count(id, targetObj.num);//计算总列表数
            this.setData({
                sendData: this.data.sendData
            });
            this.total();//计算购物车数量
            return;
        }
        if (stop) {
            return;
        }
        if (clear) {
            return;
        }
        this.setData({
            show_cart: false
        })
    },
    show_cart() {
        this.setData({
            show_cart: true
        })
    },
    total() {
        var allPrice = 0,
            allNum = 0;
        for (let i = 0; i < this.data.diancai_detail.length; i++) {
            let item = this.data.diancai_detail[i].list;
            for (let k = 0; k < item.length; k++) {
                allNum += item[k].num;
                if (item[k].num !== 0) {
                    allPrice += Number(item[k].price) * item[k].num
                }
            }
        }
        if (allPrice === 0) {
            allPrice = false
        }
        this.setData({
            buy_car: {
                num: allNum,
                price: allPrice
            }
        });
    },
    count(id, num) {
        let lists = this.data.diancai_detail;
        for (let i = 0; i < lists.length; i++) {
            let commodity = lists[i].list;
            for (let j = 0; j < commodity.length; j++) {
                if (commodity[j].id == id) {
                    commodity[j].num = num
                }
            }
        }
        this.setData({
            diancai_detail: lists
        })
    },
    empty() {
        var diancai_detail = this.data.diancai_detail;
        for (let i = 0; i < diancai_detail.length; i++) {
            let obj = diancai_detail[i].list;
            for (let j = 0; j < obj.length; j++) {
                obj[j].num = 0
            } 
        }
        this.setData({
            buy_car: {
                price: false,
                num: 0
            },
            sendData: [],
            diancai_detail
        });

    }
});