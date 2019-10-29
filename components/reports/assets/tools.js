"use strict";
var Report = function() {
	var datat;
	var start_date ='2010-01-01';
	var end_date ='2110-01-01';
	var INTERES_INDEX = 1,PAUSE_INDEX = 5, VIEW_INDEX = 6;

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

			"order": [[0, 'asc']],	/// start ordering from second column

			columns :[
				{ 
					data:"tool_name",
					/*className: "client_name_td"*/
				},
				{
					data:null,
					className: "interest_rate_td",
					"render": function(data,type,row) { return getInteresRate(data["impression"],data["click"],data["pause_time"],data["view_time"],data["quick_swipe"],data["description_opened"]).toFixed(1); }
				},
				{ 
					data:"widget_loaded",
				},
				{ 
					data:"widget_opened",
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
					data:"quick_swipe",
				},
				{ 
					data:"description_opened",
				},
				{ 
					data:"impression",
				},
				{ 
					data:"coupon",
				},
			],
			createdRow: function( row, data, dataIndex ) {
				$(row).data("tool_id", data.channel_id);
				var pause_time =parseInt($($('td',row).get(PAUSE_INDEX)).text());
				var view_time = parseInt($($('td',row).get(VIEW_INDEX)).text());
				$($('td',row).get(PAUSE_INDEX)).text((pause_time/3600).toFixed(3));
				$($('td',row).get(VIEW_INDEX)).text((view_time/3600).toFixed(3));
			},	
			"initComplete": function(settings, json) {
    			//calculateInteresRate();
			  }			
		});
		Report.datat = datat;
	}
	var reloadData = function(){
		Report.datat.ajax.url("?page=reports&task=api&action=tools_report&start_date="+Report.start_date+"&end_date="+Report.end_date)
		datat.ajax.reload().draw();
		setCustomDates();
	}

	var getInteresRate = function(impressions, purchases, pause_times, view_times, swipes, descriptions) {
		var MAX_PURCHASE = 0.1, MAX_PAUSE = 0.5, MAX_VIEW = 10, MAX_SWIPE = 0.2, MAX_DESCRIPTIONS = 0.5;
		var PURCHASE_WEIGHT = 0.6, PAUSE_WEIGHT = 0.3, VIEW_WEIGHT = 0.2, SWIPE_WEIGHT = -0.3, DESCRIPTIONS_WEIGHT =  0.2; 

		var purchase_mark = Math.min((purchases/impressions)/MAX_PURCHASE*100, 100);
		var pause_mark = Math.min((pause_times/impressions)/MAX_PAUSE*100, 100);
		var view_mark = Math.min((view_times/impressions)/MAX_VIEW*100, 100);
		var swipe_mark = Math.min((swipes/impressions)/MAX_SWIPE*100, 100);
		var descriptions_mark = Math.min((descriptions/impressions)/MAX_DESCRIPTIONS*100, 100);
		var mark = purchase_mark * PURCHASE_WEIGHT + pause_mark * PAUSE_WEIGHT + view_mark * VIEW_WEIGHT + swipe_mark * SWIPE_WEIGHT + descriptions_mark * DESCRIPTIONS_WEIGHT ;
		return mark;
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

