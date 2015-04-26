(function() {
	
	// 
	(function() {
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
		Array.prototype.unique = function(){
			var res = [];
			var json = {};
			for(var i = 0; i < this.length; i++){
				if(!json[this[i]]){
					res.push(this[i]);
					json[this[i]] = 1;
				}
			}
			return res;
		}
	})();
	
	
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
		for (var i=0; i<document.getElementsByTagName("script").length; i++) {
			var k=i, v = document.getElementsByTagName("script")[i];
			if (!v || !v.attributes['src']) continue;
			var src = v.attributes['src'].value;
			if (src && src.indexOf('/sylib.js') != -1) {
				if (src && (src.startWith("http://") || src.startWith("https://"))) {
					cdnBasePath = src.substring(0, js.lastIndexOf('/sylib.js')+1);
				} else if (src && src.length > 0) {
					var js = window.document.location.href.substring(0, window.document.location.href.lastIndexOf("/")+1) + src;
					cdnBasePath = js.substring(0, js.lastIndexOf('/sylib.js')+1);
				} else {
					cdnBasePath = undefined;
				}
			}
		};
		return cdnBasePath;
	};
	
	if (!window.syl) {
		window.syl = {};
	}
	window.syl.utils = {
		getCdnBasePath : getCdnBasePath,
		getPageBasePath : getPageBasePath
	};
	
	if (define && typeof(define) == 'function') {
		define(function(require, exports, module) {
			module.exports = window.syl.utils;
		});
	}
	

})();