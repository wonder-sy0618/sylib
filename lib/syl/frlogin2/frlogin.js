/**
 *  管理中心框架
 *   基本元素：顶部，左侧菜单，中心
 */
define(function(require, exports, module) {
	
	var $ = require("jquery/jquery");
	var bootstrap = require('bootstrap/bootstrap');
	var utils = require("syl/utils/utils");
	var template = require("art/template");
	var form = require("jquery/form");
    var showloading = require('jquery/showLoading');

	/**
	 * 默认配置
	 */
	var defaults = {
        
        // LOGO图片
        path_logo : utils.getCdnBasePath() + "lib/syl/frlogin2/res/logo.png",
        
        // 中央背景
        path_center_bg : utils.getCdnBasePath() + "lib/syl/frlogin2/res/bg_body.png",
        
        // 中央前景
        path_center_fr : utils.getCdnBasePath() + "lib/syl/frlogin2/res/bg_center.png",
        
        // 资源
        path_res : utils.getCdnBasePath() + "lib/syl/frlogin2/res/",
		
		// 图形验证
		path_randcode : utils.getCdnBasePath() + "lib/syl/frlogin2/res/randcode.png",
		
		// 表单字段名：用户名
		pname_form_username : "username",
		
		// 表单字段名：密码
		pname_form_password : "password",
		
		// 表单字段名：验证码
		pname_form_randcode : "randcode",
		
		// 表单字段值：用户名
		value_form_username : "",
        
        // 模板路径
        path_tmpl : utils.getCdnBasePath() + "lib/syl/frlogin2/frlogin.tmpl",
        
        // 模板路径
        path_validate : utils.getCdnBasePath() + "lib/syl/frlogin2/res/validate.json",
        
        // 使用ajax验证
        is_ajax_validate : true,
		
		// 通知消息
		notice_message : undefined,
        
        // 验证成功进入路径，只有启用了is_ajax_validate才有效
        path_login_success : "https://cdn.rawgit.com/wonder-sy0618/sylib/master/index.html",
        
        // 完成回调
        callback : function() {}

	};
    
	/**
	 * 提醒
	 */
    var shownotice = function(message) {
        $(".notice").empty().append(message).show();
    };
    
	/**
	 * 隐藏提醒
	 */
    var hidenotice = function() {
        $(".notice").hide();
    };
	
	/**
	 * 初始化方法，为body初始化frlogin2框架
	 */
	var init = function(options) {
		var opt = $.extend(defaults, options);
		$("body").addClass("frlogin2");
        // 执行初始化
        var doinit = function(tmpl_frlogin2) {
            //
            var frlogin2 = $(template.render(tmpl_frlogin2)(opt));
            // 更换验证码
            frlogin2.find(".randcode").click(function() {
                if (opt.path_randcode.indexOf("?") == -1) {
                    frlogin2.find(".randcode").attr("src", opt.path_randcode+"?_"+new Date().getTime());
                } else {
                    frlogin2.find(".randcode").attr("src", opt.path_randcode+"&_"+new Date().getTime());
                }
            });
            // 注册表单提交
			if (opt.is_ajax_validate) {
				frlogin2.find(".validate_form").ajaxForm({
					url : opt.path_validate,
					type : 'post',
					beforeSubmit : function() {
						hidenotice();
						frlogin2.find(".validate_form input[type=submit]").showLoading();
						window.setTimeout(function() {
							frlogin2.find(".randcode").click();
						}, 1000);
					},
					dataType : 'json',
					success : function(json) {
						frlogin2.find(".validate_form input[type=submit]").hideLoading();
						if (json.errcode == 'success') {
							window.location.href=opt.path_login_success;
						} else {
							shownotice(json.errmsg);
						}
					},
					error : function(e, s) {
						shownotice("网络连接失败");
					}
				});
				
			} else {
				frlogin2.find(".validate_form").attr("action", opt.path_validate);
				
			}
            // 追加到页面
            $(".frlogin2").append(frlogin2);
            // 回调
            opt.callback();
        };
        // 使用ajax菜单数据初始化
        $.when( 
            $.ajax({ url : opt.path_tmpl, dataType : 'text' })
        ).done(function (tmpl) {
            doinit(tmpl);
        });      
	};
	
	module.exports = {
		init : init
	};
	
});