<?php
defined( '_SHM_ENABLED_' ) or die( 'Restricted access' );

/**
 * 
 */
class CampaignPlacement extends ErateCampaignPlacement
{
	public static function createNew($campaignId, $placementId)
	{
		$cPlacement = new ErateCampaignPlacement();
		$cPlacement->set('campaignId', $campaignId);
		$cPlacement->set('placementId', $placementId);
		$placement_creation_result = $cPlacement->syncToDb();
		return $cPlacement->get('id');
	}
}