
/**
 * 图片上传对话框
 */
define(function(require, exports, module) {
	
	var $ = require("jquery/jquery");
	var fileserver = require('syl/fileserver');
	var imageupload = require('baidu/WebUpoaderLoader/imageupload');
	var dialog = require('art/artdialog');
	
	/**
	 * 默认配置
	 */
	var defaults = {
		
		// 图片列表变化事件
		imagearray_change : function(imageArray) {},
		
		// 最大文件数量
		maxFileNum : -1,
		
		// 修正数量
		reviseFileNum : 0,
		
		// 图片上传地址
		urlUpload : null,
		
		// 静态文件服务地址
		urlFileServer : null,
		
		// 关闭
		onclose : function() {}
		
	};
	
	// 获得上传地址
	var getFileUploadUrl = function(opt, callback) {
		if (opt.urlUpload) {
			callback(opt.urlUpload);
		} else {
			fileserver.request_token(function(token, basepath) {
				var url = basepath + '?token=' + token;
				callback(url);
			}, opt.urlFileServer);
		}
	};
	
	/**
	 * 显示
	 */
	var showImageUploadDialog = function(options) {
		var opt = $.extend(defaults, options);
		getFileUploadUrl(opt, function(fileUploadUrl) {
			dialog({
				title : '图片上传',
				width : 600,
				height : 450,
				content : '<div class="sylib_syl_dialog_imageupload" ></div>',
				onshow : function() {
					imageupload.init({
						element : '.sylib_syl_dialog_imageupload',
						server : fileUploadUrl,
						imgarray : [],
						maxFileNum : opt.maxFileNum?opt.maxFileNum:-1,
						imagearray_change : opt.imagearray_change,
						init_ready : function() {
							window.setTimeout(function() {
								$(window).trigger("resize");
							}, 1000);
						}
					});
				},
				onclose : function() {
					opt.onclose();
				}
			}).showModal();	// 模态
		});
	};
	
	
	
	module.exports = {
		showImageUploadDialog : showImageUploadDialog
	};
	
});