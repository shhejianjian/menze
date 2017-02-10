var simpleLib = require('../libs/simple-lib.js');
var route = "page/home/home";


// 查询选项
var searchOptions = [
    {
        name: "智能",
        icon: "../../image/option1.png"
    },
    {
        name: "附近",
        icon: "../../image/option2.png"
    },
    {
        name: "地址",
        icon: "../../image/option3.png",
        url: "../address/address"
    },
    {
        name: "违规",
        icon: "../../image/option4.png",
        url: "../illegaSearch/illegaSearch"
    },
    {
        name: "组合",
        icon: "../../image/option5.png",
        url: "../blendSearch/blendSearch"
    }
];
var initSearchOptions = function () {
    simpleLib.setData(route, {
        searchOptions: searchOptions
    });
};

var searchOptionOnTap = function (event) {
    var dataset = event.currentTarget.dataset;
    var index = dataset.index;
    var searchOption = searchOptions[index];
    
    if(!simpleLib.getGlobalData().isLogin){
        simpleLib.toast("获取信息失败，请先绑定用户");
        return;
    }

    if(index == 0) {
        if(input){
            search();
        } else {
            simpleLib.toast("请输入商户名称或地址进行搜索");
            simpleLib.setData(route, {
                shopList:'',
            });
        }
        simpleLib.getGlobalData().checkStatus = '0';
        simpleLib.setData(route, {
            distanceViewHidden: true
        });
    }
    if(index == 1) {
        //判断从哪个按钮搜索过去的，方便详情页面刷新数据进行判断
        simpleLib.getGlobalData().checkStatus = '1';
        getUserLocation();
        simpleLib.setData(route, {
            distanceViewHidden: false
        });
    }
    if(index == 2) {
        simpleLib.setData(route, {
                shopList:'',
            });
        simpleLib.navigateTo(searchOption.url);
        simpleLib.getGlobalData().checkStatus = '2';
    }
    if(index == 3) {
        simpleLib.setData(route, {
                shopList:'',
            });
        simpleLib.navigateTo(searchOption.url);
        simpleLib.getGlobalData().checkStatus = '3';
    }
    if(index == 4) {
        simpleLib.setData(route, {
                shopList:'',
            });
        simpleLib.navigateTo(searchOption.url);
        simpleLib.getGlobalData().checkStatus = '4';
    }   
};




// 加载
var showLoading = function () {
    simpleLib.setData(route, {
        loading: true
    });
};
var hideLoading = function () {
    simpleLib.setData(route, {
        loading: false
    });
};


// 一键搜
var input = "";
var onInputChange = function (event) {
    input = event.detail.value;
    simpleLib.setData(route, {
        inputStr:event.detail.value
    });
};

var onInputConfirmClick = function (event){
    input = event.detail.value;
    simpleLib.setData(route, {
        inputStr:event.detail.value
    });
    search();
};
// var blurInputChange = function (event) {
//     input = event.detail.value;
//     if(input){
//         search();
//     } else {
//         simpleLib.setData(route, {
//             shopList:'',
//         });
//     }
// };

// var searchKeys = function (needle, haystack)
// {
//     var result = [];
//     for (var i in haystack)
//     {
//         for(var j in needle) {
//             if (haystack[i] == needle[j])
//             {
//                 result.push(i);
//             }
//         }
        
//     }
//     return result;
// };

var search = function () {

    if(!input){
        simpleLib.toast("请输入商户名称或地址进行搜索");
        simpleLib.setData(route, {
            shopList: '',
        });
        return;
    }
    simpleLib.getGlobalData().checkStatus = '0';
    simpleLib.setData(route, {
            distanceViewHidden: true
        });
    var that = this
    showLoading();
    wx.showNavigationBarLoading();
    wx.request({
        url: simpleLib.baseUrl + '/DoorQueryByString',
        data: {
            OpenID: simpleLib.getGlobalData().openId,
            Token: simpleLib.token,
            QueryKey: input,
            
        },
        header: {
            'content-type': 'application/json;charset=UTF-8'
        },
        method: "POST",
        success: function (res) {
            wx.hideNavigationBarLoading();
            var data=res.data
                 simpleLib.setData(route,{
                    src:simpleLib.getArr(data)
                })                
            placehoderImage(res.data);
            simpleLib.setData(route, {
                shopList: res.data,
            });
            
        },
        fail: function (res) {
            simpleLib.toast("查询失败")
        },
        complete: function () {
            hideLoading();
        }
    });
};

//设置默认图片
var placehoderImage = function (data) {
    var array=[];
    for(var i=0;i<data.length;i++){
        array.push(data[i].PhotoUrl)
        for(var j=0;j<array.length;j++){
            if(array[j]==null){
                data[i].PhotoUrl = '../../image/waitToUpload.jpg';
            } else {
                data[i].PhotoUrl = 'https://changning.menze.net.cn/'+array[j]+'&height=200&width=150'
            }
        }
    } 
};

