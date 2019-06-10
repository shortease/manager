<?php
defined( '_SHM_ENABLED_' ) or die( 'Restricted access' );

header('Content-Type: application/json');

/// TODO check user if can see this site channels

$action = Request::getWord("action");
$response = [];
switch ($action) {
	case "list_channels":
		$site_id = Request::getInt("site_id");
		$parent_id = Request::getInt("parent_id");
		$channels_list = Channel::listChannels($site_id);
		$channels_list = orderChannels($channels_list);
		$response = $channels_list;
		break;
	case "update_channel":
		$site_id = Request::getInt("site_id");
		$channel_id = Request::getInt("channel_id");
		$parent_channel_id = Request::getInt("parent_channel_id");
		$channel_name = Request::getString("channel_name");
		$channel_url = Request::getString("channel_url");
		$links_template = Request::getString("links_template");
		$article_template = Request::getString("article_template");
		if ($channel_id) {	/// update existing channel
			$ch = new Channel($channel_id);
			$response = $ch->update($channel_name, $channel_url , $parent_channel_id, $links_template, $article_template);
		} else { 			/// add new channel
			$parent_channel = new Channel($parent_channel_id);
			$parent_cplacement_id = $parent_channel->get('default_cplacement_id');

			$parent_cp = new CampaignPlacement($parent_cplacement_id);
			$campaign_id = $parent_cp->get('campaignId');
			$response = Channel::addChannel($site_id, $channel_name, $channel_url , $campaign_id, $parent_channel_id, $links_template, $article_template);
		}
		break;
	case "delete_channel":
		$channel_id = Request::getInt("channel_id");
		Channel::delete($channel_id);
		$response = true;
		break;
	case "get_crawl_tmplates":
		$channel_id = Request::getInt("channel_id");
		$links_template = "";
		$article_template = "";
		$parent_id = $channel_id;
		/// look up in channels tree for templates
		while 	(!isset($ch) || 														/// first time - $ch is not set
					( $parent_id > 0 && 									/// there is parent
						(!strlen($links_template) || !strlen($article_template) )	/// one of templates not set yet
					)
				) 
		{
			$ch = new Channel($parent_id);
			$parent_id = $ch->get('parent_id');
			if (!strlen($links_template) && strlen($ch->get('crawl_links_template')) 	> 4 ) $links_template 	= $ch->get('crawl_links_template');
			if (!strlen($article_template) && strlen($ch->get('crawl_article_template'))	> 4 ) $article_template = $ch->get('crawl_article_template');
		}

		$response = array('links_template' => $links_template, 'article_template' => $article_template);
		break;

	default:
		$response = null;
}

if (is_array($response)) {
	$response = json_encode($response);
}
echo ($response);
die();

function orderChannels ($channels_list, $parent_id = 0){
	$ordered_list = array();
	$MAX_LEVELS = 10;
	$cur_level = 1;
	while (count($channels_list) > 0 && $cur_level <= $MAX_LEVELS) {		/// loop on levels 
		foreach ($channels_list as $key => $channel) {						/// loop on start list - looking for items with right level
			if ($channel["level"] == $cur_level) {
				if ($cur_level == 1) {										/// push first level
					array_push($ordered_list, $channel);
				} else {
					$ordered_length = count($ordered_list);
					$inserted = false;
					while ($ordered_length && !$inserted) {					/// run on $ordered_length in reverse and look for parent
						$i = $ordered_length - 1;
						if ($ordered_list[$i]["parent_id"] == $channel["parent_id"] || $ordered_list[$i]["id"] == $channel["parent_id"]) {
							array_splice( $ordered_list, $i+1, 0, array($channel) );	/// push after channel with same parent, if no after parent himself
							$inserted = true;
						}
						$ordered_length--;
					}
				}
				unset($channels_list[$key]);
			}
		}
		$cur_level++;
	}
//po($ordered_list);
	return $ordered_list;
}
