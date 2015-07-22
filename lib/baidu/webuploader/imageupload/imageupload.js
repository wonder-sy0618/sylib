

define(function(require, exports, module) {
	
	var jQuery = require("jquery/jquery");
	var WebUpoaderLoader  = require("baidu/WebUpoaderLoader");
	var utils = require("syl/utils/utils");
	var template = require("art/template");
	
	require("baidu/webuploader/imageupload/style.css");
	

	/**
	 * 默认配置
	 */
	var defaults = {
		
		// select element
		element : '',
		
		// 服务器地址
		server : '',
        
        // 模板路径
        path_tmpl : utils.getCdnBasePath() + "lib/baidu/webuploader/imageupload/imagebox.tmpl",
		
		// 图片列表变更事件
		imagearray_change : function(imgarray) {},
		
		// 最大文件数量，-1不限制
		maxFileNum : -1,
		
		// 文件数量修正
		reviseFileNum : 0,
		
		// 初始化完成
		init_ready : function() {}

	};
	
	
	/**
	 * 加载模板
	 */
	var loadTmpl = function(url, option, callback) {
        // 使用ajax菜单数据初始化
        $.when( 
            $.ajax({ url : url, dataType : 'text' })
        ).done(function (tmpl) {
			var html = $(template.render(tmpl)(option));
            callback(html);
			init_ready(html);
        });      
	};
	
	
	
	/**
	 * 初始化
	 */
	var init = function(options) {
		var opt = $.extend(defaults, options);
		opt.instances = Math.ceil(Math.random() * 90000000 + 10000000);
		loadTmpl(opt.path_tmpl, opt, function(html) {
			opt.imgarray = opt.imgarray ? opt.imgarray : [],
			opt.wrap = $(html),
			opt.wrap.appendTo($(opt.element)),
			opt.queue = $('<ul class="filelist"></ul>').appendTo(opt.wrap.find('.queueList')),
			opt.statusBar = opt.wrap.find('.statusBar'),
			opt.info = opt.statusBar.find('.info'),
			opt.upload = opt.wrap.find('.uploadBtn'),
			opt.placeHolder = opt.wrap.find('.placeholder'),
			opt.progress = opt.statusBar.find('.progress').hide(),
            opt.fileCount = 0,
            opt.fileSize = 0,
            opt.ratio = window.devicePixelRatio || 1,
            opt.thumbnailWidth = 110 * opt.ratio,
            opt.thumbnailHeight = 110 * opt.ratio,
            opt.state = 'pedding',		// 可能有pedding, ready, uploading, confirm, done.
            opt.percentages = {},
			opt.isSupportBase64 = isSupportBase64(),
			opt.flashVersion = flashVersion(),
			opt.supportTransition = supportTransition();
			// instance
			WebUpoaderLoader.init(function(WebUploader) {
				opt.uploader = WebUploader.create({
					pick: {
						id: '.uploader[instances='+opt.instances+'] .filePicker',
						label: '点击选择图片'
					},
					formData: {
					},
					dnd: '.uploader[instances='+opt.instances+'] .dndArea',
					paste: '.uploader[instances='+opt.instances+']',
					swf: utils.getCdnBasePath() + 'lib/baidu/webuploader/Uploader.swf',
					chunked: false,
					chunkSize: 512 * 1024,
					server: opt.server,
					disableGlobalDnd: true,
					fileNumLimit: 300,
					fileSizeLimit: 200 * 1024 * 1024,    // 200 M
					fileSingleSizeLimit: 50 * 1024 * 1024    // 50 M
				});
				// 拖拽时不接受 js, txt 文件。
				opt.uploader.on('dndAccept', function(items) {
					var denied = false,
						len = items.length,
						i = 0,
						// 修改js类型
						unAllowed = 'text/plain;application/javascript ';
					for ( ; i < len; i++ ) {
						// 如果在列表里面
						if ( ~unAllowed.indexOf( items[ i ].type ) ) {
							denied = true;
							break;
						}
					}
					return !denied;
				});
				opt.uploader.on('dialogOpen', function() {
					console.log('here');
				});
				// 添加“添加文件”的按钮，
				opt.uploader.addButton({
					id: '.uploader[instances='+opt.instances+'] .filePicker2',
					label: '继续添加'
				});
				opt.uploader.on('ready', function() {
					window.uploader = opt.uploader;
				});
				// 注册事件
				opt.uploader.onFileQueued = function(file) {
					opt.fileCount++;
					opt.fileSize += file.size;
					if ( opt.fileCount === 1 ) {
						opt.placeHolder.addClass('element-invisible');
						opt.statusBar.show();
					}
					addFile(file, opt);
					setState('ready', opt, WebUploader);
					updateTotalProgress(opt, WebUploader);
					return false;
				};
				opt.uploader.onFileDequeued = function(file) {
					opt.fileCount--;
					opt.fileSize -= file.size;
					if ( !opt.fileCount ) {
						setState('pedding', opt, WebUploader);
					}
					removeFile(file, opt, WebUploader);
					updateTotalProgress(opt, WebUploader);

				};
				opt.uploader.onUploadProgress = function( file, percentage ) {
					var $li = $('#'+file.id),
						$percent = $li.find('.progress span');

					$percent.css( 'width', percentage * 100 + '%' );
					opt.percentages[ file.id ][ 1 ] = percentage;
					updateTotalProgress(opt, WebUploader);
				};
				opt.uploader.on( 'all', function(type) {
					var stats;
					switch( type ) {
						case 'uploadFinished':
							setState( 'confirm', opt, WebUploader );
							break;

						case 'startUpload':
							setState( 'uploading', opt, WebUploader );
							break;

						case 'stopUpload':
							setState( 'paused', opt, WebUploader );
							break;
							
						case 'beforeFileQueued' : 
							if (opt.maxFileNum > 0 && opt.reviseFileNum + opt.fileCount >= opt.maxFileNum) {
								alert("文件数量已经达到最大个数");
								return false;
							}
							break;

					}
				});
				opt.uploader.onError = function( code ) {
					if (code == 'F_DUPLICATE') {
						alert('已经选择该文件');
					} else {
						alert( 'Eroor: ' + code );
					}
				};
				opt.uploader.onUploadAccept = function(object, ret) {
					if (ret && ret.err_code && ret.err_code == '0000') {
						opt.imgarray.push(ret.url);
						return true;
					} else {
						return false;
					}
				};
				opt.upload.on('click', function() {
					if ( $(this).hasClass( 'disabled' ) ) {
						return false;
					}
					if ( opt.state === 'ready' ) {
						opt.uploader.upload();
					} else if ( opt.state === 'paused' ) {
						opt.uploader.upload();
					} else if ( opt.state === 'uploading' ) {
						opt.uploader.stop();
					}
				});
				opt.info.on('click', '.retry', function() {
					opt.uploader.retry();
				});
				opt.info.on('click', '.ignore', function() {
					alert('todo');
				});
				opt.upload.addClass( 'state-' + opt.state );
				updateTotalProgress(opt, WebUploader);
				// init
				if (opt.imgarray.length > 0) {
					opt.placeHolder.addClass('element-invisible');
					opt.statusBar.show();
					$.each(opt.imgarray, function(k, img) {
						opt.queue.append('<li class="state-complete"><p class="title"></p><p class="imgWrap"><img src="'+img+'"></p><p class="progress"><span style="display: none; width: 0px;"></span></p><span class="success"></span></li>');
					});
				}
			});
		});
	};



	// 负责view的销毁
	var removeFile = function ( file, opt, WebUploader ) {
		var $li = $('#'+file.id);

		delete opt.percentages[ file.id ];
		updateTotalProgress(opt, WebUploader);
		$li.off().find('.file-panel').off().end().remove();
	}
	
	
	
	var updateTotalProgress = function(opt, WebUploader) {
		var loaded = 0,
			total = 0,
			spans = opt.progress.children(),
			percent;

		$.each( opt.percentages, function( k, v ) {
			total += v[ 0 ];
			loaded += v[ 0 ] * v[ 1 ];
		} );

		percent = total ? loaded / total : 0;


		spans.eq( 0 ).text( Math.round( percent * 100 ) + '%' );
		spans.eq( 1 ).css( 'width', Math.round( percent * 100 ) + '%' );
		updateStatus(opt, WebUploader);
	}
	
	
	
	
            
	// 判断浏览器是否支持图片的base64
	var isSupportBase64 = function() {
		var data = new Image();
		var support = true;
		data.onload = data.onerror = function() {
			if( this.width != 1 || this.height != 1 ) {
				support = false;
			}
		}
		data.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
		return support;
	};
	
	
	// FLASH 版本
	var flashVersion = function() {
		var version;

		try {
			version = navigator.plugins[ 'Shockwave Flash' ];
			version = version.description;
		} catch ( ex ) {
			try {
				version = new ActiveXObject('ShockwaveFlash.ShockwaveFlash')
						.GetVariable('$version');
			} catch ( ex2 ) {
				version = '0.0';
			}
		}
		version = version.match( /\d+/g );
		return parseFloat( version[ 0 ] + '.' + version[ 1 ], 10 );
	};
	
	// 
	var supportTransition = function() {
		var s = document.createElement('p').style,
		r = 'transition' in s ||
			'WebkitTransition' in s ||
			'MozTransition' in s ||
			'msTransition' in s ||
			'OTransition' in s;
		s = null;
		return r;
	};
	
	
	// 添加文件
	var addFile = function(file, opt) {
		var $li = $( '<li id="' + file.id + '">' +
					'<p class="title">' + file.name + '</p>' +
                    '<p class="imgWrap"></p>'+
                    '<p class="progress"><span></span></p>' +
                    '</li>' ),
		$btns = $('<div class="file-panel">' +
					'<span class="cancel">删除</span>' +
                    '<span class="rotateRight">向右旋转</span>' +
                    '<span class="rotateLeft">向左旋转</span></div>').appendTo( $li ),
		$prgress = $li.find('p.progress span'),
		$wrap = $li.find( 'p.imgWrap' ),
		$info = $('<p class="error"></p>'),
		showError = function( code ) {
			switch( code ) {
				case 'exceed_size':
					text = '文件大小超出';
					break;

				case 'interrupt':
					text = '上传暂停';
					break;

				default:
					text = '上传失败，请重试';
					break;
			}

			$info.text( text ).appendTo( $li );
		};
		if ( file.getStatus() === 'invalid' ) {
			showError( file.statusText );
		} else {
			// @todo lazyload
			$wrap.text( '预览中' );
			uploader.makeThumb( file, function( error, src ) {
				var img;

				if ( error ) {
					$wrap.text( '不能预览' );
					return;
				}

				if( isSupportBase64 ) {
					img = $('<img src="'+src+'">');
					$wrap.empty().append( img );
				} else {
					$.ajax(opt.server, {
						method: 'POST',
						data: src,
						dataType:'json'
					}).done(function( response ) {
						if (response.result) {
							img = $('<img src="'+response.result+'">');
							$wrap.empty().append( img );
						} else {
							$wrap.text("预览出错");
						}
					});
				}
			}, opt.thumbnailWidth, opt.thumbnailHeight );

			opt.percentages[ file.id ] = [ file.size, 0 ];
			file.rotation = 0;
		}

		file.on('statuschange', function( cur, prev ) {
			if ( prev === 'progress' ) {
				$prgress.hide().width(0);
			} else if ( prev === 'queued' ) {
				$li.off( 'mouseenter mouseleave' );
				$btns.remove();
			}

			// 成功
			if ( cur === 'error' || cur === 'invalid' ) {
				console.log( file.statusText );
				showError( file.statusText );
				opt.percentages[ file.id ][ 1 ] = 1;
			} else if ( cur === 'interrupt' ) {
				showError( 'interrupt' );
			} else if ( cur === 'queued' ) {
				opt.percentages[ file.id ][ 1 ] = 0;
			} else if ( cur === 'progress' ) {
				$info.remove();
				$prgress.css('display', 'block');
			} else if ( cur === 'complete' ) {
				$li.append( '<span class="success"></span>' );
			}

			$li.removeClass( 'state-' + prev ).addClass( 'state-' + cur );
		});

		$li.on( 'mouseenter', function() {
			$btns.stop().animate({height: 30});
		});

		$li.on( 'mouseleave', function() {
			$btns.stop().animate({height: 0});
		});

		$btns.on( 'click', 'span', function() {
			var index = $(this).index(),
				deg;

			switch ( index ) {
				case 0:
					opt.uploader.removeFile( file );
					return;

				case 1:
					file.rotation += 90;
					break;

				case 2:
					file.rotation -= 90;
					break;
			}

			if ( supportTransition ) {
				deg = 'rotate(' + file.rotation + 'deg)';
				$wrap.css({
					'-webkit-transform': deg,
					'-mos-transform': deg,
					'-o-transform': deg,
					'transform': deg
				});
			} else {
				$wrap.css( 'filter', 'progid:DXImageTransform.Microsoft.BasicImage(rotation='+ (~~((file.rotation/90)%4 + 4)%4) +')');
			}


		});

		$li.appendTo(opt.queue);
	};
	
	// 设置状态
	var setState = function(val, opt, WebUploader) {
		var file, stats;

		if ( val === opt.state ) {
			return;
		}

		opt.upload.removeClass( 'state-' + opt.state );
		opt.upload.addClass( 'state-' + val );
		opt.state = val;

		switch ( opt.state ) {
			case 'pedding':
				opt.placeHolder.removeClass( 'element-invisible' );
				opt.queue.hide();
				opt.statusBar.addClass( 'element-invisible' );
				uploader.refresh();
				break;

			case 'ready':
				opt.placeHolder.addClass( 'element-invisible' );
				$('.uploader[instances='+opt.instances+'] .filePicker2').removeClass( 'element-invisible');
				opt.queue.show();
				opt.statusBar.removeClass('element-invisible');
				uploader.refresh();
				break;

			case 'uploading':
				$('.uploader[instances='+opt.instances+'] .filePicker2').addClass( 'element-invisible' );
				opt.progress.show();
				opt.upload.text( '暂停上传' );
				break;

			case 'paused':
				opt.progress.show();
				opt.upload.text( '继续上传' );
				break;

			case 'confirm':
				opt.progress.hide();
				$('.uploader[instances='+opt.instances+'] .filePicker2').removeClass( 'element-invisible' );
				opt.upload.text( '开始上传' );

				stats = opt.uploader.getStats();
				if ( stats.successNum && !stats.uploadFailNum ) {
					setState('finish', opt, WebUploader);
					return;
				}
				break;
			case 'finish':
				stats = opt.uploader.getStats();
				if ( stats.successNum ) {
					opt.imagearray_change(opt.imgarray);
					// alert( '上传成功' );
					
				} else {
					// 没有成功的图片，重设
					opt.state = 'done';
					location.reload();
					
				}
				break;
		}

		updateStatus(opt, WebUploader);
	};
	
	// 更新状态
	var updateStatus = function (opt, WebUploader) {
		var text = '', stats;
		if ( opt.state === 'ready' ) {
			text = '选中' + opt.fileCount + '张图片，共' +
					WebUploader.formatSize( opt.fileSize ) + '。';
			if (opt.maxFileNum > 0) {
				var fileAllocCount = opt.maxFileNum - opt.fileCount - opt.reviseFileNum;
				if (fileAllocCount > 0) {
					text = text + '还可以添加'+fileAllocCount+'张图片。';
				} else {
					text = text + '不能再添加图片。';
				}
			}
		} else if ( opt.state === 'confirm' ) {
			stats = opt.uploader.getStats(opt);
			if ( stats.uploadFailNum ) {
				text = '已成功上传' + stats.successNum+ '张照片至XX相册，'+
					stats.uploadFailNum + '张照片上传失败，<a class="retry" href="#">重新上传</a>失败图片或<a class="ignore" href="#">忽略</a>'
			}
		} else {
			stats = opt.uploader.getStats(opt);
			text = '共' + opt.fileCount + '张（' +
					WebUploader.formatSize( opt.fileSize )  +
					'），已上传' + stats.successNum + '张';

			if ( stats.uploadFailNum ) {
				text += '，失败' + stats.uploadFailNum + '张';
			}
		}
		opt.info.html( text );
	};

	
	
	
	
	
	
	
	
	
	
	
	module.exports = {
		init : init
	};
	
});