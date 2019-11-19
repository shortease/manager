<?php
defined( '_SHM_ENABLED_' ) or die( 'Restricted access' );

header('Content-Type: application/json');
if (!Factory::getUser()->canEditUsers()) return;


$action = Request::getWord("action");
$response = [];
switch ($action) {
	case "list_users":
		/// user have no rights to list users

		if (Factory::getUser()->isRoot()) {
			$clientId = 0;	/// all users
		} else {
			$clientId =  Factory::getUser()->getClientId();
		}
		$query = "select u.id, IFNULL(cl.name,'NO CLIENT') as clientName, u.full_name, u.email, u.disabled, u.group  from users u
					left join clients_users cu on cu.userId = u.id
					left join clients cl on cl.id = cu.clientId
					where  IFNULL(cu.clientId,0) = IF($clientId, $clientId, IFNULL(cu.clientId,0))
					";
		$client_users = Factory::getDB()->getAssocList("id", $query);
		$response = $client_users;
		break;
	case "check_email":
		$user_email = Utils::checkSQLParameter(Request::getString("user_email"));
		$user_id = Request::getInt("uid");
		$emailUserId = ErateUser::getUserIdByMail($user_email);
		$response = ($emailUserId && $emailUserId != $user_id) ? 1 : 0;
		break;
	case "update_user":
		$user_id = Request::getInt("upd_user_id");
		$group = Request::getInt("upd_group");
		$user_email = Utils::checkSQLParameter(Request::getString("upd_email"));
		$password = Utils::checkSQLParameter(Request::getString("upd_pass"));
		$user_name = Utils::checkSQLParameter(Request::getString("upd_name"));
		$client_id = Request::getInt("upd_client_id");

		if ($user_id){	/// update
			$user = new User($user_id);
			$res = $user->update($user_email, $password, $group, $user_name);
		} else {		/// create new user
			$res = ErateUser::createErateUser($user_email, $password, $group, $user_name);
			if ($res >0 && $client_id > 0 && (Factory::getUser()->isRoot() || Factory::getUser()->inGroup(ErateGroup::EditUsers))) { 
				/// if user created and should be added to client
				$user = new User($res);
				$user->setClientId($client_id);
				$user->syncToDb();
			}
		}

		$response = (is_int($res) && $res < 0) ? array("error"=>$res) : array("error"=>0); 	/// if integer - error, else (string) updated
		break;
	case "disable_user":
		$user_id = Request::getInt("uid");
		$disable = Request::getInt("disable");
		if (Factory::getUser()->canEditUser($user_id)) {
			$user = new User($user_id);
			$disable = $disable ? 1 : 0;
			if ($disable != $user->get('disabled')){
				$user->disable($disable);
			}
			$response = array("error"=>0);
		} else {
			$response = array("error"=>1);
		}
		break;
	case "remove_user":
		$user_id = Request::getInt("uid");
		if (Factory::getUser()->canEditUser($user_id)) {
			$res = Factory::getDB()->getResult("select 1 from clients where defaultUserId = $user_id");
			if ($res) {		/// user is a default client user
				$response = array("error"=>2);
			} else {
				ErateUser::deleteUser($user_id);
			}
		} else {
			$response = array("error"=>1);
		}

		break;
	default:
		$response = null;
}

if (is_array($response)) {
	$response = json_encode($response);
}
echo ($response);
die();
