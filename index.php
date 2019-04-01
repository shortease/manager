<?php

define( '_SHM_ENABLED_',  1 );
/// shortease config
require_once dirname(__FILE__).'/config.inc';
/// Enable erate ad server classes 
require_once SH_BASE_PATH.'/erate.inc';

/// redirect to login if not logged
if (!Factory::getUser()->isLoggedIn()) {
	include(SH_COMPONENT_PATH . "login/login.inc");
	die();
}
//include("index.inc");