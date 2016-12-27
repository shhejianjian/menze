var simpleLib = require('page/libs/simple-lib.js');
var formatLocation = require('utils/format-location.js')


var login = function () {
    wx.login({
        success: function (res) {
            getUserInfo();
            getOpenId(res.code);
        },
        fail: function () {
            simpleLib.toast('登录失败');
        }
    });
};
var getUserInfo = function () {
    wx.getUserInfo({
        success: function (res) {
            simpleLib.getGlobalData().userInfo = res.userInfo;
        },
        fail: function () {
            simpleLib.toast('获取用户信息失败');
        }
    })
};
var getOpenId = function (code) {
    var appId = 'wxa4bf9c467915fe12';
    var secret = '53ff126301f6d44179f7990b3eb00689';
    var url = 'https://api.weixin.qq.com/sns/jscode2session?appid=' + appId +
        '&secret=' + secret +
        '&js_code=' + code +
        '&grant_type=authorization_code';
    wx.request({
        url: url,
        success: function (res) {
            console.log(res.data.openid)
            simpleLib.getGlobalData().openId = res.data.openid;
            fetchAreaList();
        },
        fail: function (res) {
            simpleLib.toast("获取 OPEN ID 失败")
        }
    });
};

//第一次进入时判断用户是否绑定
var fetchAreaList = function () {
    wx.request({
        url: simpleLib.baseUrl + '/AreaRoadList',
        method: 'POST',
        data: {
            OpenID: simpleLib.getGlobalData().openId,
            Token: simpleLib.token
        },
        header: {
            'content-type': 'application/json'
        },
        success: function (res) {
            // 保存街道列表
            console.log(res.data)
            if(!res.data){
                wx.removeStorage({
                    key: 'iconUrl',
                    success: function(res) {
                        simpleLib.getGlobalData().isLogin = false;
                    } 
                });
            } else {
                simpleLib.getGlobalData().isLogin = true;
            }
        },
        fail: function (res) {
            simpleLib.toast("获取信息失败");
        }
    })
};


var onShow = function () {
    login();
    
};
App({
    globalData: {},
    onShow: onShow
});


