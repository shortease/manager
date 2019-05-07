"use strict";
var Clients = function() {
	var datat;

	var prepareDataTable = function(){
		datat = $("#testdt").DataTable({
			responsive: true,
			dom: `<'kt-hidden'f>t<'row'<'col-sm-12'tr>>
			<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7 dataTables_pager'lp>>`,
			pageLength: 25,

			ajax:{ 
				url:"?page=clients&task=api&action=list_clients",
				type: "GET",
				"type": "POST", // request type
                "timeout": 20000,
                dataSrc: function(res) {
                	var resData = [];
                	/*jQuery.map(res, function(a,b) { resData.push(a)});
                	po(resData)*/

                	return res;
                }
			},

			"order": [[1, 'asc']],	/// start ordering from second column

			columns :[
				{ 
					width: "8%", 
					orderable:false,    
					className:"kt-align-center",        
					defaultContent: '<span class="dropdown">\
									    <a href="#" class="btn btn-sm btn-clean btn-icon btn-icon-md" data-toggle="dropdown" aria-expanded="true">\
									      <i class="la la-ellipsis-h"></i>\
									    </a>\
									    <div class="dropdown-menu dropdown-menu-left">\
									        <a class="dropdown-item edit_client" href="#"><i class="la la-edit "></i> '+et("Edit Details")+'</a>\
									        <a class="dropdown-item change_hidden_status_btn" href="#"> </a>\
									        <a class="dropdown-item delete_client_btn" href="#"><i class="la la-user-times "></i> '+et("Delete client data")+'</a>\
									    </div>\
									</span>\
									<a href="#" class="btn btn-sm btn-clean btn-icon btn-icon-md edit_client kt-hidden-tablet-and-mobile" title="Edit" >\
									  <i class="la la-edit"></i>\
									</a>'
				},
				{ 
					data:"name",
					className: "client_name_td"
				},
				{ data:"isHidden", "visible": false},
			],
			createdRow: function( row, data, dataIndex ) {
				$(row).data("id", data.id);
				$(row).data("name", data.name);
				$(row).data("isHidden", data.isHidden);
				if (data.isHidden == 1) {
					$(row).addClass('kt-shape-bg-color-1');
					$('.change_hidden_status_btn ', row).html('<i class="la la-link "></i>'+et("Set active"));
				} else {
					$('.change_hidden_status_btn ', row).html('<i class="la la-unlink "></i>'+et("Set inactive"));
				}
				$('.client_name_td',row).wrap('<a href="/?com=channels&site_id='+data.site_id+'"></a>')
			},			
		});
		Clients.datat = datat;
	}
	var reloadData = function(){
		datat.ajax.reload().draw();
	}
	var searchHidden = function(hidden_status){
		datat.column(-1).search(hidden_status).draw();
	}

	var prepareControls = function() {

		$('#edit_modal').modal('hide');
		$(document).on('click','.edit_client',  function() {
			var trHolder = $(this).closest('tr');
			var id = trHolder.data('id');
			var name = trHolder.data('name');

			updateClient(id, name);
		});

		$('#generalSearch').on( 'keyup', function () {
		    datat.search( this.value ).draw();
		} );

		$('#save_btn').on('click', function() {
			saveUpdate();
		});

		$('#btn_create_user').on('click', function() {
			updateClient();
		});


		$('#general_update_alert').hide();	

		$(document).on('click','.delete_client_btn',  function() {
			var trHolder = $(this).closest('tr');
			var id = trHolder.data('id');
			var name = trHolder.data('name');
			deleteClient(id, name);
		});
		
		$(document).on('click','.change_hidden_status_btn',  function() {
			var trHolder = $(this).closest('tr');
			var id = trHolder.data('id');
			var isHidden = trHolder.data('isHidden');
			changeHiddenStaus(id, isHidden);
		});

		$(document).on('change','#client_status_select',function() {
			searchHidden($(this).val());
		});
	}

	return {

		///main function to initiate the module
		init: function() {
			prepareDataTable();
			prepareControls();
			searchHidden(0);
		},
		reloadData:reloadData,
		searchHidden: searchHidden,
		datat: datat
	};

}();

$(document).ready(function() {
	Clients.init();
});


function updateClient(id, name, site_url, email){
	if (id) {	/// update mode
		$('#updateTitle').text(et("Update") + " "+name);
		$('#upd_client_id').val(id);
		$('#upd_name').val(name);
		$('#upd_site_url').val(site_url);
		$('#upd_email').val(email);
	} else {	/// create new client
		$('#updateTitle').text(et("Create client"));
		$('#upd_client_id').val(0);
		$('#upd_name').val("");
		$('#upd_site_url').val("");
		$('#upd_email').val("");
	}
	$('#edit_modal').modal('show');
}


function saveUpdate(){
	var form = $('#update_form');

	var btn = $(this);
	form.validate({
        rules: {
            upd_email: {
                required: true,
                email: true,
            },
        	upd_name:{
            	required: true,
            	minlength : 2,
            },
            upd_site_name :{
            	required: true,
            	minlength : 2,
            },
            upd_site_url :{
            	required: true,
            	url : true,
            },
            upd_password: {
                required: true,
            	minlength : 6,
            	maxlength : 20,
            },
        }
    });
    if (!form.valid()) {
        return;
    }
    /// loading class
    btn.addClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', true);

    form.ajaxSubmit({
        url: '/?page=clients&task=api&action=update_client',

        success: function(response, status, xhr, $form) {
            if (response) { 
            	if (!response.error) {	/// no error
            		Clients.reloadData();
					$('#edit_modal').modal('hide');
            	} else {
                	if (response.error == 1) {
                		showError($('#name_error'), response.error_msg);
                	}
                   else if (response.error == 2) { 
                   		showError($('#email_error'), response.error_msg);
                   } else { 
                   		showError($('#general_update_alert'), response.error_msg);
                   }
               }
            } else {
            	showError($('#general_update_alert'), et('Can not create client'));
            }
         }
    });
}

var delete_id = 0;

function deleteClient(id, name){
	delete_id = id;
	$('.del_client_name').text(name);
	$('#delete_modal').modal('show');
	$(document).on('click','#delete_btn',function(){
		$.ajax({ 
			url: '/?page=clients&task=api&action=delete_client',
			data : {
				client_id:delete_id
			}
		})
		.done(function(response, status, xhr, $form) {
	    	Clients.reloadData();
	    	$('#delete_modal').modal('hide');
	    });
	});
}

function changeHiddenStaus(id, hidden_status){
		$.ajax({ 
			url: '/?page=clients&task=api&action=set_hidden_status',
			data : {
				client_id:id,
				hidden_status: hidden_status
			}
		})
		.done(function(response, status, xhr, $form) {
	    	Clients.reloadData();
	    	Clients.datat.draw();
	    });
}

function showError(errorTarget, error_msg){
	var ERROR_DURATION_S = 5;
	var textTarget = $('.alert-text', errorTarget);
	if (!textTarget.length) textTarget = errorTarget;
	errorTarget.text(error_msg).show("slow");
	setTimeout(function() { errorTarget.hide("slow", function() { errorTarget.text(""); }); }, ERROR_DURATION_S * 1000);
}