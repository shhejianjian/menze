var simpleLib = require('../libs/simple-lib.js');
var route = "page/illegaList/illegaList";

var shop;
var initShop = function () {
    var app = getApp();
    shop = simpleLib.getGlobalData().shop;
    simpleLib.setData(route, {
        shop: shop
    });
};
//获取违规列表数据
var fetchList = function () {

    var params = {
            OpenID: simpleLib.getGlobalData().openId,
            Token: simpleLib.token,
            DoorID:shop.ID,
        };

        console.log(params)
    wx.request({
        url: simpleLib.baseUrl + '/DoorOffendInfoQuery',
        method: 'POST',
        data: params,
        header: {
            'content-type': 'application/json'
        },
        success: function (res) {
            console.log(res.data)
            var photoArr=[];
            //返回的时间格式需要剪切
            var array = res.data;
            for (var i = 0;i < array.length;i++) {
                 var str = array[i].RecordTime.substring(0,10)
                 var newPhotoUrl = 'https://changning.menze.net.cn/'+array[i].PhotoUrl+'&width='+simpleLib.getGlobalData().screenWidth+'&height='+simpleLib.getGlobalData().screenHeight;
                 photoArr.push(newPhotoUrl)
                 simpleLib.setData(route, {
                    recordTime: str,
                    screenwidth:simpleLib.getGlobalData().screenWidth,
                    screenheight:simpleLib.getGlobalData().screenHeight
                 });
                //  for (var j=0;j<array[i].illegaList.length;j++){

                //  }
                //  
            }
            
            console.log(photoArr)
            simpleLib.setData(route, {
                illegaList: array,
                photoUrlList:photoArr
            });

            showNoDataView(res.data);

        },
        fail: function (res) {
            simpleLib.toast("网络连接错误")
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

var previewImage = function (event) {
    console.log(event)
    var current = event.currentTarget.dataset.imageurl
      wx.previewImage({
        current: current,
        urls: this.data.photoUrlList
      })
};

var onLoad = function(options){
    simpleLib.getGlobalData().changeIllegaData='';
    initShop();
    fetchList();
    wx.showToast({
        title: '加载中',
        icon: 'loading',
        mask:true,
        duration: 1000
    })
};

Page({
  data:{
      illegaList:[],
      recordTime:'',
      hidden:'',
      photoUrlList:[],
      screenwidth:'',
      screenHeight:'',
  },
  previewImage:previewImage,
  onLoad:onLoad,
  
})