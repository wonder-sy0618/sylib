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
		emoji_dialog_template : util.getCdnBasePath() + 'lib/syl/emoji/dialog.tmpl',
		
		// 选择回调
		emoji_select_callback : function() {},
		
		// 标签结束
		emoji_tag_start : '[',
		
		// 标签开始
		emoji_tag_end : ']'
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
	var emoji_replace = function(html, options) {
		var opt = $.extend(defaults, options);
		var code = html.html();
		try {
			var emoji_code = code.substring(
					code.indexOf(opt.emoji_tag_start)+1, 
					code.lastIndexOf(opt.emoji_tag_end));
			var img = $("<img src='' />").attr(
					"src", defaults.emoji_images_cdn+emoji_code+defaults.emoji_images_extension);
			var emojiHtml = html.clone().empty().append(img);
			html.attr("emoji_state", "show");
			return emojiHtml;
		} catch (e) {
			console.log(e);
			return html;
		}
	};
	
	
	/**
	*  emoji刷新显示
	*/
	var show_emoji = function(e, options) {
		var opt = $.extend(defaults, options);
		if (!e) e = $("body");
		$.each($(e).find(".emoji[emoji_state=code]"), function(k, v) {
			var emoji_dom = emoji_replace($(v), opt);
			$(v).empty().append(emoji_dom.html());
		});
	};
	show_emoji();
	
	
	/**
	 *	emoji 还原
	 */
	var reduction_emoji = function(e, options) {
		var opt = $.extend(defaults, options);
		if (!e) e = $("body");
		$.each($(e).find(".emoji[emoji_state=show]"), function(k, v) {
			$(v).empty()
				.append(opt.emoji_tag_start, $(v).attr("emoji"), opt.emoji_tag_end)
				.attr("emoji_state", "code");
		});
	};
	
	
	/**
	 *  弹出emoji表情选择对话框
	 */
	var dialog = function(options) {
		var opt = $.extend(defaults, options);
		$.when( 
			$.ajax({
				url : opt.emoji_dialog_template
			}), 
			$.ajax({
				url : opt.emoji_data
			})
		).done(function (tmpl, data) {
			var emoji_data = data[0]; 
			if (typeof(emoji_data) == 'string') {
				emoji_data = json.parse(emoji_data);
			}
			var tmpl_content = tmpl[0];
			// 增加属性
			emoji_data.Math = Math;
			emoji_data.opt = opt;
			var dialog = $(template.render(tmpl_content)(emoji_data)); 
			// 生成页码
			var flushpage = function() {
				$(dialog).find(".fenye_shuzi").empty();
				$.each($(dialog).find(".bq_tab"), function(k, v) {
					var page = $('<a href="javascript:void(0);">'+(k+1)+'</a>');
					if ($(v).is(":visible")) {
						page.addClass("current");
						if (k == 0) {
							$(page).find(".ly_fenye td").eq(0).find("div").removeClass("fenye_arrowl").addClass("fenye_arrowl2");
						} else {
							$(page).find(".ly_fenye td").eq(0).find("div").removeClass("fenye_arrowl2").addClass("fenye_arrowl");
						}
						if (k == $(".bq_tab").length - 1) {
							$(page).find(".ly_fenye td").eq(2).find("div").removeClass("fenye_arrowr").addClass("fenye_arrowr2");
						} else {
							$(page).find(".ly_fenye td").eq(2).find("div").removeClass("fenye_arrowr2").addClass("fenye_arrowr");
						}
					}
					page.click(function() {
						$(dialog).find(".bq_tab").hide().eq(k).show();
						flushpage();
					});
					$(dialog).find(".fenye_shuzi").append(page);
				});
			};
			// 注册翻页事件
			$(dialog).find(".fenye_arrowl").unbind().bind("click", function() {
				var page = Number($(".emoji_dialog .fenye_shuzi a.current").text())-1;
				$(".emoji_dialog .bq_tab").hide().eq(page-1).show();
				flushpage();
			});
			$(dialog).find(".fenye_arrowr").unbind().bind("click", function() {
				var page = Number($(dialog).find(".fenye_shuzi a.current").text())-1;
				if (page+1 >= $(dialog).find(".bq_tab").length) {
					page = -1;
				};
				$(dialog).find(".bq_tab").hide().eq(page+1).show();
				flushpage();
			});
			// 刷新表情
			show_emoji(dialog, opt);
			// 追加到页面
			$("body").append(dialog);
			// 刷新页码
			flushpage();
			// 注册事件
			$(dialog).find(".emoji img").click(function(e) {
				var code = $(this).parents(".emoji").attr("emoji");
				var emoji_html = $("<span class='emoji' emoji='"+code+"' emoji_state='code' >"
							+(opt.emoji_tag_start + code + opt.emoji_tag_end)+"</span>");
				opt.emoji_select_callback(emoji_html, code);
				$(dialog).remove();
			});
			// 返回操作句柄
			return $(dialog);
		});
	};
	
	module.exports = {
		dialog : dialog,
		show_emoji : show_emoji, 
		reduction_emoji : reduction_emoji
	};
	
});


