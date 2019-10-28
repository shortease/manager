<?php
defined( '_SHM_ENABLED_' ) or die( 'Restricted access' );
require (SH_CORE_PATH."/erate/report.inc");

header('Content-Type: application/json');

$action = Request::getWord("action");
$response = [];
switch ($action) {
	case "channels_report":
		$site_id = Request::getInt("site_id");
		$startDate = Request::getString("start_date");
		$endDate = Request::getString("end_date");
		$report = new Report();
		$response = $report->channels($site_id,$startDate, $endDate);
		break;
	case "tools_report":
		$channel_id = Request::getInt("channel_id");
		$startDate = Request::getString("start_date");
		$endDate = Request::getString("end_date");
		$report = new Report();
		$response = $report->tools($channel_id,$startDate, $endDate);
		break;
	default:
		$response = null;
}

if (is_array($response)) {
	$response = json_encode($response);
}
echo ($response);
