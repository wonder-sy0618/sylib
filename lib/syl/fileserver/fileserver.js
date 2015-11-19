

/**
 * 鎻愪緵fileserver鐨勬敮鎸佹柟娉?
 *
 */
define(function(require, exports, module) {
	
	var $ = require("jquery/jquery");
	
	
	/**
	 * 璇锋眰fileserver token
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
			getFileId : function(file) {
				return ""+Math.floor(100000+Math.random()*(999999-100000));
			},
			onCheck : function(file) {
				if (!/image\/\w+/.test(file.type)) {     
					alert("请确保文件为图像类型");   
					return false;   
				}
				return true;
			},
			onSelect : function(base64, file, reader) {
				return true;
			},
			onUpload : function(url, basepath, file) {
				
			},
			onError : function(state) {
				
			}
		};
		var opt = $.extend({}, def, option);
		var node = $('<input type="file" accept="'+opt.accept+'" >');
		node.bind("change", function() {
			var file = node[0].files[0];
			var fileId = opt.getFileId(file);
			file.fileId = fileId;
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
							url : data.openbase64uploadurl + "?token=" + data.token + "&originalname=" + file.name,
							type : 'POST',
							contentType : 'text/html;charset=utf-8',
							data : base64, 
							dataType : 'json', 
							success : function(json) {
								opt.onUpload(json.url, json.basepath, file);
							},
							error : function(s) {
								opt.onError(s, file);
							}
						});
					
					/*
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
					*/
					
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








