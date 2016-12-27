var simpleLib = require('../libs/simple-lib.js');
var route = "page/updateShopData/updateShopData";

var initNaviItems = function () {
    simpleLib.setData(route, {
        nav_left_items: simpleLib.nav_left_items
    });
};

var onLoad = function () {
    simpleLib.getGlobalData().changeIllegaData='';
    initShop();
    
    initNaviItems();
    //进来时显示当前经营业态
    var array = simpleLib.nav_left_items;
    for(var i=0;i<array.length;i++){
        for(var j=0;j<array[i].rightItem.length;j++){
            if(array[i].rightItem[j].cdValue == shop.OperatType){
                var profileName;
                var telephone;
                if(shop.LeasingPerson){
                    profileName = shop.LeasingPerson;
                }
                if(shop.LeasingContactInfo){
                    telephone = shop.LeasingContactInfo;
                }
                simpleLib.setData(route, {
                    curNav:array[i].id,
                    oldNav:array[i].id,
                    curIndex:array[i].id-1,
                    select:array[i].rightItem[j].id,
                    leftItemName:array[i].name,
                    rightItemName:array[i].rightItem[j].cdValue,
                    companyName:shop.CompanyName,
                    personName:profileName,
                    telephoneNum:telephone,
                    isChooseSwitch:shop.WasteCollection
                });
            }
        }
    }
    
};
var onReady = function () {
    
};

var shop;
var initShop = function () {
    shop = simpleLib.getGlobalData().shop;
    simpleLib.setData(route, {
        shop: shop
    });
};

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

var bindInputCompanyName = function (event) {
    this.setData({
      companyName:event.detail.value
    })
}
var bindInputPersonName = function (event) {
    this.setData({
      personName:event.detail.value
    })
}
var bindInputNumber = function (event) {
    this.setData({
      telephoneNum:event.detail.value
    })
}

var commit = function (e){
    var bool = ''+this.data.isChooseSwitch;
    wx.request({
        url: simpleLib.baseUrl + '/DoorEdit',
        method: 'POST',
        data: {
            OpenID: simpleLib.getGlobalData().openId,
            Token: simpleLib.token,
            DoorID: shop.ID,
            CompanyName:this.data.companyName,
            OperatType:Number(this.data.select),
            LeasingPerson:this.data.personName,
            LeasingContactInfo:this.data.telephoneNum,
            WasteCollection:this.data.isChooseSwitch
        },
        header: {
            'content-type': 'application/json'
        },
        success: function (res) {
            
                if(res.data == 'OK'){
                      simpleLib.getGlobalData().changeIllegaData = "已修改数据"
                      if(simpleLib.getGlobalData().checkStatus=='0'){
                          simpleLib.getGlobalData().changePhoto = "0";
                      } else if(simpleLib.getGlobalData().checkStatus=='1'){
                          simpleLib.getGlobalData().changePhoto = "1";
                      } else if(simpleLib.getGlobalData().checkStatus=='2'){
                          simpleLib.getGlobalData().changePhoto = "2";
                      } else if(simpleLib.getGlobalData().checkStatus=='3'){
                          simpleLib.getGlobalData().changePhoto = "3";
                      } else if(simpleLib.getGlobalData().checkStatus=='4'){
                          simpleLib.getGlobalData().changePhoto = "4";
                          simpleLib.getGlobalData().blendWasteCollection = bool;
                      }
                      wx.showModal({
                          title: '温馨提示',
                          content: '提交成功',
                          showCancel:false,
                          success: function(res) {
                            if (res.confirm) {
                              wx.navigateBack ({
                                  delta:'1'
                              })
                            }
                          }
                        });
                } else {
                        wx.showModal({
                          title: '提交失败',
                          content: res.data,
                        })
                    }

        },
        fail: function (res) {
            simpleLib.toast("修改失败")
        }
    })
};

Page({
    data: {
        leftItemName:'',
        newLeftItemName:'',
        rightItemName:'',
        curNav: 1,
		curIndex: 0,
        select:"01",
        companyName:'',
        
        personName:'',
        telephoneNum:'',
        isChooseSwitch:false,
    },
    onLoad:onLoad,
    onReady:onReady,
    commit:commit,
    bindInputCompanyName:bindInputCompanyName,
    bindInputPersonName:bindInputPersonName,
    bindInputNumber:bindInputNumber,
    switch1Change:switch1Change,
    switchRightTab:switchRightTab,
    selectItem:selectItem,
})