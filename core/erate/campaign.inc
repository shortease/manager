<?php
defined( '_SHM_ENABLED_' ) or die( 'Restricted access' );


/**
 * 
 */
class Campaign extends ErateCampaign
{

	public static function createNew ($name, $client_id)
	{
		if (!strlen($name)) return;
		if (!$client_id) return;
		$campaign = new ErateCampaign();
		$campaign->set('name', $name);
		$campaign->set('clientId', $client_id);
		$campaign_creation_result = $campaign->syncToDb();
		$new_campaign_id = $campaign->get('id');
		$campaign_creation_result = $new_campaign_id;

		return $campaign_creation_result;
	}
}