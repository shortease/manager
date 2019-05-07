"use strict";
var Channels = function() {
	var datat;

	var prepareDataTable = function(){
		datat = $("#channels_dt").DataTable({
			responsive: true,
			dom: `<'kt-hidden'f>t<'row'<'col-sm-12'tr>>
			<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7 dataTables_pager'lp>>`,
			pageLength: 25,

			ajax:{ 
				url:"?page=channels&task=api&action=list_channels&site_id="+site_id,
				type: "GET",
				"type": "POST", // request type
                "timeout": 20000,
                dataSrc: function(res) {
                	var resData = [];
                	jQuery.map(res, function(a,b) { resData.push(a)});
                	return resData;
                }
			},

//			"order": [[3, 'asc']],	/// start ordering from second column

			columns :[
				{ 
					width: "8%", 
					orderable:false,    
					className:"kt-align-center",        
					defaultContent: '<span class="dropdown">\
									    <a href="#" class="btn btn-sm btn-clean btn-icon btn-icon-md" data-toggle="dropdown" aria-expanded="true" alt="'+et("Edit Details")+'">\
									      <i class="la la-ellipsis-h"></i>\
									    </a>\
									    <div class="dropdown-menu dropdown-menu-left">\
									        <a class="dropdown-item edit_channel" href="#"><i class="la la-edit "></i> '+et("Edit Details")+'</a>\
									        <a class="dropdown-item add_channel_under" href="#"><i class="flaticon2-plus "></i> '+et("Add subchannel")+'</a>\
									        <a class="dropdown-item delete_channel_btn" href="#"><i class="la la-close"></i> '+et("Delete channel data")+'</a>\
									    </div>\
									</span>\
									<a href="#" class="btn btn-sm btn-clean btn-icon btn-icon-md edit_channel kt-hidden-tablet-and-mobile" title="Edit" >\
									  <i class="la la-edit"></i>\
									</a>'
				},
				{	
					width: "3%",
					orderable:false,    
					className:"kt-align-center crawl_channel kt-font-success",        
					defaultContent: '<i class="la la-tencent-weibo "></i>'
				},
				{ 
					data:"name",
					orderable:false,    
					className: "channel_name_td"
				},
				{ 
					data:"url",
					orderable:false,    
				},
			],
			createdRow: function( row, data, dataIndex ) {
				$(row).data("id", data.id);
				$(row).data("name", data.name);
				$(row).data("url", data.url);
				$(row).data("crawl_article_template", unescape(data.crawl_article_template));
				$(row).data("crawl_links_template", unescape(data.crawl_links_template));
				if (data.level > 1) {
					$('.channel_name_td', row).prepend(' ');
					for (var i=2;i<=data.level; i++) {
						$('.channel_name_td', row).prepend('<i class="la la-level-down channel_level_'+ (data.level - i +1) +'"></i>');
					}
				}
			},			
		});
		Channels.datat = datat;
	}
	var reloadData = function(){
		datat.ajax.reload().draw();
	}
	var prepareControls = function() {
		/// prepare add
		$('#general_update_alert').hide();	
		$(document).on('click','.add_channel_under',function() {
			var rowProps = getRowProperties($(this));
			update_channel(rowProps.id, rowProps);
		})
		$('#add_modal #save_btn').click(function() {
			saveUpdate();
		});
		$(document).on('click','.edit_channel',function() {
			var rowProps = getRowProperties($(this));
			update_channel(0, rowProps);
		})

		$(document).on('click',".template_tabs",function() {
			$('.template_tabs_content').removeClass("kt-hidden");
		});


		/// prepare search
		$('#generalSearch').on( 'keyup', function () {
		    datat.search( this.value ).draw();
		} );

		/// prepare delete
		$(document).on('click','.delete_channel_btn',  function() {
			var rowProps = getRowProperties($(this));
			deleteChannel(rowProps.id, rowProps.name);
		});
		$(document).on('click','#delete_btn',function(){
			$.ajax({ 
				url: '/?page=channels&task=api&action=delete_channel',
				data : {
					channel_id:delete_id
				}
			})
			.done(function(response) { po("done");
		    	Channels.reloadData();
		    	$('#delete_modal').modal('hide');
		    });
		});

		/// prepare crawler
		$(document).on('click','.crawl_channel', function () {
			var rowProps = getRowProperties($(this));
			Crawler.crawlChannel(rowProps.id);
		});

	}

	return {

		///main function to initiate the module
		init: function() {
			prepareDataTable();
			prepareControls();
		},
		reloadData:reloadData,
		datat: datat
	};

}();

$(document).ready(function() {
	Channels.init();
});

function getRowProperties(targetObj) {
	var rowProps = {};
	var trHolder = targetObj.closest('tr');
	rowProps.id = trHolder.data('id');
	rowProps.name = trHolder.data('name');
	rowProps.url = trHolder.data('url');
	rowProps.crawl_links_template = trHolder.data('crawl_links_template');
	rowProps.crawl_article_template = trHolder.data('crawl_article_template');
	return rowProps;
}


var add_parent_channel = 0, upd_channel_id = 0;
function update_channel (parent_id, rowProps) {
	if (parent_id == 0 && rowProps.id) {		/// update
		add_parent_channel = 0;
		upd_channel_id = rowProps.id;
		$('#upd_name').val(rowProps.name);
		$('#upd_channel_url').val(rowProps.url);
		$('#crawl_links_template_upd').val(rowProps.crawl_links_template);
		$('#crawl_article_template_upd').val(rowProps.crawl_article_template);
	} else {				/// create new channel
		$("#updateTitle").text(et("Add channel under") + " \"" +  rowProps.name + "\"");
		upd_channel_id = 0;
		add_parent_channel = parent_id;
		$('#upd_name').val("");
		$('#upd_channel_url').val("");
		$('#crawl_links_template_upd').val("");
		$('#crawl_article_template_upd').val("");
	}
	
	$('#add_modal').modal('show');

}

function saveUpdate(){
	var form = $('#update_form');

	var btn = $(this);
	form.validate({
        rules: {
        	upd_name:{
            	required: true,
            	minlength : 2,
            },
            upd_channel_url :{
            	required: true,
            },
        }
    });
    if (!form.valid()) {
        return;
    }
    /// loading class
    btn.addClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', true);

    form.ajaxSubmit({
        url: '/?page=channels&task=api&action=update_channel',
        "data": {
                "site_id": site_id,
                channel_id : upd_channel_id,
                parent_channel_id : add_parent_channel,
                channel_name : $('#upd_name').val(),
                channel_url : $('#upd_channel_url').val(),
				links_template : escape($('#crawl_links_template_upd').val()),
				article_template : escape($('#crawl_article_template_upd').val()) 
            },
        success: function(response, status, xhr, $form) {
            if (response) { 
            	if (!response.error) {	/// no error
            		Channels.reloadData();
					$('#add_modal').modal('hide');
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
            	showError($('#general_update_alert'), et('Can not create channel'));
            }
         }
    });
}

var delete_id = 0;

function deleteChannel(id, name){
	delete_id = id;
	$('.del_name').text(name);
	$('#delete_modal').modal('show');
}

function showError(errorTarget, error_msg){
	var ERROR_DURATION_S = 5;
	var textTarget = $('.alert-text', errorTarget);
	if (!textTarget.length) textTarget = errorTarget;
	errorTarget.text(error_msg).show("slow");
	setTimeout(function() { errorTarget.hide("slow", function() { errorTarget.text(""); }); }, ERROR_DURATION_S * 1000);
}