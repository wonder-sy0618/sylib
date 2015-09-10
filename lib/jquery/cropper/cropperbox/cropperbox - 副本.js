
/**
 * JS 裁剪控件
 */
define(function(require, exports, module) {
	
	var $ = require("jquery/jquery");
	var cropper = require("jquery/cropper");
	var template = require("art/template-native");
	var util = require("syl/utils");
	
	// 默认属性
	var defaults = {
		
		// jquery selector
		target : "",
		
		// css/img资源路径
		url_resources_cdn : util.getCdnBasePath() + 'lib/jquery/cropper/cropperbox/',
		
		// 模板路径
		url_template : util.getCdnBasePath() + 'lib/jquery/cropper/cropperbox/cropperbox.tmpl',
		
	};
	
	// 检查接口支持
	var support = function() {
		fileList = !!$('<input type="file">').prop('files');
		blobURLs = !!window.URL && URL.createObjectURL;
		formData = !!window.FormData;
		return {
			fileList : fileList,
			blobURLs : blobURLs,
			formData : formData,
			datauri : fileList && blobURLs
		};
	};
	
	// 检查文件类型是否为图片
	var isImageFile = function(file) {
		if (file.type) {
			return /^image\/\w+$/.test(file.type);
		} else {
			return /\.(jpg|jpeg|png|gif)$/.test(file);
		}
	};
	
	// 开始裁剪
	var startCropper = function(html, url) {
		if (this.active) {
			this.$img.cropper('replace', url);
		} else {
			console.log(url);
			this.$img = $('<img src="' + url + '">');
			$(html).find(".avatar-wrapper").empty().html(this.$img);
			this.$img.cropper({
				aspectRatio: 1,
				preview: $(html).find(".avatar-preview").selector,
				strict: false,
				crop: function (data) {
					console.log(data);
					var json = [
						  '{"x":' + data.x,
						  '"y":' + data.y,
						  '"height":' + data.height,
						  '"width":' + data.width,
						  '"rotate":' + data.rotate + '}'
						].join();
					$(html).find(".avatar-data").val(json);
				}
			});
			this.active = true;
		}
		/*
		this.$avatarModal.one('hidden.bs.modal', function () {
			$(html).find(".avatar-preview").empty();
			_this.stopCropper();
		});
		*/
	};
	
	// 初始化一段jquery HTML的事件
	var init_html = function(html) {
		$(html).on("change", ".btn_upload", function() {
			console.log("change");
			if (support().datauri) {
				files = $(this).prop('files');
				if (files.length > 0) {
					file = files[0];
					if (isImageFile(file)) {
						/*
						if (this.url) {
							URL.revokeObjectURL(this.url); // Revoke the old one
						}
						this.url = ;
						console.log(this.url);
						*/
						startCropper(html, URL.createObjectURL(file));
					}
				}
			} else {
				file = this.$avatarInput.val();
				if (isImageFile(file)) {
					this.syncUpload();
				}
			}
		});
	};
	
	// 初始化方法
	var init = function(options) {
		var opt = $.extend(defaults, options);
		$.ajax({
			url : opt.url_template,
			dataType : 'text',
			success : function(tmpl) {
				var html = $(template.render(tmpl)(opt));
			//	init_html(html);
				$(opt.target).empty().append(html);
				$(".cropperbox_target").cropper({
					aspectRatio: 1,
					strict: false,
					crop: function(data) {
						console.log(data);
					},
					strict: false,
					preview: ".img-preview",
				});
			},
			error : function() {
				console.warn("load template faild");
			}
		});
	};
	
	
	
	module.exports = {
		init : init
	};
	
});