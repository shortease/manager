"use strict";
var Users = function() {
	var datat, selectChannelsDT, selectChannelsDTdata;
	var channels_arr = [];

	var prepareDataTable = function(){
	datat = $("#users_dt").DataTable({
			responsive: true,
			dom: `<'kt-hidden'f>t<'row'<'col-sm-12'tr>>
			<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7 dataTables_pager'lp>>`,
			pageLength: 25,

		ajax:{ 
			url:"?page=users&task=api&action=list_users",
			type: "GET",
			"type": "POST", // request type
            "timeout": 20000,
            dataSrc: function(res) {
            	var resData = [];
            	jQuery.map(res, function(a,b) { resData.push(a)});
            	//channels_arr = resData;
				//prepareSelectChannelsDataTable();
            	return resData;
            }
		},
		order:  [ [ 1, 'asc' ]],
		createdRow: function( row, data, dataIndex ) {
			$(row).data("ix",dataIndex);
			if (data.group == 1) $(row).addClass('red_row');
			if (data.disabled == 1) {
				$(row).addClass('disabled_user_row');
				$('.disable_btn span',row).text(et("Enable user"));
				$('.disable_btn i',row).addClass('fa-user');
			} else {
				$('.disable_btn span',row).text(et("Disable user"));
				$('.disable_btn i',row).addClass('fa-user-slash');
			}
		},
		columns :[
				{ 
					width: "8%", 
					orderable:false,    
					className:"kt-align-center drop_menu",        
					defaultContent: '<span class="dropdown">\
									    <a href="#" class="btn btn-sm btn-clean btn-icon btn-icon-md" data-toggle="dropdown" aria-expanded="true" alt="'+et("Edit Details")+'">\
									      <i class="la la-ellipsis-h"></i>\
									    </a>\
									    <div class="dropdown-menu dropdown-menu-left">\
									        <a class="dropdown-item disable_btn" href="#"><i class="fa "></i>  <span class=""></span></a>\
									        <a class="dropdown-item remove_btn" href="#"><i class="la la-close"></i> <span class="">'+et("Delete user")+'</span></a>\
									    </div>\
									</span>'
				},
				{ 
					data:"clientName",
					className: "row_edit",
				},
				{ 
					data:"full_name",
					className: "row_edit",
				},
				{ 
					data:"email",
					className: "row_edit",
				},
				{ 
					data:null,
					className: "row_edit",
					"render": function(data,type,row) { return groupToString(data["group"]);  }
				},
		],
		"initComplete": function(settings, json) {
			Users.datat = datat;
		  }			

		});
	};

	var email_exists = false;
	var prepareControls = function() {
		/// update on click on tr
		$(document).on('click','#users_dt tbody .row_edit',function(){
			var curRow = $(this).closest('tr');
			var ix = curRow.data("ix");
			openEditDialog(datat.data()[ix]);
		});

		/// crate new user
		$(document).on('click','#btn_create_user',function(){
			openEditDialog();
		});

		$(document).on('click','#save_btn',function(){
			save();
		});

		$('#generalSearch').on( 'keyup', function () {
			po(this.value);
		    datat.search( this.value ).draw();
		} );
		/// check email exists
		$(document).on('input','#upd_email',function(){
			$.ajax({url:"?page=users&task=api&action=check_email&user_email="+$(this).val()+"&uid="+$('#add_modal #upd_user_id').val()})
				.done(function(data) {
					if (data) {	/// email exists in other user
						showError($('#email_error'),et("Email already exists"), false);
					} else {
						showError($('#email_error'),"", false);
					}
				});
		});

		/// update group input on click on group checkbixes
		$(document).on('change','#add_modal .group_check',function(){
			$('#add_modal #upd_group').val(checkboxesToGroup())
		});

		/// prepare client selection in new user dialog
		if (man_group == 1) { 
			$('#add_modal #client_select').append($('<option value="0">NO CLIENT</option>'));
			for(var i=0;i<clients.length;i++){
				$('#add_modal #client_select').append($('<option value="'+clients[i].id+'">'+clients[i].name+'</option>'));
			}
		} else {
			$('#upd_client_id').val(clients.id);
		}
		$('#add_modal #client_select').selectize({
			create: true,
			sortField: 'text'			
		});
		$('#add_modal #client_select').change(function() {
			$('#upd_client_id').val($('#add_modal #client_select').val());
		})

		/// disable user
		$(document).on('click','.disable_btn',function(e){
			var ix = $(this).closest('tr').data("ix");
			var rowData = datat.data()[ix];
			$.ajax({url:"?page=users&task=api&action=disable_user&uid="+rowData.id+"&disable="+(parseInt(rowData.disabled) == 0 ? 1 : 0)})
				.done(function(data) {
					reloadData();
				});			
		});
		
		/// remove user
		$('#delete_btn').click(function(){
			$.ajax({url:"?page=users&task=api&action=remove_user&uid="+user_id_to_remove})
			.done(function(data) {
				deleteDialog.modal('hide');
				reloadData();
			});	
		});

		 
		$(document).on('click','.remove_btn',function(e){
			var ix = $(this).closest('tr').data("ix");
			var rowData = datat.data()[ix];
			openDeleteDialog(rowData);
		});
		
	};

	var reloadData = function(){
		datat.ajax.reload().draw();
	}

	var save = function(){
		var form = $('#update_form');
		var btn = $(this);
		form.validate({
	        rules: {
	            upd_email: {
	                required: true,
	                email: true,
	            },
		        upd_pass: {
		            required: false,
		        	minlength : 6,
		        	maxlength : 20,
		        },
	        }
	    });
	    if (!form.valid()) { 
	        return;
	    }

		const 	EMAIL_EXISTS = -100,
		WRONG_FORMAT_EMAIL = -101,
		WRONG_FORMAT_PASSWORD = -102,
		CANT_ASSIGN_GROUP = -103;

        form.ajaxSubmit({
            url: '/?page=users&task=api&action=update_user',
            success: function(response, status, xhr, $form) {
                if (response) { 
                	if (!response.error) {	/// no error
                		reloadData();
    					$('#add_modal').modal('hide');
                	} else {
                    	if (response.error == EMAIL_EXISTS) {
                    		showError($('#email_error'), et("Email already exists"), false);
                    	}
                       else if (response.error == WRONG_FORMAT_EMAIL) { 
                       		showError($('#email_error'), et("Wrong email format"), false);
                       	}
                       else if (response.error == WRONG_FORMAT_PASSWORD) { 
                       		showError($('#email_error'), et("Wrong password format"), false);
                       	}
                       else if (response.error == CANT_ASSIGN_GROUP) { 
                       		showError($('#general_update_alert'), et("You are not authorized for this"));
                       } else { 
                       		showError($('#general_update_alert'),'Can not create/update user');
                       }
                   }
                } else {
                	showError($('#general_update_alert'), et('Can not create/update user'));
                }
             }
        });
	};
	return {
		init: function() { 
			prepareDataTable();
			prepareControls();
		},	
		datat : datat
	}
}();

