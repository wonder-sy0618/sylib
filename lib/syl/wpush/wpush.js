
/**
 * wpush 推送监听服务
 */
define(function(require, exports, module) {
	
	var $ = require("jquery/jquery");
	var amq = require('apache/amq');
	var cookie = require('jquery/cookie');
	
	var defaults = {
		token : 'anonymous',
		listenInitIframeUrl : '',
		listenUrl : '',
		subscribeTargetBase : 'topic://wpush.',
		listenId : 'wpush',
		onConnectStatus : function(state) {
			
		},
		onMessage : function(message) {
			
		}
	};
	
	
	var init = function(options) {
		var opt = $.extend({}, defaults, options);
		amq.init({
			uri: opt.listenUrl,
			logging: true,
			timeout: 20, 
			clientId: (new Date()).getTime().toString(),
			connectStatusHandler: function(state) {
				opt.onConnectStatus(state);
			}
		});
		amq.addListener(
			opt.listenId, 
			opt.subscribeTargetBase + opt.token, 
			function(message) {
				opt.onMessage(message.textContent);
			});
	};
	
	
	
	module.exports = init;
	
	
});







