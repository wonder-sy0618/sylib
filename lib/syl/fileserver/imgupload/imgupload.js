

define(function(require, exports, module) {
	
	
	var fileserver = require("syl/fileserver");
	var bootstrap = require("bootstrap/bootstrap");
	var util = require("syl/utils");
	var template = require("art/template-native");
	
	var defaults = {
		
		// 目标区域
		target : '.area_imgupload',
		
		urlFileServer : '',
		
		template_url : util.getCdnBasePath() + 'lib/syl/fileserver/imgupload/imgupload.tmpl',
		
		images : [],
		
		img_loading_url : util.getCdnBasePath() + 'lib/syl/fileserver/imgupload/loading.gif',
		
		// 图片列表变化事件
		imagearray_change : function(imageArray) {},
		
		// 最大文件数量
		maxFileNum : -1,
		
		// 修正数量
		reviseFileNum : 0,
		
	};
	
	var appendBtn = function(opt) {
		var html = $('<div class="col-xs-4 col-sm-3 col-md-2 img_item"><div class="item" ><div class="item btn_add" ><span class="glyphicon glyphicon-plus" ></span></div></div>');
		$(opt.target).find(".imglist").append(html);
		return html;
	};
	
	var appendImg = function(opt, img) {
		var html = $('<div class="col-xs-4 col-sm-3 col-md-2 img_item"><div class="item" ><img src="'+img+'" /><span class="display: block; height: 100%;" ></span><div class="loading" ><img src="'+opt.img_loading_url+'" /></div><div class="error" ><span class="glyphicon glyphicon-warning-sign" ></span></div></div></div>');
		$(opt.target).find(".imglist").append(html);
		return html;
	};
	
	var reload = function(opt) {
		$(opt.target).find(".imglist").empty();
		$.each(opt.images, function(k, v) {
			appendImg(opt, v).find(".loading").hide();
		});
		appendBtn(opt);
	};
	
	var reloadImgArray = function(opt) {
		var imgs = [];
		$.each($(opt.target).find(".imglist .img_item .item img"), function(k, v) {
			var url = $(v).attr("src");
			if (url.indexOf("data:") != 0) {
				if (url.indexOf(opt.basepath) == 0) {
						url = url.substring(opt.basepath.length, url.length);
				}
				if (imgs.indexOf(url) == -1) {
					imgs.push(url);
				}
			}
		});
		opt.images = imgs;
		opt.imagearray_change(imgs);
	};
	
	var recheckAddBtnState = function(opt) {
		var imgsize = $(opt.target).find(".imglist .img_item").length - 1;
		if (opt.maxFileNum >= 0 
				&& imgsize >= opt.maxFileNum - opt.reviseFileNum) {
			$(opt.target).find(".btn_add").parents(".img_item").hide();
		} else {
			$(opt.target).find(".btn_add").parents(".img_item").show();
		}
	};
	
	var init = function(options) {
		var opt = $.extend({}, defaults, options);
		//
		$.ajax({
			url : opt.template_url,
			dataType : 'text',
			success : function(tmpl) {
				var area = template.render(tmpl)(opt);
				$(opt.target).append(area);
				//
				reload(opt);
			}
		});
		//
		$(opt.target).on("click", ".btn_add", function() {
			fileserver.upload_base64({
				urlFileServer : opt.urlFileServer,
				onSelect : function(base64, file, reader) {
					appendImg(opt, base64).attr("fileid", file.fileId);
					$(".btn_add").parents(".img_item").appendTo($(opt.target).find(".imglist"));
					//
					recheckAddBtnState(opt);
					return true;
				},
				onUpload : function(url, basepath, file) {
					opt.basepath = basepath;
					$(".img_item[fileid="+file.fileId+"] img").attr("src", basepath+url);
					$(".img_item[fileid="+file.fileId+"] .loading").hide();
					//
					reloadImgArray(opt);
				},
				onError : function(state, file) {
					$(".img_item[fileid="+file.fileId+"] .loading").hide();
					$(".img_item[fileid="+file.fileId+"] .error").show();
				}
			});
		}).on("click", ".img_item", function() {
			if ($(this).find(".btn_add").length <= 0 && confirm('要删除该图片吗？')) {
				$(this).remove();
				reloadImgArray(opt);
				recheckAddBtnState(opt);
			}
		});
	};
	
	
	
	
	
	
	module.exports = {
		init : init
	};
	
});
