
/**
 * demo.js
 * pushSupport演示脚本
 */
$(function() {
	
	/**
	 * 获取频道号
	 */
	var channel = $("body").attr("channel");
	
	
	/**
	 * 启动服务器连接
	 * @dialog jquery对dom对象的引用
	 * @sid 连接sessionID
	 */
	var initClient = function(dialog, sid, sign) {
		
		/**
		 * 服务器连接句柄
		 */
		var conn = null;
		
		/**
		 * 显示消息
		 */
		var showMessage = function(time, from_name, content) {
			// 创建消息
			var str = "";
			str += "(";
			str += moment().format('YYYY-MM-DD HH:mm:ss');
			str += ")　";
			str += from_name;
			str += " : ";
			str += "<br/>";
			str += "　　";
			str += content;
			str += "<br/><br/>";
			// 发送到消息框
			var panel = $(".demo_dialog .message_box_panel");
			panel.append(str.replace('\n', '<br/>'));
			panel.scrollTop(999999);
		};
		
		/**
		 * 创建连接
		 */
		var openConnection = function() {
			conn = module.webPush.connection({
					channel : channel,
					sid : sid,
					sign : sign,
					server_connector : function() {
						console.log("服务器已经连接", sid);
						showMessage(sid.createtime, "[管理员]", "连接服务器成功");
					},
					server_disconnector : function(disconnector_type) {
						console.log("服务器已经断开连接", sid);
						showMessage(sid.createtime, "[管理员]", "服务器已经断开连接:" + disconnector_type);
					},
					server_message : function(msg) {
						console.log("接收到服务器消息", sid, msg);
						if (msg.fromid == "-") {
							showMessage(sid.createtime, "[管理员]", msg.body);
						} else {
							showMessage(sid.createtime, msg.fromid, msg.body);
						}
					}
			});
		}
		
		// 注册发送按钮
		$(".demo_dialog .btn_send").click(function() {
			var text = $(".demo_dialog .form_textarea textarea").val();
			// 发送
			$.ajax({
				url : 'send.do',
				data : {
					sid : sid,
					message : text
				},
				dataType : 'text',
				success : function(text) {
					console.log(text);
				}
			});
			// 清空
			$(".demo_dialog .form_textarea textarea").val('');
		});

		// 输入后删除表单验证
		$(".demo_dialog .form_textarea textarea").bind("input", function() {
			$(this).parents(".gemini_form_textarea").removeClass("has-error");
		});
		
		// 注册表单提交按钮
		$(".demo_dialog .form_textarea textarea").bind("keydown", function(event) {
			if(event.ctrlKey && event.keyCode == 13){
				$(this).parents(".demo_dialog").find(".btn_send").click();
		    }
		});
		
		
		// 启动服务器连接
		openConnection("default_channel_1", "test_sid_1");
		
		
		
	};
	
	// 初始化对话框
	initClient(
				$(".demo_dialog"), 
				$("body").attr("sid"),
				$("body").attr("sign")
			);
	
	
	
});








