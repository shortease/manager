<?php
define( '_SHM_ENABLED_',  1 );
header("Access-Control-Allow-Origin: *");
header('Content-Type: application/javascript');

/// shortease config
require_once dirname(__FILE__).'/../../config.inc';
/// Enable erate ad server classes 
require_once SH_BASE_PATH.'/erate.inc';
/** Load base functions file */
require_once SH_BASE_PATH.'/base.inc';

$domain = Request::getString("host");
$site_id = Crawler::getSiteIdByDomain($domain);
$action = Request::getString("action");
$repeat = Request::getInt("repeat");

echo ("var action = '".$action."';");
$templates = array();

if ($action == 'getCrawlerItem') {
	getCrawlerItem($site_id);
} else if ($action == 'upd_links') {
	$links = Request::getString("links");
	$links = explode(",",str_replace("]","",str_replace("[","",$links)));
	$channel_id = Request::getInt("channel_id");
	$token = Request::getString("token");
	upd_links($channel_id, $links, $token);
} else if ($action == 'upd_article') {
	$article_data = Request::getVar("article_data");
	$article_id = Request::getInt("article_id");
	$token = Request::getString("token");
	$title = Request::getString("title");
	$pics = Request::getInt("pics");
	upd_article($article_id, $article_data, $token, $title, $pics);
} else {
	die('Action not allowed');
}

function getCrawlerItem($domain)
{
	$cr = new Crawler();
	$templates = $cr->getCrawlerItem($domain);
	echo ("var templates = " . json_encode($templates).";");
}

function upd_links ($channel_id, $links, $token) {
	$cr = new Crawler();
	$cr->upd_links($channel_id, $links, $token);
}

function upd_article($article_id, $article_data, $token, $title) {
	$cr = new Crawler();
	$cr->upd_article($article_id, $article_data, $token,$title);
}
?>

if (erJq && !$) $ = erJq;
function shcr(){
	console.info(templates);
	if (templates.type== "channel") {
		eval("get_links = " + unescape(templates.links_template));
		var art_links = [];
		erJq.ajax({url:templates.url}).done(function(data) { 
			art_links = get_links(erJq(data));  
			art_links = jQuery.map( art_links, function( link ) {
			  return (new URL(link,location.origin)).href;
			});
			erJq.ajax({ 'url':'<?php echo(LIVE_PATH)?>/components/shcr/shcr_prepare.php', 
						data:{ channel_id:templates.id, 'action':'upd_links', token :templates.token,'links':JSON.stringify(art_links) }})
			.done(function() {
				setTimeout( function() { shcrRepeat(templates); }, 2000);
			});
		} );
	} else if (templates.type== "article") {
		eval("get_article = " + unescape(templates.article_template));
		erJq.ajax({url:templates.url}).done(function(data) { 
			var article_data = get_article(erJq(data));
			erJq.ajax({ 'url':'<?php echo(LIVE_PATH)?>/components/shcr/shcr_prepare.php', 
						data:{ article_id:templates.id, 'action':'upd_article', token :templates.token,'title':article_data.title,'pics':article_data.pictures.length,'article_data':JSON.stringify(article_data).replace(/\'/g, '\\\'' ) }})
			.done(function() {
				setTimeout( function() { shcrRepeat(templates); }, 2000);
			});
		});
	}



}

if (action == 'getCrawlerItem' && Object.keys(templates).length && templates.token){
	shcr();
} 

function shcrRepeat(templates){
	if(<?php echo ($repeat); ?> && Object.keys(templates).length && templates.token) {
		erJq.getScript({url : "<?php echo(LIVE_PATH); ?>/components/shcr/shcr_prepare.php", data : { host:window.location.host.replace('www.',''), action:"getCrawlerItem", repeat :1 } });
	}
}