// 跳转至详情页面
var navigateToDetail = function (event) {
    var dataset = event.currentTarget.dataset;
    var index = dataset.index;
    simpleLib.getGlobalData().shop = simpleLib.getData(route).shopList[index];
    var inputStr;
    if(simpleLib.getGlobalData().checkStatus == "0"){
        inputStr = input;
    } else {
        inputStr = '';
    }
    simpleLib.navigateTo('../detail/detail?input='+inputStr);
};


//绑定用户按钮，未绑定，跳转至绑定页面，若已绑定，提示已绑定
var bindUser = function () {

    // if(simpleLib.getGlobalData().isLogin){
    //     simpleLib.toast("该微信号已绑定")
    // } else {
        simpleLib.navigateTo("../bindUserInfo/bindUserInfo");
    //}
};


//
var onLoad = function () {
    simpleLib.getGlobalData().changePhoto='';
    simpleLib.getGlobalData().checkStatus='';
    initSearchOptions();
    setScrollViewHeight();
    getSystemInfo();    
    
};



//获取设备信息
var getSystemInfo = function () {
    wx.getSystemInfo({
        success: function (res) {
            simpleLib.getGlobalData().screenWidth = res.windowWidth;
            simpleLib.getGlobalData().screenHeight = res.windowHeight;
        }
    });
};



//智能搜索，定位
var getUserLocation = function () {

    wx.getLocation({
        type: 'wgs84',
        success: function(res) {
            showLoading();
            console.log(res.longitude, res.latitude)
            var params = {
                    OpenID: simpleLib.getGlobalData().openId,
                    Token: simpleLib.token,
                    Lng:res.longitude,
                    Lat:res.latitude,                    
                };
             wx.showNavigationBarLoading();
             wx.request({
                url: simpleLib.baseUrl + '/DoorQueryByPos',
                data: params,
                header: {
                    'content-type': 'application/json;charset=UTF-8'
                },
                method: "POST",
                success: function (res) {
                    wx.hideNavigationBarLoading();
                    console.log(res.data)
                    var data=res.data
                    simpleLib.setData(route,{
                        src:simpleLib.getArr(data)
                    });
                    placehoderImage(res.data);                 
                    simpleLib.setData(route, {
                        shopList: res.data,
                    });
                },
                fail: function (res) {
                    simpleLib.toast("查询失败")
                },
                complete: function () {
                    hideLoading();
                }
                
            });
        }
    })
};


var setScrollViewHeight = function () {
    wx.getSystemInfo({
        success: function (res) {
            var systemInfo = res;
            var height = systemInfo.pixelRatio * systemInfo.windowHeight;
            // todo 标题栏高度
            var temph = systemInfo.windowWidth/750
            var hh = systemInfo.windowHeight - temph*530;
            simpleLib.setData(route, {
                hh: hh
            });
        },
        fail: function (res) {
            simpleLib.toast("获取系统信息失败");
        }
    });
};

//刷新数据
var onShow = function (){

    if(simpleLib.getGlobalData().changePhoto == "0"){
        search();
        simpleLib.getGlobalData().changePhoto='';
        simpleLib.getGlobalData().changeIllegaData='';
    } else if(simpleLib.getGlobalData().changePhoto == "1"){
        getUserLocation();
        simpleLib.getGlobalData().changePhoto='';
        simpleLib.getGlobalData().changeIllegaData='';
    } else if(simpleLib.getGlobalData().changePhoto == "2"){
        
        simpleLib.getGlobalData().changePhoto='';
        simpleLib.getGlobalData().changeIllegaData='';
    } else if(simpleLib.getGlobalData().changePhoto == "3"){
        
        simpleLib.getGlobalData().changePhoto='';
        simpleLib.getGlobalData().changeIllegaData='';
    } else if(simpleLib.getGlobalData().changePhoto == "4"){
        
        simpleLib.getGlobalData().changePhoto='';
        simpleLib.getGlobalData().changeIllegaData='';
    }
    //绑定用户后返回界面时获取用户头像
    // wx.getStorage({
    //     key: 'iconUrl',
    //     success: function(res) {
    //         console.log(res.data)
    //         if(res.data){
    //             simpleLib.setData(route, {
    //                 iconUrl: res.data
    //             });
    //         }
    //     } 
    // });

    
};

// 暴露 handler
Page({
    data: {
        inputStr:'',
        newShopAddress:'',
        companyNameList:[],
        list:[],
        hiddenS:true,
        distanceViewHidden:true,
        src:[],
        index:0,
    },
    onLoad: onLoad,
    onShow: onShow,
    bindUser: bindUser,
    onInputChange: onInputChange,
    onInputConfirmClick:onInputConfirmClick,
    search: search,
    searchOptionOnTap: searchOptionOnTap,
    navigateToDetail: navigateToDetail
});

