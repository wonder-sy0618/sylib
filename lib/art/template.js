
define(function(require, exports, module) {
	
	var template = require("art/template/template");
	
	
	/**
	* ����moment�����ڸ�ʽ��
	*/
	template.helper('dateFormat', function (date, format) {
		date = new Date(date);
		return require("moment/moment")(date).format(format);
	});
	
	module.exports = template;
	
});