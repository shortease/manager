<?php
defined( '_SHM_ENABLED_' ) or die( 'Restricted access' );


class InventoryPlacement extends EratePlacement
{

	public static function createPlacement($channel_id, $placement_name, $descr='', $notes='', $type = 0, $width = 0, $height = 0) {
		$placement_data = array(
			'id' => 0,
			'channelId' => $channel_id,
			'name' => $placement_name,
			'descr' => $descr,
			'notes' => $notes,
			'type' => $type,
			'width' => $width,
			'height' => $height
		);
		$placement = new EratePlacement();
		$placement->setData($placement_data);
		$placement_save_response = $placement->syncToDb();
		if ($placement_save_response) {
			$new_placement_id = $placement->get("id");
			$placement_save_response = $new_placement_id;
		}
		return $placement_save_response;
	}
}