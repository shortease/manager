<?php
defined( '_SHM_ENABLED_' ) or die( 'Restricted access' );

/********************************    GENERAL  *******************************/
define('SH_VER', 						"0.13");


/********************************    PATH FIELDS CONST   *******************************/

define('DS', 						"\\");
define('PROTOCOL', 					isset($_SERVER['HTTPS']) ? "https" : "http");
define('LIVE_PATH', 				PROTOCOL . "://" . $_SERVER['HTTP_HOST']);
define('SH_BASE_PATH', 				dirname(__FILE__));

define('ERATE_DIRECTORY', 			SH_BASE_PATH . "/../ad/");

define('SH_COMPONENT_PATH',		 	SH_BASE_PATH . "/components/");
define('SH_ASSETS_PATH', 			SH_BASE_PATH . "/assets/");
define('SH_ASSETS_URL', 			"/assets/");
define('SH_CORE_PATH', 				SH_BASE_PATH . "/core/");
define('SH_LAYOUT_PATH', 			SH_BASE_PATH . "/layout/");