$(document).ready(function() {
	Users.init();
});

var groups = {
	1 : "Root", 
	2 : "Manager", 
	4 : "Reports", 
	8 : "Users", 
};

function groupToString(grStr) {
	var groupsStr = "";
	for (let key in groups) {
		if (groupsStr.length && key & grStr) groupsStr += ", ";
		groupsStr += (key & grStr ? groups[key] : "");
	}
	return groupsStr;
}

function groupToCheckboxes(groupInt) {
	var inputs = $('.group_check');
	inputs.each(function() { 
		var groupix = $(this).data("groupix");
		$(this).prop("checked",groupix & groupInt);
	});
}

function checkboxesToGroup(){
	var inputs = $('.group_check');
	var groupCalc = 0;
	inputs.each(function() { 
		groupCalc += $(this).prop("checked") ? $(this).data("groupix") : 0;
	});
	return groupCalc;
}

var dialog = $('#add_modal');
function openEditDialog(userData){
	$('#upd_user_id',dialog).val(0);
	$('#upd_name',dialog).val("");
	$('#upd_email',dialog).val("");
	$('#upd_pass',dialog).val("");
	$('#add_modal #client_select_holder').hide();
	if (man_group == 1) { 
		$('#add_modal #upd_group').val(14);
	}
	else {
		$('#add_modal #upd_group').val(man_group);
	}

	$('#add_modal .alert-danger').hide(); /// hide errors on show
	if (userData){
		$('#upd_user_id',dialog).val(userData.id);
		$('#upd_name',dialog).val(userData.full_name);
		$('#upd_email',dialog).val(userData.email);
		$('#upd_group',dialog).val(userData.group);
	} else {
		if (man_group == 1) { 
			$('#add_modal #client_select_holder').show();
		}
	}
	groupToCheckboxes($('#upd_group',dialog).val());
	dialog.modal('show');
}

var deleteDialog = $('#delete_modal');
var user_id_to_remove = 0;
function openDeleteDialog(userData){
	user_id_to_remove = userData.id;
	 $('#delete_modal .del_user_name').text(userData.full_name);
	deleteDialog.modal('show');
}

function showError(errorTarget, error_msg, toHideDelay = true){
	var ERROR_DURATION_S = 5;
	var textTarget = $('.alert-text', errorTarget);
	if (!textTarget.length) textTarget = errorTarget;
	if(error_msg.length) {
		errorTarget.text(error_msg).show("slow");
	} else {
		errorTarget.hide("slow", function() { errorTarget.text(""); });
	}
	if (toHideDelay) {
		setTimeout(function() { errorTarget.hide("slow", function() { errorTarget.text(""); }); }, ERROR_DURATION_S * 1000);
	}
}