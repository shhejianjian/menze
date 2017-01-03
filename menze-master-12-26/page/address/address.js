var simpleLib = require('../libs/simple-lib.js');
var route = "page/address/address";


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

// 查询
var search = function () {
    var data = simpleLib.getData(route);
    
    var currentRoad = data.currentRoad;
    
    // 如果已经选择了道路
    if (currentRoad) {
        var url = '../list/list?roadId=' + currentRoad.ID + '&doorNum=' + this.data.doorNum;
        console.log(url)
        simpleLib.navigateTo(url);
    } else {
        simpleLib.toast("请先选择道路")
    }
};

//
var onLoad = function () {
    fetchAreaList();
    wx.showToast({
        title: '加载中',
        icon: 'loading',
        mask:true,
        duration: 1000
    })
};
Page({
    data: {
        doorNum: "",
        select:"",
    },
    onLoad: onLoad,
    onAreaChange: onAreaChange,
    onRoadChange: onRoadChange,
    onDoorNumChange: onDoorNumChange,
    search: search
});
