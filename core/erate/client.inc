<?php
defined( '_SHM_ENABLED_' ) or die( 'Restricted access' );

define ("DEFAULT_CHANNEL_NAME", "Home page");
define ("DEFAULT_PLACEMENT_NAME", "Shortease placement");
define ("DEFAULT_CAMPAIGN_NAME", "Shortease campaign");
define ("DEFAULT_TOOL_NAME", "Shortease tool ");

define ("CLIENT_CREATE_ERROR", -10);
define ("SITE_CREATE_ERROR", -11);
define ("CHANNEL_CREATE_ERROR", -12);
define ("IPLACEMENT_CREATE_ERROR", -13);
define ("CAMPAIGN_CREATE_ERROR", -14);
define ("PLACEMENT_CREATE_ERROR", -15);


/**
 * 
 */
class Client extends ErateClient
{
	
	public static function getClientsList()
	{
		$clientId = Factory::getUser()->getClientId();
		$query = "
			SELECT cl.id, cl.name, cl.isHidden 
			, (select name from sites where clientId = cl.id order by id limit 1) as site_name,
			u.email
			FROM clients AS cl 
			left join users u on u.id = cl.defaultUserid
			WHERE cl.parentId is null 
			GROUP BY cl.id
		";
		$clients = Factory::getDB()->getAssocList("id", $query);
		return $clients;
	}

	public static function checkNameExists($clientName, $client_id) {
		$query = "select 1 from clients where name = '".Utils::checkSQLParameter($clientName) ."' and id !=";
		$query = sprintf($query.' %d', $client_id);
		$clients = Factory::getDB()->getAssocList("id", $query);
		return count($clients);
	}

	public static function createClientWizard($client_name, $site_name, $site_url, $user_name, $passwd){
		$group = ErateGroup::genUserGroup(ErateGroup::EditUsers, ErateGroup::Clients, ErateGroup::Publishers);
		$new_user_id = ErateUser::createErateUser($user_name, $passwd, $group, $client_name);
		if($new_user_id <= 0) return $new_user_id;
		
		$new_client_id = ErateClient::createNewClient($client_name, null, null, $new_user_id);
		if ($new_client_id <= 0 ) {
			ErateUser::deleteUser($new_user_id);
			return CLIENT_CREATE_ERROR;
		}
		/// update client id to user
		Factory::getDB()->execute("INSERT INTO clients_users (userId, clientId, comment) VALUES ($new_user_id, $new_client_id, '')");
		$new_sub_client_id = ErateClient::createNewClient($client_name, null, $new_client_id, null);
		if ($new_sub_client_id <= 0 ) {
			ErateUser::deleteUser($new_user_id);
			return CLIENT_CREATE_ERROR;
		}

		/// create site
		$new_site_id = ErateSite::createErateSite($site_name, $site_url, '', $new_client_id);
		if ($new_site_id <= 0 ) {
			Client::delete($new_client_id);
			ErateUser::deleteUser($new_user_id);
			return SITE_CREATE_ERROR;
		}

		/// create channel
		$new_channel_id = ErateChannel::createErateChannel($new_site_id, DEFAULT_CHANNEL_NAME,'','');
		if ($new_channel_id <= 0 ) {
			Client::delete($new_client_id);
			ErateUser::deleteUser($new_user_id);
			return CHANNEL_CREATE_ERROR;
		}

		/// create inventory placement
		$new_inventory_placement_id = InventoryPlacement::createPlacement($new_channel_id, DEFAULT_PLACEMENT_NAME);
		if (!$new_inventory_placement_id || $new_inventory_placement_id <= 0 ) {
			Client::delete($new_client_id);
			ErateUser::deleteUser($new_user_id);
			return IPLACEMENT_CREATE_ERROR;
		}

		/// create campaign

		$new_campaign_id = Campaign::createNew(DEFAULT_CAMPAIGN_NAME, $new_sub_client_id);
		if (!$new_inventory_placement_id || $new_inventory_placement_id <= 0 ) {
			Client::delete($new_client_id);
			ErateUser::deleteUser($new_user_id);
			return CAMPAIGN_CREATE_ERROR;
		}

		/// create placement
		$new_placement_id = CampaignPlacement::createNew($new_campaign_id, $new_inventory_placement_id);
		if (!$new_placement_id || $new_placement_id <= 0 ) {
			Client::delete($new_client_id);
			ErateUser::deleteUser($new_user_id);
			return PLACEMENT_CREATE_ERROR;
		}

		return true;
	}

	public static function delete ($clientId)
	{
		/// delete tools
		$query = "delete from tools where id in 
				(select id from (select t.id from tools t
					join campaigns c on c.id = t.campaignId
					join clients cl on cl.id = c.clientId
					where cl.parentId = $clientId or cl.id = $clientId) as a)";
		Factory::getDB()->execute($query);

		/// delete placements
		$query = "delete from campaign_placements where id in 
					(select id from (select cp.id from campaign_placements cp
					join placements p on p.id = cp.placementId
					join channels ch on ch.id = p.channelId
					join sites s on s.id = ch.siteId
					join clients cl on cl.id = s.clientId
					where cl.parentId = $clientId or cl.id = $clientId) as a) " ;
		Factory::getDB()->execute($query);

		/// delete campaigns
		$query = "delete from campaigns where id in 
				(select id from (select c.id from campaigns c 
					join clients cl on cl.id = c.clientId
					where cl.parentId = $clientId or cl.id = $clientId) as a)";
		Factory::getDB()->execute($query);


		/// delete inventory placements
		$query = "delete from placements where id in 
				(select id from (select p.id from placements p
					join channels ch on ch.id = p.channelId
					join sites s on s.id = ch.siteId
					join clients cl on cl.id = s.clientId
					where cl.parentId = $clientId or cl.id = $clientId) as a)";
		Factory::getDB()->execute($query);

		/// delete inventory channels
		$query = "delete from channels where id in 
				(select id from (select ch.id from channels ch
				join sites s on s.id = ch.siteId
				join clients cl on cl.id = s.clientId
				where cl.parentId = $clientId or cl.id = $clientId
				) as a)";
		Factory::getDB()->execute($query);

		/// delete inventory sites
		$query = "delete from sites where id in 
				(select id from (select s.id from sites s 
				join clients cl on cl.id = s.clientId
				where cl.parentId = $clientId or cl.id = $clientId
				) as a)";
		Factory::getDB()->execute($query);

		/// delete 
		$query = "delete from clients where parentId = $clientId";
		Factory::getDB()->execute($query);
		$query = "delete from clients where id = $clientId";
		Factory::getDB()->execute($query);
	}

	public function changeHidden($hidden_status)
	{
		$query = "update clients set isHidden = ".$hidden_status." where id = ". $this->get('id');
		Factory::getDB()->execute($query);
	}

}