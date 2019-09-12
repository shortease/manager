<?php
defined( '_SHM_ENABLED_' ) or die( 'Restricted access' );

$action = Request::getString("action");

if ($action == 'channels') 
	require_once("channels.inc");
else if ($action == 'tools') 
	require_once("tools.inc");