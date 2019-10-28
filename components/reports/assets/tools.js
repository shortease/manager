"use strict";
var Report = function() {
	var datat;
	var start_date ='2010-01-01';
	var end_date ='2110-01-01';

	var prepareToolsTable = function(){ 
		datat = $("#reportdt").DataTable({
			responsive: true,
			dom: `<'kt-hidden'f>t<'row'<'col-sm-12'tr>>
			<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7 dataTables_pager'lp>>`,
			pageLength: 25,

			ajax:{ 
				url:"?page=reports&task=api&action=tools_report&start_date="+Report.start_date+"&end_date="+Report.end_date,
				data :{channel_id : channel_id},
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
					data:"tool_name",
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
					data:"view_time",
				},				

				{ 
					data:"widget_opened",
				},
			],
			createdRow: function( row, data, dataIndex ) {
				$(row).data("tool_id", data.channel_id);
				var pause_time =parseInt($($('td',row).get(3)).text());
				var view_time = parseInt($($('td',row).get(4)).text());
				$($('td',row).get(3)).text((pause_time/3600).toFixed(3));
				$($('td',row).get(4)).text((view_time/3600).toFixed(3));
			},			
		});
		Report.datat = datat;
	}
	var reloadData = function(){
		Report.datat.ajax.url("?page=reports&task=api&action=tools_report&start_date="+Report.start_date+"&end_date="+Report.end_date)
		datat.ajax.reload().draw();
		setCustomDates();
	}
	var dateRangePicker;

	var prepareDatesPicker = function() {
		if (!dateRangePicker) {
			var dates = $('input[name="daterange"]').daterangepicker({
				opens: 'left',
				autoApply : true
			}, function(start, end, label) {
				Report.start_date = moment(start).format("YYYY-MM-DD");
				Report.end_date = moment(end).add(1,"day").format("YYYY-MM-DD");
				reloadData();
			});
			dateRangePicker = dates.data('daterangepicker');
			$('input[name="daterange"]').val("");
		}
	}
	var setCustomDates = function(){
		dateRangePicker.setStartDate(moment(Report.start_date).format("MM/DD/YYYY"));
		dateRangePicker.setEndDate(moment(Report.end_date).add(-1,"day").format("MM/DD/YYYY"));
	}
	return {

		///main function to initiate the module
		init: function() {
			prepareToolsTable();
			prepareDatesPicker();
		},
		prepareToolsTable: prepareToolsTable,
		reloadData:reloadData,
		datat: datat,
		start_date:start_date,
		end_date:end_date,
		setCustomDates : setCustomDates,
	};

}();



var prepareControls = function() {
	$(document).on('click','#reportdt tr', function() {
		//location.href = "?com=reports&action=tools&channel_id="+$(this).data('channel_id');
	});
	$("#daterange").click(function() {
		Report.setCustomDates();
	} );

	$('#dates_name_select').change(function(){
		var date_name = $(this).val();
		var start_date = '', end_date = '';
		
		if (date_name == 'all') {
			start_date = moment("2010 jan 01").format("YYYY-MM-DD");
			end_date = moment("2110 jan 01").format("YYYY-MM-DD");
		} 
		else if (date_name == 'today') {
			start_date = moment().format("YYYY-MM-DD");
			end_date = moment().add(1, 'day').format("YYYY-MM-DD");
		} 
		else if (date_name == 'yesterday') {
			start_date = moment().add(-1, 'day').format("YYYY-MM-DD");
			end_date = moment().format("YYYY-MM-DD");
		}
		else if (date_name == 'cur_week') {
			start_date = moment().startOf("week").format("YYYY-MM-DD");
			end_date = moment().endOf("week").add(1, 'day').format("YYYY-MM-DD");
		}
		else if (date_name == 'cur_month') {
			start_date = moment().startOf("month").format("YYYY-MM-DD");
			end_date = moment().endOf("month").add(1, 'day').format("YYYY-MM-DD");
		}
		else if (date_name == 'prev_month') {
			start_date = moment().subtract(1, 'months').startOf("month").format("YYYY-MM-DD");
			end_date = moment().startOf("month").format("YYYY-MM-DD");
		}

		Report.start_date = start_date;
		Report.end_date = end_date;
		Report.reloadData();
	});
}

$(document).ready(function() {
	Report.init();
	prepareControls();
});

