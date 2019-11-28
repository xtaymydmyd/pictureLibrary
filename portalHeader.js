; (function () {
    const portalHeader =
    `<template>
        <div class="portalHeader  flex flex-justify-content-between flex-align-items" style="height:44px;">
            <div class="todayInfo" style="height:30px;">
                <img src="https://xtaymydmyd.github.io/pictureLibrary/logo.png" alt="" style="height:100%">
            </div>
            <div class="headLeft">
                <img src="https://xtaymydmyd.github.io/pictureLibrary/scan_icon1.png" @click="useScan" class="scan-grey-icon" style="height:18px;">
            </div>
        </div>
    </template>

    <script>
    export default{
        name: 'portalHeader',
        data () {
            return {
                headType: '1',
                searchState: false,
                date: '',
                week: ''
            }
        },
        props: {
            link:String
        },
        mounted:function () {
            if(constGlobal.isWeChat()){
                this.querySignature();
            }
            this.date = moment().format('YYYY年MM月DD日 dddd')
        },
        methods: {
            querySignature(){
                var url = constGlobal.HostJSAPISignature +  "signature";
                http.apiPost(url, {url: window.location.href}).then(res =>{
                    if(res.status == 0){
                        var signatureParams = res.data;
                        signatureParams.jsApiList = ['scanQRCode'];
                        this.useJsApi(signatureParams);
                    }
                });
            },
            useJsApi(configParams){
                parent.wx.config({
                    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                    appId: configParams.appId, // 必填，企业号的唯一标识，此处填写企业号corpid
                    timestamp: configParams.timestamp, // 必填，生成签名的时间戳
                    nonceStr: configParams.nonceStr, // 必填，生成签名的随机串
                    signature: configParams.signature,// 必填，签名，见附录1
                    jsApiList:  configParams.jsApiList// 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                });
                parent.wx.error(function(res){
                //    console.log(res);
                });
                parent.wx.ready(function(){
                    parent.wx.getLocation({
                        type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
                        success: function(res) {
                            var location = {
                                latitude: res.latitude,
                                longitude: res.longitude
                            }
                            sessionStorage.setItem("deviceLocationInfo", JSON.stringify(location));
                        }
                    })
                });
                
            },
            useScan(){
                var _this = this;
                if(constGlobal.isWeChat()){
                    parent.wx.scanQRCode({
                        desc: 'scanQRCode desc',
                        needResult: 0, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
                        scanType: ["qrCode","barCode"], // 可以指定扫二维码还是一维码，默认二者都有
                        success: function (res) {
                            // console.log(res);
                        },
                        error: function(res){
                            if(res.errMsg.indexOf('function_not_exist') > 0){
                                alert('版本过低请升级')
                            }
                        }
                    });
                }else{
                    // cordova调用扫一扫
                    cordova.plugins.barcodeScanner.scan(  
                        function (result) {  
                            var strRegex = /((http|ftp|https|file):\/\/([\w\-]+\.)+[\w\-]+(\/[\w\u4e00-\u9fa5\-\.\/?\@\%\!\&=\+\~\:\#\;\,]*)?)/ig;
                            var re = new RegExp(strRegex); 
                            if(re.test(result.text)){
                            
                                if( constGlobal.isWeChat()){
                                    window.location.href = result.text;
                                }else{
                                    common.inAppBrowserOpen( result.text )
                                }
                            }else{
                                if(result.text){
                                    _this.$vux.alert.show({
                                        title: '识别内容',
                                        content: result.text,
                                        onHide () {
                                            
                                        }
                                    })
                                }                            
                            }  
                        },   
                        function (error) {  
                            // console.log("Scanning failed: " + error);  
                        }  
                    );
                }
            },
        }
    }
    </script>
    <style lang="css">
    .portalHeader {
        background: #fff;
        padding: 0px 15px;
        height: 44px;
    }
    .portalHeader .todayInfo img {
        height: 26px;
    }
    .portalHeader .headLeft img {
        height: 18px;
    }
    
    .fixPortalHeader1 .scan-white-icon {
        display: inline-block;
    }
    .fixPortalHeader1 .scan-grey-icon {
        display: none;
    }
    .fixPortalHeader1 .vux-1px:before {
        border: 0px solid #e6e6e6;
        border-radius: 30px;
    }
    
    .fixPortalHeader2 .scan-white-icon {
        display: none;
    }
    .fixPortalHeader2 .scan-grey-icon {
        display: inline-block;
    }
    .fixPortalHeader2 .vux-1px:before {
        border: 1px solid #e6e6e6;
        border-radius: 30px;
    }
    </style>
    `

    if (typeof module !== 'undefined' && typeof exports === 'object') {
        module.exports = portalHeader
    } else {
        window.portalHeader = portalHeader
    }
})();