
define(function(require, exports, module) {
	
	var dialog = require('art/artdialog/src/dialog-plus.js');
	
	if (self != top && top._artdialog) {
		module.exports = top._artdialog;
		
	} else {
		top._artdialog = dialog;
		module.exports = dialog; 
		
	}
	
	
});