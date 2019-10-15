<?php
defined( '_SHM_ENABLED_' ) or die( 'Restricted access' );

class Route {
	public static function includeComponent(){
		$com = Request::getWord("com");
		if (!$com){
			$com = "dashboard";
		}
		$langPath = SH_COMPONENT_PATH . DS . $com;
		$langPath .= DS . LANG_FOLDER_NAME . DS . Factory::getLang()->getLang() . ".ini";
		$lang = Factory::getLang();
		$lang->rmLastLangFile();
		$lang->loadLangFile($langPath);
		$trnsl = "[]";
		if (isset($lang->getTranslations()[0])) $trnsl = json_encode($lang->getTranslations()[0]);
		echo ("<script> var t =  " . $trnsl . "; </script>");
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
			$langPath = SH_LAYOUT_PATH . DS . LANG_FOLDER_NAME . DS . Factory::getLang()->getLang() . ".ini";
	 		$lang = Factory::getLang();
	 		$lang->loadLangFile($langPath);
	 		$GLOBALS["layout_translations"] = $lang->getTranslations()[0];
			require_once ("index.inc");
		} else {
			if (!$task) $task = $page;
			$langPath = SH_COMPONENT_PATH . DS . $page;
			$langPath .= DS . LANG_FOLDER_NAME . DS . Factory::getLang()->getLang() . ".ini";
			$lang = Factory::getLang();
			$lang->rmLastLangFile();
			$lang = Factory::getLang();
			$lang->loadLangFile($langPath);
	 		$GLOBALS["translations"] = $lang->getTranslations()[0];
			$target_path = SH_COMPONENT_PATH . $page."/".$task.".inc";
			require_once($target_path);
		}
	}
}