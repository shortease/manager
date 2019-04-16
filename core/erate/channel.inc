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

	public static function addChannel($siteId, $name, $url , $parent_id) {
		if ((!ErateChannel::channelExists($siteId, $name)) && (strlen($name) > 0)) {
			$parent_channel = new Channel($parent_id);

			$channel = new Channel();
			$channelData = array(
					'siteId' => $siteId,
					'name' => Utils::checkSQLParameter($name),
					'url' => Utils::checkSQLParameter($url),
					'parent_id' => $parent_id,
					'level' => $parent_channel->get('level') + 1
			);
			$channel->setData($channelData);
			$channel->syncToDb();
		}
		if (isset($channel)) {
			return $channel->getId();
		} else {
			return 0;
		}
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

}