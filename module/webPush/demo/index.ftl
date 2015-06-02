<!DOCTYPE html>
<html lang="zh-cn" xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>
		聊天室
    </title>
    <link href="http://libs.baidu.com/bootstrap/3.0.3/css/bootstrap.min.css" rel="stylesheet" type="text/css" />

    <style type="text/css">
    body {
	  padding-top: 30px;
	}
    </style>
  </head>
  <body channel="${channel }" sid="${sid }" sign="${sign }" >
    
    <div class="container demo_dialog">
	      <div class="col-md-2 col-xs-2" ></div>
	      <div class="col-md-8 col-xs-8" >
		      <div class="panel panel-primary" >
		        <div class="panel-heading" >
		        	<div style="display: inline;" >聊天室</div>
		        </div>
		        <div class="panel-body" >
		        	<!-- 消息框 -->
		          	<div class="panel panel-default" style="min-height: 300px;" >
					  <div class="panel-body message_box_panel" style="font-size: 13px; overflow-y: auto; height: 300px;" >
					  </div>
					</div>
		        	<!-- 输入框 -->
		        	<div class="form_textarea" >
		          		<textarea class="form-control" rows="3" style="resize: none;" ></textarea>
		          	</div>
		        	<!-- 消息框 -->
		          	<div style="float:right; padding-top: 10px; padding-right: 10px;" >
					    <button type="button" class="btn btn-primary btn_send" >发送</button>
					</div>
		          	
		        </div>
		      </div>
	      </div>
	      <div class="col-md-2 col-xs-2" ></div>
	    </div>
    </div> <!-- /container -->

    <script src="http://cdn.bootcss.com/jquery/1.11.1/jquery.min.js"></script>
    <script src="http://cdn.bootcss.com/bootstrap/3.2.0/js/bootstrap.min.js"></script>
	<script type="text/javascript" src="http://momentjs.com/downloads/moment.js" ></script>
    
    <script src="../../../resources/module/webPush/pushSupport.js" ></script>
    <script src="index.js" ></script>
    
  </body>
</html>