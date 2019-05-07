<?php
defined( '_SHM_ENABLED_' ) or die( 'Restricted access' );

header('Content-Type: application/json');

/// TODO check user if can see this site channels

$action = Request::getWord("action");
$response = [];
switch ($action) {
	case "get_crawl_tmplates":
		$channel_id = Request::getInt("channel_id");
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

		$response = array('channel_url' => $channel_url, 'links_template' => $links_template, 'article_template' => $article_template);
		break;
	case "filter_links":
		$channel_id = Request::getInt("channel_id");
		$links = Request::getString("links");
		po($links);
		break;
	default:
		$response = null;
}

if (is_array($response)) {
	$response = json_encode($response);
}
echo ($response);
die();
