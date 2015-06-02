

	<style>
		.form_info {
			display: inline;
			font-size: 13px;
			margin-left: 15px;
		}
	</style>
	<script type="text/javascript" >
		$(document).ready(function() {
			var input_callback = function() {
				$(".has-error").removeClass("has-error");
				$("#setting_form button[type='submit']").attr("disabled", false);
				$(".form_info").empty();
				
				// 累计关注数量修正
				if (!new RegExp(/^[-\d]+$/g).test($("#form_accumulative_amendments").val())) {
					$("#form_accumulative_amendments").parents(".form-group").addClass("has-error");
					$("#setting_form button[type='submit']").attr("disabled", true);
				} else {
					if ($("#form_accumulative_amendments").val() == $("#form_accumulative_amendments").attr("server_value") ) {
						$("#setting_form button[type='submit']").attr("disabled", true);
					}
				}
			};
			$("#setting_form input").unbind().bind("change", input_callback).bind("input", input_callback);
			// form
			$('#setting_form').ajaxForm({
	            dataType: "json",
	            callback: function (data) {
	                console.log(data);
	            }
	        });
		});
	</script>

	<div class="panel panel-default">
		<div class="panel-heading">
			系统设置
		</div>
		<div class="panel-body">
		
		<form class="form-horizontal" role="form" id="setting_form" action="setting.do" >
		  <div class="form-group">
		    <label for="form_accumulative_amendments" class="col-sm-2 control-label">累计关注人数修正</label>
		    <div class="col-sm-10">
		      <input type="text" class="form-control" name="accumulative_amendments" id="form_accumulative_amendments"
		       value="${accumulative_amendments?c }" placeholder="关注累计数量修正" server_value="${accumulative_amendments?c }" >
		    </div>
		  </div>
		  <div class="form-group">
		    <div class="col-sm-offset-2 col-sm-10">
		      <button type="submit" class="btn btn-success" disabled="disabled" >保存</button>
				<#if form_submit?? && form_submit == 'success' >
			  		<div class="form_info" >保存成功</div>
				</#if>
		    </div>
		  </div>
		</form>
			
		</div>
	</div>
    
