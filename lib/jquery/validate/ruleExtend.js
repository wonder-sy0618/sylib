

$(document).ready(function() {
	
	// 添加扩展规则，验证有效的用户名
	jQuery.validator.addMethod("isAllocUserName", function(value, element) {   
	    var tel = /^[a-zA-Z_][a-zA-Z_0-9]{5,15}$/;
	    return this.optional(element) || (tel.test(value));
	}, "只允许6-16位字母，数字或下划线");
	
	
	
});