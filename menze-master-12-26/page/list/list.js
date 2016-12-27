var simpleLib = require('../libs/simple-lib.js');
var route = "page/list/list";


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

//从地址搜索过来
var fetchList = function (roadId, doorNum) {
    wx.request({
        url: simpleLib.baseUrl + '/DoorQuery',
        method: 'POST',
        data: {
            OpenID: simpleLib.getGlobalData().openId,
            Token: simpleLib.token,
            RoadID: roadId,
            RoadNum: doorNum,
        },
        header: {
            'content-type': 'application/json'
        },
        success: function (res) {
            console.log(res.data);
            placehoderImage(res.data);
            simpleLib.setData(route, {
                shopList: res.data
            });
            showNoDataView(res.data);
        },
        fail: function (res) {
            simpleLib.toast("查询失败")
        }
    })
};

//从违规搜索过来
var fetchIllegaList = function (roadid,CompanyName,offendTimes,roadNum){

    var params = {
            OpenID: simpleLib.getGlobalData().openId,
            Token: simpleLib.token,
            RoadID: roadid,
            CompanyName:CompanyName,
            OffendTimes:offendTimes,
            RoadNum:roadNum,
        };
    console.log(params)

    wx.request({
        url: simpleLib.baseUrl + '/DoorQueryByOffend',
        method: 'POST',
        data: params,
        header: {
            'content-type': 'application/json'
        },
        success: function (res) {
            placehoderImage(res.data);
            simpleLib.setData(route, {
                shopList: res.data
            });
            showNoDataView(res.data);
            console.log(res.data);
        },
        fail: function (res) {
            simpleLib.toast("查询失败")
        }
    })
};


//从组合搜索过来
var fetchBlendList = function (roadid,CompanyName,OperatType,WasteCollection,roadNum){

    var params = {
            OpenID: simpleLib.getGlobalData().openId,
            Token: simpleLib.token,
            RoadID: roadid,
            CompanyName:CompanyName,
            OperatType:OperatType,
            WasteCollection:WasteCollection,
            RoadNum:roadNum,
        };
    console.log(params)

    wx.request({
        url: simpleLib.baseUrl + '/DoorQueryByMultiCondition',
        method: 'POST',
        data: params,
        header: {
            'content-type': 'application/json'
        },
        success: function (res) {
            placehoderImage(res.data);
            simpleLib.setData(route, {
                shopList: res.data
            });
            
            showNoDataView(res.data);
            console.log(res.data);
        },
        fail: function (res) {
            simpleLib.toast("查询失败")
        }
    })
};
//没有数据的时候设置无数据组件显示，反亦
var showNoDataView = function (data) {
    if(data.length == 0){
        simpleLib.setData(route, {
            hidden: false
        });
    } else {
        simpleLib.setData(route, {
            hidden: true
        });
    }
}


//修改数据后刷新列表
var onShow = function (){
    
    if(simpleLib.getGlobalData().changePhoto == "2"){
        simpleLib.getGlobalData().changePhoto='';
        fetchList(this.data.roadIDStr, this.data.roadNumStr);
    } else if(simpleLib.getGlobalData().changePhoto == "3"){
        simpleLib.getGlobalData().changePhoto='';
        fetchIllegaList(this.data.roadIDStr,this.data.companyNameStr,this.data.offendTimes)
    } else if(simpleLib.getGlobalData().changePhoto == "4"){
        simpleLib.getGlobalData().changePhoto='';        
        fetchBlendList(this.data.roadIDStr,this.data.companyNameStr,this.data.OperatTypeStr,simpleLib.getGlobalData().blendWasteCollection,this.data.roadNumStr);
    } 
};

var onLoad = function (options) {
    if(simpleLib.getGlobalData().checkStatus == "2"){
        fetchList(options.roadId, options.doorNum);
        simpleLib.setData(route, {
            roadIDStr:options.roadId,
            roadNumStr:options.doorNum
        });
    } else if(simpleLib.getGlobalData().checkStatus == "3"){
        console.log(options.RoadID,options.CompanyName,options.OffendTimes)
        fetchIllegaList(options.RoadID,options.CompanyName,options.OffendTimes,options.doorID)
        simpleLib.setData(route, {
            roadIDStr:options.RoadID,
            companyNameStr:options.CompanyName,
            offendTimes:options.OffendTimes,
            roadNumStr:options.doorID
        });
    } else if (simpleLib.getGlobalData().checkStatus == "4"){
        fetchBlendList(options.RoadID,options.CompanyName,options.OperatType,options.WasteCollection,options.doorID);
        simpleLib.setData(route, {
            roadIDStr:options.RoadID,
            companyNameStr:options.CompanyName,
            OperatTypeStr:options.OperatType,
            WasteCollectionStr:options.WasteCollection,
            roadNumStr:options.doorID
        });
    }
};



//跳转至详情页面，传值是为了详情页面刷新数据
var navigateToDetail  = function (event) {
    var dataset = event.currentTarget.dataset;
    var index = dataset.index;
    simpleLib.getGlobalData().shop = simpleLib.getData(route).shopList[index];
    if(simpleLib.getGlobalData().checkStatus == "2"){
            simpleLib.navigateTo('../detail/detail?roadID='+this.data.roadIDStr+'&roadNum='+this.data.roadNumStr)

    } else if (simpleLib.getGlobalData().checkStatus == "4"){
            simpleLib.navigateTo('../detail/detail?blendRoadID='+this.data.roadIDStr+'&blendCompanyName='+this.data.companyNameStr+'&blendOperatType='+this.data.OperatTypeStr+'&blendWasteCollection='+this.data.WasteCollectionStr + '&doorNum=' + this.data.roadNumStr)
    } else if (simpleLib.getGlobalData().checkStatus == "3"){
            simpleLib.navigateTo('../detail/detail?illeagRoadID='+this.data.roadIDStr+'&illegaCompanyName='+this.data.companyNameStr+'&offendTimes='+this.data.offendTimes + '&doorNum=' + this.data.roadNumStr)
    }
};


Page({
    data:{
        hidden:'',
        roadIDStr:'',
        roadNumStr:'',
        companyNameStr:'',
        OperatTypeStr:'',
        WasteCollectionStr:'',
        offendTimes:'',
    },
    onShow:onShow,
    onLoad:onLoad,
    navigateToDetail:navigateToDetail
});


