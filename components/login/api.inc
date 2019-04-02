<?php
defined( '_SHM_ENABLED_' ) or die( 'Restricted access' );

header('Content-Type: application/json');

$action = Request::getWord("action");
switch ($action) {
	case "get_user":
		$username = Request::getString("username");
		$passwd = Request::getWord('password', '', 'POST');
		$remember = Request::getWord('remember', false, 'POST');
		$user = Factory::getUser()->login($username, $passwd, $remember);
		echo json_encode($user);
		break;

	default:
		return null;
}
