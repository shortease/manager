<?php
defined( '_SHM_ENABLED_' ) or die( 'Restricted access' );
require (SH_CORE_PATH."/route/route.inc");
function load_script ($script_name){
	echo ("<script src=\"".$script_name."?v=".SH_VER."\" type=\"text/javascript\"></script>;");
}

function main(){
	if(is_post()) disable_magic_quotes();
	session_start();

	Route::getLayout();
}