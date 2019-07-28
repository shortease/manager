<?php
defined( '_SHM_ENABLED_' ) or die( 'Restricted access' );

header('Content-Type: application/json');

/// TODO check user if can see this site coupons

$action = Request::getWord("action");
$response = [];

switch ($action) {
	case "list_coupons":
		$site_id = Request::getInt("site_id");
		$coupons_list = Coupon::listCoupons($site_id);
		$response = $coupons_list;
		break;
	case "save_coupon":
		$name = Request::getString("name");
		$site_id = Request::getInt("site_id");
		$coupon_id = Request::getInt("coupon_id");
		$coupon_code = Request::getString("coupon_code");
		$weight = Request::getInt("weight");
		if (!$coupon_id) {
			Coupon::add($site_id, $name, $coupon_code, $weight);
		} else {
			$coupon = new Coupon($coupon_id);
			$coupon->save($name, $coupon_code, $weight);
		}
		break;
		case "delete_coupon":
		$coupon_id = Request::getInt("coupon_id");
		$coupon = new Coupon($coupon_id);
		$coupon->delete();
		break;
	default:
		$response = null;
}

if (is_array($response)) {
	$response = json_encode($response);
}
echo ($response);
die();
