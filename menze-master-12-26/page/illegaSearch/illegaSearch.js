var simpleLib = require('../libs/simple-lib.js');
var route = "page/illegaSearch/illegaSearch";


// 获取街道信息
var areaList;
var currentArea;
var streetIndex = 0;
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
            areaList = res.data;
            console.log(areaList[0]);
            initAreaNameList(areaList);
            // initRoadNameList(areaList);
        },
        fail: function (res) {
            simpleLib.toast("获取街道信息失败");
            console.log(res)
        }
    })
};

// 获取街道名称列表，展示用
var initAreaNameList = function (areaList) {
    var areaNameList = [];
    areaList.forEach(function (area) {
        areaNameList.push(area.AreaName);
    });
    simpleLib.setData(route, {
        areaNameList: areaNameList,
        currentArea : areaList[0],
    });
};

// var initRoadNameList = function (areaList) {
//     simpleLib.setData(route, {
//         currentRoad: areaList[0].RoadList[0],
//     });
// };

// 当街道改变
var onAreaChange = function (event) {
    var index = event.detail.value;
    streetIndex = event.detail.value;;
    currentArea = areaList[index];
    simpleLib.setData(route, {
        currentArea: currentArea,
        // 清除当前道路和门牌号
        currentRoad: {},
        doorNum: ""
    });
};

// 当道路改变
var onRoadChange = function (event) {
    
    var dataset = event.currentTarget.dataset;
    console.log(dataset)
    var index = dataset.index;
     console.log(event)
    simpleLib.setData(route, {
        select: event.currentTarget.dataset.id,
         currentRoad: areaList[streetIndex].RoadList[index],
        // 清除当前门牌号
        doorNum: ""
    });
};

// 当门牌号改变
var onDoorNumChange = function (event) {
    simpleLib.setData(route, {
        doorNum : event.detail.value
     });
};

// 当商户名改变
var companyNameChange = function (event) {
    simpleLib.setData(route, {
        companyName : event.detail.value
     });
};

// // 当违规次数改变
// var bindPickerChange = function(e) {
//     console.log('picker发送选择改变，携带值为', e.detail.value)
//     this.setData({
//       index: e.detail.value
//     })
// };


// 查询
var search = function () {

    console.log(this.data.select,this.data.companyName,this.data.index)
    var offendTime = this.data.index;

    var url = '../list/list?RoadID=' + this.data.select + '&OffendTimes=' + offendTime + '&CompanyName=' + this.data.companyName;
    simpleLib.navigateTo(url);
    
};

var greenLightClick = function (){
    simpleLib.setData(route,{
        greenImageUrl:'../../image/greenLight.png',
        yellowImageUrl:"../../image/greyLight.png",
        redImageUrl:"../../image/greyLight.png",
        greenTextColor:'green',
        yellowTextColor:'grey',
        redTextColor:'grey',
        index:1
    })
};
var yellowLightClick = function (){
    simpleLib.setData(route,{
        greenImageUrl:'../../image/greyLight.png',
        yellowImageUrl:"../../image/yellowLight.png",
        redImageUrl:"../../image/greyLight.png",
        greenTextColor:'grey',
        yellowTextColor:'#ed8713',
        redTextColor:'grey',
        index:2
    })
};
var redLightClick = function (){
    simpleLib.setData(route,{
        greenImageUrl:'../../image/greyLight.png',
        yellowImageUrl:"../../image/greyLight.png",
        redImageUrl:"../../image/redLight.png",
        greenTextColor:'grey',
        yellowTextColor:'grey',
        redTextColor:'red',
        index:3
    })
};

//
var onLoad = function () {
    fetchAreaList();
    wx.showToast({
        title: '加载中',
        icon: 'loading',
        duration: 1000
    })
};
Page({
    data: {
        // array: ['1', '2', '3', '4','5', '6', '7', '8','9'],
         index:null,
        
        companyName: "",
        select:"",
        doorNum: "",
        greenImageUrl:"../../image/greyLight.png",
        yellowImageUrl:"../../image/greyLight.png",
        redImageUrl:"../../image/greyLight.png",
        greenTextColor:"grey",
        yellowTextColor:"grey",
        redTextColor:"grey",
    },
    onLoad: onLoad,
    onAreaChange: onAreaChange,
    onRoadChange: onRoadChange,
    onDoorNumChange:onDoorNumChange,
    companyNameChange: companyNameChange,
    // bindPickerChange:bindPickerChange,
    search: search,
    greenLightClick:greenLightClick,
    yellowLightClick:yellowLightClick,
    redLightClick:redLightClick
});
