<?php
/*ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
*/define( '_SHM_ENABLED_',  1 );
/// shortease config
require_once dirname(__FILE__).'/config.inc';
/// Enable erate ad server classes 
require_once SH_BASE_PATH.'/erate.inc';
/** Load base functions file */
require_once SH_BASE_PATH.'/base.inc';

main();

