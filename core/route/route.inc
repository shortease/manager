<?php
defined( '_SHM_ENABLED_' ) or die( 'Restricted access' );

class Route {
	public static function includeComponent(){
		$com = Request::getWord("com");
		if (!$com){
			$com = "dashboard";
		}

		$target_path = SH_COMPONENT_PATH . $com."/".$com.".inc";
		require_once($target_path);
	}

	public static function getLayout(){ 
		$com = Request::getWord("com");
		$page= Request::getWord("page");
		$task= Request::getWord("task");

		/// redirect to login if not logged
		if (!Factory::getUser()->isLoggedIn()) {
			$page = "login";
		}

		if (!$page) {
			require_once ("index.inc");
		} else {
			if (!$task) $task = $page;
			$target_path = SH_COMPONENT_PATH . $page."/".$task.".inc";
			require_once($target_path);
		}
	}
}