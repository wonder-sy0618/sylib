
/**
 * JS 裁剪控件
 */
define(function(require, exports, module) {
	
	var $ = require("jquery/jquery");
	var cropper = require("jquery/cropper");
	var template = require("art/template-native");
	var util = require("syl/utils");
	var WebUpoaderLoader = require("baidu/WebUpoaderLoader");
	
	// 默认属性
	var defaults = {
		
		// jquery selector
		target : "",
		
		// css/img资源路径
		url_resources_cdn : util.getCdnBasePath() + 'lib/jquery/cropper/cropperbox/',
		
		// 模板路径
		url_template : util.getCdnBasePath() + 'lib/jquery/cropper/cropperbox/cropperbox.tmpl',
		
	};
	
	var init = function(options) {
		var opt = $.extend(defaults, options);
		$.ajax({
			url : opt.url_template,
			dataType : 'text',
			success : function(tmpl) {
				var html = $(template.render(tmpl)(opt));
			//	init_html(html);
				$(opt.target).empty().append(html);
				_init();
			},
			error : function() {
				console.warn("load template faild");
			}
		});
	};
	
	var _init = function() {
		
			WebUpoaderLoader.init(function(WebUploader) {

						
						
						// -----------------------------------------------------
						// ------------ START ----------------------------------
						// -----------------------------------------------------

						// ---------------------------------
						// ---------  Uploader -------------
						// ---------------------------------
						var Uploader = (function() {

							// -------setting-------
							// 如果使用原始大小，超大的图片可能会出现 Croper UI 卡顿，所以这里建议先缩小后再crop.
							var FRAME_WIDTH = 1600;


							var _ = WebUploader;
							var Uploader = _.Uploader;
							var uploaderContainer = $('.uploader-container');
							var uploader, file;

							if ( !Uploader.support() ) {
								alert( 'Web Uploader 不支持您的浏览器！');
								throw new Error( 'WebUploader does not support the browser you are using.' );
							}

							// hook,
							// 在文件开始上传前进行裁剪。
							Uploader.register({
								'before-send-file': 'cropImage'
							}, {

								cropImage: function( file ) {
									console.log("cropImage");
									var data = file._cropData,
										image, deferred;

									file = this.request( 'get-file', file );
									deferred = _.Deferred();

									image = new _.Lib.Image();

									deferred.always(function() {
										image.destroy();
										image = null;
									});
									image.once( 'error', deferred.reject );
									image.once( 'load', function() {
										image.crop( data.x, data.y, data.width, data.height, data.scale );
									});

									image.once( 'complete', function() {
										var blob, size;

										// 移动端 UC / qq 浏览器的无图模式下
										// ctx.getImageData 处理大图的时候会报 Exception
										// INDEX_SIZE_ERR: DOM Exception 1
										try {
											blob = image.getAsBlob();
											size = file.size;
											file.source = blob;
											file.size = blob.size;

											file.trigger( 'resize', blob.size, size );

											deferred.resolve();
										} catch ( e ) {
											console.log( e );
											// 出错了直接继续，让其上传原始图片
											deferred.resolve();
										}
									});

									file._info && image.info( file._info );
									file._meta && image.meta( file._meta );
									image.loadFromBlob( file.source );
									return deferred.promise();
								}
							});

							return {
								init: function( selectCb ) {
									console.log("init", selectCb);
									uploader = new Uploader({
										pick: {
											id: '#filePicker',
											multiple: false
										},

										// 设置用什么方式去生成缩略图。
										thumb: {
											quality: 70,

											// 不允许放大
											allowMagnify: false,

											// 是否采用裁剪模式。如果采用这样可以避免空白内容。
											crop: false
										},

										// 禁掉分块传输，默认是开起的。
										chunked: false,

										// 禁掉上传前压缩功能，因为会手动裁剪。
										compress: false,

										// fileSingleSizeLimit: 2 * 1024 * 1024,

										server: '../../server/fileupload.php',
										swf: '../../dist/Uploader.swf',
										fileNumLimit: 1,
										onError: function() {
											console.log("error");
											var args = [].slice.call(arguments, 0);
											alert(args.join('\n'));
										}
									});

									uploader.on('fileQueued', function( _file ) {
										console.log("fileQueued");
										file = _file;
										uploader.makeThumb( file, function( error, src ) {
											console.log("make thumb");
											if ( error ) {
												alert('不能预览');
												return;
											}
											
											selectCb( src );

										}, FRAME_WIDTH, 1 );   // 注意这里的 height 值是 1，被当成了 100% 使用。
									});
								},

								crop: function( data ) {
									console.log("crop");
									var scale = Croper.getImageSize().width / file._info.width;
									data.scale = scale;

									file._cropData = {
										x: data.x1,
										y: data.y1,
										width: data.width,
										height: data.height,
										scale: data.scale
									};
								},

								upload: function() {
									uploader.upload();
								}
							}
						})();

						// ---------------------------------
						// ---------  Crpper ---------------
						// ---------------------------------
						var Croper = (function() {
							var container = $('.cropper-wraper');
							var $image = container.find('.img-container img');
							var btn = $('.upload-btn');
							var isBase64Supported, callback;

							$image.cropper({
								aspectRatio: 16 / 9,
								preview: ".img-preview",
								done: function(data) {
									// console.log(data);
								}
							});

							function srcWrap( src, cb ) {
								console.log("srcWrap", src, cb, isBase64Supported);
								// we need to check this at the first time.
								if (typeof isBase64Supported === 'undefined') {
									(function() {
										var data = new Image();
										var support = true;
										data.onload = data.onerror = function() {
											if( this.width != 1 || this.height != 1 ) {
												support = false;
											}
										}
										data.src = src;
										isBase64Supported = support;
									})();
								}
								console.log(isBase64Supported);

								if ( isBase64Supported ) {
									cb( src );
								} else {
									// otherwise we need server support.
									// convert base64 to a file.
									$.ajax('../../server/preview.php', {
										method: 'POST',
										data: src,
										dataType:'json'
									}).done(function( response ) {
										if (response.result) {
											cb( response.result );
										} else {
											alert("预览出错");
										}
									});
								}
							}

							btn.on('click', function() {
								callback && callback($image.cropper("getData"));
								return false;
							});

							return {
								setSource: function( src ) {
									console.log("set source", src);
									// 处理 base64 不支持的情况。
									// 一般出现在 ie6-ie8
									srcWrap( src, function( src ) {
										console.log($image, "cropper", src);
										$image.cropper("setImgSrc", src);
									});

									container.removeClass('webuploader-element-invisible');
									
									return this;
								},

								getImageSize: function() {
									var img = $image.get(0);
									return {
										width: img.naturalWidth,
										height: img.naturalHeight
									}
								},

								setCallback: function( cb ) {
									callback = cb;
									return this;
								},

								disable: function() {
									$image.cropper("disable");
									return this;
								},

								enable: function() {
									$image.cropper("enable");
									return this;
								}
							}

						})();


						// ------------------------------
						// -----------logic--------------
						// ------------------------------
						var container = $('.uploader-container');

						Uploader.init(function( src ) {
							console.log("Uploader init", Croper, src);
							Croper.setSource( src );

							// 隐藏选择按钮。
							container.addClass('webuploader-element-invisible');
							
							// 当用户选择上传的时候，开始上传。
							Croper.setCallback(function( data ) {
								console.log("croper callback");
								Uploader.crop(data);
								Uploader.upload();
							});
						});



						// -----------------------------------------------------
						// ------------ END ------------------------------------
						// -----------------------------------------------------
					
					
					
					
					
					
					
					
					
					
			});
	};
	
	module.exports = {
		init : init
	}
});