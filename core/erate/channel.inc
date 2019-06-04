<?php
defined( '_SHM_ENABLED_' ) or die( 'Restricted access' );

class Channel extends ErateChannel {

	public static function listChannels ( $site_id, $parent_id = -1){
		$query = "SELECT id, siteId, name, description, notes, isHidden, categoryId, source_id, 
						url, parent_id, level, to_crawl, display_type, last_crawled, crawl_frequency, crawl_links_template, crawl_article_template, default_cplacement_id
					FROM channels
					where siteId = ".$site_id ;
		if ($parent_id >= 0) $query = $query . " and parent_id = " . $parent_id;
		$query = $query ." ORDER BY name";
		$channels = Factory::getDB()->getAssocList("id", $query);
		return $channels;
	}

	public static function addChannel($siteId, $name, $url , $parent_id = 0, $links_template = "", $article_template = "") {
		$new_channel_id = 0;
		if ((!ErateChannel::channelExists($siteId, $name)) && (strlen($name) > 0)) {
			/// create level from parent channel
			$parent_channel = new Channel($parent_id);
			$level = $parent_channel->get('level');
			$level = $level ? $level + 1 : 1;

			$channel = new Channel();
			$channelData = array(
					'siteId' => $siteId,
					'name' => Utils::checkSQLParameter($name),
					'url' => Utils::checkSQLParameter($url),
					'parent_id' => $parent_id,
					'level' => $level,
					'crawl_links_template' => Utils::checkSQLParameter($links_template),
					'crawl_article_template' => Utils::checkSQLParameter($article_template),
			);
			$channel->setData($channelData);
			$channel->syncToDb();
			$new_channel_id = $channel->get('id');

			/// create default placement
			$site = new ErateSite($siteId);
			$i_placement_id = InventoryPlacement::createPlacement($new_channel_id, DEFAULT_PLACEMENT_NAME);
/*			$cl = new Client($site->get('clientId'));
			$campaign_id = $cl->getDefaultCampaign();
*/
			$parent_cplacement_id = $parent_channel->get('default_cplacement_id');

			$parent_cp = new CampaignPlacement($parent_cplacement_id);
			$campaign_id = $parent_cp->get('campaignId');
			$cp_id = CampaignPlacement::createNew($campaign_id, $i_placement_id);
			if ($cp_id) {	/// update pl id in channel
				$query = "update channels set default_cplacement_id = $cp_id where id = $new_channel_id";
				Factory::getDB()->execute($query);
			}
		}
		return $new_channel_id;
	}

	public function update($name, $url , $parent_id, $links_template, $article_template)
	{
		$channelData = array(
				'id' => $this->get('id'),
				'name' => Utils::checkSQLParameter($name),
				'url' => Utils::checkSQLParameter($url),
//				'parent_id' => $parent_id,
				'crawl_links_template' => Utils::checkSQLParameter($links_template),
				'crawl_article_template' => Utils::checkSQLParameter($article_template),
		);
		$this->setData($channelData);
		$this->syncToDb();
		return true;
	}
	public static function delete($channel_id)
	{
		$channel = new Channel($channel_id);
		$child_channels = Channel::listChannels($channel->get("siteId"), $channel_id);
		foreach ($child_channels as $key => $child_channel) {
			Channel::delete($child_channel['id']);
		}
		/// delete placements
		$query = "delete from campaign_placements where id in 
					(select id from (select cp.id from campaign_placements cp
					join placements p on p.id = cp.placementId
					where p.channelId = $channel_id) as a)";
		Factory::getDB()->execute($query);


		/// delete inventory placements
		$query = "delete from placements where channelId =".$channel_id;
		Factory::getDB()->execute($query);

		/// delete inventory channel
		$query = "delete from channels where id =".$channel_id;
		Factory::getDB()->execute($query);
	}

	public function setTrackedTime()
	{
		$query = "update Channels set last_crawled = now() where id = ".$this->get('id');
		Factory::getDB()->execute($query);
	}

	public function checkToken($token)
	{
		return (($this->get('token') == $token) && (strtotime(date("Y-m-d H:i:s")) - strtotime($this->get('token_date')) < 30));
	}

}