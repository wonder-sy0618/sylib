define(function(require, exports, module) {
	
	var $ = require("jquery");
	
	// 获得当前页面的basepath
	var getPageBasePath = function() {
		var curWwwPath=window.document.location.href;
		var pathName=window.document.location.pathname;
		var pos=curWwwPath.indexOf(pathName);
		var localhostPaht=curWwwPath.substring(0,pos);
		var projectName=pathName.substring(0,pathName.substr(1).indexOf('/')+1);
		var basepath = (localhostPaht+projectName+'/');
		return basepath;
	};
	
	
	// 根据script标签, 获得CDN基础路径
	var getCdnBasePath = function() {
		var cdnBasePath = undefined;
		$.each($('script'), function(k, v) {
			var src = $(v).attr("src");
			if (src && src.indexOf('/sylib.js') != -1) {
				if (src && (src.startWith("http://") || src.startWith("https://"))) {
					cdnBasePath = src;
				} else if (src && src.length > 0) {
					var js = window.document.location.href.substring(0, window.document.location.href.lastIndexOf("/")+1) + src;
					cdnBasePath = js.substring(0, js.lastIndexOf('/sylib.js')+1);
				} else {
					cdnBasePath = undefined;
				}
			}
		});
		return cdnBasePath;
	};
	
	
	// 
	(function() {
		//判断:当前元素是否是被筛选元素的子元素 
		$.fn.isChildOf = function(b){ 
			return (this.parents(b).length > 0); 
		}; 
		//判断:当前元素是否是被筛选元素的子元素或者本身 
		$.fn.isChildAndSelfOf = function(b){ 
			return (this.closest(b).length > 0); 
		}; 
		String.prototype.endWith=function(str){
			if(str==null||str==""||this.length==0||str.length>this.length)
				return false;
			if(this.substring(this.length-str.length)==str)
				return true;
			else
				return false;
			return true;
		}
		String.prototype.startWith=function(str){
			if(str==null||str==""||this.length==0||str.length>this.length)
				return false;
			if(this.substr(0,str.length)==str)
				return true;
			else
				return false;
			return true;
		}
	})();
	
	
	module.exports = {
		getCdnBasePath : getCdnBasePath,
		getPageBasePath : getPageBasePath
  };

});