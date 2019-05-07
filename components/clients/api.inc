<?php
defined( '_SHM_ENABLED_' ) or die( 'Restricted access' );

header('Content-Type: application/json');

/// only root could see clients component
if (!Factory::getUser()->isRoot()) die();

$action = Request::getWord("action");
$response = [];
switch ($action) {
	case "update_client":
		$client_id = Request::getInt("upd_client_id");
		$client_name = Request::getString("upd_name");
		$site_name = Request::getString("upd_site_name");
		$site_url = Request::getString("upd_site_url");
		$user_name = Request::getString("upd_email");
		$passwd = Request::getWord('upd_password');
		/// check client name exists. Return error message if yes.
		$name_exists_error = [error=>1, error_msg=>t("Name")." ".$client_name." ".t("is taken")];
		$isClientExists = Client::checkNameExists($client_name, $client_id);
		if ($isClientExists) {
			$response = $name_exists_error;
			break;
		}
		/// For creating new user ($client_id == 0) - check user exists by email and return error if yes
		$mail_exists_error = [error=>2, error_msg=>t("Email")." ".$user_name." ".t("is already exists")];
		if(!$client_id && ErateUser::getUserIdByMail($user_name)) {
			$response = $mail_exists_error;
			break;
		}
		$mail_format_error = [error=>2, error_msg=>("Invalid email format")];
		$password_format_error = [error=>3, error_msg=>("Invalid password format")];
		$other_user_error = [error=>9, error_msg=>("Can't create user")];
		$other_client_error = [error=>10, error_msg=>("Can't create client")];
		$site_error = [error=>11, error_msg=>("Can't create site")];
		$channel_error = [error=>12, error_msg=>("Can't create channel")];
		$iplacement_error = [error=>13, error_msg=>("Can't create inventory placement")];
		$campaign_error = [error=>14, error_msg=>("Can't create campaign")];
		$placement_error = [error=>15, error_msg=>("Can't create campaign placement")];
		if (!$client_id) {	/// create new client, user, site and basic channel
			$wizard_response = Client::createClientWizard($client_name, $site_name, $site_url, $user_name, $passwd);
			if ($wizard_response <= 0) {
				if ($wizard_response == WRONG_FORMAT_EMAIL) {
					$response = $mail_format_error;
					return;
					break;
				} else if ($wizard_response == EMAIL_EXISTS) {
					$response = $mail_exists_error;
					break;
				} else if ($wizard_response == WRONG_FORMAT_PASSWORD) {
					$response = $password_format_error;
					break;
				}  else if ($wizard_response == CLIENT_CREATE_ERROR) {
					$response = $other_client_error;
					break;
				}  else if ($wizard_response == SITE_CREATE_ERROR) {
					$response = $site_error;
					break;
				}  else if ($wizard_response == CHANNEL_CREATE_ERROR) {
					$response = $channel_error;
					break;
				}  else if ($wizard_response == IPLACEMENT_CREATE_ERROR) {
					$response = $iplacement_error;
					break;
				}  else if ($wizard_response == CAMPAIGN_CREATE_ERROR) {
					$response = $campaign_error;
					break;
				}  else if ($wizard_response == PLACEMENT_CREATE_ERROR) {
					$response = $placement_error;
					break;
				} else {
					$response = $other_user_error;
					break;
				} 
			} 
		}

		$response = "true";
		break;
	case "list_clients":
		$clients_list = Client::getClientsList();
		$response = $clients_list;
		break;
	case "delete_client":
		$client_id = Request::getInt("client_id");
		if ($client_id) {
			Client::delete($client_id);
		}
		break;
	case "set_hidden_status" :
		$client_id = Request::getInt("client_id");
		$hidden_status = Request::getInt("hidden_status");
		$client = new Client($client_id);
		$new_status = $hidden_status ? 0 :1;
		$client->changeHidden($new_status);	
		break;
	default:
		$response = null;
}

if (is_array($response)) {
	$response = json_encode($response);
}
echo ($response);
