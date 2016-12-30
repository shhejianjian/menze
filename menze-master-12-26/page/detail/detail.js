var simpleLib = require('../libs/simple-lib.js');
var route = "page/detail/detail";


var shop;
var initShop = function () {
    var app = getApp();
    simpleLib.getGlobalData().shop.PhotoUrl = changePhotoPX(simpleLib.getGlobalData().shop.PhotoUrl);
    shop = simpleLib.getGlobalData().shop;
    simpleLib.setData(route, {
        shop: shop
    });
    showIllegaLightColor(shop.DoorOffendCount);
};

//进来时更改图片像素
var changePhotoPX = function (photo) {
    if(!photo){
        photo = '../../image/waitToUpload.jpg';
    } else {
        photo = (photo.replace(/&height=200&width=150/, "&height=800&width=600"))
    }
        return photo;
};

var hiddenLoadingGifView = function (){
    simpleLib.setData(route,{
        gifHidden:true
    });
};

var showLoadingGifView = function (){
    simpleLib.setData(route,{
        gifHidden:false
    });
};

//设置默认图片
var placehoderImage = function (photoUrl) {
            if(!photoUrl){
                photoUrl = '../../image/waitToUpload.jpg';
            } else {
                photoUrl = 'https://changning.menze.net.cn/'+photoUrl+'&height=800&width=600'
            }
            return photoUrl; 
};

//设置详情页面违规灯颜色
var showIllegaLightColor = function (doorOffendCount) {
    if( doorOffendCount <= 3) {
        simpleLib.setData(route, {
            iconColor:"../../image/greenPoint.png"
        })
    } else if(doorOffendCount <= 6 ){
        simpleLib.setData(route, {
            iconColor:"../../image/yellowPoint.png"
        })
    } else{
        simpleLib.setData(route, {
            iconColor:"../../image/redPoint.png"
        })
    }
};


//跳转至违规登记界面
var registShopIllega = function (event) {
     var roadID = simpleLib.getGlobalData().roadIDString;
     var checkLocation = simpleLib.getGlobalData().checkLocationString;
    wx.navigateTo({
        url: '../shopIllega/shopIllega?shopID='+shop.ID+'&roadID='+roadID+'&checkLocatoin='+checkLocation,
        success: function () {
        }
    });
};
//跳转至修改数据界面
var changeData = function (event){
    wx.navigateTo({
        url: '../updateShopData/updateShopData?',
        success: function () {

        }
    });
};
//修改照片
var changePhoto = function (event) {
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
          showLoadingGifView();
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
            var params = {
                    Token: simpleLib.token,
                    OpenID:simpleLib.getGlobalData().openId,
                    DoorID:''+shop.ID,
                  }
            wx.uploadFile({
                  url: simpleLib.baseUrl+'/EditDoorPhoto', //仅为示例，非真实的接口地址      
                  filePath: res.tempFilePaths[0],
                  name: 'changePhoto',
                  isShowProgressTips:1,
                  formData:params,
                  
                  success: function(res){
                    hiddenLoadingGifView();
                    var data = res.data
                    if (res.data = 'OK') {
                        simpleLib.toast("上传成功")
                        reloadData();
                    }
                  },
                  fail : function (rea) {
                    hiddenLoadingGifView();
                    wx.showModal({
                        title: '温馨提示',
                        content: '修改失败，请检查网络连接是否正常',
                    })
                  },
            })


          }
    })
};

//跳转至违规列表
var lookShopIllegaList = function (event) {
    wx.navigateTo({
        url: '../illegaList/illegaList',
        success: function () {
        }
    });
};

//跳转至地址地图
var navigateToAddressMap = function () {
    wx.openLocation({
      longitude: shop.Lng,
      latitude: shop.Lat,
      name: shop.CompanyName,
      address: shop.RoadAddress
    })
    
};

