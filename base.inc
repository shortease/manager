<?php
defined( '_SHM_ENABLED_' ) or die( 'Restricted access' );
require (SH_CORE_PATH."/route/route.inc");
require (SH_CORE_PATH."/lang/translator.inc");
require (SH_CORE_PATH."utils.inc");

require (SH_CORE_PATH."/erate/client.inc");
require (SH_CORE_PATH."/erate/inventoryPlacement.inc");
require (SH_CORE_PATH."/erate/campaign.inc");
require (SH_CORE_PATH."/erate/campaignPlacement.inc");
require (SH_CORE_PATH."/erate/channel.inc");
require (SH_CORE_PATH."/erate/crawler.inc");
require (SH_CORE_PATH."/erate/banner.inc");
require (SH_CORE_PATH."/erate/coupon.inc");
require (SH_CORE_PATH."/erate/user.inc");
require (SH_CORE_PATH."/erate/group.inc");



function load_script ($script_path){
	echo ("<script src=\"".$script_path."?v=".SH_VER."\" type=\"text/javascript\"></script>");
}
function load_style ($style_path){
	echo ("<link href=\"".$style_path."?v=".SH_VER."\" rel=\"stylesheet\" type=\"text/css\" />");
}
function main(){
	if(is_post()) disable_magic_quotes();
	session_start();
	Factory::getLang();

	/// get site 
	$site_id = Request::getInt("site_id");
	if ($site_id && !Factory::getUser()->isRoot() &&!Factory::getUser()->canEditSite($site_id)){	/// site var provided but user have no rights to edit it
		$site_id = 0;
	}
	if (!$site_id)
		$site_id = isset($_SESSION["site_id"]) ? $_SESSION["site_id"] : 0;
	if (!$site_id)
		$site_id = Factory::getUser()->getDefaultSite();	
	if ($site_id) 
		$_SESSION["site_id"] = $site_id;
	Route::getLayout();
}