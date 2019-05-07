<?php
defined( '_SHM_ENABLED_' ) or die( 'Restricted access' );

/********************************    GENERAL  *******************************/
define('SH_VER', 						"0.1.10");


/********************************    PATH FIELDS CONST   *******************************/

define('DS', 						"\\");
define('PROTOCOL', 					isset($_SERVER['HTTPS']) ? "https" : "http");
define('LIVE_PATH', 				PROTOCOL . "://" . $_SERVER['HTTP_HOST']);
define('SH_BASE_PATH', 				dirname(__FILE__));

define('ERATE_DIRECTORY', 			SH_BASE_PATH . "/../adserver/");

define('SH_COMPONENT_PATH',		 	SH_BASE_PATH . "/components/");
define('SH_ASSETS_PATH', 			SH_BASE_PATH . "/assets/");
define('SH_ASSETS_URL', 			"/assets/");
define('SH_CORE_PATH', 				SH_BASE_PATH . "/core/");
define('SH_LAYOUT_PATH', 			SH_BASE_PATH . "/layout/");


/********************************   DEFAULT NAMES  *******************************/

define ("DEFAULT_CHANNEL_NAME", "ROOT");
define ("DEFAULT_PLACEMENT_NAME", "Shortease placement");
define ("DEFAULT_CAMPAIGN_NAME", "Shortease campaign");
define ("DEFAULT_TOOL_NAME", "Shortease tool ");


/********************************    ERRORS  *******************************/

define ("CLIENT_CREATE_ERROR", -10);
define ("SITE_CREATE_ERROR", -11);
define ("CHANNEL_CREATE_ERROR", -12);
define ("IPLACEMENT_CREATE_ERROR", -13);
define ("CAMPAIGN_CREATE_ERROR", -14);
define ("PLACEMENT_CREATE_ERROR", -15);
