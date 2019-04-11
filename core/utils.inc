<?php
defined( '_SHM_ENABLED_' ) or die( 'Restricted access' );


/**
 * 
 */
class Utils
{
	public static function checkSQLParameter ($sql_paramater){
		$start_with_arr = ["'", "or ","and "];
		foreach ($start_with_arr as $key => $start_with) {
			$start_pos = stripos(ltrim($sql_paramater), $start_with);
			if ($start_pos >= 0 && $start_pos <= 2) $sql_paramater = str_ireplace($start_with, '', $sql_paramater);
		}
		return $sql_paramater;
	}
}