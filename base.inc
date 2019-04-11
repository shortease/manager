<?php
defined( '_SHM_ENABLED_' ) or die( 'Restricted access' );
require (SH_CORE_PATH."/route/route.inc");
require (SH_CORE_PATH."/lang/translator.inc");
require (SH_CORE_PATH."utils.inc");

require (SH_CORE_PATH."/erate/client.inc");
require (SH_CORE_PATH."/erate/inventoryPlacement.inc");
require (SH_CORE_PATH."/erate/campaign.inc");
require (SH_CORE_PATH."/erate/campaignPlacement.inc");



function load_script ($script_path){
	echo ("<script src=\"".$script_path."?v=".SH_VER."\" type=\"text/javascript\"></script>;");
}
function load_style ($style_path){
	echo ("<link href=\"".$style_path."?v=".SH_VER."\" rel=\"stylesheet\" type=\"text/css\" />");
}
function main(){
	if(is_post()) disable_magic_quotes();
	session_start();
	Factory::getLang();

	Route::getLayout();
}