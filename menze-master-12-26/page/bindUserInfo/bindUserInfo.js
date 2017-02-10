var simpleLib = require('../libs/simple-lib.js');
var route = "page/bindUserInfo/bindUserInfo";

var onLoad=function(options){
    simpleLib.setData(route,{
       userInfo: simpleLib.getGlobalData().userInfo,
       isLogin: simpleLib.getGlobalData().isLogin,
       userType:simpleLib.getGlobalData().userType
    })
};

var inputUserName=function(e){
    simpleLib.setData(route,{
        userName:e.detail.value
    })
};

var inputPassward=function(e){
    simpleLib.setData(route,{
        passward:e.detail.value
    })
};

var binding=function(){  
    var that=this
    wx.request({
        url: simpleLib.baseUrl + '/BindUser',
        data: {
            Token: simpleLib.token,
            OpenID: simpleLib.getGlobalData().openId,
            UserName: that.data.userName,
            Password: that.data.passward
        },
        header: {
            'content-type': 'application/json;charset=UTF-8'
        },
        method: "POST",
        success: function (res) {
            
            var result = res.data;
              console.log(result)
            if (!result.Success) {
                simpleLib.toast(result.ErrorMsg);
                if(result.ErrorMsg == "该微信号之前已绑定"){
                    simpleLib.getGlobalData().isLogin = true;
                    back();
                    wx.setStorage({
                        key:"iconUrl",
                        data:that.data.userInfo.avatarUrl
                    });
                } else {
                    return;
                }
            } else {
                simpleLib.toast("绑定用户成功");
                checkGuestOrOther();
                back();
            }    
        },
        fail: function (res) {
            simpleLib.toast("绑定用户失败");
        },
        complete: function () {
            // hideLoading();
        }
    });
};


var logOut = function (){

    wx.showModal({
        title: '温馨提示',
        content: '退出将解除与该账号的绑定，确认退出？',
        success: function(res) {
            if (res.confirm) {
                logOutRequest();
                
            }
        }
    });
};

var logOutRequest = function (){
    wx.request({
        url: simpleLib.baseUrl + '/UnbindUser',
        data: {
            Token: simpleLib.token,
            OpenID: simpleLib.getGlobalData().openId,
        },
        header: {
            'content-type': 'application/json;charset=UTF-8'
        },
        method: "POST",
        success: function (res) {
            console.log(res)
            if(res.data="OK"){
                simpleLib.getGlobalData().isLogin = false;
                simpleLib.setData(route,{
                    isLogin: simpleLib.getGlobalData().isLogin,  
                }) 
            }
        },
    });
};


var checkGuestOrOther = function () {
    wx.request({
        url: simpleLib.baseUrl + '/CurrentUserID',
        data: {
            Token: simpleLib.token,
            OpenID: simpleLib.getGlobalData().openId,
        },
        header: {
            'content-type': 'application/json;charset=UTF-8'
        },
        method: "POST",
        success: function (res) {
            simpleLib.getGlobalData().userType = res.data;
            simpleLib.setData(route,{
                userType:simpleLib.getGlobalData().userType
            })
            if(res.data == "guest"){
                simpleLib.getGlobalData().isLogin = true;
                simpleLib.getGlobalData().showGuestData = false;
            } else if(res.data == "用户未绑定"){
                simpleLib.getGlobalData().isLogin = false;
            } else {
                simpleLib.getGlobalData().isLogin = true;
                simpleLib.getGlobalData().showGuestData = true;
            }     
        },
    });
};

var back = function () {
    setTimeout(function(){
        wx.navigateBack({
            delta: 1, // 回退前 delta(默认为1) 页面
            success: function(res){
                    // success
            },
        })
    },2000)
};

Page({
    data:{
      userInfo: {},
      userName:'',
      passward:'',
      isLogin:false,
      userType:'',
      
    },
    onLoad:onLoad,
    binding:binding,
    inputUserName:inputUserName,
    inputPassward:inputPassward,
    logOut:logOut,

});