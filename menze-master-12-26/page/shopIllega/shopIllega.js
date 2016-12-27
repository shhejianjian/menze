var common = require('../../utils/util.js')
var simpleLib = require('../libs/simple-lib.js');
var route = "page/shopIllega/shopIllega";

//违规类型
var checkboxItems = [
      {name: '1', value: '1.跨门经营', checked: 'true'},
      {name: '2', value: '2.乱扔垃圾'},
      {name: '3', value: '3.占道堆物'},
      {name: '4', value: '4.五乱'},
      {name: '5', value: '5.卫生不整洁'},
      {name: '6', value: '6.其他'},
    ];

var onLoad = function(options){
    // simpleLib.getGlobalData().changePhoto='';
    // simpleLib.getGlobalData().changeIllegaData='';
    initCheckBoxItems();
    simpleLib.setData(route, {
        shopID:options.shopID,
        date:common.formatTime(new Date)
     })
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

var initCheckBoxItems = function () {
    simpleLib.setData(route, {
        checkboxItems: checkboxItems
    });
};

//选择日期
var bindDateChange = function(e) {
    simpleLib.setData(route, {
        date: e.detail.value
    })
  };
//复选框
var checkboxChange = function(e) {
  console.log(e)
    var checked = e.detail.value
    this.data.checkIndex = e.detail.value
    var changed = {}
    for (var i = 0; i < checkboxItems.length; i ++) {
      if (checked.indexOf(checkboxItems[i].name) !== -1) {
        changed['checkboxItems['+i+'].checked'] = true
      } else {
        changed['checkboxItems['+i+'].checked'] = false
      }
    }
    this.setData(changed)
    this.data.changeds = changed
    
  };

//多行输入框
var bindInput = function (event) {
    this.setData({
      showText:event.detail.value
    })
}
//选择图片上传或拍照
var chooseImage = function () {
   wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
            simpleLib.setData(route, {
                imageList : res.tempFilePaths
            })

          }
    })
  };
//查看已压缩的图片
var previewImage = function (e) {
      var current = e.target.dataset.src
      wx.previewImage({
        current: current,
        urls: this.data.imageList
      })
};
//提交
var commit = function (event) {
      var that = this   
      var checkStr = that.data.checkIndex.join('|'); 
      if(!(that.data.checkIndex.join('|'))){
            wx.showModal({
                  title: '温馨提示',
                  content: '请至少选择一项违规类型',
                })
      } else {
            showLoadingGifView();
            wx.uploadFile({
                  url: simpleLib.baseUrl+'/AddDoorOffend',      
                  filePath: that.data.imageList[0],
                  name: 'OffendPhoto',
                  //上传进度条，此句代码无作用，TODO！
                  isShowProgressTips:1,
                  formData:{
                    Token: simpleLib.token,
                    OpenID:simpleLib.getGlobalData().openId,
                    DoorID:that.data.shopID,
                    OffendType:checkStr,
                    OffendDate:that.data.date,
                    OffendDetail:encodeURI(that.data.showText),
                  },
                  success: function(res){
                    hiddenLoadingGifView();
                    var data = res.data
                    console.log(res)
                    if (res.data == "OK") {

                      simpleLib.getGlobalData().changeIllegaData = "已修改违规登记"
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
                      }
                      wx.showModal({
                          title: '温馨提示',
                          content: '提交成功',
                          success: function(res) {
                            if (res.confirm) {
                              wx.navigateBack ({
                                  delta:'1'
                              })
                            }
                          }
                        }) 
                    } else if(res.data == '"已经存在9次违规，不能再提交！"'){
                        wx.showModal({
                          title: '提交失败',
                          content: res.data
                        })
                    } else {
                        wx.showModal({
                          title: '提交失败',
                          content: res.data,
                        })
                    }
                  },
                  fail : function (rea) {
                    hiddenLoadingGifView();
                    console.log(rea)
                    wx.showModal({
                      title: '温馨提示',
                      content: '提交失败，请检查是否选择图片或网络连接是否正常',
                    })
                  }
            })
      }
      
 };

Page({
  data : {
    shopID:'',
    date:'',
    showText:'',
    imageList:[],
    changeds:{},
    checkIndex:["1"],
    gifHidden:true,
  },
  onLoad:onLoad,
  commit:commit,
  bindInput:bindInput,
  checkboxChange:checkboxChange,
  bindDateChange:bindDateChange,
  previewImage:previewImage,
  chooseImage:chooseImage,
});