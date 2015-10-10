

/**
 * æä¾›fileserverçš„æ”¯æŒæ–¹æ³•
 *
 */
define(function(require, exports, module) {
	
	var $ = require("jquery/jquery");
	
	
	/**
	 * è¯·æ±‚fileserver token
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
	
	
	var upload_base64 = function(option) {
		var def = {
			urlFileServer : "",
			accept : "image/*",
			onCheck : function(file) {
				if (!/image\/\w+/.test(file.type)) {     
					alert("ÇëÈ·±£ÎÄ¼şÎªÍ¼ÏñÀàĞÍ");   
					return false;   
				}
				return true;
			},
			onSelect : function(base64, file, reader) {
				return true;
			},
			onUpload : function(url, basepath) {
				
			},
			onError : function(state) {
				
			}
		};
		var opt = $.extend({}, def, option);
		var node = $('<input type="file" accept="image/*" >');
		node.bind("change", function() {
			var file = node[0].files[0];
			//
			if (opt.onCheck(file) == false) {
				return false;
			}
			//
			var reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = function(e) {
				//
				if (opt.onSelect(this.result, file, this) == false) {
					return false;
				}
				//
				var base64 = this.result;
				request_token(function(token, openuploadurl, data) {
					$.ajax({
						url : data.openbase64uploadurl,
						type : 'POST',
						data : {
							token : data.token,
							base64 : base64,
							originalname : file.name
						}, 
						dataType : 'json',
						success : function(json) {
							opt.onUpload(json.url, json.basepath);
						},
						error : function(s) {
							opt.onError(s);
						}
					});
				}, opt.urlFileServer);
			};
		});
		node.click();
	};
	
	
	module.exports = {
		request_token : request_token,
		upload_base64 : upload_base64
	};
	
});








