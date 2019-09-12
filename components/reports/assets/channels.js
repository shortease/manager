"use strict";
var Report = function() {
	var datat;

	var prepareChannelsTable = function(){
		datat = $("#reportdt").DataTable({
			responsive: true,
			dom: `<'kt-hidden'f>t<'row'<'col-sm-12'tr>>
			<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7 dataTables_pager'lp>>`,
			pageLength: 25,

			ajax:{ 
				url:"?page=reports&task=api&action=channels_report",
				data :{site_id : site_id},
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
					data:"channel_name",
					/*className: "client_name_td"*/
				},
				{ 
					data:"impression",
				},
				{ 
					data:"click",
				},
				{ 
					data:"pause_time",
				},
				{ 
					data:"widget_loaded",
				},
				{ 
					data:"widget_opened",
				},
			],
			createdRow: function( row, data, dataIndex ) {
				$(row).data("channel_id", data.channel_id);
			},			
		});
		Report.datat = datat;
	}
	var reloadData = function(){
		datat.ajax.reload().draw();
	}


	return {

		///main function to initiate the module
		init: function() {
			prepareChannelsTable();
			prepareControls();
		},
		reloadData:reloadData,
		datat: datat
	};

}();

var prepareControls = function() {
	$(document).on('click','#reportdt tr', function() {
		location.href = "?com=reports&action=tools&channel_id="+$(this).data('channel_id');
	});
}

$(document).ready(function() {
	Report.init();
});

