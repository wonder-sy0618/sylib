	
	<div class="panel panel-default">
		<div class="panel-heading">
			角色管理
			<button type="button" class="btn btn-xs btn-primary pull-right"
					data-toggle="modal" data-target="#dialog_role_edit" >添加</button>
			<!-- Modal -->
			<div class="modal fade" id="dialog_role_edit" tabindex="-1" role="dialog" style="display:none;" >
				<div class="modal-dialog">
			    <div class="modal-content">
			      <div class="modal-header">
			        <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
			        <h4 class="modal-title" id="myModalLabel">添加角色</h4>
			      </div>
			      <div class="modal-body">
			        ...
			      </div>
			      <div class="modal-footer">
			        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
			        <button type="button" class="btn btn-primary">Save changes</button>
			      </div>
			    </div>
			  </div>
			</div>
			</div>	<!-- /Modal -->
		</div>
		<div class="panel-body">
		
			<table class="table table-condensed table-main-data" >
				<tr class="title" style="font-weight: bold;" >
					<td>ID</td>
					<td>角色名</td>
					<td>安全级别</td>
					<td>描述</td>
					<td>操作</td>
				</tr>
			</table>
			
			<script id="temp_main_data_line" type="text/html">
				<tr>
					<td>{{id }}</td>
					<td>{{display }}</td>
					<td>{{level }}</td>
					<td>{{description}}</td>
					<td>
						<div class="btn-group btn-group-xs">
							<button type="button" class="btn btn-xs btn-primary" 
								data-toggle="modal" data-target="#dialog_role_edit_{{id }}" >管理</button>
						<!-- Modal -->
						<div class="modal fade" id="dialog_role_edit_{{id }}" tabindex="-1" role="dialog" style="display:none;" >
							<div class="modal-dialog">
						    <div class="modal-content">
						      <div class="modal-header">
						        <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
						        <h4 class="modal-title" id="myModalLabel">更新角色</h4>
						      </div>
						      <div class="modal-body">
						      	
						        <form class="form-horizontal" role="form">
								  <div class="form-group">
								    <label for="form_id" class="col-sm-2 control-label">ID</label>
								    <div class="col-sm-10">
								      <input type="text" class="form-control" id="form_id" value="{{id }}" >
								    </div>
								  </div>
								  <div class="form-group">
								    <label for="form_level" class="col-sm-2 control-label">级别</label>
								    <div class="col-sm-10">
								    	<select id="form_level" class="form-control" >
								    		{{each securityLevels as value i}}
										        <option index="{{i}}" value="{{value}}"
										        {{if level == value}}selected="selected"{{/if}} >{{value}}</option>
										    {{/each}}
								    	</select>
								    </div>
								  </div>
								  <div class="form-group">
								    <label for="form_name" class="col-sm-2 control-label">名称</label>
								    <div class="col-sm-10">
								      <input type="text" class="form-control" id="form_name" value="{{display }}" >
								    </div>
								  </div>
								  <div class="form-group">
								    <label for="form_description" class="col-sm-2 control-label">描述</label>
								    <div class="col-sm-10">
								    	<textarea class="form-control" id="form_description" >{{description }}</textarea>
								    </div>
								  </div>
								  <div class="form-group">
								    <label class="col-sm-2 control-label">权限</label>
								    <div class="col-sm-10">
								    	<table class="table table-condensed" >
								    		<tr style="font-weight: bold;" >
								    			<td>组</td>
								    			<td>操作</td>
								    			<td>授权</td>
								    		</tr>
								    		{{each rules as value i}}
									    		<tr>
									    			<td>{{value.group }}</td>
									    			<td>{{value.name }}</td>
									    			<td><input type="checkbox" name="form_authority" value="{{value.group }}:{{value.name }}" /></td>
									    		</tr>
								    		{{/each}}
								    	</table>
								    </div>
								  </div>
								</form>
								
						      </div>
						      <div class="modal-footer">
						        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
						        <button type="button" class="btn btn-primary">Save changes</button>
						      </div>
						    </div>
						  </div>
						</div>
						</div>	<!-- /Modal -->
					</td>
				</tr>
			</script>
			
			<script type="text/javascript" >
			
				$(document).ready(function() {
					$.ajax({
						url : 'webSecurity/controlCenter/roleData.do',
						dataType : 'json',
						success : function(data) {
							$(".table-main-data tr").not(".title").remove();
							$.each(data.roles, function(k, v) {
								v.securityLevels = data.securityLevels;
								v.rules = data.rules;
								console.log(v.rules);
								var html = template('temp_main_data_line', v);
								$(".table-main-data").append(html);
							});
						}
					});
				});
			
			</script>
			
		</div>
	</div>