//1.刷新用，从智能搜索跳转过来
var getUserLocation = function () {
    wx.getLocation({
        type: 'wgs84',
        success: function(res) {
             wx.request({
                url: simpleLib.baseUrl + '/DoorQueryByPos',
                data: {
                    OpenID: simpleLib.getGlobalData().openId,
                    Token: simpleLib.token,
                    Lng:res.longitude,
                    Lat:res.latitude,
                },
                header: {
                    'content-type': 'application/json;charset=UTF-8'
                },
                method: "POST",
                success: function (res) {
                    for(var i = 0;i < res.data.length;i++){
                        if(res.data[i].ID == shop.ID){
                            shop.WasteCollection = res.data[i].WasteCollection;
                            res.data[i].PhotoUrl = placehoderImage(res.data[i].PhotoUrl);
                            simpleLib.setData(route, {
                                shop: res.data[i],
                            });
                            
                            simpleLib.getGlobalData().shop=res.data[i];
                            console.log(simpleLib.getGlobalData().shop)
                            changePageTitle(simpleLib.getGlobalData().shop.CompanyName);
                            showWasteCollectionTrueOrFalse(shop.WasteCollection);
                        }
                    }
                },
            });
        }
    })
};
//2.刷新用，输入框搜索或一键搜索跳转过来
var search = function () {
    var inputStr = simpleLib.getGlobalData().inputString
    wx.request({
        url: simpleLib.baseUrl + '/DoorQueryByString',
        data: {
            OpenID: simpleLib.getGlobalData().openId,
            Token: simpleLib.token,
            QueryKey: inputStr,
        },
        header: {
            'content-type': 'application/json;charset=UTF-8'
        },
        method: "POST",
        success: function (res) {
            for(var i = 0;i < res.data.length;i++){
                if(res.data[i].ID == shop.ID){
                    shop.WasteCollection = res.data[i].WasteCollection;
                    res.data[i].PhotoUrl = placehoderImage(res.data[i].PhotoUrl);
                    simpleLib.setData(route, {
                        shop: res.data[i],
                    });
                    simpleLib.getGlobalData().shop=res.data[i];
                    changePageTitle(simpleLib.getGlobalData().shop.CompanyName);
                    showWasteCollectionTrueOrFalse(shop.WasteCollection);
                }
            }
        },
    });
};
//3.刷新用，从地址搜索跳转过来
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
            for(var i = 0;i < res.data.length;i++){
                if(res.data[i].ID == shop.ID){
                    shop.WasteCollection = res.data[i].WasteCollection;
                    res.data[i].PhotoUrl = placehoderImage(res.data[i].PhotoUrl);
                    simpleLib.setData(route, {
                        shop: res.data[i],
                    });
                    simpleLib.getGlobalData().shop=res.data[i];
                    changePageTitle(simpleLib.getGlobalData().shop.CompanyName);
                    showWasteCollectionTrueOrFalse(shop.WasteCollection);
                }
            }
        },
    })
};
//4.刷新用，从违规搜索跳转过来
var fetchIllegaList = function (roadid,CompanyName,offendTimes,roadNum){

    var params = {
            OpenID: simpleLib.getGlobalData().openId,
            Token: simpleLib.token,
            RoadID: roadid,
            CompanyName:CompanyName,
            OffendCountType:offendTimes,
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
            simpleLib.setData(route, {
                shopList: res.data
            });
            for(var i = 0;i < res.data.length;i++){
                if(res.data[i].ID == shop.ID){
                    shop.WasteCollection = res.data[i].WasteCollection;
                    res.data[i].PhotoUrl = placehoderImage(res.data[i].PhotoUrl);
                    simpleLib.setData(route, {
                        shop: res.data[i],
                    });
                    simpleLib.getGlobalData().shop=res.data[i];
                    changePageTitle(simpleLib.getGlobalData().shop.CompanyName);
                    showWasteCollectionTrueOrFalse(shop.WasteCollection);
                }
            }
            console.log(res.data);
        },
        fail: function (res) {
            simpleLib.toast("查询失败")
        }
    })
};
//5.刷新用，从组合搜索跳转过来
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
            for(var i = 0;i < res.data.length;i++){
                if(res.data[i].ID == shop.ID){
                    shop.WasteCollection = res.data[i].WasteCollection;
                    res.data[i].PhotoUrl = placehoderImage(res.data[i].PhotoUrl);
                    simpleLib.setData(route, {
                        shop: res.data[i],
                    });
                    
                    simpleLib.getGlobalData().shop=res.data[i];
                    changePageTitle(simpleLib.getGlobalData().shop.CompanyName);
                    showWasteCollectionTrueOrFalse(shop.WasteCollection);
                }
            }
        },
        fail: function (res) {
            simpleLib.toast("查询失败")
        }
    })
};

//刷新垃圾上门收集是或否
var showWasteCollectionTrueOrFalse = function (isCollection){
    if(isCollection == false) {
        simpleLib.setData(route, {
            bools: '否',
        });
    } else if(isCollection == true) {
        simpleLib.setData(route, {
            bools: '是',
        });
    }
};

