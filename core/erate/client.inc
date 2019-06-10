<?php
defined( '_SHM_ENABLED_' ) or die( 'Restricted access' );



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
			, (select id from sites where clientId = cl.id order by id limit 1) as site_id,
			u.email
			FROM clients AS cl 
			left join users u on u.id = cl.defaultUserid
			WHERE cl.parentId is null 
			GROUP BY cl.id
		";
		$clients = Factory::getDB()->getAssocList(null,$query);
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

		/// create campaign

		$new_campaign_id = Campaign::createNew(DEFAULT_CAMPAIGN_NAME, $new_sub_client_id);

		if (!$new_campaign_id || $new_campaign_id <= 0 ) {
			Client::delete($new_client_id);
			ErateUser::deleteUser($new_user_id);
			return CAMPAIGN_CREATE_ERROR;
		}
		/// create channel
		$new_channel_id = Channel::addChannel($new_site_id, DEFAULT_CHANNEL_NAME,$site_url, $new_campaign_id);
		if ($new_channel_id <= 0 ) {
			Client::delete($new_client_id);
			ErateUser::deleteUser($new_user_id);
			return CHANNEL_CREATE_ERROR;
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

	public function getDefaultCampaign() {
		$query = "SELECT id from campaigns where clientId = ".$this->get('id')." order by id limit 1";
		$camp = Factory::getDB()->getAssoc($query);
		return $camp['id'];
	}
}