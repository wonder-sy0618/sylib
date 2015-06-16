

/**
 * 提供fileserver的支持方法
 *
 */
define(function(require, exports, module) {
	
	var $ = require("jquery/jquery");
	
	
	/**
	 * 请求fileserver token
	 */
	var request_token = function(callback, url) {
		if (!url) {
			url = 'resources/server/fileServerUploadToken.jsp';
		}
		$.ajax({
			url : url,
			dataType : 'json',
			success : function(json) {
				if (json.err_code == '0000') {
					callback(json.token, json.openuploadurl, json);
				} else {
					console.error("request_token faild", json);
					callback();
				}
			}
		});
	};
	
	
	
	module.exports = {
		request_token : request_token
	};
	
});








