<?php
defined( '_SHM_ENABLED_' ) or die( 'Restricted access' );

/**
 * 
 */
class Crawler
{
	public function getCrawlerItem($siteId)
	{
		$channel = $this->getChannelToCrawl($siteId);
		if(count($channel)) {
			$channel_id = $channel["id"];
			$templates = $this->getChannelTemplates($channel_id);
			$templates["type"] = "channel";
			$templates["token"] = $channel["token"];
			$templates["id"] = $channel_id;
		} else {
			$article = $this->getArticleToCrawl($siteId);
			$article_id = $article["id"];
			$channel_id = $article["channelId"];
			$templates = $this->getChannelTemplates($channel_id);
			$templates["type"] = "article";
			$templates["token"] = $article["token"];
			$templates["id"] = $article_id;
			$templates["url"] = $article["url"];
		}
		return $templates;
	}

	public static function getSiteIdByDomain($domain)
	{
		$query = "select id from sites
			where  replace(replace(replace(replace(replace(url, 'https',''), 'http',''), ':',''), '/',''), 'www.','') = '$domain'";
		$siteId = 0;
		$site = Factory::getDB()->getAssoc($query);
		if (count($site))
			$siteId = $site['id'];
		return $siteId;
	}

	/**
	*	find channel for given site that should be crawled
	**/
	private function getChannelToCrawl ($siteId, $rand = 1)
	{
		/// list all channels that shold be crawled and last crawled hours is more than crawl_frequency
		$query = "select id, name, url from channels 
				where siteid = $siteId and to_crawl = 1 and  TIMEDIFF(now(), ifnull(last_crawled, '2000-01-01 00:00'))/10000 > ifnull(crawl_frequency,24)";
		$channels_to_crawl = Factory::getDB()->getAssocList(null,$query);
		if (!count($channels_to_crawl)) return null;
		/// select random if if needed
		$site_index = 0;
		if ($rand)
			$site_index = array_rand($channels_to_crawl);
		$selected_channel = $channels_to_crawl[$site_index];
		$token = uniqid();
		$query = "update channels set token = '".$token."', token_date = '".date("Y-m-d H:i:s")."' where id = ".$selected_channel["id"];
		Factory::getDB()->execute($query);
		$selected_channel["token"] = $token;
		return $selected_channel;
	}

	private function getChannelTemplates($channel_id)
	{
		$links_template = "";
		$article_template = "";
		$channel = new Channel($channel_id);
		$channel_url = $channel->get("url");
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

		$response = array('url' => $channel_url, 'links_template' => $links_template, 'article_template' => $article_template);
		return $response;
	}

	public function upd_links($channel_id, $links, $token)
	{
		$channel = new Channel($channel_id);
		if(!$channel->checkToken($token))	return;		/// check token and it time 
		$cpid = $channel->get('default_cplacement_id');
		$cp = new CampaignPlacement($cpid);
		$tools = $cp->listTools(SHORTIES_TOOL_TYPE);
		$links = array_unique($links);
		$tools = $this->findIntersections($tools, $links);  /// prepare tools array with actions (delete, add, none)
		foreach ($tools as $key => $tool) {	
			if ($tool['action'] == 'add' && strlen($tool['url']) > 5){
				$cp->addLink( $tool['url']);
			} else if ($tool['action'] == 'delete'){
				$cp->deleteTool($tool['id']);
			}
		}
		$channel->setTrackedTime();
	}

	/**
	*	add new links to tools array, and sets exists tools to keep or delete
	*	
	**/
	public function findIntersections($tools, $links)
	{
		$new_tools = array();
		foreach ($links as $lkey => $link) {
			$link_found = 0;
			foreach ($tools as $tkey => $tool) {
				if ($link == $tool['url']) { /// link exists in tools
					$tools[$tkey]['action'] = 'none';
					$link_found = 1;
					break;
				}
			}
			if (!$link_found){	/// link not exists in tools - add to array
				$new_tool = array('action' => 'add', 'url' => $link);
				array_push($tools, $new_tool);
			}
		}
		foreach ($tools as $key => $tool) { 	/// if tool action not set - tool not exists in links. set action as "delete"
			if (!array_key_exists('action', $tool)) {
				if ($tool['storage'] == 2) {	/// if external storage - added by user and should not be deleted
					$tools[$key]['action'] = 'none';
				} else {
					$tools[$key]['action'] = 'delete';
				}
			}
		}
		return $tools;
	}

	private function getArticleToCrawl ($siteId, $rand = 1)
	{
		$query = "select t.id, cp.channelId, t.name, t.storage, t.url, t.last_crawled, t.crawl_frequency, t.token, t.token_date 
					from tools t
					join tools_placements tp on tp.toolid = t.id
					join v_campaign_placements cp on cp.id = tp.placementId
					where cp.siteid = ".$siteId." and  TIMEDIFF(now(), ifnull(last_crawled, '2000-01-01 00:00'))/10000 > ifnull(crawl_frequency,24)";
		$articles_to_crawl = Factory::getDB()->getAssocList(null,$query);
		if (!count($articles_to_crawl)) return null;
		/// select random if if needed
		$article_index = 0;
		if ($rand)
			$article_index = array_rand($articles_to_crawl);
		$selected_article = $articles_to_crawl[$article_index];
		$token = uniqid();
		$query = "update tools set token = '".$token."', token_date = '".date("Y-m-d H:i:s")."' where id = ".$selected_article["id"];
		Factory::getDB()->execute($query);
		$selected_article["token"] = $token;
		return $selected_article;
	}

	public function upd_article($article_id, $article_data, $token, $title)
	{
		$tool = new Banner($article_id);
		if(!$tool->checkToken($token))	return;		/// check token and it time 
		if(!$title || strlen($title) < 2) return;   /// check if exists title (the data is not corrupted)
		$tool->updateArticle($article_data, $title);
		$c_placement_id = $this->getOneToolPlacement($article_id);
		$cp = new CampaignPlacement($c_placement_id);
//		$cp->exportToMongo();
	}

	/**
	*	Find one connected placement by tool id
	**/
	private function getOneToolPlacement($toolId)
	{
		$query = "select placementId from tools_placements where toolId = $toolId order by placementId LIMIT 1";
		$tp = Factory::getDB()->getAssocList(null,$query);
		return $tp[0]['placementId'];
	}

}