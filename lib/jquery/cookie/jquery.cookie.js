

define(function(require, exports, module) {
	
	var $ = require("jquery/jquery");
	var jQuery = $;

	$.extend({ 
	  
	/**  
	 1. ����cookie��ֵ����name������ֵ��Ϊvalue    
	example $.cookie(��name��, ��value��); 
	 2.�½�һ��cookie ������Ч�� ·�� ������ 
	example $.cookie(��name��, ��value��, {expires: 7, path: ��/��, domain: ��jquery.com��, secure: true}); 
	3.�½�cookie 
	example $.cookie(��name��, ��value��); 
	4.ɾ��һ��cookie 
	example $.cookie(��name��, null); 
	5.ȡһ��cookie(name)ֵ��myvar 
	var account= $.cookie('name'); 
	**/
		cookie: function(name, value, options) { 
			if (typeof value != 'undefined') { // name and value given, set cookie 
				options = options || {}; 
				if (value === null) { 
					value = ''; 
					options.expires = -1; 
				} 
				var expires = ''; 
				if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) { 
					var date; 
					if (typeof options.expires == 'number') { 
						date = new Date(); 
						date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000)); 
					} else { 
						date = options.expires; 
					} 
					expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE 
				} 
				var path = options.path ? '; path=' + options.path : ''; 
				var domain = options.domain ? '; domain=' + options.domain : ''; 
				var secure = options.secure ? '; secure' : ''; 
				document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join(''); 
			} else { // only name given, get cookie 
				var cookieValue = null; 
				if (document.cookie && document.cookie != '') { 
					var cookies = document.cookie.split(';'); 
					for (var i = 0; i < cookies.length; i++) { 
						var cookie = jQuery.trim(cookies[i]); 
						// Does this cookie string begin with the name we want? 
						if (cookie.substring(0, name.length + 1) == (name + '=')) { 
							cookieValue = decodeURIComponent(cookie.substring(name.length + 1)); 
							break; 
						} 
					} 
				} 
				return cookieValue; 
			} 
		} 
	  
	});

});