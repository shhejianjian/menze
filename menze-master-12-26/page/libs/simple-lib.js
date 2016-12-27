var getCurrentPage = function (route) {
    var pages = getCurrentPages();
    var currentPage = "";
    pages.forEach(function (page) {
        if (page.__route__ === route) {
            currentPage = page;
        }
    });
    return currentPage;
};
var getData = function (route) {
    return getCurrentPage(route).data;
};

var setData = function (route, data) {
    var currentPage = getCurrentPage(route);
    currentPage.setData(data);
};

var toast = function (msg) {
    wx.showToast({
        title: msg
    });
};
var getArr = function (data) {
        var tempArr=[];  
        for (var i = 0;i <data.length;i++) {
           if(data[i].DoorOffendCount > 3&&data[i].DoorOffendCount <7){
                tempArr[i]="../../image/yellowPoint.png"
            } else if(data[i].DoorOffendCount>6){
                tempArr[i]="../../image/redPoint.png"
            }else{
                tempArr[i]=""
                }
            }
    return tempArr;
};


var getGlobalData = function () {
    var app = getApp();
    return app.globalData;
};


var navigateTo = function (url) {
    wx.navigateTo({
        url: url
    });
};

var token = "99290192-67d2-4bac-8fc2-3949429da864";
var baseUrl = "https://changning.menze.net.cn/api/WeChat";
var nav_left_items = [{id:1,name:"餐饮服务",rightItem:[
                {id:"01",cdValue:"中式快餐"},
                {id:"02",cdValue:"西式快餐"},
                {id:"03",cdValue:"休闲餐饮"},
                {id:"04",cdValue:"中餐厅"},
                {id:"05",cdValue:"西餐厅"},
                {id:"06",cdValue:"小吃店"},
                {id:"07",cdValue:"火锅店"},
                {id:"08",cdValue:"烧烤店"},
                {id:"09",cdValue:"大型酒楼"},
                {id:"10",cdValue:"美食广场"},
                {id:"11",cdValue:"其他餐饮"},
                ]},
            {id:2,name:"生活娱乐",rightItem:[
                {id:"12",cdValue:"车辆维修"},
                {id:"13",cdValue:"车辆清洗"},
                {id:"14",cdValue:"五金加工"},
                {id:"15",cdValue:"家电维修"},
                {id:"16",cdValue:"房产中介"},
                {id:"17",cdValue:"理发美发"},
                {id:"18",cdValue:"美容SPA"},
                {id:"19",cdValue:"桑拿会所"},
                {id:"20",cdValue:"宠物服务"},
                {id:"21",cdValue:"服装洗护"},
                {id:"22",cdValue:"家政服务"},
                {id:"23",cdValue:"运动健身"},
                {id:"24",cdValue:"婚庆摄影"},
                {id:"25",cdValue:"培训机构"},
                {id:"26",cdValue:"证券保险银行"},
                {id:"27",cdValue:"邮局"},
                {id:"28",cdValue:"旅行社"},
                {id:"29",cdValue:"体检保健"},
                {id:"30",cdValue:"水站废品站"},
                {id:"31",cdValue:"彩票书报"},
                {id:"32",cdValue:"快递中转站"},
                {id:"33",cdValue:"加油加气站"},
                {id:"34",cdValue:"KTV酒吧"},
                {id:"35",cdValue:"网吧电玩"},
                {id:"36",cdValue:"其他服务"},
                
                ]},
            {id:3,name:"购物服务" ,rightItem:[
                {id:"37",cdValue:"便利店"},
                {id:"38",cdValue:"中型超市"},
                {id:"39",cdValue:"大型超市"},
                {id:"40",cdValue:"水果生鲜"},
                {id:"41",cdValue:"蔬菜点"},
                {id:"42",cdValue:"小百货店"},
                {id:"43",cdValue:"杂货店"},
                {id:"44",cdValue:"五金店"},
                {id:"45",cdValue:"菜市场"},
                {id:"46",cdValue:"食品饮料"},
                {id:"47",cdValue:"甜品面包"},
                {id:"48",cdValue:"文化用品"},
                {id:"49",cdValue:"服饰鞋包"},
                {id:"50",cdValue:"化妆护肤"},
                {id:"51",cdValue:"钟表眼镜"},
                {id:"52",cdValue:"数码家电"},
                {id:"53",cdValue:"珠宝首饰"},
                {id:"54",cdValue:"生活家居"},
                {id:"55",cdValue:"中小车行"},
                {id:"56",cdValue:"药店"},
                {id:"57",cdValue:"其他购物"},

                ]},
                
            {id:4,name:"宾馆酒店",rightItem:[
                {id:"58",cdValue:"豪华宾馆"},
                {id:"59",cdValue:"连锁酒店"},
                {id:"60",cdValue:"公寓式酒店"},
                {id:"61",cdValue:"客栈、民宿、青旅"},
                {id:"62",cdValue:"其他宾馆"}]},
            {id:5,name:"建筑设施",rightItem:[
                {id:"63",cdValue:"公交枢纽"},
                {id:"64",cdValue:"公交始末站"},
                {id:"65",cdValue:"汽车4S店"},
                {id:"66",cdValue:"购物中心"},
                {id:"67",cdValue:"家居建材中心"},
                {id:"68",cdValue:"洗浴中心"},
                {id:"69",cdValue:"仓储物流集散地"},
                {id:"70",cdValue:"花鸟批发市场"},
                {id:"71",cdValue:"蔬菜水果批发市场"},
                {id:"72",cdValue:"服装小商品批发市场	"},
                {id:"73",cdValue:"办公行政单位"},
                {id:"74",cdValue:"生产经营单位"},
                {id:"75",cdValue:"建筑工地"},
                {id:"76",cdValue:"居民小区"},
                {id:"77",cdValue:"医院"},
                {id:"78",cdValue:"火葬殡仪馆"},
                {id:"79",cdValue:"学校"},
                {id:"80",cdValue:"电影院"},
                {id:"81",cdValue:"公园"},
                {id:"82",cdValue:"图书博物馆"},
                {id:"83",cdValue:"宗教场馆"},
                {id:"84",cdValue:"体育场馆"},
                {id:"85",cdValue:"会展中心"},
                {id:"86",cdValue:"文化广场"},
                {id:"87",cdValue:"故居古迹"},
                {id:"88",cdValue:"其他设施"},

        ]}];

var getScreenWidth = function () {
    wx.getSystemInfo({
        success: function (res) {
            return systemInfo.windowWidth;
        }
    });
};

var getScreenHeight = function () {
    wx.getSystemInfo({
        success: function (res) {
            return systemInfo.windowHeight;
        }
    });
};

var getScreenScale = function () {
    wx.getSystemInfo({
        success: function (res) {
            return systemInfo.windowWidth/750;
        }
    });
}



//
module.exports.setData = setData;
module.exports.getData = getData;
module.exports.getArr = getArr;
module.exports.getCurrentPage = getCurrentPage;
module.exports.toast = toast;
module.exports.getGlobalData = getGlobalData;
module.exports.navigateTo = navigateTo;
module.exports.token = token;
module.exports.nav_left_items = nav_left_items;
module.exports.getScreenWidth = getScreenWidth;
module.exports.getScreenHeight = getScreenHeight;
module.exports.baseUrl = baseUrl;
module.exports.getScreenScale = getScreenScale;

