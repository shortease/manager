"use strict";
var COUPON_DEFAULT_WEIGHT = 10;

var Coupons = function() {
	var datat, coupons_arr;

	var prepareDataTable = function(){
		datat = $("#coupons_dt").DataTable({
			responsive: true,
			dom: `<'kt-hidden'f>t<'row'<'col-sm-12'tr>>
			<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7 dataTables_pager'lp>>`,
			pageLength: 25,

			ajax:{ 
				url:"?page=coupons&task=api&action=list_coupons&site_id="+site_id,
				type: "GET",
				"type": "POST", // request type
                "timeout": 20000,
                dataSrc: function(res) {
                	var resData = [];
                	jQuery.map(res, function(a,b) { resData.push(a)});
                	var sum_weight = 0;
                	for (var i = 0; i < resData.length; i++) { sum_weight += resData[i].weight*1;}
                	for (var i = 0; i < resData.length; i++) {  resData[i].perc_weight = resData[i].weight + " ("+(100 / sum_weight * resData[i].weight).toFixed(1) + '%)';}
                	Coupons.coupons_arr = resData;
                	return resData;
                }
			},

			columns :[
				{ 
					width: "8%", 
					orderable:false,    
					className: "kt-align-center delete_btn",  
					defaultContent: '<i class="la la-close"></i>'
				},
				{ 
					data:"name",
					className: "update_btn",  
					orderable:true,    
				},
				{ 
					data:"code",
					className: "update_btn",  
					orderable:true,    
				},
				{ 
					data:"perc_weight",
					className: "update_btn",  
					orderable:true,    
				},
				{ 
					width: "8%", 
					orderable:false,  
					className: "kt-align-center channels_select_btn",  
					defaultContent: '<i class="la la-check-square"></i>'
				}
			],
			createdRow: function( row, data, dataIndex ) {
				$(row).data("id", data.id);
				$(row).data("name", data.name);
				if (data.level > 1) {
					$('.channel_name_td', row).prepend(' ');
					for (var i=2;i<=data.level; i++) {
						$('.channel_name_td', row).prepend('<i class="la la-level-down channel_level_'+ (data.level - i +1) +'"></i>');
					}
				}
			},			
		});
		Coupons.datat = datat;
	}
	var reloadData = function(){ 
		datat.ajax.reload().draw();
	}

	var weight_slider;
	var prepareControls = function() {
		$('#general_update_alert').hide();	
		$('#btn_add_coupon').click(function() {
			update_coupon();
		});
		$(document).on('click','.update_btn',function() {
			var coupon = getRowProperties($(this));
			update_coupon(coupon);
		});
		weight_slider = document.getElementById('weight_slider');

		noUiSlider.create(weight_slider, {
		    start: [COUPON_DEFAULT_WEIGHT],
		    tooltips:[ wNumb({decimals: 0})],
		    connect: true,
		    range: {
		        'min': 0,
		        'max': 100
		    }
		});
		weight_slider.noUiSlider.on('update', function (values, handle) {
		    $('#weight_inp').val(Math.round(values[handle]));
		});
		Coupons.weight_slider = weight_slider;

		$('#add_modal #save_btn').click(function() {
			saveUpdate();
		});		
		$(document).on('click','.delete_btn',function() {
			deleteCoupon(getRowProperties($(this)));
		});	
		$(document).on('click','#modal_delete_btn',function() {
			$.ajax({ 
				url: '/?page=coupons&task=api&action=delete_coupon',
				data : {
					coupon_id:delete_id
				}
			})
			.done(function(response) { 
		    	Coupons.reloadData();
		    	$('#delete_modal').modal('hide');
		    });
		});

	}
	return {

		///main function to initiate the module
		init: function() {
			prepareDataTable();
			prepareControls();

		},
		reloadData:reloadData,
		datat: datat,
		coupons_arr:coupons_arr,
		weight_slider : weight_slider
	};

}();

$(document).ready(function() {
	Coupons.init();
});


function getRowProperties(targetObj) {
	var trHolder = targetObj.closest('tr');
	var coupon_id = trHolder.data('id');
	var coupon = {};
	Coupons.coupons_arr.forEach(function(coupon_el) {
	  if (coupon_el.id == coupon_id) {
	  	coupon = coupon_el;
	  }
	});
	return coupon;
}
var upd_coupon_id = 0;
function update_coupon (coupon) {

	if (coupon) { 	/// update
		upd_coupon_id = coupon.id;
		$("#updateTitle").text(et("Update coupon ")+coupon.name);
		$("#upd_name").val(coupon.name);
		$("#upd_coupon_code").val(coupon.code);
		$("#weight_inp").val(coupon.weight);
		Coupons.weight_slider.noUiSlider.set(coupon.weight)
	} else {			/// add new
		upd_coupon_id = 0;
		$("#updateTitle").text(et("Add new coupon"));
		$("#upd_name").val("");
		$("#upd_coupon_code").val("");
		$("#weight_inp").val(10);
		Coupons.weight_slider.noUiSlider.set(10)
	}
	$('#add_modal').modal('show');
}

function showError(errorTarget, error_msg){
	var ERROR_DURATION_S = 5;
	var textTarget = $('.alert-text', errorTarget);
	if (!textTarget.length) textTarget = errorTarget;
	errorTarget.text(error_msg).show("slow");
	setTimeout(function() { errorTarget.hide("slow", function() { errorTarget.text(""); }); }, ERROR_DURATION_S * 1000);
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
            upd_coupon_code :{
            	required: true,
            },
            weight_inp : {
            	required: true,
            }
        }
    });
    if (!form.valid()) {
        return;
    }
    /// loading class
    btn.addClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', true);

    var coupon_data = {
    	name: $('#upd_name').val(),
    	coupon_code: $('#upd_coupon_code').val(),
    	weight: $('#weight_inp').val(),
    	site_id : site_id,
    	coupon_id : upd_coupon_id
    }

    form.ajaxSubmit({
        url: '/?page=coupons&task=api&action=save_coupon',
        "data": coupon_data,
        success: function(response, status, xhr, $form) {
            if (response) { 
            	if (!response.error) {	/// no error
            		Coupons.reloadData();
					$('#add_modal').modal('hide');
            	} else {
               		showError($('#general_update_alert'), response.error_msg);
               }
            } else {
            	showError($('#general_update_alert'), et('Can not create channel'));
            }
	   }
	});
}


var delete_id = 0;

function deleteCoupon(coupon){
	delete_id = coupon.id;
	$('.del_name').text(coupon.name);
	$('#delete_modal').modal('show');
}

