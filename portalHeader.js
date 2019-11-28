; (function () {
    const portalHeader =
    `<template>
        <div class="portalHeader  flex flex-justify-content-between flex-align-items" style="height:44px;">
            <div class="todayInfo" style="height:30px;">
                <img src='https://xtaymydmyd.github.io/pictureLibrary/logo.png' alt="" style="height:100%">
            </div>
            <div class="headLeft">
                <img src='https://xtaymydmyd.github.io/pictureLibrary/scan_icon1.png' @click="useScan" class="scan-grey-icon" style="height:18px;">
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
                    debug: false, 
                    appId: configParams.appId,
                    timestamp: configParams.timestamp, 
                    nonceStr: configParams.nonceStr, 
                    signature: configParams.signature,
                    jsApiList:  configParams.jsApiList
                });
                parent.wx.error(function(res){
                //    console.log(res);
                });
                parent.wx.ready(function(){
                    parent.wx.getLocation({
                        type: 'wgs84', 
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
                        needResult: 0, 
                        scanType: ["qrCode","barCode"], 
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
                    
                }
            }
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
