

define(function(require, exports, module) {

	var $ = require("jquery/jquery");
	var wx = require("http://res.wx.qq.com/open/js/jweixin-1.0.0.js");
	
	var wx_jssdk_support = 'http://oauth.mei.so/wxapi_proxy/api/jssdk/support.do';
	
	/**
	 * 初始化JSSDK环境
	 */
	var initJssdk = function(accessid, apis, callback, debug) {
		if (typeof(apis) == 'string') apis = [apis];
		$.ajax({
			url : wx_jssdk_support,
			data : {
				accessid : accessid,
				pageurl : window.location.href
			},
			cache : false,
			dataType : 'json',
			success : function(data) {
				if (!data.meta || data.meta.code != 'success') {
					callback('initJssdk', 'error', data);
					
				} else {
					var config = {
						    debug: debug, 
						    appId: data.jssdk_config.appId,
						    timestamp: data.jssdk_config.timestamp,
						    nonceStr: data.jssdk_config.nonceStr,
						    signature: data.jssdk_config.signature,
						    jsApiList: apis
						};
					wx.config(config);
					wx.error(function(res){
						callback("initJssdk", "faild", res);
					});
					wx.ready(function() {
						callback("initJssdk", "success", wx);
					});
					
				}
			},
			error : function(XMLHttpRequest, textStatus, errorThrown) {
				callback('initJssdk', 'error', XMLHttpRequest, textStatus, errorThrown);
			}
		});
	};
	
	
	/**
	 * 分享定制
	 */
	var shareCustom = function(accessid, title, desc, imgurl, linkurl, callback) {
		if (!callback || typeof(callback) != 'function') {
			callback = function() {};
		}
		var apis = ['onMenuShareAppMessage','onMenuShareTimeline','onMenuShareWeibo','onMenuShareQQ'];
		var totext = function(html) {
			return html.replace(/<.*?>/g,"").replace(/&nbsp;/g,"");
		};
		initJssdk(accessid, apis, function(action, result, wx) {
			wx.checkJsApi({
				jsApiList: apis,
				success: function(res){
					callback('check', 'success', res);
				}
			});
			wx.onMenuShareAppMessage({
				title: title,
				desc: desc,
				link: linkurl,
				imgUrl: imgurl,
				type: 'link',
				linkdataUrl: '',
				success: function(){
					alert("onMenuShareAppMessage");
				},
				cancel: function(){
					alert("onMenuShareAppMessage");
				}
			});
			wx.onMenuShareTimeline({
				title: title,
				link: linkurl,
				imgUrl: imgurl,
				success: function(){
					callback("onMenuShareTimeline", 'success');
				},
				cancel: function(){
					callback("onMenuShareTimeline", 'cancel');
				}
			});
			wx.onMenuShareQQ({
				title: title,
				desc: desc,
				link: linkurl,
				imgUrl: imgurl,
				success: function () { 
					callback("onMenuShareQQ", 'success');
				},
				cancel: function () { 
					callback("onMenuShareQQ", 'cancel');
				}
			});
			wx.onMenuShareWeibo({
				title: title,
				desc: desc,
				link: linkurl,
				imgUrl: imgurl,
				success: function () { 
					callback("onMenuShareWeibo", 'success');
				},
				cancel: function () { 
					callback("onMenuShareWeibo", 'cancel');
				}
			});
		}, false);
		
	};
	
	module.exports = {
			initJssdk : initJssdk,
			shareCustom : shareCustom,
			wx : wx
	};
	
});//pageready