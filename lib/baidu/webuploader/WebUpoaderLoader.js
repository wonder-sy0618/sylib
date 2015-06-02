/**
 * @description WebUploader CMD模块化
 * @author <zhaotoday@gmail.com>
 * @time 2014-11-15 11:44
 */
define(function (require, exports, module) {
	
    // 加载 WebUploader 组件
    module.exports = {
		
		init : function(callback) {
			// jQuery 已暴露到全局，在 WebUploader 中可调用
			window.jQuery = window.$ = require('jquery/jquery');
			
			require('baidu/webuploader/webuploader.css');

			require.async('./webuploader', function ()  {
				// WebUploader 已暴露到全局，在回调函数中使用
				callback(WebUploader);
			});
		}
		
	}; 
	
});