
define(function(require, exports, module) {
	
	if (top && top._artdialog) {
		module.exports = top._artdialog;
		
	} else {
		var dialog = require('art/artdialog/src/dialog-plus.js');
		
		top._artdialoghandler = {};
		
		// 替换为代理方法
		var _dialog_fun = dialog;
		dialog = function(opt) {
				if (!opt.id) opt.id = 'DEF_' + Math.ceil(Math.round(Math.random()*10000));
				//
				var handler = _dialog_fun(opt);
				if (opt.timeout) {
					window.top.setTimeout(function () {
						handler.close().remove();
					}, opt.timeout);
				} else {
					top._artdialoghandler[opt.id] = handler;
				}
				return handler;
		};
		dialog.get = function(id) {
				return top._artdialoghandler[id];
			};
		dialog.get = function(id) {
				return top._artdialoghandler[id];
			};
		
		top._artdialog = dialog;
		module.exports = top._artdialog; 
		
	}
	
	
});