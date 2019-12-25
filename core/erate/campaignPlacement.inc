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

	public function listTools($tool_type = null, $is_hidden = null)
	{
		$query = "select t.id,t.campaignId,t.creativeId,t.name,t.type,t.storage,t.url,t.altText,t.width,t.height,t.isHidden,t.tool_script,t.template_id,t.banner_properties 
				from tools t
				join tools_placements tp on tp.toolId = t.id
				where  tp.placementId = ".$this->get('id');
		if ($tool_type) $query = $query." and t.type = ".$tool_type;
		$tools = Factory::getDB()->getAssocList("id", $query);
		return $tools;
	}

	public function deleteTool($tool_id)
	{
		$this->removeTool($tool_id);
		$tool = new ErateBanner($tool_id);
		$tool->hide();
		//$ok = Factory::getDB()->execute("DELETE FROM tools WHERE id=$tool_id");

	}

	public function unhideTool($tool_id)
	{
		$tool = new ErateBanner($tool_id);
		$tool->hide(0);
		//$ok = Factory::getDB()->execute("DELETE FROM tools WHERE id=$tool_id");

	}

	public function addLink($link)
	{
		$newTool = new ErateBanner();
		$data = array(
				'url' => $link, 
				'storage'=> 1,
				'type' => SHORTIES_TOOL_TYPE,
				'campaignId' => $this->get('campaignId')
			);
		$newTool->setData($data);
		$newTool->syncToDb();
		$toolId = $newTool->get('id');
		$this->addTool($toolId);
	}
}