//刷新后改变标题名
var changePageTitle = function (title1) {
    console.log("change"+title1)

    wx.setNavigationBarTitle({
        title: title1
    })
};


//刷新数据
var reloadData = function () {
     var roadID = simpleLib.getGlobalData().roadIDString;
     var roadNum = simpleLib.getGlobalData().roadNumString;
     
     if(simpleLib.getGlobalData().checkStatus=='0'){
         simpleLib.getGlobalData().changePhoto = "0";
         search();
         
     } else if(simpleLib.getGlobalData().checkStatus=='1'){
         simpleLib.getGlobalData().changePhoto = "1";
         getUserLocation();
         
     } else if(simpleLib.getGlobalData().checkStatus=='2'){
         simpleLib.getGlobalData().changePhoto = "2";
         fetchList(roadID, roadNum);
     } else if(simpleLib.getGlobalData().checkStatus=='3'){
         simpleLib.getGlobalData().changePhoto = "3";
         fetchIllegaList(simpleLib.getGlobalData().illegaRoadID,simpleLib.getGlobalData().illegaCompanyName,simpleLib.getGlobalData().offendTimes,simpleLib.getGlobalData().roadNumString);
     } else if(simpleLib.getGlobalData().checkStatus=='4'){
         console.log(simpleLib.getGlobalData().blendWasteCollection)
         simpleLib.getGlobalData().changePhoto = "4";
         fetchBlendList(simpleLib.getGlobalData().blendRoadID, simpleLib.getGlobalData().blendCompanyName,simpleLib.getGlobalData().blendOperatType,simpleLib.getGlobalData().blendWasteCollection,simpleLib.getGlobalData().roadNumString);
     }  
};

//获取上一页的数据，方便修改数据后刷新页面
var getPastPageData = function (options) {
    simpleLib.getGlobalData().inputString = options.input;
    simpleLib.getGlobalData().roadIDString = options.roadID;
    simpleLib.getGlobalData().roadNumString = options.roadNum;

    simpleLib.getGlobalData().blendRoadID = options.blendRoadID;
    simpleLib.getGlobalData().blendCompanyName = options.blendCompanyName;
    simpleLib.getGlobalData().blendOperatType = options.blendOperatType;
    simpleLib.getGlobalData().blendWasteCollection = options.blendWasteCollection;
    simpleLib.getGlobalData().illegaRoadID = options.illegaRoadID;
    simpleLib.getGlobalData().illegaCompanyName = options.illegaCompanyName;
    simpleLib.getGlobalData().offendTimes = options.offendTimes;
};

//打电话
var callTelephone = function (e){
    if(shop.LeasingContactInfo){
        wx.makePhoneCall({
            phoneNumber: shop.LeasingContactInfo //仅为示例，并非真实的电话号码
        })
    }
};

var onLoad = function (options) {
    // simpleLib.getGlobalData().changePhoto = '';
    initShop();
    if(shop.WasteCollection == false) {
        simpleLib.setData(route, {
            bools: '否',
            
        });
    } else if(shop.WasteCollection == true) {
        simpleLib.setData(route, {
            bools: '是',
            
        });
    }
    getPastPageData(options);
    
};



var onReady = function () {
    console.log("onready");
    wx.setNavigationBarTitle({
        title: shop.CompanyName
    })
};

var onShow = function () {
     console.log("onShow");
    if(simpleLib.getGlobalData().changeIllegaData == "已修改违规登记"){
        reloadData();
        simpleLib.getGlobalData().changeIllegaData='';
    } else if(simpleLib.getGlobalData().changeIllegaData == "已修改数据"){
        reloadData();
        simpleLib.getGlobalData().changeIllegaData='';
    }
    
};

//分享
var onShareAppMessage = function (){
    return {
      title: '安利给你一个好东西！',
      desc: '分享内容',
      path: '../detail/detail'
    }
};

Page({
    data:{
        iconColor:"",
        bools:'',
        progressPercent:0,
        gifHidden:true,
    },
    onLoad: onLoad,
    onShow:onShow,
    callTelephone:callTelephone,
    onReady: onReady,
    changeData:changeData,
    changePhoto:changePhoto,
    onShareAppMessage:onShareAppMessage,
    lookShopIllegaList:lookShopIllegaList,
    navigateToAddressMap:navigateToAddressMap,
    registShopIllega:registShopIllega
});