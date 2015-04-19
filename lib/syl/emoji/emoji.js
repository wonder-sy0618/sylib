/**
 *  emoji表情支持库
 */
define(function(require, exports, module) {
	
	var $ = require("jquery/jquery");
	var util = require("syl/utils");
	var template = require("art/template-native");
	var json = require("douglascrockford/json");
	
	var defaults = {
		
		// 图片CDN基础路径
		emoji_images_cdn : util.getCdnBasePath() + 'lib/syl/emoji/emoji-data/',
		
		// 项目资源CDN基础路径
		emoji_resources_cdn : util.getCdnBasePath() + 'lib/syl/emoji/resources/',
		
		// emoji图片后缀名
		emoji_images_extension : '.png',
		
		// 图片JSON数据
		emoji_data : util.getCdnBasePath() + 'lib/syl/emoji/data.json',
		
		// 图片对话框模板
		emoji_dialog_template : util.getCdnBasePath() + 'lib/syl/emoji/dialog.tmpl'
	};
	
	/**
	 *  配置属性
	 */
	var config = function(options) {
		defaults = $.extend(defaults, options);
	};
	
	/**
	*  emoji替换
	*/
	var emoji_replace = function(html) {
		var code = html.html();
		try {
			var emoji_code = code.substring(code.indexOf(":")+1, code.lastIndexOf(":"));
			var img = $("<img src='' />").attr(
					"src", defaults.emoji_images_cdn+emoji_code+defaults.emoji_images_extension);
			var emojiHtml = html.clone().empty().append(img);
			return emojiHtml;
		} catch (e) {
			console.log(e);
			return html;
		}
	};
	
	
	/**
	*  emoji刷新显示
	*/
	var flush_emoji = function(e) {
		if (!e) e = $("body");
		$.each($(e).find(".emoji"), function(k, v) {
			var emoji_dom = emoji_replace($(v));
			console.log($(v).html(), emoji_dom.html());
			$(v).empty().append(emoji_dom);
		});
	};
	flush_emoji();
	
	/**
	 *  弹出emoji表情选择对话框
	 */
	var dialog = function(options) {
		var opt = $.extend(defaults, options);
		$.when(
			$.ajax(opt.emoji_dialog_template), 
			$.ajax(opt.emoji_data)
		).done(function (tmpl, data) {
			var emoji_data = json.parse(data[0]);
			var tmpl_content = tmpl[0];
			// 增加属性
			emoji_data.Math = Math;
			emoji_data.opt = opt;
			var html = template.render(tmpl_content)(emoji_data); 
			// 生成页码
			var flushpage = function() {
				$(html).find(".fenye_shuzi").empty();
				$.each($(html).find(".bq_tab"), function(k, v) {
					var html = $('<a href="javascript:void(0);">'+(k+1)+'</a>');
					if ($(v).is(":visible")) {
						html.addClass("current");
						if (k == 0) {
							$(html).find(".ly_fenye td").eq(0).find("div").removeClass("fenye_arrowl").addClass("fenye_arrowl2");
						} else {
							$(html).find(".ly_fenye td").eq(0).find("div").removeClass("fenye_arrowl2").addClass("fenye_arrowl");
						}
						if (k == $(".bq_tab").length -1) {
							$(html).find(".ly_fenye td").eq(2).find("div").removeClass("fenye_arrowr").addClass("fenye_arrowr2");
						} else {
							$(html).find(".ly_fenye td").eq(2).find("div").removeClass("fenye_arrowr2").addClass("fenye_arrowr");
						}
					}
					html.click(function() {
						$(html).find(".bq_tab").hide().eq(k).show();
						flushpage();
					});
					flush_emoji($(html));
					$(html).find(".fenye_shuzi").append(html);
				});
			};
			flushpage();
			// 注册翻页事件
			$(html).find(".fenye_arrowl").unbind().bind("click", function() {
				var page = Number($(".emoji_dialog .fenye_shuzi a.current").text())-1;
				$(".emoji_dialog .bq_tab").hide().eq(page-1).show();
				flushpage();
			});
			$(html).find(".fenye_arrowr").unbind().bind("click", function() {
				var page = Number($(html).find(".fenye_shuzi a.current").text())-1;
				$(html).find(".bq_tab").hide().eq(page+1).show();
				flushpage();
			});
			// 刷新表情
			flush_emoji(html);
			// 追加到页面
			$("body").append(html);
		});
	};
	
	module.exports = {
		dialog : dialog
	};
	
});


