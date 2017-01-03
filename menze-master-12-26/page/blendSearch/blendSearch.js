var simpleLib = require('../libs/simple-lib.js');
var route = "page/blendSearch/blendSearch";

var initNaviItems = function () {
    simpleLib.setData(route, {
        nav_left_items: simpleLib.nav_left_items
    });
    //进来时显示当前经营业态
    var array = simpleLib.nav_left_items;
    simpleLib.setData(route, {
        leftItemName:array[0].name,
    });
};


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
        // 清除当前道路
        currentRoad: {},
        doorNum:''
    });
};

// 当道路改变
var onRoadChange = function (event) {
    
    var dataset = event.currentTarget.dataset;
    console.log(dataset)
    var index = dataset.index;
     console.log(event)
    simpleLib.setData(route, {
         selectRoad: event.currentTarget.dataset.id,
         currentRoad: areaList[streetIndex].RoadList[index],
         doorNum:''
    });
};


// 当门牌号改变
var onDoorNumChange = function (event) {
    simpleLib.setData(route, {
        doorNum : event.detail.value
     });
};

//是否垃圾上门收集
var switch1Change = function (event){
    simpleLib.setData(route, {
        isChooseSwitch: event.detail.value
    });
};

//左边经营类型点击
var switchRightTab=function(e) {
    var leftName = e.target.dataset.name;
    let id = e.target.dataset.id,
		index = parseInt(e.target.dataset.index);

    
	this.setData({
		curNav: id,
		curIndex: index,
        newLeftItemName:leftName,
	}) 
};
//右边经营业态点击
var selectItem=function(e){
    var rightName = e.currentTarget.dataset.name;
    var name;
    if(this.data.newLeftItemName){
        name = this.data.newLeftItemName;
    } else {
        name = this.data.leftItemName;
    }
    this.setData({
		select: e.currentTarget.dataset.id,
        rightItemName:rightName,
        leftItemName:name
	})
};


//输入商户名称
var companyNameChange = function (e) {
    simpleLib.setData(route, {
        companyName: e.detail.value
    });
};


// 查询
var search = function () {
    console.log(this.data.isChooseSwitch,Number(this.data.select),this.data.selectRoad,this.data.companyName)
    simpleLib.getGlobalData().blendWasteCollection='';
    var url = '../list/list?RoadID=' + this.data.selectRoad + '&WasteCollection=' + this.data.isChooseSwitch + '&OperatType=' + this.data.select + '&CompanyName=' + this.data.companyName + '&doorID=' + this.data.doorNum;
    simpleLib.navigateTo(url);
};


//
var onLoad = function () {
    fetchAreaList();
    initNaviItems();
    wx.showToast({
        title: '加载中',
        mask:true,
        icon: 'loading',
        duration: 1000
    })
};

var onShow = function (){
    simpleLib.setData(route,{
        select:'',
        rightItemName:'',
    });
};

Page({
    data: {
        companyName:'',
        selectRoad:'',
        rightItemName:'',
        curNav: 1,
		curIndex: 0,
        select:'',
        leftItemName:'',
        newLeftItemName:'',
        isChooseSwitch:false,
        doorNum:'',
    },
    onLoad: onLoad,
    onShow:onShow,
    onAreaChange: onAreaChange,
    onRoadChange: onRoadChange,
    onDoorNumChange:onDoorNumChange,
    search: search,
    companyNameChange:companyNameChange,
    switch1Change:switch1Change,
    switchRightTab:switchRightTab,
    selectItem:selectItem,
});
